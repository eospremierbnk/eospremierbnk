const buildProLogger = require('./prodLogger');
const buildDevLogger = require('./devLogger');
const config = require('../src/configs/customEnvVariables');

let logger = null;
if (config.nodeEnv === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProLogger();
}

module.exports = logger;
