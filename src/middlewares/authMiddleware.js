const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret);

        req.token = decodedToken;
        res.locals.isAuthenticated = true;
        res.locals.token = decodedToken;

        next();

    } catch (error) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

const isAuth = (req, res, next) => {
    if (!req.token) {
        return res.redirect('/login');
    }
    next();
};

const isGuest = (req, res, next) => {
    if (req.token) {
        return res.redirect('/dashboard');
    }

    next();
};

module.exports = {
    authMiddleware,
    isAuth,
    isGuest
};

