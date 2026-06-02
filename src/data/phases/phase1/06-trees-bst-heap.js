// ============================================================================
//  PHASE 1 — Module 1.6: Trees, BST & PriorityQueue (Heap)
// ============================================================================

export default
    {
      id: 'mod-1-6',
      title: 'Trees, BST & PriorityQueue (Heap)',
      lessons: [
        {
          id: 'l-1-6-1',
          type: 'theory',
          title: 'Binary Trees & Recursion Mental Model',
          mentalModel: {
            vi: `<strong>Mọi bài tree đều dạng</strong>: "Giả sử đã giải xong cho 2 subtree con, làm gì để có kết quả cho node hiện tại?" Đây là tư duy <strong>top-down recursion</strong> — TIN vào kết quả của recursive call.
<br/><br/>
Ví dụ tính chiều cao: <code>height(node) = 1 + max(height(left), height(right))</code>. KHÔNG cần biết left/right tính ra sao — chỉ cần tin chúng đúng. "Leap of faith" của recursion.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Recursion thực sự là gì?</h3>
<strong>1) Stack frame</strong>
Mỗi recursive call tạo 1 stack frame chứa: param, biến local, return address. Frame được push khi call, pop khi return. Java default stack ~500 KB → ~10k frame deep với function đơn giản.
<br/><br/>
<strong>2) Tree skewed = LL trá hình</strong>
Cây "skewed" (chỉ 1 nhánh) giống LinkedList. Recursion depth = n. Stack overflow trên n &gt; ~10k. Balanced tree: depth = log₂(n), 1M node = 20 frame → an toàn.
<br/><br/>
<strong>3) Tail call optimization (KHÔNG có trong Java)</strong>
Scala/Kotlin compile tail recursion thành loop. Java không. Nếu cần iterative, bạn TỰ viết với explicit Stack.
<br/><br/>
<strong>4) DFS vs BFS — tradeoff space</strong>
<ul>
<li>DFS: O(h) space (chiều cao). Cây balanced = O(log n). Tệ nhất O(n).</li>
<li>BFS: O(w) space (chiều rộng). Cây balanced = O(n/2) ≈ O(n). Tốt nhất O(1).</li>
</ul>`
          },
          theory: {
            vi: `<h3>Bốn cách duyệt</h3>
<ul>
  <li><strong>Pre-order</strong>: root → L → R. Xử lý root trước (vd: clone tree).</li>
  <li><strong>In-order</strong>: L → root → R. BST in-order = SORTED!</li>
  <li><strong>Post-order</strong>: L → R → root. Cần info từ children trước (vd: height, delete tree).</li>
  <li><strong>Level-order</strong> (BFS): dùng Queue.</li>
</ul>

<h3>The "Why" — BST vs HashMap?</h3>
<ul>
  <li>HashMap: O(1) average lookup, NHƯNG no order.</li>
  <li>BST/TreeMap: O(log n), sorted, hỗ trợ range query (floorKey, ceilingKey, subMap).</li>
  <li>Cần "key gần nhất X" — TreeMap chiến thắng.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên null check</strong> base case → NullPointerException trên leaf.</li>
  <li><strong>Trace recursion để debug</strong> → rối não. Nên TIN recursive call đúng, focus base + combine.</li>
  <li><strong>BST validate sai</strong>: chỉ check node-vs-children → tree không phải BST nhưng pass. Đúng: pass [lo, hi] bounds.</li>
  <li><strong>Modify tree khi traverse</strong> → infinite loop hoặc skip node. Build list rồi modify riêng.</li>
  <li><strong>Stack overflow trên skewed tree</strong> → convert sang iterative với Deque.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'TreeNode + traversals',
              code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { this.val = v; }
}

public void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);
    inorder(node.right, out);
}

public List<List<Integer>> levelOrder(TreeNode root) {
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
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Recursion thinking framework',
              prompt: `Cho bài tree mới. KHÔNG giải hộ. Hỏi tôi:
1. Bài có thể chia thành subproblem thế nào cho left, right?
2. Giả sử left và right đã trả kết quả đúng — kết hợp ra sao cho node hiện tại?
3. Base case (node == null) trả về gì?
4. Cần return gì lên trên — 1 giá trị hay nhiều?
5. Có cần biến global/instance cho max/result tracking không?
Áp dụng cho bài "diameter of binary tree".`
            },
            {
              title: 'BST validation common bug',
              prompt: `Bài "Validate BST". Mọi người fail vì chỉ check node-vs-direct-children. KHÔNG cho đáp án. Hỏi tôi:
1. Vẽ counter-example: cây mà mọi node-vs-children đúng nhưng KHÔNG phải BST.
2. Điều kiện BST đúng là gì? (Hint: mọi node trái phải nhỏ hơn root, không chỉ con trực tiếp)
3. Truyền thông tin "đang ở subtree trái của X" xuống recursion thế nào?
4. Helper cần 2 tham số gì? (lo, hi)`
            }
          ],
          exercises: [
            {
              title: 'Height of tree',
              prompt: 'Tính chiều cao binary tree recursive. Null = 0.',
              hints: [
                'Câu hỏi 1: Base case node == null trả gì?',
                'Câu hỏi 2: Combine left + right thế nào để có height của node hiện tại?'
              ],
              solution: {
                code: `public int height(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — thăm mỗi node 1 lần. Space O(h) stack depth. Worst skewed = O(n).',
                explanationVi: 'Post-order pattern: cần info từ children trước khi tính node. <code>1 +</code> = "thêm 1 cho node hiện tại".'
              }
            },
            {
              title: 'BST insert + search',
              prompt: 'Implement BST với insert(int) + boolean contains(int). Recursive.',
              hints: [
                'Câu hỏi 1: Insert vào subtree nào khi val &lt; node.val? &gt;?',
                'Câu hỏi 2: Return value của insert là gì? Vì sao "return new root"?'
              ],
              solution: {
                code: `class BST {
    private TreeNode root;

    public void insert(int val) { root = insertHelper(root, val); }

    private TreeNode insertHelper(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val)      node.left  = insertHelper(node.left, val);
        else if (val > node.val) node.right = insertHelper(node.right, val);
        return node;     // duplicates ignored
    }

    public boolean contains(int val) { return contains(root, val); }

    private boolean contains(TreeNode node, int val) {
        if (node == null) return false;
        if (val == node.val) return true;
        return val < node.val ? contains(node.left, val) : contains(node.right, val);
    }
}`,
                lang: 'java',
                complexityVi: 'Time: average O(log n), worst O(n) khi skewed (sorted insert). Space O(h) stack.',
                explanationVi: '"Return new root" pattern: helper trả node hiện tại (đã update children). Pattern này cực tiện cho insert/delete vì xử lý cả null base case sạch.'
              }
            },
            {
              title: 'Validate BST (đúng cách với bounds)',
              prompt: 'isValidBST(root) — chỉ check node-vs-children là SAI. Phải pass bounds.',
              hints: [
                'Câu hỏi 1: Khi đi xuống subtree LEFT, upper bound đổi không? Lower bound?',
                'Câu hỏi 2: Vì sao dùng <code>Long</code> cho bounds thay vì <code>int</code>?'
              ],
              solution: {
                code: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — thăm mỗi node 1 lần. Space O(h) stack.',
                explanationVi: '<code>long</code> tránh bug khi node.val = Integer.MIN_VALUE hoặc MAX_VALUE — bounds gốc Long.MIN/MAX an toàn. Đi LEFT: hi = node.val (mọi node trái phải &lt; node.val). Đi RIGHT: lo = node.val.'
              }
            }
          ]
        },

        {
          id: 'l-1-6-2',
          type: 'theory',
          title: 'PriorityQueue (Heap) — When You Need Min/Max Fast',
          mentalModel: {
            vi: `Heap = "<strong>cây nhị phân hoàn chỉnh</strong> với tính chất: parent ≤ children (min-heap) hoặc parent ≥ children (max-heap)". KHÔNG sorted hoàn toàn — chỉ ưu tiên root.
<br/><br/>
Hình dung mảng <code>heap[]</code>: parent của i là <code>(i-1)/2</code>, children là <code>2i+1, 2i+2</code>. Đó là lý do heap KHÔNG cần pointer.
<br/><br/>
Operations:
<ul>
<li><strong>peek</strong>: O(1) — luôn root.</li>
<li><strong>offer</strong>: O(log n) — sift up.</li>
<li><strong>poll</strong>: O(log n) — last vào root rồi sift down.</li>
</ul>`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Heap khác BST ở đâu?</strong>
BST: range query, sorted traversal — đắt. Heap: chỉ làm 1 việc (lấy min/max) — rẻ, compact (không pointer).
<br/><br/>
<strong>2) Build heap O(n) — NOT O(n log n)</strong>
Trick: sift-down từ CUỐI lên đầu. Hầu hết node ở đáy chỉ sift 0-1 step. Floyd's heap construction: tổng cost = sum của (heightOfSubtreeAt(i)) qua i từ 0..n/2 ≈ 2n. Đây là tối ưu kinh ngạc — viết "PriorityQueue(collection)" trong Java cũng dùng O(n).
<br/><br/>
<strong>3) Heap KHÔNG ổn định (stable)</strong>
2 element cùng priority có thể bị swap thứ tự. Nếu cần stable, lưu kèm "insertion index" làm tie-breaker.
<br/><br/>
<strong>4) Indexed priority queue</strong>
Heap thường KHÔNG hỗ trợ decrease-key O(log n) (cần biết position node trong heap). Dijkstra optimal cần indexed PQ — Java không có sẵn, phải tự code.`
          },
          theory: {
            vi: `<h3>The "Why" — Top-K vs sort?</h3>
<ul>
  <li>Cần TOP K, không cần thứ tự còn lại — heap size K, O(n log k).</li>
  <li>Sort O(n log n) — chậm hơn khi k &lt;&lt; n.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Mặc định Java PriorityQueue là MIN-heap</strong> → muốn max thì <code>Comparator.reverseOrder()</code>.</li>
  <li><strong>Top K LARGEST dùng MIN-heap</strong> (không phải max!). Nhầm = bug logic.</li>
  <li><strong>Comparator dùng <code>a.val - b.val</code></strong> → overflow với int lớn. Dùng <code>Integer.compare</code>.</li>
  <li><strong>Sửa priority của element sau khi offer</strong> → heap invariant broken. Phải poll + re-offer.</li>
  <li><strong>Iterate PriorityQueue</strong> → KHÔNG theo thứ tự sorted! Chỉ có poll() mới lấy theo thứ tự.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'PriorityQueue patterns',
              code: `// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Custom comparator cho object
PriorityQueue<int[]> byFreq = new PriorityQueue<>((a, b) -> a[1] - b[1]);

// Build heap O(n) từ collection
PriorityQueue<Integer> built = new PriorityQueue<>(Arrays.asList(5, 3, 8, 1));`
            }
          ],
          socraticPrompts: [
            {
              title: 'Khi nào heap?',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Bài có "top K" hay "K-th" hay "median"?
2. "Lúc nào cũng lấy min/max" trong khi data thay đổi?
3. Chỉ sort 1 lần xong rồi access theo thứ tự — heap lợi không?
4. Insert + lấy min trên stream — Array, BST, hay Heap?
5. Median-of-stream — vì sao 2 heap (min + max) là tối ưu?`
            }
          ],
          exercises: [
            {
              title: 'Kth Largest in Array',
              prompt: 'Tìm phần tử lớn thứ K. <em>Bonus: O(n log k) thay vì O(n log n) sort.</em>',
              hints: [
                'Câu hỏi 1: MIN-heap size K — vì sao MIN cho LARGEST? Top heap là gì sau khi xong?',
                'Câu hỏi 2: Khi heap size vượt K, làm gì?'
              ],
              solution: {
                code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();    // loại NHỎ NHẤT
    }
    return minHeap.peek();    // K phần tử lớn nhất còn lại, peek = K-th
}`,
                lang: 'java',
                complexityVi: 'Time O(n log k) — n lần offer/poll, mỗi O(log k). Space O(k).',
                explanationVi: 'Min-heap top = min trong group. Khi value mới &gt; top, swap. Cuối cùng heap chứa K phần tử lớn nhất; peek = K-th largest. Better than sort khi k &lt;&lt; n.'
              }
            },
            {
              title: 'Merge K sorted lists',
              prompt: 'Merge k LinkedList đã sort thành 1 sorted list. Optimal time.',
              hints: [
                'Câu hỏi 1: Brute concat-then-sort: O(N log N). Có cách dùng tính chất "đã sort" không?',
                'Câu hỏi 2: Heap chứa gì — value hay Node? Vì sao Node?'
              ],
              solution: {
                code: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

    // Push head của mỗi list
    for (ListNode head : lists) if (head != null) heap.offer(head);

    ListNode dummy = new ListNode(0), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode min = heap.poll();
        tail.next = min;
        tail = min;
        if (min.next != null) heap.offer(min.next);
    }
    return dummy.next;
}`,
                lang: 'java',
                complexityVi: 'Time O(N log k) — N = total nodes, k = số list. Mỗi node 1 offer + 1 poll, mỗi O(log k). Space O(k) cho heap.',
                explanationVi: 'Heap lưu Node để khi poll min, advance pointer của list đó (min.next) push lại heap. Heap size luôn ≤ k. Đây là pattern "K-way merge" — Hadoop/Spark cũng dùng.'
              }
            }
          ]
        }
      ]
    }
