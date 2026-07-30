import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { verifyPassword, hashPassword } from '../utils/hash.js';

const JWT_SECRET = process.env.JWT_SECRET || 'addovedi_jwt_secret_token_key_2026';

export const authenticateAdmin = async (username, password) => {
    const admin = await Admin.findOne({ username });
    if (!admin) {
        throw new Error('Admin account not found');
    }
    
    const isValid = verifyPassword(password, admin.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '12h' });
    return { token, username: admin.username };
};

export const changeAdminPassword = async (adminId, currentPassword, newPassword) => {
    const admin = await Admin.findById(adminId);
    if (!admin) {
        throw new Error('Admin account not found');
    }

    const isValid = verifyPassword(currentPassword, admin.password);
    if (!isValid) {
        throw new Error('Current password is incorrect');
    }

    admin.password = hashPassword(newPassword);
    await admin.save();
    return true;
};
