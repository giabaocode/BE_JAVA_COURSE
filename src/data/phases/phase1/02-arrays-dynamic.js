// ============================================================================
//  PHASE 1 — Module 1.2: Arrays & Dynamic Array (Memory & Resize)
// ============================================================================

export default
    {
      id: 'mod-1-2',
      title: 'Arrays & Dynamic Array (ArrayList) — Memory & Resize',
      lessons: [
        {
          id: 'l-1-2-1',
          type: 'theory',
          title: 'Array Memory Layout & Big-O Intuition',
          mentalModel: {
            vi: `Array là <strong>khối liên tục trong RAM</strong>. Nếu <code>int[]</code> bắt đầu ở địa chỉ 1000 và mỗi int = 4 byte, thì <code>arr[7]</code> = địa chỉ <code>1000 + 7*4 = 1028</code>. CPU tính 1 lệnh → access O(1).
<br/><br/>
Nhược: chèn giữa thì shift phần sau → O(n).`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Cache locality</strong>
CPU load dữ liệu theo "cache line" 64 byte. Array nằm liền nhau → đọc <code>arr[0]</code> thì <code>arr[1..15]</code> (với int) đã có sẵn trong L1 cache. LinkedList rải rác → mỗi node một cache miss → chậm gấp 10-100× thực tế dù Big-O bằng.
<br/><br/>
<strong>2) Bounds checking</strong>
Mỗi <code>arr[i]</code> trong Java check <code>0 ≤ i &lt; length</code>. JIT thường loại bỏ check trong loop khi chứng minh được an toàn — gọi là "bounds check elimination".
<br/><br/>
<strong>3) Array covariance</strong>
<code>Object[] os = new String[3]; os[0] = 42;</code> compile OK nhưng runtime ném <code>ArrayStoreException</code>. Bug ẩn nguy hiểm — đây là lý do generics dùng erasure, không covariance.
<br/><br/>
<strong>4) Multi-dim KHÔNG phải 2D contiguous</strong>
<code>int[][] grid = new int[3][4]</code> = mảng các tham chiếu tới các mảng con. Mỗi row là 1 object riêng → KHÔNG đảm bảo cache-friendly cho column scan.`
          },
          theory: {
            vi: `<h3>Bảng độ phức tạp PHẢI THUỘC</h3>
<ul>
  <li>Access theo index — <strong>O(1)</strong></li>
  <li>Search trong unsorted — <strong>O(n)</strong></li>
  <li>Search trong sorted — <strong>O(log n)</strong> (binary search)</li>
  <li>Insert/delete cuối (còn chỗ) — <strong>O(1)</strong></li>
  <li>Insert/delete giữa — <strong>O(n)</strong></li>
</ul>

<h3>The "Why" — Khi nào dùng array thay collection?</h3>
<ul>
  <li>Performance-critical loop với primitive int/double — array tránh autoboxing.</li>
  <li>Size cố định, biết trước (vd: 26 cho a-z) → tránh overhead ArrayList.</li>
  <li>Interop với JNI hoặc native API.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Off-by-one</strong>: <code>for (int i = 0; i &lt;= arr.length; i++)</code> → ArrayIndexOutOfBoundsException. Luôn <code>&lt;</code>, không <code>&lt;=</code>.</li>
  <li><strong>2D confusion</strong>: <code>grid[r][c]</code> — row trước, column sau. Vẽ ra giấy nếu nghi ngờ.</li>
  <li><strong>Arrays.asList rồi add</strong>: <code>List l = Arrays.asList(1,2,3); l.add(4)</code> → UnsupportedOperationException. Wrapper fixed-size.</li>
  <li><strong>Compare bằng <code>==</code></strong>: <code>arr1 == arr2</code> chỉ so reference. Dùng <code>Arrays.equals(arr1, arr2)</code>.</li>
  <li><strong>Copy bằng <code>=</code></strong>: <code>int[] b = a</code> chỉ alias. Dùng <code>Arrays.copyOf(a, a.length)</code> hoặc <code>a.clone()</code>.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Vì sao ArrayList thắng LinkedList trong thực tế?',
              prompt: `Lý thuyết: cả 2 có một số op O(1). Benchmark: ArrayList luôn thắng. KHÔNG cho đáp án. Hỏi tôi:
1. Cache line là gì? CPU load dữ liệu thế nào?
2. Node của LinkedList cấp phát ở đâu trong heap? Có liền nhau?
3. Một cache miss tốn bao nhiêu chu kỳ CPU so với cache hit?
4. Vì sao "constant factor" trong Big-O đôi khi quan trọng hơn cả O()?`
            }
          ],
          exercises: [
            {
              title: 'Reverse array in-place',
              prompt: 'Đảo ngược int[] tại chỗ, O(1) extra space.',
              hints: [
                'Câu hỏi 1: Two pointers từ 2 đầu có giúp gì? Khi nào dừng?',
                'Câu hỏi 2: Vòng lặp chạy đến i &lt; length/2 — vì sao đủ?'
              ],
              solution: {
                code: `public static void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++; right--;
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(n/2) = O(n). Space O(1).',
                explanationVi: 'Two pointers vào giữa. Mỗi bước swap rồi tiến/lùi. Khi left ≥ right thì hết — không cần qua hết mảng.'
              }
            },
            {
              title: 'Rotate array k bước (O(n) space → O(1) space)',
              prompt: 'Cho int[] arr và k, rotate phải k bước. <em>Bonus: O(1) space.</em> Vd: [1,2,3,4,5] k=2 → [4,5,1,2,3].',
              hints: [
                'Câu hỏi 1: Naive: copy ra mảng mới — O(n) space. Có cách nào tránh array mới?',
                'Câu hỏi 2: Reverse 3 lần — toàn bộ, rồi 0..k-1, rồi k..n-1. Vì sao đúng? Vẽ ra giấy.'
              ],
              solution: {
                code: `public static void rotate(int[] arr, int k) {
    int n = arr.length;
    k = ((k % n) + n) % n;            // handle k âm + k > n
    reverse(arr, 0, n - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, n - 1);
}

private static void reverse(int[] arr, int l, int r) {
    while (l < r) {
        int t = arr[l]; arr[l] = arr[r]; arr[r] = t;
        l++; r--;
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — 3 lần reverse, mỗi lần ≤ n/2 swap. Space O(1).',
                explanationVi: 'Trick "reverse 3 lần": (1) reverse toàn bộ → [5,4,3,2,1]; (2) reverse 0..k-1 → [4,5,3,2,1]; (3) reverse k..n-1 → [4,5,1,2,3]. <code>((k%n)+n)%n</code> chuẩn hóa k âm và k &gt; n.'
              }
            }
          ]
        },

        {
          id: 'l-1-2-2',
          type: 'practice',
          title: 'Implementing a Dynamic Array (ArrayList) From Scratch',
          mentalModel: {
            vi: `Mục tiêu: hiểu vì sao <code>ArrayList.add()</code> là <strong>amortized O(1)</strong> dù đôi khi phải copy. Bí mật: <strong>geometric growth</strong> — hết chỗ thì DOUBLE capacity. Tổng cost trên N lần add ≈ 2N operation → trung bình 2/lần.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Amortized analysis</h3>
Cost mỗi resize = capacity cũ. Tổng cost qua N add = 1+2+4+...+N ≈ 2N (geometric series). Trung bình 2/add = O(1) amortized.
<br/><br/>
<strong>Vì sao DOUBLE, không 1.5x?</strong>
JDK ArrayList dùng <code>oldCap + (oldCap >> 1)</code> = 1.5x — giảm waste RAM. Python list pattern ~1.125x. Tradeoff: nhỏ hơn = ít waste RAM, nhưng resize thường hơn → constant factor lớn hơn.
<br/><br/>
<strong>Tại sao KHÔNG <code>capacity + 1</code>?</strong>
Tổng cost qua N add = 1+2+3+...+N = O(N²) → trung bình O(N)/add. Tệ thảm.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào ArrayList thay array thuần?</h3>
<ul>
  <li>Không biết trước size — ArrayList tự grow.</li>
  <li>Cần add/remove động — ArrayList có method sẵn.</li>
  <li>API chuẩn — interop dễ với Collections, Stream, framework.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên set null sau remove</strong> → object cũ giữ reference, GC không dọn được → memory leak ẩn.</li>
  <li><strong>Resize quá nhỏ (capacity + 1)</strong> → O(N) per add — chậm thê thảm với N lớn.</li>
  <li><strong>Iterate while remove</strong> → ConcurrentModificationException qua modCount checks.</li>
  <li><strong>Tin <code>size()</code> bằng <code>capacity</code></strong> → size là count hiện dùng, capacity là sức chứa.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'MyArrayList — bản đầy đủ',
              code: `public class MyArrayList<T> {
    private Object[] data;
    private int size;

    public MyArrayList() {
        this.data = new Object[8];
        this.size = 0;
    }

    public int size() { return size; }

    @SuppressWarnings("unchecked")
    public T get(int i) {
        if (i < 0 || i >= size) throw new IndexOutOfBoundsException();
        return (T) data[i];
    }

    public void add(T v) {
        ensureCapacity(size + 1);
        data[size++] = v;
    }

    private void ensureCapacity(int needed) {
        if (needed <= data.length) return;
        int newCap = Math.max(data.length * 2, needed);
        Object[] bigger = new Object[newCap];
        System.arraycopy(data, 0, bigger, 0, size);
        this.data = bigger;
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự thiết kế resize policy',
              prompt: `KHÔNG đưa code. Hỏi tôi:
1. Nếu mỗi lần thiếu chỗ chỉ tăng capacity + 1, tổng cost qua N add là bao nhiêu?
2. Nếu double, tổng cost? Trung bình mỗi add?
3. Khi remove, có nên shrink? Lúc nào shrink, lúc nào để dành?
4. Nếu shrink khi size &lt; capacity/2, "thrashing" (add-remove liên tục gây resize liên tục) xảy ra ra sao? Cách phòng?`
            }
          ],
          exercises: [
            {
              title: 'add(int index, T value)',
              prompt: 'Method chèn vào giữa. Shift phần sau sang phải. Throw IndexOutOfBoundsException nếu index không hợp lệ.',
              hints: [
                'Câu hỏi 1: <code>System.arraycopy</code> có thể copy chính source array overlap được không?',
                'Câu hỏi 2: Sau khi shift, slot <code>data[index]</code> đã bị overwrite chưa? Cần set giá trị mới ở đâu?'
              ],
              solution: {
                code: `public void add(int index, T value) {
    if (index < 0 || index > size) throw new IndexOutOfBoundsException();
    ensureCapacity(size + 1);
    // Shift sang phải: phần [index..size-1] → [index+1..size]
    System.arraycopy(data, index, data, index + 1, size - index);
    data[index] = value;
    size++;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — worst case shift toàn bộ (index = 0). Best O(1) khi index = size. Space O(1) extra (có thể trigger resize O(n) copy).',
                explanationVi: '<code>System.arraycopy</code> handle overlap chuẩn — internally check direction. Sau shift, slot index trống → assign value mới.'
              }
            },
            {
              title: 'remove(int index)',
              prompt: 'Xóa phần tử ở index, shift phần sau sang trái. PHẢI set slot cuối = null. Throw nếu index invalid.',
              hints: [
                'Câu hỏi 1: Nếu KHÔNG set <code>data[--size] = null</code>, hậu quả là gì?',
                'Câu hỏi 2: Cần generic cast khi return — vì sao? Type erasure cho phép cast luôn?'
              ],
              solution: {
                code: `@SuppressWarnings("unchecked")
public T remove(int index) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    T removed = (T) data[index];
    // Shift sang trái
    System.arraycopy(data, index + 1, data, index, size - index - 1);
    data[--size] = null;        // QUAN TRỌNG: để GC dọn được
    return removed;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — shift trung bình n/2. Space O(1).',
                explanationVi: 'Nếu không set null, slot cuối vẫn giữ reference cũ → object popped không được GC dọn dù caller release → leak ẩn. JDK ArrayList code thật cũng có dòng <code>elementData[--size] = null</code>.'
              }
            },
            {
              title: 'Iterator<T> + fail-fast ConcurrentModificationException',
              prompt: 'Implement Iterable<T>. Bonus: throw ConcurrentModificationException nếu list bị modify trong khi iterate.',
              hints: [
                'Câu hỏi 1: <code>modCount</code> là gì? Track ra sao? Iterator chụp lại giá trị nào và khi nào?',
                'Câu hỏi 2: Iterator nội bộ có cần biết thay đổi của list không? Phát hiện ra sao tại next()?'
              ],
              solution: {
                code: `public class MyArrayList<T> implements Iterable<T> {
    private Object[] data = new Object[8];
    private int size = 0;
    private int modCount = 0;   // tăng mỗi lần add/remove

    public void add(T v) { /* ... */ modCount++; }
    public T remove(int i) { /* ... */ modCount++; return removed; }

    @Override public Iterator<T> iterator() {
        return new Iterator<>() {
            int cursor = 0;
            int expectedModCount = modCount;   // chụp lúc tạo

            @Override public boolean hasNext() { return cursor < size; }

            @SuppressWarnings("unchecked")
            @Override public T next() {
                if (modCount != expectedModCount)
                    throw new ConcurrentModificationException();
                if (cursor >= size) throw new NoSuchElementException();
                return (T) data[cursor++];
            }
        };
    }
}`,
                lang: 'java',
                complexityVi: 'next/hasNext O(1). modCount overhead O(1) per modify.',
                explanationVi: 'Fail-fast pattern: iterator chụp <code>modCount</code> lúc create. Mọi modify (add/remove/clear) tăng <code>modCount</code>. Tại <code>next()</code>, so sánh — khác = ai đó modify giữa iteration → throw. Tránh trả về data inconsistent.'
              }
            }
          ]
        }
      ]
    }
