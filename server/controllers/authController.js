import { authenticateAdmin } from '../services/authService.js';

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
