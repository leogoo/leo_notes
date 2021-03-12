### sourceMap
1. 源代码与打包后的文件映射关系
    ```js
    module.export = {
        devtool: "source-map"
    }
    ```
1. devtool参数
    - eval: eval包裹map
    - cheap: 较快，只管行信息
    - source-map：生成.map文件
    - module： 第三方库，包含loader的map
    - inline-source-map: 将map注入到打包文件
1. 推荐配置： 
    - devtool: "cheap-module-eval-source-map", // 开发环境
    - devtool: "cheap-module-source-map" // 生产环境

### WebpackDevServer
1. 跨域
```js
module.export = {
    // 不会生成打包文件，直接存在内存里
    devServer: {
        contentBase: './build',
        open: true，// 打开浏览器
        port: '8080'，
        // 设置代理，可以用于mock数据解决跨域问题
        proxy: {
            "/api": {
                target: "http://localHost:9090"
            }
        }
    }
}
```
1. Hot Module Replace,HMR 热更新,不用刷新浏览器
    ```js
    const webpack = require('webpack');
    module.export = {
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            hot: true,// 开启热更新
            hotOnly: true, // 即使热更新失败，浏览器也不刷新
        }
    }
    ```
1. js模块主动热更新，入口文件
    ```js
    // js
    if (module.hot) {
        module.hot.accpet('./a.js', () => {

        })
    }
    ```

### webpack-merge
```js
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map'
};

module.export = merge(commonConfig, devConfig);
```

### 性能优化
##### tree shaking
> 依赖ES6的静态分析,在预编译时便确定要引入的模块。tree shaking只对es6模块生效。

1. tree shaking会消除导入的模块中并不会被使用的export，export default会导出整个模块，因此tree shaking会失效。
1. webpack生产环境
1. babel默认是编译成commonJS模块，需要配置
    ```js
    {
        "presets": [
            [
                "@babel/env",
                {
                    "modules": false
                }
            ],
        ]
    }
    ```
1. 副作用即使是无用的，webpack也不会消除
    1. polyfill没有用export导出，webpack会认为是无用代码
    1. css-loader生成的css模块也被webpack认为是无用代码
    1. 指定为副作用的文件，就不被消除掉
    ```js
    // package.json
    // "sideEffects": false
    "sideEffects": [
        "./src/polyfill.js",
        "*.@(css|sass|scss)",
    ]
    ```
1. 移除loash中的无用代码
    1. babel-plugin-lodash，配置babel即可
        ```js
        "plugins": ["lodash"]
        ```
    1. lodash-webpack-plugin， 配置webpack
        ```js
        plugins: [ new LodashModuleReplacementPlugin()]
        ```

##### code splitting
1. 打包的时候将不会改变的公共库分离出来打包，生成多个文件，可以通过多入口方式方式实现，也可以使用optimiztion
    ```js
    module.export = {
        optimization: {
            splitChunks: {
                chunks: 'all', // 对同步和异步引入的模块都有效
                minSize: 30000, // 模块分割的最小size
                miniChunks: 2, // 分割的模块只要被引用两次
                name: true, // 可设置chunk名字
                cacheGroups: {
                    vendor: {
                        test: //
                        priority: 10,
                        filename: '' // 重置名字
                    },
                    default: {

                    }
                }
            }
        }
    }
    ```
1. code spliting的作用是为了将打包文件分割并行加载，同时不变的文件可以被浏览器缓存，通过chunkHash来区分文件内容是否有变化
    - hash：构建的hash，重新构建则所有文件都会变
    - chunkHash: 只和chunk内容有关，内容不变则不会变
    - contentHash: 只与文件内容有关

    ```js
        output: {
            filename: '[name].[chunkhash:8].js'
        }
    ```

##### webpackPrefetch
异步加载js代码，在浏览器空闲时加载部分js代码，提高渲染性能
```js
document.addEventListener('click', () => {
    import(/* webpackPrefetch: true */'./click.js').then(({ default: func }) => {
        func()
    })
})
```

##### dll动态链接库
事先把常用但又构建时间长的代码提前打包好（例如 react、react-dom），取个名字叫 dll。后面再打包的时候就跳过原来的未打包代码，直接用 dll。这样一来，构建时间就会缩短，提高 webpack 打包速度
1. dll打包脚本，相当于第一次请求资源的缓存，创建映射表
    ```js
    // webpack.dll.js
    const path = require('path');
    const webpack = require('webpack');

    module.exports = {
        mode: 'production',
        entry: {
            react: ['react', 'react-dom'],
        },
        // 这个是输出 dll 文件
        output: {
            path: path.resolve(__dirname, '../dll'),
            filename: '_dll_[name].js',
            library: '_dll_[name]',
        },
        // 这个是输出映射表
        plugins: [
            new webpack.DllPlugin({ 
                name: '_dll_[name]', // name === output.library
                path: path.resolve(__dirname, '../dll/[name].manifest.json'),
            })
        ]
    };
    ```
1. 链接dll文件
    ```js
    const path = require('path');
    const webpack = require('webpack');

    module.export = {
        // ...
        plugins: [
            new webpack.DllReferencePlugin({
                // 注意: DllReferencePlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
                context: path.resolve(__dirname, '../'),
                manifest: path.resolve(__dirname, '../dll/react.manifest.json'),
            })
        ]
    }
    ```

##### happyPack
多进程并行执行
```js
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });// 并行数等于CPU数

module.export = {
    module: {
        rules: [
            {
                test: /.\js$/,
                //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
                loader: 'happypack/loader?id=happyBabel'
            }
        ]
    },
    plugins: [
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        })
    ]
}
```
