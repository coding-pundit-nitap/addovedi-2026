// Turns a caught error into text that is safe to show a visitor. Messages we threw ourselves
// ("Name is required.", "Player not found") pass through; driver/ORM/network errors (which carry
// hostnames, ports, collection and field internals) are replaced with a generic line.
const INTERNAL = /ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|mongo|buffering timed out|server selection|topology|Cast to|E11000|at path|\bBSON\b|socket hang up|stack/i;

export function clientMessage(err, fallback = 'Something went wrong. Please try again.') {
    if (!err) return fallback;
    if (err.name === 'ValidationError' && err.errors) {
        const fields = Object.keys(err.errors).join(', ');
        return fields ? `Invalid value for: ${fields}.` : 'Some fields are invalid.';
    }
    if (err.name === 'CastError') return `Invalid value for ${err.path || 'a field'}.`;
    if (err.code === 11000) return 'That record already exists.';
    const msg = typeof err.message === 'string' ? err.message : '';
    if (!msg || /^Mongo|^Mongoose/.test(err.name || '') || INTERNAL.test(msg)) return fallback;
    return msg;
}
