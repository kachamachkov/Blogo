const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const Post = require('../models/Post');

router.get('/dashboard', isAuth, async (req, res) => {
    const localsInfo = {
        title: "Dashboard",
        description: "Admin dashboard for Blogo"
    };

    try {
        const data = await Post.find();
        if (data.length == 0) {
            throw new Error('There are no posts yet! :)');
        }

        res.render('admin/dashboard', {
            localsInfo,
            data,
            currentRoute: '/dashboard'
        });

    } catch (error) {
        console.log(error);

        res.render('admin/dashboard', {
            error,
            localsInfo,
            currentRoute: '/dashboard'
            
        });
    }
});

router.get('/add-post', isAuth, (req, res) => {
    const localsInfo = {
        title: "Add Post",
        description: "Page to create a new post"
    };

    try {
        res.render('admin/add-post', {
            localsInfo,
            currentRoute: '/add-post'
        });

    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
});

router.post('/add-post', isAuth, async (req, res) => {
    const localsInfo = {
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

    } catch (error) {
        res.render('admin/add-post', {
            localsInfo,
            error,
            currentRoute: '/add-post'
        });
    }
});

router.get('/edit-post/:id', isAuth, async (req, res) => {
    const localsInfo = {
        title: "Admin",
        description: "Admin dashboard for Blogo"
    };

    try {
        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            localsInfo,
            data,
            currentRoute: '/edit-post'
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.put('/edit-post/:id', isAuth, async (req, res) => {
    const title = req.body.title.trim();
    const body = req.body.body.trim();
    const postId = req.params.id;

    try {
        await Post.findByIdAndUpdate(postId, {
            title,
            body,
            updatedAt: Date.now()
        });

        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.log(error);
        res.redirect(`/posts/${postId}`);

    }
});

router.delete('/delete-post/:id', isAuth, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;