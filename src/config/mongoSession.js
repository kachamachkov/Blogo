const MongoStore = require('connect-mongo');

const mongoSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI

    })
};

module.exports = mongoSession;