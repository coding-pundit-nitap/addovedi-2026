import AuditLog from '../models/AuditLog.js';

// Get all audit logs with sorting and limit
export const getAuditLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
        return res.json(logs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Clear audit logs (Admin only)
export const clearAuditLogs = async (req, res) => {
    try {
        await AuditLog.deleteMany({});
        return res.json({ message: 'Audit logs cleared successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
