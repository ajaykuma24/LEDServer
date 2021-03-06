var Path = require("path")
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var cssOutputPath = './static/app.css'
var jsOutputPath = './static/app.js'
var ExtractSASS = new ExtractTextPlugin(cssOutputPath);


module.exports = {
    context: __dirname,

    entry: [
        Path.join(__dirname, './src/app/index')
    ],

    output: {
        path: Path.join(__dirname, './public/'),
        filename: jsOutputPath,
    },

    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new HtmlWebpackPlugin({
            template: Path.join(__dirname, './src/index.html'),
            hash: true
        }),
        ExtractSASS,
        new webpack.DllReferencePlugin({
            context: Path.join(__dirname),
            manifest: require("./dll/vendor-manifest.json")
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],

    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'react']
            },
            include: Path.join(__dirname, './src/app/'),
            exclude: Path.join(__dirname, './node_modules/')
        }, {
            test: /\.scss$/,
            loader: ExtractSASS.extract(['css-loader', 'sass-loader']),
            include: Path.join(__dirname, './src/app/'),
            exclude: Path.join(__dirname, './node_modules/')
        }]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },
    cache: true
}