引入react-router-dom,比react-router多出了<Link>, <BrowserRouter>这些DOM组件

1. Router
    1. v4对Router进行封装，产出了几个高级路由组件
        - BrowserRouter:利用h5提供的history API
        - HashRouter:使用window.location.hash
        - MemoryRouter:利用内存保存
        - NativeRouter
        - StaticRouter
    1. Router组件
        ```js
        import RouterContext from './RouterContext';

        class Router extends React.Component {
            static computeRootMatch(pathname) {
                return {path: '/', url: '/', params: {}, isExact: pathname === '/'};
            }

            contructor(props) {
                super(props);
                this.state = {
                    location: props.history.location
                };

                this._isMounted = false;
                this._pendingLocation = null;

                if (!props.staticContext) {
                    this.unlisten = props.history(location => {
                        if (this._isMounted) {
                            this.setState({location});
                        }
                        else {
                            this._pendingLocation = location;
                        }
                    });
                }
            }

            componentDidMount() {
                this._isMount = true;

                if (this._pendingLocation) {
                    this.setState({location: this._pengingLocation});
                }
            }

            componentWillUnMount() {
                if (this.unlisten) {
                    this.unlisten();
                }
            }

            render() {
                return (
                    <RouterContext.Provider
                        children={this.props.children || null}
                        value={{
                            history: this.props.history,
                            location: this.state.location,
                            match: Router.computeRootMatch(this.state.location.pathname),
                            staticContext: this.props.staticContext
                        }}
                    />
                );
            }
        }

        Router.propTypes = {
            children: PropTypes.node,
            history: PropTypes.object.isRequired,
            staticContext: PropTypes.object
        };
        ```
    1. RouterContext.js
    ```js
    import createContext from '';

    const createNamedContext = name => {
        const context = createContext();
        context.Provider.displayName = ``;
        context.Consumer.displayName = ``;
        return context;
    }
    const context = createNamedContext('Router');
    export default context;
    ```

1. BrowserRouter
    ```js
    import {Router} from 'react-router';
    import {createBrowserHistory as createHistory} from 'history';

    class BrowserRouter extends React.Component {
        history = createHistory(this.props);

        render() {
            return <Router history={this.history} children={this.props.children} />
        }
    }
    ```
1. Route：捕获路径的变化，渲染对应的组件
    ```js
    import RouterContext from "./RouterContext";

    class Route extends React.Component {
        render() {
            return (
                <RouterContext.Consumer>
                    {
                        context => {
                            const location = this.props.location || context.location;
                            const match = this.props.computeMatch
                                ? this.props.computedMatch
                                : this.props.path
                                    ? matchPath(location.pathname, this.props)
                                    : context.match;
                            const props = {...context, location, match};
                            let {children, component, render} = this.props;

                            if (typeof children === "function") {
                                children = children(props);
                            }
                            return (
                                <RouterContext.Provider value={props}>
                                    {
                                        children && !isEmptyChildren(children)
                                            ? children
                                            : props.match
                                                ? component
                                                    ? React.createElement(component, props)
                                                    : render
                                                        ? render(props)
                                                        : null
                                                : null
                                    }
                                </RouterContext.Provider>
                            )
                        }
                    }
                </RouterContext.Consumer>
            )
        }
    }
    ```
1. Link:控制路径的变化
    ```js
    import {createLocation} from 'history';

    function isModifiedEvent(event) {
        return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }

    class Link extends React.Component {
        handleClick(event, history) {
            if (this.props.onClick) {
                this.props.onClick(event);
            }
            if (
                !event.defaultPrevent &&
                evnet.button === 0 &&
                (!this.props.target || this.props.target === "_self") &&
                !isModifiedEvent(event)
            ) {
                event.preventDefault();
                const method = this.props.replace ? history.replace : history.push;
                method(this.props.to);
            }
        }

        render() {
            const {innerRef, replace, to, ...rest} = this.props;
            return (
                <RouterContext.Consumer>
                    {context => {
                        const locaction = typeof to === "string"
                            ? createLocation(to, null, null, context.location)
                            : to;
                        const href = location ? context.history.createHref(location) : "";

                        return (
                            <a
                                {...rest}
                                onClick={event => this.handleClick(event, context.history)}
                                href={href}
                                ref={innerRef}
                            />
                        );
                    }}
                </RouterContext.Consumer>
            )
        }
    }

    Link.propTypes = {
        innerRef: innerRefType,
        onClick: Protypes.func,
        replace: Protypes.bool,
        target: ProTypes.string,
        to: PropTypes.isRequired
    };

    ```

1. 使用示例
