### 递归
1. 普通命名函数中的递归
    ```
    // 判断字符串回文
    function isPalindrome(text) {
        if (text.length <= 1) return true;
        if (text.charAt(0) != text.charAt(text.length - 1)) return false;
        return isPalindrome(text.substr(1, text.length - 2));
    }
    ```
1. 方法中的递归
    ```
    var ninja = {
        chirp: function(n) {
            return n > 1 ? ninja.chirp(n-1) + '-chirp' : 'chirp';
        }
    }
    ```
    引用丢失时，这种递归会出问题。下例中，man的chirp与ninja.chirp是引用同一个匿名函数，但当ninja={}时，ninja.chirp引用丢失
    ```
    var man = {
        chirp: ninja.chirp
    };
    ninja={};
    ```
    解决方案，函数上下文this指向调用方法的对象
    ```
    var ninja = {
        chirp: function(n) {
            return n > 1 ? this.chirp(n-1) + '-chirp' : 'chirp';
        }
    }
    ```
1. 内联函数
    ```
    var ninja = {
        chirp: function signal(n) {
            return n > 1 ? signal(n-1) + '-chirp' : 'chirp';
        }
    };
    var man = {
        chirp: ninja.chirp
    };
    ninja={};
    ```
    此时，ninja.chirp引用的丢失不影响程序
    可以给内联函数命名，但是名字只能在函数内部才可见。全局函数可看做是window的内联函数
1. callee属性
    arguments.callee指向当前执行的函数

### 函数是第一型对象
>可以给函数添加属性

1. 函数存储
    ```
    var store = {
        nextId: 1,
        cache: {},
        add: function(fn) {
            // 添加fn的id属性来判断函数是否已经被添加
            if (!fn.id) {
                fn.id = store.nextId++;
                return !!(store.cache[fn.id] = fn);
            }
        }
    }
    ```
1. 自记忆函数
    >用函数属性来存储计算的值

    ```
    function getElements(name) {
        if (!getElements.cache) getElement.cache = {};
        return getElements.cache[name] = getElements.cache[name] || document.getElementsByName(name);
    }
    ```
1. 伪造数组方法
    >普通对象上模拟数组方法
    ```
    var elems = {
        length: 0,
        add: function (elem) {
            Array.prototype.push.call(this, elem);
        }
    };
    ```

### 可变长度的参数列表
1. Math.min.apply(Math, arr);
1. 函数重载
    1. 容易想到但是不好的函数重载方式，直接根据实参长度判断
        ```
        var ninja = {
            foo: function () {
                switch (arguments.length) {
                    case 0:
                        ...
                        break;
                    case 1:
                        ...
                        break;
                    case 2:
                        ...
                        break;
                    ...
                }
            }
        }
        ```
    1. 利用闭包
        ```
        function addMethod (obj, name, fn) {
            var old = obj[name];
            obj[name] = function() {
                // fn.length为函数的形参
                // arguments.length是函数调用的实参
                if (arguments.length == fn.length) {
                    return fn.apply(this, arguments);
                }
                else if (typeof old == 'function) {
                    // old是利用闭包保存的前一个添加的已有的同名函数
                    return old.apply(this, arguments);
                }
            };
        }
        var ninja = {};
        addMethod(ninja, 'foo', function() {});
        addMethod(ninja, 'foo', funciton(a) {});
        addMethod(ninja, 'foo', function(a, b) {});
        ```