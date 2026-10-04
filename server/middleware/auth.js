import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing in environment.' });
        }

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
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};
