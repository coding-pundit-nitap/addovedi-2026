import * as globalUserService from '../services/globalUserService.js';
import { verifyTurnstileToken } from '../utils/turnstile.js';
import { recordAuditLog } from '../utils/auditLogger.js';

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

export const listPlayers = async (req, res) => {
    try {
        return res.json(await globalUserService.listPlayers());
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const player = await globalUserService.deletePlayer(req.params.id);
        await recordAuditLog(req, { action: 'DELETE_PLAYER', details: { addovediId: player.addovediId, name: player.name } });
        return res.json({ message: 'Player removed' });
    } catch (err) {
        return res.status(err.status || 400).json({ message: err.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await globalUserService.changePassword(req.participantId, currentPassword, newPassword);
        return res.json({ message: 'Password updated.', ...result });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { player, tempPassword } = await globalUserService.adminResetPassword(req.params.id);
        // The temporary password itself is never written to the audit log.
        await recordAuditLog(req, { action: 'RESET_PLAYER_PASSWORD', details: { addovediId: player.addovediId, name: player.name } });
        return res.json({ tempPassword, addovediId: player.addovediId, name: player.name });
    } catch (err) {
        return res.status(err.status || 400).json({ message: err.message });
    }
};
