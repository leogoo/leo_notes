### 基础排序算法
##### 冒泡排序
> 就两两比较，直到冒泡到队尾
```js
function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        // 队尾是排好序的大值
        for (let j = 0; j < len - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
```

##### 插入排序
> 把[0]看做已经排好序的数组，将后面元素一个个插到前面对应的位置
```js
function insertSort(arr) {
    const res = arr[0];
    for (let i = 0; i < arr.length; i++) {
        const temp = arr[i];
        let j = i;
        while(j > 0 && arr[j - 1] > temp) {
            // 排好序的前面元素从后往前遍历，如果大于temp则往后挪
            arr[j] = arr[j - 1];
            j--;
        }
        arr[j] = temp;
    }
    return arr;
}
```
##### 选择排序
> 每次遍历找到最小值，然后交换到前面，和插入一样，前面当做排好序的，区别是每次用来插入的都是按顺序选出来的
```js
function selectSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // 如果 minIndex 对应元素不是目前的头部元素，则交换两者
        if(minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        }
    }
    return arr;
}
```

### 快速排序
快速排序有三个步骤:
1. 在数据集之中，选择一个元素作为"基准"（pivot）
2. 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边
3. 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止`
```js
var quickSort = function(arr) {
    if (arr.length <= 1) { return arr; }

    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr[pivotIndex];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
```

### 归并排序
> 归并排序使用分而治之的概念对给定的元素列表进行排序。它将问题分解为较小的子问题，直到它们变得足够简单以至可以直接解决为止

```js
function mergeSort(array) {
    if(array.length < 2){
        return array;
    }
    const half = Math.floor(array.length / 2);
    const left = array.splice(0, half);
    return merge(mergeSort(left),mergeSort(array))
}
// merge的作用是将两个排好序的数组合并
function merge(left, right) {
    const res = [];
    while(left.length && right.length) {
        if (left[0] < right[0]) {
            res.push(left.shift());
        } else {
            res.push(right.shift());
        }
    }
    // 连接剩余的元素，防止没有把两个数组遍历完整
    return [...res, ...left, ...right];
}
```