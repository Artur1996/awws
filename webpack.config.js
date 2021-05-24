const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            "fs": false,
            "net": false,
            "stream": require.resolve("stream-browserify"),
        },
    },
    mode: 'development',
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        })
    ],
};