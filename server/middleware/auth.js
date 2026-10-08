import jwt from 'jsonwebtoken';

function readBearerToken(req) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// Admin and participant tokens are signed with the same JWT_SECRET (one env
// var to configure, same as before this file grew a second audience) but
// carry a `role` claim, and each middleware below rejects a token that isn't
// its own role — otherwise a participant token would also pass admin-only
// routes and vice versa, since both are valid signatures under one secret.
export const protect = (req, res, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing in environment.' });
        }

        const token = readBearerToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. No access token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
        }
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};

// Participant-session equivalent of `protect` — used on routes that must be
// scoped to "the logged-in participant themselves" (e.g. editing their own
// profile), issued at signup/login (see globalUserService.js).
export const requireParticipant = (req, res, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing in environment.' });
        }

        const token = readBearerToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. No access token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'participant') {
            return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
        }
        req.participantId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};
