> 异步请求一般用promise来控制，常见的做法是用一个Promise.all来同时的等待所有请求的状态，有些奇怪的场景可能需要大量的http请求，这时候用Promise.all那么主线程就卡住了，有可能调用栈溢出，这边就来看看怎么限制并发数

1. 主要方法其实就是同时发送几个请求，其中有请求完成状态后进行替换下一条请求，保证正在请求的数
    ```js
    //promise并发限制
    class PromisePool {
        constructor(max, fns) {
            this.pool = []; //并发池
            this.maxCount = max;
            this.requestList = fns;
        }

        start() {
            for(let i = 0; i < this.max; i++) {
                this.setTask(this.requestList.thift());
            }
            const race = Promise.race(this.pool);
            return this.run(race);
        }
        run(race) {
            race.then(() => {
                this.setTask(this.requestList.thift());
                return this.run(Promise.race(this.pool));
            })
        }
        setTask(task) {
            this.pool.push(task); //将该任务推入pool并发池中
            task.then(() => {
                //请求结束后将该Promise任务从并发池中移除
                this.pool.splice(this.pool.indexOf(task), 1);
            })
        }
    }
    ```