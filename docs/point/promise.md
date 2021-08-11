> 异步请求一般用promise来控制，常见的做法是用一个Promise.all来同时的等待所有请求的状态，有些奇怪的场景可能需要大量的http请求，这时候用Promise.all那么主线程就卡住了，有可能调用栈溢出，这边就来看看怎么限制并发数

1. 主要方法其实就是同时发送几个请求，其中有请求完成状态后进行替换下一条请求，保证正在请求的数
    ```js
    class Scheduler {
        constructor(limit) {
            this.queue = [];
            this.maxCount = limit;
            this.runCounts = 0;
        }
        add(time, order) {
            const promiseCreator = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log(order);
                        resolve();
                    }, time);
                });
            };
            this.queue.push(promiseCreator);
        }
        taskStart() {
            for (let i = 0; i < this.maxCount; i++) {
                this.request();
            }
        }
        request() {
            if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
                return;
            }
            this.runCounts++;
            this.queue
                .shift()()
                .then(() => {
                    this.runCounts--;
                    this.request();
                });
        }
    }
    const scheduler = new Scheduler(2);
    const addTask = (time, order) => {
    scheduler.add(time, order);
    };
    addTask(1000, "1");
    addTask(500, "2");
    addTask(300, "3");
    addTask(400, "4");
    scheduler.taskStart();
    ```

1. Promise.race返回的是第一个达成完成态的那个promise
    ```js
    function limitLoad(urls, handler, limit) {
        const sequence = [].concat(urls);
        let promises = [];
        promises = sequence.splice(0, limit).map((url, index) => {
            return handler(url).then(() => {
                return index;
            })
        });

        let p = Promise.race(promises);
        for(let i = 0; i < sequence.length; i++) {
            p = p.then(res => {
                // 直接替换完成的那个promise
                promises[res] = handler(sequence[i]).then(() => {
                    return res;
                });
                return Promise.race(promises);
            })
        }
    }
    ```