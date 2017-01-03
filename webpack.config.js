var webpack = require('webpack');
var BowerWebpackPlugin = require("bower-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/js/script.js',
    output: {
        filename: 'cdp.js',
        path: './build/js',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components']
    },
    plugins: [
        new ExtractTextPlugin('../css/cdp.css', { allChunks: true }),
        new BowerWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: 'node_modules',
                query: {
                    presets: [ 'es2015' ]
                }
            },


            { test: /\.less$/,  loader: ExtractTextPlugin.extract('css-loader!less-loader?sourceMap') },
            { test: /\.css$/,   loader: ExtractTextPlugin.extract('css-loader?sourceMap') },  
            { test: /\.png$/,   loader: 'file-loader?name=../images/[hash].[ext]' },
            { test: /\.svg$/,   loader: 'file-loader?name=../images/[hash].[ext]' },
            { test: /\.ttf$/,   loader: 'file-loader?name=../fonts/[hash].[ext]' },
            { test: /\.eot$/,   loader: 'file-loader?name=../fonts/[hash].[ext]' },
            { test: /\.woff$/,  loader: 'file-loader?name=../fonts/[hash].[ext]' },
            { test: /\.woff2$/, loader: 'file-loader?name=../fonts/[hash].[ext]' }
        ]
    }
};
