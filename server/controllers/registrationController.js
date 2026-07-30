import Registration from '../models/Registration.js';

// Create a new event registration
export const createRegistration = async (req, res) => {
    try {
        const { eventTitle, categoryTitle, teamName, leaderName, leaderUID, leaderPhone, teamSize, members, userEmail } = req.body;

        if (!eventTitle || !categoryTitle || !teamName || !leaderName || !leaderUID || !leaderPhone) {
            return res.status(400).json({ message: 'All required fields (eventTitle, categoryTitle, teamName, leaderName, leaderUID, leaderPhone) must be provided.' });
        }

        // Check for existing registration for this leader & event
        const existing = await Registration.findOne({ leaderUID: leaderUID.trim(), eventTitle: eventTitle.trim() });
        if (existing) {
            return res.status(400).json({ message: `Participant with UID "${leaderUID}" is already registered for "${eventTitle}".` });
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
            userEmail: userEmail ? userEmail.trim() : ''
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

        if (eventTitle) {
            filter.eventTitle = eventTitle;
        }
        if (categoryTitle) {
            filter.categoryTitle = categoryTitle;
        }
        if (search) {
            const regex = new RegExp(search, 'i');
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
