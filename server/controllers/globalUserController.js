import * as globalUserService from '../services/globalUserService.js';

export const signup = async (req, res) => {
    try {
        const user = await globalUserService.signup(req.body);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await globalUserService.login(req.body);
        return res.json(user);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await globalUserService.updateProfile(req.params.id, req.body);
        return res.json(user);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const checkUid = async (req, res) => {
    try {
        const user = await globalUserService.findByAddovediId(req.params.addovediId);
        if (!user) return res.json({ exists: false });
        return res.json({ exists: true, name: user.name });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
