import AuditLog from '../models/AuditLog.js';

export const recordAuditLog = async (req, { action, username, details, status = 'SUCCESS' }) => {
    try {
        const rawIp = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || 'unknown';
        const ipAddress = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
        const userAgent = req.headers['user-agent'] || '';

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
