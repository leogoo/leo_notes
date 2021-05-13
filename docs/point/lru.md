> LRU(Least Recently Used:最近最少使用)缓存淘汰策略，故名思义，就是根据数据的历史访问记录来进行淘汰数据，其核心思想是 如果数据最近被访问过，那么将来被访问的几率也更高 ，优先淘汰最近没有被访问到的数据

有种简单实现方式，Map能够记住键的原始插入顺序
```js
class LRUCache {
    constructor(max) {
        this.cache = new Map();
        this.max = max;
    }

    get(key) {
        if (this.cache.has(key)) {
            // 存在即更新
            let temp = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, temp);
            return temp;
        }
        return -1;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            // 存在即更新（删除后加入）
            this.cache.delete(key);
        } else if (this.cache.size >= this.max) {
            // 缓存超过最大值，则移除最近没有使用的
            // map.prototype.keys方法返回一个Iterator对象
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }
}
```