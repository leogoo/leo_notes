1. react元素中插入html `dangerouslySetInnerHTML={{ __html: content }}`
1. mobx使用observer可以使得组件监听状态的变化
    1. observer监听的是属性的变化
    1. 有时候子组件不使用observer，直接将状态传给子组件也可以。需要注意的在子组件依赖的某个属性在父组件中是否更新了，否则父组件监听不到变化那么就不会传最新的状态值给子组件
1. React.createContext更方便的使用context
    1. consumer组件从组件树上层最接近的匹配的Provider读取context
    1. 没有匹配的Provider则使用创建context时的默认值
    1. 一个Provider可以对应多个consumer
    ```js
    // 创建一个 theme Context,  默认 theme 的值为 light
    const ThemeContext = React.createContext('light');

    function ThemedButton(props) {
        // ThemedButton 组件从 context 接收 theme
        return (
            <ThemeContext.Consumer>
                {theme => <Button {...props} theme={theme} />}
            </ThemeContext.Consumer>
        );
    }

    // 中间组件
    function Toolbar(props) {
        return (
            <div>
                <ThemedButton />
            </div>
        );
    }

    class App extends React.Component {
        render() {
            return (
                <ThemeContext.Provider value="dark">
                    <Toolbar />
                </ThemeContext.Provider>
            );
        }
    }
    ```
1. ref用在react组件上得到的是一个ReactElement对象，在原生组件上则是dom。获取ref是方式有很多
    1. 字符串
    1. 回调, `ref = {(input) => {this.textInput = input}}`
    1. createRef
        ```js
        class A extends React.Component {
            constructor() {
                this.inputRef = React.createRef();
            }
            render() {
                return {
                    <Input ref={this.inputRef} />
                }
            }
        }
        ```
1. 利用React.forwardRef将ref传给子组件，用于访问子组件中的DOM元素
    ```js
    const Child = React.forwardRef((props, ref) => (
        <input ref={ref} />
    ));
    class Parent extends React.Component {
        constructor() {
            this.inputRef = React.createRef();
        }
        componentDidMount() {
            console.log(this.inputRef.current);
        }
        render() {
            return (
                <Child ref={this.inputRef} />
            );
        }
    }
    ```
1. redux中触发action的方式有
    1. dispatch(action)
    1. dispatch(actioncreator()),bindActionCreators(actionCreators, dispatch)的作用就是dispatch原actioncreator返回的结果的函数
        ```
        // 关键代码
        function bindActionCreator(actionCreator, dispatch) {
            return (...args) => dispatch(actionCreator(...args));
        }
        ```
    1. 利用redux-thunk中间件执行异步action
        ```
        // redux-thunk就是将dispatch塞入actioncreator
        function createThunkMiddleware(extraArgument) {
            return ({ dispatch, getState }) => next => action => {
                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }

                return next(action);
            };
        }

        const thunk = createThunkMiddleware();


        // actioncreator
        const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

        function increment() {
            return {
                type: INCREMENT_COUNTER
            };
        }

        function incrementAsync() {
            return dispatch => {
                setTimeout(() => {
                    // Yay! Can invoke sync or async actions with `dispatch`
                    dispatch(increment());
                }, 1000);
            };
        }
        ```
1. setState的异步性
    - 指在setState之后使用this.state可能读取的仍然是未更新的state,使用匿名函数
        ```
        this.setState((preState, props) => ({
            counter: preState.quantity + 1; 
        }))
        ```
    - 多次使用setState并没有关系,会合并
        ```
        state = {
            a: 1，
            b: 2,
            c: 3
        }
        this.setState({a:4})
        this.setState({b:5})
        this.setState({c:6})
        // 相当于下面这样的结果
        this.setState({a:4, b:5, c:6})
        ```
