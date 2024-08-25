const router = require('express').Router();

const Post = require('../models/Post');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../helpers/getErrorMessage');
const adminLayout = '../views/layouts/admin';

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

    } catch (err) {
        console.log(err);
    }
});

router.get('/add-post', authMiddleware, (req, res) => {
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
        console.log(error);
    }
});

router.post('/add-post', authMiddleware, async (req, res) => {
    const locals = {
        title: "Add Post",
        description: "Page to create a new post"
    };

    try {
        const title = req.body.title.trim();
        const body = req.body.body.trim();

        if (!title) {
            throw new Error('Title is required!');
        }
        if (!body) {
            throw new Error('Content is required!');
        }
        const newPost = new Post({
            title,
            body
        });

        await Post.create(newPost);
        res.redirect(`/posts/${newPost._id}`);

    } catch (err) {
        res.render('admin/add-post', {
            locals,
            error: err,
            layout: adminLayout
        });
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
    } catch (err) {
        console.log(err.message)
        res.redirect('/');
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
        // TODO: handle error
        console.log(error);
    }
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        // TODO: handle error
        console.log(error);
    }
});

module.exports = router;