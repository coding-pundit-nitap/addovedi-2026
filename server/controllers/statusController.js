import * as statusService from '../services/statusService.js';
import { clientMessage } from '../utils/errors.js';

export const getStatus = async (req, res) => {
    try {
        const data = await statusService.getStatusSettings();
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const data = await statusService.updateStatusSettings(req.body);
        return res.json(data);
    } catch (err) {
        return res.status(400).json({ message: clientMessage(err) });
    }
};
