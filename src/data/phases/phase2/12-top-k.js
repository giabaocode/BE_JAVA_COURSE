// Pattern 12 — Top 'K' Elements
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'topk',
  title: "Pattern 12 — Top 'K' Elements",
  mental: `Cần top K lớn/nhỏ/frequent? → <strong>Heap kích thước K</strong>. Top K LARGEST → <strong>MIN-heap</strong> (đẩy thằng nhỏ nhất ra). Top K SMALLEST → MAX-heap.
<br/><br/>
Time O(n log k) — tốt hơn sort O(n log n) khi k &lt;&lt; n.`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao MIN-heap cho top K LARGEST?</strong>
Nghe ngược đời. Lý do: cần ĐẨY THẰNG NHỎ NHẤT ra khi gặp giá trị lớn hơn. Min-heap top = min nhanh O(1). Cuối: heap chứa K thằng lớn nhất.
<br/><br/>
<strong>2) Quickselect — alternative O(n) average</strong>
Trung bình O(n) cho K-th largest. Worst O(n²). Trong interview thường dùng heap để code an toàn. Production có thể dùng quickselect.
<br/><br/>
<strong>3) Bucket sort cho top K frequent</strong>
Khi range của frequency hữu hạn (≤ n), bucket sort cho O(n) thay vì O(n log k). Trade space lấy time.
<br/><br/>
<strong>4) Custom comparator</strong>
<code>PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;&gt;((a, b) -&gt; a[1] - b[1])</code>. Cẩn thận overflow — dùng <code>Integer.compare</code>.
<br/><br/>
<strong>5) Top K Frequent Words</strong>
Cần tie-break: frequency ASC, rồi lexicographic DESC (vì heap đẩy thằng kém ra). Hoặc reverse comparator phù hợp.`,

  theory: `<h3>The "Why" — Top K vs Sort?</h3>
<ul>
  <li>Top K khi k &lt;&lt; n → heap O(n log k) thắng sort O(n log n).</li>
  <li>Stream — không thể sort (data đến từng phần) → heap update online.</li>
  <li>K-th element only (không cần full sort) → quickselect O(n).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>MAX-heap cho top K LARGEST</strong> (sai!) → time O(n + k log n). Đúng: min-heap size k → O(n log k).</li>
  <li><strong>Comparator <code>a - b</code></strong> overflow với int gần MAX_VALUE → dùng <code>Integer.compare</code>.</li>
  <li><strong>Iterate PriorityQueue</strong> KHÔNG theo thứ tự sorted. Chỉ <code>poll()</code> theo thứ tự.</li>
  <li><strong>Sửa priority sau offer</strong> → invariant phá. Phải poll + offer lại.</li>
  <li><strong>HashMap iteration order phụ thuộc JVM</strong> — không bao giờ rely. Dùng LinkedHashMap nếu cần.</li>
</ul>`,

  code: `// Top K largest dùng MIN-heap size k
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
for (int n : nums) {
    minHeap.offer(n);
    if (minHeap.size() > k) minHeap.poll();    // đẩy nhỏ nhất ra
}
// minHeap chứa k largest; peek = k-th largest`,

  prompts: [
    {
      title: 'Vì sao MIN-heap cho top K LARGEST?',
      prompt: `Sai lầm phổ biến. KHÔNG cho đáp án. Hỏi tôi:
1. Max-heap size = n, pop K lần — time?
2. Max-heap size = K, đẩy giá trị lớn vào — làm sao biết khi nào pop?
3. Min-heap size = K: top luôn là MIN trong group. Nếu giá trị mới &gt; top, swap. Vì sao đúng?
4. Trace với nums = [3,1,5,2,4], k=2.
5. Tổng phép so sánh? O(n log k) — đúng chưa?`
    }
  ],

  problems: [
    {
      id: 'p1', title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: LC('kth-largest-element-in-an-array'),
      hint: 'Min-heap size k.',
      hints: [
        'Câu hỏi 1: Min-heap size k. Top = min trong group → k-th largest overall.',
        'Câu hỏi 2: Bonus: Quickselect O(n) average — partition + recurse 1 half.'
      ],
      solution: {
        code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}`,
        lang: 'java',
        complexityVi: 'Time O(n log k) · Space O(k).',
        explanationVi: 'Min-heap size k. Push, pop nếu dư. Top = k-th largest.'
      }
    },
    {
      id: 'p2', title: 'Top K Frequent Elements', difficulty: 'Medium', url: LC('top-k-frequent-elements'),
      hint: 'Count + min-heap by freq.',
      hints: [
        'Câu hỏi 1: HashMap count → min-heap by frequency (size k).',
        'Câu hỏi 2: Bonus bucket sort O(n): bucket[freq] = list of elements.'
      ],
      solution: {
        code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int n : nums) count.merge(n, 1, Integer::sum);

    PriorityQueue<Map.Entry<Integer, Integer>> heap = new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());
    for (Map.Entry<Integer, Integer> e : count.entrySet()) {
        heap.offer(e);
        if (heap.size() > k) heap.poll();
    }
    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--) res[i] = heap.poll().getKey();
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log k) · Space O(n).',
        explanationVi: 'Count freq, min-heap by freq size k. Fill result reverse để có "most frequent first" (heap pop từ ít nhất).'
      }
    },
    {
      id: 'p3', title: 'K Closest Points to Origin', difficulty: 'Medium', url: LC('k-closest-points-to-origin'),
      hint: 'Max-heap theo distance.',
      hints: [
        'Câu hỏi 1: K CLOSEST = K smallest distance. Max-heap size K (top = max trong group).',
        'Câu hỏi 2: Distance² đủ — tránh sqrt (chậm + precision).'
      ],
      solution: {
        code: `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> distSq(b) - distSq(a));   // max-heap
    for (int[] p : points) {
        heap.offer(p);
        if (heap.size() > k) heap.poll();
    }
    int[][] res = new int[k][2];
    for (int i = 0; i < k; i++) res[i] = heap.poll();
    return res;
}

private int distSq(int[] p) { return p[0] * p[0] + p[1] * p[1]; }`,
        lang: 'java',
        complexityVi: 'Time O(n log k) · Space O(k).',
        explanationVi: 'Max-heap size k cho K SMALLEST. Top = max trong group → khi value mới &lt; top, swap.'
      }
    },
    {
      id: 'p4', title: 'Sort Characters By Frequency', difficulty: 'Medium', url: LC('sort-characters-by-frequency'),
      hint: 'Count + max-heap.',
      hints: [
        'Câu hỏi 1: Count, sort theo freq DESC, build string.',
        'Câu hỏi 2: Max-heap by freq → poll lần lượt, append freq times.'
      ],
      solution: {
        code: `public String frequencySort(String s) {
    Map<Character, Integer> count = new HashMap<>();
    for (char c : s.toCharArray()) count.merge(c, 1, Integer::sum);

    PriorityQueue<Map.Entry<Character, Integer>> heap = new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());
    heap.addAll(count.entrySet());

    StringBuilder sb = new StringBuilder();
    while (!heap.isEmpty()) {
        Map.Entry<Character, Integer> e = heap.poll();
        for (int i = 0; i < e.getValue(); i++) sb.append(e.getKey());
    }
    return sb.toString();
}`,
        lang: 'java',
        complexityVi: 'Time O(n + k log k) · Space O(k) heap, O(n) output.',
        explanationVi: 'Count, max-heap, poll và append. k = số ký tự distinct.'
      }
    },
    {
      id: 'p5', title: 'Top K Frequent Words', difficulty: 'Medium', url: LC('top-k-frequent-words'),
      hint: 'Custom comparator (freq asc, lex desc).',
      hints: [
        'Câu hỏi 1: Tie-break: freq cao trước, freq bằng → lex SMALL trước. Min-heap size k với comparator REVERSE để đẩy "kém" ra.',
        'Câu hỏi 2: Comparator: freq ASC (heap đẩy freq thấp), tie thì lex DESC (đẩy "z" trước).'
      ],
      solution: {
        code: `public List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> count = new HashMap<>();
    for (String w : words) count.merge(w, 1, Integer::sum);

    PriorityQueue<String> heap = new PriorityQueue<>((a, b) -> {
        int diff = count.get(a) - count.get(b);
        return diff != 0 ? diff : b.compareTo(a);   // freq ASC; lex DESC khi tie
    });
    for (String w : count.keySet()) {
        heap.offer(w);
        if (heap.size() > k) heap.poll();
    }
    LinkedList<String> res = new LinkedList<>();
    while (!heap.isEmpty()) res.addFirst(heap.poll());
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log k) · Space O(n).',
        explanationVi: 'Comparator: heap đẩy "kém" ra — freq thấp KÉM, lex DESC (z) kém. addFirst để output "tốt nhất" trước.'
      }
    },
    {
      id: 'p6', title: 'Find K Pairs with Smallest Sums', difficulty: 'Medium', url: LC('find-k-pairs-with-smallest-sums'),
      hint: 'Min-heap of pairs.',
      hints: [
        'Câu hỏi 1: Min-heap chứa indices (i, j) sort by sum.',
        'Câu hỏi 2: Khởi tạo (i, 0) cho mọi i. Pop k lần, mỗi pop push (i, j+1).'
      ],
      solution: {
        code: `public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
        (nums1[a[0]] + nums2[a[1]]) - (nums1[b[0]] + nums2[b[1]]));
    for (int i = 0; i < Math.min(nums1.length, k); i++) pq.offer(new int[]{i, 0});

    List<List<Integer>> res = new ArrayList<>();
    while (k-- > 0 && !pq.isEmpty()) {
        int[] p = pq.poll();
        res.add(Arrays.asList(nums1[p[0]], nums2[p[1]]));
        if (p[1] + 1 < nums2.length) pq.offer(new int[]{p[0], p[1] + 1});
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(k log k) · Space O(k).',
        explanationVi: 'Heap (i, j). Pop nhỏ nhất → push next candidate (i, j+1). Tránh duplicate vì mỗi (i, 0) start, advance theo j.'
      }
    },
    {
      id: 'p7', title: 'Kth Smallest in Sorted Matrix', difficulty: 'Medium', url: LC('kth-smallest-element-in-a-sorted-matrix'),
      hint: 'Min-heap of rows hoặc binary search.',
      hints: [
        'Câu hỏi 1: Heap: push (val, row, col) — pop k lần, mỗi pop push (val[row][col+1]).',
        'Câu hỏi 2: Bonus: BS trên value range [matrix[0][0], matrix[n-1][n-1]]. Count cells ≤ mid.'
      ],
      solution: {
        code: `public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int r = 0; r < Math.min(n, k); r++) heap.offer(new int[]{matrix[r][0], r, 0});

    int res = 0;
    for (int i = 0; i < k; i++) {
        int[] cur = heap.poll();
        res = cur[0];
        if (cur[2] + 1 < n) heap.offer(new int[]{matrix[cur[1]][cur[2] + 1], cur[1], cur[2] + 1});
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(k log n) · Space O(n).',
        explanationVi: 'K-way merge giữa n rows. Heap chứa head của mỗi row. Pop smallest, advance trong row đó.'
      }
    },
    {
      id: 'p8', title: 'Ugly Number II', difficulty: 'Medium', url: LC('ugly-number-ii'),
      hint: 'Min-heap of candidates.',
      hints: [
        'Câu hỏi 1: Ugly = chỉ chia hết 2, 3, 5. Min-heap khởi tạo {1}. Mỗi pop, push x*2, x*3, x*5.',
        'Câu hỏi 2: Dedupe với HashSet — vì 2*3 = 3*2 = 6.'
      ],
      solution: {
        code: `public int nthUglyNumber(int n) {
    PriorityQueue<Long> heap = new PriorityQueue<>();
    Set<Long> seen = new HashSet<>();
    heap.offer(1L); seen.add(1L);
    long ugly = 1;
    int[] factors = {2, 3, 5};
    for (int i = 0; i < n; i++) {
        ugly = heap.poll();
        for (int f : factors) {
            long next = ugly * f;
            if (seen.add(next)) heap.offer(next);
        }
    }
    return (int) ugly;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n).',
        explanationVi: 'Min-heap + HashSet dedupe. Pop nth ugly. Long vì n=1690 → ugly có thể overflow int.'
      }
    },
    {
      id: 'p9', title: 'Reorganize String', difficulty: 'Medium', url: LC('reorganize-string'),
      hint: 'Max-heap by freq.',
      hints: [
        'Câu hỏi 1: Max-heap by freq. Pop 2 khác nhau, append, decrement, push lại nếu &gt; 0.',
        'Câu hỏi 2: Edge case: max freq &gt; (n+1)/2 → impossible.'
      ],
      solution: {
        code: `public String reorganizeString(String s) {
    int[] count = new int[26];
    int maxC = 0;
    for (char c : s.toCharArray()) {
        count[c - 'a']++;
        maxC = Math.max(maxC, count[c - 'a']);
    }
    if (maxC > (s.length() + 1) / 2) return "";

    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[1] - a[1]);
    for (int i = 0; i < 26; i++) if (count[i] > 0) heap.offer(new int[]{i, count[i]});

    StringBuilder sb = new StringBuilder();
    while (heap.size() >= 2) {
        int[] a = heap.poll(), b = heap.poll();
        sb.append((char) ('a' + a[0])).append((char) ('a' + b[0]));
        if (--a[1] > 0) heap.offer(a);
        if (--b[1] > 0) heap.offer(b);
    }
    if (!heap.isEmpty()) sb.append((char) ('a' + heap.poll()[0]));
    return sb.toString();
}`,
        lang: 'java',
        complexityVi: 'Time O(n log 26) = O(n) · Space O(26).',
        explanationVi: 'Greedy: 2 ký tự khác nhau xen kẽ. Heap đảm bảo ưu tiên ký tự nhiều freq nhất.'
      }
    },
    {
      id: 'p10', title: 'Rearrange String k Distance Apart', difficulty: 'Hard', url: LC('rearrange-string-k-distance-apart'),
      hint: 'Heap + cooldown queue.',
      hints: [
        'Câu hỏi 1: Mở rộng Reorganize String với khoảng cách bất kỳ. Max-heap + cooldown queue size k-1.',
        'Câu hỏi 2: Pop từ heap, append, push vào cooldown. Khi cooldown đủ k items, pop oldest → push lại heap nếu count &gt; 0.'
      ],
      solution: {
        code: `public String rearrangeString(String s, int k) {
    if (k <= 1) return s;
    Map<Character, Integer> count = new HashMap<>();
    for (char c : s.toCharArray()) count.merge(c, 1, Integer::sum);

    PriorityQueue<Map.Entry<Character, Integer>> heap = new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());
    heap.addAll(count.entrySet());

    Queue<Map.Entry<Character, Integer>> cooldown = new ArrayDeque<>();
    StringBuilder sb = new StringBuilder();
    while (!heap.isEmpty()) {
        Map.Entry<Character, Integer> e = heap.poll();
        sb.append(e.getKey());
        e.setValue(e.getValue() - 1);
        cooldown.offer(e);
        if (cooldown.size() >= k) {
            Map.Entry<Character, Integer> front = cooldown.poll();
            if (front.getValue() > 0) heap.offer(front);
        }
    }
    return sb.length() == s.length() ? sb.toString() : "";
}`,
        lang: 'java',
        complexityVi: 'Time O(n log k) · Space O(n).',
        explanationVi: 'Heap + cooldown queue size k. Pop ký tự max freq, append, cooldown k items. Sau k iterations, release oldest về heap (nếu count còn).'
      }
    }
  ]
}
