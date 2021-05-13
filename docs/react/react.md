### 事件处理
- jsx传递一个函数作为事件处理程序而不是字符串
    ```html
    // html
    <button onclick="clickHandler()">
        click
    </button>

    // React
    <Button onClick={clickHandler}>
        click
    </Button>
    ```
- 不能返回false来防止React中的默认行为，必须显示调用preventDefault
    ```js
    function clickHandler(e) {
        e.preventDefault();
        console.log(66666);
    }
    ```
- 在constructor函数中bind（this）
- React组件绑定事件本质上是代理到document上的，其实就是一个冒泡机制，子节点传给父节点再传给祖父节点最后在document上执行方法。可以使用e.nativeEvent.stopImmediatePropagation() 阻止事件冒泡
- 在react组件的事件方法中使用setState就要注意是否会覆盖多次

### 受控组件
- `<input type=’text’>、<textarea>、<select>`接受value属性实现受控组件
    ```js
    class FlavorForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {value: 'coconut'};
            this.change = this.change.bind(this);
            this.submit = this.submit.bind(this);
        }

        change(e) {
            this.setState({value: e.target.value});
        }

        submit(e) {
            e.preventDefault();
            console.log('你喜欢的是：', this.state.value);
        }

        render() {
            return (
                <form onSubmit={this.submit}>
                    <label>
                        请选择一个你喜欢的水果
                        <select value={this.state.value} onChange={this.change}>
                            <option value="fruit">fruit</option>
                            <option value="lime">lime</option>
                            <option value="coconut">coconut</option>
                            <option value="mango">mango</option>
                        </select>
                    </label>
                    <input type="submit" value="submit"/>
                </form>
            );
        }
    }
    ReactDOM.render(
        <FlavorForm/>,
        document.getElementById('root')
    );
    ```

### Diffing算法
- 不同类型的DOM元素（例如将div变成p）
    1. 将删除旧的dom树从头开始重新构建新的dom树
    2. 删除旧dom，组件实例触发componentWillUnmount()，新dom插入时，组件实例触发componentWillMount、componentDidMount
    3. 之前旧dom的任何state将丢失
- 相同的dom元素，更新被更改的属性
- 相同类型的组件元素
    1. 组件更新时，实例保持不变，不同渲染之间组件的state也保持不变
    2. 更新低层组件实例的props来匹配元素，低层实例上调用componentWillReceiveProps和componentWillUpdate
    3. 接下来调用render（），递归比较
    4. keys，react是使用key将原始树中的子元素和更新后的树中的子元素进行匹配

### 声明周期
1. Mounting（加载组件）
    1. constructor（props）
        1. super（props）
        2. 如果不初始化state，不绑定内部方法的this，则不用实现构造函数
        3. 最好不要将props复制到state内即state的值与props无关，最好是将state提升
        4. 或者是在componentWillReceiveProps（nextProps）保持state最新
    2. componentWillMount
        1. 装载前被调用，在render之前调用
        2. 可以这是state，不会造成重新渲染
        3. 一般建议使用constructor
    3. render
        1. 检测this.props，this.state返回一个react元素
        2. 纯函数，不会修改组件state
        3. 不直接与浏览器交互，可以使用生命周期函数与浏览器交互
    4. componentDidMount
        1. 组件装载到dom后立即调用
        2. 执行dom节点初始化
        3. 处理网络请求
        4. 设置state会重新渲染dom
2. Updating(更新状态）
    1. componentWillReceiveProps（nextProps）
        1. 安装好的组件接受新的props之前被调用
        2. 可以比较this.props与nextProps，使用this.setState替换并重置state
        3. Props没有改变也可能调用这个方法，父组件引起的组件重新选渲染
        4. 只调用this.setState并不会调用componentWillReceiveProps
    2. shouldComponentUpdate（nextProps，nextState）
        1. 表示组件是否受当前props和state影响
        2. 接收到新的props或state，在渲染之前调用。
        3. 默认为true，表示每次state更改都会重新渲染
        4. 返回false则跳过本次渲染，不会调用componentWillUpdate、render、componentDidUpdate
    3. componentWillUpdate（nextProps，nextState）
        1. 组件接受新的props或state，在组件重新渲染之前立即调用
        2. 执行this.setState不会调用
        3. 可以执行dom操作，处理网络请求
    4. render
    5. componentDidUpdate
        1. 重新渲染dom之后调用，第一次渲染不会调用
3. Unmounting(卸载组件）
    1. componentWillUnmount
        1. 在组件被卸载和销毁之前立即调用
        2. 执行任何有必要的清理工作，例如：清理计时器、取消网络请求、清理在componentDidMount中创建的dom元素

### 其他API
1. setState
2. forceUpdate
3. 组件属性
    1. defaultProps：组件本身的属性
    2. displayName
    3. propTypes
4. 实例内部属性
    1. props
    2. state：不要直接改变this.state，调用this.setState
1. React.Children
> JavaScript中的map不会对为null或者undefined的数据进行处理，而React.Children.map中的map可以处理React.Children为null或者undefined,忽略函数。对父组件的所有子组件又更灵活的控制
- React.Children.map, React.Children.forEach
- React.Children.toArray
- React.Children.count, 忽略函数

```js
    export default function App() {
        return (
            <Parent>
                {"bananas"}
                {null}
                {undefined}
                {() => <div>11111</div>}
                <Child />
            </Parent>
        );
    }

    function Child(props) {
        const { name } = props;
        return <div>{name}</div>;
    }

    function Parent(props) {
        console.log(React.Children.count(props.children)); // 4
        return (
            <div>
                {React.Children.map(props.children, (elem, i) => {
                    console.log(i); // 0, 1, 2, 3
                    if (elem?.type === Child) {
                    return React.cloneElement(elem, {
                        name: "test"
                    });
                    }
                    return elem;
                })}
            </div>
        );
    }
```

### DOM element
- React实现一个独立于浏览器的DOM系统
- 所有DOM properties和attributes（包括event handle）都是用驼峰命名法，aria-*，data-*属性是全部小写
- Attributes的区别
    1. checked，defaultChecked
    2. className
    3. dangerouslySetInnerHTML：替换浏览器dom中的innerHTML
        ```js
        function createMarkup() {
            return {__html: 'First <<>> Second'};
        }
        function MyComponent() {
            return <div dangerouslySetInnerHTML={createMarkup()} />;
        }
        ReactDOM.render(
            <MyComponent />,
            document.getElementById('root')
        );
        ```
    4. htmlFor：js中的for
    5. onChanged：onChange事件行为与期望一致
    6. selected：<option>中使用表示选择组件
    7. style：接受js对象而不是字符串
    8. value

### 安全问题
1. react会默认转义（escape）jsx中的文本，防止xss攻击。如果想要渲染出html则需要使用dangerouslySetInnerHTML
    ```js
    <p>
        {message.text}
    </p>

    <div dangerouslySetInnerHTML={__html: message.text} />
    ```
1. 如果服务端有漏洞，数据库存入恶意代码，应该是文本返回的是json（一个虚拟dom的对象），而前端直接插入到jsx中
    ```js
    let expectedTextButGotJSON = {
        type: 'div',
        props: {
            dangerouslySetInnerHTML: {
            __html: '/* put your exploit here */'
            },
        },
    };
    let serverData = { text: expectedTextButGotJSON };

    // Dangerous in React 0.13
    render() {
        <p>
            {serverData.text}
        </p>
    }
    ```
    解决方案是createElement生成的虚拟dom对象加一个$$typeof属性, 值为Symbol.for('react.element')，数据库是没法存Symbol的。渲染组件时检查$$typeof属性