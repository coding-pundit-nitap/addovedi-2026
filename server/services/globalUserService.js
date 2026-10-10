import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Registration from '../models/Registration.js';
import GlobalUser from '../models/GlobalUser.js';
import Counter from '../models/Counter.js';
import { hashPasswordAsync, verifyPasswordAsync } from '../utils/hash.js';
import { isValidEmail, isValidPhone, normalizePhone, phoneKey } from '../utils/validators.js';

const PUBLIC_FIELDS = '-passwordHash -__v';

function signParticipantToken(id) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('Server configuration error: JWT_SECRET environment variable is missing.');
    }
    // Long-lived relative to the admin token (12h): this is a festival-long
    // participant session, not a privileged console, so favor fewer
    // re-logins over tight expiry.
    return jwt.sign({ id, role: 'participant' }, JWT_SECRET, { expiresIn: '30d' });
}

async function nextAddovediId() {
    // $inc and $setOnInsert can't target the same field in one update (Mongo
    // rejects that as a path conflict), so seeding the counter at 142 and
    // incrementing it have to be two atomic steps rather than one. The first
    // upsert is a no-op once the document exists, so this stays correct and
    // race-safe on every call, not just the first.
    await Counter.updateOne(
        { _id: 'addovediId' },
        { $setOnInsert: { seq: 142 } },
        { upsert: true }
    );
    const counter = await Counter.findByIdAndUpdate(
        'addovediId',
        { $inc: { seq: 1 } },
        { new: true }
    );
    return `ADV26-${counter.seq.toString().padStart(4, '0')}`;
}

export const signup = async ({ name, email, phone, password }) => {
    if (typeof name !== 'string' || !name.trim()) {
        throw new Error('Name is required.');
    }
    if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address.');
    }
    if (!isValidPhone(phone)) {
        throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (typeof password !== 'string' || password.length < 8) {
        throw new Error('Password must be at least 8 characters.');
    }
    if (password.length > 128) {
        throw new Error('Password must be at most 128 characters.');
    }
    if (name.trim().length > 100 || email.length > 254) {
        throw new Error('Name or email is too long.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPasswordAsync(password);
    const key = phoneKey(phone);
    const [emailTaken, phoneTaken] = await Promise.all([
        GlobalUser.exists({ email: normalizedEmail }),
        GlobalUser.exists({ phoneKey: key })
    ]);
    if (emailTaken && phoneTaken) {
        throw new Error('This email and this mobile number are both already registered. Please log in instead.');
    }
    if (emailTaken) {
        throw new Error('This email is already registered with another account. Please log in, or use a different email.');
    }
    if (phoneTaken) {
        throw new Error('This mobile number is already registered with another account. Please log in, or use a different number.');
    }

    // Retry on the astronomically unlikely chance of a concurrent unique-index
    // collision (two signups landing on the same counter value due to a
    // Counter document being manually reset, etc.) rather than failing outright.
    for (let attempt = 0; attempt < 3; attempt++) {
        const addovediId = await nextAddovediId();
        try {
            const user = await GlobalUser.create({
                addovediId,
                name: name.trim(),
                email: normalizedEmail,
                phone: normalizePhone(phone),
                phoneKey: key,
                passwordHash
            });
            const obj = user.toObject({ versionKey: false, transform: (_doc, ret) => { delete ret.passwordHash; return ret; } });
            return { ...obj, token: signParticipantToken(user._id) };
        } catch (err) {
            // Two people racing to claim the same email / number: the unique indexes decide, we explain.
            if (err.code === 11000) {
                const field = Object.keys(err.keyPattern || {})[0];
                if (field === 'email') throw new Error('This email is already registered with another account. Please log in, or use a different email.');
                if (field === 'phoneKey') throw new Error('This mobile number is already registered with another account. Please log in, or use a different number.');
                if (attempt < 2) continue; // Addovedi ID counter collision: take the next ID
            }
            throw err;
        }
    }
    throw new Error('Could not allocate a unique Addovedi ID. Please try again.');
};

export const login = async ({ email, password }) => {
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Invalid credentials.');
    }
    const user = await GlobalUser.findOne({ email: email.trim().toLowerCase() });
    if (password.length > 128) throw new Error('Invalid email or password.');
    if (!user || !(await verifyPasswordAsync(password, user.passwordHash))) {
        throw new Error('Invalid email or password.');
    }
    const obj = user.toObject({ versionKey: false });
    delete obj.passwordHash;
    return { ...obj, token: signParticipantToken(user._id) };
};

// Updates the Stage-2 "Global Profile" fields. `callerId` is the id decoded
// from the caller's own participant JWT (see middleware/auth.js
// requireParticipant) — this is the real ownership check: a valid token
// proves who's asking, and it must match the profile being edited.
export const updateProfile = async (id, callerId, data) => {
    if (callerId !== id) {
        throw new Error('Not authorized to update this profile.');
    }

    const allowed = ['gender', 'dob', 'college', 'department', 'year', 'state', 'city', 'emergencyContact', 'avatar'];
    const update = {};
    for (const key of allowed) {
        if (data[key] !== undefined) update[key] = data[key];
    }
    if (update.emergencyContact && !isValidPhone(update.emergencyContact)) {
        throw new Error('Please enter a valid emergency contact number.');
    }
    const user = await GlobalUser.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select(PUBLIC_FIELDS);
    if (!user) throw new Error('Account not found.');
    return user;
};

// Used by the team-member Addovedi ID check during event registration.
// Deliberately returns only non-sensitive fields (no email/phone) since
// this endpoint is public.
export const findByAddovediId = async (addovediId) => {
    if (typeof addovediId !== 'string' || !addovediId.trim()) return null;
    return GlobalUser.findOne({ addovediId: addovediId.trim().toUpperCase() }).select('addovediId name');
};

// ── Admin: list / remove participant accounts ──
export const listPlayers = async () => {
    // passwordHash is never sent, even to admins.
    return await GlobalUser.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
};

export const deletePlayer = async (id) => {
    const player = await GlobalUser.findById(id);
    if (!player) throw Object.assign(new Error('Player not found'), { status: 404 });

    // Don't leave a team pointing at an account that no longer exists: the admin
    // must delete (or move) that player's registrations first.
    const regs = await Registration.find({
        $or: [{ leaderUID: player.addovediId }, { members: { $elemMatch: { uid: player.addovediId, status: { $ne: 'REJECTED' } } } }]
    }).collation({ locale: 'en', strength: 2 }).select('eventTitle status').lean();
    if (regs.length > 0) {
        const events = [...new Set(regs.map(r => r.eventTitle))].join(', ');
        throw Object.assign(new Error(`${player.name} (${player.addovediId}) is on ${regs.length} registration(s): ${events}. Delete those registrations first, then remove the player.`), { status: 409 });
    }
    await player.deleteOne();
    return player;
};

// ── Password change / admin reset ──

// A signed-in player chooses a new password (must know the current one).
export const changePassword = async (id, currentPassword, newPassword) => {
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        throw new Error('Current and new passwords are required.');
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
        throw new Error('New password must be 8 to 128 characters.');
    }
    if (newPassword === currentPassword) {
        throw new Error('New password must be different from the current one.');
    }
    const user = await GlobalUser.findById(id);
    if (!user || currentPassword.length > 128 || !(await verifyPasswordAsync(currentPassword, user.passwordHash))) {
        throw new Error('Current password is incorrect.');
    }
    user.passwordHash = await hashPasswordAsync(newPassword);
    user.mustChangePassword = false;
    // Round up so the fresh token below (iat is whole seconds) is never older than this stamp.
    user.passwordChangedAt = new Date(Math.floor(Date.now() / 1000) * 1000);
    await user.save();
    // Other sessions (iat < passwordChangedAt) are now invalid; hand back a fresh one for this device.
    return { token: signParticipantToken(user._id) };
};

// Unambiguous characters only (no 0/O, 1/l/I) so it can be read out over a call or WhatsApp.
const TEMP_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const generateTempPassword = () =>
    Array.from(crypto.randomBytes(10), b => TEMP_ALPHABET[b % TEMP_ALPHABET.length]).join('');

// Admin sets a one-time temporary password; the player must replace it at next login.
export const adminResetPassword = async (id) => {
    const user = await GlobalUser.findById(id);
    if (!user) throw Object.assign(new Error('Player not found'), { status: 404 });
    const temp = generateTempPassword();
    user.passwordHash = await hashPasswordAsync(temp);
    user.mustChangePassword = true;
    user.passwordChangedAt = new Date(Math.floor(Date.now() / 1000) * 1000);
    await user.save();
    return { player: user, tempPassword: temp };
};
