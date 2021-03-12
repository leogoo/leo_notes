>平常也不怎用到iframe，一次需求中发现用iframe发请求相当方便，当然学习时不推荐使用iframe也是有原因的

## 基本属性
通常用法就是直接在页面嵌套iframe标签并指定src属性，iframe常用属性：
- frameborder： 是否显示边框，1/0
- height
- width
- name: 框架名称准用，window.frames[name]
- scrolling: 框架是否滚动
- src： 内框架地址

>同域时，父页面可以对子页面进行改写
>不同域时，父页面没有权限改动子页面，但可以实现页面的跳转

## 获取iframe内容（同域）
1. 父页面获取子页面
iframe.contentWindow获取iframe的window对象
iframe.contentDocument获取iframe的document对象
2. 获取父级内容
window.parent获取上一级windowm对象
window.top获取最顶级容器的window对象

## 自适应iframe
iframe用来做广告是十分方便的，可以将iframe理解为一个沙盒，主页的css不会入侵里面的样式
iframe自带滚动条，默认不会全屏，自适应
1. 去掉滚动条
```
<iframe src="./iframe.html" id="iframe" scrolling="no"></iframe>
```
1. 设置iframe的高为子页面body的高
```
var iwindow = iframe.contentWindow;
var idoc = iwindow.document;
iframe.height = idoc.body.offsetHeight;
```

## 安全性
1. 防嵌套网页
点击网页时，如果点在了iframe上，则是默认操作iframe页面。钓鱼网站就是利用这个，诱导点击，点击了你看到的网页，其实是其他的子页面。
    1. 防止被其他页面iframe
    ```
    if (window != window.top) {
        // 本页面不是顶级容器
        window.top.loaction.href = correctUrl;
    }
    ```

1. X-Frame-Options
    1. 服务端限制网页资源iframe权限
        - DENY：当前页面不能被嵌套iframe里，即便是在相同域名的页面中嵌套也不允许,也不允许网页中有嵌套iframe
        - SAMEORIGIN：iframe页面的地址只能为同源域名下的页面
        - ALLOW-FROM：可以在指定的origin url的iframe中加载
    1. X-Frame-Options其实就是将前端js对iframe的把控交给服务器来进行处理
    ```
    //js
    if(window != window.top){
        window.top.location.href = window.location.href;
    }
    //等价于
    X-Frame-Options: DENY
    //js
    if (top.location.hostname != window.location.hostname) { 
    　　　　top.location.href =window.location.href;
    }
    //等价于
    X-Frame-Options: SAMEORIGIN
    ```

## sandbox
1. sandbox就是给指定iframe设置一个沙盒模型限制iframe更多权限，可以对iframe进行以下限制
    - script脚本不能执行
    - 不能发送ajax请求
    - 不能使用本地存储，即localStorage,cookie等
    - 不能创建新的弹窗和window
    - 不能发送表单
    - 不能加载额外插件比如flash等
1. 对iframe进行配置
    配置项|作用
    -|-
    allow-froms | 允许进行提交表单
    allow-scripts | 运行执行脚本
    allow-same-origin | 允许同域请求，比如ajax，storage
    allow-top-navigation | 允许iframe能够主导window.top进行页面跳转
    allow-popups | 允许iframe中弹出新窗口，比如：window.open，target="_blank"
    allow-pointer-lock | 在iframe中可以锁定鼠标

## iframe跨域
分类|描述
-|-
顶级域名|.com,.net,.cn
主域名|baidu.com
二级域名|www.baidu.com
主域相同而子域不同，可以通过设置document.domain指定主域名来进行通信

## H5的CDM跨域（postmessage）与iframe
postmessage(string, targetOrigin)

```
<iframe src="http://tuhao.com" name="sendMessage"></iframe>
//当前脚本
let ifr = window.frames['sendMessage'];
//使用iframe的window向iframe发送message。
ifr.postmessage('give u a message', "http://tuhao.com");

//tuhao.com的脚本
window.addEventListener('message', receiver, false);
function receiver(e) {
    if (e.origin == 'http://tuhao.com') {
        if (e.data == 'give u a message') {
            e.source.postMessage('received', e.origin);  //向原网页返回信息
        } else {
            alert(e.data);
        }
    }
}
```
