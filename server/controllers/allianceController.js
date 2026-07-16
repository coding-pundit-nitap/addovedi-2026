import * as allianceService from '../services/allianceService.js';

export const getAlliances = async (req, res) => {
    try {
        const alliances = await allianceService.getAlliancesList();
        return res.json(alliances);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const createAlliance = async (req, res) => {
    try {
        const alliance = await allianceService.createAlliance(req.body);
        return res.status(201).json(alliance);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateAlliance = async (req, res) => {
    try {
        const alliance = await allianceService.updateAlliance(req.params.id, req.body);
        if (!alliance) return res.status(404).json({ message: 'Alliance sponsor not found' });
        return res.json(alliance);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteAlliance = async (req, res) => {
    try {
        await allianceService.deleteAlliance(req.params.id);
        return res.json({ message: 'Alliance deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
