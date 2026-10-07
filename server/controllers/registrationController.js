import Registration from '../models/Registration.js';
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

        // Collect all incoming UIDs (leader + all team members)
        const incomingUids = [
            leaderUID.trim().toLowerCase(),
            ...(Array.isArray(members) ? members.map(m => (m?.uid || '').trim().toLowerCase()) : [])
        ].filter(Boolean);

        // Check if any incoming UID is already registered in this event as a leader or team member (excluding CANCELLED)
        const existingRegistrations = await Registration.find({ eventTitle: eventTitle.trim(), status: { $ne: 'CANCELLED' } });
        for (const reg of existingRegistrations) {
            const existingUids = [
                (reg.leaderUID || '').toLowerCase(),
                ...(Array.isArray(reg.members) ? reg.members.map(m => (m?.uid || '').toLowerCase()) : [])
            ].filter(Boolean);

            const duplicateUid = incomingUids.find(uid => existingUids.includes(uid));
            if (duplicateUid) {
                return res.status(400).json({ 
                    message: `Player with Addovedi ID "${duplicateUid.toUpperCase()}" is already registered under team "${reg.teamName}" for "${eventTitle}". Multiple team enlistments for the same event are forbidden.` 
                });
            }
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
