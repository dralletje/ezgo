'use strict'

let webpack = require('webpack')

module.exports = {
  entry: './source/entry.js',
  output: {
    path: __dirname + '/build/assets',
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime'],
        },
      },
      { test: /\.css$/, loader: 'style!css!autoprefixer-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ],
  },
}
