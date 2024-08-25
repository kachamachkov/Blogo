const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;

const User = require('../models/User');
const { getErrorMessage } = require('../helpers/getErrorMessage');
const { guestMiddleware, authMiddleware } = require('../middlewares/authMiddleware');
const adminLayout = '../views/layouts/admin';


router.get('/login', guestMiddleware, (req, res) => {
    const locals = {
        title: "Admin",
        description: "Admin dashboard for Blogo"
    };

    try {
        res.render('admin/index', { locals, layout: adminLayout });

    } catch (error) {
        console.log(error.message);
        // TODO: Handle error for invalid credentials
        // res.render('/login', { error: getErrorMessage(err) });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });


        res.redirect('/dashboard');

    } catch (error) {
        // TODO: handle error on login
        console.log(error.message);
    }

});

router.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;