const router = require('express').Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {

    const locals = {
        title: 'NodeJS Blogo',
        description: 'Simple blog created with NodeJS, Express, MongoDB'
    };

    try {
        const data = await Post.find();

        res.render('index', { locals, data });
        
    } catch (error) {
        console.log(error);
    }
});





router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;