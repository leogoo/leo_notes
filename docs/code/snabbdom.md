1. @babel/plugin-transform-react-jsx插件用于处理jsx，指定createElement方法
    ```js
    "plugins": [
        [
            "@babel/plugin-transform-react-jsx",
            {
                "pragma": "myReact.createElement", // default pragma is React.createElement
                "throwIfNamespace": false // defaults to true
            }
        ]
    ]

    // index.js
    `const a = <p>111</p>; 
    <div>
        <a />
        <span>{item.name}</span>
    </div>`

    // 编译结果
    var a = React.createElement("p", null, "111");
    React.createElement("div", {
        className: "c"
    }, React.createElement("a", null), React.createElement("span", null, item.name));

    // myReact
    function createElement (type, props, ...children) {
        // 
    }
    ```
1. 利用h创建虚拟dom对象
    ```js
    const h = (type, data, c) => {
        if (c) {
            // 三个参数的情况  sel , data , children | text
            if (is.array(c)) {
                children = c;
            } else if (is.primitive(c)) {
                text = c;
            } else if (c && c.sel) {
                children = [c];
            }
        }

        if (children) {
            for (i = 0; i < children.length; ++i) {
                // 如果children是文本或数字 ，则创建文本节点
                if (is.primitive(children[i]))
                    children[i] = vnode(
                        undefined,
                        undefined,
                        undefined,
                        children[i],
                        undefined
                    );
            }
        }
        return vnode(sel, data, children, text, undefined);
    }


    export interface VNode {
        sel: string | undefined;// 元素选择器
        data: VNodeData | undefined;
        children: Array<VNode | string> | undefined;
        elm: Node | undefined;// dom元素的引用
        text: string | undefined;
        key: Key | undefined;
    }
    ```
1. snabbdom.init生成一个更新虚拟dom的方法
    ```js
    const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
    function init(modules, domApi) {
        let cbs = {};
        const api = domApi || htmlDomApi;

        for(let i = 0; i < hooks.lenght; ++i) {
            const hookName = hook[i];
            cbs[hookName] = [];
            for(let j = 0; j < modules.length; ++i) {
                const hook = modules[j][hookName];// 从每个modules中取出对应hook的回调
                if (hook !== undefined) {
                    cbs[hookName].push(hook);
                }
            }
        }

        return (oldVnode: VNode | Element, vnode) => {
              // insertedVnodeQueue存在于整个patch过程, 用于收集patch中新插入的vnode
            const insertedVnodeQueue: VNodeQueue = [];
            // 执行pre hook
            cbs.pre.forEach(cb => cb());

            // isVnode根据节点是否有sel属性判断是否是虚拟dom
            if (!isVnode(oldVnode)) {
                // 将dom元素转为虚拟dom
                oldVnode = emptyNodeAt(oldVnode);
            }

            // vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
            // key就是为了区分element
            if (sameVnode(oldVnode, vnode)) {
                // 核心方法
                patchVnode(oldVnode, vnode, insertedVnodeQueue);
            } else {
                // 直接替换dom
                elm = oldVnode.elm;
                parent = api.parentNode(elm);

                // createElm根据vnode创建element
                createElm(vnode, insertedVnodeQueue);

                if (parent !== null) {
                    api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                    removeVnode(parent, [oldValue], 0, 0);
                }
            }

            cbs.post.forEach(cb => cb());
            return vnode;
        }
    }
    ```
1. patchVnode方法不是直接替换dom时执行，更新dom
    ```js
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        const elm = vnode.elm = oldVnode.elm;
        let oldCh = oldVnode.children;
        let ch = vnode.children;
        if (oldVnode === vnode) return;
        // 将children中存在的字符串则创建一个text
        if (!vnode.text) {
            if (oldCh && ch) {
                if (oldCh !== ch ) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            } else if (ch) {
                // 只有新的虚拟dom有children，添加vnode的children
                if (oldVnode.text) api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            } else if (oldCh) {
                // 只有旧vnode有children,那么移除oldCh
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            } else if (oldVnode.text) {
                // 都没有children，oldVnode.text不为空，vnode.text为空清空elm的text
                api.setTextContent(elm, '');
            }
        } else if (oldVnode.text !== vnode.text) {
            if (oldCh) {
                removeVnodes(elm, oldCh, 0, oldCh.lenght - 1);
            }
            api.setTextContent(el, vnode.text);
        }
    }
    ```
1. updateChildren，diff算法核心
    ```js
    function (parentElm, oldCh, newCh, insertedVnodeQueue) {
        
    }
    ```