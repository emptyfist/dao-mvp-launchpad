const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve.extensions = ['.ts', '.js'];
    config.resolve.fallback = {
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process',
            Buffer: ['buffer', 'Buffer'],
        })
    );

    return config;
};
