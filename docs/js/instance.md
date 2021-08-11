>其实学过其他语言的对于继承没啥不好理解的，问题是js里的继承涉及到原型链就会搞出好多事情，私有变量和公有什么的都和原型相关。虽然开发时不怎么用到的。。。但是肯定要理解好

先放张很关键的图
<br/><img src='../img/js/instance.png'>

### 原型
1. 每个函数都有一个prototype属性，通过new出来的对象会有一个__proto__属性指向构造函数的prototype。
1. prototype[显式原型]
    - 指向函数的原型对象，只有Function.prototype.bind方法构造的函数没有prototype
    - 被指向的原型对象自动获得constructor属性，指回构造函数
1. __proto__[隐式原型]
    - __proto__ 指向了创建该对象的构造函数的prototype(显式原型), b.__proto__ === B.prototype
    - 原型链由__proto__构成
1. new 操作符
    1. new的过程
        1. 生成一个新的对象
        1. 链接到原型，新对象新增__proto__属性，并且链接到构造函数的原型上
        1. 绑定this
        1. 返回新对象
1. 所有对象都可以通过原型链最终找到 Object.prototype ，虽然 Object.prototype 也是一个对象，但是这个对象却不是 Object 创造的，而是引擎自己创建了 Object.prototype
1. 引擎创建了 Object.prototype ,然后创建了 Function.prototype ，并且通过 __proto__ 将两者联系了起来

### 继承
>关于js的继承有几种方式，但是对于他们的优缺点，很难一下子记住，在这对比一下
1. 原型链继承
    特点：基于原型链，实例既是子类实例也是父类实例
    缺点： 不能实现多继承
    ```
    // 父类
    function Animal() {}
    // 子类
    function Cat() {}
    Cat.prototype = new Animal();

    let cat = new Cat();
    ```
1. 构造继承：使用父类的构造函数来**增强子类实例**，等于是复制父类的实例属性给子类（没用到原型）
    特点：可以实现多继承
    缺点：只能继承父类实例的属性和方法，不能继承原型上的属性和方法
    ```
    function Cat(name) {
        Animal.call(this);
        this.name = name || 'tom';
    }
    let cat = new Cat('bob');

    console.log(cat instanceof Animal); // false
    console.log(cat instanceof Cat); // true
    ```
1. 组合继承：相当于构造继承和原型链继承的组合体。通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
    特点：可以继承父类属性/方法，也可以继承原型属性/方法
    缺点：调用了两次父类构造函数，生成了两份实例
    ```
    function Cat(name) {
        Animal.call(this);
        this.name = name || 'tom';
    }
    Cat.prototype = new Amimal();
    Cat.prototype.constructor = Cat;

    let cat = new Cat();
    console.log(cat instanceof Animal); // true
    console.log(cat instanceof Cat); // true
    ```
1. 寄生式继承是于原型式继承紧密相关的一种思路。寄生式基础的思路与寄生构造函数和工厂模式类似，既创建一个仅用于封装继承过程的函数，该函数内部以某种方式来增强对象

    ```
    function createObj(o) {
        let Foo = function() {};
        Foo.prototype = o;
        return new Foo();
    }

    function createAnother(original) {
        let sub = createObj(original);
        // 增强
        sub.sayHi = function() {

        };
    }
    ```

1. 寄生组合继承：通过寄生方式，**砍掉父类的实例属性**，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性
    ```
    function Cat(name){
        Animal.call(this);
        this.name = name || 'Tom';
    }

    (function(){
        var Super = function(){};
        // Animal.prototype而不是Animal的实例，去掉实例属性
        Super.prototype = Animal.prototype;
        Cat.prototype = new Super();
    })();

    var cat = new Cat();
    console.log(cat instanceof Animal); // true
    console.log(cat instanceof Cat); //true
    ```

### es6中的继承
1. 子类如果有constructor(默认可以不写),只有在super后才能使用this
    ```
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class ColorPoint extends Point {
        constructor(x, y, color) {
            this.color = color; // ReferenceError
            super(x, y);
            this.color = color; // 正确
        }
    }
    ```
1. Object.getPrototypeOf方法可以用来从子类上获取父类
    ```
    Object.getPrototypeOf(ColorPoint) === Point
    ```
1. super关键字
    1. super作为函数调用时，代表父类的构造函数，但是this仍是指向子类
        ```
        class A {
            constructor() {
                console.log(new.target.name);
            }
        }
        class B extends A {
            constructor() {
                super();
            }
        }
        new A() // A
        new B() // B
        ```
    1. super()只能用在子类的构造函数之中，用在其他地方就会报错
    1. super作为对象时，在普通方法中，指向父类的**原型对象(实例属性不能获得）**；在静态方法中，指向父类
        ```js
        class A {
            constructor() {
                this.x = 2;// 实例属性
            }
            // 原型方法
            p() {
                return 2;
            }
        }
        A.prototype.v = 3;

        class B extends A {
            constructor() {
                super();
                console.log(super.p()); // 2
                console.log(super.v); // 3
            }
            get y() {
                return super.x;
            }
        }

        let b = new B();
        b.x // undefined
        ```
    1. 在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例
        ```js
        class A {
            constructor() {
                this.x = 1;
            }
            print() {
                console.log(this.x);
            }
        }

        class B extends A {
            constructor() {
                super();
                this.x = 2;
            }
            m() {
                super.print();
            }
        }

        let b = new B();
        b.m() // 2
        ```
    1. 对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。
        ```js
        var obj = {
            toString() {
                return "MyObject: " + super.toString();
            }
        };

        obj.toString(); // MyObject: [object Object]
        ```
1. 类的prototype属性和__proto__属性
    1. 每一个对象都有__proto__属性，指向对应的构造函数的prototype属性
    1. class作为构造函数的语法糖，同时有prototype和__proto__
        1. 子类的__proto__属性，表示构造函数的继承，总是指向父类
        1. 子类的prototype属性的__proto__属性，表示方法的继承，指向父类的prototype
            ```js
            class A {
            }

            class B extends A {
            }

            B.__proto__ === A // true
            B.prototype.__proto__ === A.prototype // true

            // 类的继承执行以下代码
            Object.setPrototypeOf = function(obj, proto) {
                obj.__proto__ = proto;
                return obj;
            };
            Object.setPrototypeOf(B.prototype, A.prototype);
            Object.setPrototypeOf(B, A);
            ```
    1. 子类实例的__proto__.__proto__属性,可以修改父类实例的行为
1. 原生构造函数的继承
    1. ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数
    1. ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承
1. Mixin 模式的实现
    1. Mixin 指的是多个对象合成一个新的对象