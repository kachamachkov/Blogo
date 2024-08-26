const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const guestMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = {
    authMiddleware,
    guestMiddleware
};