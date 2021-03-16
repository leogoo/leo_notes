> 双指针主要用于遍历数组

## Two Sum
1. [167. Two Sum II - Input array is sorted (Easy)](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

    在一个增序的整数数组里找到两个数，使它们的和为给定值。已知有且只有一对解
    解法: 因为数组是有序的，可以用左右指针来夹逼，当左指针和右指针指向之和小于target时说明左边的值小了，左指针右移
    ```js
    // Input: numbers = [2,7,11,15], target = 9
    // Output: [1,2]
    var twoSum = function(numbers, target) {
        let l = 0;
        let r = numbers.length - 1;
        while(l <= r) {

            if (numbers[l] + numbers[r] === target) {
                return [l+1, r+1];
            } else if (numbers[l] + numbers[r] < target) {
                l++;
            } else {
                r--;
            }
        }
    };
```

## 归并两个有序数组
1. [88. Merge Sorted Array (Easy)](https://leetcode.com/problems/merge-sorted-array/)

    题目要求把第二个数组归并到第一个数组上，不需要开辟额外空间
    ```js
    // Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
    // Output: nums1 = [1,2,2,3,5,6]
    var merge = function(nums1, m, nums2, n) {
        let len1 = m - 1;
        let len2 = n - 1;
        let p = m + n - 1;
        while(len1 >= 0 && len2 >= 0) {
            // 先将较大的复制到队尾
            nums1[p--] = nums1[len1] > nums2[len2] ? nums1[len1--] : nums2[len2--];
        }
        // 如果第二个数组有剩余，复制过来
        if (len1 < 0) {
            nums1.splice(0, len2 + 1, ...nums2.slice(0, len2 + 1));
        }
    };
    ```
## 快慢指针
1. [142. Linked List Cycle II (Medium)](https://leetcode-cn.com/problems/linked-list-cycle-ii/)