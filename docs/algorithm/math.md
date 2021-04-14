## 质数
1. [204. Count Primes (Easy)](https://leetcode.com/problems/count-primes/)
    - 枚举 
    ```js
    var countPrimes = function(n) {
        if (n <=2) return 0;
        let count = 0;
        for(let i = 2; i < n; i++) {
            isPrime(i) && count++;
        }
        return count;
    };
    function isPrime(n) {
        for(let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }
    ```
    - 埃氏筛法
    从 1 到 n 遍历，假设当前遍历到 m，则把所有小于 n 的、且是 m 的倍 数的整数标为和数;遍历完成后，没有被标为和数的数字即为质数
    ```js
    var countPrimes = function(n) {
        if (n <=2) return 0;
        let count = n - 2; // 偶数肯定不是质数
        const prime = new Array(n).fill(true);
        for(let i = 2; i <= n; i++) {
            if (prime[i]) {
                for (let j = i * 2; j <= n; j += i) {
                    if (prime[j]) {
                        count--;
                        prime[j] = false;
                    }
                }
            }
        }
        return count;
    };
    ```

## 数字处理
1. [504. Base 7](https://leetcode.com/problems/base-7/)
1. [172. Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/)
1. [415. Add Strings](https://leetcode.com/problems/add-strings/)
1. [326. Power of Three](https://leetcode.com/problems/power-of-three/)

## 随机与取样
1. [384. Shuffle an Array (Medium)]()
1. [528. Random Pick with Weight (Medium)]()
1. [382. Linked List Random Node (Medium)]()
1. [168. Excel Sheet Column Title (Easy)]()
1. [67. Add Binary (Easy)]()
1. [238. Product of Array Except Self (Medium)]()
1. [462. Minimum Moves to Equal Array Elements II (Medium)]()
1. [169. Majority Element (Easy)]()  
1. [470. Implement Rand10() Using Rand7() (Medium)]()
1. [202. Happy Number (Easy)]()
