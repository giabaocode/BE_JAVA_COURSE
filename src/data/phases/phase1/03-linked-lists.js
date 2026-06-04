// ============================================================================
//  PHASE 1 — Module 1.3: Linked Lists (Pointer Manipulation)
// ============================================================================

export default
    {
      id: 'mod-1-3',
      title: 'Linked Lists — Pointer Manipulation Mental Model',
      lessons: [
        {
          id: 'l-1-3-1',
          type: 'theory',
          title: 'Singly Linked List — Tư duy con trỏ',
          mentalModel: {
            vi: `Mỗi <strong>node</strong> là một hộp 2 ngăn: ngăn 1 chứa giá trị, ngăn 2 chứa "địa chỉ hộp tiếp theo" (hoặc <code>null</code> nếu hết). List chỉ giữ con trỏ <code>head</code> (và tùy chọn <code>tail</code>, <code>size</code>).
<br/><br/>
<strong>Bí kíp giấy bút</strong>: trước khi code, VẼ các node, đánh dấu pointer cần sửa (prev, curr, next). Khi bug, vẽ lại từng bước. 90% bug LL là quên cập nhật 1 pointer hoặc cập nhật sai thứ tự.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Heap allocation per node</strong>
Mỗi <code>new Node()</code> = 1 allocation. Với 1 triệu node:
<ul>
<li>ArrayList&lt;Integer&gt;: 1 mảng + 1M Integer ≈ 24 MB.</li>
<li>LinkedList&lt;Integer&gt;: 1M Integer + 1M Node (~32 byte overhead/node) ≈ 56 MB.</li>
</ul>
LinkedList tốn ~2.3× RAM so với ArrayList cho cùng số phần tử.
<br/><br/>
<strong>2) Cache miss per traversal</strong>
Nodes rải rác trong heap → mỗi traversal node = 1 cache miss (~50-100 cycle so với 1-3 cycle cache hit). Traversal 1M node = ~50ms LL vs ~5ms ArrayList — order of magnitude khác biệt.
<br/><br/>
<strong>3) Vì sao Java's LinkedList ít ai dùng?</strong>
Nó implement cả List và Deque, nhưng cho mọi op (kể cả add đầu), ArrayDeque nhanh hơn nhờ cache locality. Quy tắc: <em>nếu bạn nghĩ "có lẽ tôi cần LinkedList", bạn đang nhầm</em>. Trừ khi cần O(1) remove bằng node reference (LRU cache).`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào LL thực sự win?</h3>
<ul>
  <li><strong>LRU Cache</strong>: kết hợp HashMap + doubly LL để O(1) move-to-front.</li>
  <li><strong>Undo/Redo</strong>: chỉ cần push/pop, không cần random access.</li>
  <li><strong>OS scheduler</strong>: process queue insert/remove ở giữa biết node ref.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Quên update tail</strong> khi addFirst vào empty list → tail = null nhưng head != null → inconsistent.</li>
  <li><strong>Cập nhật pointer sai thứ tự khi reverse</strong>: <code>curr.next = prev; curr = curr.next;</code> → infinite loop. Phải lưu <code>next</code> trước khi cắt.</li>
  <li><strong>NPE khi traversal</strong>: <code>while (curr.next != null)</code> dừng ở node CUỐI. Để xử lý cả node cuối, dùng <code>while (curr != null)</code>.</li>
  <li><strong>Equality bằng <code>==</code></strong> giữa 2 LL → chỉ so head reference. Cần loop so từng value.</li>
  <li><strong>Không xử lý cycle</strong> khi traverse → infinite loop. Floyd's algorithm phát hiện.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'SinglyLinkedList — bản đầy đủ',
              code: `public class SinglyLinkedList<T> {
    private static class Node<T> {
        T value;
        Node<T> next;
        Node(T v) { this.value = v; }
    }

    private Node<T> head;
    private Node<T> tail;
    private int size;

    public void addFirst(T v) {
        Node<T> n = new Node<>(v);
        n.next = head;
        head = n;
        if (tail == null) tail = n;
        size++;
    }

    public void addLast(T v) {
        Node<T> n = new Node<>(v);
        if (tail == null) { head = tail = n; }
        else { tail.next = n; tail = n; }
        size++;
    }

    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T v = head.value;
        head = head.next;
        if (head == null) tail = null;
        size--;
        return v;
    }
}`
            },
            {
              title: 'Reverse in-place — pattern "ba con trỏ"',
              code: `public Node<T> reverse(Node<T> head) {
    Node<T> prev = null;
    Node<T> curr = head;
    while (curr != null) {
        Node<T> next = curr.next;   // 1. lưu next TRƯỚC khi cắt
        curr.next = prev;            // 2. đảo hướng
        prev = curr;                 // 3. tiến prev
        curr = next;                 // 4. tiến curr
    }
    return prev;   // prev = head mới
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự nghĩ ra reverse algorithm',
              prompt: `KHÔNG cho code. Đảo ngược singly LL TẠI CHỖ (O(1) space). Dẫn dắt:
1. Đứng ở node X muốn quay mũi tên ngược lại (X.next = node trước X) — singly có biết node trước không?
2. Cần lưu pointer nào TRƯỚC khi sửa X.next? Vì sao?
3. Có 3 con trỏ prev, curr, next — thứ tự cập nhật là gì?
4. Vòng lặp dừng khi nào? Return cái gì làm head mới?`
            },
            {
              title: 'Cycle detection',
              prompt: `LL có thể có cycle. KHÔNG cho code. Hỏi tôi:
1. Nếu dùng HashSet lưu node visited — chi phí time/space?
2. Có cách O(1) space không? Hint: 2 con trỏ tốc độ khác nhau.
3. Tortoise (1 bước) + Hare (2 bước) — vì sao chắc chắn gặp nếu có cycle?
4. Sau khi gặp, làm sao tìm node bắt đầu cycle?`
            }
          ],
          exercises: [
            {
              title: 'Reverse iteratively',
              prompt: 'Reverse singly LL in-place, O(1) extra space. Return head mới.',
              hints: [
                'Câu hỏi 1: Trước khi đảo <code>curr.next = prev</code>, bạn còn truy cập được node tiếp theo không?',
                'Câu hỏi 2: Khi vòng lặp dừng (curr == null), <code>prev</code> đang ở đâu?'
              ],
              solution: {
                code: `public ListNode reverse(ListNode head) {
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
                complexityVi: 'Time O(n) — mỗi node thăm 1 lần. Space O(1) — chỉ 3 biến.',
                explanationVi: '3 con trỏ: prev (đã xử lý), curr (đang xử lý), next (chưa xử lý — backup). Thứ tự CỰC QUAN TRỌNG: lưu next → cắt curr.next → tiến prev → tiến curr. Sai thứ tự → mất reference phần còn lại của list.'
              }
            },
            {
              title: 'Detect cycle (Floyd tortoise-hare)',
              prompt: 'Trả true nếu LL có cycle. O(1) space.',
              hints: [
                'Câu hỏi 1: Khi cả 2 con trỏ ĐÃ vào cycle, khoảng cách hai con trỏ thay đổi ra sao mỗi step?',
                'Câu hỏi 2: Tại sao vòng lặp điều kiện là <code>fast != null && fast.next != null</code>?'
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
                complexityVi: 'Time O(n) — khi cả 2 vào cycle, khoảng cách giảm 1 mỗi step → gặp trong ≤ cycle length. Space O(1).',
                explanationVi: 'Hare nhanh hơn 2×. Nếu có cycle, gap (fast − slow) giảm 1 mỗi step (cộng theo mod chu kỳ) → về 0 tất yếu. Nếu KHÔNG cycle, fast hit null trước.'
              }
            },
            {
              title: 'Find middle (1 pass)',
              prompt: 'Trả node giữa LL. Nếu chẵn, trả node thứ 2 trong 2 node giữa.',
              hints: [
                'Câu hỏi 1: Có thể count length rồi loop n/2 — 2 pass. Có cách 1 pass không?',
                'Câu hỏi 2: Khi fast hit null (chẵn) hoặc fast.next null (lẻ), slow đang ở đâu?'
              ],
              solution: {
                code: `public ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — 1 pass. Space O(1).',
                explanationVi: 'Hare đi 2×, slow đi 1×. Khi hare hit end, slow ở giữa. Với n chẵn, slow ở node "thứ 2 trong 2 node giữa" (LeetCode convention).'
              }
            },
            {
              title: 'Remove N-th from end',
              prompt: 'Cho LL và n, xóa node thứ n từ cuối. 1 pass. Vd: [1,2,3,4,5] n=2 → [1,2,3,5].',
              hints: [
                'Câu hỏi 1: Two pointers cách nhau n bước. Khi fast hit end, slow ở đâu?',
                'Câu hỏi 2: Vì sao dùng dummy node? Xét case xóa head.'
              ],
              solution: {
                code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);   // dummy → head → ...
    ListNode fast = dummy, slow = dummy;

    // Fast tiến n+1 bước (để slow dừng TRƯỚC node cần xóa)
    for (int i = 0; i <= n; i++) fast = fast.next;

    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;     // bypass node cần xóa
    return dummy.next;
}`,
                lang: 'java',
                complexityVi: 'Time O(L) với L = length. Space O(1).',
                explanationVi: '<strong>Dummy node trick</strong>: tạo node ảo trước head → KHÔNG cần xử lý special case "xóa head". Fast đi trước n+1 → khi fast = null, slow đứng NGAY TRƯỚC node cần xóa → bypass bằng <code>slow.next = slow.next.next</code>.'
              }
            }
          ]
        },

        {
          id: 'l-1-3-2',
          type: 'theory',
          title: 'Doubly Linked List & The LRU Cache Use Case',
          mentalModel: {
            vi: `Doubly LL = mỗi node có cả <code>prev</code> + <code>next</code>. Chi phí: thêm 1 pointer/node (~8 byte). Lợi ích: <strong>remove(node) trong O(1)</strong> nếu đã có reference.
<br/><br/>
<strong>Killer use case</strong>: LRU Cache. Cần: (a) tra cứu O(1) theo key, (b) đẩy item lên "mới nhất" O(1) khi access, (c) loại bỏ "cũ nhất" O(1) khi đầy. → HashMap + DoublyLL.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Sentinel nodes</h3>
Thay vì <code>head</code>/<code>tail</code> có thể null, dùng 2 node "dummy" ảo. Lợi ích: KHÔNG bao giờ check null khi insert/remove. Code sạch hơn nhiều, ít bug edge case (empty list, single node).
<br/><br/>
<strong>Memory overhead</strong>:
DoublyLL ~48 byte/node (value + prev + next + header) vs singly ~32 byte/node. Đáng cho use case như LRU.
<br/><br/>
<strong>Concurrent DLL</strong>:
ConcurrentLinkedDeque trong Java dùng lock-free với CAS — phức tạp. Đa số trường hợp dùng <code>BlockingDeque</code> đơn giản hơn.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào dùng DLL?</h3>
<ul>
  <li>Cần traverse cả 2 hướng (vd: browser history).</li>
  <li>Cần O(1) remove tại node đã biết — LRU, MRU.</li>
  <li>Cần insertBefore(node) O(1).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Forget update both directions</strong> khi insert/remove → list inconsistent.</li>
  <li><strong>Không dùng sentinel</strong> → code phình to vì xử lý null. Sentinel = vài byte RAM đổi lấy 50% lines of code.</li>
  <li><strong>LRU không link 2 helper</strong> (addToFront + unlink) → bug rất khó debug. Tách 2 helper riêng và TEST.</li>
  <li><strong>HashMap value lưu Node, KHÔNG lưu V</strong> — đây là sai lầm phổ biến. Map lưu Node để có thể move-to-front O(1).</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'LRU Cache — bộ khung đầy đủ',
              code: `public class LRUCache<K, V> {
    static class Node<K, V> {
        K key; V value;
        Node<K, V> prev, next;
        Node(K k, V v) { this.key = k; this.value = v; }
    }

    private final int capacity;
    private final Map<K, Node<K, V>> map = new HashMap<>();
    private final Node<K, V> head = new Node<>(null, null);   // sentinel
    private final Node<K, V> tail = new Node<>(null, null);   // sentinel

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }

    public V get(K key) {
        Node<K, V> n = map.get(key);
        if (n == null) return null;
        moveToFront(n);
        return n.value;
    }

    public void put(K key, V value) {
        Node<K, V> existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToFront(existing);
            return;
        }
        Node<K, V> n = new Node<>(key, value);
        map.put(key, n);
        addToFront(n);
        if (map.size() > capacity) {
            Node<K, V> oldest = tail.prev;
            unlink(oldest);
            map.remove(oldest.key);
        }
    }

    private void addToFront(Node<K, V> n) {
        n.prev = head; n.next = head.next;
        head.next.prev = n; head.next = n;
    }
    private void unlink(Node<K, V> n) {
        n.prev.next = n.next; n.next.prev = n.prev;
    }
    private void moveToFront(Node<K, V> n) { unlink(n); addToFront(n); }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'LRU Cache — dẫn dắt thiết kế',
              prompt: `KHÔNG cho code. Dẫn dắt:
1. Để get O(1) theo key — cấu trúc nào?
2. Để track "access order" + remove O(1) — cấu trúc nào? Vì sao không ArrayList?
3. Khi access item, đẩy lên đầu O(1) — cần biết node trước nó không? Singly hay doubly?
4. Vì sao kết hợp HashMap + DoublyLL? Map lưu gì — V hay Node?
5. Sentinel head/tail giúp gì cho code?`
            }
          ],
          exercises: [
            {
              title: 'LRU Cache full implementation',
              prompt: 'Implement LRUCache(capacity) với get(key)→V hoặc null, put(key, value). Both O(1) average.',
              hints: [
                'Câu hỏi 1: HashMap lưu key → V hay key → Node? Vì sao Node?',
                'Câu hỏi 2: Khi put trigger eviction, làm sao biết key cũ nhất để remove khỏi map?'
              ],
              solution: {
                code: `class LRUCache {
    static class Node { int key, val; Node prev, next; Node(int k, int v) { key = k; val = v; } }

    private final int cap;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.cap = capacity;
        head.next = tail; tail.prev = head;
    }

    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        moveToFront(n);
        return n.val;
    }

    public void put(int key, int value) {
        Node existing = map.get(key);
        if (existing != null) { existing.val = value; moveToFront(existing); return; }
        Node n = new Node(key, value);
        map.put(key, n);
        addFront(n);
        if (map.size() > cap) {
            Node oldest = tail.prev;
            unlink(oldest);
            map.remove(oldest.key);
        }
    }

    private void addFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }
    private void unlink(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void moveToFront(Node n) { unlink(n); addFront(n); }
}`,
                lang: 'java',
                complexityVi: 'Time: get O(1) average, put O(1) average. Space O(capacity).',
                explanationVi: 'HashMap lưu <code>key → Node</code> để khi get/put có thể MOVE node trong DLL O(1). Nếu chỉ lưu <code>key → V</code>, mỗi access phải scan DLL để tìm node → O(n). Sentinel head/tail xóa edge case empty/single.'
              }
            }
          ]
        }
      ],
  references: [
    { title: 'LinkedList JavaDoc', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedList.html' },
    { title: 'LinkedList source (OpenJDK)', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/LinkedList.java' },
    { title: 'LRU Cache implementation reference', url: 'https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU' }
  ]

    }
