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

// const { faker } = require('@faker-js/faker');
// const { User, Purchase } = require('./src/models');
// const mongoose = require(`mongoose`);

// const getUserIds = async () => {
//   return await User.find().select('_id');
// };

// const insertPurchases = async (numPurchases) => {
//   try {
//     const userIds = await getUserIds();
//     const purchases = [];

//     for (let i = 0; i < numPurchases; i++) {
//       const randomUserId =
//         userIds[Math.floor(Math.random() * userIds.length)]._id;
//       const cardNumber = faker.finance.creditCardNumber();
//       const lastFourDigits = cardNumber.slice(-4);
//       const storeName = faker.company.name();
//       const amount = faker.commerce.price();

//       purchases.push({
//         userId: randomUserId,
//         store: storeName,
//         card: lastFourDigits, // Store only last 4 digits consistently
//         amount: amount,
//         date_added: faker.date.recent(),
//       });
//     }
//     await Purchase.insertMany(purchases);
//     console.log(`${numPurchases} purchases inserted successfully.`);
//     mongoose.connection.close();
//   } catch (error) {
//     console.error('Error inserting purchases:', error);
//     mongoose.connection.close();
//   }
// };

// // Insert 50 purchases
// insertPurchases(30);
