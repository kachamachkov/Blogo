const router = require('express').Router();

const Post = require('../models/Post');
const { authMiddleware } = require('../middlewares/authMiddleware');
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

    } catch (error) {
        // TODO: handle error
        console.log(error);
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
        // TODO: handle error
        console.log(error);
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
        // TODO: handle error
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
        // TODO: handle error
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