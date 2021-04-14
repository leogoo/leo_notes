> 深度优先搜索和广度优先搜索是两种最常见的优先搜索方法，它们被广泛地运用在图和树等结构中进行搜索

## 深度优先搜索
> 深度优先搜索(depth-first seach，DFS)在搜索到一个新的节点时，立即对该新节点进行遍历;因此遍历需要用先入后出的栈来实现，也可以通过与栈等价的递归来实现

1. [695. Max Area of Island (Easy)](https://leetcode.com/problems/max-area-of-island/)
    深度优先搜索类型 的题可以分为主函数和辅函数，主函数用于遍历所有的搜索位置，判断是否可以开始搜索，如果可以即在辅函数进行搜索。辅函数则负责深度优先搜索的递归调用。当然也可以使用栈(stack)实现深度优先搜索
    ```js
    /**
     * @param {number[][]} grid
     * @return {number}
     */
    var maxAreaOfIsland = function(grid) {
        const m = grid[0].length;
        const n = grid.length;
        let maxCount = 0;

        for (let i = 0; i < n; i++) { // 遍历列
            for (let j = 0; j < m; j++) { // 遍历行
                maxCount = Math.max(maxCount, dfs(grid, i, j));
            }
        }
        return maxCount;
    };

    function dfs(grid, i, j) {
        const m = grid[0].length;
        const n = grid.length;
        if (i < 0 || i >= n || j < 0 || j >= m || grid[i][j] === 0) {
            return 0;
        }
        // 节点[grid][i][j]是岛屿的情况才会计算，且才需要计算四周的情况
        let count = 1;
        // 重置为0，防止计算周围节点的时候重复计算
        grid[i][j] = 0;
        // 深度搜索当前节点的四周
        count += dfs(grid, i - 1, j); // 左
        count += dfs(grid, i, j - 1); // 下
        count += dfs(grid, i + 1, j); // 右
        count += dfs(grid, i, j + 1); // 上

        return count;
    }
    ```

1. [547. Friend Circles (Medium)](https://leetcode-cn.com/problems/number-of-provinces/)
    是上面找最大岛屿基本类似，这边是要找到岛屿个数

1. [417. Pacific Atlantic Water Flow (Medium)]()

## 回溯法
> [回溯法(backtracking)](https://leetcode-cn.com/problems/permutations/solution/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liweiw/)是优先搜索的一种特殊情况，又称为试探法，常用于需要记录节点状态的深度优先搜索。通常来说，排列、组合、选择类问题使用回溯法比较方便。
两个小诀窍，一是按引用传状态，二是所有的状态修改在递归完成后回改。
回溯法修改一般有两种情况，一种是修改最后一位输出，比如排列组合;一种是修改访问标 记，比如矩阵里搜字符串。

1. [46. Permutations (Medium)](https://leetcode-cn.com/problems/permutations/)

    ```js
    /**
     * @param {number[]} nums
     * @return {number[][]}
     */
    var permute = function(nums) {
        const res = [];
        const used = {};
        const dfs = (path) => {
            if (path.length === nums.length) {
                res.push(path.slice());
                return;
            }
            for (const num of nums) {
                if (used[num]) continue; // 使用过则跳过
                path.push(num);
                used[num] = true;
                dfs(path);
                path.pop(); // 递归结果后，回溯
                used[num] = false;
            }
        };
        dfs([]); // 递归的入口，空path传进去
        return res;
    };
    ```

1. [77. Combinations (Medium)](https://leetcode-cn.com/problems/combinations/)

    组合不考虑元素的顺序，排列回溯的是交换的位置，而组合回溯的是否把当前的数字加入结果中。
    ```js
    /**
     * @param {number} n
     * @param {number} k
     * @return {number[][]}
     */
    var combine = function(n, k) {
        const res = [];
        const path = [];
        dfs(n, k, 1, path, res);
        return res;
    };
    function dfs(n, k, start, path, res) {
        if (path.length === k) {
            res.push(path.slice());
            return;
        }
        // 遍历可能的搜索起点
        for (let i = start; i <= n; i++) {
            path.push(i);
            dfs(n, k, i + 1, path, res);
            path.pop(i);
        }
    }
    ```

1. [79. Word Search (Medium)]()
1. [51. N-Queens (Hard)]()

## 广度优先
先入先出。用栈实现的深度优先搜索，用队列实现的广度优先搜索
1. [104 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)
    广度优先就是一次将同层的都出队列
    ```js
    var maxDepth = function(root) {
        if (root === null) {
            return 0;
        }
        const stack = [root];
        let depth = 0;
        while(stack.length) {
            let n = stack.length;
            while (n--) {
                const currentNode = stack.shift();
                if (currentNode.left) {
                    stack.push(currentNode.left);
                }
                if (currentNode.right) {
                    stack.push(currentNode.right);
                }
            }
            depth++;
        }
        return depth;
    };
    ```
    dfs直接递归
    ```js
    var maxDepth = function(root) {
        if (root === null) {
            return 0;
        } else {
            return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
        }
    };
    ```
1. [559 maximum-depth-of-n-ary-tree](https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/)
    ```js
    var maxDepth = function(root) {
        if (root === null) {
            return 0;
        }
        let depth = 0;
        let stack = [root];
        while (stack.length) {
            let n = stack.length;
            while(n--) {
                const currentNode = stack.shift();
                // currentNode.children.forEach(node => {
                //     stack.push(node);
                // });
                if (currentNode?.children?.length) {
                    stack = stack.concat(currentNode.children);
                }
            }
            depth++;
        }
        return depth;
    };
    ```
1. [934. Shortest Bridge (Medium)](https://leetcode.com/problems/shortest-bridge/)
1. [126. Word Ladder II (Hard)]()



1. [130. Surrounded Regions (Medium)]()
  先从最外侧填充，然后再考虑里侧。
1. [257. Binary Tree Paths (Easy)]()
  输出二叉树中所有从根到叶子的路径，回溯法使用与否有什么区别?
1. [47. Permutations II (Medium)]()
排列题的 follow-up，如何处理重复元素?
1. [40. Combination Sum II (Medium)]()
组合题的 follow-up，如何处理重复元素?