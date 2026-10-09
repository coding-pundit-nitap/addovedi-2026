import AuditLog from '../models/AuditLog.js';

export const recordAuditLog = async (req, { action, username, details, status = 'SUCCESS' }) => {
    try {
        // req.ip honors `trust proxy` (exactly 1 hop); the raw X-Forwarded-For header's first
        // entry is attacker-controlled and would let anyone forge the IP in the audit trail.
        const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
        const userAgent = String(req.headers['user-agent'] || '').slice(0, 300);

        await AuditLog.create({
            action,
            username: username || req.adminUsername || 'Admin',
            ipAddress,
            userAgent,
            details: details || {},
            status
        });
    } catch (err) {
        console.error('[AUDIT LOG ERROR] Failed to record audit entry:', err.message);
    }
};
