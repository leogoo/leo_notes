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
        1. window.onerror会被覆盖，window.addEventListener('error')绑定多个回调则会一次执行
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