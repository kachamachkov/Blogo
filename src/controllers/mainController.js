const router = require('express').Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    const localsInfo = {
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
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const hasPrevPage = prevPage >= 1;

        res.render('index', {
            localsInfo,
            data,
            current: page,
            prevPage: hasPrevPage ? prevPage : null,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
});

router.get('/posts/:id', async (req, res) => {
    const localsInfo = {
        title: 'Blogo',
        description: 'Simple blog created with NodeJS, Express, MongoDB',
    };

    try {
        let postId = req.params.id;

        const data = await Post.findById(postId);

        res.render('post', {
            localsInfo,
            data,
            currentRoute: `/posts/${postId}`
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.post('/search', async (req, res) => {
    const localsInfo = {
        title: 'Blogo',
        description: 'Simple blog created with NodeJS, Express, MongoDB'
    };

    try {
        let searchTerm = req.body.searchTerm.trim();
        console.log(searchTerm);

        if (searchTerm == '') {
            throw new Error('Please enter a search phrase.');
        }
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        if (data.length == 0) {
            throw new Error('Sorry, no posts matched your search. Please try again.');
        }

        res.render('search', {
            data,
            localsInfo,
            currentRoute: '/search'
        });

    } catch (error) {
        console.log(error.message);

        res.render('search', {
            error,
            localsInfo,
            currentRoute: '/search'
        });

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