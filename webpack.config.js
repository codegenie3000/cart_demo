/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

const path = require('path');

module.exports = {
    entry: './src/main.js',
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query:  {
                    presets: ['es2015']
                }
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public')
    },
    devtool: 'source-map'
};

