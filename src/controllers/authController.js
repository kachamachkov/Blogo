const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;

const User = require('../models/User');
// const { getErrorMessage } = require('../helpers/getErrorMessage');
const { guestMiddleware, authMiddleware } = require('../middlewares/authMiddleware');
const adminLayout = '../views/layouts/admin';


router.get('/login', guestMiddleware, (req, res) => {
    const locals = {
        title: "Admin",
        description: "Admin dashboard for Blogo"
    };

    try {
        res.render('admin/login', { locals, layout: adminLayout });

    } catch (error) {
        console.log(error.message);
    }
});

router.post('/login', async (req, res) => {
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
        // TODO: handle error on login
        console.log(error.message);
        res.render('admin/login', {

            error,
            layout: adminLayout
        });

    }

});

router.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;