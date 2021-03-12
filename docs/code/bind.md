### bind
1. 实现
    ```js
    Function.prototype.bind = function (target) {
        target = target || window;//如果没有传入,就为window
        const self = this;//谁调用myBind，this就指向谁
        const args = [].slice.call(arguments, 1);
        const temp = function () {};

        const bound = function () {
            const fnArgs = args.concat(Array.prototype.slice.call(arguments));
            self.apply(
                // 如果是new的，那么this是bound的实例
                // this.__proto__ = bound.prototype
                this instanceof temp ? this : target,
                fnArgs
            );
        };

        // 如果直接bound.prototype = this.prototype就变成同一个引用
        // 修改bound.prototype会修改this.prototype
        // 等同于bound.prototype = Object.create(this.prototype)
        temp.prototype = this.prototype;
        bound.prototype = new temp(); // bound.prototype.__proto__ = this.prototype
        return bound;
    }
    ```
1. 注意
    1. 箭头函数不能使用arguments
    1. 箭头函数没有prototype
    1. 箭头函数没有this，箭头函数this永远指向它所在的作用域
        ```js
        function foo() {
            let a = {
                c: function() {
                    console.log(this);
                },
                d: () => {
                    console.log(this);
                }
            }
        }

        // babel
        function foo() {
            var _this = this;
            var a = {
                c: function c() {
                    console.log(this);
                },
                d: function d() {
                    console.log(_this);
                }
            };
        }
        ```
    1. Object.create(), new一个空的构造函数，构造了原型链
        ```js
        Object.create = function (o) {
            function f(){}
            f.prototype = o;
            return new f();
        }

        const obj = Object.create(o);
        obj.__proto__ = f.prototype = o;
        ```

### apply
1. 实现
    ```js
    Function.prototype.apply = function(thisArg, argsArr) {
        const context = thisArg || window;

        // 缓存原有的fn方法
        let savedFn = null; 
        if (context.fn) {
            savedFn = context.fn;
        }
        context.fn = this;

        let result;
        if (!argsArr) {
            context.fn();
        } else {
            let args = [];
            for (let i = 0; i< argsArr.length; i++) {
                args.push('argsArr[' + i + ']');
            }
            // 展开参数context.fn(argsArr[0], argsArr[1],...)
            // 等同于eval(`context.fn(${args})`)
            result = eval('context.fn(' + args + ')');
            
            // es6
            result = context.fn(...argsArr);
        }

        if (savedFn) {
            context.fn = savedFn;
        } else {
            delete context.fn;
        }
        return result;
    }
    ```
1. 原理
    1. 先在指定的上下文上添加函数，并执行
    2. 删除函数
    1. 返回执行结果

### curry
1. 实现
    ```js
    const curry = (fn, ...args) => {
        return (args.length >= fn.length)
            ? fn(...args)
            : (...argsNew) => curry(fn, ...args, ...argsNew)
    };
    ```

### new
1. 原理
    1. 创建一个对象
    1. 指定原型
    1. 执行构造函数，上下文指向创建的对象
    1. 返回该对象，或者执行生成的对象
1. 实现
    ```js
    function myNew() {
        const obj = {};
        const constructor = Array.prototype.shift.call(arguments);
        obj.__proto__ = constructor.prototype;
        const result = constructor.call(obj);
        return result && typeof result === 'object' ? result : obj;
    }
    ```
1. 注意点
    1. 构造函数返回是对象，或者是数组、函数这种，那么new出来的实例就是函数执行的返回值

### instanceof 
1. 实现
    ```js
    function instanceof (L, R) {
        const O = R.prototype;
        let L = L.__proto__;
        while(true) {
            if (L === null) return false;
            if (L === O) return true;
            L = L.__proto__;
        }
    }
    ```