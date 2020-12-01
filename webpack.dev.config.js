const config = require('./config')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

const devObj = merge(common, {
    output: {
        path: __dirname + '/dist',
        filename: '[name].[hash].js'
    },
    devServer: {
        port: 9000,
        open: true,
        hot: true,
        contentBase: path.join(__dirname, "/dist")
    },
    module: {
        rules: [{
            test: /\.s[ac]ss$/i,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                }
            }]
        }]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': config.getDevelopEnv()
        })
    ],
    devtool: 'inline-source-map'
})
module.exports = devObj