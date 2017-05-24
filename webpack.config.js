var Path = require("path")
var webpack = require('webpack')


module.exports = {
  context: __dirname,

  entry: './js/index', // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
      path: Path.resolve('./static/'),
      filename: "main.js",
  },

  plugins: [
  ],

  module: {
	 loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
     ]
  },

  resolve: {
   extensions: ['', '.js', '.jsx']
  },
}
