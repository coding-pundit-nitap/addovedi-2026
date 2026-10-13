import * as globalUserService from '../services/globalUserService.js';
import { verifyTurnstileToken } from '../utils/turnstile.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Registration from '../models/Registration.js';
import { expireStaleInvites } from './registrationController.js';
import { clientMessage } from '../utils/errors.js';

export const signup = async (req, res) => {
    try {
        const { turnstileToken, ...payload } = req.body;
        const captchaOk = await verifyTurnstileToken(turnstileToken, req.ip);
        if (!captchaOk) {
            return res.status(400).json({ message: 'CAPTCHA verification failed. Please try again.' });
        }
        const user = await globalUserService.signup(payload);
        await recordAuditLog(req, { action: 'PARTICIPANT_SIGNUP', username: user.addovediId, details: {} });
        return res.status(201).json(user);
    } catch (err) {
        return res.status(400).json({ message: clientMessage(err) });
    }
};

export const login = async (req, res) => {
    try {
        const user = await globalUserService.login(req.body);
        return res.json(user);
    } catch (err) {
        // Failed sign-ins are logged against a short hash of the email (enough to spot one account being hammered, without
        // writing the address itself or anything that was typed as the password into the audit trail).
        const typed = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const ref = crypto.createHash('sha256').update(typed).digest('hex').slice(0, 12);
        await recordAuditLog(req, { action: 'PARTICIPANT_LOGIN_FAILED', username: `acct:${ref}`, details: {}, status: 'FAILED' });
        return res.status(401).json({ message: clientMessage(err) });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await globalUserService.updateProfile(req.params.id, req.participantId, req.body);
        return res.json(user);
    } catch (err) {
        const status = err.message === 'Not authorized to update this profile.' ? 403 : 400;
        return res.status(status).json({ message: clientMessage(err) });
    }
};

export const checkUid = async (req, res) => {
    try {
        const user = await globalUserService.findByAddovediId(req.params.addovediId);
        if (!user) return res.json({ exists: false });
        // Optional: is this player already in an active team for the given event? Same rule createRegistration and
        // invite enforce, so the form can warn before submit. `exclude` = the caller's own registration (re-inviting
        // someone already on your team is answered by /invite itself). Only a yes/no is returned, never the other team.
        let busy = false;
        const eventTitle = String(req.query.event || '').trim();
        if (eventTitle) {
            await expireStaleInvites();
            const uid = user.addovediId;
            const query = {
                eventTitle,
                status: { $ne: 'CANCELLED' },
                $or: [{ leaderUID: uid }, { members: { $elemMatch: { uid, status: { $ne: 'REJECTED' } } } }]
            };
            if (mongoose.isValidObjectId(req.query.exclude)) query._id = { $ne: req.query.exclude };
            busy = Boolean(await Registration.exists(query).collation({ locale: 'en', strength: 2 }));
        }
        return res.json({ exists: true, name: user.name, busy });
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};

export const listPlayers = async (req, res) => {
    try {
        return res.json(await globalUserService.listPlayers());
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const player = await globalUserService.deletePlayer(req.params.id);
        await recordAuditLog(req, { action: 'DELETE_PLAYER', details: { addovediId: player.addovediId, name: player.name } });
        return res.json({ message: 'Player removed' });
    } catch (err) {
        return res.status(err.status || 400).json({ message: clientMessage(err) });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await globalUserService.changePassword(req.participantId, currentPassword, newPassword);
        await recordAuditLog(req, { action: 'PARTICIPANT_PASSWORD_CHANGED', username: req.participantAddovediId, details: {} });
        return res.json({ message: 'Password updated.', ...result });
    } catch (err) {
        return res.status(400).json({ message: clientMessage(err) });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { player, tempPassword } = await globalUserService.adminResetPassword(req.params.id);
        // The temporary password itself is never written to the audit log.
        await recordAuditLog(req, { action: 'RESET_PLAYER_PASSWORD', details: { addovediId: player.addovediId, name: player.name } });
        return res.json({ tempPassword, addovediId: player.addovediId, name: player.name });
    } catch (err) {
        return res.status(err.status || 400).json({ message: clientMessage(err) });
    }
};

// Admin only: correct a player's account details (see adminUpdatePlayer for what can and cannot change).
export const adminUpdatePlayer = async (req, res) => {
    try {
        const { player, auditDetails } = await globalUserService.adminUpdatePlayer(req.params.id, req.body || {});
        await recordAuditLog(req, { action: 'ADMIN_PLAYER_EDITED', details: auditDetails });
        return res.json({ message: 'Player updated.', player, registrationsUpdated: auditDetails.registrationsUpdated });
    } catch (err) {
        return res.status(err.status || 400).json({ message: err.status ? err.message : clientMessage(err) });
    }
};

// The signed-in player's own account (fresh from the database).
export const getMyAccount = async (req, res) => {
    try {
        const user = await globalUserService.getMyAccount(req.participantId);
        return res.json(user);
    } catch (err) {
        return res.status(err.status || 400).json({ message: err.status ? err.message : clientMessage(err) });
    }
};
