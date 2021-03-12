对于基本类型，没有浅拷贝和深拷贝的概念，毕竟就是一个值。而引用类型是有嵌套的

### 浅拷贝
实现浅拷贝的方法很多：slice, concat, Array.from, Object.assign(), 
1. 浅拷贝：
    - Object.assign(target, ...sources)
        ```
        let a = {
            name: '1'
        };
        let b = {
            age: 12
        };
        let c = Object.assign(a, b);
        console.log(a === c); // true
        ```
    - 扩展符：b = {...obj}
    - Array.protptype.slice
        ```
        var arr1 = [1, 2];
        var arr2 = arr1.slice();
        arr1[0] = 3;
        arr2;// [1, 2]
        ```
    - Array.prototype.concat(): [].concat(arr)
    - Array.from()
1. 深拷贝
    - JSON.parse(JSON.stringify(obj))
        ```
        var obj1 = {
            x: 1, 
            y: {
                m: 1
            }
        };
        var obj2 = JSON.parse(JSON.stringify(obj1));
        console.log(obj1) //{x: 1, y: {m: 1}}
        console.log(obj2) //{x: 1, y: {m: 1}}

        obj2.y.m = 2; //修改obj2.y.m
        console.log(obj1) //{x: 1, y: {m: 1}}
        console.log(obj2) //{x: 2, y: {m: 2}}
        ```
        使用JSON.parse(JSON.stringify(obj))局限性：undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）

    - 递归拷贝
        ```
        const deepClone = obj => {
            let clone = Object.assign({}, obj);
            Object.keys(clone).forEach(
                key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
            );
            return Array.isArray(obj) && obj.length
                // 利用Array.from生成数组
                ? (clone.length = obj.length) && Array.from(clone)
                // 空数组
                : Array.isArray(obj)
                    ? Array.from(obj)
                    : clone;
        }
        ```
