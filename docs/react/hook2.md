### LifeCircles
1. useMountedState: track if component is mounted
   ```js
   function useMountedState(): () => boolean {
     const mountedRef = useRef<boolean>(false);
     const get = useCallback(() => mountedRef.current, []);
     
     useEffect(() => {
       mountedRef.current = true;
       
       return () => {
         mountedRef.current = false;
       };
     }, []);
     
     return get;
   }
   ```

### Side_effects
1. useCookie: 读写cookie

   ```js
   import { useState, useCallback } from 'react';
   import Cookies from 'js-cookie';
   
   type UpdateCookie = (newValue: string, options?: Cookies.CookieAttributes) => void;
   type DeleteCookie = () => void;
   
   const useCookie = (cookieName: string): [string | null, UpdateCookie, DeleteCookie] => {
     const [value, setValue] = useState<state | null>(() => Cookies.get(cookieName) || null);
     const updateCookie = useCallback(
       (newValue: string, options?: Cookies.CookieAttribute) => {
         Cookies.set(cookieName, newValue, options);
         setValue(newValue);
       },
       [cookieName]
     );
     
     const deleteCookie = useCallback(() => {
       Cookies.remove(cookieName);
       setValue(null);
     }, [cookieName]);
     
     return [value, updateCookie, deleteCookie];
   };
   ```

2. useAsyncFn
   ```js
   export default function useAsyncFn(
     fn,
     deps = [],
     initialState = { loading: false }
   ) {
     const lastCallId = useRef(0);
     const [state, setState] = useState(initialState);
     const isMounted = useMountedState();
   
     const callback = useCallback((...args) => {
       const callId = ++lastCallId.current;
       setState((prevState) => ({
         ...prevState,
         loading: true
       }));
   
       return fn(...args).then(
         (value) => {
           isMounted() &&
             callId === lastCallId.current &&
             setState({ value, loading: false });
           return value;
         },
         (error) => {
           isMounted() &&
             callId === lastCallId.current &&
             setState({ error, loading: false });
   
           return error;
         }
       );
     }, deps);
   
     return [state, callback];
   }
   
   
   // usage
   const request = () => {
     return new Promise((reslove, reject) => {
       setTimeout(() => {
         console.log(111);
         reslove({
           result: 123424
         });
       }, 1000);
     });
   };
   export default function Test({ url }) {
     const [state, fetch] = useAsyncFn(async () => {
       const response = await request(url);
       return response.result;
     }, [url]);
   
     return (
       <div>
         {state.loading ? (
           <div>Loading...</div>
         ) : state.error ? (
           <div>Error: {state.error.message}</div>
         ) : (
           <div>Value: {state.value}</div>
         )}
         <button onClick={() => fetch()}>Start loading</button>
       </div>
     );
   }
   ```

### Animations
1. useTimeoutFn
2. useInterval
   ```jsx
   function useInterval(callback: Function, delay: number | null) {
     const savedCallback = useRef<Function>(() => {});
   
     useEffect(() => {
       // 每次callback发生变化时，都将最新的callback保存起来
       savedCallback.current = callback;
     });
   
     useEffect(() => {
       if (delay !== null) {
         const interval = setInterval(() => {
           savedCallback.current();
         }, delay || 0);
         return () => clearInterval(interval);
       }
   
       return;
     }, [callback, delay]);
   }
   
   ```