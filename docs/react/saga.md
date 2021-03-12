### redux-thunk
>redux-thunk是一个非常简单且使用的中间件，处理异步操作时将dispatch传入acitoncreator，根据条件dispatch(action)
1. 源码
    ```js
    function createThunkMiddleware(extraArgument) {
        return ({dispatch, getState}) => next => action => {
            if (typeof action === 'function') {
                return action(dispatch, getState, extraArgument);
            }

            return next(action);
        }
    }
    const thunk = createThunkMiddleware();
    thunk.withExtraArgument = createThunkMiddleware;
    export default thunk;
    ```
1. thunk处理异步action
    ```js
    this.props.dispatch(fetchData({hello: 'thunk'}));

    // actionCreator
    export function fetchData(someValue) {
        return (dispatch, getState) => {
            myAjaxLib.post("/someEndPoint", {data: someValue})
                .then(res => dispatch({type: "REQUEST_SUCCESSED", payload: res}))
                .catch(err => dispatch(type: "REQUEST_FAILD", error: err));
        };
    }
    ```

### redux-sage
1. saga使用特点：
    - 数据相关业务逻辑转移到单独的saga.js文件
    - dispatch参数为普通的action对象
    - 每一个saga都是一个genertator function，同步处理异步逻辑，代码异常和请求可以直接通过try/catch直接捕获
1. saga一般包含3部分
    1. worker saga：做所有的工作，如调用API，进行异步请求，并获得返回结果
    1. watcher saga: 监听被dispatch的actions，当接收到action或者知道被触发时，调用worker saga执行任务
    1. root saga：立即启动sagas的唯一入口
1. 配置中间件
    ```js
    import createSagaMiddleware from 'redux-saga';
    import rootSaga from './saga.js';

    const sagaMiddleware = createSagaMiddleware();

    const reducerAll = {
        userNameReducer: userNameReducer
    };
    
    export const store = createStore(
        combineReducers({...reducerAll}),
        {},
        applyMiddleware(sagaMiddleware)
    );

    // 启动saga，开启sagaMiddleware对action进行监听
    sagaMiddleware.run(rootSaga);
    ```
1. 初始化程序时，rootSaga干了啥
    ```js
    // sags/index.js
    import {take, fork, call, put} from 'redux-saga/effects';

    // worker
    function* fetchUrl(url) {
        const data = yield call(fetch, url);// 指示中间件调用fetch异步任务
        yield put({type: 'FETCH_SUCCESS', data});// 指示中间件发起一个action到store
    }

    // watcher
    function* watchFetchRequests() {
        while(true) {
            const action = yield take('FETCH_REQUEST');// 监听action
            yield fork(fetchUrl, action.url);// 指示中间件以无阻塞调用方式执行fetchUrl
        }
    }

    // root saga
    export default function* rootSaga() {
        yield watchFetchRequest();
    }
    ```
    流程说明：
    1. watcher saga中
        - yield take('FETCH_REQUEST')指示中间件，正在等待一个类型为FETCH_REQUEST的action。中间件暂停执行watchFetchRequests generstor函数，直到FETCH_REQUEST action被dispatch
        - fork(fetchUrl, action.url)指示中间件无阻塞调用一个新的fetchUrl任务，action.url作为fetchUrl的参数。
        - 当fetchUrl开始执行的时候，watchFetchRequests会继续监听其他的FETCH_REQUEST action
    1. worker saga fetchUrl中，call指示中间件去调用fetch函数，同时阻塞fetchUrl的执行，直到fetch返回的Primise被resolved或rejected
    
### redux-saga源码解析
1. 入口
```js
const sagaMiddleware = createSagaMiddleware();
// 启动saga，开启sagaMiddleware对action进行监听
sagaMiddleware.run(rootSaga);
```
1. 调用sagaMiddleware.run实际是调用了runsaga.js的主逻辑
```js
// 返回中间件sagaMiddleware
export default function sagaMiddlewareFactory({context={}, ...options} = {}) {
    // ...
    function sagaMiddleware({getState, dispatch}) => {
        const sagaEmitter = emitter();
        sagaEmitter.emit = (options.emitter || ident)(sagaEmitter.emit);
        // 为runSaga提供redux函数以及subscribe
        sagaMiddleware.run = runSaga.bind(null, {
            context,
            subscribe: sagaEmitter.subscribe,
            dispatch,
            getState,
            sagaMonitor,
            logger,
            onError
        });

        return next => action => {
            const result = next(action);
            sagaEmitter.emit(action);
            return result;
        }
    }
}

// runSaga.js
export function runSaga(storeInterface, saga, ...args) {
    // ...
    // 执行入口逻辑，例子中的rootSaga，生成迭代器
    iterator = saga(...args);
    // storeInterface主要提供redux中的方法
    const { subscribe, dispatch, getState, context, sagaMonitor, logger, onError } = storeInterface

    // 执行
    const task = proc(
        iterator,
        subscribe,
        wrapSagaDispatch(dispatch),
        getState,
        context,
        {sagaMonitor, logger, onError},
        effectId,
        saga.name
    );
}
```
