// Pattern 4 — Merge Intervals
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'mi',
  title: 'Pattern 4 — Merge Intervals',
  mental: `Bài về <strong>interval</strong> (lịch họp, calendar, đoạn thẳng)? → <strong>Sort theo start, sweep qua, merge nếu overlap</strong>.
<br/><br/>
Hai interval <code>[a, b]</code> và <code>[c, d]</code> overlap khi <code>a ≤ d AND c ≤ b</code>. Sau sort theo start, chỉ cần check <code>currentEnd ≥ nextStart</code>.`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao sort là chìa khóa?</strong>
Sau sort theo start, interval mới KHÔNG THỂ overlap với interval đã merge XONG (đã chốt) — chỉ có thể overlap với CÁI CUỐI CÙNG trong list merge. Đây là tính chất "transitively non-overlapping" — chứng minh bằng induction.
<br/><br/>
<strong>2) Complexity</strong>
Sort O(n log n). Sweep O(n). Tổng O(n log n). Sort dominate. Bài cho intervals đã sort sẵn → O(n).
<br/><br/>
<strong>3) Sweep line — biến thể mạnh hơn</strong>
Tạo "event" cho mỗi start (+1) và end (-1). Sort events. Sweep và count running concurrency. Áp dụng: "min meeting rooms", "car pooling", "skyline".
<br/><br/>
<strong>4) Greedy by end time</strong>
Bài "non-overlapping intervals" và "minimum arrows": sort theo END (không phải start). Greedy chọn interval kết thúc sớm nhất → để dành chỗ cho cái tiếp theo. Đây là Activity Selection kinh điển.
<br/><br/>
<strong>5) TreeMap cho dynamic intervals</strong>
Khi intervals add/remove dynamic (My Calendar series), TreeMap với <code>floorKey/ceilingKey</code> cho phép find neighbor O(log n) thay vì O(n) scan.`,

  theory: `<h3>The "Why" — Khi nào pattern này?</h3>
<ul>
  <li>Lịch họp, calendar overlap.</li>
  <li>Range queries, interval coverage.</li>
  <li>Scheduling, resource allocation.</li>
  <li>Geometry — đoạn thẳng trên trục số.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên sort</strong> trước khi sweep → invariant break, merge sai.</li>
  <li><strong>Sort theo start vs end</strong> — chọn sai → bài Activity Selection ra O(n²) thay vì O(n log n) greedy.</li>
  <li><strong>Equal endpoints: overlap hay không?</strong> Đề bài phải đọc kỹ. <code>[1,3]</code> và <code>[3,5]</code> — overlap với <code>≥</code> hay <code>&gt;</code>?</li>
  <li><strong>Modify interval khi đang sort/iterate</strong> → ConcurrentModificationException hoặc result sai.</li>
  <li><strong>Sweep line: tie-break events</strong> — start vs end tại cùng time → quan trọng order! "Meeting Rooms II": end nên process TRƯỚC start tại cùng time (vì meeting cũ kết thúc thì giải phóng phòng cho meeting mới).</li>
</ul>`,

  code: `// Merge Intervals template
Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
List<int[]> merged = new ArrayList<>();
for (int[] cur : intervals) {
    if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
        merged.add(cur);
    } else {
        merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], cur[1]);
    }
}`,

  prompts: [
    {
      title: 'Khi nào sort, khi nào dùng heap?',
      prompt: `KHÔNG cho code. Hỏi tôi:
1. "Merge intervals" — sau sort, sweep tuyến tính đủ không?
2. "Meeting Rooms II" — đếm số phòng cùng lúc. Cần biết gì tại mỗi thời điểm?
3. Sort theo start, tôi có biết "thời điểm nào meeting nào đang chạy" không?
4. Heap giúp track meeting kết thúc SỚM NHẤT. Vì sao quan trọng?
5. Tại sao push <code>end</code> vào heap chứ không <code>start</code>?
Dẫn tôi từ sort tới heap.`
    }
  ],

  takeaways: [
    'Workflow: sort theo start → duyệt → merge nếu <code>current.start &lt;= prev.end</code>, else push prev.',
    'Khi gặp: meeting rooms, free time, insert interval, calendar booking.',
    'Variant <strong>Sweep Line</strong>: events (start +1, end -1) sort theo time → quét count, max concurrent meetings.',
    'Open vs closed endpoints quan trọng: <code>[1,3]</code> và <code>[3,5]</code> overlap hay không? Đọc đề kỹ.',
    'Pitfall: quên sort; merge sai khi <code>prev.end &lt; curr.start</code> nhưng vẫn merge.'
  ],

  problems: [
    {
      id: 'p1', title: 'Merge Intervals', difficulty: 'Medium', url: LC('merge-intervals'),
      hint: 'Sort start; merge nếu overlap.',
      hints: [
        'Câu hỏi 1: Sau sort theo start, khi nào 2 interval CHẮC CHẮN không overlap?',
        'Câu hỏi 2: Khi overlap, end mới = max của 2 end (không phải end của interval sau!). Vì sao?'
      ],
      solution: {
        code: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    for (int[] cur : intervals) {
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
            merged.add(cur);
        } else {
            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], cur[1]);
        }
    }
    return merged.toArray(new int[0][]);
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) — sort dominates. Space O(n) cho output.',
        explanationVi: 'Sort theo start. Sweep: nếu interval mới không overlap với cuối list merged (start &gt; lastEnd), push. Nếu overlap, update <code>lastEnd = max(lastEnd, curEnd)</code> — case "interval mới hoàn toàn nằm trong cũ" thì lastEnd giữ nguyên.'
      }
    },
    {
      id: 'p2', title: 'Insert Interval', difficulty: 'Medium', url: LC('insert-interval'),
      hint: 'Three phases: before, overlap, after.',
      hints: [
        'Câu hỏi 1: Mảng đã sort. Chia thành 3 giai đoạn: trước newInterval, overlap với nó, sau nó.',
        'Câu hỏi 2: Trong giai đoạn overlap, merge bằng cách nào? <code>newInterval.start = min, newInterval.end = max</code>.'
      ],
      solution: {
        code: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> res = new ArrayList<>();
    int i = 0, n = intervals.length;
    // 1. Trước newInterval
    while (i < n && intervals[i][1] < newInterval[0]) res.add(intervals[i++]);
    // 2. Overlap — merge
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.add(newInterval);
    // 3. Sau newInterval
    while (i < n) res.add(intervals[i++]);
    return res.toArray(new int[0][]);
}`,
        lang: 'java',
        complexityVi: 'Time O(n) — 1 pass. Space O(n) cho output.',
        explanationVi: 'Không cần sort lại (đề bài đã sort). 3 phases tách bạch. Phase 2: gộp newInterval với mọi cái overlap → expand range bằng min/max.'
      }
    },
    {
      id: 'p3', title: 'Non-overlapping Intervals', difficulty: 'Medium', url: LC('non-overlapping-intervals'),
      hint: 'Greedy theo end; loại cái end muộn hơn.',
      hints: [
        'Câu hỏi 1: Activity Selection: sort theo END. Greedy giữ interval kết thúc sớm nhất. Vì sao?',
        'Câu hỏi 2: Khi gặp interval mới overlap với cái vừa giữ — bỏ cái nào? Cái có end MUỘN hơn (intuitively chiếm chỗ nhiều hơn).'
      ],
      solution: {
        code: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);   // sort theo END
    int prevEnd = Integer.MIN_VALUE, removed = 0;
    for (int[] cur : intervals) {
        if (cur[0] >= prevEnd) prevEnd = cur[1];      // không overlap, giữ
        else                    removed++;            // overlap, bỏ cái này (end muộn hơn)
    }
    return removed;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(1).',
        explanationVi: 'Activity Selection greedy. Sort theo end → khi gặp overlap, cái đang xét có end ≥ prevEnd → bỏ cái đang xét (giữ prevEnd nhỏ hơn). Optimal bởi exchange argument.'
      }
    },
    {
      id: 'p4', title: 'Meeting Rooms', difficulty: 'Easy', url: LC('meeting-rooms'),
      hint: 'Sort & check overlap.',
      hints: [
        'Câu hỏi 1: Có thể attend mọi meeting ⇔ không có overlap. Sau sort, check overlap với cái trước.',
        'Câu hỏi 2: Equal endpoints (vd: meeting kết thúc 10:00, meeting tiếp bắt đầu 10:00) — overlap hay không? Đề bài: KHÔNG overlap (back-to-back OK).'
      ],
      solution: {
        code: `public boolean canAttendMeetings(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;
    }
    return true;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(1).',
        explanationVi: 'Sort theo start. Check liên tiếp: nếu start của cur &lt; end của prev → overlap → false. Back-to-back (start == prev.end) OK.'
      }
    },
    {
      id: 'p5', title: 'Meeting Rooms II', difficulty: 'Medium', url: LC('meeting-rooms-ii'),
      hint: 'Min-heap of end times.',
      hints: [
        'Câu hỏi 1: Sort theo start. Tại mỗi meeting mới, có thể tái dùng phòng nếu phòng đó đã kết thúc.',
        'Câu hỏi 2: Min-heap giữ END TIMES các phòng đang dùng. Nếu min-end ≤ start của meeting mới → tái dùng phòng đó. Kích thước heap = số phòng đang dùng.'
      ],
      solution: {
        code: `public int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int[] m : intervals) {
        if (!heap.isEmpty() && heap.peek() <= m[0]) heap.poll();
        heap.offer(m[1]);
    }
    return heap.size();
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(n) heap.',
        explanationVi: 'Sort start. Heap = end times của các phòng đang dùng. Mỗi meeting: nếu min-end ≤ start, tái dùng (poll); push end mới. Cuối: heap size = số phòng peak.'
      }
    },
    {
      id: 'p6', title: 'Interval List Intersections', difficulty: 'Medium', url: LC('interval-list-intersections'),
      hint: 'Two pointers trên 2 list đã sort.',
      hints: [
        'Câu hỏi 1: 2 list sorted. Intersection của <code>A[i]</code> và <code>B[j]</code> = <code>[max(starts), min(ends)]</code> nếu valid.',
        'Câu hỏi 2: Sau khi process 1 cặp, advance pointer nào? — Cái có end NHỎ HƠN (đã hoàn thành nó).'
      ],
      solution: {
        code: `public int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> res = new ArrayList<>();
    int i = 0, j = 0;
    while (i < A.length && j < B.length) {
        int lo = Math.max(A[i][0], B[j][0]);
        int hi = Math.min(A[i][1], B[j][1]);
        if (lo <= hi) res.add(new int[]{lo, hi});
        if (A[i][1] < B[j][1]) i++;
        else                    j++;
    }
    return res.toArray(new int[0][]);
}`,
        lang: 'java',
        complexityVi: 'Time O(n + m) · Space O(n + m) cho output.',
        explanationVi: 'Two pointers. Tại mỗi cặp: tính intersection bằng [max start, min end]. Advance pointer có end nhỏ hơn (cái đó đã "tiêu" xong, không còn giao với phía bên kia).'
      }
    },
    {
      id: 'p7', title: 'Employee Free Time', difficulty: 'Hard', url: LC('employee-free-time'),
      hint: 'Flatten + merge; gaps = free.',
      hints: [
        'Câu hỏi 1: Flatten mọi schedule, merge intervals. Gaps giữa các merged = free time.',
        'Câu hỏi 2: Cách tối ưu: min-heap với 1 interval đầu của mỗi employee — k-way merge.'
      ],
      solution: {
        code: `public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
    List<Interval> all = new ArrayList<>();
    for (List<Interval> emp : schedule) all.addAll(emp);
    all.sort((a, b) -> a.start - b.start);
    List<Interval> res = new ArrayList<>();
    int end = all.get(0).end;
    for (int i = 1; i < all.size(); i++) {
        if (all.get(i).start > end) res.add(new Interval(end, all.get(i).start));
        end = Math.max(end, all.get(i).end);
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(N log N) với N = total intervals. Space O(N).',
        explanationVi: 'Flatten + merge variant. Khi gap xuất hiện (start &gt; running end), gap đó là free time. Simple solution; k-way merge với heap optimize được nhưng phức tạp hơn.'
      }
    },
    {
      id: 'p8', title: 'Minimum Arrows to Burst Balloons', difficulty: 'Medium', url: LC('minimum-number-of-arrows-to-burst-balloons'),
      hint: 'Sort theo end; greedy.',
      hints: [
        'Câu hỏi 1: Activity Selection variant. Sort theo END. Mũi tên bắn tại end của balloon đầu tiên — bắn được hết balloons overlap.',
        'Câu hỏi 2: Khi balloon mới có start &gt; arrow position, cần arrow mới.'
      ],
      solution: {
        code: `public int findMinArrowShots(int[][] points) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));   // dùng compare tránh overflow
    int arrows = 1, arrowPos = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(1).',
        explanationVi: 'Sort theo end. Bắn arrow tại end của balloon đầu → diệt hết balloons có start ≤ end này. Khi gặp balloon ngoài → arrow mới. Dùng <code>Integer.compare</code> tránh overflow khi end là Integer.MAX_VALUE.'
      }
    },
    {
      id: 'p9', title: 'Car Pooling', difficulty: 'Medium', url: LC('car-pooling'),
      hint: 'Sweep line: +load tại pickup, -load tại drop.',
      hints: [
        'Câu hỏi 1: Sweep line: tạo events (+passengers tại start, -passengers tại end). Sort by time. Running sum &gt; capacity at any point?',
        'Câu hỏi 2: Tie-break: drop trước pickup (vì xe trả khách rồi đón mới). Implement: process end khi tie.'
      ],
      solution: {
        code: `public boolean carPooling(int[][] trips, int capacity) {
    int[] delta = new int[1001];  // location range 0..1000
    for (int[] t : trips) {
        delta[t[1]] += t[0];        // pickup
        delta[t[2]] -= t[0];        // drop
    }
    int running = 0;
    for (int d : delta) {
        running += d;
        if (running > capacity) return false;
    }
    return true;
}`,
        lang: 'java',
        complexityVi: 'Time O(n + max_location) · Space O(max_location).',
        explanationVi: 'Bucket sweep — biết range, dùng diff array thay heap. Tại mỗi location, delta[loc] = net change. Running sum = passengers tại location đó. Drop tại location L được xử lý TRƯỚC pickup tại L (vì delta[L] gộp cả 2, và drop là negative).'
      }
    },
    {
      id: 'p10', title: 'My Calendar I', difficulty: 'Medium', url: LC('my-calendar-i'),
      hint: 'TreeMap floorKey/ceilingKey.',
      hints: [
        'Câu hỏi 1: Dynamic: add intervals, check overlap. TreeMap với key = start. floorKey(start) = booking gần nhất trước; ceilingKey(start) = booking sau.',
        'Câu hỏi 2: Overlap check: (1) floorKey.end &gt; new.start? (2) ceilingKey.start &lt; new.end?'
      ],
      solution: {
        code: `class MyCalendar {
    private final TreeMap<Integer, Integer> bookings = new TreeMap<>();

    public boolean book(int start, int end) {
        Integer prev = bookings.floorKey(start);
        Integer next = bookings.ceilingKey(start);
        if (prev != null && bookings.get(prev) > start) return false;
        if (next != null && next < end) return false;
        bookings.put(start, end);
        return true;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) per book · Space O(n).',
        explanationVi: 'TreeMap đảm bảo log n cho floorKey/ceilingKey. Chỉ cần check 2 neighbor (trước + sau) — đủ vì các booking đã không overlap nhau.'
      }
    }
  ]
}
