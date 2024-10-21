const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config({ path: '.env.prod' });
}

const config = require('./configs/customEnvVariables');
const express = require('express');
const connectAndStartServer = require('./configs/database/connection');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('./errorHandlers/globalErrorHandler');
const middleware = require('./middlewares/expressMiddlewares');
const routes = require('./routes');

const app = express();

// Set no-cache headers middleware
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Pragma', 'no-cache');
  next();
});

const trustedOrigins = [config.baseUrl];
app.use(
  cors({
    origin: trustedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  })
);

//express session middlewares
app.use(middleware);

//Passport Middleware
app.use(morgan('tiny'));
app.disable('x-powered-by');

// Use routes defined in the routes module
app.use(routes);

//Use the ErrorHandler middleware as the last middleware
app.use(globalErrorHandler);

// Start the server
connectAndStartServer(app);
