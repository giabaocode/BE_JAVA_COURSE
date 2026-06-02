// Pattern 2 — Two Pointers
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'tp',
  title: 'Pattern 2 — Two Pointers',
  mental: `Hai con trỏ chạy NGƯỢC NHAU (từ 2 đầu vào giữa) hoặc CÙNG CHIỀU (đọc + ghi). Áp dụng khi:
<ul>
<li>Mảng đã sort — tìm cặp/ba số thỏa sum.</li>
<li>Palindrome check.</li>
<li>In-place compact (move zero, remove duplicate, partition).</li>
<li>Two strings comparison/merge.</li>
</ul>`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao two-pointer trên sorted array tốt hơn nested loop?</strong>
Mỗi bước bạn loại trừ ÍT NHẤT 1 cặp khỏi không gian tìm kiếm. Brute n² cặp → two-pointer n. Chứng minh: tại mỗi step, left++ hoặc right-- → tổng số step ≤ n.
<br/><br/>
<strong>2) Chiến thuật quyết định di chuyển con trỏ nào</strong>
Dựa vào KẾT QUẢ so sánh với target:
<ul>
<li>Sum quá nhỏ → cần lớn hơn → <code>left++</code> (lấy giá trị lớn hơn trên sorted).</li>
<li>Sum quá lớn → cần nhỏ hơn → <code>right--</code>.</li>
</ul>
<br/><br/>
<strong>3) Same-direction (read + write pointers)</strong>
Pattern "in-place compact": <code>write</code> pointer chỉ tiến khi gặp phần tử "keep". <code>read</code> pointer luôn tiến. Giữ vùng [0..write-1] = "đã xử lý sạch". O(n) time, O(1) space.
<br/><br/>
<strong>4) k-Sum reduction</strong>
3Sum, 4Sum: cố định k-2 phần tử (n^(k-2) lựa chọn), áp two-pointer cho 2 phần tử còn lại (O(n)). Tổng O(n^(k-1)). 3Sum = O(n²) thay vì O(n³).`,

  theory: `<h3>The "Why" — Khi nào Two Pointers?</h3>
<ul>
  <li>Mảng đã SORT (hoặc có thể sort trước).</li>
  <li>Bài tìm cặp/ba/k phần tử thỏa điều kiện sum/product.</li>
  <li>In-place modification giữ relative order.</li>
  <li>Palindrome / mirror check.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Skip duplicates sai</strong> trong 3Sum/4Sum → kết quả lặp. Phải skip ở MỌI cấp lồng và ở cả 2 phía sau khi tìm thấy match.</li>
  <li><strong>Quên condition <code>left &lt; right</code></strong> → vượt qua nhau, kết quả sai hoặc IndexOutOfBounds.</li>
  <li><strong>Same-direction pointer: tăng nhầm</strong> — write pointer chỉ tăng khi keep; read pointer LUÔN tăng.</li>
  <li><strong>Sort thay đổi index gốc</strong> — nếu bài cần index gốc (vd: Two Sum I), KHÔNG dùng two-pointer thuần. Dùng HashMap.</li>
  <li><strong>Sum overflow</strong> int trên 3Sum lớn — dùng <code>long</code> khi cộng.</li>
</ul>`,

  code: `// Two-pointer converging trên sorted array
int left = 0, right = nums.length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new int[]{left, right};
    if (sum < target) left++;
    else right--;
}`,

  prompts: [
    {
      title: 'Two-pointer logic',
      prompt: `Bài "Two Sum II" mảng đã sort. KHÔNG cho code. Hỏi tôi:
1. Brute O(n²) — vì sao chậm?
2. Tận dụng "đã sort" thế nào? Sum quá nhỏ → tăng pointer nào? Quá lớn → giảm pointer nào?
3. Mỗi bước tôi GUARANTEE loại trừ ÍT NHẤT 1 cặp khỏi search space — chứng minh.
4. Vì sao left không bao giờ vượt right? Dừng khi nào?
5. Mở rộng 3Sum — vẫn O(n²) chứ không O(n³). Vì sao?`
    }
  ],

  takeaways: [
    'Khi nào: array sorted, palindrome, dedup in-place, pair/triplet với sum target.',
    '2 variant: <strong>convergent</strong> (l, r từ 2 đầu thu hẹp) và <strong>same-direction</strong> (slow-fast).',
    'Bài sum target trên sorted array → O(n) thay vì O(n log n) (binary search) hoặc O(n²) (brute).',
    'Skip duplicates pattern: <code>while (l &lt; r &amp;&amp; nums[l] == nums[l+1]) l++</code>.',
    'Pitfall: quên sort trước; off-by-one ở <code>l &lt; r</code> vs <code>l &lt;= r</code>.'
  ],

  problems: [
    {
      id: 'p1', title: 'Two Sum II — Input Array Is Sorted', difficulty: 'Medium', url: LC('two-sum-ii-input-array-is-sorted'),
      hint: 'Converging pointers kinh điển.',
      hints: [
        'Câu hỏi 1: Sum &lt; target — di chuyển pointer nào? Vì sao chỉ có 1 lựa chọn?',
        'Câu hỏi 2: Output là 1-indexed — chú ý +1 khi return.'
      ],
      solution: {
        code: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};  // 1-indexed
        if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Converging two-pointer. Mỗi step loại 1 cặp. KHÔNG dùng HashMap (đề bài constraint O(1) space). Chú ý +1 cho 1-indexed.'
      }
    },
    {
      id: 'p2', title: 'Valid Palindrome', difficulty: 'Easy', url: LC('valid-palindrome'),
      hint: 'Skip non-alphanumeric cả 2 đầu.',
      hints: [
        'Câu hỏi 1: Convert lowercase + skip non-alphanumeric. Khi nào skip mà KHÔNG so sánh?',
        'Câu hỏi 2: Vẫn cần check <code>left &lt; right</code> trong vòng lặp skip — vì sao?'
      ],
      solution: {
        code: `public boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))
            return false;
        l++; r--;
    }
    return true;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Hai inner while skip non-alphanumeric ở cả 2 đầu. Quan trọng: check <code>l &lt; r</code> trong inner while tránh vượt nhau khi toàn ký tự đặc biệt.'
      }
    },
    {
      id: 'p3', title: 'Reverse String', difficulty: 'Easy', url: LC('reverse-string'),
      hint: 'Swap rồi tiến/lùi.',
      hints: [
        'Câu hỏi 1: Hai pointer từ 2 đầu. Swap rồi làm gì?',
        'Câu hỏi 2: Cần khi nào dừng? l &lt; r hay l &lt;= r?'
      ],
      solution: {
        code: `public void reverseString(char[] s) {
    int l = 0, r = s.length - 1;
    while (l < r) {
        char t = s[l]; s[l] = s[r]; s[r] = t;
        l++; r--;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(n/2) = O(n) · Space O(1).',
        explanationVi: 'Two pointers converging. <code>l &lt; r</code> đủ — khi l == r thì không cần swap (giữa). Mỗi step 2 pointer tiến/lùi 1.'
      }
    },
    {
      id: 'p4', title: 'Move Zeroes', difficulty: 'Easy', url: LC('move-zeroes'),
      hint: 'Same-direction write pointer.',
      hints: [
        'Câu hỏi 1: <code>write</code> pointer đánh dấu vị trí non-zero tiếp theo. Khi nào write++?',
        'Câu hỏi 2: Sau khi đặt non-zero, làm sao điền 0 ở phần đuôi?'
      ],
      solution: {
        code: `public void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) nums[write++] = nums[read];
    }
    while (write < nums.length) nums[write++] = 0;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Same-direction. Read luôn tiến, write chỉ tiến khi gặp non-zero. Pha 2: fill 0 cho phần đuôi. Có thể merge bằng swap nhưng 2-pass clearer.'
      }
    },
    {
      id: 'p5', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: LC('remove-duplicates-from-sorted-array'),
      hint: 'Write pointer chỉ tiến khi giá trị mới.',
      hints: [
        'Câu hỏi 1: Mảng đã sort → duplicate liền kề. So sánh <code>nums[read]</code> với <code>nums[write-1]</code> để biết gì?',
        'Câu hỏi 2: write bắt đầu từ 1 hay 0? Vì sao?'
      ],
      solution: {
        code: `public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[read - 1]) nums[write++] = nums[read];
    }
    return write;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Write start = 1 (giữ phần tử đầu). Compare <code>nums[read]</code> với <code>nums[read-1]</code> — vì đã sort, duplicate luôn liền kề. Trả về <code>write</code> = số phần tử unique.'
      }
    },
    {
      id: 'p6', title: 'Squares of a Sorted Array', difficulty: 'Easy', url: LC('squares-of-a-sorted-array'),
      hint: 'Fill từ cuối với bình phương lớn hơn.',
      hints: [
        'Câu hỏi 1: Mảng có cả âm và dương đã sort. Bình phương lớn nhất nằm ở ĐÂU? (Hai đầu, không phải giữa!)',
        'Câu hỏi 2: Fill result từ cuối về đầu, đặt giá trị lớn hơn trước. Tại mỗi step, so sánh <code>square(nums[l])</code> và <code>square(nums[r])</code>.'
      ],
      solution: {
        code: `public int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    int l = 0, r = n - 1, idx = n - 1;
    while (l <= r) {
        int sl = nums[l] * nums[l], sr = nums[r] * nums[r];
        if (sl > sr) { res[idx--] = sl; l++; }
        else         { res[idx--] = sr; r--; }
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n) cho output (extra space O(1)).',
        explanationVi: 'Mảng âm-dương đã sort → bình phương lớn nhất ở 2 đầu. Fill result từ cuối về đầu, mỗi step lấy bình phương lớn hơn rồi advance pointer tương ứng.'
      }
    },
    {
      id: 'p7', title: '3Sum', difficulty: 'Medium', url: LC('3sum'),
      hint: 'Sort, fix i, two-pointer; skip duplicate ở mọi cấp.',
      hints: [
        'Câu hỏi 1: Sort trước. Fix i, dùng two-pointer trên [i+1, n-1] cho sum = -nums[i]. Vì sao tối ưu O(n²)?',
        'Câu hỏi 2: Tránh duplicate triplet — skip ở 3 vị trí: i, l (sau match), r (sau match). Vì sao 3 vị trí?'
      ],
      solution: {
        code: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;          // skip duplicate i
        int l = i + 1, r = nums.length - 1, target = -nums[i];
        while (l < r) {
            int sum = nums[l] + nums[r];
            if (sum == target) {
                res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                while (l < r && nums[l] == nums[l + 1]) l++;     // skip duplicate l
                while (l < r && nums[r] == nums[r - 1]) r--;     // skip duplicate r
                l++; r--;
            } else if (sum < target) l++;
            else r--;
        }
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) · Space O(1) (không tính output).',
        explanationVi: 'Sort → 2Sum cho mỗi i. Skip duplicate ở 3 cấp: (1) skip i nếu trùng prev → tránh triplet trùng do i; (2) skip l/r sau match → tránh triplet trùng do hoán vị.'
      }
    },
    {
      id: 'p8', title: '3Sum Closest', difficulty: 'Medium', url: LC('3sum-closest'),
      hint: 'Track closest sum.',
      hints: [
        'Câu hỏi 1: Same structure as 3Sum, nhưng track sum gần target nhất. Khởi tạo bestDiff = ?',
        'Câu hỏi 2: Skip duplicates có cần không (không trả triplet, chỉ sum)? Yes nhưng chủ yếu cho performance.'
      ],
      solution: {
        code: `public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < nums.length - 2; i++) {
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
            if (sum < target) l++;
            else if (sum > target) r--;
            else return sum;   // exact match
        }
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) · Space O(1).',
        explanationVi: 'Cùng skeleton với 3Sum. Update <code>best</code> khi gặp sum gần target hơn. Early return nếu match exact.'
      }
    },
    {
      id: 'p9', title: 'Container With Most Water', difficulty: 'Medium', url: LC('container-with-most-water'),
      hint: 'Shrink side thấp hơn.',
      hints: [
        'Câu hỏi 1: Area = min(h[l], h[r]) × (r - l). Width giảm dần khi shrink. Height có thể tăng. Side nào shrink?',
        'Câu hỏi 2: Vì sao shrink side THẤP HƠN (không phải cao hơn)? Chứng minh: shrink cao hơn không bao giờ cho area lớn hơn.'
      ],
      solution: {
        code: `public int maxArea(int[] height) {
    int l = 0, r = height.length - 1, best = 0;
    while (l < r) {
        int h = Math.min(height[l], height[r]);
        best = Math.max(best, h * (r - l));
        if (height[l] < height[r]) l++;
        else                        r--;
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Shrink side thấp hơn — vì height bị giới hạn bởi min, và width giảm dần. Giữ side cao có cơ hội gặp side cao hơn bên kia. Greedy invariant.'
      }
    },
    {
      id: 'p10', title: 'Sort Colors (Dutch Flag)', difficulty: 'Medium', url: LC('sort-colors'),
      hint: 'Ba pointers: low, mid, high.',
      hints: [
        'Câu hỏi 1: 3 vùng: [0..low-1] = 0, [low..mid-1] = 1, [high+1..n-1] = 2. mid là pointer đang scan. Invariant trước scan?',
        'Câu hỏi 2: Khi gặp nums[mid] = 0, swap với low, ADVANCE cả low và mid. Khi gặp 2, swap với high, KHÔNG advance mid. Vì sao khác?'
      ],
      solution: {
        code: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low++, mid++);            // 0 vào vùng low; mid tiến vì vừa swap với low (đã scan)
        } else if (nums[mid] == 2) {
            swap(nums, mid, high--);             // 2 vào vùng high; KHÔNG advance mid (chưa scan giá trị mới)
        } else {
            mid++;                                 // 1 đứng yên
        }
    }
}
private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Dutch National Flag (Dijkstra). Khác biệt giữa swap với low vs high: swap với low → low đã scan rồi (vùng [0..low-1] đảm bảo = 0) → mid++. Swap với high → giá trị từ high chưa scan → mid GIỮ NGUYÊN để check lại.'
      }
    },
    {
      id: 'p11', title: 'Trapping Rain Water', difficulty: 'Hard', url: LC('trapping-rain-water'),
      hint: 'Track maxLeft, maxRight.',
      hints: [
        'Câu hỏi 1: Water tại cột i = min(maxLeft, maxRight) - height[i]. Sao biết min trong O(1)?',
        'Câu hỏi 2: Two-pointer trick: nếu maxLeft &lt; maxRight, water tại cột l chỉ phụ thuộc maxLeft → process từ trái. Ngược lại process từ phải.'
      ],
      solution: {
        code: `public int trap(int[] height) {
    int l = 0, r = height.length - 1;
    int maxL = 0, maxR = 0, water = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            if (height[l] >= maxL) maxL = height[l];
            else                    water += maxL - height[l];
            l++;
        } else {
            if (height[r] >= maxR) maxR = height[r];
            else                    water += maxR - height[r];
            r--;
        }
    }
    return water;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Insight: khi <code>height[l] &lt; height[r]</code>, ta CHẮC CHẮN <code>maxR ≥ height[r] &gt; height[l]</code> → water tại l chỉ phụ thuộc maxL. Process side thấp hơn, update max của side đó.'
      }
    },
    {
      id: 'p12', title: '4Sum', difficulty: 'Medium', url: LC('4sum'),
      hint: 'Hai vòng lồng + two-pointer.',
      hints: [
        'Câu hỏi 1: Cùng pattern 3Sum nhưng thêm 1 cấp lồng. Time O(n³).',
        'Câu hỏi 2: Skip duplicate ở 4 cấp (i, j, l, r). Cẩn thận overflow — dùng <code>long</code> cho sum.'
      ],
      solution: {
        code: `public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int l = j + 1, r = n - 1;
            while (l < r) {
                long sum = (long) nums[i] + nums[j] + nums[l] + nums[r];
                if (sum == target) {
                    res.add(Arrays.asList(nums[i], nums[j], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < target) l++;
                else r--;
            }
        }
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n³) · Space O(1).',
        explanationVi: 'Generalize kSum: cố định k-2 phần tử (n^(k-2) lựa chọn), two-pointer cho 2 phần tử cuối. Đối với 4Sum: O(n²) × O(n) = O(n³). Dùng <code>long</code> tránh overflow khi nums lên đến 10^9.'
      }
    }
  ]
}
