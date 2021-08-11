1. 实现
    ```js
    // 定义Promise的三种状态常量
    const PENDING = 'PENDING';
    const FULFILLED = 'FULFILLED';
    const REJECTED = 'REJECTED';
    const isFunction = fn => Object.prototype.toString.call(fn) === '[object Function]';
    const isPending = status => status === PENDING;
    const isPromise = target => target instanceof Promise;
    class Promise {
        constructor(executor) {
            this.status = PENDING;
            this.value;
            this.reason;
            // 添加成功回调函数队列
            this.fulfilledQueues = [];
            // 添加失败回调函数队列
            this.rejectedQueues = [];
            // 执行handle
            try {
                executor(this._resolve.bind(this), this._reject.bind(this)); 
            } catch (err) {
                this.reject(err);
            }
        }
        _resolve(val) {
            const self = this;
            const resolveFn = () => {
                if (self.status === PENDING) {
                    self.status = FULFILLED;
                    self.value = val;
                    let cb;
                    while(cb = self.fulfilledQueues.shift()) {
                        cb(val);
                    }
                }
            };
            setTimeOut(resolveFn, 0);
        }
        _reject(err) {
            const self = this;
            const rejectFn = () => {
                if (self.status === PENDING) {
                    self.status = REJECTED;
                    self.reason = err;
                    let cb;
                    while(cb = self.rejectedQueues.shift()) {
                        cb(err);
                    }
                }
            };
            setTimeOut(rejectFn, 0);
        }
        then(onFulfilled, onRejected) {
            const self = this;
            const {status, value, reason, fulfilledQueues, rejectedQueues} = self;
            // 返回一个新的promise
            return new Promise((resolve, reject) => {
                let fulfilledHandle = value => {
                    try {
                        if (isFunction(onFulfilled)) {
                            const result = onFulfilled(value);
                            // 如果当前回调函数返回值为promise实例，需要等待其状态变化后再执行下一个回调
                            if (isPromise(result)) {
                                // then里返回的是promise，则等完成后再将新promise同步对应的状态
                                result.then(resolve, reject);
                            } else {
                                // 返回简单值则直接resolve新的promise，执行下一个then的回调
                                resolve(result);
                            }
                        }
                    } catch (err) {
                        // 新的promise出错，改变状态
                        reject(err);
                    }
                };

                let rejectedHandle = (reason) => {
                    const self = this;
                    try {
                        if (isFunction(onRejected)) {
                            const result = onRejected(reason);
                            if (isPromise(result)) {
                                result.then(resolve, reject);
                            } else {
                                reject(result);
                            }
                        }
                    } catch (err) {
                        reject(err);
                    }
                };

                switch(status) {
                    case PENDING:
                        fulfilledQueues.push(fulfilledHandle);
                        rejectedQueues.push(rejectedHandle);
                        break;
                    case FULFILLED:
                        fulfilledHandle(value);
                        break;
                    case REJECTED:
                        rejectedHandle(reason);
                        break;
                }
            })
        }

        static resolve (value) {
            if (value instanceof Promise) return value;
            return new Promise(resolve => resolve(value))
        }

        static reject (value) {
            return new Promise((resolve ,reject) => reject(value))
        }
    }
    ```
1. 注意点
    1. 状态只能由 pending 转到 fulfilled 或 rejected 状态，同一个promise状态不能再改变
    1. then返回一个新的promise，用于链式调用，为什么不直接返回this
        ```js
        // 如果返回的是this，promise2 === promise1
        // promise2 状态也应该等于 promise1 同为 resolved, 但执行onResolved回调需要改变状态为reject,这就出现矛盾了
        var promise2 = promise1.then(function (value) {
            return Promise.reject(3)
        });
        ```

### Promise.resolve和Promise.reject
1. Promise.reject比较简单
    ```js
    Promise.reject = function (value){
        return new Promise(function(resolve, reject) {
            reject(value);
        });
    }
    ```
1. Promise.resolve参数可能有
    - 无参数 
    - 普通数据对象
    - 一个Promise实例
    - 一个thenable对象(thenable对象指的是具有then方法的对象) 
    ```js
    static resolve(value) {
        if (value instanceof Promise) {
            // 如果是Promise实例，直接返回
            return value;
        } else if (value && typeof value === 'object' && typeof value.then === 'function'){
            let then = value.then;
            // 有then但是不是promise时，直接执行resolve
            return new Promise(resolve => {
                then(resolve);
            });
        } else {
            // 如果不是Promise实例，返回一个新的Promise对象，状态为FULFILLED
            return new Promise((resolve, reject) => resolve(value));
        }
    }
    ```

### Promise.all
> Promise.all有一个rejected后立即结束返回，或者是所有promise都fulfilled状态
```js
function PromiseAll(arr) {
    // 返回一个promise
    return new Promise((resolve, reject) => {
        const result = new Array(arr.length);
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            const p = arr[i];
            p.then(data => {
                // 保存每个promise完成态的返回值
                result[i] = data;
                count++;
                // count用于记次数，达成完成态的promise个数=promise个数则resolve
                if (count === arr.length) {
                    resolve(result);
                }
            }).catch(err => {
                // 有个promise异常错误，则立即停止
                console.log('err1', err);
                reject(err);
            })
        }
    });
}
```
测试：
```js
const p1 = new Promise((resolve) => {
    setTimeout(() => {
        resolve(1111);
    }, 1000);
}).then(data => {
    return 5555;
})

const p2 = new Promise((resolve) => {
    setTimeout(() => {
        resolve(2222);
    }, 2000);
});

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(0000);
    }, 3000);
}).catch(err => {
    // reject后，then里面取到的是undefined
    console.log('err3', err);
});

PromiseAll([p1, p2, p3]).then((data) => {
    console.log(data); // [5555, 2222, undefined]
}).catch(err => {
    console.log('err2', err);
})
```

### Promise.allSettled
> Promise.allSettled()方法返回一个在所有给定的promise都已经fulfilled或rejected后的promise。

1. promise.all的缺陷是，有异常的情况下，其他的promise结果捕获不到了
    ```js
    const promises = [
        delay(100).then(() => 1),
        delay(200).then(() => 2),
        Promise.reject(3)
    ];

    Promise.all(promises).then(values => console.log(values))
    // 最终输出： Uncaught (in promise) 3

    // 加入catch语句后，最终输出：3
    Promise.all(promises)
        .then(values=>console.log(values))
        .catch(err=>console.log(err))
    ```
1. Promise.allSettled()方法不论promise的最终状态，都会返回
    ```js
    
    const promises = [
        Promise.resolve(2),
        Promise.reject(3)
    ];

    Promise.allSettled(promises)
        .then(values => console.log(values));

    // 输出
    // [
    //     { status: 'fulfilled', value: 2 },
    //     { status: 'rejected', reason: 3 }
    // ]
    ```
1. 源码
    ```js
    Promise.allSettled = function (promises) {
        return Promise.all(promises.map(function (promise) {
            return promise.then(function (value) {
                return { state: 'fulfilled', value: value };
            }).catch(function (reason) {
                return { state: 'rejected', reason: reason };
            });
        }));
    };
    ```