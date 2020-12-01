## 问题-:关于配置了 webpack-dev-server 和 clean-webpack-plugin 导致每次启动服务时会清空 dist 目录下 build 的文件

webpack-dev-server 就是借助其中的一个依赖库 webpack-dev-middleware 来实现热更新的
webpack-dev-server 启动了一个使用 express 的 Http 服务器，这个服务器与客户端采用 websocket 通信协议，当原始文件发生改变，webpack-dev-server 会实时编译
综上所述 webpack-dev-server 的运行会导致 webpack 进行编译 就调用了 clean-webpack-plugin 来清空 dist 目录下的文件
原来 webpack-dev-server 将 webpack 编译生成文件打包到了内存中，不生成文件的原因就在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销，这一切都归功于 memory-fs，memory-fs 是 webpack-dev-middleware 的一个依赖库，webpack-dev-middleware 将 webpack 原本的 outputFileSystem 替换成了 MemoryFileSystem 实例，这样代码就将输出到内存中。所以导致我们也看不到 dist 目录下的文件 但是却可以通过 webpack-dev-server 启动的服务访问到他们。

如果想要每次重新编译生成文件 可以设置下面的选项：
    devServer: {
        index: 'index.html',
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        hot: true, //Hot module replacement
        port: 9000,
        writeToDisk:true, // 这个选项！！！！
        open: 'chrome' //open in chrome
    }

参考博客：[关于配置了 webpack-dev-server 和 clean-webpack-plugin 导致每次启动服务时会清空 dist 目录下 build 的文件](https://www.jianshu.com/p/435ad3e20e6c)