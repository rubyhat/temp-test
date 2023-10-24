const config = require('../config');
const { execSync } = require('child_process')

module.exports = function() {
    const env = config.APP_ENV;
    execSync(`cp -r res/icon/${env} res/icon/current`);
    return false;
}
