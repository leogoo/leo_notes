### js模块规范
1. CommonJs
    1. 定义模块
        ```
        // 模块输出
        exports.add = function(a, b) {
            return a + b;
        }

        // 引入模块
        var math = require('math');
        console.log(math.add(1, 3)); // 4
        ```
    1. 优点：
        - 避免全局命名空间污染
        - 明确代码之间的依赖关系
    1. 重大局限是，同步加载，不适用与浏览器端
    1. 浏览器和服务器js
        | 服务器端js | 浏览器端js |
        |:---:|:---:|
        |相同的代码需要多次执行|代码需要从一个服务器端分发到多个客户端执行|
        |CPU和内存资源是瓶颈|带宽是瓶颈|
        |加载时从磁盘中加载|加载时需要通过网络加载|
1. AMD
>AMD 即Asynchronous Module Definition，中文名是异步模块定义的意思。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行
    1. 模块使用
        ```
        //a.js
        define(function(){
            console.log('a.js执行');
            return {
                hello: function(){
                    console.log('hello, a.js');
                }
            }
        });

        //main.js
        require.config({
            paths: {
                "jquery": "../js/jquery.min"
            },
        });

        require(['jquery','a'], function($, a){
            console.log('main.js执行');
            a.hello();
            $('#btn').click(function(){
                // ...
            });
        })
        ```
    1. 缺点：
        - 被依赖的模块肯定会预加载，但是是否需要预先执行
        - 定义模块要把所有的依赖罗列下来很傻，还要写回调的形参
1. CMD
    1. 也是用全局的define函数定义模块, 无需罗列依赖数组，在factory函数中需传入形参require,exports,module.
    1. require 用来加载一个 js 文件模块，require 用来获取指定模块的接口对象 module.exports
    1. 模块使用
        ```
        //a.js
        define(function(require, exports, module){
            console.log('a.js执行');
            return {
                hello: function(){
                    console.log('hello, a.js');
                }
            }
        });

        //main.js
        define(function(require, exports, module){
            console.log('main.js执行');

            var a = require('a');
            a.hello();      
        });
        ```
    1. 加载依赖方式
        - 加载期：即在执行一个模块之前，将其直接或间接依赖的模块从服务器端同步到浏览器端；
        - 执行期：在确认该模块直接或间接依赖的模块都加载完毕之后，执行该模块
    1. AMD与CMD
        - 都是异步
        - AMD在加载模块完成后就会执行改模块，所有模块都加载执行完后会进入require的回调函数。AMD用户体验好，没有延迟
        - CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的。CMD性能好，因为只有用户需要的时候才执行的原因。
1. ES6模块
    1. 优点
        - 静态加载，也就是在编译时就加载不用等到运行,因此不能运行时动态加载模块
        - 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性
        - 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供。
    1. ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";。
        - 变量必须声明后再使用
        - 函数的参数不能有同名属性，否则报错
        - 不能使用with语句
        - 不能对只读属性赋值，否则报错
        - 不能使用前缀 0 表示八进制数，否则报错
        - 不能删除不可删除的属性，否则报错
        - 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
        - eval不会在它的外层作用域引入变量
        - eval和arguments不能被重新赋值
        - arguments不会自动反映函数参数的变化
        - 不能使用arguments.callee
        - 不能使用arguments.caller
        - 禁止this指向全局对象
        - 不能使用fn.caller和fn.arguments获取函数调用的堆栈
        - 增加了保留字（比如protected、static和interface）
    1. export导出
        - 一个模块就是一个独立文件，改文件内部的所有变量，外部无法获取。通过export输出变量
        - 需要提供对外的接口，在接口名与模块内部变量之间，建立了一一对应的关系
            ```
            // 错误写法
            export 1;
            var m = 1;
            export m;

            // 正确写法
            export var m = 1;

            var m = 1;
            export {m};

            var n = 1;
            export {n as m};
            ```
        - export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
        - export命令可以出现在模块的任何位置，除了块级作用域内
    1. import导入模块
        - import命令输入的变量都是只读的，因为它的本质是输入接口。如果接口的值是一个对象，可以修改属性，但是不建议这样做
            ```
            import {a} from './xxx.js'
            a = {}; // Syntax Error : 'a' is read-only;

            import {a} from './xxx.js'
            a.foo = 'hello'; // 合法操作
            ```
        - import命令具有提升效果，会提升到整个模块的头部，首先执行
        - import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构
        - 整体加载， import * as foo from 'foo';
    1. export default，import时可以指定任意名字
        ```
        // 默认输出
        export default function crc32() { // 输出
        // ...
        }
        import crc32 from 'crc32'; // 输入

        // 正常输出
        export function crc32() { // 输出
        // ...
        };
        import {crc32} from 'crc32'; // 输入
        ```
        - 默认输出，等同于输出一个名为default的变量
            ```
            export default 42;// default是变量
            import {default as foo} from 'foo';
            ```
        - 如果想在一条import语句中，同时输入默认方法和其他接口，可以写成下面这样。
            ```
            import _, { each, forEach } from 'lodash';
            ```
    1. 模块的继承，其实就是将另一个模块的接口导入再导出.export *，表示再输出circle模块的所有属性和方法。注意，export *命令会忽略default方法,可以添加本模块自身的default
        ```
        export * from 'circle';
        export default function() {

        }
        ```