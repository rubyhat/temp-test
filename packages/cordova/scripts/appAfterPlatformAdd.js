const config = require('../config');
const { execSync } = require('child_process')

module.exports = function() {
    const env = config.APP_ENV;
    execSync(`cp config/${env}/google-services.json platforms/android/app/google-services.json`);
    execSync(`cp config/${env}/GoogleService-Info.plist platforms/ios/Atlas/GoogleService-Info.plist`)
    return false;
}
