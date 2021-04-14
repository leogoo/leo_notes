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

1. [633. Sum of Square Numbers (Easy)](https://leetcode.com/problems/sum-of-square-numbers/)

    大的那个数最大可能是Math.floor(Math.sqrt(c));
    ```js
    var judgeSquareSum = function(c) {
        let p0 = 0;
        let p1 = Math.floor(Math.sqrt(c));
        while(p1 >= p0) {
            const result = Math.pow(p0, 2) + Math.pow(p1, 2);
            if (result === c) {
                return true;
            }
            result > c ? p1-- : p0++;
        }
        return false;
    };
    ```
1. [680. Valid Palindrome II (Easy)](https://leetcode.com/problems/valid-palindrome-ii/)

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

1. [524. Longest Word in Dictionary through Deleting (Medium)](https://leetcode.com/problems/longest-word-in-dictionary-through-deleting/)

## 快慢指针
1. [142. Linked List Cycle II (Medium)](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

    快指针一次走两步，慢指针一次一步，链表有环则必定会相交，因为快指针每次多走一步，也就是一步步靠近慢指针
    <br/><img src="https://ask.qcloudimg.com/developer-images/article-audit/4069641/3q6ojo6nkw.png?imageView2/2/w/1620" /><br/>
    第一次相交时，慢指针走了`x + y`， 快指针走了 `x + y + (y + z) * n`, 所以`2*(x + y) = x + y + (y + z)*n`，可以得出x = n (y + z) - y
    也就是`x = (n-1)(y+z) + z`;
    相交后将慢指针移回开头，同时快指针和慢指针同时一次一步，慢指针走了x到达环入口，快指针从第一次相交点出发走了`(n-1)(y+z) + z`，也就是转了几圈后走了z，也到达环的入口
    ```js
    /**
     * Definition for singly-linked list.
     * function ListNode(val) {
     *     this.val = val;
     *     this.next = null;
     * }
     */

    /**
     * @param {ListNode} head
     * @return {ListNode}
     */
    var detectCycle = function(head) {
        let fast = head;
        let slow = head;
        while (fast !== null && slow !== null && fast !== slow) {
            slow = slow.next;
            fast = fast.next.next;
        }
        slow = head;
        while(fast !== slow) {
            slow = slow.next;
            fast = fast.next;
        }
        return null;
    };
    ```

    简单的一个迭代方法，一个指针一直遍历并加个标志
    ```js
    var detectCycle = function(head) {
        while (head) {
            if (head.flag) return head
            head.flag = true
            head = head.next
        }
        return null
    };
    ```

## 滑动窗口
1. [76. Minimum Window Substring (Hard)](https://leetcode.com/problems/minimum-window-substring/)

[340. Longest Substring with At Most K Distinct Characters (Hard)](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/)
需要利用其它数据结构方便统计当前的字符状态