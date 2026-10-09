import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { verifyPasswordAsync, hashPasswordAsync, needsRehash } from '../utils/hash.js';

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

    const isValid = await verifyPasswordAsync(password, admin.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    if (needsRehash(admin.password)) {
        admin.password = await hashPasswordAsync(password);
        await admin.save();
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
    return { token, username: admin.username };
};

export const changeAdminPassword = async (adminId, currentPassword, newPassword) => {
    const admin = await Admin.findById(adminId);
    if (!admin) {
        throw new Error('Admin account not found');
    }

    const isValid = await verifyPasswordAsync(currentPassword, admin.password);
    if (!isValid) {
        throw new Error('Current password is incorrect');
    }

    admin.password = await hashPasswordAsync(newPassword);
    await admin.save();
    return true;
};
