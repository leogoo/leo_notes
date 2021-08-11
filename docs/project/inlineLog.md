> 页面首屏内容（服务端渲染）的曝光打点，时机并不准确，有部分曝光来不及上报，用户就退出页面。现在曝光打点时机是，html下载->js下载以及解析-->react 补水渲染→延迟300ms

### 解决方案
把首屏曝光埋点的脚本直接内联到html, 放在首屏内容<div id="mian" />后面；

### 实现
1. withInlineLogger装饰器
    ```js
    function withInlineLogger(App) {
        function WithInlinerLoggerApp(props) {
            const value = props.store[RequestContextGetterKey]();
            enableInlineLogger({
                req: value.req,
                res: value.res,
                pageOptions: appConfig.options
            });
            return <RequestContext.Provider value={value}>
                        <App {...props} />
                    </RequestContext.Provider>;
        }
    }

    // 设置内联的脚本
    function enableInlineLogger() {
        res.locals.getInlineLoggerScript= () => {
            return `(function(){
                ${inlineScripts.logger};
                trackingRecord({
                    ctx: ${loggerCtxStr},
                    navigationModule: '${navigationModule}',
                    useAMAnalytics: ${useAMAnalytics},
                    trackingItems: ${serialize(res.locals.inlineLoggerTrackingItems || [], { isJSON: true })},
                    trackingItemsParams: ${serialize(trackingItemsParams, { isJSON: true })},
                });
            }());`;
        }
    }
    ```
1. Impr打点组件
    ```js
    function Impr({ inlineLogger, trackingInfo, doImpr = true }) {
        if (!process.env.BROWSER && trackingInfo && inlineLogger && res && res.locals) {
            // 收集需要内联打点的信息
            addTrackingItem({
                res,
                item: { ...trackingInfo,
                    op: 'impr'
                }
            });
        }
        
        // 基本的打点组件
        return <EasyImpr trackingInfo={trackingInfo} doImpr={doImpr && !didInlineLogger} {...others} />;
    }

    // 收集
    function addTrackingItem() {
        if (!res.locals[InlineLoggerTrackingItemsKey]) {
            res.locals[InlineLoggerTrackingItemsKey] = [];
        }

        res.locals[InlineLoggerTrackingItemsKey] = [...res.locals[InlineLoggerTrackingItemsKey], item];
    }
    ```
1. 插入inline脚本到文档中
    ```js
    <div id="main"><% if (content) { %><%-content%><% } %></div>
    <% if (locals.getInlineLoggerScript) { %>
        <script id="inline-tracking-script"><%-locals.getInlineLoggerScript()%></script>
    <% } %>
    ```