> 二分查找多用于排好序的数列上

## 求开方
1. [69. Sqrt(x) (Easy)](https://leetcode.com/problems/sqrtx/)
    可以把这道题想象成，给定一个非负整数 a，求 f (x) = x * x − a = 0 的解。因为只考虑 x ≥ 0，所以 f(x) 在定义域上是单调递增的。考虑到 f(0) = −a ≤ 0，f(a) = a2 − a ≥ 0，我们 可以对 [0, a] 区间使用二分法找到 f (x) = 0 的解
    ```js
    var mySqrt = function(x) {
        if (x === 0) return 0;
        let l = 0;
        let r = x;
        let result;
        let m;
        while (r >= l) {
            m = Math.ceil((l + r) / 2);
            // 因为是舍弃小数，所以m * m <=x时，记录下m
            m * m <= x ? (result = m, l = m + 1) : r = m - 1;
        }
        return result;
    };
    ```

## 查找区间
1. [34. Find First and Last Position of Element in Sorted Array (Medium)](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

    题目可以解析为查找第一个大于等于target值的索引l，和第一个大于target值的索引-1 r,返回[l, r];
    ```js
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    const binarySearch = function (nums, target, lower) {
        
    }

    var searchRange = function(nums, target) {

    };
    ```

## 旋转数组查找数字
1. [81. Search in Rotated Sorted Array II (Medium)](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/)
    
    旋转后某些区间也是有单调性的


1. [154. Find Minimum in Rotated Sorted Array II (Medium)]
1. [540. Single Element in a Sorted Array (Medium)]
  在出现独立数之前和之后，奇偶位数的值发生了什么变化?

4. [4. Median of Two Sorted Arrays (Hard)]