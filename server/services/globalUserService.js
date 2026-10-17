import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Registration from '../models/Registration.js';
import GlobalUser from '../models/GlobalUser.js';
import Counter from '../models/Counter.js';
import { hashPasswordAsync, verifyPasswordAsync } from '../utils/hash.js';
import { isValidEmail, isValidPhone, normalizePhone, phoneKey } from '../utils/validators.js';

const PUBLIC_FIELDS = '-passwordHash -__v';

// Not a full policy (students pick their own), just the passwords that are guessed first, plus blank-ish ones.
const PROFILE_LABELS = { gender: 'gender', dob: 'date of birth', college: 'college', department: 'department', year: 'year', state: 'state', city: 'city', emergencyContact: 'emergency contact number', avatar: 'avatar' };
const COMMON_PASSWORDS = new Set(['password', 'password1', 'password123', '12345678', '123456789', '1234567890', 'qwertyui', 'qwerty123', 'iloveyou', 'abc12345', 'admin123', 'welcome1', 'letmein1', 'addovedi', 'addovedi2026', 'addovedi@2026', 'passw0rd', '11111111', '00000000', 'abcd1234', '87654321']);
function assertStrongEnough(password, email, phone) {
    const p = password.trim();
    if (p.length < 8) throw new Error('Password cannot be blank or only spaces.');
    if (new Set(p).size < 3) throw new Error('That password is too simple. Use at least 3 different characters.');
    const lower = p.toLowerCase();
    if (COMMON_PASSWORDS.has(lower)) throw new Error('That password is too common. Please choose a harder one.');
    if (typeof email === 'string' && lower === email.trim().toLowerCase()) throw new Error('Your password cannot be your email address.');
    if (typeof phone === 'string' && lower.replace(/\D/g, '') === phoneKey(phone)) throw new Error('Your password cannot be your mobile number.');
}

// A real bcrypt hash of a throwaway string: login compares against it when the account does not exist so that
// "unknown email" and "wrong password" take the same time and cannot be told apart by response timing.
const DUMMY_HASH = bcrypt.hashSync('addovedi-timing-pad', 12);

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
    assertStrongEnough(password, email, phone);

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
    const ok = await verifyPasswordAsync(password, user ? user.passwordHash : DUMMY_HASH);
    if (!user || !ok) {
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
    for (const [key, value] of Object.entries(update)) {
        if (typeof value !== 'string') throw new Error(`Please enter a valid ${PROFILE_LABELS[key]}.`);
        update[key] = value.trim();
    }
    // Free-text fields need a real answer, not a single character or just digits/punctuation.
    for (const key of ['college', 'department', 'state', 'city']) {
        if (key in update && (update[key].length < 2 || !/\p{L}/u.test(update[key]))) {
            throw new Error(`Please enter a valid ${PROFILE_LABELS[key]}.`);
        }
    }
    if ('gender' in update && !update.gender) throw new Error('Please select your gender.');
    if ('year' in update && !update.year) throw new Error('Please select your year.');
    if ('dob' in update) {
        const d = new Date(`${update.dob}T00:00:00Z`);
        const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(update.dob) || Number.isNaN(d.getTime()) || age < 10 || age > 80) {
            throw new Error('Please enter a valid date of birth.');
        }
    }
    if ('avatar' in update && !/^[a-z0-9_-]{1,40}$/i.test(update.avatar)) {
        throw new Error('Invalid avatar.');
    }
    if (update.emergencyContact !== undefined && !isValidPhone(update.emergencyContact)) {
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
    assertStrongEnough(newPassword, '', '');
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

// ── Admin: correct a player's account details ──
// Admin-only (route uses `protect`). Same validation as signup / profile update, plus the one-account-per-email and
// per-mobile-number rules. Only a fixed list of fields can change: never the Addovedi ID, password, or session fields.
// Registrations keep a copy of the leader's name / phone / email (and teammates' names). So the correction shows up
// everywhere, those copies are updated on all of the player's registrations. Nothing else on a registration changes
// (team name, Team ID, status, teammates and their statuses stay as they are).
const ADMIN_EDITABLE = ['name', 'email', 'phone', 'gender', 'dob', 'college', 'department', 'year', 'state', 'city', 'emergencyContact'];
const mask = (v) => { const s = String(v ?? ''); return s.length <= 4 ? '****' : `${'*'.repeat(s.length - 4)}${s.slice(-4)}`; };
const SENSITIVE = new Set(['email', 'phone', 'dob', 'emergencyContact']);
const bad = (message, status = 400) => Object.assign(new Error(message), { status });

export const adminUpdatePlayer = async (id, data) => {
    if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) throw bad('Invalid player.');
    const user = await GlobalUser.findById(id);
    if (!user) throw bad('Player not found', 404);

    const incoming = {};
    for (const key of ADMIN_EDITABLE) {
        if (data?.[key] === undefined) continue;
        if (typeof data[key] !== 'string') throw bad(`Please enter a valid ${PROFILE_LABELS[key] || key}.`);
        incoming[key] = data[key].trim();
    }

    if ('name' in incoming && (!incoming.name || incoming.name.length > 100 || !/\p{L}/u.test(incoming.name))) throw bad('Name must be 1 to 100 characters.');
    if ('email' in incoming) {
        if (!isValidEmail(incoming.email) || incoming.email.length > 254) throw bad('Please enter a valid email address.');
        incoming.email = incoming.email.toLowerCase();
    }
    if ('phone' in incoming) {
        if (!isValidPhone(incoming.phone)) throw bad('Please enter a valid 10-digit mobile number.');
        incoming.phone = normalizePhone(incoming.phone);
    }
    for (const key of ['college', 'department', 'state', 'city']) {
        if (key in incoming && (incoming[key].length < 2 || !/\p{L}/u.test(incoming[key]))) throw bad(`Please enter a valid ${PROFILE_LABELS[key]}.`);
    }
    if ('gender' in incoming && !incoming.gender) throw bad('Please select the gender.');
    if ('year' in incoming && !incoming.year) throw bad('Please select the year.');
    if ('dob' in incoming) {
        const d = new Date(`${incoming.dob}T00:00:00Z`);
        const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(incoming.dob) || Number.isNaN(d.getTime()) || age < 10 || age > 80) throw bad('Please enter a valid date of birth.');
    }
    if ('emergencyContact' in incoming && !isValidPhone(incoming.emergencyContact)) throw bad('Please enter a valid emergency contact number.');

    // keep only what actually changes
    const changes = {};
    for (const [k, v] of Object.entries(incoming)) if (String(user[k] ?? '') !== v) changes[k] = v;
    if (!Object.keys(changes).length) throw bad('Nothing was changed.');

    if (changes.email && await GlobalUser.exists({ email: changes.email, _id: { $ne: user._id } })) throw bad('This email is already used by another account.', 409);
    if (changes.phone) {
        const key = phoneKey(changes.phone);
        if (await GlobalUser.exists({ phoneKey: key, _id: { $ne: user._id } })) throw bad('This mobile number is already used by another account.', 409);
        changes.phoneKey = key;
    }

    const before = {}; for (const k of Object.keys(changes)) if (k !== 'phoneKey') before[k] = user[k];
    let updated;
    try {
        updated = await GlobalUser.findByIdAndUpdate(user._id, { $set: changes }, { new: true, runValidators: true }).select(PUBLIC_FIELDS);
    } catch (err) {
        if (err?.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0];
            throw bad(field === 'email' ? 'This email is already used by another account.' : 'This mobile number is already used by another account.', 409);
        }
        throw err;
    }

    // Refresh the copies stored on this player's registrations.
    let synced = 0;
    {
        const uid = user.addovediId;
        const live = {};
        const ci = { locale: 'en', strength: 2 };
        const leaderSet = {};
        if (changes.name) leaderSet.leaderName = changes.name;
        if (changes.phone) leaderSet.leaderPhone = changes.phone;
        if (changes.email) leaderSet.userEmail = changes.email;
        if (Object.keys(leaderSet).length) {
            const r = await Registration.updateMany({ leaderUID: uid, ...live }, { $set: leaderSet }).collation(ci);
            synced += r.modifiedCount || 0;
        }
        if (changes.name) {
            const r = await Registration.updateMany({ ...live, members: { $elemMatch: { uid } } }, { $set: { 'members.$[m].name': changes.name } }, { arrayFilters: [{ 'm.uid': uid }], collation: ci });
            synced += r.modifiedCount || 0;
        }
    }

    const after = {}; for (const k of Object.keys(before)) after[k] = updated[k];
    const log = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, SENSITIVE.has(k) ? mask(v) : v]));
    return { player: updated, auditDetails: { addovediId: user.addovediId, changed: Object.keys(before), before: log(before), after: log(after), registrationsUpdated: synced } };
};

// The signed-in player's own account, fresh from the database (used by the website to refresh its cached copy, e.g.
// after an admin corrected their details). Same safe fields as login / profile update: never the password hash.
export const getMyAccount = async (id) => {
    const user = await GlobalUser.findById(id).select(PUBLIC_FIELDS).lean();
    if (!user) throw Object.assign(new Error('Account not found.'), { status: 404 });
    return user;
};
