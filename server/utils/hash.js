import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

/**
 * Hashes a password with bcrypt.
 */
export function hashPassword(password) {
    return bcrypt.hashSync(password, BCRYPT_ROUNDS);
}

function isLegacyPbkdf2Hash(storedHash) {
    return typeof storedHash === 'string' && storedHash.includes(':') && !storedHash.startsWith('$2');
}

/**
 * Verifies a password against its stored hash. Supports the old
 * salt:pbkdf2(1000 rounds) format for accounts created before the
 * bcrypt migration, using a constant-time comparison.
 */
export function verifyPassword(password, storedHash) {
    if (!storedHash) return false;

    if (isLegacyPbkdf2Hash(storedHash)) {
        const [salt, originalHash] = storedHash.split(':');
        if (!salt || !originalHash) return false;
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        const a = Buffer.from(hash, 'hex');
        const b = Buffer.from(originalHash, 'hex');
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    }

    return bcrypt.compareSync(password, storedHash);
}

export function needsRehash(storedHash) {
    return isLegacyPbkdf2Hash(storedHash);
}
