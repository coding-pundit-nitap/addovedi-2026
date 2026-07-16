import * as statusService from '../services/statusService.js';

export const getStatus = async (req, res) => {
    try {
        const data = await statusService.getStatusSettings();
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const data = await statusService.updateStatusSettings(req.body);
        return res.json(data);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
