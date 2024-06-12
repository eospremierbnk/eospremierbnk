const express = require('express');
const router = express.Router();

// Import route handlers
const landingPageRoute = require('../routes/landingPageRoute');

const userAuthRoute = require('../routes/authUserRoute');
const userRoute = require('../routes/userRoute');

const adminAuthRoute = require('../routes/authAdminRoute');
const adminRoute = require('../routes/adminRoute');

const middleware = require('../middlewares/expressMiddlewares');

//middlewares
router.use(middleware);

//IMPORT THE ROUTE FILES

// Mount the landing page route
router.use('/', landingPageRoute);

// Mount the user authentication routes under /auth/user
router.use('/auth/user', userAuthRoute);
router.use('/', userAuthRoute);
router.use('/user', userRoute);
router.use('/', userRoute);

// Mount the admin authentication routes under /auth/admin
router.use('/auth/admin', adminAuthRoute);
router.use('/', adminAuthRoute);
router.use('/admin', adminRoute);

module.exports = router;
