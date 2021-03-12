### 闭包
1. 利用闭包可以访问原始作用域的变量和函数，典型示例
    ```
    var outValue = 'a';
    var later;

    function outFunc() {
        var innerValue = 'b';
        function innerFunc(paramValue) {
            // 可访问outValue, innerValue
            console.log(outValue);
            console.log(innerValue);

            console.log(fooValue);// 报错，不在作用域内
            console.log(paramValue);// e
            console.log(toolate);// d
            console.log(toolate2);// undefined，在作用域内，未声明
        }
        // 返回函数，形成闭包，保存函数声明那一时刻点的**作用域内**的函数和变量
        later = innerFunc;
    }

    function foo () {
        var fooValue = 'c';
    }

    console.log(toolate); // undefined
    var toolate = 'd';

    outFunc(); // 作用域销毁
    later('e');

    var toolate2 = 'f';
    ```
1. 由上例可以得出结论
    - 内部函数的参数时包含在闭包内的
    - **作用域外（作用域链上）**的所有变量，即便是函数声明之后声明的变量，也是包含在闭包中的
    - 相同作用域内，尚未声明的变量不能提前引用

### 使用闭包
1. 私有变量，通过特权方法暴露
1. 回调和计时器, 每个闭包会保存属于自己的变量和函数，互不影响
    ```
    // dom， tick， timer在每个闭包中是互相独立的
    function animate(dom) {
        var tick = 0;
        var timer = setInterval(function() {
            tick++;
            if (tick > 100) {
                clearInterval(timer);
            }
        }, 100);
    }
    ```

### 绑定函数上下文
```
Function.prototype.bind = function () {
    var fn = this,
        args = Array.prototype.slice.call(arguments),
        object = args.shift();
    return function () {
        return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    };
};
```

### 偏函数
>柯里化：在一个函数中首先填充几个参数，然后在返回函数

```
Function.prototype.curry = function () {
    // 函数以及预填充的参数被保存在闭包中
    var fn = this,
        args = Array.prototype.slice.call(arguments);
    return function() {
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
};
```
传递遗漏的参数
```
Function.prototype.partial = function () {
    var fn = this,
        args = Array.prototype.slice.call(arguments);
    return function() {
        var arg = 0;
        for (var i = 0; i < args.length && arg < arguments.length; i++) {
            // 用返回函数的参数来填充partial中遗漏的参数
            if (args[i] === undefined) {
                args[i] = arguments[arg++];
            }
        }
        return fn.apply(this, args);
    };
};
```

### 函数重载
1. 函数记忆
    ```
    Function.prototype.memoized = function(key) {
        this._values = this._values || {};
        return this._values[key] !== undefined ?
            this._values[key] :
            this._values[key] = this.apply(this, arguments);// this为原函数
    };

    function isPrime(num) {
        var prime = num != 1;
        for (var i = 2; i < num; i++) {
            if (num % i == 0) {
                prime = false;
                break;
            }
        }
        return prime;
    }

    console.log(isPrime.memoized(5));
    ```
    使用闭包实现的缓存记忆函数
    ```
    Function.prototype.memoized = function(key) {
        this._values = this._values || {};
        return this._values[key] !== undefined ?
            this._values[key] :
            this._values[key] = this.apply(this, arguments);// this为原函数
    };

    Function.prototype.memoize = function () {
        var fn = this;
        return function () {
            return fn.memoized.apply(fn, arguments);
        }
    };
    
    isPrime = (function () {
        var prime = num != 1;
        for (var i = 2; i < num; i++) {
            if (num % i == 0) {
                prime = false;
                break;
            }
        }
        return prime;
    }).memoize();
    ```
1. 函数包装，使用新功能包装旧函数
    ```
    function warp (object, method, warpper) {
        var fn = object[method];
        return object[method] = function () {
            // 将原函数与参数一起传入warpper执行
            return warpper.apply(this, [fn.bind(this)].concat(Array.prototype.slice.call(arguments)));
        };
    }
    ```
1. 即时函数
>即时函数将作用域限制于代码块、子代码块或各级函数中
```
(function($) {
    $('#img).on('click', function(e) {
        $();
    });
})(jQuery);
```