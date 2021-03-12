>前端路由是由现代SPA应用必备的功能，每个现代前端框架都有对应的实现，例如vue-router, react-router。不管是哪种路由，无外乎用兼容性更好的hash或者是H5 History实现

### hash路由
hash路由一个明显的标志是带有#,我们主要是通过监听url中的hash变化来进行路由跳转，例如`10.10.88.172/#/weather_search`。hash的优势就是兼容性更好,在老版IE中都可以运行,问题在于url中一直存在#不够美观,而且hash路由更像是Hack而非标准
1. 初始化class
    ```js
    class Routes {
        constructor() {
            // 存储路由
            this.routes = {};
            // 当前路由的hash值
            this.currentUrl = '';
        }
    }
    ```
1. 实现路由hash存储于执行
    ```js
    class Routes {
        constructor() {
            this.routes = {};
            this.currentUrl = '';
        }
        // 注册路由
        route(path, callback) {
            this.routes[path] = callback || () => ();
        }
        // 刷新
        refesh() {
            this.currentUrl = location.hash.slice(1) || '/';
            this.routes[this.currentUrl]();
        }
    }
    ```
1. 监听对应事件
    ```js
    class Routes {
        constructor() {
            this.routes = {};
            this.currentUrl = '';
            this.refresh = this.refresh.bind(this);
            window.addEventListener('load', this.refresh, false);
            window.addEventListener('hashchange', this.refresh, false);
        }
        route(path, callback) {
            this.routes[path] = callback || () => ();
        }
        // 刷新
        refesh() {
            this.currentUrl = location.hash.slice(1) || '/';
            this.routes[this.currentUrl]();
        }
    }
    ```
1. 回退功能
创建一个数组history来储存过往的hash路由,并且创建一个指针currentIndex来随着后退和前进功能移动来指向不同的hash路由

### HTML5路由新方案
1. History API
常用API
    - window.history.back()
    - window.history.forward()
    - window.history.go(-3)
    - window.history.pushState(state, title, url): 用于在浏览历史中添加历史记录,但是并不触发跳转
        - state:一个与指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数。如果不需要这个对象，此处可以填null
        - title:新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null。
        - url:新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址
    - window.history.replaceState方法的参数与pushState方法类似，区别是它修改浏览历史中当前纪录,而非添加记录,同样不触发跳转
popstate事件：每当**同一个文档**的浏览历史（即history对象）出现变化时，就会触发popstate事件
    - 仅仅调用pushState或replaceState方法，并不会触发该事件
    - 只有用户点击浏览器倒退或前进按钮
    - 或者使用js调用back、forward、go方法才会触发
1. 路由实现
    ```js
    class Routes {
        constructor() {
            this.routes = {};
            this._bindPopState();
        }
        init(path) {
            history.replaceState({path:path}, , null, path);
            this.routes[path] && this.routes[path]();
        }
        route(path, callback) {
            this.routes[path] = callback || () => ();
        }

        go(path) {
            history.pushState({path: path}, null, path);
            this.routes[path] && this.routes[path]();
        }
        // 监听popstate事件
        _bindPopState() {
            window.addEventListener('popstate', e => {
                const path = e.state && e.state.path;
                this.routes[path] && this.routes[path]();
            });
        }
    }
    ```