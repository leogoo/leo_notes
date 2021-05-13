## 什么是babel
1. javascript编译器，es6转换为es5
1. 通过插件构建，就是插件集合
1. Babel核心,@babel/core 就是“微内核”架构中的内核。这个内核主要处理这些事情：
    - 加载并处理配置
    - 加载插件
    - 将代码通过Parse转换成AST
    - 调用Traverser遍历整个AST，并使用访问者模式对AST进行转换
    - 生成代码，包括SourceMap转换和源代码生成
1. [Babel插件](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)<br>
Babel的插件本质上就是一个个函数，在Babel对AST语法树进行转换的过程中进行介入，通过相应的操作，最终让生成的结果进行改变。
在.babelrc中的presets中的预设其实就是一组插件的集合，如果不在.babelrc中加入预设或者插件告诉babel要做什么，那么babel不会对代码进行“翻译”。同时parser是不支持扩展的，由官方进行维护。可以通过@区分插件是否由官方进行维护

## babel使用
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

## polyfill
1. polyfill与preset-env
    1. env preset只会为目标浏览器中没有的功能加载转换插件
    1. polyfill完整模拟ES2015+环境
1. polyfill使用方式
    1. module顶部手动引入@babel/polyfill
    2. 配置babelrc 
        ```js
        {
            "presets": [
                ["@babel/preset-env", {
                    "useBuiltIns": false
                }]
            ],
        }
        ```
        同时webpack入口处配置
        ```js
        entry: {
            app: ['@babel/polyfill', './main.js']
        }
        ```
    3. 配置useBuiltIns为entry,在入口文件出手动引入@babel/polyfill
        ```js
        {
            "preset": [
                ["@babel/env", {
                    'useBuiltIns': 'entry',
                    'modules': false, // 不开启将 ES6 模块语法转换为其他模块语法
                    'corejs': 2,
                    "include": [], // 插件数组，这些插件总是被使用，即使不需要
                    "exclude": [], // 插件数组，这些插件将不会被使用, 即使目标环境需要
                }]
            ]
        }
        ```
    4. 配置useBuiltIns为usage实现按需加载，注意，这里按需加载是指每个module，也就是每个文件都会导入需要的polyfill
1. 工程中可以用上面的第三种方法来引入@babel/polyfill，同时对配置exclude来最小化打包的体积
1. 用@babel/plugin-transform-regenerator可以注入辅助函数，防止polyfill污染全局变量例如Promise、Set

## Babel 处理流程
1. 编译器的三个过程
    - 解析Parsing：代码字符串经过分词与语法分析解析成抽象语法树(AST)
        - 分词：词法分析器会将字符串形式的代码转换为Tokens，Tokens是一组由语法片段组成的数组
            <br/><img src="https://pic2.zhimg.com/80/v2-bd9aa823b91ccf9f0187c6fd590737f9_720w.jpg" /><br/>
        - 语法分析：建立分析语法单元之间的关系，形成AST树
    - 转换(Transformation)：对抽象语法树进行转换操作。插件应用于此流程
    - 生成(Code Generation): 根据变换后的抽象语法树再生成代码字符串

## Babel工具集
1. 核心支持类
Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。对应着babel-core源码中分别用到的babylon、babel-traverse、babel-generator。
    - @babel/parser: Babel中使用的JavaScript解析器。默认启用ES2017，支持JSX，Flow，TypeScript
    - @babel/traverse: 实现了访问者模式，对AST进行遍历，插件可以通过它获取相应的AST节点，并对对应节点进行具体操作。
    - @babel/generator: 它将AST转换成源代码，同时支持SourceMap
1. 插件开发辅助类：
    - @babel/template: 它是一个虽然很小但非常有用的模块。主要能让你它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成的大规模 AST的时候很有用。
    - @babel/types: 是一个用于 AST 节点的 Lodash 式工具库，包含构造节点，验证节点以及变换AST节点的方法。插件开发时使用很频繁。
    - @babel/helper: 它用于辅助代码，单纯的语法转换可能无法让代码运行起来，比如低版本浏览器无法识别class关键字，这时候需要添加辅助代码，对class进行模拟。

## babel进阶
#### visitors
1. 访问者是一个用于 AST 遍历的跨语言的模式。 简单的说它们就是一个对象，定义了用于在一个树状结构中获取具体节点的方法
1. 下面的列子，遍历中每当在树中遇见一个Identifier的时候会调用 Identifier() 方法
    ```js
    const MyVistor = {
        Identifier() {
            console.log("Called");
        }
        // Identifier() { ... } 是 Identifier: { enter() { ... } }
    }
    ```
1. 实际上有两次机会来访问一个节点
    ```js
    const MyVisitor = {
        Identifier: {
            enter() {
                console.log("Entered!");
            },
            exit() {
                console.log("Exited!");
            }
        }
    };
    ```
#### Path
1. Path 是表示两个节点之间连接的对象
1. 将子节点 Identifier 表示为一个路径（Path）
    ```js
    {
        type: "FunctionDeclaration",
        id: {
            type: "Identifier",
            name: "square"
        },
        ...
    }
    // 结果
    {
        "parent": {
            "type": "FunctionDeclaration",
            "id": {...},
            ....
        },
        "node": {
            "type": "Identifier",
            "name": "square"
        }
    }
    ```
1. 路径的其他元数据
    ```js
    {
        "parent": {...},
        "node": {...},
        "hub": {...},
        "contexts": [],
        "data": {},
        "shouldSkip": false,
        "shouldStop": false,
        "removed": false,
        "state": null,
        "opts": null,
        "skipKeys": null,
        "parentPath": null,
        "context": null,
        "container": null,
        "listKey": null,
        "inList": false,
        "parentKey": null,
        "key": null,
        "scope": null,
        "type": null,
        "typeAnnotation": null
    }
    ```
1. 当有一个Identifier()成员方法的访问者时，你实际上是在访问路径而非节点。通过这种方式，你操作的就是节点的响应式表示（译注：即路径）而非节点本身

#### Scopes（作用域）

1. 作用域可以被表示为如下形式：
    ```js
    {
        path: path,
        block: path.node,
        parentBlock: path.parent,
        parent: parentScope,
        bindings: [...]
    }
    ```

1. Bindings（绑定）所有引用属于特定的作用域，引用和作用域的这种关系被称作：绑定（binding）

## babel-types
> ast节点的工具库

```js
import * as babylon from "babylon";
import traverse from "babel-traverse";
import * as t from "babel-types";

const code = `function square(n) {
  return n * n;
}`;
const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

#### Definitions（定义）
Babel Types模块拥有每一个单一类型节点的定义，包括节点包含哪些属性，什么是合法值，如何构建节点、遍历节点，以及节点的别名等信息
[astexplorer](https://astexplorer.net/)[常用的节点类型](https://segmentfault.com/a/1190000015660623)

单一节点类型的定义形式如下：
```js
defineType("BinaryExpression", {
    builder: ["operator", "left", "right"],
    fields: {
        operator: {
            validate: assertValueType("string")
        },
        left: {
            validate: assertNodeType("Expression")
        },
        right: {
            validate: assertNodeType("Expression")
        }
    },
    visitor: ["left", "right"],
    aliases: ["Binary", "Expression"]
});
```
#### Builders（构建器）
上例中，`builder: ["operator", "left", "right"]`
按类似下面的方式使用：`t.binaryExpression("*", t.identifier("a"), t.identifier("b"));`
可以创建如下所示的 AST：
```js
{
  type: "BinaryExpression",
  operator: "*",
  left: {
    type: "Identifier",
    name: "a"
  },
  right: {
    type: "Identifier",
    name: "b"
  }
}
```
当打印出来之后是这样的：`a * b`

#### Validators（验证器）
BinaryExpression 的定义还包含了节点的字段 fields 信息，以及如何验证这些字段。
有两种验证方式
1. isX, 第二个参数来确保节点包含特定的属性和值
    ```js
    t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
    ```
1. 断言式的版本，会抛出异常而不是返回 true 或 false。.
    ```js
    t.assertBinaryExpression(maybeBinaryExpressionNode);
    t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
    // Error: Expected type "BinaryExpression" with option { "operator": "*" }
    ```
