require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes');

const connectDB = require('./config/db');
const { isActiveRoute } = require('./helpers/routeHelpers');
const mongoSession = require('./config/mongoSession');

const app = express();
const PORT = 5500 || process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session(mongoSession));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use(routes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});