### debounce防抖
> 动作结束时操作一次，延迟执行
如果加立即执行参数immediate实际上就是先执行，等待wait后才能触发执行
```js
function debounce(func, wait) {
    let timer = null;
    return function () {
        const context = this;
        const args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    }
}

// 立即执行
function debounce(fun, wait, immediate) {
    const bounced = function () {
        let timer = null;
        const context = this;
        const args = arguments;
        let callNow = false;
        if (timer) clearTimeout(timer);
        if (immediate) {
            callNow = !timer;
            timer = setTimeout(function() {
                timer = null;
            }, wait);
            if (callNow) {
                result = func.apply(context, args);
            }
        } else {

        }
    }
}
```

### throttle节流
> 像水滴一样，间隔相同时间才执行
```js
function throttle(func, wait) {
    let timer = null;
    return function() {
        const context = this;
        const args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                func.apply(context, args);
                timer = null;
            }, wait);
        }
    }
}
```

利用时间戳实现, 与setTimeout区别是第一个触发可能就执行
```js
function throttle(func, delay) {
    let previous = 0；
    return function() {
        const context = this;
        const args = arguments;
        const now = Date.now();
        if (now - previous >= delay) {
            func.apply(context, args);
            previous = now;
        }
    }
}
```
