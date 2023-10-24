const cordovaRes = require('cordova-res');

// Throw error if UnhandledPromiseRejectionWarning
process.on('unhandledRejection', err => {
    console.error(err); // or err.stack and err.message or whatever you want
    process.exit(1);
});

async function run() {
    console.log('[SaaS Capacitor] Generating resources with cordova-res');
    const options = {
        directory: './',
        resourcesDirectory: 'resources',
        logstream: process.stdout, // Any WritableStream
        platforms: {
            android: {
                icon: { sources: ['resources/icon.png'] },
                splash: { sources: ['resources/splash.png'] },
            },
            ios: {
                icon: { sources: ['resources/icon.png'] },
                splash: { sources: ['resources/splash.png'] },
            },
        },
        skipConfig: true,
        copy: true, // copies generated resources into native projects,
        projectConfig: {
            android: {
                directory: './android'
            },
            ios: {
                directory: './ios'
            }
        }
    };

    await cordovaRes.run(options);
}
run();
