> 装饰器是一种函数，写成@ + 函数名。它可以放在类和类方法的定义前面

### 类装饰器
类装饰器的第一个参数就是被装饰的类
```js
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}

function connect(mapStateToProps, mapDispatchToProps) {
    return function (target) {

    }
}
```

### 方法的装饰
1. 装饰器函数有三个参数: 类的原型，属性名，属性的描述对象，返回descriptor对象
    ```js
    class Person {
    @readonly
    name() { return `${this.first} ${this.last}` }
    }

    function readonly(target, name, descriptor){
        // descriptor对象原来的值如下
        // {
        //   value: specifiedFunction,
        //   writable: true
        //   enumerable: false,
        //   configurable: true,
        // };
        descriptor.writable = false;
        return descriptor;
    }

    readonly(Person.prototype, 'name', descriptor);
    // 类似于
    Object.defineProperty(Person.prototype, 'name', descriptor);
    ```
1. 装饰执行顺序: 从外到内进入，然后由内向外执行
    ```js
    function dec(id){
        console.log('evaluated', id);
        return (target, property, descriptor) => console.log('executed', id);
    }

    class Example {
        @dec(1)
        @dec(2)
        method(){}
    }
    // evaluated 1
    // evaluated 2
    // executed 2
    // executed 1
    ```
1. 函数声明提升，不能使用装饰器


### autobind
```js
function autobind(...args) {
    // 作类装饰器
	if (args.length === 1) {
		return boundClass(...args);
	}
	return boundMethod(...args);
}

function boundClass(target) {
    let keys;
    // 获得类属性
    if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
        keys = Reflect.ownKeys(target.prototype);
    } else {
        keys = Object.getOwnPropertyNames(targets.prototype);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
        }
    }

    keys.forEach(key => {
        if (key === 'constructor') {
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

        if (typeof descriptor.value === 'function') {
            Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
        }
    })
}

function boundMethod(target, key, descriptor) {
    let fn = descriptor.value;

    let definedProperty = false;

    return {
        configurable: true,
        enumerable: true,
        get() {
            if (definingProperty || this === target.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') {
				return fn;
			}

			const boundFn = fn.bind(this);
			definingProperty = true;
			Object.defineProperty(this, key, {
				configurable: true,
				get() {
					return boundFn;
				},
				set(value) {
					fn = value;
					delete this[key];
				}
			});
			definingProperty = false;
			return boundFn;
        },
        set(value) {
            fn = value;
        }
    }
}
```