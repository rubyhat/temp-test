require('dotenv').config()

module.exports = require(`./${process.env.APP_ENV || 'testing'}.js`);
