### 定义
> 虚拟列表解决的是长列表渲染的性能问题，思路也比较简单就是不在视口内则不渲染列表中的Item

### 问题
监听每一个元素也会有性能问题，有些手机上可能会掉帧

### 解决方案
改进点是用Map来分组。毕竟在c端场景都是相同高度的商品卡片
```js
export class ObserverManager {
    io: IntersectionObserver;
    rootMargin = '600px 300px';
    map = new Map();

    onCallBack = (entrys) => {
        entrys.forEach((entry) => {
            this.map.get(entry.target)?.(entry);
        });
    }

    register(el, onIntersecting) {
        if (!this.io) {
            this.io = new IntersectionObserver(this.onCallBack, {
                rootMargin: this.rootMargin,
            });
        }

        this.map.set(el, onIntersecting);
        this.io.observe(el);
        return () => {
            this.map.delete(el);
            this.io.unobserve(el);
        };
    }
}

const observerMananer = new ObserverManager();

export const ObserverManagerContext = React.createContext(observerMananer);

/**
 * `RenderObserver`, 该组件主要是为了减少浏览器dom数，优化浏览器渲染时间
 */
export function RenderObserver({ className, children }) {
    useStyles(styles);

    const rootRef = useRef<HTMLDivElement>(null);
    const heightRef = useRef<number>();
    const observerMananer = useContext(ObserverManagerContext);

    // 容器是否可见
    const [isIntersecting, setIsIntersecting] = useState(true);
    const isIntersectingRef = useRef(isIntersecting);
    isIntersectingRef.current = isIntersecting;

    // 是否可见的回调
    const onIntersecting = useCallback((entry) => {
        if (isIntersectingRef.current === entry.isIntersecting) {
            return;
        }
        if (!entry.isIntersecting) {
            heightRef.current = entry.boundingClientRect.height;
        }
        setIsIntersecting(entry.isIntersecting);
    }, []);

    useEffect(() => {
        if (rootRef.current) {
            return observerMananer.register(rootRef.current, onIntersecting);
        }
        return;
    }, [onIntersecting, observerMananer]);

    return (
        <div
            ref={rootRef}
            // 站位高度
            style={{ height: !isIntersecting ? heightRef.current : undefined }}
            // 不可见的时候，children隐藏，减少浏览器渲染时间
            className={cx({ [styles.childHide]: !isIntersecting }, className)}
        >
            {!isIntersecting ? null : children}
        </div>
    );
}
```