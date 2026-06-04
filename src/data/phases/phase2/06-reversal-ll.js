// Pattern 6 — In-place Reversal of Linked List
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'rev',
  title: 'Pattern 6 — In-place Reversal of Linked List',
  prerequisites: { vi: 'Hoàn thành <code>Phase 1 Module 1.3</code> + <code>Pattern 3 — Fast/Slow</code> để nắm null-check.' },
  mental: `Pattern <strong>ba con trỏ</strong> (prev, curr, next): tại mỗi bước, lưu next TRƯỚC khi đảo <code>curr.next = prev</code>, rồi tiến prev và curr.
<br/><br/>
Mọi biến thể (reverse sublist, reverse k-group, swap pairs, reorder, rotate) đều là pattern này với phần "tách-nối" bổ sung.`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao O(1) space?</strong>
Chỉ 3 biến tham chiếu (prev, curr, next) — không thêm node. Đảo "tại chỗ" trên cấu trúc đang có.
<br/><br/>
<strong>2) Sentinel/dummy node — kỹ thuật chuyên nghiệp</strong>
Tạo node ảo trỏ vào head. Lợi ích: KHÔNG phải xử lý đặc biệt "khi reverse bắt đầu từ head" (case head thay đổi). Code clean hơn rất nhiều. Mọi production-grade LL code đều dùng.
<br/><br/>
<strong>3) Thứ tự cập nhật 3 pointer — CỰC QUAN TRỌNG</strong>
<pre>1. next = curr.next     (LƯU TRƯỚC KHI CẮT — nếu không sẽ mất phần còn lại)
2. curr.next = prev      (đảo)
3. prev = curr           (tiến prev)
4. curr = next           (tiến curr)</pre>
Sai thứ tự (đảo trước khi lưu next) → mất reference → infinite loop hoặc NPE.
<br/><br/>
<strong>4) Reverse một sub-segment</strong>
Cần biết: node TRƯỚC segment (để nối sau khi reverse) và node SAU segment (làm tail mới của reversed segment). 4 pointer total — phức tạp hơn nhưng cùng nguyên tắc.
<br/><br/>
<strong>5) Reverse k-group</strong>
Combo: (1) đếm xem còn ≥ k node không, (2) reverse k node, (3) nối lại. Khó nhất là bookkeeping "node trước group" và "tail của group reversed".`,

  theory: `<h3>The "Why" — Khi nào pattern này?</h3>
<ul>
  <li>Linked list operations cần O(1) space.</li>
  <li>"Đảo", "swap", "rotate", "reorder", "k-group".</li>
  <li>Palindrome check (reverse nửa sau, compare).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Sai thứ tự 3 pointer</strong> → infinite loop hoặc NPE. Vẽ giấy nếu nghi ngờ.</li>
  <li><strong>Quên dummy node</strong> → edge case head thay đổi gây code bloat với null check.</li>
  <li><strong>Reverse sublist quên tách</strong> rõ ràng: set <code>before.next.next = null</code> trước reverse, rồi nối lại.</li>
  <li><strong>k-group: ít hơn k node cuối</strong> — đề bài thường nói "giữ nguyên". Đếm trước khi reverse.</li>
  <li><strong>Quên return head MỚI</strong>: <code>prev</code> là head mới sau khi reverse — KHÔNG phải head cũ.</li>
</ul>`,

  code: `// Reverse toàn bộ LL — pattern 3 pointer
ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;   // 1. lưu next
    curr.next = prev;             // 2. đảo
    prev = curr;                  // 3. tiến prev
    curr = next;                  // 4. tiến curr
}
return prev;`,

  prompts: [
    {
      title: 'Tự nghĩ ra reverse k-group',
      prompt: `Bài "Reverse Nodes in k-Group". KHÔNG cho code. Hỏi tôi:
1. Nếu k=2 (swap pairs), cần biết bao nhiêu node trước khi reverse?
2. Trước reverse 1 group, cần lưu pointer nào để "nối lại" sau?
3. Sau reverse, đầu group cũ thành cuối; cuối thành đầu. Nối thế nào?
4. Dummy node giúp gì ở case group đầu tiên?
5. Còn &lt; k node cuối — giữ nguyên hay reverse?`
    }
  ],

  takeaways: [
    'Template 3 pointer: <code>prev = null, curr = head, next</code>. Mỗi step: save next → đảo <code>curr.next</code> → tiến prev, curr.',
    'Variant: reverse sub-list <code>[m..n]</code> — tách head + tail, reverse middle, ráp lại.',
    'Recursive: O(n) time + O(n) stack. Iterative: O(n) time + O(1) space → ưu tiên iterative.',
    'Liên quan: rotate list, swap pairs, reverse k-group, palindrome LL.',
    'Pitfall: lose reference next (quên save); null pointer khi không check tail; nhầm prev/curr ở edge case.'
  ],

  problems: [
    {
      id: 'p1', title: 'Reverse Linked List', difficulty: 'Easy', url: LC('reverse-linked-list'),
      hint: '3 con trỏ.',
      hints: [
        'Câu hỏi 1: Trước khi đảo <code>curr.next = prev</code>, còn truy cập được node tiếp theo không?',
        'Câu hỏi 2: Khi loop dừng (curr == null), <code>prev</code> đang ở đâu?'
      ],
      solution: {
        code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Pattern 3 pointer kinh điển. Lưu next TRƯỚC khi đảo. Cuối: prev = head mới.'
      }
    },
    {
      id: 'p2', title: 'Reverse Linked List II', difficulty: 'Medium', url: LC('reverse-linked-list-ii'),
      hint: 'Reverse sublist [left, right].',
      hints: [
        'Câu hỏi 1: Tìm node TRƯỚC left (gọi là <code>before</code>) và node TẠI left (gọi là <code>start</code>). Reverse [left, right] in-place.',
        'Câu hỏi 2: Sau reverse, nối: <code>before.next</code> = node mới đầu, <code>start.next</code> = node sau right.'
      ],
      solution: {
        code: `public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0, head);
    ListNode before = dummy;
    for (int i = 1; i < left; i++) before = before.next;

    ListNode start = before.next, then = start.next;
    for (int i = 0; i < right - left; i++) {
        start.next = then.next;
        then.next = before.next;
        before.next = then;
        then = start.next;
    }
    return dummy.next;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Dummy tránh case left=1. <code>before</code> là node trước sublist. Mỗi step: "lấy <code>then</code>, chuyển nó lên đầu sublist". Sau (right-left) lần, sublist đã đảo.'
      }
    },
    {
      id: 'p3', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', url: LC('reverse-nodes-in-k-group'),
      hint: 'Reverse k-by-k; dùng dummy.',
      hints: [
        'Câu hỏi 1: Đếm trước xem có đủ k node? Nếu không, dừng.',
        'Câu hỏi 2: Trong mỗi group: pattern 3-pointer. Nối: <code>groupPrev.next</code> = head mới group, tail group = next group.'
      ],
      solution: {
        code: `public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0, head), groupPrev = dummy;
    while (true) {
        ListNode kth = groupPrev;
        for (int i = 0; i < k && kth != null; i++) kth = kth.next;
        if (kth == null) break;     // còn < k node

        ListNode groupNext = kth.next;
        // Reverse từ groupPrev.next đến kth
        ListNode prev = groupNext, curr = groupPrev.next;
        while (curr != groupNext) {
            ListNode tmp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = tmp;
        }
        ListNode oldHead = groupPrev.next;
        groupPrev.next = kth;       // head mới của group
        groupPrev = oldHead;        // tail mới của group → groupPrev cho group sau
    }
    return dummy.next;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Combo đếm + reverse. <code>kth</code> đi k bước; nếu null → còn &lt; k → dừng. Reverse sublist với prev khởi tạo = groupNext (để node cuối nối đúng). Update groupPrev = tail cũ (head sau reverse).'
      }
    },
    {
      id: 'p4', title: 'Swap Nodes in Pairs', difficulty: 'Medium', url: LC('swap-nodes-in-pairs'),
      hint: 'k=2 special case.',
      hints: [
        'Câu hỏi 1: Đặc biệt của k=2 — chỉ cần track 3 node (prev, a, b) và swap.',
        'Câu hỏi 2: Recursive version cũng đẹp — <code>swap(a, b)</code> = <code>b → a → swapPairs(b.next.next)</code>.'
      ],
      solution: {
        code: `public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0, head), prev = dummy;
    while (prev.next != null && prev.next.next != null) {
        ListNode a = prev.next, b = a.next;
        a.next = b.next;
        b.next = a;
        prev.next = b;
        prev = a;
    }
    return dummy.next;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Iterative. <code>prev → a → b → ...</code> thành <code>prev → b → a → ...</code>. 3 pointer reassignment.'
      }
    },
    {
      id: 'p5', title: 'Rotate List', difficulty: 'Medium', url: LC('rotate-list'),
      hint: 'Length → k %= length → split.',
      hints: [
        'Câu hỏi 1: Rotate right k bước = split tại <code>n - k % n</code> từ đầu, ghép phần sau ra trước.',
        'Câu hỏi 2: 1 pass đếm length + nối tail-to-head (circular), rồi tìm break point.'
      ],
      solution: {
        code: `public ListNode rotateRight(ListNode head, int k) {
    if (head == null || head.next == null) return head;
    int n = 1;
    ListNode tail = head;
    while (tail.next != null) { tail = tail.next; n++; }
    k %= n;
    if (k == 0) return head;
    tail.next = head;   // make circular
    ListNode newTail = head;
    for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;
    ListNode newHead = newTail.next;
    newTail.next = null;
    return newHead;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Circular trick: nối tail vào head, rồi tìm break point. Tránh đếm 2 lần.'
      }
    },
    {
      id: 'p6', title: 'Reorder List', difficulty: 'Medium', url: LC('reorder-list'),
      hint: 'Middle → reverse half → merge.',
      hints: [
        'Câu hỏi 1: 3 sub-task: find middle (slow/fast), reverse second half, merge alternating.',
        'Câu hỏi 2: Cẩn thận cắt list thành 2 nửa rõ ràng trước reverse.'
      ],
      solution: {
        code: `public void reorderList(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next; fast = fast.next.next;
    }
    ListNode prev = null, curr = slow.next;
    slow.next = null;
    while (curr != null) {
        ListNode tmp = curr.next; curr.next = prev; prev = curr; curr = tmp;
    }
    ListNode p1 = head, p2 = prev;
    while (p2 != null) {
        ListNode n1 = p1.next, n2 = p2.next;
        p1.next = p2; p2.next = n1;
        p1 = n1; p2 = n2;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: '3 phase combined. Cắt rõ ràng tại middle bằng <code>slow.next = null</code>. Merge zip 2 halves.'
      }
    },
    {
      id: 'p7', title: 'Palindrome Linked List', difficulty: 'Easy', url: LC('palindrome-linked-list'),
      hint: 'Reverse half rồi so sánh.',
      hints: [
        'Câu hỏi 1: O(1) space: find middle, reverse second half, compare 2 halves.',
        'Câu hỏi 2: So đến khi <code>p2 == null</code> — đủ. Nửa sau có thể ngắn hơn 1 với n chẵn.'
      ],
      solution: {
        code: `public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
    }
    ListNode prev = null, curr = slow;
    while (curr != null) {
        ListNode tmp = curr.next; curr.next = prev; prev = curr; curr = tmp;
    }
    ListNode p1 = head, p2 = prev;
    while (p2 != null) {
        if (p1.val != p2.val) return false;
        p1 = p1.next; p2 = p2.next;
    }
    return true;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Combine slow/fast + reverse + compare. So sánh đến khi p2 hit null (nửa sau dùng làm benchmark).'
      }
    },
    {
      id: 'p8', title: 'Odd Even Linked List', difficulty: 'Medium', url: LC('odd-even-linked-list'),
      hint: 'Hai chain riêng; nối đuôi.',
      hints: [
        'Câu hỏi 1: 2 con trỏ <code>odd</code> và <code>even</code>. Mỗi step: <code>odd.next = even.next</code>, <code>even.next = odd.next.next</code>, advance.',
        'Câu hỏi 2: Cuối: nối <code>odd.next = evenHead</code>.'
      ],
      solution: {
        code: `public ListNode oddEvenList(ListNode head) {
    if (head == null) return null;
    ListNode odd = head, even = head.next, evenHead = even;
    while (even != null && even.next != null) {
        odd.next = even.next;
        odd = odd.next;
        even.next = odd.next;
        even = even.next;
    }
    odd.next = evenHead;
    return head;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'In-place separate odd-position vs even-position nodes. Maintain 2 chain heads, mỗi step skip 1 node. Cuối nối odd tail vào even head.'
      }
    },
    {
      id: 'p9', title: 'Partition List', difficulty: 'Medium', url: LC('partition-list'),
      hint: 'Hai dummy head: less & greater.',
      hints: [
        'Câu hỏi 1: 2 dummy heads cho 2 chain (less, greaterEqual). Duyệt list gốc, append node vào chain phù hợp.',
        'Câu hỏi 2: Cuối nối <code>lessTail.next = geHead</code> và <code>geTail.next = null</code>.'
      ],
      solution: {
        code: `public ListNode partition(ListNode head, int x) {
    ListNode lessD = new ListNode(0), geD = new ListNode(0);
    ListNode less = lessD, ge = geD;
    while (head != null) {
        if (head.val < x) { less.next = head; less = less.next; }
        else                { ge.next   = head; ge   = ge.next; }
        head = head.next;
    }
    ge.next = null;
    less.next = geD.next;
    return lessD.next;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: '2 dummy chain pattern. Phân loại trong 1 pass. <code>ge.next = null</code> CRITICAL — tránh cycle vì node cuối trong list gốc có thể trỏ ngược.'
      }
    },
    {
      id: 'p10', title: 'Add Two Numbers II', difficulty: 'Medium', url: LC('add-two-numbers-ii'),
      hint: 'Reverse cả hai rồi cộng.',
      hints: [
        'Câu hỏi 1: Most significant ở đầu — khó cộng trực tiếp. Reverse cả 2 → cộng như Add Two Numbers I → reverse kết quả.',
        'Câu hỏi 2: Alternative: dùng 2 stack push value, pop và cộng (không sửa input list).'
      ],
      solution: {
        code: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    Deque<Integer> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();
    while (l1 != null) { s1.push(l1.val); l1 = l1.next; }
    while (l2 != null) { s2.push(l2.val); l2 = l2.next; }
    ListNode head = null;
    int carry = 0;
    while (!s1.isEmpty() || !s2.isEmpty() || carry > 0) {
        int sum = carry;
        if (!s1.isEmpty()) sum += s1.pop();
        if (!s2.isEmpty()) sum += s2.pop();
        ListNode n = new ListNode(sum % 10);
        n.next = head;
        head = n;
        carry = sum / 10;
    }
    return head;
}`,
        lang: 'java',
        complexityVi: 'Time O(n + m) · Space O(n + m) cho stacks.',
        explanationVi: 'Stack push value (most significant ở đáy → least ở đỉnh). Pop từng cặp, cộng. Build result LIST từ MSB về LSB bằng cách "prepend" mỗi node mới. KHÔNG sửa input.'
      }
    }
  ],
  references: [
    { title: 'Reverse Linked List -LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list/' },
    { title: 'Linked List operations (CLRS Ch10)', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/' }
  ]

}
