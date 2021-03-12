### 实现简易react-redux
Provider用于建立能够被子组件访问的全局属性，重要API是
    - childContextTypes静态属性，用于指定被子组件访问的全局属性类型
    - getChildContext方法，用于指定可以被子组件访问的全局属性
```js
import React from 'react';
import PropTypes from 'prop-types';

export default class Provider extends React.Component {
    // 指定子组件可以访问的属性类型
    static childContextTypes = {
        store: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    // 指定子组件可以访问的属性
    getChildContext() {
        return {
            store: this.props.store
        }
    }

    render() {
        return this.props.children;
    }
}
```
在引用到全局属性的子组件(也就是有connect生成的高阶组件)当中指定contextTypes进行指定的全局属性获取，同时需要在子组件的构造函数中声明context，否则context是一个空对象
```js
static contextTypes = {
    store: PropTypes.object
};
constructor(props, context) {
    super(props, context);
}
```

connect函数其实是一个代理模式的高阶组件，对目标组件进行扩展（注入stateProps和dispatchProps）形成一个新的组件，然后返回这个新的组件
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])参数
    - mapStateToProps: (state, [ownProps]) => stateProps,当 state 变化，或者 ownProps 变化的时候，mapStateToProps 都会被调用，计算出一个新的 stateProps，（在与 ownProps merge 后）更新给组件
    - mapDispatchToProps: (dispatch, [ownProps]) => dispatchProps，也可以是一个dispatchProps对象。若没有这个参数，则将dispatch直接注入组件
    - mergeProps约定属性合并的规则
```js
// mapDispatchToProps的作用是将dispatch注入到方法中，组件内直接调用dispatchProps内的方法即可修改状态
export default connect(
    state => {
        return state.xxx;
    },
    dispatch => ({
        todo: (...args) => dispatch(actionCreator(...args))
    })
)(A)


export const connect = (mapStateToProps = state => state, mapDispatchToProps)
    => (WrapComponent) => {
        class ConnectComponent extends React.Component {
            // 指定要访问的全局属性，若contextTypes没有定义，context将是一个空对象
            static contextTypes = {
                store: PropTypes.object
            };

            constructor(props, context) {
                super(props, context);
                this.state = {
                    allProps: {}
                };
                this.update = this.update.bind(this);
            }

            componentDidMount() {
                const {store} = this.context;
                store.subscribe(this.update);// 订阅store里的状态，发生变化就调用update函数
                this.update();
            }

            componentWillUnmount() {
                const {store} = this.context;
                store.unsubscribe(this.update);
            }

            // 获取mapStateToProps和mapDispatchToProps，放进this.state.props中更新组件
            // mapStateToProps和mapDispatchToProps第二个参数都是组件定义的时候传入的props，将属性merge
            update() {
                const {store} = this.context;
                const stateProps = mapStateToProps(store.getState(), this.props);
                const dispatchProps = mapDispatchToProps(store.dispatch, this.props);
                this.setState({
                    allProps: {
                        ...this.props,
                        ...stateProps,
                        ...dispatchProps
                    }
                });
            }

            render() {
                return(
                    <WrapComponent {...this.state.allProps}></WrapComponent>
                )
            }
        }
        return ConnectComponent;
    }
```



### 新的Context Api
>新的Context Api采用声明式写法，且可以透过shouldComponentUpdate返回false的组件继续向下传播
- React.createContext用于初始化一个Context
- xxxContext.Provider作为顶层组件接受一个名为value的prop，可以接收任意需要被放入Context中的字符串、数字、甚至函数
- xxxContext.Consumer作为目标组件可以出现在组件树的任意位置（Provider之后），接收children prop，这里的children必须是一个函数（context => ()）用来接收顶层传来的Context

### 利用Hooks Api实现
>用Hooks实现Provider和connect，把store绑定到 Provider 上，用connect来获取store里的数据
```js
import React, {createContext, useEffect, useState} from 'react';

const Context = createContext(null);

export const Provider = (props) => {
    // 保存store.subscribe返回的unsubscribe函数
    let unsubscribe = null;
    const {store} = props;
    
    const [storeState, setState] = useState(store.getState());

    useEffect(() => {
        unsubscribe = store.subscribe(() => {
            const newState = store.getState();
            setState(prevState => (prevState === newState ? prevState : newState));
        });

        return () => unsubscribe && unsubscribe();
    }, [props.store])

    return (
        <Context.Provider value={{
            storeState,
            store
        }}
        >
            {props.children}
        </Context.Provider>
    )
}

const empty = () => ({});
export const connect = (
    mapStateToProps = empty,
    mapDispatchToProps = empty
) => BaseComponent => props => (
    <Context.Consumer>
        {({storeState, store}) => (
            <BaseComponent
                {...mapStateToProps(storeState, props)}
                {...mapDispatchToProps(store.dispatch, props)}
            />
        )}
    </Context.Consumer>
)
```