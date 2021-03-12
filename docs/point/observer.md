> IntersectionObserver 这个API是用来检测元素的相交性，根据相交比例触发回调，一般用来和浏览器视口检测相交性

### 常见用法
1. 图片懒加载：懒加载的原理就是图片没有出现在视口内，给个默认图片，滚动中，图片出现到视口则修改img的src
2. 曝光埋点
3. 无限加载列表的哨兵组件
4. 视频组件的自动播放
4. 可以封装组件来优化dom的渲染，不可见的时候，children隐藏，减少浏览器渲染时间

### 封装组件
```js
import React, { Component, createRef } from 'react';
import autobind from 'autobind-decorator';

export default class Observer extends Component {
    constructor(props) {
        super(props);
        this.observer = null;
        this.rootRef = createRef();
    }

    componentDidMount() {
        if (!this.observer) {
            this.observer = new IntersectionObserver(this.observerCallBack, {
                root: null, // 根元素
                rootMargin: "0px", // 根(root)元素的外边距
                threshold: 0.5, // 可以是数组，每相交一个到一个比例就会触发回调
            });
            this.observer.observe(this.rootRef.current);
        }
    }

    componentWillMount() {
        if (this.rootRef.current) {
            this.observer.unobserve(this.rootRef.current);
        }
    }

    @autobind
    observerCallBack(entries) {
        entries.forEach(item => {
            if (this.isItemIn(item)) {
                this.onEnter(item);
            } else {
                this.onLeave(item);
            }
        });
    }

    isItemIn(opts) {
        // isIntersecting表示target元素是否在给定的阈值范围内可见
        return opts.isIntersecting;
    }

    onEnter(entry) {}

    onLeave(entry) {}

    render() {
        return (
            <div ref={this.rootRef}>
                {this.props.children}
            </div>
        );
    }
}
```