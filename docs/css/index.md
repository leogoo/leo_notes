1. background-size，设置背景图片的尺寸
    1. length: 直接限制图片的宽高,第一个值设置宽度，第二个值设置高度。只设置一个，第二个则为auto
    1. percent: 以父元素的百分比来设置背景图像的宽度和高度，第一个值设置宽度，第二个值设置高度。如果只设置一个值，则第二个值会被设置为 "auto"
    1. cover: 把背景图像以长的一边扩展至足够大，以使背景图像完全覆盖背景区域。背景图像的某些部分也许无法显示在背景定位区域中
    1. contain：把图像图像扩展至最大尺寸，以使其宽度和高度完全适应内容区域，不覆盖容器
1. object-fill
1. 移动端滑动
    ```css
    .container {
        overflow: hidden;
        ul {
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            // ios设备滑动
            -webkit-overflow-scrolling: touch;
            // 不换行
            white-space: nowrap;
            // 隐藏滚动条，将滚动条推出可视区
            padding-bottom: .2rem;
            li {
                display: inline-block;
            }
        }
    }
    ```
1. 实现移动端0.5px，可以使用transfrom: scaleY(.5);需要注意
    1. transform会影响垂直显示的优先级，类似加了一个position:relative
    2. transform-origin 改变被转换元素的位置
1. 对于inline-block，不能使用margin: 0 auto
1. 利用getBoundingClientRect方法获取元素对应盒子的宽高和位置属性
1. 安卓居中问题，可以设置字体font-family: PingFang SC, miui, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, sans-serif;
1. 安卓机上经常出现头像不够圆的问题，可以针对安卓对图像放大3，4倍