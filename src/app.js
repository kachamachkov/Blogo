require('dotenv').config();
const favicon = require('serve-favicon');
const path = require('path')

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const connectDB = require('./config/db');
const { isActiveRoute } = require('./helpers/routeHelpers');

const app = express();
const PORT = 5500 || process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')))


app.use(expressLayout);

app.set('layout', './layouts/main');
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./routes/main'));
app.use('/', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});