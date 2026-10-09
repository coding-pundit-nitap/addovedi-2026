import Registration from '../models/Registration.js';
import SubEvent from '../models/SubEvent.js';
import { isRegistrationOpen } from '../services/settingsService.js';
import GlobalUser from '../models/GlobalUser.js';
import { isValidEmail, isValidPhone } from '../utils/validators.js';

const REQUIRED_STRING_FIELDS = ['eventTitle', 'categoryTitle', 'teamName', 'leaderName', 'leaderUID', 'leaderPhone'];

// Escapes regex metacharacters so user-supplied search text is matched
// literally instead of being interpreted as a (potentially catastrophic) pattern.
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Create a new event registration
export const createRegistration = async (req, res) => {
    try {
        if (!(await isRegistrationOpen())) {
            return res.status(403).json({ code: 'REGISTRATION_CLOSED', message: 'Registration is starting soon. It has not opened yet.' });
        }

        const { eventTitle, categoryTitle, teamName, leaderName, leaderUID, leaderPhone, teamSize, members, userEmail, unstopRefId } = req.body;

        if (REQUIRED_STRING_FIELDS.some(field => typeof req.body[field] !== 'string' || !req.body[field].trim())) {
            return res.status(400).json({ message: 'All required fields (eventTitle, categoryTitle, teamName, leaderName, leaderUID, leaderPhone) must be provided.' });
        }

        if (!isValidPhone(leaderPhone)) {
            return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number for the team leader.' });
        }
        if (userEmail && !isValidEmail(userEmail)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        // A blank teammate row is not a teammate: every listed member needs an Addovedi ID.
        if (Array.isArray(members) && members.some(m => !(m?.uid || '').trim())) {
            return res.status(400).json({ message: 'Every team member needs an Addovedi ID. Fill in the blank teammate ID(s) or reduce the team size.' });
        }

        // Enforce the admin-configured team size for this event (leader included).
        // Events that only exist in the client's static fallback have no DB record, so no limit applies.
        const eventDoc = await SubEvent.findOne({ title: eventTitle.trim() })
            .collation({ locale: 'en', strength: 2 })
            .select('minTeam maxTeam');
        if (eventDoc) {
            const actualSize = 1 + (Array.isArray(members) ? members.length : 0);
            const { minTeam, maxTeam } = eventDoc;
            if (actualSize < minTeam || actualSize > maxTeam || Number(teamSize) !== actualSize) {
                const range = minTeam === maxTeam ? `exactly ${minTeam}` : `${minTeam} to ${maxTeam}`;
                return res.status(400).json({ message: `This event needs ${range} team member${maxTeam === 1 ? '' : 's'} (including the leader). You entered ${actualSize}.` });
            }
        }

        // Every Addovedi ID on the team (leader + members) must belong to a
        // real, registered participant account — prevents made-up/garbage IDs
        // from being entered as team members.
        const memberUidList = Array.isArray(members)
            ? members.map(m => (m?.uid || '').trim()).filter(Boolean)
            : [];
        const allUids = [leaderUID.trim(), ...memberUidList];
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
        const conflict = await Registration.findOne({
            eventTitle: eventTitle.trim(),
            status: { $ne: 'CANCELLED' },
            $or: [
                { leaderUID: { $in: allUids } },
                { 'members.uid': { $in: allUids } }
            ]
        }).collation({ locale: 'en', strength: 2 });

        if (conflict) {
            const conflictUids = [
                (conflict.leaderUID || '').toLowerCase(),
                ...(Array.isArray(conflict.members) ? conflict.members.map(m => (m?.uid || '').toLowerCase()) : [])
            ];
            const duplicateUid = allUids.find(u => conflictUids.includes(u.toLowerCase()));
            return res.status(400).json({
                message: `Player with Addovedi ID "${(duplicateUid || '').toUpperCase()}" is already registered under team "${conflict.teamName}" for "${eventTitle}". Multiple team enlistments for the same event are forbidden.`
            });
        }

        const registration = new Registration({
            eventTitle: eventTitle.trim(),
            categoryTitle: categoryTitle.trim(),
            teamName: teamName.trim(),
            leaderName: leaderName.trim(),
            leaderUID: leaderUID.trim(),
            leaderPhone: leaderPhone.trim(),
            teamSize: Number(teamSize) || 1,
            members: Array.isArray(members) ? members : [],
            userEmail: userEmail ? userEmail.trim() : '',
            unstopRefId: unstopRefId ? unstopRefId.trim() : ''
            // status is intentionally never taken from the client — it always
            // starts PENDING_UNSTOP_VERIFICATION (model default) and can only be
            // advanced to VERIFIED by an authenticated admin via updateRegistrationStatus.
        });

        await registration.save();
        return res.status(201).json({ message: 'Registration successful', registration });
    } catch (err) {
        console.error('Registration Error:', err);
        return res.status(500).json({ message: err.message || 'Server error creating registration' });
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
        return res.status(500).json({ message: err.message });
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
        return res.status(500).json({ message: err.message });
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
        return res.status(500).json({ message: err.message });
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
        const { eventTitle, leaderUID, leaderPhone } = req.body;
        if (
            typeof eventTitle !== 'string' || !eventTitle.trim() ||
            typeof leaderUID !== 'string' || !leaderUID.trim() ||
            typeof leaderPhone !== 'string' || !leaderPhone.trim()
        ) {
            return res.status(400).json({ message: 'eventTitle, leaderUID and leaderPhone are required' });
        }

        const result = await Registration.updateMany(
            {
                eventTitle: eventTitle.trim(),
                leaderUID: leaderUID.trim(),
                leaderPhone: leaderPhone.trim(),
                status: { $ne: 'CANCELLED' }
            },
            { $set: { status: 'CANCELLED' } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No matching registration found for the provided details' });
        }

        return res.json({ message: 'Registration cancelled successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Returns every registration a given Addovedi ID is part of, as leader OR
// as a team member, across all events — so a team member who didn't
// personally submit the form can still see "yes, I'm registered for this"
// on their own account, not just the leader. Public (no auth) since
// participant accounts have no session/JWT layer; deliberately returns only
// non-sensitive fields (no phone/email, no other members' contact info).
export const getMyRegistrations = async (req, res) => {
    try {
        const { addovediId } = req.params;
        if (typeof addovediId !== 'string' || !addovediId.trim()) {
            return res.status(400).json({ message: 'Addovedi ID is required' });
        }
        const uid = addovediId.trim();

        const regs = await Registration.find({
            status: { $ne: 'CANCELLED' },
            $or: [
                { leaderUID: uid },
                { 'members.uid': uid }
            ]
        })
            .collation({ locale: 'en', strength: 2 })
            .select('eventTitle categoryTitle teamName leaderUID leaderName status unstopRefId teamSize members createdAt')
            .sort({ createdAt: -1 });

        const result = regs.map(r => ({
            eventTitle: r.eventTitle,
            categoryTitle: r.categoryTitle,
            teamName: r.teamName,
            status: r.status,
            unstopRefId: r.unstopRefId,
            teamSize: r.teamSize,
            createdAt: r.createdAt,
            isLeader: r.leaderUID.toLowerCase() === uid.toLowerCase(),
            leaderName: r.leaderName
        }));

        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
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

        if (status) reg.status = status;
        if (unstopRefId !== undefined) reg.unstopRefId = unstopRefId;

        await reg.save();
        return res.json({ message: 'Registration updated successfully', registration: reg });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
