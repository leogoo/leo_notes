>跨域的概念可以说是老生常谈了，但是发现实际用的时候还是不能信手拈来，说到底还是不熟吧

### 跨域
1. 同域的概念：相同域名,端口相同,协议相同
1. 其实跨域是浏览器的限制，当现在浏览器的访问链接和页面访问的接口不在同一个域就会有访问的限制
1. 直接用node访问接口就没有跨域了，但是本地的静态文件访问接口就是跨域

### CORS
1. CORS全称为跨域资源共享”（Cross-origin resource sharing），JSONP只能用GET请求来跨域，而使用了CORS之后，GET和POST都能用，并且还支持其他的HTTP METHOD，并且可以用Access-Control-Allow-Method进行筛选
1. 十分方便，直接在相应路由内设置响应头即可
    ```
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");  
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");  

    // 设置白名单
    res.header("Access-Control-Allow-Origin", '*.baidu.com');
    ```
1. option预检请求

### jsonp
1. 前端,函数定义要在发请求之前
    ```
    <script>
        function test(data) {
            console.log(data);
        }
    </script>
    <script src="http://hz01-msa-mes26.hz01.baidu.com:8085/getMaodouPicture?keyword=买车&callback=test"></script>
    ```
1. 服务端
    ```
    const keyword = req.query.keyword;
    const callback = req.query.callback;
    let back = callback + '(' + JSON.stringify(result) + ')';
    res.end(back);
    ```

### postMessage