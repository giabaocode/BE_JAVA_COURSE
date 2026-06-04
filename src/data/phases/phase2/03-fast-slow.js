// Pattern 3 — Fast & Slow Pointers
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'fs',
  title: 'Pattern 3 — Fast & Slow Pointers',
  prerequisites: { vi: 'Hoàn thành <code>Phase 1 Module 1.3</code> (linked list). Hiểu pointer manipulation và null check.' },
  mental: `Hai con trỏ trên cùng cấu trúc (linked list hoặc index sequence), <strong>fast tiến 2 bước, slow tiến 1 bước</strong>. Nếu có chu trình → chúng GẶP NHAU bên trong. Nếu không → fast tới null/biên.
<br/><br/>
Ứng dụng:
<ul>
<li>Detect cycle (Floyd's tortoise &amp; hare).</li>
<li>Find middle linked list trong 1 pass.</li>
<li>Find duplicate trong mảng coi như linked list ẩn.</li>
<li>Determine "happy number" qua cycle trên digit-square-sum.</li>
</ul>`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao chắc chắn gặp khi có cycle?</strong>
Khi cả 2 đã vào cycle, khoảng cách (fast - slow mod cycleLength) giảm đúng 1 mỗi step → sẽ về 0 trong tối đa cycleLength bước. Chứng minh chặt: gap modulo L giảm 1 mỗi step → đếm được.
<br/><br/>
<strong>2) Tỷ lệ 2:1 — vì sao?</strong>
Bất kỳ tỷ lệ (k+1):1 với k ≥ 1 đều work — sẽ gặp. 2:1 đơn giản nhất, code clean nhất. 3:1 cũng work nhưng fast phải null-check nhiều hơn.
<br/><br/>
<strong>3) Tìm entry point của cycle (Floyd's algorithm)</strong>
Sau khi gặp, reset 1 pointer về head, cùng tiến 1 bước/lần. Chúng gặp ở entry. Chứng minh: gọi <code>a</code> = đường tới entry, <code>b</code> = phần slow đã đi vào cycle khi gặp, <code>c</code> = phần còn lại của cycle. Slow đi <code>a+b</code>; fast đi <code>2(a+b)</code>; chênh lệch là bội của L: <code>a+b = kL</code> → <code>a = kL - b = (k-1)L + c</code>. Vậy nếu reset về head, đi <code>a</code> bước cùng nhau → cả 2 ở entry.
<br/><br/>
<strong>4) Array as implicit linked list</strong>
Với "Find Duplicate Number" trong [1..n] và mảng size n+1: coi <code>nums[i]</code> là "next pointer" — index i → index nums[i]. Vì có duplicate → có 2 index trỏ tới cùng node → cycle. Detect cycle bằng Floyd → entry là duplicate.`,

  theory: `<h3>The "Why" — Khi nào Fast/Slow?</h3>
<ul>
  <li>Linked list cycle detection.</li>
  <li>Find middle 1 pass (không cần count length).</li>
  <li>Array coi như implicit LL (find duplicate, happy number).</li>
  <li>Tránh extra space (HashSet O(n) → Floyd O(1)).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên null-check fast.next</strong> trước <code>fast.next.next</code> → NullPointerException khi fast tới gần end.</li>
  <li><strong>Khởi tạo slow = fast = head</strong> vs <code>slow = head, fast = head.next</code> — KHÁC NHAU. Convention LeetCode: cùng head, while-condition.</li>
  <li><strong>Middle node với n chẵn</strong>: slow ở node thứ 2 trong 2 node giữa (n=4 → node 2nd of [2,3]). LeetCode convention. Để lấy "first middle", bắt đầu <code>fast = head.next</code>.</li>
  <li><strong>Quên reset modCount/state khi reset pointer</strong> trong stage 2 của Floyd (find entry).</li>
  <li><strong>Apply Floyd cho array không có duplicate</strong> → loop vô tận. Bài "Find Duplicate" giả định CÓ duplicate.</li>
</ul>`,

  code: `// Detect cycle (Floyd)
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;`,

  prompts: [
    {
      title: 'Floyd algorithm intuition',
      prompt: `Hiểu Floyd's cycle finding. KHÔNG cho đáp án. Hỏi tôi:
1. Tại sao 2 con trỏ tốc độ khác nhau ĐẢM BẢO gặp khi có cycle?
2. Vì sao chọn tỷ lệ 2:1?
3. Sau khi gặp, làm sao tìm entry point cycle?
4. Chứng minh: gọi a = phần trước cycle, slow đã đi a+b khi gặp. Tại sao a = kL - b?
5. "Find Duplicate Number" coi mảng như LL ẩn — chỉ ra cách build LL ẩn đó.`
    }
  ],

  takeaways: [
    'Mục đích chính: detect cycle in LinkedList, find middle node, độ dài cycle.',
    'Thuật toán Floyd: slow đi 1, fast đi 2 → gặp nhau trong cycle vì khoảng cách thu hẹp 1 mỗi step.',
    'Find cycle start: sau khi gặp, reset 1 pointer về head, cùng đi tốc độ 1 → gặp lại = cycle start.',
    'Generalize sang functional graph: Happy Number (chain square sum), Find Duplicate Number.',
    'Pitfall: null check <code>fast != null &amp;&amp; fast.next != null</code> TRƯỚC khi advance <code>fast.next.next</code>.'
  ],

  problems: [
    {
      id: 'p1', title: 'Linked List Cycle', difficulty: 'Easy', url: LC('linked-list-cycle'),
      hint: 'Tortoise & hare gặp ⇒ cycle.',
      hints: [
        'Câu hỏi 1: Slow tiến 1, fast tiến 2. Khi nào dừng vòng lặp (case không cycle)?',
        'Câu hỏi 2: Vì sao return true ngay khi <code>slow == fast</code> chứ không tiếp tục?'
      ],
      solution: {
        code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Floyd classic. Null-check <code>fast != null && fast.next != null</code> tránh NPE. Gặp ⇒ cycle (chắc chắn). Fast hit null ⇒ không cycle.'
      }
    },
    {
      id: 'p2', title: 'Linked List Cycle II (find entry)', difficulty: 'Medium', url: LC('linked-list-cycle-ii'),
      hint: 'Reset về head sau khi gặp.',
      hints: [
        'Câu hỏi 1: Stage 1 detect cycle như cũ. Sau khi gặp, làm gì để tìm entry?',
        'Câu hỏi 2: Vì sao reset 1 pointer về head, cùng tiến 1 bước → gặp tại entry?'
      ],
      solution: {
        code: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            // Stage 2: find entry
            ListNode p = head;
            while (p != slow) {
                p = p.next;
                slow = slow.next;
            }
            return p;
        }
    }
    return null;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Stage 1: Floyd detect. Stage 2: reset 1 pointer về head, cùng tiến 1 bước/lần. Khi gặp = entry. Toán học: <code>a = kL - b</code> đảm bảo điều này (xem First Principles).'
      }
    },
    {
      id: 'p3', title: 'Middle of the Linked List', difficulty: 'Easy', url: LC('middle-of-the-linked-list'),
      hint: 'Fast tới null → slow ở giữa.',
      hints: [
        'Câu hỏi 1: Fast tiến 2× tốc độ slow. Khi fast hit null/end, slow ở đâu?',
        'Câu hỏi 2: n chẵn → 2 node giữa. Bài muốn node nào (1st hay 2nd)? Convention LeetCode?'
      ],
      solution: {
        code: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;   // n chẵn → slow ở 2nd middle (LeetCode convention)
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: '1 pass. n=4: slow stops at index 2 (0-based) — 2nd middle. Muốn 1st middle? Khởi tạo <code>fast = head.next</code>.'
      }
    },
    {
      id: 'p4', title: 'Happy Number', difficulty: 'Easy', url: LC('happy-number'),
      hint: 'Cycle trên chuỗi squared-digit-sum.',
      hints: [
        'Câu hỏi 1: Coi function <code>next(n) = sum_of_digit_squares(n)</code> như "next pointer". Khi nào không happy? (Cycle không qua 1)',
        'Câu hỏi 2: Detect cycle bằng Floyd (slow/fast) — không cần HashSet, O(1) space.'
      ],
      solution: {
        code: `public boolean isHappy(int n) {
    int slow = n, fast = n;
    do {
        slow = squareSum(slow);
        fast = squareSum(squareSum(fast));
    } while (slow != fast);
    return slow == 1;
}

private int squareSum(int n) {
    int sum = 0;
    while (n > 0) { int d = n % 10; sum += d * d; n /= 10; }
    return sum;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) per step (số digit), tổng O(log n × steps). Space O(1).',
        explanationVi: 'Coi <code>next(x) = squareSum(x)</code> như linked list ẩn. Floyd detect cycle. Nếu gặp tại 1 → happy; nếu không → trapped trong cycle khác. O(1) space (better than HashSet).'
      }
    },
    {
      id: 'p5', title: 'Palindrome Linked List', difficulty: 'Easy', url: LC('palindrome-linked-list'),
      hint: 'Middle → reverse half → compare.',
      hints: [
        'Câu hỏi 1: O(1) space: tìm giữa, reverse nửa sau, so sánh 2 nửa.',
        'Câu hỏi 2: Sau compare, có cần restore list về nguyên trạng không? (Phụ thuộc requirement.)'
      ],
      solution: {
        code: `public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // Reverse from slow
    ListNode prev = null, curr = slow;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    // Compare
    ListNode p1 = head, p2 = prev;
    while (p2 != null) {
        if (p1.val != p2.val) return false;
        p1 = p1.next;
        p2 = p2.next;
    }
    return true;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: '3 bước: (1) tìm giữa bằng slow/fast; (2) reverse nửa sau in-place; (3) so từng node. Lưu ý so cho đến khi <code>p2 == null</code> (nửa sau có thể ngắn hơn 1 với n chẵn).'
      }
    },
    {
      id: 'p6', title: 'Remove Nth Node From End', difficulty: 'Medium', url: LC('remove-nth-node-from-end-of-list'),
      hint: 'Fast tiến n bước trước.',
      hints: [
        'Câu hỏi 1: Two pointers cách nhau n bước. Khi fast hit end, slow ở đâu?',
        'Câu hỏi 2: Vì sao cần dummy node? (Xét case xóa head.)'
      ],
      solution: {
        code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}`,
        lang: 'java',
        complexityVi: 'Time O(L) · Space O(1).',
        explanationVi: 'Fast tiến n+1 → slow đứng TRƯỚC node cần xóa khi fast hit null. Dummy tránh special case "xóa head".'
      }
    },
    {
      id: 'p7', title: 'Reorder List', difficulty: 'Medium', url: LC('reorder-list'),
      hint: 'Middle → reverse → merge.',
      hints: [
        'Câu hỏi 1: 3 sub-tasks: find middle, reverse second half, merge alternating. Mỗi tasks bạn đã làm riêng — combine.',
        'Câu hỏi 2: Merge alternating: lấy 1 node từ nửa 1, 1 từ nửa 2 đã reverse, lặp lại.'
      ],
      solution: {
        code: `public void reorderList(ListNode head) {
    // 1. Find middle
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 2. Reverse second half
    ListNode prev = null, curr = slow.next;
    slow.next = null;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    // 3. Merge alternating
    ListNode p1 = head, p2 = prev;
    while (p2 != null) {
        ListNode n1 = p1.next, n2 = p2.next;
        p1.next = p2;
        p2.next = n1;
        p1 = n1;
        p2 = n2;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: '3 phases combined. Lưu ý <code>slow.next = null</code> sau khi tìm giữa → cắt list thành 2 nửa rõ ràng. Merge: zip 2 halves từng cặp.'
      }
    },
    {
      id: 'p8', title: 'Find the Duplicate Number', difficulty: 'Medium', url: LC('find-the-duplicate-number'),
      hint: 'Floyd trên index sequence.',
      hints: [
        'Câu hỏi 1: Coi <code>nums[i]</code> là "next pointer". Mảng n+1 phần tử trong [1..n] → ÍT NHẤT 1 cặp index trỏ cùng node → cycle.',
        'Câu hỏi 2: Áp Floyd 2 stage: detect cycle, rồi find entry. Entry chính là duplicate. Vì sao?'
      ],
      solution: {
        code: `public int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);

    int p = nums[0];
    while (p != slow) {
        p = nums[p];
        slow = nums[slow];
    }
    return p;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Floyd 2 stage trên implicit LL. Stage 1: detect. Stage 2: find entry = duplicate value. Tại sao entry = duplicate? Vì 2 index khác nhau trỏ tới duplicate value → đó là cyclic entry.'
      }
    },
    {
      id: 'p9', title: 'Sort List', difficulty: 'Medium', url: LC('sort-list'),
      hint: 'Find middle để split merge sort.',
      hints: [
        'Câu hỏi 1: Merge sort tự nhiên cho linked list — split bằng slow/fast, merge 2 sorted. O(n log n) time, O(log n) stack.',
        'Câu hỏi 2: Bonus: iterative bottom-up merge sort → O(1) extra space (không counting stack).'
      ],
      solution: {
        code: `public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    // Split bằng slow/fast
    ListNode slow = head, fast = head, prev = null;
    while (fast != null && fast.next != null) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    prev.next = null;
    ListNode left = sortList(head);
    ListNode right = sortList(slow);
    return merge(left, right);
}

private ListNode merge(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else                  { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
        lang: 'java',
        complexityVi: 'Time O(n log n) · Space O(log n) recursion stack.',
        explanationVi: 'Merge sort trên linked list. Slow/fast split tự nhiên (không cần index). Merge dùng dummy + tail pattern. Khác array merge sort: KHÔNG cần extra buffer O(n).'
      }
    },
    {
      id: 'p10', title: 'Circular Array Loop', difficulty: 'Medium', url: LC('circular-array-loop'),
      hint: 'Floyd với điều kiện cùng hướng.',
      hints: [
        'Câu hỏi 1: Khác cycle thường: loop phải CÙNG HƯỚNG (toàn dương hoặc toàn âm). Check dấu trên đường đi.',
        'Câu hỏi 2: Loop length &gt; 1. Tự loop tại 1 element (nums[i] = bội n) không tính.'
      ],
      solution: {
        code: `public boolean circularArrayLoop(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        if (nums[i] == 0) continue;
        int slow = i, fast = i;
        boolean forward = nums[i] > 0;
        while (true) {
            slow = next(nums, slow, forward); if (slow == -1) break;
            fast = next(nums, fast, forward); if (fast == -1) break;
            fast = next(nums, fast, forward); if (fast == -1) break;
            if (slow == fast) return true;
        }
    }
    return false;
}

private int next(int[] nums, int i, boolean forward) {
    int n = nums.length;
    boolean direction = nums[i] > 0;
    if (direction != forward) return -1;     // đổi hướng
    int nxt = ((i + nums[i]) % n + n) % n;
    if (nxt == i) return -1;                  // self loop
    return nxt;
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) worst (mỗi start có thể chạy n steps). Có thể optimize O(n) bằng marking visited.',
        explanationVi: 'Floyd với 2 ràng buộc thêm: (1) cùng hướng — break nếu đổi sign; (2) length &gt; 1 — break nếu self loop. Modulo cẩn thận xử lý số âm.'
      }
    }
  ],
  references: [
    { title: 'Floyd Cycle Finding (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cycle_detection' },
    { title: 'LeetCode Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/' }
  ]

}
