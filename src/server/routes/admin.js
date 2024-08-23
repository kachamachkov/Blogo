const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Post = require('../models/Post');
const User = require('../models/User');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

router.get('/admin', (req, res) => {
    const locals = {
        title: "Admin",
        description: "Admin dashboard for Blogo"
    };

    try {
        res.render('admin/index', { locals, layout: adminLayout });

    } catch (error) {

    }
});

// router.post('/admin', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ userId: user._id }, jwtSecret);
//         res.cookie('token', token, { httpOnly: true });


//         res.redirect('/dashboard');

//     } catch (error) {
//         console.log(error.message);
//     }

// });


router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            if (error) {
                if (error.code === 11000) {
                    res.status(409).json({ message: 'User already in use' });
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        }

    } catch (error) {
        console.log(error)
    }
});

router.get('/dashboard', async (req, res) => {
    res.render('admin/dashboard');
});


module.exports = router;