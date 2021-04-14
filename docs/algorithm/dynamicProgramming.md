> 动态规划和其它遍历算法(如深/广度优先搜索)都是将原问题拆成多个子问题然后求解，他们之间最本质的区别是，动态规划保存子问题的解，避免重复计算。解决动态规划问题的关键是找到状态转移方程，这样我们可以通过计算和储存子问题的解来求解最终问题。动态规划是自下而上的，即先解决子问题，再解 决父问题;而用带有状态记录的优先搜索是自上而下的，即从父问题搜索到子问题，若重复搜索 到同一个子问题则进行状态记录，防止重复计算。如果题目需求的是最终状态，那么使用动态搜 索比较方便;如果题目需要输出所有的路径，那么使用带有状态记录的优先搜索会比较方便

## 基本动态规划:一维
1. [70. Climbing Stairs (Easy)](https://leetcode.com/problems/climbing-stairs/)
    ```js
    var climbStairs = function(n) {
        if (n <= 2) {
            return n;
        }
        let dp = [1, 1];
        for (let i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }
    // 对空间进行压缩,就是将dp[i-1]、dp[i-2]用变量进行存储并更新
    var climbStairs = function(n) {
        if (n <= 2) {
            return n;
        }
        let prev1 = 1;
        let prev2 = 1;
        let curr = 0;
        for (let i = 2; i <= n; i++) {
            curr = prev1 + prev2;
            prev1 = prev2;
            prev2 = curr;
        }
        return curr;
    };
    ```

1. [198. House Robber (Easy)]()
    状态转移方程为 dp[i] = max(dp[i-1], nums[i-1] + dp[i-2])
    ```js
    var rob = function(nums) {
        const n = nums.length;
        if (n === 0) {
            return 0;
        }
        const dp = [0];
        dp[1] = nums[0];
        for (let i = 2; i <= n; i++) {
            dp[i] = Math.max(dp[i-1], nums[i - 1]+ dp[i-2]);
        }
        return dp;
    };
    ```
1. [413. Arithmetic Slices (Medium)]()

## 基本动态规划:二维
1. [64. Minimum Path Sum (Medium)](https://leetcode.com/problems/minimum-path-sum/)
    状态转移方程 dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]

1. [542. 01 Matrix (Medium)]()
1. [221. Maximal Square (Medium)]()

## 分割问题

## 子序列问题

## 背包问题

## 字符串编辑