const router = require('express').Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {
    const locals = {
        title: 'Blogo',
        description: 'Simple blog created with NodeJS, Express, MongoDB'
    };

    try {
        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        // TODO: Handle error on search
        console.log(error);
    }
});

router.get('/posts/:id', async (req, res) => {
    const locals = {
        title: 'Blogo',
        description: 'Simple blog created with NodeJS, Express, MongoDB',
    };

    try {
        let postId = req.params.id;

        const data = await Post.findById(postId);

        res.render('post', {
            locals,
            data,
            currentRoute: `/posts/${postId}`
        });
    } catch (error) {
        // TODO: Handle error on search
        console.log(error);
    }
});

router.post('/search', async (req, res) => {
    const locals = {
        title: 'Blogo',
        description: 'Simple blog created with NodeJS, Express, MongoDB'
    };

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        console.log(searchTerm);

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render('search', {
            data,
            locals,
            currentRoute: '/search'
        });

    } catch (error) {
        // TODO: Handle error on search
        console.log(error.message);

    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    });
});

module.exports = router;