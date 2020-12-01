const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
    // const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    entry: {
        app: './src/app.jsx',
        app2: './src/app2.js'
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'hello.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            },
            hash: true,
            excludeChunks: ['app2']
        }),
        new HtmlWebpackPlugin({
            template: './src/index2.html',
            filename: 'hello2.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['app2']
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],

    module: {
        rules: [{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: isProd ? cssProd : cssDev
            // },
            {
                test: /\.js[x]$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        fallback: require.resolve('file-loader')
                    }
                }]
            },
            {
                test: /\.htm[l]/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
}