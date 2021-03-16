>Hooks 是一个 React 函数组件内一类特殊的函数（通常以 "use" 开头，比如 "useState"），使开发者能够在 function component 里使用 state 和 life-cycles，以及使用 custom hook 复用业务逻辑

### 最基本的两个hook是useState和useEffect
1. useEffect内的回调是组件初始化和每次重渲染都会执行
    - 第二个参数来决定是否执行里面的操作，传入一个空数组 [ ]，那么该 effect 只会在组件 mount 和 unmount 时期执行
    - 添加依赖后，会在组件 mount 和 unmount 以及didUpdate的时候执行
    - useLayoutEffect和useEffect功能基本重合，但是useLayoutEffect等里面的代码执行完后才更新视图，可以解决一些闪动问题

    ```js
    // 利用useEffect发送请求
    const [data, setData] = useState();

    useEffect(() => {
      const fetchData = async () => {
        const result = await axios('https://');

        setData(result.data);
      };

      fetchData();
    }, []);

    return null;
    ```

1. useState来修改state值会引起重渲染
    - 可以使用匿名函数(prevState) => {setState(prevState + 1)}
    - 取到的state值是组件渲染时的快照，可以利用ref来取到最新的值
    - 在组件初始时进行赋值后即切断和props的联系，可用useEffect更新对props的依赖
        ```js
        function Test(props) {
            const [count, setCount] = useState(props.num);
            
            useEffect(() => {
                setCount(props.num);
            }, [props]);
        }
        ```

### useReducer
官方有useReducer这个hook，也可以通过useState来实现。useReducer可以用来当做redux
```js
function useReducer(reducer, initialState) {
    const [state, setState] = useState(initialState);
    
    function dispatch(action) {
        const nextState = reducer(state, action);
        setState(nextState);
    }

    return [state, dispatch];
}

// 一个 Action
function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: "add", text });
  }

  return [todos, { handleAddClick }];
}

// 绑定 Todos 的 UI
function TodosUI() {
  const [todos, actions] = useTodos();
  return (
    <>
      {todos.map((todo, index) => (
        <div>{todo.text}</div>
      ))}
      <button onClick={actions.handleAddClick}>Add Todo</button>
    </>
  );
}
```
只提供状态处理方法，不会持久化状态。使用TodosUI创建不同的组件不能共享状态，这时候需要useContext来维护全局的一份状态

### useContext
关于context的使用，还是比较简单的，利用createContext来生成provider和consumer
```js
const { Provider, Consumer } = React.createContext(null);
function Bar() {
  return (
    <Consumer>
      {color => <div>{color}</div>}
    </Consumer>
  );
}
function Foo() {
  return <Bar />;
}
function App() {
  return (
    <Provider value={"grey"}>
      <Foo />
    </Provider>
  );
}
```
使用useContext可以简化consumer嵌套的问题。返回值即是想要透传给consumer的数据
```js
const colorContext = React.createContext("gray");
function Bar() {
    // 传入的是context，不是consumer
    const color = useContext(colorContext);
    return <div>{color}</div>
}
function Foo() {
    return <Bar />;
}
function App() {
    return (
        <colorContext.Provider value={"red"}>
            <Foo />
        </colorContext.Provider>
    );
}
```

### useCallback
useCallback用来防止组件的重渲染(父组件的),这个方法会有开销，只有会发生重渲染的时候才能配合React.memo使用
React.memo类似类组件中的pureComponent
```js
function App() {
    const memoizedHandleClick = useCallback(() => {
        console.log('Click happened')
    }, []);
    // 不会生成新的memoizedHandleClick
    return <SomeComponent onClick={memoizedHandleClick}>Click Me</SomeComponent>;
}
```

### useMemo 记忆组件
useMemo会执行函数并返回结果
```js
function App() {
  const [num, setNum] = useState(0);

  function expensiveFn() {
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += i;
    }
    console.log(result)
    return result;
  }

// 每次点击base的值不会重复计算
  const base = useMemo(expensiveFn, []);

  return (
    <div className="App">
      <h1>count：{num}</h1>
      <button onClick={() => setNum(num + base)}>+1</button>
    </div>
  );
}
```

### useRef
1. 和react16里的createRef一样，用于获取组件的ref
  ```js
  function TextInputWithFocusButton() {
      const inputEl = useRef(null);
      const onButtonClick = () => {
          //inputEl 的 current 属性指向 input 组件的 dom 节点
          inputEl.current.focus();
      };
      return (
          <>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>Focus the input</button>
          </>
      );
  }
  ```
1. 利用React.forwardRef转发ref
    ```js
    const MyChild = forwardRef((props, ref) => {
        return <input ref={ref} type="text" />;
    });

    export default function Test(props) {
        const childRef = useRef();
        useEffect(() => {
            childRef.current.focus();
        }, []);
        return <MyChild ref={childRef} />;
    }
    ```
1. useImperativeHandle限制forwardRef转发时暴露的东西
    ```js
    const MyChild = React.forwardRef((props, ref) => {
        const inputRef = useRef(); // 子组件自身的ref
        useImperativeHandle(ref, () => ({
            value: inputRef.current.value,
            // 不返回下面这个focus方法的话，父组件不能调用
            focus: () => inputRef.current.focus()
        }));
        return <input ref={inputRef} type="text" />;
    });

    export default function Test(props) {
        const childRef = useRef();
        useEffect(() => {
            childRef.current.focus();
        }, []);
        return <MyChild ref={childRef} />;
    }
    ```