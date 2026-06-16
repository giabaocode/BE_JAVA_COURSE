// ============================================================================
//  PHASE 2 — 17 LeetCode Patterns (Bilingual, Anti-Copy-Paste)
//  Mỗi pattern là 1 file riêng dưới ./phase2/ — dễ tinker từng pattern.
// ============================================================================

import slidingWindow      from './phase2/01-sliding-window.js'
import twoPointers        from './phase2/02-two-pointers.js'
import fastSlow           from './phase2/03-fast-slow.js'
import mergeIntervals     from './phase2/04-merge-intervals.js'
import cyclicSort         from './phase2/05-cyclic-sort.js'
import reversalLL         from './phase2/06-reversal-ll.js'
import treeBFS            from './phase2/07-tree-bfs.js'
import treeDFS            from './phase2/08-tree-dfs.js'
import twoHeaps           from './phase2/09-two-heaps.js'
import backtracking       from './phase2/10-backtracking.js'
import binarySearch       from './phase2/11-binary-search.js'
import topK               from './phase2/12-top-k.js'
import graphTraversal     from './phase2/13-graph-traversal.js'
import graphShortestPath  from './phase2/14-graph-shortest-path.js'
import trie               from './phase2/15-trie.js'
import dp1D               from './phase2/16-dp-1d.js'
import dp2D               from './phase2/17-dp-2d.js'

// Transformer: each pattern file exports { id, title, mental, under, theory, code, prompts, problems, takeaways? }
// We wrap it into the module/lessons shape MainContent expects.
const toModule = ({ id, title, mental, under, theory, code, prompts, problems, takeaways }) => ({
  id: `mod-2-${id}`,
  title,
  lessons: [
    {
      id: `l-2-${id}-theory`,
      type: 'theory',
      title: `${title.split('—')[1]?.trim() || title} — Theory`,
      mentalModel: { vi: mental },
      underTheHood: { vi: under },
      theory: { vi: theory },
      codeExamples: code ? [{ code }] : undefined,
      socraticPrompts: prompts,
      keyTakeaways: takeaways ? { vi: takeaways } : undefined
    },
    {
      id: `l-2-${id}-problems`,
      type: 'problems',
      title: `${title.split('—')[1]?.trim() || title} — Problem Set`,
      problems
    }
  ]
})

// Module mở đầu — RENDER ĐƯỢC (prerequisites + theory lesson + references).
// (phase-level intro/tagline không được app render, nên nội dung phải nằm ở module/lesson.)
const introModule = {
  id: 'mod-2-intro',
  title: 'Bắt đầu ở đây — Tiền điều kiện, Phụ lục & Cách dùng',
  prerequisites: { vi: 'Hoàn thành <strong>Phase 0 + Phase 1</strong> (gõ Java trôi chảy, hiểu OOP, đã tự cài ArrayList/LinkedList/Stack/Queue/HashMap/Tree). Nắm <strong>Big-O</strong>, <strong>đệ quy</strong>, và biết <code>HashMap/HashSet</code>, <code>Deque</code>, <code>PriorityQueue</code> dùng để làm gì.' },
  lessons: [
    {
      id: 'l-2-intro',
      type: 'theory',
      title: 'Cách học 17 pattern + Phụ lục kiểu dữ liệu LeetCode (Java)',
      subtitle: { vi: 'Đọc trước khi vào pattern đầu tiên.' },
      mentalModel: { vi: 'KHÔNG học pattern bằng cách thuộc lòng code. Hãy hiểu <strong>CÂU HỎI</strong> mà mỗi pattern trả lời. Với mỗi pattern: tự suy ra template qua Socratic prompts → làm bài Easy "mồi" → mới sang Medium. Mỗi bài: thử 20 phút TRƯỚC khi xem lời giải, rồi tự gõ lại từ trí nhớ.' },
      theory: { vi: `<h3>Phụ lục — kiểu dữ liệu &amp; import hay dùng cho LeetCode (Java)</h3>
Nhiều bài LeetCode cho sẵn các class dưới đây; nếu tự chạy local thì khai báo như sau (đây là định nghĩa chuẩn, KHÔNG phải pseudo-code):
<pre>// Linked list node
class ListNode { int val; ListNode next; ListNode(int v) { this.val = v; } }

// Binary tree node
class TreeNode { int val; TreeNode left, right; TreeNode(int v) { this.val = v; } }

// Graph node (vd LeetCode 133 Clone Graph)
class Node { int val; List&lt;Node&gt; neighbors = new ArrayList&lt;&gt;(); Node(int v) { this.val = v; } }

// "Interval" trong tài liệu này biểu diễn bằng int[]{start, end} (không cần class riêng)

// Import gói chung cho hầu hết bài:
import java.util.*;   // List, Map, Set, Queue, Deque, ArrayList, HashMap, HashSet, PriorityQueue, Arrays, Collections...</pre>

<h3>Mỗi pattern dùng để làm gì trong Backend? (vì sao học DSA không "vô dụng")</h3>
<ul>
  <li><strong>Sliding Window</strong> → rate limiting, rolling metrics (đếm request trong cửa sổ thời gian).</li>
  <li><strong>Two Pointers / Fast-Slow</strong> → khử trùng lặp, phát hiện chu trình.</li>
  <li><strong>Merge Intervals</strong> → lịch/booking, gộp khoảng thời gian chồng nhau.</li>
  <li><strong>Heap / Top-K</strong> → ranking, top sản phẩm bán chạy, leaderboard, "k gần nhất".</li>
  <li><strong>Tree/Graph BFS-DFS</strong> → quan hệ phụ thuộc, workflow, định tuyến, phân quyền theo cây.</li>
  <li><strong>Dijkstra / MST</strong> → đường đi ngắn nhất, tối ưu mạng/chi phí.</li>
  <li><strong>Trie</strong> → autocomplete, gợi ý tìm kiếm.</li>
  <li><strong>DP</strong> → bài toán tối ưu hóa / lập kế hoạch (chia nhỏ + nhớ kết quả con).</li>
</ul>

<h3>Test-case checklist — chạy trong đầu (hoặc viết assert) cho MỌI bài</h3>
<ul>
  <li><strong>Rỗng</strong> (mảng/list/graph rỗng) và <strong>1 phần tử</strong>.</li>
  <li><strong>Trùng giá trị</strong>; <strong>số âm</strong>; số rất lớn (<strong>overflow</strong> — lý do comparator dùng <code>Integer.compare</code> chứ KHÔNG phải <code>a - b</code>).</li>
  <li>Với graph: <strong>đồ thị rời</strong> (disconnected) và <strong>có chu trình</strong> (cycle).</li>
  <li><strong>Ca không thể</strong> (không có đáp án → trả <code>-1</code>/rỗng/<code>false</code> cho đúng).</li>
</ul>` },
      keyTakeaways: { vi: [
        'Hiểu CÂU HỎI pattern trả lời, đừng thuộc code.',
        'Comparator cho int dùng <code>Integer.compare</code>, không dùng <code>a - b</code> (tránh overflow).',
        'Mọi bài test 4 ca: rỗng / 1 phần tử / biên (âm, overflow, dup) / ca không thể.',
        'Template trong phần lý thuyết là pseudo-code; bản chạy được nằm ở "Lời giải tham khảo" của từng problem.'
      ] }
    }
  ],
  references: [
    { title: 'CLRS — Introduction to Algorithms (4th), MIT Press', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/' },
    { title: 'Sedgewick & Wayne — Algorithms, 4th (Princeton)', url: 'https://algs4.cs.princeton.edu/home/' },
    { title: 'cp-algorithms (algorithm reference)', url: 'https://cp-algorithms.com/' },
    { title: 'Java PriorityQueue (Java 21 API)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html' },
    { title: 'Java Collections Framework (Oracle tutorial)', url: 'https://docs.oracle.com/javase/tutorial/collections/' }
  ]
}

export const phase2 = {
  id: 'phase-2',
  title: 'Phase 2 — 17 LeetCode Patterns (Mental Models)',
  tagline: 'Hiểu LÝ DO trước, code sau. Mỗi problem có hints + lời giải tham khảo, locked khi Mock Mode chạy timer.',
  intro: {
    vi: `KHÔNG học pattern bằng cách thuộc lòng code. Hãy hiểu CÂU HỎI mà pattern trả lời. Mỗi pattern dưới đây: <strong>First Principles</strong> (tại sao đúng về mặt toán), <strong>The Why</strong> (vs alternatives), <strong>Junior Pitfalls</strong> (lỗi điển hình), Socratic prompts để bạn TỰ suy luận template, và LeetCode problem có hints Socratic + lời giải tham khảo Java optimal. Bắt đầu ở module "Bắt đầu ở đây" bên dưới (tiền điều kiện + phụ lục kiểu dữ liệu), rồi đi từng pattern.`
  },
  modules: [
    introModule,
    toModule(slidingWindow),
    toModule(twoPointers),
    toModule(fastSlow),
    toModule(mergeIntervals),
    toModule(cyclicSort),
    toModule(reversalLL),
    toModule(treeBFS),
    toModule(treeDFS),
    toModule(twoHeaps),
    toModule(backtracking),
    toModule(binarySearch),
    toModule(topK),
    toModule(graphTraversal),
    toModule(graphShortestPath),
    toModule(trie),
    toModule(dp1D),
    toModule(dp2D)
  ]
}

export const LC = (slug) => `https://leetcode.com/problems/${slug}/`
