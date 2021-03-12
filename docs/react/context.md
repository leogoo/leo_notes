### Context
Context值更新后，顶层组件向目标组件props透传的过程中，如果中间某个组件的shouldComponentUpdate函数返回了false，无法继续触发底层组件的render，新的Context值无法到达目标组件
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

### 新Context
>新的Context Api采用声明式写法，且可以透过shouldComponentUpdate返回false的组件继续向下传播
- React.createContext用于初始化一个Context
- xxxContext.Provider作为顶层组件接受一个名为value的prop，可以接收任意需要被放入Context中的字符串、数字、甚至函数
- xxxContext.Consumer作为目标组件可以出现在组件树的任意位置（Provider之后），接收children prop，这里的children必须是一个函数（context => ()）用来接收顶层传来的Context