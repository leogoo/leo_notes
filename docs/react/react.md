### 一、jsx
- Jsx是一种标签语法，比起html更接近js
- jsx中利用{}可以嵌入表达式，jsx表达式本身可看做常规js对象
- 属性使用驼峰命名法className
- Babel将jsx编译为React.createElement()调用
    ```js
    const element = (
        `<h1 className=“greeting”>
            Hello world
        </h1>`
    );

    // 等同于
    const element = React.createElement(
        ‘h1’,
        {className: ‘greeting’},
        ‘Hello world'
    );

    // 实质是
    const element = {
        type: ‘h1’,
        props: {
            className:’greeting’,
            children: ‘hello world’
        }
    );
    ```

### 二、渲染元素
- 与浏览器DOM元素不同，React元素是纯对象
- 利用ReactDOM.render()将react元素渲染到dom节点
- React元素不可变，创建元素后不能更改其子元素或属性。React元素是某个时间点的UI，更新UI的唯一方法就是创建一个新的元素，并传给ReactDOM.render()重新渲染。

### 三、组件化和属性（props)
- 组件就像是js函数，将UI拆分为独立可重用的部分。接受props对象作为参数
- 功能性组件
```js
function Welcome(props) {
    return <h1>hello,{props.name}</h1>
}

const element = <Welcome name='tom' />
```

- react组件就像是一个以props为参数的纯函数，组件不能修改自己的props

### 四、state管理和生命周期钩子
- state类似props，但它是私有的，完全由组件控制
- 内部state是只有类组件可用的功能
```js
class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        
    }
}
```
- componentDidMount：组件安装完毕，第一次渲染组件时调用
- componentWillUnmount：组件将被卸载，即组件从dom中移除
- 正确使用state
    1. 不要直接修改state，使用this.setState({})
    2. state更新可能是异步的，这样批量修改一次render性能更好
    3. 调用this.setState后，将传入的对象合并到当前state
        ```js
        // 不能依赖this.props和this.state的值来计算下一个state
        this.setState({
            counter: this.state.counter + this.props.increment
        });

        // 利用回调函数，第一个参数是之前的state，第二个参数是更新时的props
        this.setState((prevState, props) => ({
            counter: prevState.counter + props.increment
        }));
        ```
- 数据是向下流动
    1. 将state作为props传给子组件
    2. state只会影响组件树『下面』的组件，即只会影响到子组件

### 五、事件处理
- React事件使用驼峰命名
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
- 不能返回fasle来防止React中的默认行为，必须显示调用preventDefault
    ```js
    function clickHandler(e) {
        e.preventDefault();
        console.log(66666);
    }
    ```
- 在constructor函数中bind（this）
- React组件绑定事件本质上是代理到document上的，其实就是一个冒泡机制，子节点传给父节点再传给祖父节点最后在document上执行方法。可以使用e.nativeEvent.stopImmediatePropagation() 阻止事件冒泡
- 在react组件的事件方法中使用setState就要注意是否会覆盖多次

### 六、根据条件选择性渲染元素
- if或条件运算符来创建一个表示当前状态的元素，让react匹配然后更新
- 使用变量存储react元素
- 内联jsx条件
    1. 通过逻辑运算符&&内联if判断。因为在JavaScript中，true && expression总是返回为expression，而false && expression总是返回为false

    ```js
    function Test(props) {
        const name = props.name;
        return (
            <div>
                {
                    name === 'tom' &&
                    (<h1>
                        hello tom!
                    </h1>)
                }
            </div>
        )
    ```
    2. 内联式的if-else：判断 ？真的结果 ：假的结果

### 七、Lists和Keys的处理
- 渲染多个组件
    ```js
    const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map(item => <li>{item}</li>);
    ```
- key仅在循环时的上下文中才有意义。map（）中的元素（组件）都需要属性key，在哪里循环就在哪里设置key
- key在兄弟组件之间必须是唯一的
- 不能读取props.key
- 在jsx中嵌入map

八、表单处理
- 可控组件，数据受state控制，通过处理函数执行setState
- `<input type=’text’>、<textarea>、<select>`接受value属性实现可控组件
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

### 九、提升state

### 十、组合和继承
- children，相当于将子组件传入作为props.children的值
    ```js
    function FancyBorder(props) {
        return (
            <div className={props.color}>
                {props.children}
            </div>
        )
    }

    function WelcomeDialog(props) {
        return (
            <FancyBorder color='blue'>
                <h1>welcome</h1>
                <p>感谢参观鹏寰国际大厦</p>
            </FancyBorder>
        )
    }
    ```
- 将组件对象当做数据传入
    ```js
    function Contacts(props) {
        return ()
    }
    function Chat(props) {
        return ()
    }

    function SplitPanel(props) {
        return (
            <div>
                <div className="SplitPanel-left">
                    {props.left}
                </div>
                <div className="SplitPanel-right">
                    {props.right}
                </div>
            </div>
        )
    }

    <SplitPanel left={<Contacts />} right={<Chat />} />
    ```

### 十一、深入理解jsx
- 首字母大写表示jsx标记指的是React组件
- React必须在作用域中
    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    ```
- jsx点表示符
    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';

    const MyComponents = {
        DatePicker(props) {
            return <div>这里有一个颜色为{props.color}的日期选择器</div>
        }
    };

    function BlueDataPicker(props) {
        return <MyComponents.DatePicker color="blue" />
    }

    ReactDOM.render(
        <BlueDataPicker />,
        document.getElementById('root')
    );
    ```
- 用户自定义组件必须是首字母大写。或者在使用前将组件赋值给一个首字母大写的变量
- 运行时选择组件类型
    ```js
    import React from 'react';
    import {Com1, Com2} from './Components';


    const components = {
        myCom1: Com1,
        myCom2: Com2
    }

    function RunCom(props) {
        // 这是正确的，将它们赋值给一个首字母大写的变量
        const MyCom = components[props.comType];
        return <MyCom type={props.type} />;
    }
    ```
- jsx中的props
    1. 传递js表达式作为props，if语句和for循环不是js表达式，不能在jsx直接使用，可以先使用把结果表达式放jsx中
    2. 字符串直接量，{}中的字符串经过html转义，下面的jsx表达式是等价的
    ```js
    <MyComponent message='&lt;3' />

    <MyComponent message={'<3'} />
    ```
    3. props默认值为true，下面的jsx表达式等价
    ```js
    <MyTextBox autocomplete />

    <MyTextBox autocomplete={true} />
    ```
    4. props传递，使用...
    ```js
    function App() {
        const props = {firstName: 'yatao', lastName: 'zhang'};
        return <Greeting {...props} />;
    }
    ```
- jsx中的子元素和子组件
    1. 在jsx表达式的开始标记和结束标记之间的内容通过props.children传递
    2. 字符串直接量
    ```js
    function MyComponent(props) {
        return <div>{props.children}<div>; //=> <div>hello zhangyatao</div>
    }

    <MyComponent>Hello zhangyatao</MyComponent>
    ```
    3. 子元素
    4. 将js表达式放在{}中作为字组件传递
    5. 函数
    6. 布尔值、null、undefined在渲染时会被自动忽略
        1. 0会渲染
        2. 想要显示true，false，null，undefined则要转为字符串
        ```js
        function MyVariable(props) {
            const myVariable = false;
            // 如果这里不把false转换为字符串，这只会输出『我的javascript变量是』
            const convertedVar = String(myVariable);
            return (
                <div>
                    我的javascript变量是{convertedVar}
                </div>
            );
        }
        ```



### 十二、使用PropTypes进行类型检测
- 指定只有一个子元素作为内容传递`React.PropTypes.element.isRequired`
- 使用defaultProps设置Props默认值
    ```js
    App.propTypes = {
        name: React.PropTypes.string.required
    };
    App.defaultProps = {
        name: 'tom'
    };
    ```

### 十三、refs和DOM元素
- 典型的react数据流父组件和子组件交互的唯一方式是props
- 有时候需要强制修改子组件，修改React组件实例或者是DOM元素
- 设置ref属性
    ```javascript
    class Helllo extends React.Component {
        constructor(...args) {
            super(...args);
        }
        componentDidMount() {
            var component = this.refs.hello
            // ...
        }
        render() {
            return (
                <div ref='hello'>
                    hello world
                </div>
            )
        }
    }
    ```
- 设置ref回调函数，在组件被挂载或卸载后立即执行。可以在回调中判断组件的初始化和卸载
    ```js
    class Helllo extends React.Component {
        constructor(...args) {
            super(...args);
        }
        componentDidMount() {
            var component = this.hello
            // ...
        }
        render() {
            return (
                <div ref={c => {
                    this.hello = c;
                }}>
                    hello world
                </div>
            )
        }
    }
    ```

### 十四、不可控组件
- 可控组件中，表单数据由React组件处理。不可控组件中，表单数据由DOM本身处理。
- 不可控组件，直接使用ref从DOM获取表单值
- 不可控组件，使用`defaultValue、defaultChecked`属性指定初始值
- 可控组件中，使用value属性覆盖DOM值

### 十五、性能优化
- 使用生产环境的配置进行构建
- 使用shouldComponentUpdate跳过组件更新，避免重复处理DOM
- 使用不突变的数据结构，object.assign、扩展符...返回新的对象
    ```js
    click() {
        this.setState(prevState => ({
            words: [...prevState.words, 'zhangyatao']
        }));
    }
    ```

### 十六、不使用es6，使用React.createClass
- 优先使用es6的写法
- propTypes，defaultProps
    ```js
    // es6的方式
    class Greeting extends React.Component {
        // 内部逻辑
    }
    Greeting.propTypes = {
        name: React.PropTypes.string.isRequired
    }
    Greeting.defaultProps = {
        name: 'zhangyatao'
    }

    // es5
    var Greeting = React.createClass({
        propTypes: {
            name: React.PropTypes.string.isRequired
        }
        // 对象方法
        getDefaultProps: function() {
            return {name: 'zhangyatao'}
        }
        // 内部逻辑
    });
    ```
- 设置state
    ```js
    // es6
    class Greeting extends React.Component {
        constructor(props) {
            super(props);
            this.state = {name: 'zhangyatao'};
        }
        // 业务逻辑
    }

    // es5
    var Greeting = React.createClass({
        // 对象方法
        getInitialState: function() {
            return {name: 'zhangyatao'};
        }
        // 内部逻辑
    })
    ```
- 自动绑定this
- es6不支持mixins，React.createClass可以

### 十七、不使用jsx边写react应用
- 使用React.createElement(component, props, …children)语法糖

### 十八、Diffing算法
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

### 十九、上下文context

### 二十、React.Component
- 组件声明周期
    1. Mounting（加载组件）
        1. constructor（props）
            1. super（props）
            2. 如果不初始化state，不绑定内部方法的this，则不用实现构造函数
            3. 最好不要将props复制到state内即state的值与props无关，最好是将state提升
            4. 或者是在componentWillReceiveProps（nextProps）保持state最新
        2. componentWillMount
            1. 装载前被调用，在render之前调用
            2. 可以这是state，不会造成重新渲染
            3. 一般建议使用constrcutor（）
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
- 其他API
    1. setState
    ```
    this.setState((prevState, props) => {
        return {myInteger: prevState.myInteger + props.step};
    })
    ```
    2. forceUpdate
    3. 组件属性
        1. defaultProps：组件本身的属性
        2. displayName
        3. propTypes
    4. 实例内部属性
        1. props
        2. state：不要直接改变this.state，调用this.setState

### 二十一、ReactDOM
- render
- unmountComponentAtNode()，卸载已安装的组件`
ReactDOM.unmountComponentAtNode(container)`
- findDOMNode()：对于已经装载到DOM里的组件，返回dom元素
- 使用refs处理dom，避免使用findDOMNode

### 二十二、DOM element
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

### 二十三、Context
- 不需要像props一样将属性一层层传给子组件，使用context可以直接在组件树传递属性
- 使用
    ```js
    // 父组件
    class Container extends React.Component {
        getChildContext() {
            return {
                color: ‘red’
            }
        }
        Container.childContextTypes = {
            color: React.PropTypes.string
        };
    }


    // 子组件
    class Button extends Container {
        render() {
            return (
            <button style={{background: this.context.color}}>
                {this.props.children}
            </button>
            );
        }
    }
    // 重点
    Button.contextTypes = {
        color: React.PropTypes.string
    };
    ```
