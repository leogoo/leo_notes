1. 实现（利用现有的方法了解过程)
    ```js
    Array.prototype.splice = function (startIndex, deleteCount, ...addElements) {
        let argumentsLen = arguments.length;
        let array = Object(this);
        let len = array.length >>> 0;
        let deleteArr = new Array(deleteCount);

        startIndex = computeStartIndex(startIndex, len);
        deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);

        // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
        if (Object.isSealed(array) && deleteCount !== addElements.length) {
            throw new TypeError('the object is a sealed object!')
        } else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
            throw new TypeError('the object is a frozen object!')
        }

        // 拷贝删除的元素
        deleteArr = array.slice(startIndex, deleteCount);
        // 移动删除元素后面的元素
        // 插入新元素
        array = [].concat(array.slice(0, startIndex), deleteArray, array.slice(startIndex + deleteCount));

        return deleteArr;
    };
    const computeStartIndex = (startIndex, len) => {
        if (startIndex < 0) {
            return len + startIndex > 0 ? len + startIndex : 0;
        } else {
            return startIndex >= len ? len : startIndex;
        }
    };
    const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
        if (argumentsLen === 1) {
            return len - startIndex;
        }
        if (deleteCount > len - startIndex) {
            return len - startIndex;
        }
        if (deleteCount < 0) {
            return 0;
        }
        return deleteCount;
    };
    ```
1. 注意点
    1. startIndex
        - startIndex小于0时，`len + startIndex > 0 ? len + startIndex : 0`
        - startIndex大于数组长度时，startIndex就设为len
    1. 删除元素个数
        - 只有一个startIndex参数时，删除后面所有参数
        - 删除个数大于len时， 删除后面所有参数
        - 删除个数小于0时，删除个数为0
    1. 密封对象, 不可扩展
        1. Object.seal()生成密封对象
            - 给对象设置Object.preventExtension(obj1)，禁止更改原型，禁止添加属性
            - 给对象的没有属性设置configurable: false,禁止更改属性值
            - 与Object.freeze不同的是，Object.seal后的对象是可写的writable:true
        1. 密封的数组只有删除和添加的个数相同才能使用splice
        ```js
        // 如果这个对象不是空对象,则它不会变成密封对象,因为密封对象的所有自身属性必须是不可配置的.
        var hasProp = { fee: "fie foe fum" };
        Object.preventExtensions(hasProp);
        Object.isSealed(hasProp); // === false

        // 如果把这个属性变的不可配置,则这个对象也就成了密封对象.
        Object.defineProperty(hasProp, "fee", { configurable: false });
        Object.isSealed(hasProp); // === true
        ```
    
