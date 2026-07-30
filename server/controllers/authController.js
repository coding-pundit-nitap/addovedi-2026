import { authenticateAdmin, changeAdminPassword } from '../services/authService.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const data = await authenticateAdmin(username, password);
        return res.json(data);
    } catch (err) {
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
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }
        await changeAdminPassword(req.adminId, currentPassword, newPassword);
        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
