>习惯性使用相对路径，在node项目里经常出现相对路径没问题，但就是找不到文件，甚至是同一个文件夹下都不行。这是因为可能出现文件的执行路径并不是实际位置的情况

1. node环境有以下方法获取路径
    - __dirname:获得当前执行文件所在目录的完整目录名
    - __filename:获得当前执行文件的带有完整绝对路径的文件名
    - process.cwd():获得当前执行node命令时候的文件夹目录名
    - ./: 文件所在目录
1. 测试，如下结构的目录
test -> a -> b.js
```
const path = require('path');

console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(path.resolve('./'));
```
    1. 在a文件夹内执行node b.js
    ```
    /Users/gaolei15/Downloads/test/a
    /Users/gaolei15/Downloads/test/a/b.js
    /Users/gaolei15/Downloads/test/a
    /Users/gaolei15/Downloads/test/a
    ```
    1. test内执行node a/b.js
    ```
    /Users/gaolei15/Downloads/test/a
    /Users/gaolei15/Downloads/test/a/b.js
    /Users/gaolei15/Downloads/test
    /Users/gaolei15/Downloads/test
    ```
1. 总结
    - __dirname: 总是返回被执行的 js 所在文件夹的绝对路径
    - __filename: 总是返回被执行的 js 的绝对路径
    - process.cwd(): 总是返回运行 node 命令时所在的文件夹的绝对路径
    - ./: 跟 process.cwd() 一样，返回 node 命令时所在的文件夹的绝对路径

1. 在require中./与__dirname想过相同，因为require加载文件是会向文件内部查找直到找到
1. 非require情况下，./是**启动脚本(app.js)**所在目录的路径,优先使用绝对路径