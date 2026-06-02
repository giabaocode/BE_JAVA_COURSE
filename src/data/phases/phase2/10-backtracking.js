// Pattern 10 — Subsets & Backtracking
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'bt',
  title: 'Pattern 10 — Subsets & Backtracking',
  mental: `Backtracking = <strong>thử mọi nhánh quyết định</strong>. Tại mỗi bước: CHOOSE → EXPLORE (recurse) → UN-CHOOSE. Cây quyết định.
<br/><br/>
Áp dụng: subsets, permutations, combinations, N-Queens, sudoku, word search.`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao UN-CHOOSE quan trọng?</strong>
Cùng <code>path</code> object dùng chung qua các nhánh. KHÔNG remove → nhánh sau "thừa kế" choice của nhánh trước → sai.
<br/><br/>
<strong>2) Pruning — chìa khóa hiệu năng</strong>
Detect path KHÔNG THỂ dẫn đến lời giải sớm → return ngay. Vd N-Queens không thử mọi hoán vị. Combination Sum: nếu sum hiện tại &gt; target → return.
<br/><br/>
<strong>3) Duplicates skip</strong>
Input có duplicates: sort trước, skip <code>nums[i] == nums[i-1]</code> tại cùng độ sâu. KHÔNG skip cross depth — đó là dùng same number 2 lần ở 2 cấp.
<br/><br/>
<strong>4) Time complexity</strong>
Subsets: O(2^n × n) — 2^n subset, mỗi copy O(n). Permutations: O(n! × n). Sudoku/N-Queens: rất nhỏ trong thực tế nhờ pruning.
<br/><br/>
<strong>5) Iterative subsets (bit manipulation)</strong>
Thay backtracking, duyệt 0..2^n. Bit i của number = chọn/không phần tử i. Đơn giản, KHÔNG recursive.
<br/><br/>
<strong>6) Why path.add then path.remove?</strong>
Mỗi recursive call kết thúc, state phải về ORIGINAL như trước call. Đây là invariant cho mọi backtracking đúng.`,

  theory: `<h3>The "Why" — Khi nào Backtracking?</h3>
<ul>
  <li>"Liệt kê tất cả ..." (combinations, permutations, subsets).</li>
  <li>"Tìm 1 cấu hình thỏa ràng buộc" (N-Queens, sudoku).</li>
  <li>Decision tree với nhánh nhỏ.</li>
  <li>Pruning cắt khối lượng search → còn khả thi.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Add reference, không copy</strong>: <code>res.add(path)</code> thay vì <code>res.add(new ArrayList&lt;&gt;(path))</code> → mọi entry trỏ cùng path đã bị clear.</li>
  <li><strong>Quên UN-CHOOSE</strong> → nhánh sau lệch state.</li>
  <li><strong>Skip duplicate cross-depth</strong> → mất kết quả valid.</li>
  <li><strong>Không pruning</strong> → TLE trên input lớn.</li>
  <li><strong>Mutate input array</strong> mà không restore (Word Search) → kết quả sai cho call tiếp.</li>
  <li><strong>Used[] array thay vì index start</strong> cho combinations → enumerate permutations thay vì combinations (mất tính "chọn từ phía sau").</li>
</ul>`,

  code: `void backtrack(int start, List<Integer> path, int[] nums, List<List<Integer>> out) {
    out.add(new ArrayList<>(path));                  // record state
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                            // CHOOSE
        backtrack(i + 1, path, nums, out);            // EXPLORE
        path.remove(path.size() - 1);                 // UN-CHOOSE
    }
}`,

  prompts: [
    {
      title: 'Backtracking framework',
      prompt: `Cho bài "list mọi X". KHÔNG cho code. Hỏi tôi:
1. Decision tree trông thế nào? Mỗi node bao nhiêu nhánh?
2. Lúc nào add vào kết quả — leaf hay mọi node?
3. Truyền gì xuống recursion? (start index? used? remaining target?)
4. UN-CHOOSE bắt buộc — tại sao?
5. Duplicate input — tránh sinh kết quả trùng ra sao?
6. Pruning: detect "không thể đến đáp án" sớm?`
    }
  ],

  takeaways: [
    'Template: try → recurse → <strong>undo (state restore)</strong>. Mỗi level chọn 1 option → đệ quy → revert.',
    'Khi gặp: permutations, combinations, subsets, N-Queens, Sudoku, word search, partition string.',
    '<strong>Prune</strong>: kiểm tra constraint TRƯỚC khi recurse — early-exit branches không thể thành solution.',
    'Time O(branch^depth) — phải prune mạnh. Space O(depth) cho stack.',
    'Pitfall: push reference thay vì copy → list bị mutate sau recursion. Dùng <code>new ArrayList&lt;&gt;(current)</code>; quên undo state sau recurse.'
  ],

  problems: [
    {
      id: 'p1', title: 'Subsets', difficulty: 'Medium', url: LC('subsets'),
      hint: 'Add path tại mọi gọi.',
      hints: [
        'Câu hỏi 1: Mỗi node của decision tree = 1 subset. Add tại MỌI call (kể cả root rỗng).',
        'Câu hỏi 2: <code>start</code> tránh duplicate: phần tử mới chỉ chọn từ start trở đi.'
      ],
      solution: {
        code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), res);
    return res;
}

private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, nums, path, res);
        path.remove(path.size() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(2^n × n) · Space O(n) recursion.',
        explanationVi: 'Add tại mỗi recursive call → tất cả 2^n subset. <code>start</code> = chỉ chọn forward.'
      }
    },
    {
      id: 'p2', title: 'Subsets II', difficulty: 'Medium', url: LC('subsets-ii'),
      hint: 'Sort; skip duplicate cùng depth.',
      hints: [
        'Câu hỏi 1: Sort trước. Skip <code>i &gt; start && nums[i] == nums[i-1]</code> để tránh duplicate subsets.',
        'Câu hỏi 2: Vì sao <code>i &gt; start</code> chứ KHÔNG <code>i &gt; 0</code>? (Skip CÙNG DEPTH, không cross depth.)'
      ],
      solution: {
        code: `public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), res);
    return res;
}

private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;   // skip duplicate cùng depth
        path.add(nums[i]);
        backtrack(i + 1, nums, path, res);
        path.remove(path.size() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(2^n × n) · Space O(n).',
        explanationVi: 'Sort + skip duplicate ở CÙNG depth. <code>i &gt; start</code>: kế thừa từ parent OK (cross depth), repeat tại cùng depth (i &gt; start với nums[i]==nums[i-1]) thì skip.'
      }
    },
    {
      id: 'p3', title: 'Permutations', difficulty: 'Medium', url: LC('permutations'),
      hint: 'used[] array.',
      hints: [
        'Câu hỏi 1: Permutation: dùng MỌI phần tử, thứ tự khác nhau. <code>start</code> không work — cần track "đã chọn cái nào".',
        'Câu hỏi 2: <code>boolean[] used</code> hoặc swap-in-place.'
      ],
      solution: {
        code: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, new ArrayList<>(), new boolean[nums.length], res);
    return res;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, path, used, res);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(n! × n) · Space O(n).',
        explanationVi: 'used[] array. Add kết quả tại leaf (path.size == n). UN-CHOOSE cả path và used[].'
      }
    },
    {
      id: 'p4', title: 'Permutations II', difficulty: 'Medium', url: LC('permutations-ii'),
      hint: 'Sort + skip dup khi prev cùng giá trị chưa used.',
      hints: [
        'Câu hỏi 1: Sort. Skip duplicate: nếu <code>nums[i] == nums[i-1] && !used[i-1]</code>, skip.',
        'Câu hỏi 2: Vì sao điều kiện <code>!used[i-1]</code>? (Đảm bảo duplicate trước đó chưa được chọn trong path hiện tại → tránh nhánh trùng.)'
      ],
      solution: {
        code: `public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, new ArrayList<>(), new boolean[nums.length], res);
    return res;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, path, used, res);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(n! × n) · Space O(n).',
        explanationVi: 'Sort + skip duplicate "trái chưa dùng". Đảm bảo trong cấu hình duplicate, chỉ thử thứ tự "trái → phải" → tránh permutation trùng.'
      }
    },
    {
      id: 'p5', title: 'Combinations', difficulty: 'Medium', url: LC('combinations'),
      hint: 'Chọn k from 1..n.',
      hints: [
        'Câu hỏi 1: Chọn k từ 1..n. Như subsets nhưng chỉ add khi size == k.',
        'Câu hỏi 2: Pruning: nếu remaining slots &gt; remaining numbers, return sớm.'
      ],
      solution: {
        code: `public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(1, n, k, new ArrayList<>(), res);
    return res;
}

private void backtrack(int start, int n, int k, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == k) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i <= n - (k - path.size()) + 1; i++) {   // pruning
        path.add(i);
        backtrack(i + 1, n, k, path, res);
        path.remove(path.size() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(C(n,k) × k) · Space O(k).',
        explanationVi: 'Subsets pattern + filter size == k. Pruning: nếu remaining numbers &lt; remaining slots, skip → tăng tốc đáng kể.'
      }
    },
    {
      id: 'p6', title: 'Combination Sum', difficulty: 'Medium', url: LC('combination-sum'),
      hint: 'Cùng i được dùng nhiều lần.',
      hints: [
        'Câu hỏi 1: Có thể dùng cùng số NHIỀU LẦN. Recurse với <code>i</code> (KHÔNG <code>i+1</code>).',
        'Câu hỏi 2: Pruning: nếu remaining &lt; 0 → return.'
      ],
      solution: {
        code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> res = new ArrayList<>();
    Arrays.sort(candidates);
    backtrack(0, target, candidates, new ArrayList<>(), res);
    return res;
}

private void backtrack(int start, int remaining, int[] cands, List<Integer> path, List<List<Integer>> res) {
    if (remaining == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < cands.length; i++) {
        if (cands[i] > remaining) break;     // pruning (đã sort)
        path.add(cands[i]);
        backtrack(i, remaining - cands[i], cands, path, res);   // i (không i+1) → có thể dùng lại
        path.remove(path.size() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(N^(T/M)) với T = target, M = min candidate · Space O(T/M) recursion.',
        explanationVi: 'Recurse với <code>i</code> không <code>i+1</code> → cho phép dùng lại. Sort + pruning <code>cands[i] &gt; remaining</code> → cắt nhánh sớm.'
      }
    },
    {
      id: 'p7', title: 'Combination Sum II', difficulty: 'Medium', url: LC('combination-sum-ii'),
      hint: 'Mỗi phần tử 1 lần; skip dup.',
      hints: [
        'Câu hỏi 1: Mỗi candidate dùng 1 lần. Recurse <code>i+1</code>.',
        'Câu hỏi 2: Skip duplicate cùng depth: <code>i &gt; start && cands[i] == cands[i-1]</code>.'
      ],
      solution: {
        code: `public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(0, target, candidates, new ArrayList<>(), res);
    return res;
}

private void backtrack(int start, int remaining, int[] cands, List<Integer> path, List<List<Integer>> res) {
    if (remaining == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < cands.length; i++) {
        if (i > start && cands[i] == cands[i - 1]) continue;  // skip dup cùng depth
        if (cands[i] > remaining) break;
        path.add(cands[i]);
        backtrack(i + 1, remaining - cands[i], cands, path, res);
        path.remove(path.size() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(2^n × n) · Space O(n).',
        explanationVi: 'Combo "i+1" (mỗi phần tử 1 lần) + skip duplicate cùng depth + pruning sort.'
      }
    },
    {
      id: 'p8', title: 'Letter Combinations of Phone Number', difficulty: 'Medium', url: LC('letter-combinations-of-a-phone-number'),
      hint: 'Branch theo letters của digit.',
      hints: [
        'Câu hỏi 1: Mỗi digit có 3-4 chữ. Decision tree: branch theo mỗi chữ của digit hiện tại.',
        'Câu hỏi 2: Base case: hết digit → add path.'
      ],
      solution: {
        code: `private static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

public List<String> letterCombinations(String digits) {
    List<String> res = new ArrayList<>();
    if (digits.isEmpty()) return res;
    backtrack(0, digits, new StringBuilder(), res);
    return res;
}

private void backtrack(int idx, String digits, StringBuilder sb, List<String> res) {
    if (idx == digits.length()) { res.add(sb.toString()); return; }
    for (char c : MAP[digits.charAt(idx) - '0'].toCharArray()) {
        sb.append(c);
        backtrack(idx + 1, digits, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(4^n × n) · Space O(n).',
        explanationVi: 'Branch theo mỗi chữ của digit. <code>StringBuilder</code> như path, deleteCharAt = UN-CHOOSE.'
      }
    },
    {
      id: 'p9', title: 'Generate Parentheses', difficulty: 'Medium', url: LC('generate-parentheses'),
      hint: 'Track open/close count.',
      hints: [
        'Câu hỏi 1: Track openCount, closeCount. Valid khi: openCount ≤ n và closeCount ≤ openCount.',
        'Câu hỏi 2: Base case: open == close == n.'
      ],
      solution: {
        code: `public List<String> generateParenthesis(int n) {
    List<String> res = new ArrayList<>();
    backtrack(n, 0, 0, new StringBuilder(), res);
    return res;
}

private void backtrack(int n, int open, int close, StringBuilder sb, List<String> res) {
    if (sb.length() == n * 2) { res.add(sb.toString()); return; }
    if (open < n) {
        sb.append('(');
        backtrack(n, open + 1, close, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
    if (close < open) {
        sb.append(')');
        backtrack(n, open, close + 1, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(4^n / √n) (Catalan number) · Space O(n).',
        explanationVi: '2 nhánh: add "(" nếu open &lt; n; add ")" nếu close &lt; open. Tự nhiên đảm bảo valid.'
      }
    },
    {
      id: 'p10', title: 'Word Search', difficulty: 'Medium', url: LC('word-search'),
      hint: 'DFS + visited mark + restore.',
      hints: [
        'Câu hỏi 1: DFS 4-direction. Mark visited bằng cách TEMPORARILY mutate <code>board[r][c] = "#"</code>, restore sau recursion.',
        'Câu hỏi 2: Pruning: out of bounds, mismatch, already visited.'
      ],
      solution: {
        code: `public boolean exist(char[][] board, String word) {
    for (int i = 0; i < board.length; i++)
        for (int j = 0; j < board[0].length; j++)
            if (dfs(board, i, j, word, 0)) return true;
    return false;
}

private boolean dfs(char[][] board, int r, int c, String word, int idx) {
    if (idx == word.length()) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length
        || board[r][c] != word.charAt(idx)) return false;
    char tmp = board[r][c];
    board[r][c] = '#';   // mark visited
    boolean found = dfs(board, r+1, c, word, idx+1) || dfs(board, r-1, c, word, idx+1)
                 || dfs(board, r, c+1, word, idx+1) || dfs(board, r, c-1, word, idx+1);
    board[r][c] = tmp;   // restore
    return found;
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n × 4^L) với L = word length · Space O(L) recursion.',
        explanationVi: 'DFS với in-place visited marker. Restore sau recursion để không poison cho call khác.'
      }
    },
    {
      id: 'p11', title: 'Palindrome Partitioning', difficulty: 'Medium', url: LC('palindrome-partitioning'),
      hint: 'Cut + check palindrome + recurse.',
      hints: [
        'Câu hỏi 1: Tại mỗi index i, thử mọi cut <code>s[start..i]</code>. Nếu palindrome → recurse từ i+1.',
        'Câu hỏi 2: Bonus: precompute <code>isPalindrome[i][j]</code> để tránh O(L) check mỗi lần.'
      ],
      solution: {
        code: `public List<List<String>> partition(String s) {
    List<List<String>> res = new ArrayList<>();
    backtrack(0, s, new ArrayList<>(), res);
    return res;
}

private void backtrack(int start, String s, List<String> path, List<List<String>> res) {
    if (start == s.length()) { res.add(new ArrayList<>(path)); return; }
    for (int end = start + 1; end <= s.length(); end++) {
        if (isPalindrome(s, start, end - 1)) {
            path.add(s.substring(start, end));
            backtrack(end, s, path, res);
            path.remove(path.size() - 1);
        }
    }
}

private boolean isPalindrome(String s, int l, int r) {
    while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
    return true;
}`,
        lang: 'java',
        complexityVi: 'Time O(n × 2^n) · Space O(n).',
        explanationVi: 'Tại mỗi position, cắt thành prefix palindrome + recurse phần còn lại. 2^n partition trong worst case.'
      }
    },
    {
      id: 'p12', title: 'N-Queens', difficulty: 'Hard', url: LC('n-queens'),
      hint: 'Track cols + 2 diagonals.',
      hints: [
        'Câu hỏi 1: Place queens row by row. Track 3 set: cols, diag1 (r-c), diag2 (r+c).',
        'Câu hỏi 2: Mỗi row chọn col valid (không trong 3 set). Place, recurse, UN-CHOOSE.'
      ],
      solution: {
        code: `public List<List<String>> solveNQueens(int n) {
    List<List<String>> res = new ArrayList<>();
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');
    Set<Integer> cols = new HashSet<>(), d1 = new HashSet<>(), d2 = new HashSet<>();
    backtrack(0, n, board, cols, d1, d2, res);
    return res;
}

private void backtrack(int row, int n, char[][] board, Set<Integer> cols, Set<Integer> d1, Set<Integer> d2, List<List<String>> res) {
    if (row == n) {
        List<String> sol = new ArrayList<>();
        for (char[] r : board) sol.add(new String(r));
        res.add(sol);
        return;
    }
    for (int col = 0; col < n; col++) {
        if (cols.contains(col) || d1.contains(row - col) || d2.contains(row + col)) continue;
        board[row][col] = 'Q';
        cols.add(col); d1.add(row - col); d2.add(row + col);
        backtrack(row + 1, n, board, cols, d1, d2, res);
        board[row][col] = '.';
        cols.remove(col); d1.remove(row - col); d2.remove(row + col);
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(n!) worst, much less with pruning · Space O(n).',
        explanationVi: 'Place queens row by row. 3 sets check conflict O(1). r-c constant cho 1 diagonal, r+c constant cho diagonal khác. Backtrack: add → recurse → remove.'
      }
    }
  ]
}
