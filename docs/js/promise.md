### 利用resolve、reject来修改状态
```js
class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        let resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
            }
        }
        let reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
            }
        }
        try {
            executor(resolve, reject);
        } catch(err) {
            this.reject(err);
        }
    }
}

let p = new Promise((resolve) => {
    resolve('hello')
});
console.log(p) // Promise { status: 'fulfilled', value: 'hello', reason: undefined }
```

### then方法
then方法根据状态执行对应的函数
```js
class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        let resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
            }
        }
        let reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
            }
        }
        try {
            executor(resolve, reject);
        } catch(err) {
            this.reject(err);
        }
    }
    then(onFulfilled, onRejected) {
        if (this.status === 'fulfilled') {
            onFulfilled(this.value);
        }
        if (this.status === 'rejected') {
            onRejected(this.reason);
        }
    }
}

let p = new Promise((resolve) => {
    resolve('tom')
}).then(value => {
    console.log('hello ' + value);
});
```

### 异步情况
在resolve和reject函数内修改状态，异步时应该是在状态改变后才执行对应的函数，所以需要保存好传入的需要执行的函数
```js
class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                // 完成态执行函数
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        let reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject);
        } catch(err) {
            this.reject(err);
        }
    }
    then(onFulfilled, onRejected) {
        if (this.status === 'fulfilled') {
            onFulfilled(this.value);
        }
        if (this.status === 'rejected') {
            onRejected(this.reason);
        }
        // 异步执行结束后才执行，保存函数
        if (this.status === 'pending') {
            this.onResolvedCallbacks.push(() => onFulfilled(this.value));
            this.onRejectedCallbacks.push(() => onRejected(this.reason);
        }
    }
}
```

### 链式调用
```js
class Promise {
    then(onFulfilled, onRejected) {
        let promise2 = new Promise((resolve, reject) => {
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
            onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        // resolvePromise函数，处理自己return的promise和默认的promise2的关系
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            }
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            }
            // 异步执行结束后才执行，保存函数
            if (this.status === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            onRejected(this.reason);
                            resolvePrimise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
}
```

### resolvePromise
```js
function resolvePromise (promise2, x, resolve, reject) {
    if (x === promise2) {
        throw reject(new TypeError('Chaining cycle detected for promise'));
    }
    let called;
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            // 如果then是函数，就默认是promise
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, err => {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x;)
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
```