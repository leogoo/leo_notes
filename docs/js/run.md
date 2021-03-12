>js是单线程的语言

### javascript事件循环
js任务顺序执行，将js任务分为同步任务和异步任务。当我们打开网站时，网页的渲染过程就是一大堆同步任务，比如页面骨架和页面元素的渲染。而像加载图片音乐之类占用资源大耗时久的任务，就是异步任务。
<br>
<img src='../img/js/run.webp'>
执行过程：
- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
- 当指定的事情完成时，Event Table会将这个函数移入Event Queue。
- **主线程内的任务执行完毕为空**，会去Event Queue读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的Event Loop(事件循环)

### setTimeout
setTimeout是经过指定时间后，将要执行的任务加入到Event Queue，而不是执行。

代码示例：
```js
setTimeout(() => {
    task();
}, 3000);
sleep(10000000)
```
上述代码的执行流程为：
- 计时事件timeout进入Event Table并注册回调函数task，开始计时
- 执行主线程的sleep函数
- 3秒到了，计时事件timeout完成，task方法进入Event Queue，主线程不空闲，等待
- sleep执行结束，task方法从Evnet Queue进入主线程执行


有时会看到setTimeout(fn, 0)这种代码，有上面的处理流程就知道，并不是立即执行。fn会立即进入Event Queue，只要主线程空闲就会执行fn。
>即便主线程为空，setTimeout延迟0毫秒也是不可能实现的，最快要等待4毫秒。

### setInterval
setInterval是每隔指定时间将注册的函数加入Event Queue。这时很要注意回调函数自身的执行时间，一旦setInterval的回调函数fn执行时间超过了延迟时间ms，那么就完全看不出来有时间间隔了。

### Promise和process.nextTick(callback)
>process.nextTick(callback)类似node.js版本的"setTimeout",在事件循环的下一次循环中调用callback函数

除了广义同步任务和异步任务，任务更精细的定义如下：
- macro-task(宏任务): 包括整体代码script，setTimeout，setInterval
- micro-task(微任务): Promise，process.nextTick

不同类型的任务会进入对应的Event Queue，例如setTimeout和setInterval会进入相同的Evnet Queue

事件循环的顺序，决定js代码的执行顺序。
1. 第一次循环从整体代码（宏任务）开始，将setTimeout、setInterval的回调加入宏任务Event Queue，将Promise.then的回调加入微任务Event Queue。
1. 微任务队列不为空，执行微任务队列。
1. 第二次循环，执行宏任务队列中的代码，遇到宏任务加入宏任务Event Queue，遇到微任务同样加入微任务Event Queue
1. 第二轮事件循环宏任务结束，微任务队列不为空，执行微任务
1. 继续循环执行宏任务队列


### 最后
- js是单线程语言，异步也是通过同步的方式模拟
- Event Loop是js的执行机制，也是实现异步的方法