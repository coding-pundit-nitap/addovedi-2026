import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { verifyPassword, hashPassword, needsRehash } from '../utils/hash.js';

export const authenticateAdmin = async (username, password) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('Server configuration error: JWT_SECRET environment variable is missing.');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        throw new Error('Invalid credentials');
    }

    // Same generic message for "no such user" and "wrong password" to avoid
    // leaking which admin usernames exist.
    const admin = await Admin.findOne({ username });
    if (!admin) {
        throw new Error('Invalid credentials');
    }

    const isValid = verifyPassword(password, admin.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    if (needsRehash(admin.password)) {
        admin.password = hashPassword(password);
        await admin.save();
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
