### 资源提示与指令
1. preload预加载资源
    1. 最好使用preload来加载最重要的资源，比如图像，CSS，JavaScript和字体文件
    1. 不要与浏览器预加载混淆，浏览器预加载只预先加载在HTML中声明的资源
    1. preload并不会阻塞window的onload事件
    ```js
    <link rel="preload" href="image.png">
    ```
1. prefetch预取资源
> 低优先级的资源提示，允许浏览器在后台（空闲时）获取**将来**可能用得到的资源，并且将他们存储在浏览器的缓存中

三种类型: 
    1. Link Prefetching
    1. DNS Prefetching
    1. Prerendering

1. preconnect
> 允许浏览器在一个HTTP请求正式发给服务器前预先执行一些操作，这包括DNS解析，TLS协商，TCP握手，这消除了往返延迟并为用户节省了时间


1. preload和prefetch区别是,prefetch下载资源后不会解析不会执行，preload会解析资源不会执行
1. webpack按需加载
    ```js
    import(/* webpackChunkName: "test", webpackPrefetch: true */"Dialog")
    ```