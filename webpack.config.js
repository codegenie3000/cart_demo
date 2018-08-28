const path = require('path');

module.exports = {
    entry: './src/js/main.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options:  {
                    presets: ['es2015']
                }
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public')
    },
    devtool: 'source-map',
    watch: true
};

