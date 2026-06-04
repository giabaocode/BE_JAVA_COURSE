// Pattern 8 — Tree DFS (Depth-First Search)
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'dfs',
  title: 'Pattern 8 — Tree DFS',
  mental: `Mỗi bài DFS dạng: "<strong>kết quả node = kết hợp kết quả của left + right + giá trị node</strong>". Đây là post-order recursion.
<br/><br/>
Truyền context xuống (vd: lo/hi cho BST) — pass parameter. Cần "global" answer (vd: max path sum) — instance variable hoặc <code>int[]{result}</code>.`,

  under: `<h3>First Principles</h3>
<strong>1) "Leap of faith"</strong>
TIN rằng recursive call cho left + right TRẢ VỀ ĐÚNG. Đừng cố trace full recursion — rối não. Focus: base case + cách combine.
<br/><br/>
<strong>2) Hai dạng tham số</strong>
<ul>
<li><strong>Top-down</strong>: pass info từ parent xuống (lo/hi cho BST validation, path sum hiện tại).</li>
<li><strong>Bottom-up</strong>: return info từ children lên (height, sum, isBalanced).</li>
</ul>
<br/><br/>
<strong>3) Global vs local result</strong>
Bài "max path sum": local = "best path xuống từ node này" (single arm), global = "best path qua node này" (both arms). Khác nhau! Thường: return local lên trên, update global bên trong.
<br/><br/>
<strong>4) Time complexity</strong>
DFS thăm mỗi node 1 lần → O(n). Trừ khi mỗi node làm O(k) work → O(nk).
<br/><br/>
<strong>5) Iterative DFS — explicit stack</strong>
Cho cây cực sâu (skewed) → recursion stack overflow. Convert sang iterative dùng <code>Deque&lt;TreeNode&gt; stack</code> + push/pop.
<br/><br/>
<strong>6) Morris traversal — O(1) space</strong>
Tận dụng "threaded binary tree" — temporarily modify <code>right</code> pointer của in-order predecessor. Trick nâng cao, rare trong interview nhưng đẹp.`,

  theory: `<h3>The "Why" — Khi nào DFS?</h3>
<ul>
  <li>Bài cần info từ subtree (height, sum, count).</li>
  <li>BST validation, path-related problems.</li>
  <li>Tree construction từ traversals.</li>
  <li>Serialize/deserialize.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên base case <code>node == null</code></strong> → NPE.</li>
  <li><strong>BST validate sai</strong>: chỉ check <code>node.left.val &lt; node.val</code> — cần [lo, hi] BOUNDS.</li>
  <li><strong>Confuse "path sum" local vs global</strong>: return single-arm cho parent, update global với both-arms.</li>
  <li><strong>Quên backtrack</strong> trong path enumeration (Path Sum II): add → recurse → REMOVE.</li>
  <li><strong>Mutate shared state mà không restore</strong> → bug khó debug.</li>
  <li><strong>Recursion depth quá sâu</strong> → StackOverflowError trên skewed tree. Convert iterative nếu cần.</li>
</ul>`,

  code: `// Bottom-up: diameter
int maxDiameter = 0;
int height(TreeNode n) {
    if (n == null) return 0;
    int l = height(n.left), r = height(n.right);
    maxDiameter = Math.max(maxDiameter, l + r);   // update global
    return 1 + Math.max(l, r);                    // return local lên parent
}`,

  prompts: [
    {
      title: 'Framework giải bài tree',
      prompt: `Cho bài tree mới. KHÔNG cho code. Hỏi tôi:
1. Bottom-up (cần info từ children) hay top-down (truyền info xuống)?
2. Mỗi node cần return gì? Một giá trị hay nhiều?
3. Có cần "global" answer không? Store ở đâu?
4. Base case (node == null) trả gì?
5. Vẽ tree 3-4 node, trace recursion từng bước.
Áp dụng cho "max path sum".`
    }
  ],

  takeaways: [
    '3 thứ tự duyệt: <strong>preorder</strong> (root→L→R), <strong>inorder</strong> (L→root→R, BST = sorted), <strong>postorder</strong> (L→R→root, cần result từ con trước).',
    '2 style recursion: <strong>top-down</strong> (truyền state xuống), <strong>bottom-up</strong> (return từ con lên rồi tổng hợp).',
    'Khi gặp: path sum, root-to-leaf paths, max depth, LCA, validate BST, serialize tree.',
    'DFS dùng O(h) space (h = height). Skewed tree = O(n) → risk stack overflow.',
    'Pitfall: nhầm pre/in/post; quên return ở base case; modify shared list mà không backtrack ở path problems.'
  ],

  problems: [
    {
      id: 'p1', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: LC('maximum-depth-of-binary-tree'),
      hint: '1 + max(left, right).',
      hints: [
        'Câu hỏi 1: Base case node == null trả gì?',
        'Câu hỏi 2: Combine left + right thế nào?'
      ],
      solution: {
        code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h) recursion stack.',
        explanationVi: 'Bottom-up classic. Null = depth 0. Mỗi node thêm 1 vào max depth của subtree.'
      }
    },
    {
      id: 'p2', title: 'Same Tree', difficulty: 'Easy', url: LC('same-tree'),
      hint: 'Recurse pair-wise.',
      hints: [
        'Câu hỏi 1: 2 tree giống nhau ⇔ root giống + left subtree giống + right subtree giống.',
        'Câu hỏi 2: Edge case: 1 null, 1 không null? Cả 2 null?'
      ],
      solution: {
        code: `public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        lang: 'java',
        complexityVi: 'Time O(min(n, m)) · Space O(min(h1, h2)).',
        explanationVi: 'Recurse pair-wise. Edge case: cả 2 null OK; 1 null/1 không null FAIL; cùng val + 2 subtree match.'
      }
    },
    {
      id: 'p3', title: 'Symmetric Tree', difficulty: 'Easy', url: LC('symmetric-tree'),
      hint: 'Mirror recursion.',
      hints: [
        'Câu hỏi 1: Đối xứng ⇔ <code>isMirror(left, right)</code>. Mirror nghĩa gì?',
        'Câu hỏi 2: <code>isMirror(a, b)</code> = a.val == b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left).'
      ],
      solution: {
        code: `public boolean isSymmetric(TreeNode root) {
    return root == null || isMirror(root.left, root.right);
}

private boolean isMirror(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.val == b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left);
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Mirror recursion: cross children — a.left với b.right, a.right với b.left.'
      }
    },
    {
      id: 'p4', title: 'Invert Binary Tree', difficulty: 'Easy', url: LC('invert-binary-tree'),
      hint: 'Swap children rồi recurse.',
      hints: [
        'Câu hỏi 1: Swap left/right children. Recurse vào cả 2 subtree.',
        'Câu hỏi 2: Order matters? Swap trước recurse hay sau? Cả 2 đúng — lý do?'
      ],
      solution: {
        code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Post-order swap. Cả pre-order swap đều đúng vì 2 subtree độc lập.'
      }
    },
    {
      id: 'p5', title: 'Path Sum', difficulty: 'Easy', url: LC('path-sum'),
      hint: 'Subtract trên đường xuống.',
      hints: [
        'Câu hỏi 1: Top-down: subtract <code>node.val</code> từ target. Tại leaf, check <code>target == 0</code>.',
        'Câu hỏi 2: Edge case root null — return false (không có path).'
      ],
      solution: {
        code: `public boolean hasPathSum(TreeNode root, int target) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return target == root.val;
    return hasPathSum(root.left, target - root.val)
        || hasPathSum(root.right, target - root.val);
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Top-down: pass remaining target. Leaf: check remaining == val. Internal: OR của 2 subtree.'
      }
    },
    {
      id: 'p6', title: 'Path Sum II (enumerate)', difficulty: 'Medium', url: LC('path-sum-ii'),
      hint: 'Backtrack: add rồi remove.',
      hints: [
        'Câu hỏi 1: Enumerate mọi path đến leaf có sum = target. Backtracking: add node vào path, recurse, REMOVE.',
        'Câu hỏi 2: Tại leaf nếu sum match: add copy của path vào result (không phải reference!).'
      ],
      solution: {
        code: `public List<List<Integer>> pathSum(TreeNode root, int target) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(root, target, new ArrayList<>(), res);
    return res;
}

private void dfs(TreeNode n, int target, List<Integer> path, List<List<Integer>> res) {
    if (n == null) return;
    path.add(n.val);
    if (n.left == null && n.right == null && target == n.val) {
        res.add(new ArrayList<>(path));   // COPY — path bị modify ở backtrack
    }
    dfs(n.left, target - n.val, path, res);
    dfs(n.right, target - n.val, path, res);
    path.remove(path.size() - 1);          // BACKTRACK
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) worst (copy path mỗi leaf). Space O(h) recursion + O(answer).',
        explanationVi: 'Backtracking: add → recurse → remove. Copy path khi match. KHÔNG add reference (path bị mutate sau).'
      }
    },
    {
      id: 'p7', title: 'Diameter of Binary Tree', difficulty: 'Easy', url: LC('diameter-of-binary-tree'),
      hint: 'Post-order + global max.',
      hints: [
        'Câu hỏi 1: Diameter qua node X = height(X.left) + height(X.right). Global max qua mọi node.',
        'Câu hỏi 2: Return height cho parent. Update global diameter trong helper.'
      ],
      solution: {
        code: `private int diameter = 0;

public int diameterOfBinaryTree(TreeNode root) {
    height(root);
    return diameter;
}

private int height(TreeNode n) {
    if (n == null) return 0;
    int l = height(n.left), r = height(n.right);
    diameter = Math.max(diameter, l + r);   // update global
    return 1 + Math.max(l, r);
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Local return = height; global update = diameter (l + r edges qua node hiện tại).'
      }
    },
    {
      id: 'p8', title: 'Validate Binary Search Tree', difficulty: 'Medium', url: LC('validate-binary-search-tree'),
      hint: 'Pass [lo, hi] bounds.',
      hints: [
        'Câu hỏi 1: Check node-vs-children KHÔNG đủ. Vẽ counter-example.',
        'Câu hỏi 2: Truyền [lo, hi] xuống. Đi LEFT: hi = node.val. Đi RIGHT: lo = node.val. Dùng <code>long</code> tránh overflow.'
      ],
      solution: {
        code: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode n, long lo, long hi) {
    if (n == null) return true;
    if (n.val <= lo || n.val >= hi) return false;
    return validate(n.left, lo, n.val) && validate(n.right, n.val, hi);
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Bounds propagation. <code>long</code> tránh edge case node.val = Integer.MIN/MAX_VALUE.'
      }
    },
    {
      id: 'p9', title: 'Lowest Common Ancestor', difficulty: 'Medium', url: LC('lowest-common-ancestor-of-a-binary-tree'),
      hint: 'Subtree chứa cả 2.',
      hints: [
        'Câu hỏi 1: LCA = node thấp nhất có CẢ p và q trong subtree (kể cả chính nó).',
        'Câu hỏi 2: Recurse cả 2. Nếu cả 2 subtree return non-null → node hiện tại là LCA. Nếu chỉ 1 → LCA ở subtree đó.'
      ],
      solution: {
        code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Recurse cả 2 subtree. 3 case: (1) cả 2 non-null → root là LCA; (2) chỉ left → LCA ở left; (3) chỉ right → LCA ở right.'
      }
    },
    {
      id: 'p10', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', url: LC('binary-tree-maximum-path-sum'),
      hint: 'One-arm vs both-arms.',
      hints: [
        'Câu hỏi 1: Tại mỗi node X, "best path qua X" = X.val + max(0, leftArm) + max(0, rightArm). Update global.',
        'Câu hỏi 2: Return cho parent: X.val + max(0, max(leftArm, rightArm)) — chỉ 1 nhánh đi tiếp.'
      ],
      solution: {
        code: `private int best = Integer.MIN_VALUE;

public int maxPathSum(TreeNode root) {
    arm(root);
    return best;
}

private int arm(TreeNode n) {
    if (n == null) return 0;
    int l = Math.max(0, arm(n.left));      // bỏ nếu âm
    int r = Math.max(0, arm(n.right));
    best = Math.max(best, n.val + l + r);   // both-arms — update global
    return n.val + Math.max(l, r);          // one-arm — return cho parent
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(h).',
        explanationVi: 'Local (return) = one-arm; Global (update) = both-arms. <code>Math.max(0, ...)</code> bỏ nhánh âm (không cải thiện).'
      }
    },
    {
      id: 'p11', title: 'Construct Tree from Preorder & Inorder', difficulty: 'Medium', url: LC('construct-binary-tree-from-preorder-and-inorder-traversal'),
      hint: 'Pre[0] = root; split inorder.',
      hints: [
        'Câu hỏi 1: <code>preorder[0]</code> là root. Tìm root trong inorder → trái = left subtree, phải = right subtree.',
        'Câu hỏi 2: HashMap inorder value → index tăng tốc tìm từ O(n) xuống O(1).'
      ],
      solution: {
        code: `private int preIdx = 0;
private Map<Integer, Integer> inMap;

public TreeNode buildTree(int[] preorder, int[] inorder) {
    inMap = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
    return build(preorder, 0, inorder.length - 1);
}

private TreeNode build(int[] preorder, int inLo, int inHi) {
    if (inLo > inHi) return null;
    int val = preorder[preIdx++];
    TreeNode root = new TreeNode(val);
    int mid = inMap.get(val);
    root.left = build(preorder, inLo, mid - 1);
    root.right = build(preorder, mid + 1, inHi);
    return root;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n) cho map + O(h) recursion.',
        explanationVi: 'Preorder cho biết root. Inorder cho biết phạm vi left/right. <code>preIdx</code> global tăng dần — đảm bảo build root trước children.'
      }
    },
    {
      id: 'p12', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', url: LC('serialize-and-deserialize-binary-tree'),
      hint: 'Preorder với marker null.',
      hints: [
        'Câu hỏi 1: Preorder + marker "null" cho node rỗng → ENCODING duy nhất khôi phục được.',
        'Câu hỏi 2: Deserialize: dùng <code>Deque&lt;String&gt;</code> làm token stream, consume từng token.'
      ],
      solution: {
        code: `public String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    serializeHelper(root, sb);
    return sb.toString();
}

private void serializeHelper(TreeNode n, StringBuilder sb) {
    if (n == null) { sb.append("# "); return; }
    sb.append(n.val).append(' ');
    serializeHelper(n.left, sb);
    serializeHelper(n.right, sb);
}

public TreeNode deserialize(String data) {
    Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(" ")));
    return deserializeHelper(tokens);
}

private TreeNode deserializeHelper(Deque<String> tokens) {
    String t = tokens.poll();
    if (t.equals("#")) return null;
    TreeNode n = new TreeNode(Integer.parseInt(t));
    n.left = deserializeHelper(tokens);
    n.right = deserializeHelper(tokens);
    return n;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n).',
        explanationVi: 'Preorder + null marker — đủ để khôi phục tree duy nhất (KHÔNG cần inorder phụ). Deserialize: consume token theo cùng thứ tự preorder.'
      }
    }
  ],
  references: [
    { title: 'DFS on trees -LeetCode', url: 'https://leetcode.com/tag/depth-first-search/' },
    { title: 'Binary tree traversals visualization', url: 'https://visualgo.net/en/bst' }
  ]

}
