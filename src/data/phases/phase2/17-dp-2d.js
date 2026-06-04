// Pattern 17 — Dynamic Programming (2D)
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'dp2',
  title: 'Pattern 17 — Dynamic Programming (2D)',
  mental: `2D DP xuất hiện khi:
<ul>
<li>Lưới (grid path counting/sum).</li>
<li>Hai chuỗi (LCS, edit distance).</li>
<li>Interval DP (burst balloons).</li>
<li>Knapsack với 2 chiều (item + capacity).</li>
</ul>
<code>dp[i][j]</code> phụ thuộc thường vào <code>dp[i-1][j]</code>, <code>dp[i][j-1]</code>, <code>dp[i-1][j-1]</code>.`,

  under: `<h3>First Principles</h3>
<strong>1) Space optimization 2D → 1D</strong>
Nếu <code>dp[i][j]</code> chỉ phụ thuộc <code>dp[i-1][*]</code>, chỉ cần 2 hàng (prev, curr) → O(min(m,n)) space.
<br/><br/>
<strong>2) Interval DP — chọn last, không first</strong>
Bài Burst Balloons: chọn "phần tử CUỐI" trong khoảng [i..j] thay vì phần tử đầu. Tránh bug "đã burst rồi mà vẫn tính neighbor". Đây là pattern tinh tế.
<br/><br/>
<strong>3) String DP indexing convention</strong>
<code>dp[i][j]</code> = answer cho prefix <code>s[0..i-1]</code> và <code>t[0..j-1]</code>. <strong>1-indexed</strong> giúp base case sạch (<code>dp[0][j]</code> = empty s, etc.).
<br/><br/>
<strong>4) Knapsack patterns</strong>
<ul>
<li>0/1 knapsack: mỗi item 1 lần. Iterate INVERSE.</li>
<li>Unbounded knapsack: mỗi item nhiều lần. Iterate FORWARD.</li>
</ul>
<br/><br/>
<strong>5) Stock problems with state</strong>
DP state = (day, transactions used, holding?). 2D-3D DP. Pattern phổ biến cho "Buy/Sell with constraints".
<br/><br/>
<strong>6) Regex DP — careful with "*"</strong>
"*" match 0 hoặc nhiều ký tự trước. dp[i][j] phụ thuộc: (1) dp[i][j-2] (match 0) hoặc (2) dp[i-1][j] && char match (match thêm).`,

  theory: `<h3>The "Why" — 2D DP signals?</h3>
<ul>
  <li>2 input strings — gần như chắc chắn 2D DP.</li>
  <li>Grid traversal — m × n state.</li>
  <li>Interval với 2 endpoints.</li>
  <li>State machine với ≥ 2 dimensions.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Confuse <code>dp[i][j]</code> semantics</strong>: prefix lengths hay indices? 1-indexed hay 0-indexed?</li>
  <li><strong>Base case sai</strong>: <code>dp[0][j]</code> và <code>dp[i][0]</code> thường có meaning khác — kiểm tra kỹ.</li>
  <li><strong>Quên space optimize</strong> → O(mn) RAM cho bài 1M × 1M.</li>
  <li><strong>Iterate sai chiều</strong>: 0/1 knapsack iterate inverse; unbounded forward. Confuse → result sai.</li>
  <li><strong>Interval DP iterate sai</strong>: phải tăng length, không indices.</li>
</ul>`,

  code: `// LCS template
int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (a.charAt(i-1) == b.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + 1;
        else                                  dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
}
return dp[m][n];`,

  prompts: [
    {
      title: 'Suy luận 2D DP',
      prompt: `Bài Edit Distance. KHÔNG cho code. Hỏi tôi:
1. dp[i][j] nghĩa là gì? (Hint: edit distance giữa a[0..i-1] và b[0..j-1])
2. Khi a[i-1] == b[j-1]: operation = 0; dp[i][j] = ?
3. Khác nhau: 3 lựa chọn (insert, delete, replace) tương ứng dp[i-1][j], dp[i][j-1], dp[i-1][j-1]?
4. Base case dp[0][j]? dp[i][0]? (Số operation khi 1 chuỗi rỗng)
5. Space optimize O(min(m,n))?`
    }
  ],

  takeaways: [
    'Pattern: subproblem indexed bởi 2 chiều — thường 2 strings (LCS, edit distance) hoặc grid (i, j).',
    'State design: <strong>số thông số tự do</strong> của subproblem = số chiều. Liệt kê hết trước khi viết.',
    'Examples: LCS, edit distance, knapsack 0/1, unique paths, regex match, longest palindromic substring.',
    'Order traversal quan trọng: từ <code>dp[0][0]</code> ra hay từ <code>dp[n][m]</code> vào? Depends transition direction.',
    'Space optimize: nếu <code>dp[i][j]</code> chỉ phụ thuộc row <code>i-1</code> → rolling 2 rows → O(min(m,n)).',
    'Pitfall: dimension off-by-one (length vs index); transition formula thiếu case; init row/col 0 sai.'
  ],

  problems: [
    {
      id: 'p1', title: 'Unique Paths', difficulty: 'Medium', url: LC('unique-paths'),
      hint: 'dp[i][j] = dp[i-1][j] + dp[i][j-1].',
      hints: [
        'Câu hỏi 1: Move chỉ right hoặc down. dp[i][j] = số way đến (i,j).',
        'Câu hỏi 2: dp[i][j] = dp[i-1][j] + dp[i][j-1]. Base: dp[0][j] = dp[i][0] = 1.'
      ],
      solution: {
        code: `public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(n).',
        explanationVi: 'Space-optimized 1D. dp[j] (new) = dp[j] (old, top) + dp[j-1] (left). Init = 1 (first row).'
      }
    },
    {
      id: 'p2', title: 'Unique Paths II (obstacles)', difficulty: 'Medium', url: LC('unique-paths-ii'),
      hint: 'Skip ô có obstacle.',
      hints: [
        'Câu hỏi 1: Như Unique Paths nhưng ô obstacle → dp = 0.',
        'Câu hỏi 2: Edge case: start obstacle → 0 paths.'
      ],
      solution: {
        code: `public int uniquePathsWithObstacles(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = grid[0][0] == 0 ? 1 : 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) dp[j] = 0;
            else if (j > 0) dp[j] += dp[j - 1];
        }
    return dp[n - 1];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(n).',
        explanationVi: 'Same 1D, set dp[j] = 0 khi obstacle. j == 0: dp[0] giữ nguyên (chỉ from top).'
      }
    },
    {
      id: 'p3', title: 'Minimum Path Sum', difficulty: 'Medium', url: LC('minimum-path-sum'),
      hint: 'dp[i][j] = grid + min(top, left).',
      hints: [
        'Câu hỏi 1: Min sum path. dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).',
        'Câu hỏi 2: Edge: first row = sum prefix; first col = sum prefix.'
      ],
      solution: {
        code: `public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[j] = dp[j - 1] + grid[0][j];
    for (int i = 1; i < m; i++) {
        dp[0] += grid[i][0];
        for (int j = 1; j < n; j++)
            dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
    }
    return dp[n - 1];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(n).',
        explanationVi: 'In-place 1D. dp[j] (new) = grid[i][j] + min(dp[j] old (top), dp[j-1] (left)).'
      }
    },
    {
      id: 'p4', title: 'Longest Common Subsequence', difficulty: 'Medium', url: LC('longest-common-subsequence'),
      hint: 'Template trên.',
      hints: [
        'Câu hỏi 1: dp[i][j] = LCS của text1[0..i-1] và text2[0..j-1].',
        'Câu hỏi 2: Match: dp[i-1][j-1] + 1. Mismatch: max(dp[i-1][j], dp[i][j-1]).'
      ],
      solution: {
        code: `public int longestCommonSubsequence(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
            else                                       dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    return dp[m][n];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n) (có thể O(min)).',
        explanationVi: 'Classic LCS. Base dp[0][j] = dp[i][0] = 0 (empty). Match → extend diagonal. Mismatch → max của 2 hướng.'
      }
    },
    {
      id: 'p5', title: 'Edit Distance', difficulty: 'Medium', url: LC('edit-distance'),
      hint: '3 operation: insert/delete/replace.',
      hints: [
        'Câu hỏi 1: dp[i][j] = edit distance a[0..i-1] → b[0..j-1].',
        'Câu hỏi 2: Match: dp[i-1][j-1]. Mismatch: 1 + min(insert dp[i][j-1], delete dp[i-1][j], replace dp[i-1][j-1]).'
      ],
      solution: {
        code: `public int minDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
        }
    return dp[m][n];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'Base: dp[i][0] = i (xóa i chars), dp[0][j] = j (insert j chars). 3 operations tại mismatch.'
      }
    },
    {
      id: 'p6', title: 'Distinct Subsequences', difficulty: 'Hard', url: LC('distinct-subsequences'),
      hint: 'dp[i][j] = dp[i-1][j-1] + dp[i-1][j] khi match.',
      hints: [
        'Câu hỏi 1: dp[i][j] = số ways form t[0..j-1] từ subsequence của s[0..i-1].',
        'Câu hỏi 2: Match s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] (dùng) + dp[i-1][j] (skip s[i-1]). Mismatch: chỉ dp[i-1][j].'
      ],
      solution: {
        code: `public int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = 1;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i - 1][j];   // skip s[i-1]
            if (s.charAt(i - 1) == t.charAt(j - 1)) dp[i][j] += dp[i - 1][j - 1];
        }
    return dp[m][n];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'dp[i][0] = 1 (empty t có 1 way — không lấy gì). Match: 2 choices (dùng hoặc skip).'
      }
    },
    {
      id: 'p7', title: 'Interleaving String', difficulty: 'Medium', url: LC('interleaving-string'),
      hint: 'dp[i][j] from prefix s1 và s2.',
      hints: [
        'Câu hỏi 1: dp[i][j] = s3[0..i+j-1] có interleave của s1[0..i-1] và s2[0..j-1]?',
        'Câu hỏi 2: dp[i][j] true nếu: (dp[i-1][j] && s1[i-1]==s3[i+j-1]) OR (dp[i][j-1] && s2[j-1]==s3[i+j-1]).'
      ],
      solution: {
        code: `public boolean isInterleave(String s1, String s2, String s3) {
    int m = s1.length(), n = s2.length();
    if (m + n != s3.length()) return false;
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;
    for (int i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] && s1.charAt(i - 1) == s3.charAt(i - 1);
    for (int j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (dp[i - 1][j] && s1.charAt(i - 1) == s3.charAt(i + j - 1))
                    || (dp[i][j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1));
    return dp[m][n];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'Choose next char from s1 or s2. dp[i][j] true if either path works.'
      }
    },
    {
      id: 'p8', title: 'Longest Palindromic Subsequence', difficulty: 'Medium', url: LC('longest-palindromic-subsequence'),
      hint: 'LCS của s và reverse(s).',
      hints: [
        'Câu hỏi 1: Trick: LPS(s) = LCS(s, reverse(s)). Vì sao? Palindrome đọc trái-phải = đọc phải-trái.',
        'Câu hỏi 2: Alternative: interval DP dp[i][j] = LPS của s[i..j].'
      ],
      solution: {
        code: `public int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++) {
            if (s.charAt(i) == s.charAt(j)) dp[i][j] = dp[i + 1][j - 1] + 2;
            else                              dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
        }
    }
    return dp[0][n - 1];
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) · Space O(n²).',
        explanationVi: 'Interval DP. dp[i][j] = LPS s[i..j]. Iterate i từ phải sang trái để dp[i+1][j-1] đã sẵn sàng.'
      }
    },
    {
      id: 'p9', title: 'Longest Palindromic Substring', difficulty: 'Medium', url: LC('longest-palindromic-substring'),
      hint: 'Expand around centers hoặc 2D DP.',
      hints: [
        'Câu hỏi 1: Expand around center O(n²) — đơn giản nhất. Mỗi index thử cả odd length (center i) và even length (centers i, i+1).',
        'Câu hỏi 2: Alternative DP: dp[i][j] = true nếu s[i..j] palindrome.'
      ],
      solution: {
        code: `public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(s, i, i);       // odd
        int len2 = expand(s, i, i + 1);    // even
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    return s.substring(start, start + maxLen);
}

private int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
    return r - l - 1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) · Space O(1).',
        explanationVi: 'Expand around center. 2n-1 centers (n odd + n-1 even). Mỗi expand O(n). Total O(n²) — nhưng O(1) space tốt hơn DP.'
      }
    },
    {
      id: 'p10', title: 'Best Time to Buy & Sell Stock IV', difficulty: 'Hard', url: LC('best-time-to-buy-and-sell-stock-iv'),
      hint: 'dp[t][i] với ≤t transaction.',
      hints: [
        'Câu hỏi 1: dp[t][i] = max profit dùng ≤ t transactions, ending day i.',
        'Câu hỏi 2: Transition: skip (dp[t][i-1]) hoặc sell on day i (max j&lt;i: dp[t-1][j-1] + prices[i] - prices[j]).'
      ],
      solution: {
        code: `public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (k >= n / 2) {       // unlimited transactions
        int profit = 0;
        for (int i = 1; i < n; i++) if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        return profit;
    }
    int[][] dp = new int[k + 1][n];
    for (int t = 1; t <= k; t++) {
        int maxDiff = -prices[0];
        for (int i = 1; i < n; i++) {
            dp[t][i] = Math.max(dp[t][i - 1], prices[i] + maxDiff);
            maxDiff = Math.max(maxDiff, dp[t - 1][i] - prices[i]);
        }
    }
    return dp[k][n - 1];
}`,
        lang: 'java',
        complexityVi: 'Time O(k × n) · Space O(k × n).',
        explanationVi: 'Special case k ≥ n/2 = unlimited. General: track <code>maxDiff</code> = best "buy time" cho transaction t. dp[t][i] = max(skip, sell today).'
      }
    },
    {
      id: 'p11', title: 'Burst Balloons', difficulty: 'Hard', url: LC('burst-balloons'),
      hint: 'Interval DP — chọn balloon BURST CUỐI.',
      hints: [
        'Câu hỏi 1: Add 1 ở 2 đầu. dp[i][j] = max coins burst tất cả balloons trong (i, j) exclusive.',
        'Câu hỏi 2: Tinh tế: chọn balloon CUỐI burst k trong (i, j). dp[i][j] = max over k của dp[i][k] + dp[k][j] + nums[i] × nums[k] × nums[j].'
      ],
      solution: {
        code: `public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] arr = new int[n + 2];
    arr[0] = arr[n + 1] = 1;
    for (int i = 0; i < n; i++) arr[i + 1] = nums[i];
    int[][] dp = new int[n + 2][n + 2];
    for (int len = 2; len <= n + 1; len++) {
        for (int i = 0; i + len <= n + 1; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k][j] + arr[i] * arr[k] * arr[j]);
            }
        }
    }
    return dp[0][n + 1];
}`,
        lang: 'java',
        complexityVi: 'Time O(n³) · Space O(n²).',
        explanationVi: 'Interval DP, chọn balloon CUỐI burst k. Khi k burst, neighbors là i và j (đã pad 1). Iterate length tăng dần để subproblems sẵn sàng.'
      }
    },
    {
      id: 'p12', title: 'Regular Expression Matching', difficulty: 'Hard', url: LC('regular-expression-matching'),
      hint: 'dp[i][j] xử lý * cẩn thận.',
      hints: [
        'Câu hỏi 1: dp[i][j] = s[0..i-1] match p[0..j-1]?',
        'Câu hỏi 2: "*" sau char c: (1) match 0 lần = dp[i][j-2]; (2) match 1+ lần = dp[i-1][j] && (s[i-1] == c || c == ".").'
      ],
      solution: {
        code: `public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;
    for (int j = 1; j <= n; j++) {
        if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
    }
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[i][j] = dp[i][j - 2];   // match 0
                if (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1))
                    dp[i][j] = dp[i][j] || dp[i - 1][j];   // match 1+
            } else if (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    return dp[m][n];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'Tricky: "*" sau char. dp[0][j] cẩn thận empty s với pattern có *. Match 0 hay 1+ — 2 cases OR.'
      }
    }
  ],
  references: [
    { title: 'LCS / Edit Distance (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Longest_common_subsequence_problem' },
    { title: 'Knapsack problem (CP-Algorithms)', url: 'https://cp-algorithms.com/dynamic_programming/knapsack.html' }
  ]

}
