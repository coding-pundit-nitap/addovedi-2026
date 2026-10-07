const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Indian mobile numbers: optional +91 prefix, then a 10-digit number starting 6-9.
const PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;

export function isValidEmail(email) {
    return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

// Strips spaces/hyphens (people type "+91 98765 43210") before validating.
export function isValidPhone(phone) {
    if (typeof phone !== 'string') return false;
    return PHONE_REGEX.test(phone.trim().replace(/[\s-]/g, ''));
}

// Normalizes a phone number to digits+optional-leading-plus, for consistent storage/comparison.
export function normalizePhone(phone) {
    return typeof phone === 'string' ? phone.trim().replace(/[\s-]/g, '') : phone;
}
