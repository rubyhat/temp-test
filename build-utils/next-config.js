const CircularDependencyPlugin = require('circular-dependency-plugin');
const zeitWithSourceMaps = require('@zeit/next-source-maps')({
    devtool: 'hidden-source-map',
});

exports.withResolve = (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config, options) {
        const { resolveDirs } = nextConfig;
        config.resolve.modules = [...config.resolve.modules, ...resolveDirs];
        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
    },
});

exports.withCircularDepsCheck = (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config, options) {
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
            })
        );

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
    },
});

exports.withSourceMaps = (nextConfig = {}) => {
    if (process.env.SOURCEMAPS) {
        return zeitWithSourceMaps(nextConfig);
    }

    return nextConfig;
};
