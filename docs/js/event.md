>React/Vue不同组件之间是怎么通信的?
1. Vue
    - 父子组件用Props通信
    - 非父子组件用Event Bus通信
    - 如果项目够复杂,可能需要Vuex等全局状态管理库通信
    - $dispatch(已经废除)和$broadcast(已经废除)

1. React
    - 父子组件,父->子直接用Props,子->父用callback回调
    - 非父子组件,用发布订阅模式的Event模块
    - 项目复杂的话用Redux、Mobx等全局状态管理管库
    - 用新的Context Api

### 基本构造
1. 初始化class
```js
class EventEmeitter {
    constructor() {
        this._events = this._events || new Map();// 存储事件/回调键值对
        this._maxListeners = this._maxListeners || 10;// 设立监听上限
    }
}
```
1. 监听与触发
方法拆出来写，下面是es5的原型写法，最后是要class形式
```js
// 监听type时间
EventEmitter.prototype.addListener = function(type, fn) {
    // 将type事件以及对应的fn函数放入this._events中储存
    if (!this._events.get(type)) {
        this._events.set(type, fn);
    }
}
// 触发
EventEmeitter.prototype.emit = function(type, ...args) {
    let handler;
    // 从储存事件键值对的this._events中获取对应事件回调函数
    handler = this._event.get(type);
    if (args.length > 0) {
        handler.apply(this, args);
    } else {
        // 参数少时用call，性能好
        handler.call(this);
    }
    return true;
}
```
在监听方法处相同的type只存一次处理函数

### 升级改造
1. 监听/触发器升级
支持多个监听者
```js
EventEmitter.prototype.addListener = function(type, fn) {
    const handler = this._events.get(type);
    if(!handler) {
        this._events.set(type, [fn]);
    } else {
        if (handler.length >= this._maxListeners) return;
        this._events.get(type).push(fn);
    }
}
EventEmeitter.prototype.emit = function(type, ...args) {
    let handler;
    handler = this._events.get(type);
    let length = handler.length;
    for (let i = 0; i < length; i++) {
        handler[i].apply(this, args);
    }
    return true;
}
```
### es6 class版本
```js
class EventEmeitter {
    constructor() {
        this._events = this._events || new Map();// 存储事件/回调键值对
        this._maxListeners = this._maxListeners || 10;// 设立监听上限
    }
    on(type, fn) {
        let handler = this._events.get(type);
        if(!handler) {
            this._events.set(type, [fn]);
        } else {
            if(handler.height > this._maxListeners) return;
            this._events.get(type).push(fn);
        }
    }
    emit(type, ...args) {
        let handler = this._events.get(type);
        if(handler) {
            handler.forEach(fn => {
                fn.apply(this, args)
            });
        }
    }
}
```