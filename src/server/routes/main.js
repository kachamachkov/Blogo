const router = require('express').Router();
const Post = require('../models/Post');

router.get('', (req, res) => {
  res.render('index');
});


function insertPostData() {
  Post.insertMany([
    {
      title: "Test title",
      body: "This is the test body"
    },
    {
      title: "Test title2",
      body: "This is the test body2"
    },
    {
      title: "Test title3",
      body: "This is the test body3"
    },
    {
      title: "Test title4",
      body: "This is the test body4"
    },
  ]);
}
insertPostData();

router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;