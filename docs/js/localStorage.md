localStorage用于本地存储，但是了解仅限于get和set，现在就稍微深入一点

## 使用
1. 使用localStorage.getItem(), localStorage.setItem(),localStorage.removeItem(),localStorage只能存储字符串（其他的类型会调用Object.toString）
    ```js
    var json = {
        name: 'tom',
        age: 25
    };
    localStorage.setItem('user', json);
    console.log(localStorage.getItem('user'));// "[object Object]"

    var num = 1234;
    localStorage.setItem('num', num);
    console.log(typeof localStorage.getItem('num'));// "1234"
    ```
1. localStorage.clear()清空缓存，localStorage.length是localStorage缓存的键值对个数，localStorage.getItem().length是存储的字符串的长度
    ```js
    // localStorage容量获取
    localStorage.clear();// 清空缓存
    var json = {
        name: 'tom',
        age: 25
    };
    localStorage.setItem('user', json);
    // localStorage.getItem('user').length 15
    // localStorage.length 1

    var num = 1234;
    localStorage.setItem('num', num);
    // localStorage.getItem('num').length 4
    // localStorage.length 2
    ```

## 容量
localStorage用于本地存储，比起cookies存储量十分可观。但是localStorage的容量在不同浏览器上大小不一，而且并不能直接获取到容量大小。safari最大容量可定为2560KB，而chrome和firefox都是5120KB。
注意：这里最大容量5120KB，是针对一个域名下（并非所有域名）

1. 获得最大容量的方法？
逐步增大value的length，使用setItem(key, value)来实验，直到容量报错说明找到了最大容量。

## 时效
localStorage本地存储是永久存储，就像是写入文件或数据库，但是可以通过js来实现过期清除
    ```js
    function setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.string({
                data: value, time: new Date().getTime()
            }));
        } catch (exception) {
            // 容量超标了
            if (exception.name === 'QuotaExceededError) {
                // 这里是简单粗暴的清空了，应该找到最旧的那一个，然后再递归，发现如果还有exception，则继续删
                localStorage.clear();
                setLocalStorage(key, value);
            }
        }
    }
    function getLocalStorage(key, exp) {
        exp = exp || 1000 * 86400; // 默认一天过期
        var data = localStorage.getItem(key);
        if (data) {
            var obj = JSON.parse(data);
            // 取数据时，需要判断该缓存数据是否过期，如果过期就删除
            if (new Date().getTime() - obj.time < exp) {
                return obj.data;
            }
            localStorage.removeItem(key);
        }
        return null;
    }
    ```

## 事件
>当localStorage或者sessionStorage中存储的值发生变化时，就会触发storage事件。类似于click事件一样，其定义的方式也是一样，可以通过addEventListener来实现。

1. 在默认情况下storage事件的触发是在同源下的不同页面。同一页面修改localStorage存储的值无法触发storage事件
    ```js
    // A页面监听
    window.addEventListener('storage', function (e) {
        console.log('修改后的值：' + e.newValue);
        console.log('修改前的值: ' + e.oldValue);
        console.log('key值：' + key);
    });
    // B页面触发
    localStorage.setItem(key, data);
    ```


1. 强行同一页面监听和触发localStorage事件，使用自定义事件
    ```js
    function setLocalStorage(key, value) {
        var event = new Event('setItemEvent');
        event.newValue = value;
        window.dispatchEvent(event);
        localStorage.setItem(key, value);
    };
    window.addEventListener('setItemEvent', function (e) {
        console.log('修改后的值：' + e.newValue);
    });
    ```