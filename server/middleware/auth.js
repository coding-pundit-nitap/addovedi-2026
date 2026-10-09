import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import GlobalUser from '../models/GlobalUser.js';

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
export const protect = async (req, res, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing in environment.' });
        }

        const token = readBearerToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. No access token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        if (decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
        }
        // A valid signature isn't enough: the account must still exist, so removing
        // an admin cuts off their session immediately instead of after the 12h token expiry.
        const admin = await Admin.findById(decoded.id).select('username').lean();
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
        }
        req.adminId = decoded.id;
        req.adminUsername = admin.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};

// Participant-session equivalent of `protect` — used on routes that must be
// scoped to "the logged-in participant themselves" (e.g. editing their own
// profile), issued at signup/login (see globalUserService.js).
// `allowTempPassword` is true only for the change-password route itself: while an account is on an
// admin-issued temporary password (mustChangePassword) every other participant route is refused, so a
// leaked temporary password can't be used for anything except replacing itself.
const buildRequireParticipant = (allowTempPassword) => async (req, res, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing in environment.' });
        }

        const token = readBearerToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. No access token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        if (decoded.role !== 'participant') {
            return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
        }
        // Same as admins: a removed player's still-unexpired 30-day token stops working.
        const user = await GlobalUser.findById(decoded.id).select('addovediId passwordChangedAt mustChangePassword').lean();
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized. This account no longer exists.' });
        }
        // A password change/reset kills every session issued before it (a reset must lock out a stolen session too).
        if (user.passwordChangedAt && (decoded.iat || 0) < Math.floor(user.passwordChangedAt.getTime() / 1000)) {
            return res.status(401).json({ message: 'Unauthorized. Your password was changed, please log in again.' });
        }
        if (user.mustChangePassword && !allowTempPassword) {
            return res.status(403).json({ code: 'MUST_CHANGE_PASSWORD', message: 'You are on a temporary password. Open your profile and set a new password first.' });
        }
        req.participantId = decoded.id;
        req.participantAddovediId = user.addovediId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};

export const requireParticipant = buildRequireParticipant(false);
export const requireParticipantAllowTemp = buildRequireParticipant(true);
