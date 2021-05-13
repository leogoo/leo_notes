## node环境相关
1. 升级npm`npm install npm@6 -g`
1. 升级npm版本后，安装依赖可能会出问题，需要清一下缓存`npm cache clean --force`

## 公共包维护
1. `npm publish --access public`
1. 废弃指定版本 `npm deprecate @factors/test@1.0.0 'test'`
1. 删除 `npm unpublish @factors/test --force`

## npm link
> 开发公共包或者是调试公共包的时候，可以使用npm link来链接到本地开发的包
1. 创建链接，在开发的公共包项目my_module内执行`npm link`,my_module项目则被链接到全局，路径是`{prefix}/lib/node_modules/<package>`,可通过`npm config get prefix`取得prefix值

2. 使用公共包的项目内执行`npm link my_module`，之后就可以直接引入公共包使用

3. 移除链接，执行`npm unlink my_module`
