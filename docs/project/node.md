## node环境相关
1. 升级npm`npm install npm@6 -g`
1. 升级npm版本后，安装依赖可能会出问题，需要清一下缓存`npm cache clean --force`

## 公共包维护
1. `npm publish --access public`
1. 废弃指定版本 `npm deprecate @factors/test@1.0.0 'test'`
1. 删除 `npm unpublish @factors/test --force`