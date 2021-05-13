### 图片预加载
> 图片预加载就是利用Image对象来缓存一个图片，待图片加载完了在挂载到dom。有一些弹窗组件的背景也很有必要去预加载

```js
// retry重试次数
const loadImage = (url, retry, errorUrls, originResolve) => {
    if (url) {
        return new Promise((resolve) => {
            if (retry) {
                // eslint-disable-next-line no-param-reassign
                originResolve = originResolve || resolve;
                const img = new Image();
                img.onload = originResolve;
                img.onerror = () => {
                    loadImage(url, retry - 1, errorUrls, originResolve);
                };
                img.src = url;
            } else {
                errorUrls.push(url);
                originResolve();
            }
        });
    }
};

const preloadImages = urls => {
    const errorUrls = [];
    return Promise.all(urls.map(url => loadImage(url, RETRY_LIMIT, errorUrls, null)))
}
```

### 首屏图片渲染优化
图片预加载一般针对是非首屏的图片，ios内核中，一些首屏图片是在js解析执行之后才渲染，这样用户体验非常差
解决方案：首屏渲染慢的图片，利用link preload提前加载
```js
export class PreloadAssetsController {
    hit = false; // 是否生效

    isRequestHit: (req: Request) => boolean;

    images = {}; // key: image url; value: image params

    addImage(url: string, params: IAnyObject) {
        this.images[url] = params || {};
    }

    getImages({ req }: { req: Request }) {
        const webpEnable = getWebpEnable(req);
        return Object.entries(this.images).map(([url, params]: [string, IAnyObject]) => {
            return generateCDNImageUrl(url, { ...DEFAULT_PARAM, ...params, webpEnable });
        });
    }
}

export function setPreloadAssetsController(key: string, c: PreloadAssetsController) {
    controllers[key] = c;
}

export function getPreloadAssetsController(key: string, req: Request): PreloadAssetsController {
    const c = controllers[key];
    if (c) {
        if (!c.isRequestHit || c.isRequestHit(req)) {
            return c;
        }
    }
    return new PreloadAssetsController();
}
```
生成html
```js
const renderTop = (req, res) => {
    res.locals.extractor = extractor;
    // const serverTemplateName = appConfig.serverTemplateName;
    res.set({
        'X-Accel-Buffering': 'no',
        'Content-Type': 'text/html; charset=UTF-8'
    });

    const scriptArray = extractor.getMainAssets('script');
    const style = extractor.getMainAssets('style');
    const ua = req.headers['user-agent'];
    const platform = getPlatform(ua);
    res.locals.isNativePlatform = platform.isNativePlatform;
    scriptArray.forEach(script => {
        pushedScript.add(script.filename);
        pushedAssets.push(script);
    });
    const locals = res.locals;
    const head = ReactDOMServer.renderToString(
        <Head
            locals={res.locals}
            script={pushedAssets.map((script, i) => {
                if (locals.bigBipeScriptLoadType === ScriptLoadType.Defer) {
                    return <script key={i} src={script.url} crossOrigin="anonymous" defer />;
                }
                return <link rel="preload" key={i} href={script.url} crossOrigin="anonymous" as="script" />;
            })}
            style={style.map((style, i) => {
                if (res.locals.enableBigPipeInlineStyle && cssFilesMap[style.filename]) {
                    return <style dangerouslySetInnerHTML={{ __html: cssFilesMap[style.filename] }} />;
                }
                return <link key={i} rel="stylesheet" href={style.url} />;
            })}
        />
    );

    const preloadAssetsController = getPreloadAssetsController(entrypoint, req);
    const images = preloadAssetsController.getImages({ req });
    const preloadImagesScript = images.reduce((acc, imgUrl) => {
        return acc + `<link rel="preload" href="${imgUrl}" as="image">`;
    }, '');
    res.locals.preloadAssetsController = new PreloadAssetsController();

    res.write(`<!DOCTYPE html><html lang="zh-cmn-Hans"><head>${head}${preloadImagesScript}`);
};
```

脚本加载下一个动画帧加载
```js
function loadScript(sources) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < sources.length; i++) {
        const s = document.createElement('script');
        s.src = sources[i];
        s.crossOrigin = 'anonymous';
        fragment.appendChild(s);
    }
    document.body.appendChild(fragment);
}

function scriptDelayLoad(sources) {
    const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || setTimeout;
    raf(() => {
        loadScript(sources);
    });
}
```