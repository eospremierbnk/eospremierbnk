require('dotenv').config();

const config = {
  port: process.env.PORT,

  nodeEnv: process.env.NODE_ENV || 'development',

  baseUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_BASE_URL
      : process.env.PROD_BASE_URL,

  MongoDbURI: process.env.MONGODB_URI,

  sessionSecret: process.env.SESSION_SECRET,

  jwtSerectResetPassword: process.env.JWT_SECRET_RESET_PASSWORD,

  maxFailedAttempt: process.env.MAX_FAILED_ATTEMPTS,

  jwtSecret: process.env.JWT_SECRET,

  userAccessToken: process.env.USER_ACCESS_TOKEN,
  userRefreshToken: process.env.USER_REFRESH_TOKEN,
  userAccessTokenExpireTime: process.env.USER_ACCESS_TOKEN_EXPIRATION_TIME,
  userRefreshTokenExpireTime: process.env.USER_REFRESH_TOKEN_EXPIRATION_TIME,

  adminAccessToken: process.env.ADMIN_ACCESS_TOKEN,
  adminRefreshToken: process.env.ADMIN_REFRESH_TOKEN,
  adminAccessTokenExpireTime: process.env.ADMIN_ACCESS_TOKEN_EXPIRATION_TIME,
  adminRefreshTokenExpireTime: process.env.ADMIN_REFRESH_TOKEN_EXPIRATION_TIME,

  mailerService: process.env.MAILER_SERVICE,
  nodemailerEmail: process.env.NODEMAILER_EMAIL,
  nodemailerPassword: process.env.NODEMAILER_PASSWORD,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiName: process.env.CLOUDINARY_API_NAME,
  cloudinarySecretName: process.env.CLOUDINARY_SECRET_NAME,

  companyEmail: process.env.COMPANY_EMAIL,
  companyNumber: process.env.COMPANY_NUMBER,
};

module.exports = config;
