var Path = require("path")
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var cssOutputPath =  'app.[hash].css'
var jsOutputPath = 'app.[hash].js'
var ExtractSASS = new ExtractTextPlugin(cssOutputPath);


module.exports = {
        context: __dirname,

        entry: [
            Path.join(__dirname, './src/app/index')
        ],

        output: {
            path: Path.join(__dirname, './templates/'),
            filename: jsOutputPath,
        },

        plugins: [
            new HtmlWebpackPlugin({
            template: Path.join(__dirname, './src/index.html'),
            }),
            ExtractSASS
        ],

        module: {
            loaders: [{
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    cacheDirectory: true
                },
                include: Path.join(__dirname, './src/app/'),
                exclude: Path.join(__dirname, './node_modules/')
            }, {
                test: /\.scss$/,
                loader: ExtractSASS.extract(['css-loader', 'sass-loader']),
                include: Path.join(__dirname, './src/app/'),
                exclude: Path.join(__dirname, './node_modules/')
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },
}
