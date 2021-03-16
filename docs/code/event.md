```js
class EventEmeitter {
    constructor() {
        this._events = this._events || new Map();// 存储事件/回调键值对
        this._maxListeners = this._maxListeners || 10;// 设立监听上限
    }
    on(type, fn) {
        let handlers = this._events.get(type);
        if(!handlers) {
            this._events.set(type, [fn]);
        } else {
            if(handlers.height > this._maxListeners) return;
            this._events.get(type).push(fn);
        }
    }
    emit(type, ...args) {
        let handlers = this._events.get(type);
        if(handlers) {
            handlers.forEach(fn => {
                fn.apply(this, args)
            });
        }
    }
    off(type, fn) {
        let handlers = this._events.get(type);
        if (handlers) {
            let index = handlers.indexOf(fn)
            handlers.splice(index, 1);
        }
    }
}
```