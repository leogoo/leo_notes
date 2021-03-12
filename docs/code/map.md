### map
1. 实现
    ```js
    Array.prototype.map = function (callbackFn, thisArg) {
        if (this === null || this === undefined) {
            throw new TypeError("");
        }
        if (Object.prototype.toString.call(callbackFn) !== "[object Function]") {
            throw new TypeError("");
        }

        // 草案中提到要先转换为对象
        let O = Object(this);
        let T = thisArg;

        // 字面意思是指"右移 0 位"，但实际上是把前面的空位用0填充，这里的作用是保证len为数字且为整数
        let len = O.length >>> 0;
        let A = new Array(len);
        for (let i = 0; i < len; i++) {
            if (i in O) {
                let value = O[i];
                A[i] = callbackFn.call(T, O[i], i, O);
            }
        }
        return A;
    };
    ```
1. 取整
    1. parseInt(n, 10),可以处理数字类型的，处理对象、数组、布尔值返回的就是NaN了
    1. `>>>`这种位移的方法最好不要处理负数
        ```js
        parseInt(45.5, 10); // 45
        parseInt(-45.5, 10); // -45
        parseInt([], 10); // NaN
        parseInt({}, 10); // NaN
        parseInt(true, 10); // NaN

        [] >>> 0; // 0
        {} >>> 0; // 0
        true >>> 0; // 1
        false >>> 0; // 0
        45.5 >>> 0; // 45
        -45.5 >>> 0; // 4294967251
        ```

### reduce
1. 实现
    ```js
    Array.prototype.reduce = function (cb, initialValue) {
        const arr = this;
        let acc = initialValue || arr[0];
        const startIndex = initialValue ? 0 : 1;

        for (let i = startIndex; i < arr.length; i++) {
            acc = cb.call(undefined, acc, arr[i], i, arr);
        }
        return acc;
    }
    ```
1. 递归实现
    ```js
    Array.prototype.fakeReduce = function (fn, initialValue) {
        const arr = this;
        const [head, ...tail] = arr;
        let startIndex = 0;
        if (initialValue === undefined || initialValue === null) {
            startIndex = 1;
            return reduceHelper(fn, head, startIndex, arr);
        } else {
            return reducehelper(fn, initialValue, startIndex, tail);
        }
        const startIndex = (initialValue === undefined || initialValue === null) ? 1 : 0;
        return reduceHelper(fn, initialValue, arr);
    };
    function reduceHelper(fn, acc, idx, arr) {
        if (arr.length === 0) return acc;
        const [head, ...tail] = arr;
        idx ++;
        return reduceHelper(fn, fn(acc, head, idx, arr), tail);
    }
    ```