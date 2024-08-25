const router = require('express').Router();

const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');

router.use(mainController);
router.use(authController);
router.use(adminController);

router.all('*', (req, res) => {
    res.render('404', {
        currentRoute: '/404'
    });
});

module.exports = router;