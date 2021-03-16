// Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
// Output: nums1 = [1,2,2,3,5,6]
var merge = function(nums1, m, nums2, n) {
    let len1 = m - 1;
    let len2 = n - 1;
    let p = m + n - 1;
    while(len1 >= 0 && len2 >= 0) {
        nums1[p--] = nums1[len1] > nums2[len2] ? nums1[len1--] : nums2[len2--];
    }
    if (len2 > 0) {
        nums1.splice(0, len2 + 1, ...nums2.slice(0, len2 + 1));
    }
    return nums1;
};
console.log(merge([1,2,3,0,0,0], 3, [2,5,6], 3));