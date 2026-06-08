// ============================================================================
//  PHASE 1 — Module 1.5: HashMap & HashSet (Collisions Under the Hood)
// ============================================================================

export default
    {
      id: 'mod-1-5',
      title: 'HashMap & HashSet — How Collisions Really Work',
  prerequisites: { vi: 'Hoàn thành <code>Module 1.2</code>. Hiểu <code>equals()</code>, <code>hashCode()</code> từ OOP Pillars.' },
      lessons: [
        {
          id: 'l-1-5-1',
          type: 'theory',
          title: 'HashMap Internals — Buckets, Hashing, Collisions, Treeify',
          subtitle: { vi: 'Cấu trúc dữ liệu QUAN TRỌNG NHẤT phải hiểu tường tận.' },
          mentalModel: {
            vi: `Hình dung HashMap như <strong>tủ nhiều ngăn kéo</strong> (buckets). Cất (key, value):
<ol>
<li>Tính <code>hash = key.hashCode()</code>.</li>
<li>Chọn ngăn: <code>index = hash &amp; (capacity - 1)</code>.</li>
<li>Vào ngăn, check key đã có chưa (equals). Có → overwrite; chưa → thêm.</li>
</ol>
Khi nhiều key rơi vào CÙNG ngăn (collision), ngăn thành <strong>linked list</strong>. Java 8+: list quá dài (&gt;8) → tự chuyển <strong>red-black tree</strong> để O(log n) thay O(n).`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Vì sao capacity LUÔN là power of 2?</strong>
Để dùng <code>hash &amp; (cap-1)</code> thay <code>hash % cap</code> (modulo chậm 5-10×). VD cap=16: <code>cap-1=15=0b1111</code> → <code>hash &amp; 15</code> = 4 bit cuối. Phân bố đều 0..15.
<br/><br/>
<strong>2) Vì sao Java rehash hash()?</strong>
JDK gọi <code>(h = key.hashCode()) ^ (h >>> 16)</code> trước khi mask. Mục đích: trộn bit cao xuống thấp. Nhiều hashCode tệ phân bố toàn ở bit cao (<code>Integer.hashCode() = value</code> — số nhỏ thì bit cao toàn 0). Không trộn → mọi key rơi vào bucket 0..15 dù cap = 1M.
<br/><br/>
<strong>3) Load factor 0.75 — vì sao?</strong>
Tradeoff:
<ul>
<li>Nhỏ (0.5) → ít collision, tốn RAM, resize liên tục.</li>
<li>Lớn (0.9) → tiết kiệm RAM, nhiều collision.</li>
</ul>
0.75 là điểm cân bằng thực nghiệm — Poisson distribution cho thấy với LF 0.75, ~88% bucket có 0-1 entry, &lt;1% bucket có ≥4.
<br/><br/>
<strong>4) Treeify threshold</strong>
Khi 1 bucket có ≥8 entry: linked list → red-black tree (O(log n) operations). Khi shrink &lt;6: tree → list. Hysteresis tránh flip-flop.
<br/><br/>
<strong>5) Resize split bucket thành 2</strong>
Cap 16→32. Một key cũ ở bucket i giờ phải ở i HOẶC i+16 (thêm 1 bit). JDK tận dụng: KHÔNG rehash, chỉ check 1 bit để biết key ở lại i hay sang i+16. Tiết kiệm khổng lồ.
<br/><br/>
<strong>6) HashMap KHÔNG thread-safe</strong>
2 thread cùng put có thể infinite loop (bug nổi tiếng Java 7) hoặc data loss. Dùng <code>ConcurrentHashMap</code> cho multi-thread.`
          },
          theory: {
            vi: `<h3>The "Why" — HashMap vs TreeMap vs LinkedHashMap?</h3>
<ul>
  <li><strong>HashMap</strong> — O(1) average, no order. Default choice.</li>
  <li><strong>TreeMap</strong> — O(log n), sorted by key. Cần range query (floorKey, ceilingKey).</li>
  <li><strong>LinkedHashMap</strong> — O(1) + insertion order. <code>accessOrder=true</code> → LRU-friendly out of box.</li>
</ul>

<h3>Junior Pitfalls — RẤT HAY mắc</h3>
<ul>
  <li><strong>Override <code>equals()</code> mà quên <code>hashCode()</code></strong> → put rồi get null. Quy tắc bất di bất dịch.</li>
  <li><strong>Key mutable, mutate sau put</strong> → key "biến mất" khỏi map. Bucket index tính lại không trùng.</li>
  <li><strong>HashMap trong multi-thread</strong> → infinite loop / data loss. Dùng ConcurrentHashMap.</li>
  <li><strong>Iterate Map.Entry và remove qua map.remove(key)</strong> → ConcurrentModificationException. Dùng iterator.remove().</li>
  <li><strong>Custom hashCode trả constant</strong> (vd <code>return 0</code>) → mọi key vào 1 bucket → suy biến O(n). Performance disaster.</li>
  <li><strong>Khởi tạo capacity quá nhỏ</strong> cho map lớn → resize liên tục. <code>new HashMap&lt;&gt;(expectedSize)</code> nếu biết trước.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'MyHashMap với separate chaining (comment tiếng Việt)',
              code: `public class MyHashMap<K, V> {
    private static class Entry<K, V> {
        final K key;
        V value;
        Entry<K, V> next;
        Entry(K k, V v) { this.key = k; this.value = v; }
    }

    private Entry<K, V>[] table;
    private int size = 0;
    private static final float LOAD_FACTOR = 0.75f;

    @SuppressWarnings("unchecked")
    public MyHashMap() { this.table = (Entry<K, V>[]) new Entry[16]; }

    private int bucket(Object key) {
        if (key == null) return 0;
        int h = key.hashCode();
        h = h ^ (h >>> 16);                  // trộn bit cao xuống thấp
        return h & (table.length - 1);       // power of 2 trick
    }

    public V get(K key) {
        for (Entry<K, V> e = table[bucket(key)]; e != null; e = e.next) {
            if (Objects.equals(e.key, key)) return e.value;
        }
        return null;
    }

    public void put(K key, V value) {
        int b = bucket(key);
        for (Entry<K, V> e = table[b]; e != null; e = e.next) {
            if (Objects.equals(e.key, key)) { e.value = value; return; }
        }
        Entry<K, V> head = new Entry<>(key, value);
        head.next = table[b];
        table[b] = head;
        size++;
        if (size > table.length * LOAD_FACTOR) resize();
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        Entry<K, V>[] old = table;
        table = (Entry<K, V>[]) new Entry[old.length * 2];
        size = 0;
        for (Entry<K, V> head : old)
            for (Entry<K, V> e = head; e != null; e = e.next) put(e.key, e.value);
    }

    public int size() { return size; }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Suy luận từ đầu về HashMap',
              prompt: `Tự nghĩ ra HashMap KHÔNG đọc tài liệu. KHÔNG cho code. Hỏi tôi:
1. Nếu chỉ dùng 1 mảng và lưu (key, value) tại index = hash(key), điều gì xảy ra khi 2 key cùng hash?
2. 2 cách giải collision chính là gì? (chaining vs open addressing)
3. Khi nào mảng "đầy" và cần resize? Đo bằng tiêu chí gì?
4. Resize N → 2N — phải làm gì với entry cũ? Rehash hết hay shortcut?
5. Nếu hashCode() của key tệ (return 0), HashMap suy biến thành cái gì?
6. Key mutable, sửa field sau put — get() còn lấy được không? Tại sao?`
            },
            {
              title: 'Vì sao equals & hashCode phải đi đôi?',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Hai object equals == true → hashCode bằng nhau? Vì sao? Hỏng cái gì nếu không?
2. Hai object hashCode bằng nhau → equals có cần true không?
3. Chỉ override equals (quên hashCode) — put rồi get có lấy được không?
4. Chỉ override hashCode (quên equals) — put 2 lần cùng "key" có thành 2 entry không?
5. IDE auto-generate hashCode/equals — vì sao dùng CÙNG field?`
            }
          ],
          exercises: [
            {
              title: 'remove(K key)',
              prompt: 'Unlink entry khỏi bucket list. Trả old value hoặc null.',
              hints: [
                'Câu hỏi 1: Cần track previous khi traverse bucket list — vì sao?',
                'Câu hỏi 2: Edge case: entry cần remove là HEAD của bucket — xử lý ra sao?'
              ],
              solution: {
                code: `public V remove(K key) {
    int b = bucket(key);
    Entry<K, V> prev = null;
    for (Entry<K, V> e = table[b]; e != null; e = e.next) {
        if (Objects.equals(e.key, key)) {
            if (prev == null) table[b] = e.next;     // entry là HEAD
            else              prev.next = e.next;    // bypass entry
            size--;
            return e.value;
        }
        prev = e;
    }
    return null;
}`,
                lang: 'java',
                complexityVi: 'Time O(1) average, O(n) worst (bucket toàn collision). Space O(1).',
                explanationVi: 'Singly linked list cần track previous để unlink. Edge case head: <code>table[b] = e.next</code> thay vì <code>prev.next = e.next</code>.'
              }
            },
            {
              title: 'MyHashSet built on MyHashMap',
              prompt: 'Implement HashSet bằng cách wrap MyHashMap<E, Object>.',
              hints: [
                'Câu hỏi 1: HashMap cần (key, value). HashSet chỉ cần key. Value đặt gì cho tiện?',
                'Câu hỏi 2: contains, add, remove của Set — map sang method nào của underlying Map?'
              ],
              solution: {
                code: `public class MyHashSet<E> {
    private static final Object PRESENT = new Object();   // sentinel singleton
    private final MyHashMap<E, Object> map = new MyHashMap<>();

    public void add(E value)        { map.put(value, PRESENT); }
    public boolean contains(E v)    { return map.get(v) != null; }
    public boolean remove(E v)      { return map.remove(v) != null; }
    public int size()                { return map.size(); }
}`,
                lang: 'java',
                complexityVi: 'Tất cả O(1) average — kế thừa từ MyHashMap.',
                explanationVi: 'Composition: HashSet thực sự là HashMap với value cố định (sentinel). Một Object PRESENT dùng chung — tiết kiệm memory. Đây là cách JDK HashSet hiện thực thật.'
              }
            }
          ]
        }
      ],
  references: [
    { title: 'HashMap JavaDoc (Java 21)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html' },
    { title: 'HashMap source (OpenJDK)', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/HashMap.java' },
    { title: 'JEP 180 -Improve hash collisions (treeify)', url: 'https://bugs.openjdk.org/browse/JDK-8023463' }
  ]

    }
