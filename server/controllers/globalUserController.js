import * as globalUserService from '../services/globalUserService.js';
import { verifyTurnstileToken } from '../utils/turnstile.js';

export const signup = async (req, res) => {
    try {
        const { turnstileToken, ...payload } = req.body;
        const captchaOk = await verifyTurnstileToken(turnstileToken, req.ip);
        if (!captchaOk) {
            return res.status(400).json({ message: 'CAPTCHA verification failed. Please try again.' });
        }
        const user = await globalUserService.signup(payload);
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
        const user = await globalUserService.updateProfile(req.params.id, req.participantId, req.body);
        return res.json(user);
    } catch (err) {
        const status = err.message === 'Not authorized to update this profile.' ? 403 : 400;
        return res.status(status).json({ message: err.message });
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
