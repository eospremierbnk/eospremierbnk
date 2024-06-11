const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config({ path: '.env.prod' });
}

const config = require('./src/configs/customEnvVariables');
const express = require('express');
const connectAndStartServer = require('./src/configs/database/connection');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const globalErrorHandler = require('./src/errorHandlers/globalErrorHandler');
const newsletterScheduler = require('./src/utils/newsletterScheduler');
const logger = require('./logger/logger');
const middleware = require('./src/middlewares/expressMiddlewares');
const routes = require('./src/routes');
const setupSocketIo = require('./src/configs/socket.io/socket');

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

//socket io chatting
const server = http.createServer(app);
setupSocketIo(server);

// Start the newsletter scheduler
newsletterScheduler.start();
logger.info('Newsletter scheduler started.');

// Use routes defined in the routes module
app.use(routes);

//Use the ErrorHandler middleware as the last middleware
app.use(globalErrorHandler);

// Start the server
connectAndStartServer(server);
