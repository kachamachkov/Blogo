const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;

const User = require('../models/User');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');


router.get('/login', isGuest, (req, res) => {
    const localsInfo = {
        title: "Admin",
        description: "Admin dashboard for Blogo"
    };

    try {
        res.render('admin/login', {
            localsInfo,
            currentRoute: '/admin'

        });

    } catch (error) {
        console.log(error.message);
    }
});

router.post('/login', isGuest, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });


        if (!user) {
            throw new Error('Invalid Credentials!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid Credentials!');
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });


        res.redirect('/dashboard');

    } catch (error) {
        console.log(error.message);
        res.render('admin/login', {
            error,
            currentRoute: '/admin'
        });

    }

});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;