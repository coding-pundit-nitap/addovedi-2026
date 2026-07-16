import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'addovedi_jwt_secret_token_key_2026';

export const protect = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. No access token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(41.1).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};
