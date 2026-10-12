import Registration from '../models/Registration.js';
import SubEvent from '../models/SubEvent.js';
import { isRegistrationOpen, getSettings, registrationModeOf } from '../services/settingsService.js';
import GlobalUser from '../models/GlobalUser.js';
import { finalizeIfReady, readyToFinalize } from '../services/teamService.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { clientMessage } from '../utils/errors.js';

const MAX_MEMBERS = 10;
const REINVITE_COOLDOWN_MS = 60 * 60 * 1000; // after a DECLINE (not after an expiry)
const MAX_INVITES_PER_PERSON = 3;

const reinviteAt = (m) => (m.status === 'REJECTED' && !m.expired && m.respondedAt)
    ? new Date(new Date(m.respondedAt).getTime() + REINVITE_COOLDOWN_MS) : null;
const CI = { locale: 'en', strength: 2 };

// One request at a time per EVENT for everything that decides who is on which team (register, invite, accept, finalize).
// The "is this player already on another team for this event?" check is check-then-write, so without this two leaders
// adding the same teammate (or a teammate accepting two invites) at the same instant could both pass it and leave one
// person on two final teams. The API runs as a single instance (Render), so an in-process queue is enough; the volume is
// tiny (a college fest), so serialising per event costs nothing.
const eventLocks = new Map();
const withEventLock = async (key, fn) => {
    const prev = eventLocks.get(key) || Promise.resolve();
    let release;
    const mine = new Promise(r => { release = r; });
    const tail = prev.then(() => mine);
    eventLocks.set(key, tail);
    await prev;
    try {
        return await fn();
    } finally {
        release();
        if (eventLocks.get(key) === tail) eventLocks.delete(key);
    }
};
const eventKey = (title) => String(title || '').trim().toLowerCase();

// Wraps the handlers that take a registrationId: finds the registration's event, then runs the handler under that event's lock.
const lockedByRegistration = (handler) => async (req, res) => {
    try {
        const id = req.body?.registrationId;
        const reg = (typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id))
            ? await Registration.findById(id).select('eventTitle').lean() : null;
        if (!reg) return handler(req, res); // the handler answers the 400/404 itself
        return await withEventLock(eventKey(reg.eventTitle), () => handler(req, res));
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Escapes regex metacharacters so user-supplied search text is matched
// literally instead of being interpreted as a (potentially catastrophic) pattern.
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Serialises submissions per (event, leader): the duplicate check below is check-then-insert, so
// a double-click / two tabs / a scripted burst could otherwise slip several identical registrations
// past it. The API runs as a single instance, so an in-process lock is sufficient.
const inFlight = new Set();

// A teammate must accept within 24h of being added, otherwise they are removed from the team (slot freed).
export const INVITE_TTL_MS = 24 * 60 * 60 * 1000;
let lastSweep = 0;
export const expireStaleInvites = async (force = false) => {
    if (!force && Date.now() - lastSweep < 30 * 1000) return;
    lastSweep = Date.now();
    const cutoff = new Date(Date.now() - INVITE_TTL_MS);
    const set = { 'm.status': 'REJECTED', 'm.expired': true, 'm.respondedAt': new Date() };
    // invites that carry their own timestamp
    await Registration.updateMany(
        { status: { $ne: 'CANCELLED' }, members: { $elemMatch: { status: 'PENDING', invitedAt: { $lt: cutoff } } } },
        { $set: set },
        { arrayFilters: [{ 'm.status': 'PENDING', 'm.invitedAt': { $lt: cutoff } }] }
    );
    // older pending invites without one: fall back to when the registration was created
    await Registration.updateMany(
        { status: { $ne: 'CANCELLED' }, createdAt: { $lt: cutoff }, members: { $elemMatch: { status: 'PENDING', invitedAt: { $exists: false } } } },
        { $set: set },
        { arrayFilters: [{ 'm.status': 'PENDING', 'm.invitedAt': { $exists: false } }] }
    );
};

// Create a new event registration
export const createRegistration = async (req, res) => {
    const lockKey = `${String(req.body?.eventTitle || '').trim().toLowerCase()}|${req.participantAddovediId}`;
    if (inFlight.has(lockKey)) {
        return res.status(429).json({ message: 'Your registration is already being processed. Please wait a moment.' });
    }
    inFlight.add(lockKey);
    try {
        return await withEventLock(eventKey(req.body?.eventTitle), () => createRegistrationLocked(req, res));
    } finally {
        inFlight.delete(lockKey);
    }
};

const createRegistrationLocked = async (req, res) => {
    try {
        if (!(await isRegistrationOpen())) {
            const mode = registrationModeOf(await getSettings());
            return res.status(403).json({ code: 'REGISTRATION_CLOSED', message: mode === 'closed' ? 'Registration is closed.' : 'Registration is starting soon. It has not opened yet.' });
        }

        const leaderAccount = await GlobalUser.findOne({ addovediId: String(req.participantAddovediId).toUpperCase() }).lean();
        const profileFields = ['gender', 'dob', 'college', 'department', 'year', 'state', 'city', 'emergencyContact'];
        if (!leaderAccount || profileFields.some(f => !String(leaderAccount[f] || '').trim())) {
            return res.status(403).json({ code: 'PROFILE_INCOMPLETE', message: 'Please complete your profile in Player HQ before registering for events.' });
        }

        const { eventTitle, teamName, teamSize, members } = req.body;

        if (typeof eventTitle !== 'string' || !eventTitle.trim() || typeof teamName !== 'string' || !teamName.trim()) {
            return res.status(400).json({ message: 'Event and team name are required.' });
        }
        if (eventTitle.length > 200) {
            return res.status(400).json({ message: 'That event name is invalid.' });
        }
        if (teamName.trim().length > 100) {
            return res.status(400).json({ message: 'Team name must be at most 100 characters.' });
        }

        // Identity comes from the logged-in account, never from the request body: a client used to be able to send any
        // leader name / phone / email (and an "Unstop reference") that the organisers then saw as fact. The leader is
        // always the caller, so there is nothing for them to spoof.
        const leaderUID = leaderAccount.addovediId;
        const leaderName = leaderAccount.name;
        const leaderPhone = leaderAccount.phone;
        const userEmail = leaderAccount.email;

        if (members !== undefined && members !== null && !Array.isArray(members)) {
            return res.status(400).json({ message: 'Team members must be a list.' });
        }
        const memberList = Array.isArray(members) ? members : [];
        if (memberList.length > MAX_MEMBERS) {
            return res.status(400).json({ message: `A team can have at most ${MAX_MEMBERS + 1} members.` });
        }
        // A blank or malformed teammate row is not a teammate: every listed member needs an Addovedi ID.
        if (memberList.some(m => !m || typeof m !== 'object' || typeof m.uid !== 'string' || !m.uid.trim() || m.uid.length > 50
            || (m.name !== undefined && m.name !== null && typeof m.name !== 'string'))) {
            return res.status(400).json({ message: 'Every team member needs an Addovedi ID. Fill in the blank teammate ID(s) or reduce the team size.' });
        }

        // The event must exist. Previously any title was accepted (and got a Team ID), so junk events with junk team sizes
        // landed in the organisers' lists and exports.
        const eventDoc = await SubEvent.findOne({ title: eventTitle.trim() })
            .collation(CI)
            .select('title categoryTitle minTeam maxTeam');
        if (!eventDoc) {
            return res.status(404).json({ message: 'That event does not exist.' });
        }
        const actualSize = 1 + memberList.length;
        const claimedSize = Number(teamSize);
        const { minTeam, maxTeam } = eventDoc;
        if (!Number.isInteger(claimedSize) || actualSize < minTeam || actualSize > maxTeam || claimedSize !== actualSize) {
            const range = minTeam === maxTeam ? `exactly ${minTeam}` : `${minTeam} to ${maxTeam}`;
            return res.status(400).json({ message: `This event needs ${range} team member${maxTeam === 1 ? '' : 's'} (including the leader). You entered ${actualSize}.` });
        }
        const eventName = eventDoc.title;

        // Every Addovedi ID on the team (leader + members) must belong to a
        // real, registered participant account — prevents made-up/garbage IDs
        // from being entered as team members.
        const memberUidList = memberList.map(m => m.uid.trim());
        const allUids = [leaderUID.trim(), ...memberUidList];
        if (new Set(allUids.map(u => u.toUpperCase())).size !== allUids.length) {
            return res.status(400).json({ message: 'The same Addovedi ID is listed more than once in this team.' });
        }
        const foundAccounts = await GlobalUser.find({
            addovediId: { $in: allUids.map(u => u.toUpperCase()) }
        }).select('addovediId');
        const foundSet = new Set(foundAccounts.map(a => a.addovediId));
        const missingUid = allUids.find(u => !foundSet.has(u.toUpperCase()));
        if (missingUid) {
            return res.status(400).json({ message: `Addovedi ID "${missingUid.toUpperCase()}" was not found. Every team member must have completed Addovedi sign-up first.` });
        }

        // Check if any incoming UID (leader or member) is already registered
        // for this event, via a single indexed query rather than fetching
        // every existing registration for the event and scanning it in JS —
        // that approach gets slower with every registration added and would
        // eventually block the server outright at high volume. The compound
        // (eventTitle, leaderUID) / (eventTitle, members.uid) indexes with a
        // case-insensitive collation (see Registration.js) make this an
        // O(log n) lookup regardless of how large the event's roster gets.
        await expireStaleInvites();
        const conflict = await Registration.findOne({
            eventTitle: eventName,
            status: { $ne: 'CANCELLED' },
            $or: [
                { leaderUID: { $in: allUids } },
                { members: { $elemMatch: { uid: { $in: allUids }, status: { $ne: 'REJECTED' } } } }
            ]
        }).collation({ locale: 'en', strength: 2 });

        if (conflict) {
            const conflictUids = [
                (conflict.leaderUID || '').toLowerCase(),
                ...(Array.isArray(conflict.members) ? conflict.members.filter(m => m?.status !== 'REJECTED').map(m => (m?.uid || '').toLowerCase()) : [])
            ];
            const duplicateUid = allUids.find(u => conflictUids.includes(u.toLowerCase()));
            return res.status(400).json({
                message: `Player with Addovedi ID "${(duplicateUid || '').toUpperCase()}" is already registered under team "${conflict.teamName}" for "${eventName}". Multiple team enlistments for the same event are forbidden.`
            });
        }

        const registration = new Registration({
            eventTitle: eventName,
            categoryTitle: eventDoc.categoryTitle,
            teamName: teamName.trim(),
            leaderName,
            leaderUID,
            leaderPhone,
            teamSize: actualSize,
            // Only the two known fields, length-capped — never store arbitrary client objects.
            members: memberList.map(m => ({ name: String(m.name || '').slice(0, 100), uid: m.uid.trim().toUpperCase(), status: 'PENDING' })),
            userEmail
            // status / unstopRefId are intentionally never taken from the client — a registration always starts
            // PENDING_UNSTOP_VERIFICATION (model default) and only an authenticated admin can verify it or record the Unstop reference.
        });

        await registration.save();
        await finalizeIfReady(registration); // solo entries are final straight away
        await recordAuditLog(req, { action: 'PARTICIPANT_REGISTERED', username: leaderUID, details: { event: eventName, teamName: registration.teamName, teamSize: actualSize } });
        return res.status(201).json({ message: 'Registration successful', registration });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(400).json({ message: 'You already have a registration for this event.' });
        }
        console.error('Registration Error:', err);
        return res.status(500).json({ message: 'Server error creating registration' });
    }
};

// Fetch all registrations (with optional search query)
export const getAllRegistrations = async (req, res) => {
    try {
        const { search, eventTitle, categoryTitle } = req.query;
        let filter = {};

        if (eventTitle && typeof eventTitle === 'string') {
            filter.eventTitle = eventTitle;
        }
        if (categoryTitle && typeof categoryTitle === 'string') {
            filter.categoryTitle = categoryTitle;
        }
        if (search && typeof search === 'string') {
            const regex = new RegExp(escapeRegExp(search.slice(0, 100)), 'i');
            filter.$or = [
                { leaderName: regex },
                { leaderUID: regex },
                { teamName: regex },
                { leaderPhone: regex },
                { eventTitle: regex }
            ];
        }

        const registrations = await Registration.find(filter).sort({ createdAt: -1 });
        return res.json(registrations);
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};

// Get registration stats and event-wise breakdown
export const getRegistrationStats = async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        
        // Group by event
        const eventBreakdown = {};
        // Group by participant (leaderUID)
        const participantMap = {};

        registrations.forEach(reg => {
            // Event breakdown
            if (!eventBreakdown[reg.eventTitle]) {
                eventBreakdown[reg.eventTitle] = {
                    eventTitle: reg.eventTitle,
                    categoryTitle: reg.categoryTitle,
                    count: 0,
                    registrations: []
                };
            }
            eventBreakdown[reg.eventTitle].count += 1;
            eventBreakdown[reg.eventTitle].registrations.push(reg);

            // Participant breakdown (history of events per person)
            const uidKey = reg.leaderUID.toLowerCase();
            if (!participantMap[uidKey]) {
                participantMap[uidKey] = {
                    leaderUID: reg.leaderUID,
                    leaderName: reg.leaderName,
                    leaderPhone: reg.leaderPhone,
                    registeredEvents: []
                };
            }
            participantMap[uidKey].registeredEvents.push({
                registrationId: reg._id,
                eventTitle: reg.eventTitle,
                categoryTitle: reg.categoryTitle,
                teamName: reg.teamName,
                teamSize: reg.teamSize,
                members: reg.members,
                createdAt: reg.createdAt
            });
        });

        return res.json({
            totalRegistrations: registrations.length,
            uniqueParticipantsCount: Object.keys(participantMap).length,
            eventBreakdown: Object.values(eventBreakdown),
            participantHistory: Object.values(participantMap)
        });
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};

// Delete a registration
export const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const reg = await Registration.findByIdAndDelete(id);
        if (!reg) {
            return res.status(404).json({ message: 'Registration record not found' });
        }
        return res.json({ message: 'Registration record deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};

// Cancel a registration (User initiated). Requires the leader's phone number
// in addition to their Addovedi ID + event title, so cancelling someone else's
// registration can't be done with just their publicly-guessable team ID.
// This is a soft-cancel (status flips to CANCELLED) rather than a hard delete,
// so the record is preserved for audit purposes and the UID/slot frees up for
// re-registration (createRegistration excludes CANCELLED records already).
export const cancelRegistration = async (req, res) => {
    try {
        const { eventTitle } = req.body;
        if (typeof eventTitle !== 'string' || !eventTitle.trim()) {
            return res.status(400).json({ message: 'eventTitle is required' });
        }

        // Ownership comes from the participant's login token, not from caller-supplied
        // details: only the team leader's own account can cancel their registration.
        const verified = await Registration.exists({
            eventTitle: eventTitle.trim(),
            leaderUID: req.participantAddovediId,
            status: 'VERIFIED'
        }).collation({ locale: 'en', strength: 2 });
        if (verified) {
            return res.status(409).json({ message: 'This registration is verified by the organisers and can no longer be cancelled. Contact the organisers if something is wrong.' });
        }

        const result = await Registration.updateMany(
            {
                eventTitle: eventTitle.trim(),
                leaderUID: req.participantAddovediId,
                status: { $ne: 'CANCELLED' }
            },
            { $set: { status: 'CANCELLED' } }
        ).collation({ locale: 'en', strength: 2 });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No matching registration found for your account' });
        }

        await recordAuditLog(req, { action: 'PARTICIPANT_CANCELLED', username: req.participantAddovediId, details: { event: eventTitle.trim().slice(0, 200) } });
        return res.json({ message: 'Registration cancelled successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error cancelling registration' });
    }
};

// Returns every registration the logged-in participant is part of, as leader OR as a team
// member who hasn't declined, so a teammate sees (and can accept/decline) their own invite.
// Requires the participant's own login: it now includes teammates' names and consent status
// (visible to the leader only), which must not be readable by anyone who guesses an Addovedi ID.
export const getMyRegistrations = async (req, res) => {
    try {
        const uid = req.participantAddovediId;
        if (String(req.params.addovediId || '').trim().toUpperCase() !== uid.toUpperCase()) {
            return res.status(403).json({ message: 'You can only view your own registrations.' });
        }

        await expireStaleInvites();
        const regs = await Registration.find({
            status: { $ne: 'CANCELLED' },
            $or: [
                { leaderUID: uid },
                { members: { $elemMatch: { uid, status: { $ne: 'REJECTED' } } } }
            ]
        })
            .collation({ locale: 'en', strength: 2 })
            .select('eventTitle categoryTitle teamName leaderUID leaderName status unstopRefId teamSize teamId members createdAt')
            .sort({ createdAt: -1 });

        const result = regs.map(r => {
            const isLeader = r.leaderUID.toLowerCase() === uid.toLowerCase();
            const mine = isLeader ? null : r.members.find(m => (m.uid || '').toLowerCase() === uid.toLowerCase());
            return {
                registrationId: r._id,
                eventTitle: r.eventTitle,
                categoryTitle: r.categoryTitle,
                teamName: r.teamName,
                status: r.status,
                unstopRefId: r.unstopRefId,
                teamSize: r.teamSize,
                teamId: r.teamId || null,
                createdAt: r.createdAt,
                isLeader,
                leaderName: r.leaderName,
                leaderUID: r.leaderUID,
                myStatus: isLeader ? 'LEADER' : (mine?.status || 'ACCEPTED'),
                // Only the leader sees who accepted / is pending / declined.
                members: isLeader ? r.members.map(m => ({ name: m.name, uid: m.uid, status: m.status || 'ACCEPTED', expired: m.expired === true, inviteCount: m.inviteCount || 1, canReinviteAt: reinviteAt(m) })) : undefined,
                inviteExpiresAt: !isLeader && mine?.status === 'PENDING' ? new Date(new Date(mine.invitedAt || r.createdAt).getTime() + INVITE_TTL_MS) : undefined
            };
        });

        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// A teammate accepts or declines (or later leaves) a team they were added to.
// Frozen once admin has VERIFIED the registration against Unstop — after that the roster is
// what the organisers confirmed, so changes go through the admin.
const respondToTeamInviteImpl = async (req, res) => {
    try {
        const { registrationId, accept } = req.body;
        if (typeof registrationId !== 'string' || typeof accept !== 'boolean') {
            return res.status(400).json({ message: 'registrationId and accept (true/false) are required.' });
        }
        if (!/^[a-f0-9]{24}$/i.test(registrationId)) {
            return res.status(400).json({ message: 'Invalid registration.' });
        }
        await expireStaleInvites(true);
        const uid = req.participantAddovediId;
        const reg = await Registration.findOne({
            _id: registrationId,
            status: { $ne: 'CANCELLED' },
            members: { $elemMatch: { uid } }
        }).collation({ locale: 'en', strength: 2 });
        if (!reg) {
            return res.status(404).json({ message: 'No active team invite found for your account.' });
        }
        // Once admin has verified the team (after the Unstop payment) nothing can change for anyone.
        if (reg.status === 'VERIFIED') {
            return res.status(409).json({ message: 'This registration is verified by the organisers and can no longer be changed.' });
        }
        const member = reg.members.find(m => (m.uid || '').toLowerCase() === uid.toLowerCase());
        // Accepting is final: an accepted teammate cannot leave. Declining is final too.
        if (member.status === 'ACCEPTED') {
            return res.status(409).json({ message: 'You have already joined this team. Accepting is final and cannot be undone.' });
        }
        if (member.status === 'REJECTED') {
            return res.status(409).json({ message: member.expired ? 'This invite expired after 24 hours. Ask the team leader to add you again.' : 'You already declined this team. Ask the team leader to add you again.' });
        }
        if (accept) {
            // Accepting is final, so make sure this player has not already joined (or leads) another team for the same event,
            // e.g. two leaders added them before either invite was answered.
            const other = await Registration.findOne({
                _id: { $ne: reg._id },
                eventTitle: reg.eventTitle,
                status: { $ne: 'CANCELLED' },
                $or: [{ leaderUID: uid }, { members: { $elemMatch: { uid, status: { $nin: ['PENDING', 'REJECTED'] } } } }]
            }).collation({ locale: 'en', strength: 2 }).select('teamName').lean();
            if (other) {
                return res.status(409).json({ message: `You are already on team "${other.teamName}" for this event, so you cannot join another. Decline this invite.` });
            }
        }
        member.status = accept ? 'ACCEPTED' : 'REJECTED';
        member.respondedAt = new Date();
        await reg.save();
        if (accept) await finalizeIfReady(reg);
        return res.json({ message: accept ? 'You joined the team.' : 'You declined the team.', myStatus: member.status });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update status or Unstop Ref ID (Admin or User confirmation)
export const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, unstopRefId } = req.body;

        const reg = await Registration.findById(id);
        if (!reg) {
            return res.status(404).json({ message: 'Registration record not found' });
        }

        if (status && !['PENDING_UNSTOP_VERIFICATION', 'VERIFIED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        if (status === 'VERIFIED' && !reg.teamId) {
            return res.status(409).json({ message: 'This team is not final yet (no Team ID), so it cannot be verified.' });
        }
        if (status) reg.status = status;
        if (unstopRefId !== undefined) reg.unstopRefId = String(unstopRefId).slice(0, 200);

        await reg.save();
        return res.json({ message: 'Registration updated successfully', registration: reg });
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};


// ── Leader tools while the team is not final ──
const loadLeaderTeam = async (req, res) => {
    const { registrationId } = req.body || {};
    if (typeof registrationId !== 'string' || !/^[a-f0-9]{24}$/i.test(registrationId)) {
        res.status(400).json({ message: 'Invalid registration.' });
        return null;
    }
    await expireStaleInvites(true);
    const reg = await Registration.findOne({ _id: registrationId, leaderUID: req.participantAddovediId, status: { $ne: 'CANCELLED' } })
        .collation({ locale: 'en', strength: 2 });
    if (!reg) { res.status(404).json({ message: 'Registration not found, or you are not its team leader.' }); return null; }
    if (reg.status === 'VERIFIED' || reg.teamId) {
        res.status(409).json({ message: 'This team is final and can no longer be changed.' });
        return null;
    }
    return reg;
};

// Invite someone (or re-invite a teammate who declined / let the invite expire).
const inviteMemberImpl = async (req, res) => {
    try {
        if (!(await isRegistrationOpen())) {
            return res.status(403).json({ code: 'REGISTRATION_CLOSED', message: 'Registration is not open, so new invites cannot be sent.' });
        }
        const reg = await loadLeaderTeam(req, res);
        if (!reg) return;
        const uid = String(req.body?.uid || '').trim().toUpperCase();
        if (!uid || uid.length > 50) return res.status(400).json({ message: 'Enter a valid Addovedi ID.' });
        if (uid === reg.leaderUID.toUpperCase()) return res.status(400).json({ message: 'You are already the team leader.' });

        const existing = reg.members.find(m => (m.uid || '').toUpperCase() === uid);
        if (existing && existing.status !== 'REJECTED') {
            return res.status(400).json({ message: 'This player is already on your team.' });
        }
        if (existing) {
            if ((existing.inviteCount || 1) >= MAX_INVITES_PER_PERSON) {
                return res.status(400).json({ message: `You have already invited this player ${MAX_INVITES_PER_PERSON} times.` });
            }
            const until = reinviteAt(existing);
            if (until && until > new Date()) {
                return res.status(400).json({ message: `This player declined. You can invite them again after ${until.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.` });
            }
        }
        const live = reg.members.filter(m => m.status !== 'REJECTED').length;
        if (live + 1 >= (reg.teamSize || 1)) {
            return res.status(400).json({ message: 'Your team is already full.' });
        }
        const player = await GlobalUser.findOne({ addovediId: uid }).select('addovediId name').lean();
        if (!player) return res.status(400).json({ message: `No player found with Addovedi ID "${uid}".` });

        const clash = await Registration.findOne({
            _id: { $ne: reg._id },
            eventTitle: reg.eventTitle,
            status: { $ne: 'CANCELLED' },
            $or: [{ leaderUID: uid }, { members: { $elemMatch: { uid, status: { $ne: 'REJECTED' } } } }]
        }).collation({ locale: 'en', strength: 2 });
        if (clash) return res.status(400).json({ message: `${uid} is already registered under team "${clash.teamName}" for this event.` });

        if (existing) {
            existing.status = 'PENDING';
            existing.expired = false;
            existing.invitedAt = new Date();
            existing.respondedAt = undefined;
            existing.inviteCount = (existing.inviteCount || 1) + 1;
        } else {
            reg.members.push({ name: player.name, uid: player.addovediId, status: 'PENDING', invitedAt: new Date(), inviteCount: 1 });
        }
        await reg.save();
        return res.json({ message: 'Invite sent.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Withdraw a still-pending invite (frees the slot to invite someone else).
const uninviteMemberImpl = async (req, res) => {
    try {
        const reg = await loadLeaderTeam(req, res);
        if (!reg) return;
        const uid = String(req.body?.uid || '').trim().toUpperCase();
        const m = reg.members.find(x => (x.uid || '').toUpperCase() === uid);
        if (!m || m.status !== 'PENDING') return res.status(400).json({ message: 'Only a pending invite can be withdrawn.' });
        m.status = 'REJECTED';
        m.expired = true; // shown as withdrawn/expired, no cooldown
        m.respondedAt = new Date();
        await reg.save();
        return res.json({ message: 'Invite withdrawn.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Declined/expired teammates and no one pending: continue with the players who accepted (if the event allows that size).
const continueSmallerTeamImpl = async (req, res) => {
    try {
        const reg = await loadLeaderTeam(req, res);
        if (!reg) return;
        if (reg.members.some(m => m.status === 'PENDING')) {
            return res.status(400).json({ message: 'Wait for pending invites to be answered (or withdraw them) first.' });
        }
        const accepted = reg.members.filter(m => (m.status || 'ACCEPTED') === 'ACCEPTED').length;
        const size = accepted + 1;
        const eventDoc = await SubEvent.findOne({ title: reg.eventTitle }).collation({ locale: 'en', strength: 2 }).select('minTeam');
        if (eventDoc && size < eventDoc.minTeam) {
            return res.status(400).json({ message: `This event needs at least ${eventDoc.minTeam} players. You have ${size}.` });
        }
        reg.teamSize = size;
        const wasReady = readyToFinalize(reg);
        if (wasReady) await reg.save();
        if (!wasReady) return res.status(400).json({ message: 'Team cannot be finalised yet.' });
        await finalizeIfReady(reg);
        return res.json({ message: 'Team finalised.', teamId: reg.teamId });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Each of these decides team membership, so each runs under its event's lock (see withEventLock).
export const respondToTeamInvite = lockedByRegistration(respondToTeamInviteImpl);
export const inviteMember = lockedByRegistration(inviteMemberImpl);
export const uninviteMember = lockedByRegistration(uninviteMemberImpl);
export const continueSmallerTeam = lockedByRegistration(continueSmallerTeamImpl);
