### 错误收集
1. try catch, 不能处理语法错误和异步错误
    1. 宏任务的回调函数中的错误无法捕获
        ```js
        // 异步任务
        const task = () => {
            setTimeout(() => {
                throw new Error('async error');
            }, 1000)
        }
        // 主任务
        function main() {
            try {
                task();
            } catch(e) {
                console.log(e, 'err')
                console.log('continue...')
            }
        }
        ```
    1. 微任务的回调
        ```js
        function main() {
            try {
                return Promise.reject(new Error("Oops!"));
            } catch(e) {
                console.log(e, 'eeee');
            }
        }
        ```
    1. await可以捕获错误
        ```js
        async function main() {
            try {
                await Promise.reject(new Error("Oops!"));
            } catch(e) {
                console.log(e, 'eeee');
            }
        }
        ```
1. window.onerror
    1. 需要将 window.onerror 放在所有脚本之前
    1. 网络请求异常不会事件冒泡， 所以不能捕获网络请求异常
    1. 显示返回 true，以保证错误不会向上抛出，控制台也就不会看到一堆错误提示
1. 处理网络加载错误
    1. 设置属性
        ```js
            <script src="***.js"  onerror="errorHandler(this)"></script>
        ```
    1. window.addEventListener('error') 
        1. 不支持冒泡的事件还有：鼠标聚焦 / 失焦（focus / blur）、鼠标移动相关事件（mouseleave / mouseenter）、一些 UI 事件（如 scroll、resize 等）
        1. 区分网络资源加载错误和其他一般错误, 普通错误的error对象中会有一个error.message属性
            ```js
            window.addEventListener('error', error => {
                if (!error.message) {
                    // 网络资源加载错误
                    console.log(error)
                }
            })
            ```
        1. window.onerror会被覆盖，window.addEventListener('error')绑定多个回调则会依次执行
1. React的componentDidCatch、getDerivedStateFromError
     ```js
     class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            // 更新 state 使下一次渲染能够显示降级后的 UI
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            // 将错误日志上报给服务器
            logErrorToMyService(error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
            }

            return this.props.children; 
        }
    }
     ```

### 错误上报
1. 上报时机
    ```js
    window.addEventListener('unload', logData, false)

    const logData = () => {
        navigator.sendBeacon("/log", data)
    }
    ```

### 性能指标
|字段|指标|计算方式|备注|
|----|----|-----|-----|
||首字节| responseStart - navigationStart||
||样式加载开始| resource.styleStart - navigationStart||
||脚本加载开始| resource.scriptStart - navigationStart||
||样式加载结束| resource.styleEnd - navigationStart||
|fpt（First Paint Time）|白屏| responseEnd - navigationStart|从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差|
||首屏(无图)| fsn - navigationStart||
||首屏| fs - navigationStart||
||首次绘制| fpc - navigationStart||
||首次内容绘制| fcp - navigationStart||
||脚本加载结束| scriptEnd - navigationStart||
|ready|HTML 加载完成时间| domContentLoadedEventEnd - navigationStart|domContentLoadedEventEnd可以用DOMContentLoaded时间记录的时间点|
||总加载| ld - navigationStart||
||样式加载耗时| resource.styleEnd - resource.styleStart||
||脚本加载耗时| resource.scriptEnd - resource.scriptStart||
|tti（Time to Interact）|首次可交互时间| domInteractive - navigationStart||
||请求动画帧| fraf - navigationStart||

1. 计算各类资源的加载耗时
    ```js
    const resourceAry = window.performance.getEntriesByType('resource');
    // js资源
    const allScript = slice.apply(document.querySelectorAll('script')).filter(script => script.src);
    const script = resourceAry.filter(item => {
        if (['script', 'link'].includes(item.initiatorType) && item.name.endsWith('.js')) {
            const dom = allScript.find(script => script.src === item.name);
            return dom && !dom.async; // 排除异步script
        }
        return false;
    });
    // css资源
    const style = resourceAry.filter(item => item.initiatorType === 'link' && item.name.endsWith('.css'));

    const calc = (ary, type, key) => {
        return ary.length && ary.reduce((pre, current) => Math[type](pre, current[key]), ary[0][key]) || 0) + navigationStart;
    };
    const calcMin = (ary, key) => calc(ary, 'min', key); // 取相同类型的资源中最小的时间
    const calcMax = (ary, key) => calc(ary, 'max', key); // 取相同类型的资源中最大的时间
    resource = {
        scriptStart: calcMin(script, 'fetchStart'),
        scriptEnd: calcMax(script, 'responseEnd'),
        styleStart: calcMin(style, 'fetchStart'),
        styleEnd: calcMax(style, 'responseEnd')
    };
    ```
1. DOMContentLoaded和load
    - 当DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash
    - 当onload事件触发时，页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了
1. performance.timing
    - domLoading: 开始解析dom树的时间，document.readyState === 'loading'
    - domInteractive:  完成解析dom树，document.readyState === 'interactive'， 还没开始加载资源
    - domContentLoadedEventStart: 开始加载页面内资源，DOMContentLoaded触发前的时间
    - domContentLoadedEventEnd: 资源加载完成的时间，如js脚本加载执行完成
    - domComplete: document.readyState === 'complete'
    - loadEventStart: load事件回调执行前的时间
    - loadEventEnd: load回调执行结束的时间