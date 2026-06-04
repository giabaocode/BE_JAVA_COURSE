// Pattern 9 — Two Heaps
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: '2h',
  title: 'Pattern 9 — Two Heaps',
  prerequisites: { vi: 'Hoàn thành <code>Phase 1 Module 1.6</code> (PriorityQueue). Hiểu MinHeap vs MaxHeap comparator.' },
  mental: `Cần truy cập NHANH cả MIN và MAX của hai nửa dữ liệu? → <strong>Max-heap cho nửa nhỏ + Min-heap cho nửa lớn</strong>. Median = top heap lớn hơn (nếu lệch) hoặc trung bình 2 top.`,

  under: `<h3>First Principles</h3>
<strong>1) Invariant cần giữ</strong>
<ul>
<li>Mọi phần tử trong maxHeap (nửa nhỏ) ≤ mọi phần tử trong minHeap (nửa lớn).</li>
<li><code>|maxHeap.size() - minHeap.size()| ≤ 1</code>.</li>
</ul>
<br/><br/>
<strong>2) Insert algorithm — đảm bảo invariant</strong>
<pre>1. Push vào maxHeap (luôn).
2. Pop max của maxHeap, push vào minHeap (cân bằng).
3. Nếu minHeap.size() > maxHeap.size(), pop min minHeap, push vào maxHeap.</pre>
Sau 3 bước: invariant 1 (mọi phần tử maxHeap ≤ minHeap) đảm bảo nhờ bước 2. Invariant 2 (kích thước) đảm bảo nhờ bước 3.
<br/><br/>
<strong>3) Median query — O(1)</strong>
<ul>
<li>Lẻ tổng: top của heap lớn hơn.</li>
<li>Chẵn tổng: trung bình 2 top.</li>
</ul>
<br/><br/>
<strong>4) Sliding window median — lazy deletion</strong>
Heap KHÔNG support remove arbitrary O(log n). Trick: lazy delete — mark "to-be-deleted" trong HashMap, skip khi peek thấy stale.
<br/><br/>
<strong>5) IPO pattern</strong>
Min-heap by capital (cheapest available projects), max-heap by profit (best among available). Move projects từ capital heap sang profit heap khi đủ capital.`,

  theory: `<h3>The "Why" — Khi nào Two Heaps?</h3>
<ul>
  <li>Median streaming.</li>
  <li>Sliding window median.</li>
  <li>Schedule với 2 ràng buộc (capital vs profit).</li>
  <li>Cần MIN của một group + MAX của group khác cùng lúc.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên rebalance kích thước</strong> → median sai khi tổng số chẵn.</li>
  <li><strong>Skip "cross-check" giữa 2 heap</strong> → invariant phá vỡ (phần tử trong maxHeap &gt; phần tử trong minHeap).</li>
  <li><strong>Heap KHÔNG support remove(value) O(log n)</strong> — lazy deletion với HashMap.</li>
  <li><strong>Median chia int</strong>: <code>(a + b) / 2</code> overflow + lose precision. Dùng <code>(a + b) / 2.0</code> (double).</li>
  <li><strong>maxHeap = min-heap có Comparator.reverseOrder()</strong> — quên reverseOrder → bug ẩn.</li>
</ul>`,

  code: `PriorityQueue<Integer> lo = new PriorityQueue<>(Comparator.reverseOrder());  // max-heap
PriorityQueue<Integer> hi = new PriorityQueue<>();                                  // min-heap

void addNum(int n) {
    lo.offer(n);
    hi.offer(lo.poll());
    if (hi.size() > lo.size()) lo.offer(hi.poll());
}
double median() {
    return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
}`,

  prompts: [
    {
      title: 'Why two heaps for median?',
      prompt: `KHÔNG cho code. Hỏi tôi:
1. Naive: sort sau mỗi insert. Time? Vì sao tệ với stream lớn?
2. Insertion sort vào sorted list: O(n) per insert. Tốt hơn nhưng vẫn không tối ưu.
3. Median chỉ cần "phần tử ở giữa". Tôi cần biết thứ tự chính xác các phần tử khác không?
4. Chia 2 nửa "nhỏ hơn median" và "lớn hơn median", mỗi nửa cần biết gì?
5. Cấu trúc nào cho max trong O(1) + insert O(log n)? Heap!`
    }
  ],

  takeaways: [
    'Pattern: <strong>MaxHeap (smaller half)</strong> + <strong>MinHeap (larger half)</strong> để find median trong stream.',
    'Invariant: <code>|maxHeap.size - minHeap.size| &lt;= 1</code>. Median = top maxHeap, hoặc avg 2 tops.',
    'Insert O(log n), find median O(1).',
    'Use cases: median of data stream, find right interval, IPO (maximize capital).',
    'Pitfall: quên reverse comparator cho MaxHeap (<code>(a,b) -&gt; b-a</code>); rebalance sai khi size lệch &gt; 1.'
  ],

  problems: [
    {
      id: 'p1', title: 'Find Median from Data Stream', difficulty: 'Hard', url: LC('find-median-from-data-stream'),
      hint: 'Two heaps kinh điển.',
      hints: [
        'Câu hỏi 1: Naive sort O(n log n) per add. Two heaps O(log n) per add + O(1) median.',
        'Câu hỏi 2: Insert thuật toán 3 bước (push lo → balance → check size). Vì sao đảm bảo invariant?'
      ],
      solution: {
        code: `class MedianFinder {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Comparator.reverseOrder());  // max-heap
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();                            // min-heap

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) per addNum, O(1) per findMedian. Space O(n).',
        explanationVi: 'Two heaps invariant: maxHeap ≤ minHeap, |size diff| ≤ 1. Insert 3 bước đảm bảo. Median = top heap lớn hơn hoặc avg của 2 top.'
      }
    },
    {
      id: 'p2', title: 'Sliding Window Median', difficulty: 'Hard', url: LC('sliding-window-median'),
      hint: 'Two heaps + lazy deletion.',
      hints: [
        'Câu hỏi 1: Median rolling window. Two heaps + LAZY deletion (mark, skip).',
        'Câu hỏi 2: TreeMap thay thế cũng work — sortedMultiset O(log n) remove.'
      ],
      solution: {
        code: `public double[] medianSlidingWindow(int[] nums, int k) {
    TreeSet<Integer> lo = new TreeSet<>((a, b) -> nums[a] == nums[b] ? a - b : Integer.compare(nums[a], nums[b]));
    TreeSet<Integer> hi = new TreeSet<>(lo.comparator());
    double[] res = new double[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        lo.add(i);
        hi.add(lo.pollLast());
        if (hi.size() > lo.size()) lo.add(hi.pollFirst());

        if (i >= k - 1) {
            res[i - k + 1] = k % 2 == 1
                ? (double) nums[lo.last()]
                : ((double) nums[lo.last()] + nums[hi.first()]) / 2.0;

            int toRemove = i - k + 1;
            if (!lo.remove(toRemove)) hi.remove(toRemove);
            if (lo.size() > hi.size() + 1) hi.add(lo.pollLast());
            else if (hi.size() > lo.size()) lo.add(hi.pollFirst());
        }
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log k) · Space O(k).',
        explanationVi: 'TreeSet store INDEX (tie-break bằng index khi value bằng). Insert + remove đều O(log k). Rebalance sau mỗi remove để giữ invariant kích thước.'
      }
    },
    {
      id: 'p3', title: 'IPO', difficulty: 'Hard', url: LC('ipo'),
      hint: 'Min-heap capital + max-heap profit.',
      hints: [
        'Câu hỏi 1: Sort projects theo capital ASC. Min-heap by capital cho "chưa eligible". Max-heap by profit cho "eligible".',
        'Câu hỏi 2: Mỗi iteration: move eligible projects sang max-heap, pick top profit.'
      ],
      solution: {
        code: `public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;
    PriorityQueue<int[]> byCapital = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> byProfit = new PriorityQueue<>(Comparator.reverseOrder());

    for (int i = 0; i < n; i++) byCapital.offer(new int[]{capital[i], profits[i]});

    for (int i = 0; i < k; i++) {
        while (!byCapital.isEmpty() && byCapital.peek()[0] <= w) {
            byProfit.offer(byCapital.poll()[1]);
        }
        if (byProfit.isEmpty()) break;
        w += byProfit.poll();
    }
    return w;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n).',
        explanationVi: 'Greedy + two heaps. Move projects affordable (capital ≤ w) sang profit-heap, pick best profit. Repeat k lần.'
      }
    },
    {
      id: 'p4', title: 'Find Right Interval', difficulty: 'Medium', url: LC('find-right-interval'),
      hint: 'TreeMap thay heap.',
      hints: [
        'Câu hỏi 1: Cho mỗi interval, tìm right interval (start ≥ end của interval này). Cần "smallest start ≥ key".',
        'Câu hỏi 2: TreeMap<start, originalIndex>. Dùng <code>ceilingKey(end)</code>.'
      ],
      solution: {
        code: `public int[] findRightInterval(int[][] intervals) {
    TreeMap<Integer, Integer> map = new TreeMap<>();
    for (int i = 0; i < intervals.length; i++) map.put(intervals[i][0], i);

    int[] res = new int[intervals.length];
    for (int i = 0; i < intervals.length; i++) {
        Integer key = map.ceilingKey(intervals[i][1]);
        res[i] = key == null ? -1 : map.get(key);
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n).',
        explanationVi: 'TreeMap floorKey/ceilingKey O(log n). <code>ceilingKey(end)</code> = smallest start ≥ end → right interval. Trả index gốc.'
      }
    },
    {
      id: 'p5', title: 'Kth Largest Element in a Stream', difficulty: 'Easy', url: LC('kth-largest-element-in-a-stream'),
      hint: 'Min-heap size k.',
      hints: [
        'Câu hỏi 1: Min-heap size = k. Top luôn là k-th largest.',
        'Câu hỏi 2: Insert: push vào heap, nếu size > k thì pop. Return peek.'
      ],
      solution: {
        code: `class KthLargest {
    private final PriorityQueue<Integer> heap = new PriorityQueue<>();
    private final int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int n : nums) add(n);
    }

    public int add(int val) {
        heap.offer(val);
        if (heap.size() > k) heap.poll();
        return heap.peek();
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(log k) per add. Space O(k).',
        explanationVi: 'Min-heap size k. Top = min trong group = k-th largest overall. Push, pop nếu dư.'
      }
    },
    {
      id: 'p6', title: 'Find K Pairs with Smallest Sums', difficulty: 'Medium', url: LC('find-k-pairs-with-smallest-sums'),
      hint: 'Min-heap of pairs.',
      hints: [
        'Câu hỏi 1: Min-heap chứa pair (i, j) sort theo nums1[i] + nums2[j]. Pop k lần.',
        'Câu hỏi 2: Optimize: chỉ push từ (i, 0) ban đầu, mỗi pop push (i, j+1) → tránh duplicate.'
      ],
      solution: {
        code: `public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> (nums1[a[0]] + nums2[a[1]]) - (nums1[b[0]] + nums2[b[1]]));
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
        explanationVi: 'Heap chứa pair index, sort by sum. Pop k smallest. Push (i, j+1) khi pop (i, j) — đảm bảo cover next candidate trong row đó.'
      }
    },
    {
      id: 'p7', title: 'Last Stone Weight', difficulty: 'Easy', url: LC('last-stone-weight'),
      hint: 'Max-heap warm-up.',
      hints: [
        'Câu hỏi 1: Max-heap. Pop 2 largest, push diff. Repeat đến khi ≤ 1 stone.',
        'Câu hỏi 2: Time O(n log n).'
      ],
      solution: {
        code: `public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.reverseOrder());
    for (int s : stones) heap.offer(s);
    while (heap.size() > 1) {
        int a = heap.poll(), b = heap.poll();
        if (a != b) heap.offer(a - b);
    }
    return heap.isEmpty() ? 0 : heap.peek();
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n).',
        explanationVi: 'Max-heap. Smash 2 stones largest → diff. Loop đến size ≤ 1.'
      }
    },
    {
      id: 'p8', title: 'Reorganize String', difficulty: 'Medium', url: LC('reorganize-string'),
      hint: 'Max-heap by freq.',
      hints: [
        'Câu hỏi 1: Count freq. Max-heap. Pop 2 chars khác nhau, append, decrement, push lại nếu count &gt; 0.',
        'Câu hỏi 2: Edge case: max freq &gt; (n+1)/2 → impossible.'
      ],
      solution: {
        code: `public String reorganizeString(String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;
    int maxCount = 0;
    for (int c : count) maxCount = Math.max(maxCount, c);
    if (maxCount > (s.length() + 1) / 2) return "";

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
        explanationVi: 'Greedy: pop 2 most frequent khác nhau, append. Đảm bảo no adjacent same. Edge case: max freq quá lớn → impossible.'
      }
    },
    {
      id: 'p9', title: 'Task Scheduler', difficulty: 'Medium', url: LC('task-scheduler'),
      hint: 'Max-heap + cooldown queue.',
      hints: [
        'Câu hỏi 1: Greedy: process task có count cao nhất trước (max-heap). Sau process, cooldown n cycles.',
        'Câu hỏi 2: Formula: <code>max(n_tasks, (maxCount-1)*(n+1) + countOfMax)</code>.'
      ],
      solution: {
        code: `public int leastInterval(char[] tasks, int n) {
    int[] count = new int[26];
    for (char t : tasks) count[t - 'A']++;
    int maxCount = 0, numMax = 0;
    for (int c : count) {
        if (c > maxCount) { maxCount = c; numMax = 1; }
        else if (c == maxCount) numMax++;
    }
    return Math.max(tasks.length, (maxCount - 1) * (n + 1) + numMax);
}`,
        lang: 'java',
        complexityVi: 'Time O(n + 26) = O(n) · Space O(26).',
        explanationVi: 'Math approach: phần "frame" rộng (n+1) cho task max-freq, lặp (maxCount-1) lần, cộng numMax cho task cuối. Max với n_tasks vì không thể ngắn hơn số task.'
      }
    },
    {
      id: 'p10', title: 'Maximum Performance of a Team', difficulty: 'Hard', url: LC('maximum-performance-of-a-team'),
      hint: 'Sort efficiency, min-heap speed.',
      hints: [
        'Câu hỏi 1: Performance = sum(speed) × min(efficiency). Sort theo efficiency DESC. Mỗi engineer i là "min efficiency", speed cộng từ heap.',
        'Câu hỏi 2: Min-heap size k cho speeds — giữ top k speeds lớn nhất.'
      ],
      solution: {
        code: `public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> efficiency[b] - efficiency[a]);

    PriorityQueue<Integer> heap = new PriorityQueue<>();
    long sumSpeed = 0, best = 0;
    for (int i : idx) {
        heap.offer(speed[i]);
        sumSpeed += speed[i];
        if (heap.size() > k) sumSpeed -= heap.poll();
        best = Math.max(best, sumSpeed * efficiency[i]);
    }
    return (int) (best % 1_000_000_007);
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n).',
        explanationVi: 'Sort efficiency DESC. Tại mỗi i, i là min efficiency. Min-heap of speeds — drop smallest khi size &gt; k. Track best performance.'
      }
    }
  ],
  references: [
    { title: 'Median of Stream -LeetCode', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    { title: 'Two Heaps pattern guide', url: 'https://emre.me/coding-patterns/two-heaps/' }
  ]

}
