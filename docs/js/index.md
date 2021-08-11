1. 解构默认值只对undefined生效
    ```js
    const props = {
        a: 123,
        b: ''
    };
    const {a=1, b=2, c=3} = props;
    console.log(a, b, c);// 123, '', 3
    ```
1. 服务端会忽视链接中#后的内容，浏览器中#后的内容用来定位到业内元素，如果是有用信息可以用正则从location.href捕获出来
1. 字符集合[]中., * 等特殊字符没有特殊意义，不用转义，转义也不起作用\
1. 每秒查询率QPS是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准
1. node解析excel文件，返回一个二维数组，一行是一个数组
    ```
    var xlsx = require('node-xlsx');
    var obj = xlsx.parse("./" + "keyword.xlsx");
    ```
1. node读写文件
    ```
    fs.readFile(filename, funciton (err, data) {

    });

    fs.writeFile('./keyword.json', JSON.stringify(obj), function (err) {
        if (err) {
            console.log('写文件操作失败');
        }
        else{
            console.log('写文件操作成功');
        }
    });
    ```
1. 使用for in来遍历，判断对象是否存在属性还是用obj.hasOwnProperty()
1. npm 5.0出现一个packjson-lock.json，这个文件是自动产生的用于限制packjson内模块的版本号，直接修改packjson内版本，执行npm i，模板的版本还是按照packjson-lock.json
1. String.fromCharCode()可以将unicode转为html实体字符
1. 使用高版本jQuery的ajax时，会对传的数据进行深度序列化，这样在后端得到的数组属性会有问题，加上traditional:true
    ```
    // post请求
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            fields: ['image', 'name']
        },
        success: success
    });
    
    // 浏览器
    fields[]: image
    fields[]: name

    // 后端
    console.log(req.body);
    {
        'fields[]': [ 'name', 'image' ]
    }
    ```
1. Plain Object指的是通过字面量形式或者new Object()形式定义的对象
    ```
    function isPlainObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        let proto = obj;
        // 找到原型的顶端
        // Object.getPrototypeOf({})为Object
        // Object.getPrototypeOf(Object)为null
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        // 判断原型是否只有一层
        return Object.getPrototypeOf(obj) === proto
    }
    ```
1. 箭头函数没有自身的this，所以只能根据作用域链往上层查找。箭头函数的this无法通过bind，call，apply来直接修改，可以利用闭包改变箭头函数外部函数的this

1. 扩展对象
    - 对象是可扩展的：即可以为他们添加新的属性。以及它们的 __proto__ 属性可以被更改
    - Object.preventExtensions:创建一个不可扩展的对象，对属性没有限制
    - Object.isExtensible(obj):判断是否可扩展对象
1. 密封对象
    - 密封对象是指那些不能添加新的属性，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性，但可能可以修改已有属性的值的对象
    - Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变
    - Object.isSealed(obj):判断密封对象
1. 冻结对象
    - 冻结对象是指那些不能添加新的属性，不能修改已有属性的值，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性的对象。也就是说，这个对象永远是不可变的
    - Object.freeze() 方法可以冻结一个对象
    - Object.isFrozen：判断对象是否是冻结对象（不可扩展，且属性为对象时也不可扩展）
    ```js
    var oneProp = { p: 42 };
    console.log(Object.isFrozen(oneProp)) // false
    Object.preventExtensions(oneProp);
    console.log(Object.isSealed(oneProp));// false, 属性p可配置，可写
    console.log(Object.isFrozen(oneProp)) // false
    Object.seal(oneProp);
    console.log(Object.isSealed(oneProp));// true
    console.log(Object.isFrozen(oneProp));// false， 属性p可写
    ```
1. 防抖debounce：触发n秒后执行，以新的事件的时间为准，n 秒后才执行
1. 节流throttle：持续触发事件，每隔n秒时间，只执行一次事件
1. 类的内部所有定义的方法，都是不可枚举的， 所以不能用...展开class内的方法会
1. event.target返回触发事件的元素, event.currentTarget返回绑定事件的元素
1. export 与 export default
    1. 导出的都是read-only,如果是引用类型可以修改属性
    1. 可以通过方法修改导出的值,export default方式导出则不会修改（值或者是引用）,default 方式会更换变量名
        ```js
        export var a = 1;
        export function modify(){
            a = 2;
        }

        // 引入
        import {a, modify} from "./a.js"
        console.log(a); // 1
        modify();
        console.log(a); // 2
        ```
    1. babel编译结果
        ```js
        let a = 1;
        export {a};
        a = 2;
        // 编译结果
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.a = void 0;
        var a = 1;
        exports.a = a;
        exports.a = a = 2;

        // export default 方式
        let a = 1;
        export default a;
        a = 2;
        
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;
        var a = 1;
        var _default = a;
        exports.default = _default;
        a = 2;
        ```
1. 无限加载列表需要使用哨兵组件，根据哨兵是否可见来判断发送请求获取数据
    ```js
    var io = new IntersectionObserver(callback, option);
    // 开始观察
    io.observe(document.getElementById('example'));

    // 停止观察
    io.unobserve(element);

    // 关闭观察器
    io.disconnect();
    ```
    1. 目标元素的可见性变化时，就会调用观察器的回调函数callback，变化表示开始可见和开始不可见都会触发。callback参数entries每个成员都是一个IntersectionObserverEntry对象
        ```js
        callback = entries => {
            entries.forEach((opts) => {
                if (isItemIn(opts)) {
                    onEnter(opts);
                } else {
                    onLeave(opts);
                }
            });
        }
        function isItemIn(opts) {
            const { threshold } = this.props;
            return opts.isIntersecting && opts.intersectionRatio >= threshold;
        }
        ```
1. node中查看执行的调用栈console.trace();
1. instanceof判断某对象是否为某构造器的实例。基于原型链的查询，只要处于原型链中，判断永远为true。
    1. instanceof的使用：a instanceof A, 就是判断`a.__proto__.__proto__`找下去能不能找到A.prototype
        ```js
        const Person = function () {};
        const p = new Person();
        p instanceof Person; // true
        ```
    1. Symbol.hasInstance用于判断某对象是否为某构造器的实例。因此你可以用它自定义 instanceof 操作符在某个类上的行为
        ```js
        // MyArray是一个构造器
        class MyArray {  
            static [Symbol.hasInstance](instance) {
                return Array.isArray(instance);
            }
        }
        console.log([] instanceof MyArray); // true
        // instanceof执行过程等同于
        // MyArray[Symbol.hasInstance]([])
        ```
    1. 实现
        ```js
        function myInstanceof(left, right) {
            //基本数据类型直接返回false
            if (typeof left !== 'object' || left === null) return false;
            if (right[Symbol.hasInstance]) {
                return !!right[Symbol.hasInstance](left);
            }
            //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
            let proto = Object.getPrototypeOf(left);
            while(true) {
                //查找到尽头，还没找到
                if(proto == null) return false;
                //找到相同的原型对象
                if(proto == right.prototype) return true;
                proto = Object.getPrototypeof(proto);
            }
        }
        ```
1. 对象转基本类型的流程
    1. Symbol.toPrimitive
    1. valueOf
    1. toString
    1. Object.prototype.toString
    ```js
        const obj = {
            value: 12,
        };
        obj + 1; // [object Object]1
        obj.toString = () => '12';
        obj + 1; // 121
        obj.valueOf = () => 13;
        obj + 1; // 14
        obj[Symbol.toPrimitive] = () => 14;
        obj + 1; // 15
    ```

### Map与Set
Map对象的方法: clear, delete, entries, forEach, has, keys, size, values, get, set
Set对象的方法: clear, delete, entries, forEach, has, size, values, add

### 数组
1. Array.from() 方法从一个类似数组或*可迭代对象*中创建一个新的数组实例
    ```js
    console.log(Array.from([1, 2, 3], x => x + x));
    // expected output: Array [2, 4, 6]

    const likeArr = {
        length: 3,
        '0': 1,
        '1': 2,
        '2': 3
    };
    Arrar.from(likeArr, (value, index) => {
        console.log(value); // 1, 2, 3
        console.log(index); // 0 , 1, 2
        return value; 
    }); // [1, 2, 3]
    ```
1. 创建数组比较简单的方式是`new Array(n).fill(0)`, 但是创建二维数组时会有问题，指向同一个数组
    ```js
    const arr1 = new Array(3).fill(new Array(3).fill(0));
    arr1[0][0] = 1;

    // arr1 结果是 [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

    const arr2 = Array(3).fill(0).map(() => Array(3).fill(0));
    arr2[0][0] = 1;
    // arr1 结果是 [[1, 0, 0], [0, 0, 0], [0, 0, 0]]

    ```
1. [].concat()参数可是**序列化数值**，或者是数组
    ```
    let arr = [1, 2];
    arr.concat(3, 4); //[1, 2, 3, 4]
    arr.concat([3, 4]); //[1, 2, 3, 4]
    arr.concat(3, [4]); //[1, 2, 3, 4]
    ```
1. [].slice(start, end)
    - 没有end则选取start到结尾
    - 参数为负数，表示从数组尾部开始
    - slice(0)克隆数组
1. arr.findIndex(callback(element, index, array), thisArg): 返回满足条件的第一个元素下标

### 自定义事件CustomEvent
```js
// 监听
document.body.addEventListener('test', (event) => {
    console.log(event.payload);
});

let myEvent = new CustomEvent('test', {
    payload: {
        name: '',
    }
});
// 手动触发
document.body.dispatchEvent(myEvent);
```

1. transitionEnd事件会冒泡