>img是一个特别常见的html标签，正常情况下使用也就是在src里放一个图片地址,然后页面也就会加载图片

### img请求
1. img标签实际是发送一个get请求，而且和script一样是可以跨域的
1. img请求获取到图片的**二进制流**。src内请求不能返回字符串(也就是返回的不是图片地址，这个刚开始不大好理解,src内直接放图片地址也是去请求一个图片类型的资源）
1. 同一个页面内加载同一张图片，只会发送一次请求

### 利用img发前端埋点监控
1. img请求可以应用于只需要向服务器发送数据(日志数据)的场合，且无需服务器有消息体回应，比如收集访问者的统计信息
1. 前端发送1*1的图片，后端不用返回内容，返回响应头表示响应成功就行

### 动态请求后端图片
1. 请求后端图片，也就是img发送后端请求，返回图片流
1. 服务端本地图片
    ```
    // 客户端
    <img src = 'http://hz01-msa-mes26.hz01.baidu.com:8085/getMaodouPicture' />

    // 服务端
    fs.readFile(__dirname+ '/a.png','binary',function(err,  file)  {
        if  (err)  {
            console.log(err);
            return;
        }else{
            console.log("输出文件");
            // 设置响应头
            res.writeHead(200,  {'Content-Type':'image/jpeg'});
            // 输出二进制流
            res.write(file,'binary');
            res.end();
        }
    });
    ```
1. 远程图片
    ```
    // 服务端
    let request = require("request");
    let opts = {
        url: 'http://pa-web-static.cdn.bcebos.com/jinrong-for-landing.jpg',
        encoding: null
    }
    request.get(opts, function(err, response, body) {
        res.writeHead(200,  {'Content-Type':'image/jpeg'});
        res.write(body);
        res.end();
    })
    ```


> html中插入img标签实际上也是创建一个Image对象，而在js中创建一个Image对象则是相当于给浏览器缓存一张图片，需要将图片挂载到dom上

### 图片加载
通过创建Image并挂载到dom上时，并不能获取到img的width和height,这是因为html的加载要早于图片的加载。可利用Image对象的onload事件
```js
var img = document.getElementById('img');
// 创建 Image对象
var imgObj = new Image();
// 为 src 属性赋值
imgObj.src = "img/demo.jpg";
// 将 Image对象插入到 img元素中
img.appendChild(imgObj);
// 当 imgObj 加载完毕后触发事件
imgObj.onload = function () {
    // 控制台打印 Image对象的 宽 和 高
    console.log(imgObj.width + "----" + imgObj.height);
};
```

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

### 懒加载
利用IntersectionObserver

### webp
WebP的优势在于它具有更优的图像数据压缩算法，在拥有肉眼无法识别差异的图像质量前提下，带来更小的图片体积，同时具备了无损和有损的压缩模式、Alpha透明以及动画的特性

##### 判断浏览器是否支持webp
1. canvas的toDataURL方法
```js
    document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') == 0
```
1. 用image对象加载一个webp图片，检查是否会报错
1. 在服务端根据请求header信息判断浏览器是否支持webp，Request Headers里的Accept会有image/webp。检测后写入cookie