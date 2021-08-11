>服务端渲染时间主要消耗在数据请求和首屏渲染，而一些无关的html片段可以提前返回给客户端,可以提前加载资源。优化首字节时间，整体加载，以及首屏等

1. 开启流式
    - 开启流式渲染，首先在response的头部需要加一个X-Accel-Buffering字段
    - 响应的头部这个X-Accel-Buffering比Nginx的优先级高
    ```js
    const renderTop = (req, res) => {
        res.set({
            'X-Accel-Buffering': 'no', // 不开启缓冲，流式
            'Content-Type': 'text/html; charset=UTF-8',
        });
        const head = getHeadHtml(req, res);
        res.write(`<!DOCTYPE html><html lang="zh-cmn-Hans"><head>${head}`);
        serverPerfLogger.logTopChunkRender();
    };

    const renderContent = async ({ req, res, html = '', stores = null, jsxStyle = '', isoStyle = '', error = null }) => {
        const {
            body, firstPaint, scriptStr,
            cssStr, inlineScriptStr,
        } = getBodyHtml({ req, res, html, error });
        res.write(`${isoStyle}${inlineCssEndStr}${paintTimeStr}${scriptStr}${jsxStyle}${firstPaint}</head><body>${body}`);
        // 这里await所有的数据
        await Promise.all(storesArr.map((store) => {
            if (!store.chunkStore) {
                return;
            }
            return chunkStores.reduce((acc, chunkStore) => acc
                .then(() => chunkStore.loadChunk()) // load data
                .then(() => renderChunkHtml({ res, chunkStore, stores, store, App, req })) // render html
            Promise.resolve());
            );
        };

        const rawData = stores ? serialize(stores, { isJSON: true }) : 'null';
        const scripts = ReactDOMServer.renderToString(
            <Scripts locals={locals} rawData={rawData} />,
        );
        res.end(`${scripts}${inlineScriptStr}${cssStr}</body></html>`);
    }
    ```
1. 分块，在服务端慢接口数据回来前用一个占位模板生成html，等所有数据都回来了，用inline脚本把模块的html片段替换占位
    ```js
    function renderChunkHtml({ res, chunkStore, stores, store, App, req }) {
        if (chunkStore && chunkStore.Component) {
            const css = new Set(); // CSS for all rendered React components
            // eslint-disable-next-line no-underscore-dangle
            const insertCss = (...styles) => styles.forEach((style) => css.add(style._getCss()));
            const ChunkProvider = App.appConfig.ChunkProvider || React.Fragment;
            const html = ReactDOMServer.renderToString(
                <StyleContext.Provider value={{ insertCss }}>
                    <Provider {...stores}>
                        <ChunkProvider store={store}>
                            <chunkStore.Component store={store} {...chunkStore.ComponentProps} />
                        </ChunkProvider>
                    </Provider>
                </StyleContext.Provider>,
            );

            const isoStyle = `<style>${[...css].join('')}</style>`;

            const applyStyle = `document.head.insertAdjacentHTML("beforeend", ${serialize(isoStyle, { isJSON: false })});`;
            const applyHtml = `(function (){var root=document.querySelector('${chunkStore.root}');if(root){ root.innerHTML = ${serialize(html, { isJSON: false })};}})();`;
            res.write(`<script id="chunk_render">${applyStyle}${applyHtml}</script>`);
        }
    }
    ```