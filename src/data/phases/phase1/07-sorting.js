// ============================================================================
//  PHASE 1 — Module 1.7: Advanced Sorting & Divide and Conquer (Merge Sort + Quick Sort)
// ============================================================================

export default
    {
      id: 'mod-1-7',
      title: 'Advanced Sorting & Divide and Conquer (Merge Sort + Quick Sort)',
      lessons: [

        // ----- l-1-7-1: D&C foundations -----
        {
          id: 'l-1-7-1',
          type: 'theory',
          title: 'Divide & Conquer — Mental Model & Recursion Tree',
          subtitle: { en: 'Split, solve, combine', vi: 'Chia, giải, gộp — kiến trúc đẹp nhất trong thuật toán' },
          mentalModel: {
            vi: `<strong>Divide and Conquer</strong> = đệ quy có cấu trúc. Mỗi bài toán giải bằng 3 bước:
<ol>
<li><strong>Divide</strong> — chia bài thành ≥ 2 subproblem nhỏ hơn (giống nhau về bản chất).</li>
<li><strong>Conquer</strong> — giải mỗi subproblem (đệ quy). Base case: bài đủ nhỏ → giải thẳng.</li>
<li><strong>Combine</strong> — gộp lời giải subproblem để có lời giải tổng.</li>
</ol>

<strong>Recursion tree</strong>: vẽ ra cây các call. Mỗi level làm tổng O(n) công. Có log₂(n) level. Tổng cost = n × log n = <strong>O(n log n)</strong>. Đây là vì sao Merge Sort, Quick Sort, FFT đều O(n log n).
<br/><br/>
<strong>Câu thần chú</strong>: "Tôi tin rằng đệ quy đã giải đúng cho subproblem nhỏ. Việc của tôi chỉ là combine."`
          },
          underTheHood: {
            vi: `<h3>First Principles — Recursion tree & stack frames</h3>
<strong>1) Stack frames qua recursion</strong>
Mỗi recursive call push 1 frame: chứa param, local var, return address. Frame size ~50-200 byte. Stack default Java = 512 KB → max depth ~5k-10k frame an toàn.
<br/><br/>
Cho mergeSort trên mảng 1M phần tử: depth = log₂(1M) ≈ 20 frame. Cực an toàn. Cho quicksort skewed (pivot tệ): depth = n = 1M → STACK OVERFLOW.
<br/><br/>
<strong>2) Visualizing recursion tree</strong>
<pre>
mergeSort([1,2,3,4,5,6,7,8]) — n=8
├── mergeSort([1,2,3,4]) — n=4
│   ├── mergeSort([1,2]) — n=2
│   │   ├── mergeSort([1]) — base
│   │   └── mergeSort([2]) — base
│   └── mergeSort([3,4]) — n=2
└── mergeSort([5,6,7,8]) — n=4
    ├── ...
</pre>
Level 0: 1 call, work n.
Level 1: 2 call, mỗi work n/2 → tổng n.
Level 2: 4 call, mỗi work n/4 → tổng n.
Level k: 2^k call, mỗi work n/2^k → tổng n.
Tổng: n × log₂(n) levels = O(n log n).
<br/><br/>
<strong>3) Master Theorem</strong>
Cho công thức T(n) = a·T(n/b) + f(n) (đệ quy chia thành a subproblem size n/b, cộng f(n) công combine).
<ul>
<li>Nếu f(n) = O(n^c) với c &lt; log_b(a) → T(n) = Θ(n^log_b(a))</li>
<li>Nếu f(n) = Θ(n^log_b(a)) → T(n) = Θ(n^log_b(a) · log n)</li>
<li>Nếu f(n) = Ω(n^c) với c &gt; log_b(a) → T(n) = Θ(f(n))</li>
</ul>
Merge sort: a=2, b=2, f(n)=O(n). log_2(2) = 1, c=1 → case 2 → Θ(n log n). ✓`
          },
          theory: {
            vi: `<h3>The "Why" — Vì sao D&C mạnh?</h3>
<ul>
  <li><strong>Cache friendly</strong>: subproblem nhỏ thường vừa cache → tốc độ thực tế tốt hơn O() suy ra.</li>
  <li><strong>Parallelizable</strong>: 2 subproblem độc lập có thể chạy trên 2 core khác nhau. Java ForkJoinPool tận dụng.</li>
  <li><strong>Predictable performance</strong>: O(n log n) cho mọi input của Merge Sort. Quick Sort trung bình O(n log n).</li>
  <li><strong>Reusable</strong>: pattern áp dụng cho sort, search, multiplication, FFT, closest pair, ...</li>
</ul>

<h3>Junior Pitfalls — D&C</h3>
<ul>
  <li><strong>Quên base case</strong> → infinite recursion → StackOverflowError.</li>
  <li><strong>Subproblem không nhỏ hơn</strong> (vd: chia [l, r] thành [l, r] và [l+1, r]) → cũng infinite.</li>
  <li><strong>Combine sai</strong> → toàn bộ recursion vô nghĩa. Test combine với subproblem nhỏ trước.</li>
  <li><strong>Chia không đều</strong> (vd: 1 và n-1) → unbalanced tree depth = n → O(n²) worst.</li>
  <li><strong>Allocate array mới ở mỗi call</strong> → memory pressure. Reuse buffer khi có thể.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'D&C template tổng quát',
              code: `// Template generic
public Result solve(Problem p) {
    // 1. Base case
    if (p.isSmallEnough()) return solveDirect(p);

    // 2. Divide
    Problem[] subs = p.divide();

    // 3. Conquer (recursive)
    Result[] subResults = new Result[subs.length];
    for (int i = 0; i < subs.length; i++) {
        subResults[i] = solve(subs[i]);
    }

    // 4. Combine
    return combine(subResults);
}`
            },
            {
              title: 'Power(x, n) — O(log n) via D&C',
              code: `// Naive O(n): nhân x với chính nó n lần.
// D&C O(log n): chia n đôi, đệ quy.
public double myPow(double x, int n) {
    if (n == 0) return 1.0;
    if (n < 0) return 1.0 / myPow(x, -n);
    double half = myPow(x, n / 2);
    if (n % 2 == 0) return half * half;
    else            return half * half * x;
}
// T(n) = T(n/2) + O(1) → Θ(log n) by Master Theorem (a=1, b=2, c=0)`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự suy luận D&C',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 3 bước D&C là gì? Cho ví dụ từ đời thực (không thuật toán) — chia việc trong gia đình chẳng hạn.
2. Vì sao subproblem phải nhỏ hơn? Hậu quả nếu không?
3. Vẽ recursion tree cho mergeSort mảng 8 phần tử. Mỗi level làm bao nhiêu công?
4. Tại sao O(n log n) chứ không O(n × n)? (Hint: tổng công per level, không phải sum của số call)
5. Quicksort worst case O(n²) — recursion tree skewed thế nào?
Dẫn tôi qua từng câu.`
            },
            {
              title: 'Recursion vs iteration tradeoff',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Recursion sạch hơn iteration cho D&C — vì sao?
2. Khi nào recursion gây StackOverflowError? Cho con số cụ thể.
3. Convert quicksort sang iterative thế nào? Stack of (lo, hi) tuples?
4. Tail recursion là gì? Java có optimize không?
5. Khi nào tránh recursion — production code có quy ước gì?`
            }
          ],
          exercises: [
            {
              title: 'Maximum Subarray bằng D&C',
              prompt: 'Kadane là DP O(n). Bonus: viết bằng D&C O(n log n). Hint: max subarray nằm ở left subarray, right subarray, hoặc CROSS giữa.',
              hints: [
                'Câu hỏi 1: 3 case max subarray nằm ở đâu? Tính mỗi case ra sao?',
                'Câu hỏi 2: Crossing max — start ở mid, mở rộng 2 phía. Time complexity?'
              ],
              solution: {
                code: `public int maxSubArray(int[] nums) {
    return divide(nums, 0, nums.length - 1);
}

private int divide(int[] nums, int lo, int hi) {
    if (lo == hi) return nums[lo];                      // base case
    int mid = lo + (hi - lo) / 2;
    int leftMax  = divide(nums, lo, mid);
    int rightMax = divide(nums, mid + 1, hi);
    int crossMax = crossing(nums, lo, mid, hi);
    return Math.max(Math.max(leftMax, rightMax), crossMax);
}

private int crossing(int[] nums, int lo, int mid, int hi) {
    int sum = 0, leftSum = Integer.MIN_VALUE;
    for (int i = mid; i >= lo; i--) {
        sum += nums[i];
        leftSum = Math.max(leftSum, sum);
    }
    sum = 0;
    int rightSum = Integer.MIN_VALUE;
    for (int i = mid + 1; i <= hi; i++) {
        sum += nums[i];
        rightSum = Math.max(rightSum, sum);
    }
    return leftSum + rightSum;
}`,
                lang: 'java',
                complexityVi: 'Time O(n log n) — T(n) = 2T(n/2) + O(n). Master Theorem case 2. Space O(log n) stack.',
                explanationVi: 'Kadane DP nhanh hơn (O(n)) nhưng D&C version dạy bạn cách tổ chức "3 case combine" — pattern cho closest-pair-of-points, count inversion, ...'
              }
            },
            {
              title: 'Power(x, n) iterative version',
              prompt: 'myPow(x, n) — convert recursive sang iterative (bit manipulation). Vẫn O(log n).',
              hints: [
                'Câu hỏi 1: Đệ quy chia n đôi → biểu diễn n trong base 2 có ý nghĩa gì?',
                'Câu hỏi 2: Mỗi bit của n: 0 hay 1, quyết định nhân result với x^(current_power) không?'
              ],
              solution: {
                code: `public double myPow(double x, int n) {
    long N = n;                       // long để handle n = Integer.MIN_VALUE
    if (N < 0) { x = 1 / x; N = -N; }
    double result = 1.0;
    while (N > 0) {
        if ((N & 1) == 1) result *= x;   // bit 1 → multiply
        x *= x;                            // square base
        N >>= 1;                           // next bit
    }
    return result;
}`,
                lang: 'java',
                complexityVi: 'Time O(log n) — n có log₂(n) bit. Space O(1) — không recursion.',
                explanationVi: 'Exponentiation by squaring. n = sum của bit×2^i. <code>x^n = x^(b0·1) × x^(b1·2) × x^(b2·4) × ...</code>. Loop qua bit, mỗi step square x. Khi bit = 1, multiply vào result. <code>long N</code> tránh overflow khi <code>n = Integer.MIN_VALUE</code> (do <code>-MIN_VALUE</code> overflow int).'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              '3 bước D&C: Divide → Conquer → Combine.',
              'Recursion tree giúp visualize complexity — tổng work per level × số level.',
              'Master Theorem là công cụ tính O() cho mọi đệ quy chia đều.',
              'Cẩn thận stack overflow trên recursion deep hoặc skewed.',
              'Subproblem PHẢI nhỏ hơn — nếu không infinite recursion.'
            ]
          }
        },

        // ----- l-1-7-2: Merge Sort -----
        {
          id: 'l-1-7-2',
          type: 'practice',
          title: 'Merge Sort — Stable, Predictable, External-Sort Friendly',
          mentalModel: {
            vi: `<strong>Merge Sort</strong>:
<ol>
<li>Chia mảng làm đôi (mid).</li>
<li>Đệ quy sort 2 nửa.</li>
<li>Merge 2 nửa đã sort thành 1 mảng sort (linear scan).</li>
</ol>

Recursion tree: depth log₂(n). Mỗi level merge tổng n element → O(n log n) MỌI input (best/average/worst đều giống).
<br/><br/>
<strong>Stable</strong>: 2 phần tử bằng nhau giữ thứ tự gốc → quan trọng khi sort theo nhiều tiêu chí.`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Time: O(n log n) GUARANTEED</strong>
Khác Quick Sort có worst O(n²), Merge Sort luôn n log n. Java's Arrays.sort cho object dùng <strong>Timsort</strong> (Merge Sort tối ưu cho gần-sorted) chính vì điều này — predictable.
<br/><br/>
<strong>2) Space: O(n) extra</strong>
Cần buffer để merge. Đây là nhược điểm vs Quick Sort (in-place). Trên RAM hạn chế, Quick Sort thắng. Nhưng cho <strong>external sort</strong> (data &gt; RAM, sort từ disk), Merge Sort là CHUẨN — vì merge chỉ cần đọc 2 stream tuần tự.
<br/><br/>
<strong>3) Iterative bottom-up</strong>
Có thể viết Merge Sort iterative: merge cặp size 1 → size 2 → size 4 → ... Tiết kiệm stack, dễ parallelize.
<br/><br/>
<strong>4) Stable property</strong>
Khi merge, nếu <code>left[i] == right[j]</code>, lấy <code>left[i]</code> TRƯỚC. Đảm bảo phần tử trái (xuất hiện trước trong mảng gốc) giữ vị trí trước. Mất stability nếu lấy <code>right[j]</code> trước.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào Merge Sort?</h3>
<ul>
  <li><strong>Cần stability</strong> (sort theo nhiều criteria).</li>
  <li><strong>External sort</strong> (data lớn hơn RAM).</li>
  <li><strong>Linked list sort</strong> — Merge Sort tự nhiên cho LL (split bằng tortoise/hare). Quick Sort tệ cho LL.</li>
  <li><strong>Parallel</strong> — 2 subproblem độc lập, chia cho 2 core. ForkJoinPool ideal.</li>
  <li><strong>Cần predictable performance</strong> — system real-time.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Allocate array mới mỗi recursion</strong> → memory thrashing. Allocate 1 buffer dùng chung.</li>
  <li><strong>Index sai khi merge</strong> — off-by-one ở boundary. Test với mảng 2-3 phần tử trước.</li>
  <li><strong>Mất stability</strong> khi merge nếu so <code>&gt;</code> thay vì <code>&gt;=</code>. Cẩn thận điều kiện.</li>
  <li><strong>Forget copy lại buffer</strong> sau merge → kết quả bị overwrite ở recursion tiếp.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Merge Sort — recursive với buffer chung',
              code: `public class MergeSorter {
    public void sort(int[] arr) {
        int[] buf = new int[arr.length];     // 1 buffer dùng chung, KHÔNG allocate mỗi call
        sort(arr, buf, 0, arr.length - 1);
    }

    private void sort(int[] arr, int[] buf, int lo, int hi) {
        if (lo >= hi) return;                 // base case: 0 hoặc 1 phần tử
        int mid = lo + (hi - lo) / 2;
        sort(arr, buf, lo, mid);
        sort(arr, buf, mid + 1, hi);
        merge(arr, buf, lo, mid, hi);
    }

    private void merge(int[] arr, int[] buf, int lo, int mid, int hi) {
        // Copy phần cần merge vào buf
        for (int k = lo; k <= hi; k++) buf[k] = arr[k];

        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            if (buf[i] <= buf[j]) arr[k++] = buf[i++];   // <= giữ STABLE
            else                  arr[k++] = buf[j++];
        }
        // Phần còn lại của nửa trái (nếu có) — phần phải đã ở đúng chỗ
        while (i <= mid) arr[k++] = buf[i++];
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Suy luận Merge Sort',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 3 bước D&C cho Merge Sort là gì cụ thể?
2. Merge 2 nửa đã sort — 2 con trỏ duyệt. Cần buffer riêng không? Vì sao?
3. Vẽ recursion tree cho mảng [5,2,4,7,1,3,6,8]. Mỗi level merge bao nhiêu phần tử?
4. Vì sao O(n log n) là cận DƯỚI cho sort comparison-based?
5. External sort: data 1TB, RAM 8GB — Merge Sort vận hành thế nào với disk?`
            },
            {
              title: 'Stable sort intuition',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Sort theo 2 tiêu chí (rating DESC, rồi date ASC) — cần stable sort? Vì sao?
2. Strategy: sort theo tiêu chí PHỤ trước, rồi tiêu chí CHÍNH với stable sort. Vì sao đúng?
3. Quick Sort không stable — workaround: nhét index vào key. Trade-off?
4. Java's Arrays.sort cho int[] là Quick Sort (unstable). Cho Object[] là Timsort (stable). Vì sao khác biệt?`
            }
          ],
          exercises: [
            {
              title: 'Implement Merge Sort iterative (bottom-up)',
              prompt: 'Tránh recursion. Merge cặp size 1 → 2 → 4 → ...',
              hints: [
                'Câu hỏi 1: Vòng ngoài tăng <code>size = 1, 2, 4, ...</code> đến khi ≥ n. Vòng trong làm gì?',
                'Câu hỏi 2: Block cuối có thể không đủ <code>size</code> phần tử — xử lý ra sao?'
              ],
              solution: {
                code: `public void mergeSortIter(int[] arr) {
    int n = arr.length;
    int[] buf = new int[n];
    for (int size = 1; size < n; size *= 2) {
        for (int lo = 0; lo < n - size; lo += 2 * size) {
            int mid = lo + size - 1;
            int hi = Math.min(lo + 2 * size - 1, n - 1);   // boundary cuối có thể lệch
            merge(arr, buf, lo, mid, hi);
        }
    }
}

private void merge(int[] arr, int[] buf, int lo, int mid, int hi) {
    for (int k = lo; k <= hi; k++) buf[k] = arr[k];
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
        if (buf[i] <= buf[j]) arr[k++] = buf[i++];
        else                  arr[k++] = buf[j++];
    }
    while (i <= mid) arr[k++] = buf[i++];
}`,
                lang: 'java',
                complexityVi: 'Time O(n log n). Space O(n) buffer. Stack O(1) — không recursion.',
                explanationVi: 'Bottom-up: bắt đầu từ block size 1 (mỗi phần tử là 1 group sorted trivially), merge cặp thành size 2, rồi 4, 8, ... <code>Math.min(..., n-1)</code> xử lý block cuối ngắn hơn 2×size. Tránh StackOverflow trên mảng RẤT lớn.'
              }
            },
            {
              title: 'Count Inversions (sử dụng Merge Sort)',
              prompt: 'Cho mảng, đếm "inversion" = số cặp (i, j) với i &lt; j và arr[i] &gt; arr[j]. Vd [2,4,1,3,5] có 3 inversions: (2,1), (4,1), (4,3). Optimal O(n log n).',
              hints: [
                'Câu hỏi 1: Brute O(n²) check mọi cặp. Merge Sort cho phép đếm trong khi sort — đếm ở bước nào?',
                'Câu hỏi 2: Khi merge, lấy phần tử từ RIGHT half — bao nhiêu phần tử ở LEFT half còn lại vẫn lớn hơn nó? Đó là inversion gì?'
              ],
              solution: {
                code: `public long countInversions(int[] arr) {
    int[] buf = new int[arr.length];
    return mergeSortCount(arr, buf, 0, arr.length - 1);
}

private long mergeSortCount(int[] arr, int[] buf, int lo, int hi) {
    if (lo >= hi) return 0;
    int mid = lo + (hi - lo) / 2;
    long count = mergeSortCount(arr, buf, lo, mid)
               + mergeSortCount(arr, buf, mid + 1, hi);
    count += mergeCount(arr, buf, lo, mid, hi);
    return count;
}

private long mergeCount(int[] arr, int[] buf, int lo, int mid, int hi) {
    for (int k = lo; k <= hi; k++) buf[k] = arr[k];
    int i = lo, j = mid + 1, k = lo;
    long count = 0;
    while (i <= mid && j <= hi) {
        if (buf[i] <= buf[j]) {
            arr[k++] = buf[i++];
        } else {
            arr[k++] = buf[j++];
            count += (mid - i + 1);     // tất cả phần tử LEFT còn lại > buf[j]
        }
    }
    while (i <= mid) arr[k++] = buf[i++];
    return count;
}`,
                lang: 'java',
                complexityVi: 'Time O(n log n) — cùng cấu trúc Merge Sort, thêm count O(1) per swap. Space O(n) buffer.',
                explanationVi: 'Trick: khi merge, lấy <code>buf[j]</code> (RIGHT) trước <code>buf[i]</code> (LEFT) → CÓ <code>mid - i + 1</code> phần tử ở LEFT half lớn hơn <code>buf[j]</code> → đó chính là <code>mid - i + 1</code> inversion. Cộng dồn. Đếm trong khi sort = bonus free.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Merge Sort: stable, O(n log n) MỌI input, O(n) extra space.',
              'External sort, LL sort, parallel sort — Merge Sort thắng Quick Sort.',
              'Iterative bottom-up tránh stack overflow trên mảng cực lớn.',
              'Merge step: <code>&lt;=</code> để giữ stability.'
            ]
          }
        },

        // ----- l-1-7-3: Quick Sort -----
        {
          id: 'l-1-7-3',
          type: 'practice',
          title: 'Quick Sort — Fastest In Practice, Pivot Selection Is Everything',
          mentalModel: {
            vi: `<strong>Quick Sort</strong>:
<ol>
<li>Chọn <strong>pivot</strong> (một phần tử trong mảng).</li>
<li>Partition: sắp xếp sao cho mọi phần tử &lt; pivot ở bên trái, &gt; pivot bên phải. Pivot ở đúng vị trí final.</li>
<li>Đệ quy sort 2 nửa (không cần combine — partition đã chuẩn).</li>
</ol>
KHÔNG có combine step → in-place → O(log n) space (chỉ stack).
<br/><br/>
<strong>Bí mật</strong>: pivot tốt → balanced split → O(n log n) trung bình. Pivot tệ (luôn min hoặc max) → unbalanced → O(n²) worst case.`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Tại sao Quick Sort nhanh hơn Merge Sort trong thực tế?</strong>
Mặc dù cả hai O(n log n), Quick Sort:
<ul>
<li><strong>In-place</strong> — không allocate buffer → ít cache miss.</li>
<li><strong>Cache friendly</strong> — partition truy cập tuần tự, cực fit cache line.</li>
<li><strong>Constant factor nhỏ</strong> — chỉ swap, không copy.</li>
</ul>
Benchmark: Quick Sort thường nhanh hơn Merge Sort 2-3× trên cùng input. Java's <code>Arrays.sort(int[])</code> dùng Dual-Pivot Quick Sort chính vì lý do này.
<br/><br/>
<strong>2) Pivot selection</strong>
<ul>
<li><strong>First/last element</strong>: dễ code nhưng O(n²) trên mảng đã sort hoặc reverse-sorted (worst case kinh điển).</li>
<li><strong>Random element</strong>: tránh worst case adversarial. Java JDK 7+ dùng.</li>
<li><strong>Median-of-three</strong>: lấy median(first, middle, last) làm pivot. Heuristic tốt cho near-sorted data.</li>
<li><strong>Ninther</strong>: median of 3 median (9 sample). JDK Dual-Pivot dùng cho mảng &gt; 286 elements.</li>
</ul>
<br/><br/>
<strong>3) Lomuto vs Hoare partition</strong>
<ul>
<li><strong>Lomuto</strong>: pivot = last element. 1 pointer slow, 1 pointer fast. Dễ code, nhưng nhiều swap hơn (kể cả khi mảng đã sort).</li>
<li><strong>Hoare</strong>: 2 pointer từ 2 đầu vào giữa. Ít swap hơn (~3×). Khó code (off-by-one nhiều), nhưng nhanh thực tế.</li>
</ul>
<br/><br/>
<strong>4) 3-way partition (Dutch flag)</strong>
Quan trọng khi mảng có nhiều duplicate. Partition thành &lt; pivot, == pivot, &gt; pivot. Không recurse vào phần == pivot → tiết kiệm.
<br/><br/>
<strong>5) Worst case O(n²) — vì sao?</strong>
Pivot luôn min/max → 1 partition empty, 1 partition size n-1. Recursion depth = n. Tổng cost = n + (n-1) + (n-2) + ... + 1 = O(n²). FIX: random pivot hoặc median-of-three.
<br/><br/>
<strong>6) Tail call elimination</strong>
Sau recursion + partition, recurse vào nửa NHỎ HƠN trước rồi LOOP cho nửa lớn hơn. Giới hạn stack ở O(log n) cả worst case.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào Quick Sort?</h3>
<ul>
  <li><strong>Sort in-memory mảng primitive</strong> — Java Arrays.sort(int[]) dùng.</li>
  <li><strong>Cache-critical hot loop</strong>.</li>
  <li><strong>Không cần stability</strong> (Quick Sort KHÔNG stable).</li>
  <li><strong>Average performance quan trọng hơn worst case</strong> — vì random pivot làm worst case ~ 0%.</li>
</ul>

<h3>Junior Pitfalls — Quick Sort</h3>
<ul>
  <li><strong>Pivot luôn last element</strong> trên mảng đã sort → O(n²). Adversarial inputs phá app production. Phải random.</li>
  <li><strong>Quicksort trên linked list</strong> → cực chậm (truy cập random là O(n)). Dùng Merge Sort.</li>
  <li><strong>Lomuto trên mảng có nhiều duplicate</strong> → cũng O(n²)! Vì partition tạo 1 phần size n-1. Dùng 3-way partition.</li>
  <li><strong>Stack overflow</strong> trên skewed split → recurse vào nửa nhỏ trước, loop nửa lớn.</li>
  <li><strong>Off-by-one trong partition</strong> — bug kinh điển. Test với mảng 2-3 phần tử + đã sort + reverse sorted.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Quick Sort — Lomuto partition + random pivot',
              code: `public class QuickSorter {
    private final Random rng = new Random();

    public void sort(int[] arr) { quickSort(arr, 0, arr.length - 1); }

    private void quickSort(int[] arr, int lo, int hi) {
        while (lo < hi) {                                  // tail call elimination: loop thay recurse
            int p = partition(arr, lo, hi);
            // Recurse vào nửa NHỎ HƠN, loop nửa lớn hơn → stack ≤ O(log n)
            if (p - lo < hi - p) {
                quickSort(arr, lo, p - 1);
                lo = p + 1;
            } else {
                quickSort(arr, p + 1, hi);
                hi = p - 1;
            }
        }
    }

    private int partition(int[] arr, int lo, int hi) {
        // Random pivot — tránh O(n²) adversarial
        int pivotIdx = lo + rng.nextInt(hi - lo + 1);
        swap(arr, pivotIdx, hi);                            // move pivot to end
        int pivot = arr[hi];

        int i = lo - 1;                                     // boundary phần < pivot
        for (int j = lo; j < hi; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, hi);                               // pivot vào đúng chỗ
        return i + 1;
    }

    private void swap(int[] arr, int i, int j) {
        int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
}`
            },
            {
              title: '3-way partition (Dutch National Flag) — handle duplicates',
              code: `public void quickSort3Way(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[lo + new Random().nextInt(hi - lo + 1)];
    int lt = lo, gt = hi, i = lo;
    while (i <= gt) {
        if      (arr[i] < pivot) swap(arr, i++, lt++);
        else if (arr[i] > pivot) swap(arr, i, gt--);
        else                       i++;                     // arr[i] == pivot
    }
    // [lo..lt-1] < pivot; [lt..gt] == pivot; [gt+1..hi] > pivot
    quickSort3Way(arr, lo, lt - 1);
    quickSort3Way(arr, gt + 1, hi);
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Vì sao pivot quan trọng?',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Vẽ recursion tree cho QuickSort trên mảng đã sort, pivot luôn last. Depth là bao nhiêu?
2. Total work qua mọi level = bao nhiêu? (Hint: n + (n-1) + ...)
3. Tại sao random pivot làm worst case "biến mất" trong thực tế?
4. Adversarial input cho random pivot — có làm worst O(n²) được không?
5. Median-of-three vs random — heuristic nào tốt hơn cho near-sorted data?`
            },
            {
              title: 'Quick Sort vs Merge Sort decision tree',
              prompt: `KHÔNG cho đáp án. Cho mỗi tình huống, hỏi tôi nên chọn cái nào:
1. Sort 1M number trong RAM.
2. Sort 10GB log file trên disk, RAM = 4GB.
3. Sort danh sách Order theo (createdAt, priority) — cần stability.
4. Sort LinkedList<Integer>.
5. Sort mảng [1, 1, 1, 2, 2, 3, 3, ...] với rất nhiều duplicate.
6. Sort trong embedded device với stack hạn chế.
Dẫn tôi qua từng case.`
            }
          ],
          exercises: [
            {
              title: 'Implement Quick Sort with random pivot',
              prompt: 'In-place sort dùng Lomuto partition, random pivot, tail call elimination. Đảm bảo O(log n) stack worst case.',
              hints: [
                'Câu hỏi 1: Random pivot khác gì last-element pivot về worst case?',
                'Câu hỏi 2: Tail call: sau partition, recurse vào nửa NHỎ HƠN trước, vì sao?'
              ],
              solution: {
                code: `public class QuickSorter {
    private final Random rng = new Random();

    public void sort(int[] arr) { quickSort(arr, 0, arr.length - 1); }

    private void quickSort(int[] arr, int lo, int hi) {
        while (lo < hi) {
            int p = partition(arr, lo, hi);
            if (p - lo < hi - p) {
                quickSort(arr, lo, p - 1);   // recurse nửa nhỏ
                lo = p + 1;                    // loop nửa lớn
            } else {
                quickSort(arr, p + 1, hi);
                hi = p - 1;
            }
        }
    }

    private int partition(int[] arr, int lo, int hi) {
        int pivotIdx = lo + rng.nextInt(hi - lo + 1);
        swap(arr, pivotIdx, hi);
        int pivot = arr[hi], i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (arr[j] < pivot) swap(arr, ++i, j);
        }
        swap(arr, ++i, hi);
        return i;
    }

    private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}`,
                lang: 'java',
                complexityVi: 'Time: average O(n log n), worst O(n²) (xác suất gần như 0 với random pivot). Space: O(log n) stack worst case (nhờ tail call vào nửa nhỏ).',
                explanationVi: '<strong>Random pivot</strong>: adversarial input phá being-sorted KHÔNG hiệu quả nữa. <strong>Recurse nửa nhỏ trước, loop nửa lớn</strong>: kể cả worst skewed split, stack depth = O(log n) vì mỗi recursion frame xử lý chính xác 1 nửa nhỏ ≤ n/2 size.'
              }
            },
            {
              title: 'Quickselect — Kth Largest in O(n) average',
              prompt: 'Tìm K-th largest. Heap O(n log k). Quickselect O(n) average bằng partition. Vd: [3,2,1,5,6,4], k=2 → 5.',
              hints: [
                'Câu hỏi 1: Sau 1 lần partition, pivot ở đúng chỗ final. Nếu chỉ số đó = (n - k), pivot CHÍNH LÀ k-th largest. Vì sao?',
                'Câu hỏi 2: Nếu pivotIdx < n-k, recurse vào nửa NÀO? Vì sao chỉ recurse 1 nửa, không cả hai?'
              ],
              solution: {
                code: `public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;   // index nếu sort ASC
    int lo = 0, hi = nums.length - 1;
    Random rng = new Random();
    while (lo <= hi) {
        int p = partition(nums, lo, hi, rng);
        if (p == target) return nums[p];
        if (p < target) lo = p + 1;
        else            hi = p - 1;
    }
    return -1;     // unreachable nếu k valid
}

private int partition(int[] arr, int lo, int hi, Random rng) {
    int pivotIdx = lo + rng.nextInt(hi - lo + 1);
    int tmp = arr[pivotIdx]; arr[pivotIdx] = arr[hi]; arr[hi] = tmp;
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    i++;
    arr[hi] = arr[i]; arr[i] = pivot;
    return i;
}`,
                lang: 'java',
                complexityVi: 'Time: average O(n) — T(n) = T(n/2) + O(n) = O(n) by Master Theorem (a=1, b=2, c=1 → case 3). Worst O(n²) cực hiếm với random pivot. Space O(1) extra.',
                explanationVi: 'Quickselect = Quick Sort nhưng CHỈ recurse vào 1 nửa (nửa chứa target). Vì T(n) = T(n/2) + O(n), không phải 2T(n/2) + O(n) → giảm từ n log n xuống n. Đây là cách <code>nth_element</code> của C++ STL và <code>numpy.partition</code> implement.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Quick Sort: in-place, average O(n log n), cache-friendly — nhanh nhất trong thực tế cho RAM.',
              'PIVOT là tất cả — random hoặc median-of-three để tránh O(n²).',
              'KHÔNG stable. Cho stability dùng Merge Sort hoặc Timsort.',
              '3-way partition (Dutch flag) cho mảng nhiều duplicate.',
              'Quickselect tận dụng partition để find K-th trong O(n) average.',
              'Stack control: recurse nửa NHỎ HƠN trước, loop nửa lớn — đảm bảo O(log n) stack.'
            ]
          }
        },

        // ----- l-1-7-4: Sort selection guide -----
        {
          id: 'l-1-7-4',
          type: 'theory',
          title: 'Sort Selection Guide — When to Use Which',
          mentalModel: {
            vi: `Không có "sort tốt nhất" universal — chỉ có "sort phù hợp nhất cho tình huống". Hỏi 4 câu trước khi chọn:
<ol>
<li>Data trong RAM hay external?</li>
<li>Cần stability không?</li>
<li>Primitive (int[]) hay Object?</li>
<li>Adversarial input có thể không? (vd: user controlled)</li>
</ol>`
          },
          underTheHood: {
            vi: `<h3>Java's built-in sort behavior</h3>
<ul>
<li><code>Arrays.sort(int[])</code> → <strong>Dual-Pivot Quick Sort</strong> (JDK 7+). Fast, in-place, UNSTABLE (primitive không cần stability).</li>
<li><code>Arrays.sort(Object[])</code> → <strong>Timsort</strong> (Merge Sort tối ưu). Stable, O(n log n) worst case, ưu việt với near-sorted data.</li>
<li><code>Collections.sort(list)</code> → Timsort qua <code>Arrays.sort(Object[])</code>.</li>
<li><code>list.sort(Comparator)</code> → Timsort.</li>
<li><code>Arrays.parallelSort()</code> → Parallel Merge Sort qua ForkJoinPool.</li>
</ul>
<h3>Timsort — vì sao chuẩn cho Object?</h3>
Phát hiện "run" (đoạn đã sort sẵn) và merge. Best case O(n) với data đã gần sort. Stable. Worst case O(n log n). Đặt theo Tim Peters từ Python — Java áp dụng cho JDK 7.`
          },
          theory: {
            vi: `<h3>Quyết định nhanh</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px;text-align:left">Tình huống</th>
<th style="border:1px solid #ccc;padding:6px;text-align:left">Algorithm</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sort int[] trong RAM</td><td style="border:1px solid #ccc;padding:6px">Quick Sort (Java built-in)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sort Object[] cần stability</td><td style="border:1px solid #ccc;padding:6px">Timsort (Java built-in)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">External data &gt; RAM</td><td style="border:1px solid #ccc;padding:6px">Merge Sort (k-way merge từ disk)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sort LinkedList</td><td style="border:1px solid #ccc;padding:6px">Merge Sort (split bằng slow/fast)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Top K elements</td><td style="border:1px solid #ccc;padding:6px">Heap (PriorityQueue size K)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">K-th element</td><td style="border:1px solid #ccc;padding:6px">Quickselect (O(n) average)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Adversarial input có thể</td><td style="border:1px solid #ccc;padding:6px">Merge Sort (guaranteed O(n log n))</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Range int hẹp (0..1000)</td><td style="border:1px solid #ccc;padding:6px">Counting Sort O(n+k)</td></tr>
</table>

<h3>The "Why" — Tại sao học cả 2 sort dù Java built-in?</h3>
<ul>
  <li><strong>Hiểu để chọn đúng</strong> — biết khi nào built-in chậm.</li>
  <li><strong>Interview</strong> — implementation và partition technique áp dụng cho Quickselect, K-th element, top K, ...</li>
  <li><strong>Custom data structure</strong> (sort linked list, sort theo nhiều criteria phức tạp) — đôi khi tự viết tốt hơn.</li>
</ul>`
          },
          keyTakeaways: {
            vi: [
              'Java built-in: Quick Sort cho int[], Timsort cho Object[].',
              'Cần stability → Timsort. Cần in-place → Quick Sort.',
              'External / linked list → Merge Sort.',
              'Top K → Heap. K-th → Quickselect.',
              'KHÔNG học vẹt — hiểu cấu trúc để áp dụng partition/merge cho bài khác.'
            ]
          }
        }

      ],
  references: [
    { title: 'Arrays.sort JavaDoc', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html#sort(int%5B%5D)' },
    { title: 'Tim Peters -Timsort original notes', url: 'https://github.com/python/cpython/blob/main/Objects/listsort.txt' },
    { title: 'Dual-Pivot Quicksort (Yaroslavskiy)', url: 'https://www.cs.princeton.edu/courses/archive/spring22/cos226/lectures/23DualPivotQuicksort.pdf' }
  ]

    }
