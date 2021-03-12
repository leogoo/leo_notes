[recompose的github地址](https://github.com/acdlite/recompose)

- HOC
    - [mapProps：对传入的props进行处理(过滤或添加属性),生成最终的props](./#mapProps)
    - [withProps: 添加属性](./#withProps)
    - [defaultProps:添加默认值](./#defaultProps)
    - [withState:高级组件添加state](./#withState)
    - [withHandlers](./#withHandlers)


1. <span id="mapProps">mapProps</span>
    ```js
    import {creatorFactory} from 'react';
    const mapProps = propsMapper => BaseComponent => {
        const factory = createFactory(BaseComponent);
        const MapProps = props => factory(propsMapper(props));
        return MapProps;
    };

    // 使用
    export default mapProps(
        ownProps => {
            return {
                name: 'tom'
            }
        }
    )(B)
    ```
1. <span id="withProps">withProps</span>
    ```js
    import mapProps from './mapProps';

    const withProps = input => {
        const hoc = mapProps(props => ({
            ...props,
            ...(typeOf input === 'function' ? input(props) : input)
        }));
        
        return hoc;
    };

    // 示例
    export default withProps(
        {
            name: 'tom'
        }
    )(B)
    ```
1. <span id="defaultProps">defaultProps</span>
    ```js
    const defaultProps = defaultPropsObj => BaseComponent => {
        const factory = createFactory(BaseComponent);
        const DefaultProps = ownProps => factory(ownProps);
        DefaultProps.defaultProps = defaultPropsObj;
        return DefaultProps;
    }
    ```
1. <span id="withState">withState</span>
    ```js
    const withState = (
        stateName,
        stateUpdaterName,
        initialState
    ) => BaseComponent => {
        const factory = createFactory(BaseComponent);
        class WithState extends Component {
            state = {
                stateValue:
                    typeof initialState === 'function'
                        ? initialState(this.props)
                        : initialState
            };

            updateStateValue = (updateFn, callback) =>
                this.setState(
                    ({stateValue}) => ({
                        stateValue: typeof updateFn === 'function' ? updateFn(stateValue) : updateFn
                    }),
                    callback
                );

            render() {
                return factory({
                    ...this.props,
                    [stateName]: this.state.stateValue,
                    [stateUpdaterName]: this.updateStateValue
                });
            }
        }
        return WithState;
    }

    // 使用
    class B extends Component {
        render() {
            return (
                <div onClick={e => this.props.setCounter(stateValue => ++stateValue)}>{this.props.counter}</div>
            )
        }
    }
    // 高级组件中添加state作为props传入原组件
    export default withState('counter', 'setCounter', 0)(B)
    ```
1. <span id="withHandlers">withHandlers</span>
    ```js
    import {createFactory, Component} from 'react';
    import mapValues from './utils/mapValues';

    const withHandlers = handlers => BaseComponent => {
        const factory = createFactory(BaseComponent);
        class WithHandlers extends Component {
            handlers = mapValues(
                typeof handlers === 'function' ? handlers(this.props) : handlers,
                createHandler => (...args) => {
                    const handler = createHandler(this.props);
                    return handler(...args);
                }
            ); 

            render() {
                return factory({
                    ...this.props,
                    ...this.handlers
                });
            }
        }
        return WithHandlers
    }

    // 工具方法
    const mapValues = (obj, func) => {
        const result = {};
        for (const key in obj) {
            result[key] = func(obj[key], key);
        }
        return result;
    };

    // 使用
    const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

    class B extends Component {
        render() {
            console.log(this.props);
            return (
                <div onClick={e => this.props.setCounter(stateValue => ++stateValue)}>{this.props.counter}</div>
            )
        }
    }
    export default compose(
        withState('counter', 'setCounter', 0),
        // 注意顺序，withHandler要先执行
        // 先生存WithHandlers高阶组件，作为BaseComponent传入withState，然后注入withState的state作为props
        withHandlers({
            increment: ({ setCounter }) => () => setCounter(n => n + 1),
            decrement: ({ setCounter }) => () =>  setCounter(n => n - 1),
            reset: ({ setCounter }) => () => setCounter(0)
        })
    )(B)
    ```