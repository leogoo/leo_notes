### loader和plugin定义
1. loader是一个转换器，对模块的源代码进行转换，比如将A.less转换为A.css
1. plugin是扩展器，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点

### loader
1. webpack配置loader
    ```js
    module:{
        rules:[
            {
                test:/\.js$/,
                use: 'test-loader'
            }
        ]
    },
    resolveLoader: {
        modules: ['./node_modules', './loader'] // 配置loader的查找目录
    }
    ```
1. style-loader
> css-loader执行后返回js字符串，style-loader没法处理样式。先执行style-loader，在它里面去执行css-loader，拿到经过处理的CSS内容，再插入到DOM中

    ```js
    const loaderUtils = require('loader-utils');
    module.exports.pitch = function(remainingRquest, precedingRequest, data) {
        const script = (
            `
            const style = document.createElement('style');
            ${ /* pitch跳过css-loader，在style-loader内调用 css-loader 来处理样式文件 */ } 
            style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRquest)});
            document.head.appendChild(style);
            `
        )
        return script;
    }
    ```
1. file-loader：处理图片、excel、字体等非js文件，直接复制到打包文件目录下，导入的是路径
    ```js
    module.export = {
        module: {
            // 模块处理规则
            rules: [
                {
                    test: /.\jepg$/,
                    use: {
                        loader: "file-loader",
                        // name是原文件名，ext是扩展名
                        name: "[name]_[hash].[ext]"，
                        // 打包目录下的路径
                        outputPath: "images/"
                    }
                }
            ]
        }
    }
    ```
1. url-loader是file-loader的升级版，可以将图片处理为base64，导入的就是base64的字符串
    ```js
     module.export = {
        module: {
            rules: [
                {
                    test: /.\jepg$/,
                    use: {
                        loader: "url-loader",
                        // name是原文件名，ext是扩展名
                        name: "[name]_[hash].[ext]",
                        // 超过size大小的限制就退化为file-loader,否则base64处理减少http请求
                        limit: 2049
                    }
                }
            ]
        }
    }
    ```
1. postcss-loader: 添加浏览器前缀
    ```js
    module.export = {
        module: {
            rules: [
                {
                    test: /.\css$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                indent: '',
                                plugins: [
                                    require("autoprefix"),
                                    // ...
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    }
    ```
1. babel-loader
    1. @babel/polyfill, 全局变量方式注入
    ```js
    module.export = {
        module: {
            rules: [
                {
                    test: /.\js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        target: {
                                            "Android": '6.0'
                                        },
                                        useBuildIns: "usage" // polyfill按需加载, 实验性功能
                                        corejs: 2
                                    }
                                ]
                            ]

                        }
                    }
                }
            ]
        }
    }
    ```
    1. @babel/plugin-transform-runtime
        1. 不会全局污染,也不会对原型上的方法进行polyfill
        1. 安装： @babel/plugin-transform-runtime @babel/transform
            ```js
            module.export = {
                module: {
                    rules: [
                        {
                            test: /.\js$/,
                            exclude: /node_modules/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    plugins: ["@babel/plugin-transform-runtime"]
                                }
                            }
                        }
                    ]
                }
            }
            ```

### 自定义loader
1. loader就是一个简单的声明式普通函数，最模块的源码进行操作
    ```js
    // loader-utils是专门用于自定义loader时的一些工具函数
    const loaderUtils = require('loader-utils');

    module.exports = function(source) {
        // stringifyRequest(this, itemUrl) 转为相对路径
        const {stringifyRequest, getOptions } = loaderUtils; 
        const options = getOptions(this); // getOptions用于获取配置

        return source;
    }

    // remainingRequest 下一个loader
    module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    }
    ```
1. 在webpack的配置的中，是按从右到左的顺序执行loader，在执行loader之前还会先执行pitch，如果pitch返回了结果就会跳过loader
    ```js
    // 实际执行顺序
    |- a-loader `pitch`
    |- b-loader `pitch`
        |- c-loader `pitch`
        |- requested module is picked up as a dependency
        |- c-loader normal execution
    |- b-loader normal execution
    |- a-loader normal execution
    ```
1. loader-utils，用来处理loader配置的options参数
1. this.query是loader传的options
1. this.data: pitch阶段和正常阶段共享数据
1. this.callback，除了转换的内容还需要返回其他内容，如sourceMap，Ast。loader函数里需要返回undefined
    ```js
    module.export = function (source) {
        this.callback({
            // 无法装换原内容时的Error
            err: Error || null,
            // 装换后的的内容，如上述的source
            content: string | Buffer,
            // 用于通过装换后的内容得出原内容的Source Map，方便调试
            // 我们了解到，SourceMap我们只是会在开发环境去使用，于是就会变成可控制的，
            // webpack也提供了this.sourceMap去告诉是否需要使用sourceMap，
            // 当然也可以使用loader的option来做判断，如css-loader
            sourceMap?: SourceMap,
            // 如果本次转换同时生成ast语法树，也可以将这个ast返回，方便后续loader需要复用该ast，这样可以提高性能
            abstractSyntaxTree? AST
        })
        return;
    }
    ```
1. this.async处理loader里的异步事件，loader函数入参的源代码，也要返回处理后的代码字符串
    ```js
    module.export = function (source) {
        // source是模块代码的字符串
        const callback = this.async();
        setTimeout(() => {
            // 第一个参数是err
            // result是source处理后的结果
            callback(null, result);
        }, 1000);
    }
    ```

### plugins
类似生命周期，在构建过程中利用钩子函数做一些处理
1. html-webpack-plugin，生成html文件，并将打包产出的js文件导入html
    1. html中读取配置项参数
        ```js
        // webpack.config.js
        plugins: [new HtmlWebpackPlugin({
            template: '',
            filename: '',
            title: '',
            inject: true | 'body' | 'head', // true或body导入的js资源放在body
        })]

        // html
        htmlWebpackPlugin.options.title
        ```
1. clean-webpack-plugin, 打包前删除之前的生成目录
    ```js
    const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    module.export = {
        plugins: [
            new CleanWebpackPlugin()
        ]
    }
    ```
1. mini-css-extract-plugin，抽离css文件,利用<link>注入样式文件，不再使用style-loader注入样式
    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    module.export = {
        module: {
            rules: [
                {
                    test: /.\css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ]
    }
    ```
### 自定义plugin
1. 重要的定义:
    1. compiler：包含了 Webpack 环境所有的的配置信息, 全局唯一的，可以简单地把它理解为Webpack实例
        - compile: 一个新的编译(compilation)创建之后，钩入(hook into) compiler
        - compilation: 编译(compilation)创建之后，执行插件， 参数compilation
    1. compilation：构建过程中的某个模块, Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等
    1. Tapable: webpack用来创建钩子的库， 提供9中hook
        - tap：可以注册同步钩子也可以注册异步钩子
        - tapAsync：回调方式注册异步钩子
        - tapPromise：Promise方式注册异步钩子
1. compiler钩子和compilation钩子
    ```js
    class TestWebpackPlugin {
        constructor (options) {
            this.options = options
        }
        apply(compiler) {
            compiler.hooks.compilation.tap('Test', (compilation) => {
                console.log('compilation')
                compilation.hooks.chunkAsset.tap('Test', (chunk, filename) => {
                    console.log(chunk)
                    console.log(filename)
                })
            })
        }
    }
    ```