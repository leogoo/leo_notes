/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
    if (n <=2) return 0;
    let count = n / 2; // 偶数肯定不是质数
    const prime = new Array(n).fill(true);
    for(let i = 3; i <= Math.sqrt(n); i++) {
        if (prime[i]) {
            for (let j = i * 2; j <= Math.sqrt(n); j += i) {
                if (prime[j]) {
                    count--;
                    prime[j] = false;
                }
            }
        }
    }
    return count;
};