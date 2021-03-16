## 分配问题
> 贪心算法的思想就是每一步都是最优解，从而使最终的结果也是全局最优

1. [455 Assign Cookies](https://leetcode-cn.com/problems/assign-cookies/)

    第一个数组是小孩子的饥饿值，第二个数组是饼干的大小，一个小孩只能吃一个饼干。利用贪心算法，要满足足够多的小孩，就是优先满足饥饿值最小的小孩
    ```js
    // 输入: [1, 2], [1, 2, 3]
    // 输出: 2

    var findContentChildren = function(g, s) {
        g.sort((a, b) => a - b);
        s.sort((a, b) => a - b);
        let child = 0;
        let cookie = 0;
        while (child < g.length && cookie < s.length) {
            if (g[child] <= s[cookie]) {
                child++;
            }
            cookie++;
        }
        return child;
    };
    ```
1. [135 candy](https://leetcode-cn.com/problems/candy/)

    每人至少一块糖，且相邻的人根据评分大小，评分大的一定要分到更多的糖
    ```js
    // Input: [1,0,2]
    // Output: 5
    var candy = function(ratings) {
        // 初始都设为1
        let result = new Array(ratings.length).fill(1);
        // 从左到右遍历一遍
        for (let i = 1; i < ratings.length; i++) {
            if (ratings[i] > ratings[i-1]) {
                result[i] = result[i-1] + 1;
            }
        }
        // 从右到做遍历一遍，注意的是如果本身就符合条件不要重新赋值，可能会变小
        for (let j = ratings.length - 2; j >= 0; j--) {
            if (ratings[j] > ratings[j + 1]) {
                result[j] = Math.max(result[j], result[j + 1] + 1);
            }
        }
        return result.reduce((res, num) => res + num, 0);
    };
    ```

## 区间问题
1. [435 non-overlapping-intervals](https://leetcode-cn.com/problems/non-overlapping-intervals/)

    计算让这些区间互不重叠所需要移除区间的最少个数， 针对每个区间进行排序，优先留下最大值小且长度小的区间
    ```js
    // Input: [[1,2], [2,4], [1,3]]
    // Output: 1
    var eraseOverlapIntervals = function(intervals) {
        if (!intervals.length || intervals.length === 1) {
            return 0;
        }
        intervals.sort((a, b) => {
            return a[1] - b[1];
        });
        // 如果前面几个的最大值是相等的，其实也不影响，反正最后只留一个，后面的判断依赖最大值
        let result = [intervals[0]];
        for (let i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= result[result.length - 1][1]) {
                result.push(intervals[i]);
            }
        }
        return intervals.length - result.length;
    };
    ```
1. [605 can-place-flowers](https://leetcode.com/problems/can-place-flowers/)
1. [452 Minimum Number of Arrows to Burst Balloons (Medium)](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)
1. [763. Partition Labels (Medium)](https://leetcode.com/problems/partition-labels/)
1. [122. Best Time to Buy and Sell Stock II (Easy)](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)
1. [406. Queue Reconstruction by Height (Medium)](https://leetcode.com/problems/queue-reconstruction-by-height/)
1. [665. Non-decreasing Array (Easy)](https://leetcode.com/problems/non-decreasing-array/)