// Pattern 16 — Dynamic Programming (1D)
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'dp1',
  title: 'Pattern 16 — Dynamic Programming (1D)',
  mental: `DP = <strong>brute force recursion + memoization</strong>. 4 bước:
<ol>
<li>Định nghĩa state: <code>dp[i]</code> nghĩa là gì?</li>
<li>Transition: <code>dp[i]</code> tính từ các state nào?</li>
<li>Base case: <code>dp[0]</code>, <code>dp[1]</code> = ?</li>
<li>Order: bottom-up (tabulation) hay top-down (memoization)?</li>
</ol>
1D state phổ biến: <code>dp[i]</code> = "answer best ending at i" hoặc "answer best using elements 0..i".`,

  under: `<h3>First Principles</h3>
<strong>1) Recursion → DP</strong>
DP áp dụng khi recursion có OVERLAPPING SUBPROBLEMS (tính lại nhiều lần cùng state). Vẽ recursion tree, đếm số lần subproblem xuất hiện → nếu &gt; 1 → DP win.
<br/><br/>
<strong>2) Tabulation vs Memoization</strong>
Cùng complexity, khác cách code.
<ul>
<li><strong>Tabulation</strong>: iterative loop, KHÔNG stack overflow, dễ optimize space.</li>
<li><strong>Memoization</strong>: recursive, dễ viết theo definition, có overhead recursion.</li>
</ul>
Production prefer tabulation.
<br/><br/>
<strong>3) Space optimization O(1)</strong>
Nếu <code>dp[i]</code> chỉ phụ thuộc <code>dp[i-1]</code> và <code>dp[i-2]</code> → 2 biến đủ. KHÔNG cần mảng. Vd House Robber.
<br/><br/>
<strong>4) State design — câu hỏi quan trọng nhất</strong>
"<code>dp[i]</code> nghĩa là gì TIẾNG VIỆT?" Nếu không trả lời được rõ ràng → state design sai.
<br/><br/>
<strong>5) Transition direction</strong>
Forward DP: <code>dp[i]</code> contribute cho <code>dp[j&gt;i]</code>. Backward: <code>dp[i]</code> tính từ <code>dp[j&lt;i]</code>. Hầu hết bài backward.
<br/><br/>
<strong>6) Initial values</strong>
Base case + sentinel cho out-of-bounds. Vd <code>dp[-1]</code> coi như 0 (Kadane).`,

  theory: `<h3>The "Why" — Khi nào DP?</h3>
<ul>
  <li>Optimization problem (min/max/count).</li>
  <li>Overlapping subproblems trong brute recursion.</li>
  <li>Optimal substructure — answer global từ answer subproblem.</li>
  <li>KHÔNG dùng DP cho: greedy work, brute đủ nhanh, no overlap.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>State sai</strong>: <code>dp[i]</code> KHÔNG rõ ràng → transition sai, debug khổ.</li>
  <li><strong>Off-by-one base case</strong>: dp[0] cho empty hay first element?</li>
  <li><strong>Forget space optimization</strong> khi chỉ cần 2 prev → tốn O(n) không cần thiết.</li>
  <li><strong>Memoization với HashMap on int</strong> chậm hơn array. Dùng <code>int[]</code> với sentinel.</li>
  <li><strong>Stack overflow memoization</strong> với input lớn → convert tabulation.</li>
</ul>`,

  code: `// House Robber: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
int prev2 = 0, prev1 = 0;
for (int n : nums) {
    int curr = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = curr;
}
return prev1;`,

  prompts: [
    {
      title: 'Định nghĩa state cho DP',
      prompt: `Cho bài DP mới. KHÔNG cho code. Hỏi tôi:
1. Brute recursion được không? Cấu trúc?
2. Có overlapping subproblems? Vẽ tree với input nhỏ.
3. State của recursion = param gì? Đó là chiều của dp[].
4. <code>dp[i]</code> CÓ NGHĨA gì TIẾNG VIỆT? (Quan trọng nhất!)
5. Transition <code>dp[i]</code> từ dp[i-?]?
6. Base case dp[0]? dp[1]?
7. Space optimize được không?
Áp dụng cho Coin Change.`
    }
  ],

  problems: [
    {
      id: 'p1', title: 'Climbing Stairs', difficulty: 'Easy', url: LC('climbing-stairs'),
      hint: 'Fibonacci.',
      hints: [
        'Câu hỏi 1: Đến bậc i: từ i-1 (bước 1) hoặc i-2 (bước 2). dp[i] = dp[i-1] + dp[i-2].',
        'Câu hỏi 2: Space O(1) với 2 biến.'
      ],
      solution: {
        code: `public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Fibonacci variant. dp[i] = dp[i-1] + dp[i-2]. Space O(1) với 2 biến.'
      }
    },
    {
      id: 'p2', title: 'House Robber', difficulty: 'Medium', url: LC('house-robber'),
      hint: 'max(skip, take + dp[i-2]).',
      hints: [
        'Câu hỏi 1: Tại nhà i: skip (lấy dp[i-1]) hoặc rob (lấy dp[i-2] + nums[i]).',
        'Câu hỏi 2: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).'
      ],
      solution: {
        code: `public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int n : nums) {
        int curr = Math.max(prev1, prev2 + n);
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Tại mỗi nhà: skip hoặc rob. Skip → dp[i-1]. Rob → dp[i-2] + nums[i] (vì nhà liền kề không được).'
      }
    },
    {
      id: 'p3', title: 'House Robber II', difficulty: 'Medium', url: LC('house-robber-ii'),
      hint: 'Run twice: skip first vs last.',
      hints: [
        'Câu hỏi 1: Vòng tròn — nhà đầu và cuối liền kề. Tách 2 case: skip đầu, hoặc skip cuối.',
        'Câu hỏi 2: Mỗi case = linear House Robber I.'
      ],
      solution: {
        code: `public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    return Math.max(robLinear(nums, 0, nums.length - 2),
                    robLinear(nums, 1, nums.length - 1));
}

private int robLinear(int[] nums, int lo, int hi) {
    int prev2 = 0, prev1 = 0;
    for (int i = lo; i <= hi; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Vòng tròn: chia 2 case (skip đầu hoặc skip cuối). Mỗi case linear DP. Max của 2.'
      }
    },
    {
      id: 'p4', title: 'Min Cost Climbing Stairs', difficulty: 'Easy', url: LC('min-cost-climbing-stairs'),
      hint: 'dp[i] = cost[i] + min(dp[i-1], dp[i-2]).',
      hints: [
        'Câu hỏi 1: dp[i] = min cost ĐẾN bậc i. Transition?',
        'Câu hỏi 2: Có thể start từ bậc 0 hoặc 1. End: bậc n (sau cost cuối).'
      ],
      solution: {
        code: `public int minCostClimbingStairs(int[] cost) {
    int prev2 = 0, prev1 = 0;
    for (int i = 2; i <= cost.length; i++) {
        int curr = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'dp[i] = min cost đến bậc i (trên đỉnh). Từ i-1 (cost[i-1]) hoặc i-2 (cost[i-2]).'
      }
    },
    {
      id: 'p5', title: 'Maximum Subarray (Kadane)', difficulty: 'Easy', url: LC('maximum-subarray'),
      hint: 'dp[i] = max(nums[i], dp[i-1]+nums[i]).',
      hints: [
        'Câu hỏi 1: dp[i] = max subarray ENDING AT i. Continue or restart?',
        'Câu hỏi 2: dp[i] = max(nums[i], dp[i-1] + nums[i]). Track global max.'
      ],
      solution: {
        code: `public int maxSubArray(int[] nums) {
    int curr = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curr = Math.max(nums[i], curr + nums[i]);
        best = Math.max(best, curr);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Kadane. Tại mỗi i: tiếp tục (curr + nums[i]) hoặc restart (nums[i]). Global max.'
      }
    },
    {
      id: 'p6', title: 'Maximum Product Subarray', difficulty: 'Medium', url: LC('maximum-product-subarray'),
      hint: 'Track cả max và min (vì âm flip).',
      hints: [
        'Câu hỏi 1: Khác Kadane: số âm × số âm = dương lớn. Phải track CẢ max và min.',
        'Câu hỏi 2: Khi nums[i] &lt; 0, swap max/min trước khi update.'
      ],
      solution: {
        code: `public int maxProduct(int[] nums) {
    int max = nums[0], min = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] < 0) { int t = max; max = min; min = t; }
        max = Math.max(nums[i], max * nums[i]);
        min = Math.min(nums[i], min * nums[i]);
        best = Math.max(best, max);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Track max + min (vì âm flip). Swap khi nums[i] &lt; 0. Cập nhật cả 2 song song.'
      }
    },
    {
      id: 'p7', title: 'Coin Change', difficulty: 'Medium', url: LC('coin-change'),
      hint: 'dp[a] = min over coins of dp[a-coin]+1.',
      hints: [
        'Câu hỏi 1: dp[a] = min coins để có amount a. dp[0] = 0.',
        'Câu hỏi 2: Try mỗi coin: dp[a] = min(dp[a], dp[a-coin] + 1) nếu coin ≤ a.'
      ],
      solution: {
        code: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        lang: 'java',
        complexityVi: 'Time O(amount × coins) · Space O(amount).',
        explanationVi: 'Unbounded knapsack pattern. Sentinel <code>amount + 1</code> = "impossible". Cuối: check để return -1.'
      }
    },
    {
      id: 'p8', title: 'Word Break', difficulty: 'Medium', url: LC('word-break'),
      hint: 'dp[i] = OR over j<i of dp[j] AND dict.contains(s[j..i]).',
      hints: [
        'Câu hỏi 1: dp[i] = true nếu s[0..i-1] có thể chia thành dict words.',
        'Câu hỏi 2: Try every split point j: dp[i] = OR dp[j] && s[j..i] in dict.'
      ],
      solution: {
        code: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}`,
        lang: 'java',
        complexityVi: 'Time O(n² × L) · Space O(n).',
        explanationVi: 'dp[i] = "prefix length i breakable". Try mọi split j; nếu dp[j] && s[j..i] in dict → dp[i] = true.'
      }
    },
    {
      id: 'p9', title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: LC('longest-increasing-subsequence'),
      hint: 'O(n²) hoặc patience O(n log n).',
      hints: [
        'Câu hỏi 1: O(n²) DP: dp[i] = LIS ending at i. dp[i] = max(dp[j]) + 1 với j &lt; i và nums[j] &lt; nums[i].',
        'Câu hỏi 2: O(n log n): "patience sort" — maintain <code>tails</code> array, binary search.'
      ],
      solution: {
        code: `public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int n : nums) {
        int idx = Collections.binarySearch(tails, n);
        if (idx < 0) idx = -(idx + 1);
        if (idx == tails.size()) tails.add(n);
        else tails.set(idx, n);
    }
    return tails.size();
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n).',
        explanationVi: 'Patience sort. <code>tails[i]</code> = smallest tail của LIS độ dài i+1. Binary search position. KHÔNG phải LIS thật nhưng size đúng.'
      }
    },
    {
      id: 'p10', title: 'Partition Equal Subset Sum', difficulty: 'Medium', url: LC('partition-equal-subset-sum'),
      hint: '0/1 knapsack.',
      hints: [
        'Câu hỏi 1: Tìm subset có sum = total/2. Đây là 0/1 knapsack với capacity = total/2.',
        'Câu hỏi 2: dp[s] = có thể đạt sum s không? Iterate ngược để tránh dùng lại.'
      ],
      solution: {
        code: `public boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int n : nums) {
        for (int s = target; s >= n; s--) {
            dp[s] = dp[s] || dp[s - n];
        }
    }
    return dp[target];
}`,
        lang: 'java',
        complexityVi: 'Time O(n × total) · Space O(total).',
        explanationVi: '0/1 knapsack — iterate INVERSE để tránh dùng lại nums[i]. dp[s] = true nếu có subset sum = s.'
      }
    },
    {
      id: 'p11', title: 'Decode Ways', difficulty: 'Medium', url: LC('decode-ways'),
      hint: 'dp[i] từ 1-digit và 2-digit cut.',
      hints: [
        'Câu hỏi 1: dp[i] = ways decode s[0..i-1]. Tại i: lấy 1 char (nếu != "0") hoặc 2 char (nếu valid 10-26).',
        'Câu hỏi 2: Base: dp[0] = 1 (empty has 1 way). Watch "0" cases.'
      ],
      solution: {
        code: `public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) == '0' ? 0 : 1;
    for (int i = 2; i <= n; i++) {
        int one = s.charAt(i - 1) - '0';
        int two = Integer.parseInt(s.substring(i - 2, i));
        if (one >= 1) dp[i] += dp[i - 1];
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n) (có thể O(1)).',
        explanationVi: 'dp[i] = dp[i-1] (nếu 1-digit valid) + dp[i-2] (nếu 2-digit valid 10-26). Cẩn thận "0".'
      }
    },
    {
      id: 'p12', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: LC('best-time-to-buy-and-sell-stock'),
      hint: 'Track min so far.',
      hints: [
        'Câu hỏi 1: Mỗi ngày: tính profit nếu bán hôm đó = giá hôm đó - min giá so far.',
        'Câu hỏi 2: Track min đến i, update max profit.'
      ],
      solution: {
        code: `public int maxProfit(int[] prices) {
    int min = prices[0], best = 0;
    for (int i = 1; i < prices.length; i++) {
        best = Math.max(best, prices[i] - min);
        min = Math.min(min, prices[i]);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Track min giá so far. Mỗi ngày tính profit hypothetical (bán hôm đó). Max profit toàn cục.'
      }
    }
  ]
}
