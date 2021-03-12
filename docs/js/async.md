>async函数就是Generator语法糖，实现方便的异步操作.async是一种语法糖，Promise是一个内置对象
### 1 .async函数总是返回Promise对象
```js
async function A() {
    return 123;
}
A().then(x => console.log(x));
```
### 2. 利用await处理async异步结果
await只能在async内部使用，等待操作对象promise返回
- 如果promise是完成态，await的结果是完成态的值
- 如果promise是拒绝状态，await会抛出拒绝值(拒绝值不是异常，容易搞混)

1. 处理单个async返回值
    ```js
    function asyncFunc() {
        return otherAsyncFunc().then(result => {}
            console.log(result);
        });
    }

    // 等价于
    async function asyncFunc() {
        const result = await otherAsyncFunc();
        console.log(result);
    }
    ```
1. 按序处理多个异步返回值
    ```js
    function asyncFunc() {
        return otherAsyncFunc1().then(result1 => {
            console.log(result1);
            return otherAsyncFunc2();
        })
        .then(result2 => {
            console.log(result2)
        })
    }

    // 等价
    async function asyncFunc() {
        const result1 = await otherAsyncFunc1();
        console.log(result1);
        const result2 = await otherAsyncFunc2();
        console.log(result2);
    }
    ```
1. 并行处理多个async返回值
    ```js
    function asyncFunc() {
        return Promise.all([
            otherAsyncFunc1(),
            otherAsyncFunc2()
        ]).then([result1, result2] => {
            console.log(result1, result2);
        });
    }

    // 等价
    async function asyncFunc() {
        const [result1, result2] = await Promise.all([
            otherAsyncFunc1(),
            otherAsyncFunc2()
        ]);
        console.log(result1, result2);
    }
    ```
1. 错误处理
    ```js
    function asyncFunc() {
        return otherAsyncFunc()
        .catch(err => {
            console.log(err);
        });
    }

    // 等价
    async function asyncFunc() {
        try {
            await otherAsyncFunc();
        } catch (err) {
            console.log(err);
        }
    }
    ```

### 3.async函数变形
- 异步函数声明：`async function foo() {}`
- 异步函数表达式: `const foo = async function () {}`
- 异步函数定义: `let obj = { async foo() {} )`
- 异步箭头函数: `const foo = async () => {}`

### 4. 异步函数和回调
await只『等待』直接相关的async函数
```js
async function B(urls) {
    return urls.map(url => {
        // error
        const content = await httpGet(url);
        return content;
    });
}

// 正确写法是回调函数也需是async函数
async function B(urls) {
    return urls.map(async (urls) => {
        const content = await httpGet(url);
        return content;
    });
}

// 返回promise数组时，优化
async function B(urls) {
    await Promise.all(urls.map(
        async url => {
            const content = await httpGet(url);
            console.log(content);
        }
    ));
}
```