import * as crewService from '../services/crewService.js';

export const getCrew = async (req, res) => {
    try {
        const crew = await crewService.getCrewList();
        return res.json(crew);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const createCrew = async (req, res) => {
    try {
        const member = await crewService.createCrewMember(req.body);
        return res.status(201).json(member);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateCrew = async (req, res) => {
    try {
        const member = await crewService.updateCrewMember(req.params.id, req.body);
        if (!member) return res.status(404).json({ message: 'Crew member not found' });
        return res.json(member);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteCrew = async (req, res) => {
    try {
        await crewService.deleteCrewMember(req.params.id);
        return res.json({ message: 'Crew member deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
