import { authenticateAdmin, changeAdminPassword } from '../services/authService.js';
import { recordAuditLog } from '../utils/auditLogger.js';

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            await recordAuditLog(req, {
                action: 'ADMIN_LOGIN_FAILED',
                username: username || 'Unknown',
                details: { reason: 'Missing username or password' },
                status: 'FAILED'
            });
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const data = await authenticateAdmin(username, password);

        await recordAuditLog(req, {
            action: 'ADMIN_LOGIN_SUCCESS',
            username: data.username,
            details: { message: 'Admin logged into portal successfully' },
            status: 'SUCCESS'
        });

        return res.json(data);
    } catch (err) {
        await recordAuditLog(req, {
            action: 'ADMIN_LOGIN_FAILED',
            username: username || 'Unknown',
            details: { reason: err.message },
            status: 'FAILED'
        });
        return res.status(401).json({ message: err.message });
    }
};

export const verify = (req, res) => {
    return res.json({ success: true, message: 'Authentication verified' });
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }
        if (newPassword.length < 10) {
            return res.status(400).json({ message: 'New password must be at least 10 characters' });
        }
        await changeAdminPassword(req.adminId, currentPassword, newPassword);

        await recordAuditLog(req, {
            action: 'ADMIN_PASSWORD_CHANGED',
            username: req.adminUsername || 'Admin',
            details: { message: 'Admin password successfully updated' },
            status: 'SUCCESS'
        });

        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        await recordAuditLog(req, {
            action: 'ADMIN_PASSWORD_CHANGE_FAILED',
            username: req.adminUsername || 'Admin',
            details: { reason: err.message },
            status: 'FAILED'
        });
        return res.status(401).json({ message: err.message });
    }
};
