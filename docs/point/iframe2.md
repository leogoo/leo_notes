>项目需要在移动设备上，点击返回物理按键时进行一些处理，可以认为是监听当前链接的变化

### popstate事件
每当处于激活状态的历史记录条目发生变化时,popstate事件就会在对应window对象上触发。
1. 调用history.pushState()或者history.replaceState()不会触发popstate事件。而是添加或修改一个历史纪录，popstate事件对象的state属性包含了这个历史记录条目的state对象的一个拷贝
1. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法)
1. HTML5为history添加了两个新的方法：history.pushState，history.replaceState
    - pushState(state, title, url)用于添加一条浏览记录
        1. state是一个与指定网址相关的状态对象
        1. title是页面的标题
        1. url是新的地址
        1. pushState不会触发页面刷新，只是修改history对象，地址栏发生变化
    - replaceState(state, title, url)只是修改当前的浏览记录
1. 使用实例
    ```
    window.onpopstate = function(event) {
        alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    };

    history.pushState({page: 1}, "title 1", "?page=1");    //添加并激活一个历史记录条目 http://example.com/example.html?page=1,条目索引为1
    history.pushState({page: 2}, "title 2", "?page=2");    //添加并激活一个历史记录条目 http://example.com/example.html?page=2,条目索引为2
    history.replaceState({page: 3}, "title 3", "?page=3"); //修改当前激活的历史记录条目 http://ex..?page=2 变为 http://ex..?page=3,条目索引为3
    history.back(); // 弹出 "location: http://example.com/example.html?page=1, state: {"page":1}"
    history.back(); // 弹出 "location: http://example.com/example.html, state: null
    history.go(2);  // 弹出 "location: http://example.com/example.html?page=3, state: {"page":3}
    ```
1. 监听移动设备返回
    ```
    history.pushState(null, null, location.href);// 添加一条浏览记录
    window.addEventListener('popstate', function(event) {
        ...
    }, false);
    ```
1. iframe的src变换会影响到浏览记录，返回时会优先修改iframe的src值，然后才是浏览器的记录。这时在使用history.pushState会有两条历史纪录。解决方案是当iframe还不在dom中修改他的src
```
var iframeNew = iframe.cloneNode();
iframeNew.src = src;
iframe.parentNode.replaceChild(iframeNew, iframe);
```