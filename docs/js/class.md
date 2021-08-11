>本来觉得类没啥要注意的和es5应该也差不太多，不过在用上typescript时发现和我认识的class用法不太一样，所以再来复习一下class，发现还真有很多东西之前没注意到

1. 类相当于实例的原型
    注意：类的内部所有定义的方法，都是不可枚举的
    ```js
        class Point {
            constructor() {
                // ...
            }

            toString() {
                // ...
            }

            toValue() {
                // ...
            }
        }

        // 等同于

        Point.prototype = {
            constructor() {},
            toString() {},
            toValue() {},
        };
    ```
1. constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法
    - constructor实际就是构造函数
        ```js
        class Foo {
            constructor(name) {
                this.name = name || 'bob';
            }
        }
        let foo = new Foo('tom');
        console.log(foo.name);
        ```
    - 一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。
    - 可以在constructor返回一个对象，而不是实例，这和之前学习的构造函数也是一致的
        ```js
        class Foo {
            constructor(name) {
                this.name = name || 'bob';
                return {
                    a: 1
                };
            }
        }
        let foo = new Foo('tom');
        console.log(foo instanceof Foo); // false
        console.log(foo); // {a: 1}
        ```
1. 取值函数和存值函数
    取值函数和存值函数是设置在属性的Descriptor对象上的
    ```js
    class MyClass {
        constructor() {
            // ...
        }
        get prop() {
            return 'getter';
        }
        set prop(value) {
            console.log('setter: ' + value);
        }
    }

    let foo = new MyClass();
    foo.prop = 123; // setter: 123
    console.log(foo.prop); // getter

    ```
1. 属性表达式
    ```js
    let methodName = 'getArea';

    class Square {
        constructor(length) {
            // ...
        }

        [methodName]() {
            // ...
        }
    }
    ```
1. 类表达式，本质上类就是函数
    ```js
    // me是类的别名，且只能在类的内部使用
    let MyClass = class Me {
        getClassName() {
            return Me.name;
        }
    };

    // 立即执行class
    let person = new class {
        constructor(name) {
            this.name = name;
        }

        sayName() {
            console.log(this.name);
        }
    }('张三');

    person.sayName(); // "张三"
    ```
1. 静态方法
    - static关键字，就表示该方法不会被实例继承，而是直接通过类来调用
    - 如果静态方法包含this关键字，这个this指的是类，而不是实例
        ```js
        class Foo {
            static bar() {
                this.baz();
            }
            static baz() {
                console.log('hello');
            }
            // 静态方法可以和非静态方法同名
            baz() {
                console.log('world');
            }
        }

        Foo.bar() // hello
        ```
    - 静态方法可以被子类继承，子类可以利用super来改写
        ```js
        class Foo {
            static classMethod() {
                return 'hello';
            }
        }

        class Bar extends Foo {
            // 改写父类中的静态方法
            static classMethod() {
                return super.classMethod() + ', too';
            }
        }

        Bar.classMethod() // "hello, too"
        ```

1. class使用的注意点
    - class没有变量提升, 如果有提升，子类继承就会有问题了
        ```js
        // let 不会提升
        let Foo = class {};
        class Bar extends Foo {

        }
        ```
    - this指向类的实例
    - 类的Symbol.iterator方法前有一个星号，表示该方法是一个 Generator 函数。Symbol.iterator方法返回一个Foo类的默认遍历器
        ```js
        class Foo {
            constructor(...args) {
                this.args = args;
            }
            * [Symbol.iterator]() {
                for (let arg of this.args) {
                yield arg;
                }
            }
        }

        for (let x of new Foo('hello', 'world')) {
            console.log(x);
        }
        ```
1. 类的实例属性新写法
    实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层
    ```js
    class IncreasingCounter {
        // 老的写法是把实例属性this._count写在constructor内
        _count = 0;
        get value() {
            console.log('Getting the current value!');
            return this._count;
        }
        increment() {
            this._count++;
        }
    }
    ```
1. 类的静态属性
    ```js
    // 老的写法
    class Foo {
    }
    Foo.prop = 1;
    Foo.prop // 1

    // 新的写法
    class Foo {
        static prop = 1;
    }
    ```
1. 私有变量和私有方法
    >私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 ES6 不提供，只能通过变通方法模拟实现
    1. 命名法，变量名加_以示区分，不保险，类外还是可以访问到
    1. 私有方法移出模块
    1. 利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值.也有问题，类外可以用Reflect.ownKeys()访问到
        ```js
        const bar = Symbol('bar');
        const snaf = Symbol('snaf');

        export default class myClass{

            // 公有方法
            foo(baz) {
                this[bar](baz);
            }

            // 私有方法
            [bar](baz) {
                return this[snaf] = baz;
            }

            // ...
        };


        const inst = new myClass();
        Reflect.ownKeys(myClass.prototype)
        // [ 'constructor', 'foo', Symbol(bar) ]
        ```

1. new.target，使用new操作符的类
    - 属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令调用的，new.target会返回undefined
    - 子类继承父类时，new.target会返回子类,子类的constructor中执行super
        ```js
        class Rectangle {
            constructor(length, width) {
                console.log(new.target === Rectangle);
                // ...
            }
        }

        class Square extends Rectangle {
            constructor(length) {
                super(length, length);
            }
        }

        var obj = new Square(3); // 输出 false
        ```