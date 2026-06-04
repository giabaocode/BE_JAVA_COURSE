// Pattern 7 — Tree BFS (Breadth-First Search / Level Order)
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'bfs',
  title: 'Pattern 7 — Tree BFS',
  mental: `Xử lý cây <strong>theo từng tầng</strong> (level): zigzag, right-side view, min depth, connect next pointer? → BFS với Queue.
<br/><br/>
<strong>Bí quyết</strong>: dùng <code>int size = queue.size()</code> đầu mỗi tầng để biết tầng có bao nhiêu node. Loop <code>size</code> lần là 1 level.`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao Queue?</strong>
FIFO — node thêm vào trước ra trước. Đảm bảo duyệt theo thứ tự tầng. Stack thì DFS.
<br/><br/>
<strong>2) Space complexity</strong>
O(w) với w = max width. Balanced tree: ~n/2 ở tầng cuối → O(n). Skewed: O(1). DFS recursion: O(h) — chiều cao.
<br/><br/>
<strong>3) "Snapshot size" trick</strong>
Chụp <code>queue.size()</code> ĐẦU mỗi level. Loop chính xác <code>size</code> lần → tách level. Nếu không chụp, queue grows during loop → mất ranh giới level.
<br/><br/>
<strong>4) Multi-source BFS</strong>
Nhiều start point cùng lúc. Push hết vào queue ban đầu. Mạnh cho bài "rotting oranges", "walls and gates".
<br/><br/>
<strong>5) Shortest path unweighted</strong>
BFS đảm bảo node thăm lần đầu = khoảng cách ngắn nhất từ source (về số cạnh). Đây là property KEY khi giải shortest-path problems trên unweighted graph.`,

  theory: `<h3>The "Why" — BFS vs DFS?</h3>
<ul>
  <li>Bài hỏi "tầng", "level", "depth" → BFS.</li>
  <li>Shortest path unweighted → BFS.</li>
  <li>Cần info từ subtree (height, sum, post-order) → DFS.</li>
  <li>Memory hạn chế + cây cân bằng → DFS (O(h) &lt; O(w)).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên chụp size đầu level</strong> → grouping sai vì queue grows during loop.</li>
  <li><strong>LinkedList làm queue</strong> chậm hơn ArrayDeque. Luôn dùng <code>Deque&lt;TreeNode&gt; q = new ArrayDeque&lt;&gt;()</code>.</li>
  <li><strong>add(null) vào queue</strong> trên ArrayDeque → NullPointerException. Always null-check children.</li>
  <li><strong>Stop BFS sai thời điểm</strong>: "min depth" return khi gặp LEAF đầu tiên — không phải level cuối.</li>
  <li><strong>Confuse offer vs add, poll vs remove</strong>: offer/poll return null khi failed, add/remove throw. Trong queue có thể dùng cả 2, nhưng nhất quán.</li>
</ul>`,

  code: `Deque<TreeNode> q = new ArrayDeque<>();
q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();   // chụp size — RANH GIỚI LEVEL
    for (int i = 0; i < size; i++) {
        TreeNode n = q.poll();
        // process n
        if (n.left != null) q.offer(n.left);
        if (n.right != null) q.offer(n.right);
    }
}`,

  prompts: [
    {
      title: 'Khi nào BFS, khi nào DFS?',
      prompt: `KHÔNG cho code. Hỏi tôi:
1. "Min depth" — BFS hay DFS hiệu quả hơn? Vì sao?
2. "Diameter of tree" cần info gì từ children? BFS làm được không?
3. "Level order zigzag" — implement BFS dễ hay DFS dễ?
4. "Maximum path sum" — vì sao bắt buộc DFS post-order?
5. Bài nào BFS và DFS đều giải được nhưng khác complexity?`
    }
  ],

  takeaways: [
    'Template: Queue + <code>int size = queue.size()</code> ở đầu loop để đánh dấu level boundary.',
    'Khi gặp: level order, zigzag, right side view, average per level, min depth.',
    'BFS tốt hơn DFS cho <strong>first/minimum queries</strong> (gặp leaf đầu tiên = answer).',
    'Space O(width of tree) — worst case complete tree = O(n/2).',
    'Pitfall: quên null check khi enqueue; nhầm size cập nhật trong loop (phải capture trước).'
  ],

  problems: [
    {
      id: 'p1', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: LC('binary-tree-level-order-traversal'),
      hint: 'Template chuẩn.',
      hints: [
        'Câu hỏi 1: Chụp size đầu level — vì sao?',
        'Câu hỏi 2: Mỗi level là 1 list. Khi nào add list vào result?'
      ],
      solution: {
        code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(w) ≈ O(n).',
        explanationVi: 'Template BFS kinh điển. Snapshot size để tách level. Add level vào result sau khi xong inner loop.'
      }
    },
    {
      id: 'p2', title: 'Binary Tree Level Order Traversal II', difficulty: 'Medium', url: LC('binary-tree-level-order-traversal-ii'),
      hint: 'Reverse cuối.',
      hints: [
        'Câu hỏi 1: Cùng BFS, nhưng output ngược tầng. Add đầu mỗi level (insert at 0) hay collect rồi reverse?',
        'Câu hỏi 2: <code>LinkedList.addFirst()</code> O(1) — cách 1 đơn giản nhất.'
      ],
      solution: {
        code: `public List<List<Integer>> levelOrderBottom(TreeNode root) {
    LinkedList<List<Integer>> res = new LinkedList<>();
    if (root == null) return res;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.addFirst(level);   // ngược tầng — addFirst O(1) trên LinkedList
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n).',
        explanationVi: 'Dùng LinkedList kết quả thay ArrayList → addFirst O(1). Tránh reverse cuối (cũng O(n) nhưng kém elegant).'
      }
    },
    {
      id: 'p3', title: 'Average of Levels in Binary Tree', difficulty: 'Easy', url: LC('average-of-levels-in-binary-tree'),
      hint: 'Sum/size mỗi tầng.',
      hints: [
        'Câu hỏi 1: Mỗi level: sum tất cả, chia cho size. Cần long cho sum tránh overflow?',
        'Câu hỏi 2: <code>n.val</code> max = 2^31 - 1; level có 10^4 node → tổng có thể vượt int.'
      ],
      solution: {
        code: `public List<Double> averageOfLevels(TreeNode root) {
    List<Double> res = new ArrayList<>();
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        long sum = 0;
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            sum += n.val;
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add((double) sum / size);
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(w).',
        explanationVi: '<code>long sum</code> tránh overflow. Chia <code>(double)</code> để không bị integer division.'
      }
    },
    {
      id: 'p4', title: 'Minimum Depth of Binary Tree', difficulty: 'Easy', url: LC('minimum-depth-of-binary-tree'),
      hint: 'Trả về depth khi gặp leaf đầu.',
      hints: [
        'Câu hỏi 1: BFS hay DFS cho min depth? BFS gặp leaf đầu = min — return ngay.',
        'Câu hỏi 2: Leaf = <code>node.left == null && node.right == null</code>.'
      ],
      solution: {
        code: `public int minDepth(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    int depth = 1;
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            if (n.left == null && n.right == null) return depth;   // leaf đầu
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        depth++;
    }
    return depth;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) worst, thường nhanh hơn vì early return · Space O(w).',
        explanationVi: 'BFS GUARANTEE leaf đầu gặp = min depth. DFS phải thăm hết — chậm hơn worst case. Early return nhanh trong nhiều trường hợp.'
      }
    },
    {
      id: 'p5', title: 'Binary Tree Right Side View', difficulty: 'Medium', url: LC('binary-tree-right-side-view'),
      hint: 'Node cuối mỗi tầng.',
      hints: [
        'Câu hỏi 1: BFS level by level, lấy node CUỐI mỗi level (i == size - 1).',
        'Câu hỏi 2: Alternative DFS: đi RIGHT trước, mỗi depth lần đầu đến thì thêm node.'
      ],
      solution: {
        code: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            if (i == size - 1) res.add(n.val);   // node cuối tầng
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(w).',
        explanationVi: 'Lấy node CUỐI mỗi level — đó là node nhìn từ phải. Lưu ý: cây có thể skewed left, node "right view" vẫn lấy được vì là node cuối tầng (kể cả ở bên trái).'
      }
    },
    {
      id: 'p6', title: 'Binary Tree Zigzag Level Order', difficulty: 'Medium', url: LC('binary-tree-zigzag-level-order-traversal'),
      hint: 'Flip Deque mỗi tầng.',
      hints: [
        'Câu hỏi 1: BFS giữ thứ tự tự nhiên. Flip thứ tự mỗi level: dùng Deque thay ArrayList, add đầu hoặc cuối tùy direction.',
        'Câu hỏi 2: Alternative: reverse level list khi <code>level % 2 == 1</code>.'
      ],
      solution: {
        code: `public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    boolean leftToRight = true;
    while (!q.isEmpty()) {
        int size = q.size();
        LinkedList<Integer> level = new LinkedList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            if (leftToRight) level.addLast(n.val);
            else              level.addFirst(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
        leftToRight = !leftToRight;
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(w).',
        explanationVi: 'Flag <code>leftToRight</code> flip mỗi level. Add đầu hoặc cuối Deque tùy direction. Children vẫn add theo thứ tự tự nhiên (queue) — chỉ result order flip.'
      }
    },
    {
      id: 'p7', title: 'Populating Next Right Pointers', difficulty: 'Medium', url: LC('populating-next-right-pointers-in-each-node'),
      hint: 'Connect trong tầng.',
      hints: [
        'Câu hỏi 1: BFS chuẩn, mỗi level connect <code>node.next = nextInLevel</code>.',
        'Câu hỏi 2: Bonus O(1) space: dùng next pointer đã thiết lập của level trên để duyệt level dưới.'
      ],
      solution: {
        code: `public Node connect(Node root) {
    if (root == null) return null;
    Node leftmost = root;
    while (leftmost.left != null) {                   // perfect binary tree
        Node head = leftmost;
        while (head != null) {
            head.left.next = head.right;               // cùng parent
            if (head.next != null)
                head.right.next = head.next.left;      // qua next
            head = head.next;
        }
        leftmost = leftmost.left;
    }
    return root;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1) — dùng next pointer thay queue.',
        explanationVi: 'Optimize: duyệt level bằng next pointer đã thiết lập của level trên. 2 case connection: (1) cùng parent → trivial; (2) qua parent.next → dùng next pointer parent. KHÔNG cần extra queue.'
      }
    },
    {
      id: 'p8', title: 'Cousins in Binary Tree', difficulty: 'Easy', url: LC('cousins-in-binary-tree'),
      hint: 'Track depth + parent.',
      hints: [
        'Câu hỏi 1: Cousin = cùng depth, khác parent. BFS track (node, parent) thay vì chỉ node.',
        'Câu hỏi 2: Tìm 2 target trong cùng level. Khác parent → cousin.'
      ],
      solution: {
        code: `public boolean isCousins(TreeNode root, int x, int y) {
    Deque<TreeNode> q = new ArrayDeque<>();
    Map<Integer, TreeNode> parent = new HashMap<>();
    Map<Integer, Integer> depth = new HashMap<>();
    parent.put(root.val, null);
    depth.put(root.val, 0);
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode n = q.poll();
        if (n.left != null) {
            parent.put(n.left.val, n);
            depth.put(n.left.val, depth.get(n.val) + 1);
            q.offer(n.left);
        }
        if (n.right != null) {
            parent.put(n.right.val, n);
            depth.put(n.right.val, depth.get(n.val) + 1);
            q.offer(n.right);
        }
    }
    return depth.get(x).equals(depth.get(y)) && parent.get(x) != parent.get(y);
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n).',
        explanationVi: 'BFS track parent + depth. Cousin ⇔ cùng depth, khác parent. Có thể optimize: early return khi tìm thấy cả 2 trong cùng level.'
      }
    },
    {
      id: 'p9', title: 'Find Largest Value in Each Tree Row', difficulty: 'Medium', url: LC('find-largest-value-in-each-tree-row'),
      hint: 'Max mỗi tầng.',
      hints: [
        'Câu hỏi 1: Cùng BFS template — track max thay vì collect tất cả.',
        'Câu hỏi 2: Khởi tạo <code>max = Integer.MIN_VALUE</code>.'
      ],
      solution: {
        code: `public List<Integer> largestValues(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size(), max = Integer.MIN_VALUE;
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            max = Math.max(max, n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(max);
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(w).',
        explanationVi: 'BFS classic. Track max per level thay vì list.'
      }
    },
    {
      id: 'p10', title: 'Add One Row to Tree', difficulty: 'Medium', url: LC('add-one-row-to-tree'),
      hint: 'BFS tới depth-1; rewire children.',
      hints: [
        'Câu hỏi 1: BFS đến level depth-1 (parent của row mới). Tại mỗi node ở level đó: insert 2 node mới làm con, đẩy con cũ xuống.',
        'Câu hỏi 2: Edge case depth = 1: tạo root mới, root cũ thành con trái.'
      ],
      solution: {
        code: `public TreeNode addOneRow(TreeNode root, int val, int depth) {
    if (depth == 1) return new TreeNode(val, root, null);
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    int currDepth = 1;
    while (currDepth < depth - 1) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        currDepth++;
    }
    while (!q.isEmpty()) {
        TreeNode n = q.poll();
        TreeNode newLeft = new TreeNode(val, n.left, null);
        TreeNode newRight = new TreeNode(val, null, n.right);
        n.left = newLeft;
        n.right = newRight;
    }
    return root;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(w).',
        explanationVi: 'BFS tới level depth-1. Tại mỗi node, insert 2 node mới: <code>newLeft</code> = (val, oldLeft, null), <code>newRight</code> = (val, null, oldRight). Edge case depth=1: tạo root mới.'
      }
    }
  ],
  references: [
    { title: 'BFS on trees -LeetCode', url: 'https://leetcode.com/tag/breadth-first-search/' },
    { title: 'Tree traversal (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Tree_traversal' }
  ]

}
