### 什么是babel
1. javascript编译器，es6转换为es5
1. 通过插件构建，就是插件集合

### babel使用
1. 利用配置文件babel.config.js编译
    1. 安装：
        `yarn add -D @babel/core @babel/cli @babel/preset-env`
        `yarn add @babel/polyfill`
    1. 配置文件babel.config.js
    ```js
    const presets = [
        ["@babel/env", {
            targets: {
            edge: "17",
            firefox: "60",
            chrome: "67",
            safari: "11.1"
            },
            useBuiltIns: "usage"
        }]
    ];
    module.exports = {presets};
    ```
    1.  编译
    将src下所有文件编译到dist中
    ```js
    npx babel src --out-dir dist
    // 等同于
    npx babel src -d dist
    ```
1. 接口方式编译代码
    ```js
    // build.js，直接执行该文件
    const babel = require("@babel/core");
    const code = `
        const sayHi = () => {
            console.log(11111);
        };
        sayHi();
    `
    const optionsObject = {};
    result = babel.transform(code, optionsObject);
    console.log(result.code);
    ```
1. 指定插件编译
    ```js
    "script": {
        "build:env": "babel src -d dist --presets=@babel/env"
    }
    ```
1. polyfill与preset-env
    1. env preset只会为目标浏览器中没有的功能加载转换插件
    1. polyfill完整模拟ES2015+环境