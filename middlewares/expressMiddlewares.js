const express = require('express');
const path = require('path');
const middleware = express();
const session = require('express-session');
const config = require('../configs/customEnvVariables');
const cookieParser = require('cookie-parser');

middleware.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  })
);

middleware.use(express.static(path.join(__dirname, '../public')));
middleware.use(express.urlencoded({ extended: false }));
middleware.use(express.json());
middleware.use(cookieParser());

middleware.set('view engine', 'ejs');

middleware.set('views', path.join(__dirname, '../views'));

module.exports = middleware;
