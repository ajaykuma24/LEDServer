var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        vendor: [path.join(__dirname, "dll", "vendors.js")]
    },
    output: {
        path: path.join(__dirname, "public", "dll"),
        filename: "dll.[name].js",
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "dll", "[name]-manifest.json"),
            name: "[name]",
            context: path.resolve(__dirname)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    resolve: {
        modules: [path.resolve(__dirname), "node_modules"]
    }
};