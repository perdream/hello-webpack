//wepack -p/--watch
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //extract-text-webpack-plugin 已经被放弃，现在使用mini-css-extract-plugin插件（webpack4 以上才能使用）
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

//判断是生产环境还是开发环境
let isProd = process.env.NODE_ENV === 'production' ? true : false
console.log(isProd)
let cssDev = ['style-loader', {
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
let cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //resolve-url-loader may be chained before sass-loader if necessary
    use: ['css-loader', 'sass-loader']
})

module.exports = {
    entry: {
        app: './src/app.jsx',
        app2: './src/app2.js' //打包另一个名为app2的js
    },
    output: {
        path: __dirname + '/dist',
        filename: isProd ? '[name].[hash].js' : '[name].[chunkhash].js' //name:entry中的路径名称(当前为: app)，chunkhash根据js里的不同内容进行生成
    },
    //webpack-dev-server 本地开启服务
    //output中的publicPath影响资源生成路径，devServer中的publicPath影响资源在本地开发环境中的访问
    devServer: {
        port: 9000, //服务端口
        open: true, //保存自动打开浏览器
        hot: true, //模块热替换，不刷新浏览器更新
        contentBase: path.join(__dirname, "/dist")
    },
    plugins: [
        new CleanWebpackPlugin(), //build 之前把它们全清空，是 clean-webpack-plugin 发挥的作用
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            // title: 'hello-webpack', //更改html title
            template: './src/index.html', //生成的html模板
            filename: 'hello.html',
            minify: {
                collapseWhitespace: true, //文件的内容的没用空格去掉，减少空间
                removeComments: true //去掉注释
            },
            hash: true, //为了更好的 cache,对比内容hash值，判断内容是否变化
            excludeChunks: ['app2'] //不引入名为app2的js文件
        }),
        //配置多个html
        new HtmlWebpackPlugin({
            template: './src/index2.html',
            filename: 'hello2.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['app2'] //引入app2.js文件
        }),
        /*
            打包时发现，js和js引入的css的 chunkhash 是相同的，导致无法区分css和js的更新，如下
        　　index2-ddcf83c3b574d7c94a42.css
        　　index2-ddcf83c3b574d7c94a42.js
            原因是因为webpack的编译理念，webpack将css视为js的一部分，所以在计算chunkhash时，会把所有的js代码和css代码混合在一起计算 *解决:css是使用 ExtractTextPlugin 插件引入的，这时候可以使用到这个插件提供的 contenthash ，如下(使用后css就有独立于js外的指纹了)，
        */
        new ExtractTextPlugin({
            filename: 'css/style.[chunkhash:8].css',
            disable: !isProd //是否启用
        }),

        //webpack配置ProvidePlugin后，在使用时将不再需要import和require进行引入，直接使用即可。
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
            {
                test: /\.s[ac]ss$/i,
                use: isProd ? cssProd : cssDev
            },
            // 这两行是处理 react 相关的内容
            {
                test: /\.js[x]$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                /*  上面指定了fallback，是必须的，在webpack4.x下，不要配置下面这个file-loader，因为这里我遇到了坑，先是配置了上面的
                    url-loader,然后配置了下面的file-loader，最后图片文件是按照配置生成了，但是却不引用，没生效，页面没有加载，同时配置了下面这个
                    还影响了页面中base64显示图片，不会加载出来，但是当我把下面这个配置删除时，执行npm run dev打包时却显示找不到file-loader，搞了
                    很久，才试出来，需要在url-loader中配置fallback来显示指定备用方法指向file-loader，这样才有效果，同时，上面指定fallback，也不要
                    配置下面这个file-loader，否则依然不起效果
                */
                use: [{
                        loader: 'url-loader',
                        options: {
                            //当加载的图片小于limit时，会将图片编译成base64字符串的形式,
                            //当图片大于这个limit，会用file-loader进行加载
                            // limit: 13000,
                            //在webpack4.x必须显式的指定fallback备用方法，这里指定为file-loader
                            fallback: require.resolve('file-loader'),
                            // encoding: "base64",
                            //这个表示在打包生成的文件的名字，如果不配置这个，会根据hash生成一个名字，这个配置就是自定义命名规则
                            //这个表示会在输出文件夹dist下创建一个img文件夹，所有的文件会以 “原名字+hash值8位+文件扩展名”生成最终的文件来供使用
                            // name: "img/[name].[hash:8].[ext]",
                        }
                    },
                    // {
                    //     loader: 'file-loader',
                    // },
                ]
            },
            //html文件处理
            {
                test: /\.htm[l]/,
                loader: 'html-loader',
                options: {
                    minimize: true //压缩html
                }
            }
        ]
    },
    //模块引入路径相关
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
        //设置各种别名
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    //开发时方便调试js和css(浏览器中定位错误代码位置)
    devtool: 'source-map'
}