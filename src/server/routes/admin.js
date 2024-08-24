const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Post = require('../models/Post');
const User = require('../models/User');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

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

router.post('/admin', async (req, res) => {
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
        console.log(error.message);
    }

});




router.get('/dashboard', authMiddleware, async (req, res) => {

    const locals = {
        title: "Dashboard",
        description: "Admin dashboard for Blogo"
    };


    try {
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});

router.get('/add-post', authMiddleware, async (req, res) => {
    const locals = {
        title: "Add Post",
        description: "Page to create a new post"
    };

    try {

        res.render('admin/add-post', {
            locals,
            layout: adminLayout,
        });

    } catch (error) {

    }
});

router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
        });

        await Post.create(newPost);
        res.redirect(`/posts/${newPost._id}`);
    } catch (error) {
        console.log(error);
    }

});

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    const locals = {
        title: "Admin",
        description: "Admin dashboard for Blogo"
    };
    try {
        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/posts/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }

});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;