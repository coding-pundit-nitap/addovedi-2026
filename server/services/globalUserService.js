import jwt from 'jsonwebtoken';
import GlobalUser from '../models/GlobalUser.js';
import Counter from '../models/Counter.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { isValidEmail, isValidPhone, normalizePhone } from '../utils/validators.js';

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

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await GlobalUser.findOne({ email: normalizedEmail });
    if (existing) {
        throw new Error('An account with this email already exists. Please log in instead.');
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
                passwordHash: hashPassword(password)
            });
            const obj = user.toObject({ versionKey: false, transform: (_doc, ret) => { delete ret.passwordHash; return ret; } });
            return { ...obj, token: signParticipantToken(user._id) };
        } catch (err) {
            if (err.code === 11000 && attempt < 2) continue;
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
    if (!user || !verifyPassword(password, user.passwordHash)) {
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
