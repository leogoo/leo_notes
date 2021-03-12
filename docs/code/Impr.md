1. 曝光打点组件原理就是利用IntersectionObserver对象监听元素，发送图片请求
1. IntersectionObserver可以用来监听元素是否进入了设备的可视区域之内，而不需要频繁的计算来做这个判断，可用于懒加载。
    1. 回调callback
    1. 配置参数options
        - root：DOM元素，表示监听区域，目标监听的元素要在监听区域内。默认值为null，也就是整个视口区域；如果设置了DOM元素，那么视口就变为该元素
        - rootMargin： 在监听的目标元素与root交叉前提前触发可视性的变化，可以理解为，懒加载的预加载
        - thresholds：当元素的进入可视区域的百分比达到这个参数的设置值得时候，就会触发IntersectionObserver实例中的callback的回调函数
1. 实现
    ```js
    import React, {useRef, useEffect} from 'react';

    var OBSERVER_CONFIGS = {
        rootMargin: '0px',// 监听区域是整个视口
        threshold: [0.75] // change.intersectionRatio为0.75时触发回调,监听的元素可视的比例是75%
    };

    function Impr(props) {
        const imprEl = useRef(null);
        const observerCallBack = entries => entries.forEach(entry => {
            // inIntersection和intersectionRatio >= threshold均可以判断
            if (entry.isIntersecting) {
                // sendLog
                console.log('send log');
                observer.unobserve(imprEl.current);
            }
        });
        const observer = new IntersectionObserver(observerCallBack, OBSERVER_CONFIGS);

        useEffect(() => {
            observer.observe(imprEl.current);
            return () => {
                observer.unobserve(imprEl.current);
            }
        }, []);
        return <div ref={imprEl} >
            {props.children}
        </div>
    }

    export default Impr;
    ```