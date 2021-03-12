### 一、js基础
1. 鸭子类型
js是动态语言类型，无需进行类型监测。利用鸭子类型概念，就是面向接口编程
1. 多态
    1. 多态的背后思想就是将“做什么”和“谁去做以及怎么做”分离开，也就是将“不变的事物”与“可能改变的事物”分离开。
    1. 对象的多态
        ```js
        // animal可以为任意类型，只要有sound方法
        var makeSound = function(animal) {
            animal.sound();
        };

        var Duck = function(){};
        Duck.prototype.sound = function() {
            console.log("嘎嘎嘎");
        };
        var Chicken = function() {};
        Chicken.prototype.sound = function() {
            console.log("咯咯咯");
        };

        makeSound(new Duck());
        makeSound(new Chicken());
        ```
    1. js的多态性与生俱来。JavaScript 作为一门动态类型语言，它在编译时没有类型检查的过程，既没有检查创建的对象类型，又没有检查传递的参数类型
1. 封装：js是依赖变量的作用域实现封装特性
1. 闭包的作用
    1. 封装变量
        ```js
        var mult = (function() {
            var cache = {};
            var calculate = function() {
                var a = 1;
                for (var i = 0, l = arguments.length; i < l; i++) {
                    a = a * arguments[i];
                }
                return a;
            };
            return function() {
                var args = Array.prototype.join.call(argument, ',');
                if (args in cache) {
                    return cache[args];
                }
                return cache[args] = calculate.apply(null, arguments);
            }
        });
        ```
    1. 延长局部变量的寿命
        ```js
        // 利用img发请求，闭包是的img对象不会被销毁
        var report = (function() {
            var imgs = [];
            return function(src) {
                var img = new Image();
                imgs.push(img);
                img.src = src;
            }
        })();
        ```
1. 闭包与内存管理：将循环引用的变量设为null

### 单例模式
1. 定义： 保证一个类仅有一个实例，并提供一个访问它的全局访问点
1. 不透明的单例模式：必须通过Singleton.getInstance来获取对象
    ```js
    var Singleton = function(name) {
        this.name = name;
    };
    Singleton.prototype.getName = function() {
        alert(this.name);
    };
    Singleton.getInstance = (function() {
        var instance = null;
        return function(name) {
            if (!instance) {
                instance = new Singleton(name);
            }
            return instance;
        }
    })();
    ```
1. 透明的单例模式
    ```js
    var CreateDiv = (function() {
        var instance;
        var CreateDiv = function(html) {
            if (instance) {
                return instance;
            }
            this.html = html;
            this.init()
            return istance = this;
        };

        CreateDiv.prototype.init = function() {
            var div = document.createElement('div');
            div.innerHTML = this.html;
            document.body.appendChild(div);
        };
        return CreateDiv;
    })();
    ```
1. 用代理实现单例模式
    ```js
    var CreateDiv = function(html) {
        this.html = html;
        // this是一个构造函数的实例，可以访问原型对象的方法
        this.init();
    };

    CreateDiv.prototype.init = function() {
        var div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild(div);
    };

    // 引入代理类
    var ProxySingletonCreateDiv = (function() {
        var instance;
        return function(html) {
            if (!instance) {
                instance = new CreateDiv(html);
            }
            return instance;
        }
    })();
    ```
1. js中的单例模式，全局变量当做单例使用，使用以下方法避免全局污染
    1. 命名空间
        ```js
        var nameSpace = {
            a: function() {
                alert(1);
            },
            b: function() {
                alert(2);
            }
        };
        ```
    1. 闭包封装私有变量
        ```js
        var user = (function() {
            var _name = 'sven',
                _age = 29;
            return {
                getUserInfo: function() {
                    return _name + '-' + _age;
                }
            }
        })();
        ```
1. 惰性单例
    ```js
    var createLoginLayer = (function() {
        var div;
        return function() {
            if (!div) {
                div = document.createElement('div');
            }
            return div;
        }
    })();
    ```
1. 通用的惰性单例
    ```js
    // 只负责创建对象，业务逻辑在fn中，result保存fn返回的对象
    var getSingle = function(fn) {
        var result;
        return function() {
            return result || (result = fn.apply(this, arguments));
        }
    };
    ```
    只要fn返回的值为true，那么fn就只执行一次。这样可以不仅仅在创建对象上有用
    ```js
    var bindEvent = getSingle(function() {
        document.getElementById('div1').onclick = function() {
            alert('click');
        };
        return true;
    });
    var render = function() {
        console.log('开始渲染');
        bindEvent();
    };
    render();// 只有第一次执行时才会绑定事件
    ```

### 策略模式
1. 定义：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换
    ```js
    var strategies = {
        "s": function(salary) {
            return salary * 4;
        },
        "A": function(salary) {
            return salary * 3;
        },
        "B": function(salary) {
            return salary * 2;
        }
    };
    // 替代使用大量的if-else
    var calculateBonus = function(level, salary) {
        return strategies[level](salary);
    }
    ```
1. 一等函数对象与策略模式
    ```js
    var S = function(salary) {
        return salary * 4;
    };
    var A = function(salary) {
        return salary * 3;
    };
    var B = function(salary) {
        return salary * 2;
    };

    var calculateBonus = function(func, salary) {
        return func(salary);
    };
    calculateBonus(S, 1000);
    ```

### 代理模式
1. 定义
    1. 保护代理：控制不同权限的对象对目标对象的访问，不常用
    1. 虚拟代理：把开销大的对象，延迟到需要时才去创建
1. 虚拟代理实现图片预加载
    1. 直接给某个img 标签节点设置src 属性，由于图片过大或者网络不佳，图片的位置往往有段时间会是一片空白。常见的做法是先用一张loading 图片占位，然后用异步的方式加载图片，等图片加载好了再把它填充到img 节点里
    ```js
    var myImage = (function() {
        var imgNode = document.createElement('img');
        document.body.appendChlid(imgNode);

        return {
            setSrc: function(src) {
                imgNode.src = src;
            }
        }
    })();

    var proxyImage = (function() {
        var img = new Image;
        img.onload = function() {
            myImage.setsrc(this.src);
        };
        return {
            setSrc:function(src) {
                myImage.setSrc('');// 占位图片
                img.src = src;
            }
        }
    })();
    proxyImage.setSrc('');
    ```
1. 虚拟代理合并HTTP请求
    ```js
    var proxySynchronousFile = (function() {
        var cache = [],
            timer;
        
        return function(id) {
            cache.push(id);
            if (timer) {
                return;
            }
            timer = setTimeout(function() {
                synchronousFile(cache.join(','));
                clearTimeout(timer);
                timer = null;
                cache.length = 0;
            }, 2000);
        }
    })
    ```
1. 缓存代理
    1. 计算乘积
        ```js
        var multi = function() {
            var result = 1;
            for (var i = 0, l = arguments.length; i < l; i++) {
                result = result * arguments[i];
            }
            return result;
        };
        var proxyMulti = (function() {
            var cache = {};
            return function() {
                var args = Array.prototype.join.call(arguments, ',');
                if (args in cache) {
                    return cache[args];
                }
                return cache[args] = multi.apply(this, arguments);
            }
        })()
        ```
1. 用高阶函数动态创建代理
    ```js
    var createProxyFactory = function(fn) {
        var cache = {};
        return function() {
            var args = Array.prototype.join.call(arguments, ',');
            if (args in cache) {
                return cache[args];
            }
            return cache[args] = fn.apply(this, arguments);
        }
    }
    ```

### 迭代器模式
1. 内部迭代器和外部迭代器
    1. 内部迭代器：外部不关心怎么迭代，迭代规则被提前规定
        ```js
        function each(arr, fn) {
            for(let i = 0; i < arr.length; i++) {
                fn.apply(arr[i], arr[i], i);
            }
        }
        var compare = function(arr1, arr2) {
            if (arr1.length !== arr2.length) {
                throw new Error('arr1, arr2不相等');
            }
            each(arr1, function(elem, i) {
                if (elem !== arr2[i]) {
                    throw new Error('arr1, arr2不相等');
                }
            });
        };
        compare([1,2,3], [1,2,3]);
        ```
    1. 外部迭代器:显式地请求下一个元素
        ```js
        var Iterator = function(obj) {
            car current = 0;
            var next = function() {
                current += 1;
            };
            var idDone = function() {
                return current >= obj.length;
            };
            var getCurrentItem = function() {
                return obj[current];
            };

            return {
                next,
                isDone,
                getCurrentItem
            }
        };

        var compare = function(iterator1, iterator2) {
            while(!iterator.isDone() && !iterator2.isDone()) {
                if (iterator1.getCurrentItem() !== iterator2.getCurrentItme()) {
                    throw new Error('iterator1和iterator2不相等');
                }
                iterator1.next();
                iterator2.next();
            }
            alert('iterator1和iterator2相等');
        };
        ```
1. 迭代类数组对象和字面量对象
    1. for in可用来迭代普通字面量对象属性
    1. 封装各种迭代行为的$.each方法
        ```js
        $.each = function(obj, callback) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike(obj);

            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], obj[i], i, obj);
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], obj[i], i, obj);
                    if (value === false) {
                        break;
                    }
                }
            }
            return obj;
        }
        ```
1. 倒序迭代器
1. 中止迭代器
    ```js
    var each = function( ary, callback ){
        for ( var i = 0, l = ary.length; i < l; i++ ){
            if ( callback(ary[i], i, ary) === false ){ // callback 的执行结果返回 false，提前终止迭代
                break;
            }
        }
    };
    ```
1. 应用实例
    ```js
    // 根据不同浏览器获取相应的上传组件对象
    var getUploadObj = function() {
        try {
            return new ActiveXObject('TXFTNActiveX.FTNUpload');
        }
        catch(e) {
            if (supportFlash()) {
                // flash
            }
            else {
                // 表单上传组件
                var str = '<input name="file" type="file" />';
                return $(str).appendTo($('body'));
            }
        }
    }
    ```
    利用迭代器模式获取upload对象
    ```js
    var getActiveUploadObj = function() {
        try {
            return new ActiveXObject("TXFTActive.FTNUpload");
        }
        catch(e) {
            return fasle;
        }
    };
    var getFlashUploadObj = function() {
        if (supportFlash()) {
            return obj;
        }
        return false;
    };
    var getFormUploadObj = function() {
        var str = '<input name="file" type="file" />';
        return $(str).appendTo($('body'));
    };
    var iteratorUpload = function() {
        for (var i = 0, fn; fn = arguments[i++]; ) {
            var uploadObj = fn();
            if (uploadObj !== false) {
                return uploadObj;
            }
        }
    };
    var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj);
    ```
    这个示例看起来和策略模式很像，迭代器模式就是把所有方法都执行一遍，策略模式是将类似的逻辑封装成可替换的小模块，看起来像是两者的结合

### 发布-订阅模式
1. 发布-订阅模式又叫观察者模式，js中一般用事件模型来替代传统的发布-订阅模式
    1. 可以广泛用于异步编程，不需关注对象在异步运行期间的内部状态
    1. 可以取代对象之间硬编码的通知机制，不用显式调用另一个对象的接口
1. dom事件，绑定事件函数实质也是发布-订阅模式
1. 自定义事件
    ```js
    var event = {
        clientList: [],
        listen: function(type, fn) {
            if(!this.clientList[type]) {
                this.clientList[type] = [];
            }
            this.clientList[type].push(fn);
        },
        trigger: function() {
            var type = Array.prototype.shift.call(arguments);
            fns = this.clientList[type];

            if (!fns || fns.length === 0) {
                return false;
            }

            for (var i = 0, fn; fn = fns[i++]; ) {
                fn.apply(this,arguments);
            }
        }
    }
    // 给对象添加发布-订阅功能
    var installEvent = function(obj) {
        for (var i in event) {
            obj[i] = event[i];
        }
    };
    ```
1. 示例
    通过ajax请求获得数据，而使用数据的业务模块直接订阅消息即可，否则，使用数据和获取数据会耦合在一起
    ```js
    installEvent(login);
    $.ajax('', function(data) {
        login.trigger('login', data);
    });
    // 监听登录
    var nav = (function() {
        login.listen('login', function(data) {
            // 对象的属性动态添加
            nav.setAvatar(data.avatat);
        });
        return {
            setAvatar: function(avatar) {
                // ...
            }
        }
    })();
    ```
1. 全局的发布-订阅对象,直接生成一个全局对象event，直接使用它的发布与监听方法
    ```js
    var event = (function() {
        return {
            listen,
            trigger,
            remove
        }
    })();
    ```
1. 先发布再订阅
    建立一个存放离线事件的堆栈，当事件发布的时候还没有订阅者，暂时把发布事件的动作包裹在一个函数里，等有对象订阅时重新发布
1. 全局事件的命名冲突
    ```js

    ```

### 命令模式
1. 定义：不关心请求的具体实现，解开请求调用者和请求接收者之间的耦合关系
1. 用闭包实现命令模式
    ```js
    var setCommand = function(button, command) {
        button.onclick = function() {
            command.execute();
        }
    };
    var RefreshMenuBarCommand = function(receiver) {
        return {
            execute: function() {
                receiver.refresh();
            }
        }
    };
    var MenuBar = {
        refresh: function() {
            console.log('刷新菜单界面');
        }
    };
    var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
    setCommand(button1, refreshMenuBarCommand);
    ```
1. 撤销和重做
1. 宏命令
    ```js
    var closeDoorCommand = {
        execute: function() {
            //
        }
    };
    var openPcCommand = {
        execute: function() {
            //
        }
    };
    var openQQCommand = {
        execute: function() {
            //
        }
    };
    var MacroCommand = function() {
        return {
            commandsList: [],
            add: function(command) {
                this.commandsList.push(command);
            },
            // 组合模式
            execute: function() {
                for(var i = 0, command; command = this.commandsList[i++];) {
                    command.execute();
                }
            }
        }
    }
    ```

### 组合模式
1. 除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性
1. 请求在树中传递
1. js中实现组合模式的难点在于要保证组合对象和叶对象拥有同样的方法，通常需要用鸭子类型的思想对他们进行接口检查。
1. 扫描文件夹
    ```js
    var Folder = function(name) {
        this.name = name;
        this.files = [];
    };
    Folder.prototype.add = function(file) {
        this.files.push(file);
    };
    Folder.prototype.scan = function() {
        console.log('开始扫描' + this.name);
        for (var i = 0, file, files = this.files; file = files[i++];) {
            file.scan();
        }
    };

    var File = function(name) {
        this.name = name;
    };
    File.prototype.add = function() {
        throw new Error('文件下面不能添加文件');
    };
    File.prototype.scan = funciton() {
        console.log('开始扫描文件' + this.name);
    };

    var folder1 = new Folder('文件夹1');
    var folder2 = new Folder('文件夹2');
    var folder3 = new Folder('文件夹3');

    var file1 = new File('文件1');
    var file2 = new File('文件2');
    var file3 = new File('文件3');

    folder1.add(file1);
    folder2.add(file2);

    folder3.add(folder1);
    folder3.add(folder2);
    folder3.add(file3);

    folder3.scan();
    // 开始扫描文件夹3
    // 开始扫描文件夹1
    // 开始扫描文件文件1
    // 开始扫描文件夹2
    // 开始扫描文件文件2
    // 开始扫描文件文件3 
    ```
1. 引用父对象
    ```js
    var Folder = function(name) {
        this.name = name;
        this.parent = null;
        this.files = [];
    };
    Folder.prototype.add = function(file) {
        file.parent = this;
        this.files.push(file);
    };
    Folder.prototype.scan = function() {
        console.log('开始扫描' + this.name);
        for (var i = 0, file, files = this.files; file = files[i++];) {
            file.scan();
        }
    };
    Folder.prototype.remove = function() {
        if (!this.parent) {
            return;
        }
        for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
            var file = files[l];
            if (file === this) {
                files.splice(l, 1);
            }
        }
    }
    ```
### 模板方法模式
1. 子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来实现
1. 不能保证子类重写父类方法解决方法
    1. 鸭子类型来模拟接口检查
    1. 父类方法直接抛出异常
1. 模板方法模式是基于继承的一种设计模式，父类封装了子类的算法框架和方法的执行顺序，子类继承父类之后，父类通知子类执行这些方法
1. 钩子方法hook

### 享元模式
1. 内部状态和外部状态
    1. 可以被对象共享的属性通常被划分为内部状态
    1. 外部状态取决于具体的场景，并根据场景而变化
1. 享元模式的通用结构
1. 对象池
    ```js
    var objectPoolFactory = function(createObjFn) {
        var objectPool = [];
        return {
            create: function() {
                var obj = objectPool.length === 0
                    ? createObjFn.apply(this, arguments)
                    : objectPool.shift();
                return obj;
            },
            recover: function(obj) {
                objectPool.push(obj);
            }
        };
    };

    var iframeFactory = objectPoolFactory(function() {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
            iframe.onload = null;// 防止重复加载
            iframeFactory.recover(iframe);// 回收节点
        }

        return iframe;
    });

    var iframe1 = iframeFactory.create();
    iframe1.src = 'http:// baidu.com';
    ```

### 职责链模式
1. 某个节点不能处理请求，则返回一个特定的字符串 'nextSuccessor'来表示该请求需要继续往后面传递
    ```js
    var order500 = function(orderType, pay, stock) {
        if (orderType === 1 && pay === true) {
            console.log('');
        }
        else {
            return 'nextSuccessor';
        }
    };

    var order200 = function(orderType, pay, stock) {
        if (orderType === 2 && pay === true) {
            console.log('');
        }
        else {
            return 'nextSuccessor';
        }
    };

    var orderNormal = function(orderType, pay, stock) {
        if (stock > 0) {
            console.log('');
        }
        else {
            console.log('');
        }
    };

    var Chain = function(fn) {
        this.fn = fn;
        this.successor = null;
    };
    Chain.prototype.setNextSuccessor = function(successor) {
        return this.successor = successor;
    };
    Chain.prototype.passRequest = function() {
        var ret = this.fn.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return this.successor && this.successor.passRequest.apply(this.successor, arguments);
        }
        return ret;
    };
    // 包装职责链中的节点，并制定顺序
    var chainOrder500 = new Chain(order500);
    var chainOrder200 = new Chain(order200);
    var chainOrderNormal = new Chain(orderNormal);

    chainOrder500.setNextSuccessor(chianOrder200);
    chainOrder200.setNextSuccessor(chianOrderNormal);
    // 最后请求只用传递给第一个节点
    chainOrder500.passRequest(1, true, 200);
    ```
1. 异步职责链
    ```js
    // 手动传递请求给下一个节点
    Chain.prototype.next = function() {
        return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    };

    var fn1 = new Chain(function {
        var self = this;
        setTimeout(function() {
            self.next();
        }, 1000);
    })
    ```
1. 最大优点就是解耦了请求发送者和 N 个接收者之间的复杂关系，由于不知道链中的哪个节点可以处理你发出的请求，所以你只需把请求传递给第一个节点即可