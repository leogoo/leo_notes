### Observable
Observable监听变量，action函数来修改变量，react组件监听到该变量的变化则会重新渲染。
使用多个变量时，observable监听一个就可以触发重渲染
注意使用对象的监听，只修改对象的属性并不能监听到变化,mobx监听数据的变化是指数据重新赋值了，值不一定变化

@observable.deep 深复制
@observable.shallow 浅复制

Mobx使用时发现数据响应有问题，基本问题定位就是重新赋值了，不要对传过来的属性赋值

属性的修改触发重渲染，不会执行组件的constructor，可以修改key来强制重新加载