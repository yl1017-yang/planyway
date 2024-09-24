const path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        path: path.join(__dirname, '../frontend/build'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    target: 'node',
};
