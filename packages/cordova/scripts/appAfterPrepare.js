const path = require('path');
const fs = require('fs');

module.exports = function() {
    const appPath = path.join(
        'platforms', 'android', 'app'
    );
    if (fs.existsSync(appPath)) {
        fs.copyFileSync('build-extras.gradle', path.join(appPath, 'build-extras.gradle'))
    }
}
