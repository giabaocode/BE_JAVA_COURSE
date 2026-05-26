// Pattern 11 — Modified Binary Search
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'bs',
  title: 'Pattern 11 — Modified Binary Search',
  mental: `Binary Search KHÔNG chỉ cho sorted array. Bất cứ khi nào có <strong>monotonic predicate</strong> (TRUE từ một điểm trở đi, hoặc ngược lại), binary search trên <strong>không gian đáp án</strong>.
<br/><br/>
Template: tìm "x nhỏ nhất sao cho <code>predicate(x)</code> đúng".`,

  under: `<h3>First Principles</h3>
<strong>1) Bug kinh điển: integer overflow</strong>
<code>mid = (lo + hi) / 2</code> overflow khi lo + hi &gt; INT_MAX. Dùng <code>mid = lo + (hi - lo) / 2</code> an toàn.
<br/><br/>
<strong>2) <code>lo &lt; hi</code> vs <code>lo &lt;= hi</code></strong>
Khi tìm "smallest x s.t. predicate", dùng <code>lo &lt; hi</code> để thu hẹp đến lo = hi. Lo lúc đó là answer. <code>lo &lt;= hi</code> phổ biến cho exact-search.
<br/><br/>
<strong>3) Boundary update</strong>
<ul>
<li>predicate(mid) TRUE → có thể là answer hoặc nhỏ hơn → <code>hi = mid</code>.</li>
<li>predicate(mid) FALSE → cần lớn hơn → <code>lo = mid + 1</code>.</li>
</ul>
LƯU Ý: <code>hi = mid</code> KHÔNG <code>hi = mid - 1</code> — vì mid có thể là answer.
<br/><br/>
<strong>4) Infinite loop tránh</strong>
Nếu <code>mid</code> luôn bằng <code>lo</code> (khi <code>hi = lo + 1</code>) và update <code>lo = mid</code> → infinite. Convention: với <code>lo &lt; hi</code>, dùng <code>mid = lo + (hi - lo) / 2</code> (floor). Update <code>lo = mid + 1</code> hoặc <code>hi = mid</code>.
<br/><br/>
<strong>5) Binary search trên ANSWER SPACE</strong>
Bài "Koko Eating Bananas": brute force thử speed 1, 2, 3, ... → O(max × n). Binary search trên speed [1, max]: monotonic — speed lớn hơn = nhanh hơn → predicate "ăn xong trong h giờ" là monotonic. O(n log max).
<br/><br/>
<strong>6) Find first/last occurrence</strong>
2 binary search: lower bound (smallest x ≥ target) + upper bound (smallest x &gt; target). Index của last occurrence = upper - 1.`,

  theory: `<h3>The "Why" — Khi nào Modified BS?</h3>
<ul>
  <li>Mảng sorted hoặc rotated.</li>
  <li>"Min/max value sao cho X possible" — answer space monotonic.</li>
  <li>Phải optimal hơn O(n) — gợi ý O(log n).</li>
  <li>Sorted 2D matrix.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Overflow</strong>: <code>(lo + hi) / 2</code> → bug ẩn với input lớn.</li>
  <li><strong>Infinite loop</strong>: condition sai, mid không tiến.</li>
  <li><strong>Off-by-one boundary</strong>: hi = mid hay mid - 1? lo &lt;= hi hay &lt;? Cần consistent template.</li>
  <li><strong>Predicate KHÔNG monotonic</strong> → binary search sai. Verify trước.</li>
  <li><strong>Quên handle empty/single element</strong>.</li>
</ul>`,

  code: `// Template: tìm smallest x s.t. predicate(x) TRUE
int lo = 0, hi = n;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (predicate(mid)) hi = mid;       // có thể là answer
    else lo = mid + 1;
}
return lo;`,

  prompts: [
    {
      title: 'Binary search trên answer space',
      prompt: `Bài "Koko Eating Bananas". KHÔNG cho code. Hỏi tôi:
1. Brute thử mọi speed 1..max. Vì sao chậm?
2. Speed x đủ ăn trong h giờ ⇒ speed x+1 cũng đủ. Monotonic?
3. Answer space sorted theo "feasibility" → binary search!
4. Predicate: cho speed x, tính số giờ ăn xong → so với h.
5. lo, hi khởi tạo? (lo=1, hi=max(piles).)`
    }
  ],

  problems: [
    {
      id: 'p1', title: 'Binary Search', difficulty: 'Easy', url: LC('binary-search'),
      hint: 'Template warm-up.',
      hints: [
        'Câu hỏi 1: <code>lo &lt;= hi</code>: tìm exact. Trả index target hoặc -1.',
        'Câu hỏi 2: Khi <code>nums[mid] &lt; target</code>, update lo hay hi?'
      ],
      solution: {
        code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else                     hi = mid - 1;
    }
    return -1;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'Exact search template. <code>lo &lt;= hi</code> + <code>hi = mid - 1</code> / <code>lo = mid + 1</code>.'
      }
    },
    {
      id: 'p2', title: 'First Bad Version', difficulty: 'Easy', url: LC('first-bad-version'),
      hint: 'Predicate style.',
      hints: [
        'Câu hỏi 1: Predicate "isBadVersion" monotonic — TRUE từ điểm bad đầu trở đi. Tìm smallest TRUE.',
        'Câu hỏi 2: <code>hi = mid</code> không phải <code>mid - 1</code> — vì sao?'
      ],
      solution: {
        code: `public int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (isBadVersion(mid)) hi = mid;
        else                    lo = mid + 1;
    }
    return lo;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'Predicate template. <code>hi = mid</code> vì mid có thể là answer.'
      }
    },
    {
      id: 'p3', title: 'Search Insert Position', difficulty: 'Easy', url: LC('search-insert-position'),
      hint: 'Lower-bound.',
      hints: [
        'Câu hỏi 1: Tìm smallest index i s.t. nums[i] ≥ target.',
        'Câu hỏi 2: Predicate "nums[i] ≥ target" monotonic.'
      ],
      solution: {
        code: `public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid;
        else                      lo = mid + 1;
    }
    return lo;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'Lower bound. Khi loop dừng, lo = first index có nums[i] ≥ target (hoặc length nếu không có).'
      }
    },
    {
      id: 'p4', title: 'Find First and Last Position of Element', difficulty: 'Medium', url: LC('find-first-and-last-position-of-element-in-sorted-array'),
      hint: 'Two binary searches.',
      hints: [
        'Câu hỏi 1: Lower bound = first index nums[i] ≥ target. Upper bound = first index nums[i] &gt; target.',
        'Câu hỏi 2: First occurrence = lower; last occurrence = upper - 1. Edge case: lower out of range hoặc nums[lower] != target → not found.'
      ],
      solution: {
        code: `public int[] searchRange(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
    int last = lowerBound(nums, target + 1) - 1;
    return new int[]{first, last};
}

private int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid;
        else                      lo = mid + 1;
    }
    return lo;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: '2 lower bound calls: 1 cho target, 1 cho target+1. Tinh tế tránh duplicate code.'
      }
    },
    {
      id: 'p5', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: LC('search-in-rotated-sorted-array'),
      hint: 'Half nào đang sorted.',
      hints: [
        'Câu hỏi 1: Tại mid, ÍT NHẤT 1 half [lo..mid] hoặc [mid..hi] vẫn sorted. Determine nào dựa vào so sánh nums[lo] và nums[mid].',
        'Câu hỏi 2: Nếu half sorted chứa target → search nửa đó. Ngược lại nửa kia.'
      ],
      solution: {
        code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            // Left half sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else                                            lo = mid + 1;
        } else {
            // Right half sorted
            if (nums[mid] < target && target <= nums[hi])   lo = mid + 1;
            else                                              hi = mid - 1;
        }
    }
    return -1;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'Rotation point chia mảng thành 2 sorted halves. Determine half nào sorted tại mid → check target có trong đó không → narrow.'
      }
    },
    {
      id: 'p6', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: LC('find-minimum-in-rotated-sorted-array'),
      hint: 'So sánh mid với hi.',
      hints: [
        'Câu hỏi 1: Min nằm ở "break point". So sánh <code>nums[mid]</code> với <code>nums[hi]</code> determine min ở half nào.',
        'Câu hỏi 2: <code>nums[mid] &gt; nums[hi]</code> → min ở right; ngược lại left (kể cả mid).'
      ],
      solution: {
        code: `public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else                       hi = mid;
    }
    return nums[lo];
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'So sánh mid với hi (KHÔNG lo — vì lo có thể đã pass rotation point). nums[mid] &gt; nums[hi] → rotation ở right → min ở right.'
      }
    },
    {
      id: 'p7', title: 'Find Peak Element', difficulty: 'Medium', url: LC('find-peak-element'),
      hint: 'Move toward larger neighbor.',
      hints: [
        'Câu hỏi 1: <code>nums[mid] &lt; nums[mid+1]</code> → peak ở RIGHT (đi lên ắt có peak). Ngược lại LEFT.',
        'Câu hỏi 2: <code>nums[-1] = nums[n] = -∞</code> đảm bảo peak luôn tồn tại.'
      ],
      solution: {
        code: `public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else                            hi = mid;
    }
    return lo;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'Greedy "đi lên" — nếu mid &lt; mid+1, leo sang phải; ngược lại trái. Peak luôn tồn tại vì boundary = -∞.'
      }
    },
    {
      id: 'p8', title: 'Koko Eating Bananas', difficulty: 'Medium', url: LC('koko-eating-bananas'),
      hint: 'Binary search trên speed.',
      hints: [
        'Câu hỏi 1: Speed monotonic — speed lớn → giờ ít. Predicate "ăn xong trong h giờ" monotonic. BS trên [1, max(piles)].',
        'Câu hỏi 2: Compute hours cho speed s: <code>sum của ceil(pile / s)</code>.'
      ],
      solution: {
        code: `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, mid, h)) hi = mid;
        else                            lo = mid + 1;
    }
    return lo;
}

private boolean canFinish(int[] piles, int speed, int h) {
    long hours = 0;
    for (int p : piles) hours += (p + speed - 1) / speed;   // ceil
    return hours <= h;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log max(piles)) · Space O(1).',
        explanationVi: 'BS trên speed space. Predicate "canFinish" monotonic → tìm smallest speed feasible. Ceil bằng <code>(p + s - 1) / s</code>.'
      }
    },
    {
      id: 'p9', title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', url: LC('capacity-to-ship-packages-within-d-days'),
      hint: 'Binary search trên capacity.',
      hints: [
        'Câu hỏi 1: BS trên capacity [max(weights), sum(weights)]. Predicate "ship được trong d days".',
        'Câu hỏi 2: lo = max(weights) vì capacity phải đủ chứa weight lớn nhất.'
      ],
      solution: {
        code: `public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { lo = Math.max(lo, w); hi += w; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, mid, days)) hi = mid;
        else                              lo = mid + 1;
    }
    return lo;
}

private boolean canShip(int[] weights, int cap, int days) {
    int needed = 1, curr = 0;
    for (int w : weights) {
        if (curr + w > cap) { needed++; curr = w; }
        else curr += w;
    }
    return needed <= days;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log sum(weights)) · Space O(1).',
        explanationVi: 'BS capacity [max(w), sum(w)]. Predicate: greedy ship — pack as much as possible mỗi day.'
      }
    },
    {
      id: 'p10', title: 'Split Array Largest Sum', difficulty: 'Hard', url: LC('split-array-largest-sum'),
      hint: 'Binary search trên max sum.',
      hints: [
        'Câu hỏi 1: BS trên "largest sum per part" [max(nums), sum(nums)]. Predicate "split được thành ≤ k parts".',
        'Câu hỏi 2: Cùng skeleton với Ship Packages.'
      ],
      solution: {
        code: `public int splitArray(int[] nums, int k) {
    int lo = 0, hi = 0;
    for (int n : nums) { lo = Math.max(lo, n); hi += n; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canSplit(nums, mid, k)) hi = mid;
        else                          lo = mid + 1;
    }
    return lo;
}

private boolean canSplit(int[] nums, int maxSum, int k) {
    int parts = 1, curr = 0;
    for (int n : nums) {
        if (curr + n > maxSum) { parts++; curr = n; }
        else curr += n;
    }
    return parts <= k;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log sum(nums)) · Space O(1).',
        explanationVi: 'Cùng pattern Ship Packages. BS trên answer space (max sum), predicate monotonic.'
      }
    },
    {
      id: 'p11', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', url: LC('median-of-two-sorted-arrays'),
      hint: 'Partition technique.',
      hints: [
        'Câu hỏi 1: O(log min(m,n)). Partition: chia 2 mảng thành left half + right half sao cho |left| = |right|.',
        'Câu hỏi 2: Valid partition: <code>maxLeft1 ≤ minRight2 && maxLeft2 ≤ minRight1</code>.'
      ],
      solution: {
        code: `public double findMedianSortedArrays(int[] a, int[] b) {
    if (a.length > b.length) return findMedianSortedArrays(b, a);
    int m = a.length, n = b.length;
    int lo = 0, hi = m;
    while (lo <= hi) {
        int i = (lo + hi) / 2;
        int j = (m + n + 1) / 2 - i;
        int maxL1 = i == 0 ? Integer.MIN_VALUE : a[i - 1];
        int minR1 = i == m ? Integer.MAX_VALUE : a[i];
        int maxL2 = j == 0 ? Integer.MIN_VALUE : b[j - 1];
        int minR2 = j == n ? Integer.MAX_VALUE : b[j];
        if (maxL1 <= minR2 && maxL2 <= minR1) {
            if ((m + n) % 2 == 1) return Math.max(maxL1, maxL2);
            return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2.0;
        }
        if (maxL1 > minR2) hi = i - 1;
        else                lo = i + 1;
    }
    return 0;
}`,
        lang: 'java',
        complexityVi: 'Time O(log min(m,n)) · Space O(1).',
        explanationVi: 'BS partition trên mảng NGẮN HƠN. Valid partition: cross constraint maxL1 ≤ minR2 và maxL2 ≤ minR1. Median tính từ boundary values.'
      }
    },
    {
      id: 'p12', title: 'Search a 2D Matrix', difficulty: 'Medium', url: LC('search-a-2d-matrix'),
      hint: 'Flatten thành sorted 1D.',
      hints: [
        'Câu hỏi 1: Matrix mxn sorted row-major. Coi như 1D array size m*n. Map index ↔ (row, col).',
        'Câu hỏi 2: <code>row = idx / n, col = idx % n</code>.'
      ],
      solution: {
        code: `public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        if (val < target) lo = mid + 1;
        else               hi = mid - 1;
    }
    return false;
}`,
        lang: 'java',
        complexityVi: 'Time O(log(m × n)) · Space O(1).',
        explanationVi: 'Coi matrix như 1D array. Index map: row = idx / n, col = idx % n. BS classic.'
      }
    }
  ]
}
