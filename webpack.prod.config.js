const config = require('./config')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path')
module.exports = merge(common, {
    output: {
        path: __dirname + '/dist',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'css/style.[contenthash:8].css',
            disable: false
        }),
        new webpack.DefinePlugin({
            'process.env': config.getBuildEnv()
        })
    ],
    module: {
        rules: [{
            test: /\.s[ac]ss$/i,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        }, ]
    },
})