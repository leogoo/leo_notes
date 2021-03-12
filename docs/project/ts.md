### 接口

1. 函数类型

   ```ts
   interface SearchFunc {
   	(source: string, subString: string): boolean;
   }
   
   let mySearch: SearchFunc;
   mySearch = function() {
     
   }
   ```

2. 继承接口

   ```ts
   interface Shape {
       color: string;
   }
   
   interface Square extends Shape {
       sideLength: number;
   }
   
   let square = <Square>{};
   square.color = "blue";
   square.sideLength = 10;
   ```

3. 接口继承类, 只有子类能够使用接口

   ```ts
   class Control {
       private state: any;
   }
   
   interface SelectableControl extends Control {
       select(): void;
   }
   
   class Button extends Control implements SelectableControl {
       select() { }
   }
   ```

### extends 条件类型

1. 简单类型匹配

   ```ts
   type isNum<T> = T extends number ? number : string
   
   type Num = InstanceVal<1>   // number;
   type Str = InstanceVal<'1'> // string;
   
   ```

2. 判断联合类型， 联合类型A的所有子类型，在联合类型B中共都存在

   ```ts
   type A = 'x';
   type B = 'x' | 'y';
   
   type Y = A extends B ? true : false; // true
   ```

3. 推迟解析条件类型

   ```ts
   type AB<T> = T extends 'x' ? 'a' : 'b';
   type All = AB<'x' | 'y'>; // 非确定条件，可能是 'x' 或 'y'
   // 得到 type All = 'a' | 'b';
   
   
   type Other = "a" | "b";
   type Merge<T> = T extends "x" ? T : Other; // T 等于匹配的类型，然后加上 Other 联合类型一起返回
   type Values = Merge<"x" | "y">; // type Values = 'x' | 'a' | 'b'
   
   
   type Other = 'a' | 'b';
   type Merge<T> = T extends "x" ? Other : T; // T 等于除匹配类型的额外所有类型（官方叫候选类型）
   type Values = Merge<'x' | 'y'>; // type Values = 'a' | 'b' | 'y'
   ```

### 泛型
1. 泛型extends，对泛型进行 extends 修饰限制

### infer
> infer在extends的条件语句中推断待推断的类型

1. 获取数组里的元素类型
   ```ts
   type Ids = number[];
   type Names = string[];
   type Unpacked<T> = T extends Names ? string : T extends Ids ? number : T;
   
   type idType = Unpacked<Ids>; // number
   type nameType = Unpacked<Names>; // string
   
   
   // 使用infer
   // T extends (infer R)[] ? R : T的意思是，如果T是某个待推断类型的数组，则返回推断的类型
   type Unpacked<T> = T extends (infer R)[] ? R : T;
   type idType = Unpacked<Ids>; // number
   type nameType = Unpacked<Names>; // string
   ```

2. 获取一个`Promise<xxx>`类型中的`xxx`类型

   > Promise的泛型T代表promise变成成功态之后resolve的值，resolve(value)

   ```
   type Response = Promise<number[]>
   type Unpacked<T> = T extends Promise<infer R> ? R : T;
   type resType = Unpacked<Response>; // number[]
   ```

3. @type/react中的useReducer获取reducer中的状态类型

   ```ts
   // R限制为Reducer类型
   // 通过传入的R类型即reducer函数类型获取第一个参数的类型
   type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any>
     ? S
     : never;
                                                                     
   function useReducer<R extends Reducer<any, any>, I>(
     reducer: R,
     initializerArg: I & ReducerState<R>,
     initializer: (arg: I & ReducerState<R>) => ReducerState<R>
   ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
   ```

