const path = require('path');

const withTS = require('@zeit/next-typescript');
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const nextConf = require('../next.config');

module.exports = async ({ config, mode }) => {
    const defaultLoaders = {
        babel: config.module.rules[0].use,
        hotSelfAccept: true
    };
    config.optimization.splitChunks.cacheGroups = {};
    config.plugins.push(new ForkTSCheckerWebpackPlugin());
    return withTS(nextConf).webpack(config, {
        dir: path.join(__dirname, '..'),
        defaultLoaders,
        isServer: false,
        dev: true
    });
};
