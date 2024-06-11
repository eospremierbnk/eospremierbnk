'use strict';
const { ContactUs, NewsLetter } = require('../models');
const { contactUsSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { contactQueriesMsg, newNewsLetterMsg } = require('../mailers');
const { sanitizeInput, sanitizeObject } = require('../utils');

const indexPage = tryCatch((req, res) => {
  res.render('index');
});

const singlePage = tryCatch((req, res) => {
  res.render('single');
});

const contactUsPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);

  const { error, value } = contactUsSchema.validate(sanitizedBody, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const { firstName, lastName, email, subject, message } = value;
  const newContactUs = new ContactUs({
    firstName,
    lastName,
    email,
    subject,
    message,
    date_added: Date.now(),
  });
  await newContactUs.save();

  await contactQueriesMsg(newContactUs);
  res.status(201).json({ success: true, message: 'Message successfully sent' });
});

// User login
const loginPage = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/user/login', { authErrorMessage });
};

const userLoginPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { userUsername, userPassword } = sanitizedBody;

  const user = await User.findOne({ userUsername });

  if (!user) {
    throw new APIError('Invalid username provided', 401);
  }

  if (user.userRole !== 'User') {
    throw new APIError('Access forbidden. Only user are allowed', 403);
  }

  const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
  if (!passwordMatch) {
    // If passwords do not match, increment failed login attempts
    await User.updateOne(
      { userUsername },
      { $inc: { failedLoginAttempts: 1 } }
    );

    // Check if the account should be locked
    const updatedUser = await User.findOne({ userUsername });
    if (updatedUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      await User.updateOne({ userUsername }, { $set: { accountLocked: true } });
      throw new APIError(
        'Account locked. Contact Korex for assistance or reset Password',
        403
      );
    } else {
      throw new APIError(
        'Invalid Password 2 attempts left before access disabled',
        409
      );
    }
  }

  // Check if user is verified and account is not locked
  if (!user.isVerified) {
    throw new APIError('Please verify your email before log in.', 412);
  }

  if (
    user.accountLocked ||
    user.accountStatus === 'Suspend' ||
    user.accountStatus === 'Locked'
  ) {
    throw new APIError(
      'Your account is suspended or locked. Please contact the administrator for assistance.',
      423
    );
  }

  // Successful login - reset failed login attempts
  await User.updateOne({ userUsername }, { $set: { failedLoginAttempts: 0 } });

  // Generate an access token and a refresh token
  const userAccessToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    config.jwtSecret,
    { expiresIn: config.userAccessTokenExpireTime }
  );
  const userRefreshToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    config.jwtSecret,
    { expiresIn: config.userRefreshTokenExpireTime }
  );

  req.session.userAccessToken = userAccessToken;
  req.session.userRefreshToken = userRefreshToken;

  // Set the tokens as cookies
  res.cookie('userAccessToken', userAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('userRefreshToken', userRefreshToken, {
    httpOnly: true,
    secure: true,
  });

  // Check if the user has items in the cart // Determine the redirect URL based on whether the user has items in the cart
  const cart = req.session.cart || [];
  const hasItemsInCart = cart.length > 0;
  const userAuthRedirectUrl = hasItemsInCart
    ? '/user/shoppingcart'
    : '/user/index';
  req.session.userAuthRedirectUrl = userAuthRedirectUrl;

  res.status(200).json({
    userAuthRedirectUrl,
    success: true,
    message: 'User login successful',
  });
});

// refreshToken controller
const userRefreshToken = tryCatch((req, res) => {
  const userRefreshToken = req.cookies.userRefreshToken;

  if (!userRefreshToken) {
    return res.status(401).json({ message: 'User refresh token not provided' });
  }

  jwt.verify(
    userRefreshToken,
    config.jwtSecret,
    (err, decodedUserRefreshToken) => {
      if (err) {
        // Handle invalid refresh token
        throw new APIError('Invalid user refresh token', 403);
      } else {
        const newUserAccessToken = jwt.sign(
          { id: decodedUserRefreshToken.id },
          config.jwtSecret,
          { expiresIn: config.userAccessTokenExpireTime }
        );

        // Log message indicating a new access token is generated
        logger.info('New access token generated for user:', newUserAccessToken);

        res.cookie('userAccessToken', newUserAccessToken, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({ userAccessToken: newUserAccessToken });
      }
    }
  );
});

module.exports = {
  indexPage,
  singlePage,
  contactUsPost,
  loginPage,
  userLoginPost,
  userRefreshToken,
};
