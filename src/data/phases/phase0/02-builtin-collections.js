// Module 0.2 — Built-in Collections (DÙNG, không implement)
export default {
  id: 'mod-0-2',
  title: 'Built-in Collections — DÙNG trước khi Implement',
  prerequisites: { vi: 'Hoàn thành <code>Module 0.1 — Syntax Essentials</code> (biến, vòng lặp, method).' },
  lessons: [
    {
      id: 'l-0-2-1',
      type: 'practice',
      title: 'Arrays — int[], 2D Array, Common Operations',
      subtitle: { vi: 'Lesson 6/15. Array là cấu trúc cơ bản nhất trong LeetCode.' },
      mentalModel: {
        vi: `Array trong Java có size CỐ ĐỊNH sau khi tạo. KHÔNG add/remove.
<ul>
<li>Tạo: <code>int[] arr = new int[5];</code> (default 0) hoặc <code>int[] arr = {1, 2, 3};</code></li>
<li>Length: <code>arr.length</code> (KHÔNG có dấu ngoặc — là property, không phải method).</li>
<li>Access: <code>arr[0]</code>, <code>arr[arr.length - 1]</code> (cuối).</li>
<li>2D: <code>int[][] grid = new int[3][4];</code> — 3 hàng, 4 cột.</li>
</ul>
Khi cần size động → dùng ArrayList (lesson tiếp).`
      },
      theory: {
        vi: `<h3>API cheat sheet</h3>
<pre>// Tạo
int[] arr = new int[5];           // [0, 0, 0, 0, 0]
int[] arr2 = {1, 2, 3, 4, 5};
String[] names = {"Alice", "Bob"};

// Length (property, không phải method!)
arr.length                         // 5

// Iterate
for (int i = 0; i &lt; arr.length; i++) System.out.println(arr[i]);
for (int x : arr) System.out.println(x);

// Tools java.util.Arrays
import java.util.Arrays;
Arrays.toString(arr)               // "[1, 2, 3, 4, 5]"
Arrays.sort(arr)                   // sort tăng dần (in-place)
Arrays.fill(arr, 0)                // điền giá trị
int[] copy = Arrays.copyOf(arr, 10); // copy + resize
int[] sub = Arrays.copyOfRange(arr, 1, 4); // [arr[1], arr[2], arr[3]]
Arrays.binarySearch(arr, 3)        // tìm index (mảng đã sort)

// 2D
int[][] grid = new int[3][4];
grid[1][2] = 7;
grid.length                        // 3 (số hàng)
grid[0].length                     // 4 (số cột)</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>arr.length()</strong> SAI → <code>arr.length</code> (no parens). String thì <code>s.length()</code> CÓ parens. Lẫn lộn.</li>
  <li><strong>ArrayIndexOutOfBoundsException</strong>: <code>arr[arr.length]</code> sai — index max = length - 1.</li>
  <li><strong>Arrays.equals() vs ==</strong>: <code>arr1 == arr2</code> chỉ so reference. <code>Arrays.equals(arr1, arr2)</code> so nội dung.</li>
  <li><strong>Arrays.toString() cho 2D</strong>: in <code>[I@1a2b3c</code> (memory address). Dùng <code>Arrays.deepToString(grid)</code> cho 2D.</li>
  <li><strong>int[] vs Integer[]</strong>: int[] = primitive array; Integer[] = object array. Khác behavior với Arrays.sort, Collections, autoboxing.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Tổng doanh thu trong ngày',
          prompt: 'Cho <code>long[] orderTotalsCents</code> (giá trị từng order trong ngày, đơn vị xu để tránh double precision). Return tổng doanh thu.',
          hints: ['For-each loop accumulator.', 'Dùng <code>long</code> KHÔNG dùng <code>int</code> — tiền có thể overflow int khi tổng vượt 21 triệu (2^31 / 100).'],
          solution: {
            code: `public class DailyRevenue {
    public static long totalRevenue(long[] orderTotalsCents) {
        long total = 0L;
        for (long cents : orderTotalsCents) total += cents;
        return total;
    }

    public static void main(String[] args) {
        // 5 đơn hàng: 50k, 120k, 80k, 200k, 30k VND
        long[] orders = {5_000_000L, 12_000_000L, 8_000_000L, 20_000_000L, 3_000_000L};
        System.out.println(totalRevenue(orders) / 100);  // 480000 (đơn vị đồng)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'For-each clean. <strong>BẮT BUỘC <code>long</code> cho tiền</strong> — Phase 3+4 sẽ dạy chi tiết về Money pattern (BIGINT cents). Đây là warm-up cho thói quen đó.'
          }
        },
        {
          title: 'Order lớn nhất trong ngày',
          prompt: 'Cho <code>long[] orderTotalsCents</code>, return giá trị order CAO NHẤT. Edge case: mảng rỗng → throw <code>IllegalArgumentException("Không có order nào")</code>.',
          hints: ['Khởi tạo <code>max = arr[0]</code> (KHÔNG dùng <code>Long.MIN_VALUE</code> trừ khi handle empty trước).', 'Loop từ <code>i = 1</code>.'],
          solution: {
            code: `public class TopOrder {
    public static long maxOrder(long[] orderTotalsCents) {
        if (orderTotalsCents.length == 0)
            throw new IllegalArgumentException("Không có order nào");
        long max = orderTotalsCents[0];
        for (int i = 1; i < orderTotalsCents.length; i++) {
            if (orderTotalsCents[i] > max) max = orderTotalsCents[i];
        }
        return max;
    }

    public static void main(String[] args) {
        long[] today = {5_000_000L, 12_000_000L, 8_000_000L, 20_000_000L};
        System.out.println(maxOrder(today) / 100);  // 200000 đồng = order 200k cao nhất
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Track max so far. Start <code>i = 1</code> vì max init = <code>arr[0]</code>. Bài này dùng nguyên xi cho dashboard "đơn cao nhất hôm nay".'
          }
        },
        {
          title: 'Reverse array in-place',
          prompt: 'Đảo ngược mảng TẠI CHỖ (O(1) space).',
          hints: ['Two pointers từ 2 đầu, swap rồi tiến/lùi.', 'Loop khi <code>l &lt; r</code>.'],
          solution: {
            code: `public class ReverseArr {
    public static void reverse(int[] arr) {
        int l = 0, r = arr.length - 1;
        while (l < r) {
            int tmp = arr[l]; arr[l] = arr[r]; arr[r] = tmp;
            l++; r--;
        }
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        reverse(arr);
        System.out.println(java.util.Arrays.toString(arr));  // [5, 4, 3, 2, 1]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n/2) = O(n) · Space O(1).',
            explanationVi: 'Two pointers — pattern cơ bản nhất. Swap qua biến tmp. <code>l &lt; r</code> đủ — khi l == r (giữa) không cần swap.'
          }
        },
        {
          title: 'Đếm order "premium" (≥ 1 triệu VND)',
          prompt: 'Cho <code>long[] orderTotalsCents</code>, đếm số order có giá trị ≥ 100_000_000 xu (= 1 triệu VND). Đây là pattern PHỔ BIẾN trong dashboard analytics.',
          hints: ['Threshold constant: <code>final long PREMIUM_CENTS = 100_000_000L</code>.', 'For-each + if + count++.'],
          solution: {
            code: `public class PremiumOrderCount {
    private static final long PREMIUM_CENTS = 100_000_000L;  // 1 triệu VND

    public static int countPremium(long[] orderTotalsCents) {
        int count = 0;
        for (long cents : orderTotalsCents) {
            if (cents >= PREMIUM_CENTS) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        // 5tr, 1tr (đúng ngưỡng), 999k, 2tr → 3 order premium
        long[] orders = {500_000_000L, 100_000_000L, 99_900_000L, 200_000_000L};
        System.out.println(countPremium(orders));  // 3
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Filter pattern: duyệt 1 lần, đếm phần tử thỏa điều kiện. Đặt threshold thành <code>final</code> constant để code tự giải thích (≥ 1 triệu VND) thay vì rải số "magic" <code>100_000_000L</code> khắp nơi. Dùng <code>>=</code> (không phải <code>></code>) vì order đúng 1 triệu cũng tính là premium. Tiền luôn lưu bằng <code>long</code> xu — không bao giờ <code>double</code>.'
          }
        },
        {
          title: '2D Grid: print transposed',
          prompt: 'Cho int[][] grid 3×4, in transpose (4×3 — swap row/col).',
          hints: ['Outer loop col, inner row. <code>grid[i][j]</code> hoặc <code>grid[row][col]</code>.', 'Print có khoảng cách + xuống dòng.'],
          solution: {
            code: `public class Transpose {
    public static void main(String[] args) {
        int[][] grid = {
            {1, 2, 3, 4},
            {5, 6, 7, 8},
            {9, 10, 11, 12}
        };
        int rows = grid.length, cols = grid[0].length;
        for (int c = 0; c < cols; c++) {
            for (int r = 0; r < rows; r++) {
                System.out.print(grid[r][c] + " ");
            }
            System.out.println();
        }
        // Output:
        // 1 5 9
        // 2 6 10
        // 3 7 11
        // 4 8 12
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(m × n) · Space O(1) (in-place không cần extra grid).',
            explanationVi: 'Transpose: <code>result[c][r] = original[r][c]</code>. Swap thứ tự loop để in theo cột thay vì hàng.'
          }
        }
      ]
    },

    {
      id: 'l-0-2-2',
      type: 'practice',
      title: 'ArrayList — Dynamic Array',
      subtitle: { vi: 'Lesson 7/15. DÙNG ArrayList, đừng implement (sẽ làm ở Phase 1).' },
      mentalModel: {
        vi: `ArrayList = mảng có thể grow/shrink. Khi cần:
<ul>
<li>Size động (add/remove runtime).</li>
<li>Lookup theo index — O(1).</li>
<li>KHÔNG cần insert giữa nhiều — O(n) cho insert/delete giữa.</li>
</ul>
Hơn 90% trường hợp <strong>thay int[]</strong> bằng ArrayList nếu size không biết trước.`
      },
      theory: {
        vi: `<h3>API cheat sheet</h3>
<pre>import java.util.ArrayList;
import java.util.List;

// Tạo
List&lt;Integer&gt; list = new ArrayList&lt;&gt;();
List&lt;String&gt; names = new ArrayList&lt;&gt;();

// Từ Java 9+ — init nhanh
List&lt;Integer&gt; xs = List.of(1, 2, 3);   // IMMUTABLE!
List&lt;Integer&gt; ys = new ArrayList&lt;&gt;(List.of(1, 2, 3));  // mutable

// CRUD
list.add(5);                  // append
list.add(0, 10);              // insert tại index 0
list.get(0)                   // get
list.set(0, 99);              // update
list.remove(0)                // remove tại index → trả phần tử
list.remove(Integer.valueOf(5));  // remove giá trị 5 (1 lần xuất hiện)

// Query
list.size()
list.isEmpty()
list.contains(5)
list.indexOf(5)
list.lastIndexOf(5)

// Iterate
for (int x : list) System.out.println(x);
list.forEach(System.out::println);  // method reference (Java 8+)

// Convert
Integer[] arr = list.toArray(new Integer[0]);
List&lt;Integer&gt; fromArr = java.util.Arrays.asList(1, 2, 3); // fixed-size!
List&lt;Integer&gt; mutable = new ArrayList&lt;&gt;(java.util.Arrays.asList(1, 2, 3));

// Sort
list.sort(null);              // natural order
list.sort((a, b) -&gt; b - a);   // descending
java.util.Collections.sort(list);</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>ArrayList chứa <code>int</code></strong>: SAI. Chứa <code>Integer</code> (wrapper). Autoboxing tự convert nhưng có overhead.</li>
  <li><strong>List.of() là immutable</strong>: <code>list.add()</code> → UnsupportedOperationException.</li>
  <li><strong>Arrays.asList() trả fixed-size list</strong>: <code>add()</code> cũng throw. Wrap <code>new ArrayList&lt;&gt;(asList(...))</code> nếu cần mutable.</li>
  <li><strong>remove(int)</strong> vs <strong>remove(Object)</strong>: <code>list.remove(5)</code> với List&lt;Integer&gt; remove INDEX 5! Để remove GIÁ TRỊ 5: <code>list.remove(Integer.valueOf(5))</code>.</li>
  <li><strong>Modify trong for-each</strong>: <code>for (int x : list) list.remove(x);</code> → ConcurrentModificationException. Dùng iterator hoặc <code>removeIf(predicate)</code>.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Build list from input',
          prompt: 'Đọc N + N int. Cho vào ArrayList. In list.',
          hints: ['<code>new ArrayList&lt;Integer&gt;()</code>.', 'Loop n lần, mỗi lần <code>add(sc.nextInt())</code>.'],
          solution: {
            code: `import java.util.*;

public class BuildList {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        System.out.println(list);  // [1, 2, 3] auto
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'ArrayList.toString() format đẹp: <code>[1, 2, 3]</code>. Khác array — phải Arrays.toString().'
          }
        },
        {
          title: 'Remove all even numbers',
          prompt: 'Cho List&lt;Integer&gt;, remove các số chẵn (in-place). KHÔNG dùng for-each (sẽ ConcurrentModification).',
          hints: ['<code>list.removeIf(x -&gt; x % 2 == 0)</code> — clean.', 'Hoặc iterator + iterator.remove().'],
          solution: {
            code: `import java.util.*;

public class RemoveEven {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        list.removeIf(x -> x % 2 == 0);
        System.out.println(list);  // [1, 3, 5]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: '<code>removeIf(predicate)</code> Java 8+ — clean nhất. Lambda <code>x -&gt; x % 2 == 0</code> return true thì remove.'
          }
        },
        {
          title: 'Find duplicates',
          prompt: 'Cho List&lt;Integer&gt;, return new list chứa các giá trị xuất hiện ≥ 2 lần. KHÔNG duplicate trong output.',
          hints: ['HashMap đếm freq.', 'Filter entries có count ≥ 2.'],
          solution: {
            code: `import java.util.*;

public class FindDup {
    public static List<Integer> findDuplicates(List<Integer> list) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : list) count.merge(x, 1, Integer::sum);

        List<Integer> result = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            if (e.getValue() >= 2) result.add(e.getKey());
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(findDuplicates(List.of(1, 2, 2, 3, 3, 3, 4)));
        // [2, 3] (thứ tự có thể khác — HashMap unordered)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: '<code>map.merge(key, 1, Integer::sum)</code> = put 1 nếu chưa có, hoặc += 1 nếu có. Concise hơn getOrDefault + put.'
          }
        },
        {
          title: 'Sort descending',
          prompt: 'Cho List&lt;Integer&gt;, sort GIẢM DẦN in-place.',
          hints: ['<code>list.sort(Comparator.reverseOrder())</code>.', 'Hoặc lambda: <code>(a, b) -&gt; b - a</code> (cẩn thận overflow).'],
          solution: {
            code: `import java.util.*;

public class SortDesc {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(List.of(3, 1, 4, 1, 5, 9, 2, 6));
        list.sort(Comparator.reverseOrder());
        System.out.println(list);  // [9, 6, 5, 4, 3, 2, 1, 1]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n log n) · Space O(n) Timsort.',
            explanationVi: 'Comparator.reverseOrder() = built-in descending. <code>(a, b) -&gt; b - a</code> work nhưng overflow nếu a, b gần Integer.MIN/MAX. Prefer <code>Integer.compare(b, a)</code>.'
          }
        },
        {
          title: 'Merge 2 sorted lists',
          prompt: 'Cho 2 List&lt;Integer&gt; đã sort. Return list mới chứa tất cả phần tử sort tăng dần.',
          hints: ['Two pointers trên 2 list.', 'Lấy phần tử nhỏ hơn add vào result. Khi 1 hết, append phần còn lại của list kia.'],
          solution: {
            code: `import java.util.*;

public class MergeSorted {
    public static List<Integer> merge(List<Integer> a, List<Integer> b) {
        List<Integer> result = new ArrayList<>();
        int i = 0, j = 0;
        while (i < a.size() && j < b.size()) {
            if (a.get(i) <= b.get(j)) result.add(a.get(i++));
            else                       result.add(b.get(j++));
        }
        while (i < a.size()) result.add(a.get(i++));
        while (j < b.size()) result.add(b.get(j++));
        return result;
    }

    public static void main(String[] args) {
        System.out.println(merge(List.of(1, 3, 5), List.of(2, 4, 6)));
        // [1, 2, 3, 4, 5, 6]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n + m) · Space O(n + m).',
            explanationVi: 'Two-pointer merge — pattern bản chất của Merge Sort. <code>i++</code> trong expression = trả i, tăng i. Concise nhưng careful.'
          }
        }
      ]
    },

    {
      id: 'l-0-2-3',
      type: 'practice',
      title: 'HashMap — Key-Value Lookup O(1)',
      subtitle: { vi: 'Lesson 8/15. HashMap là vũ khí mạnh nhất cho 50% LeetCode.' },
      mentalModel: {
        vi: `HashMap = bảng key → value, lookup O(1) trung bình. Khi bạn cần:
<ul>
<li>Đếm freq: word → count.</li>
<li>Lookup nhanh: id → object.</li>
<li>Caching: input → computed result.</li>
<li>Detect duplicate: seen set.</li>
</ul>
Quy tắc: thấy "đã từng thấy chưa", "đếm xuất hiện", "tìm pair sum target" → reach for HashMap.`
      },
      theory: {
        vi: `<h3>API cheat sheet</h3>
<pre>import java.util.HashMap;
import java.util.Map;

// Tạo
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();

// CRUD
map.put("a", 1);
map.get("a")                   // 1 hoặc null nếu missing
map.getOrDefault("z", 0)       // 0 nếu missing — TIỆN
map.containsKey("a")           // true
map.remove("a")                // trả old value
map.size()
map.isEmpty()

// Tăng count idiom
map.merge("a", 1, Integer::sum);  // a: 0 → 1; nếu có rồi: += 1
// Tương đương:
map.put("a", map.getOrDefault("a", 0) + 1);

// computeIfAbsent — lazy init giá trị
Map&lt;String, List&lt;Integer&gt;&gt; m = new HashMap&lt;&gt;();
m.computeIfAbsent("group", k -&gt; new ArrayList&lt;&gt;()).add(5);

// Iterate
for (Map.Entry&lt;String, Integer&gt; e : map.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}
map.forEach((k, v) -&gt; System.out.println(k + "=" + v));

// Java 9+ init nhanh
Map&lt;String, Integer&gt; m2 = Map.of("a", 1, "b", 2);  // IMMUTABLE</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>NullPointer khi unbox</strong>: <code>int x = map.get("missing")</code> → NPE vì map.get trả null, unbox null thành int → NPE. Dùng <code>getOrDefault</code>.</li>
  <li><strong>HashMap KHÔNG order</strong>: iterate có thể ra thứ tự khác lúc put. Cần insertion order → <code>LinkedHashMap</code>. Cần sorted → <code>TreeMap</code>.</li>
  <li><strong>Mutable key</strong>: nếu key là object mutable và bạn sửa field, key "biến mất" khỏi map (hashCode đổi).</li>
  <li><strong>Map.of() immutable</strong>: add → throw.</li>
  <li><strong>Quên Integer.equals()</strong>: <code>map.get(x) == map.get(y)</code> so reference, không value. Dùng <code>.equals()</code>.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Two Sum (warm-up)',
          prompt: 'Tìm 2 khách hàng có tổng chi tiêu bằng <code>target</code>. Cho <code>long[] customerSpendingCents</code> và <code>long targetCents</code>. Return <code>int[]{i, j}</code> sao cho <code>customerSpendingCents[i] + customerSpendingCents[j] == targetCents</code>. Giả định đúng 1 cặp. KHÔNG dùng cùng index 2 lần. (Pattern Two Sum kinh điển — Phase 2 sẽ học sâu.)',
          hints: ['HashMap: spending value → customer index.', 'Khi duyệt <code>spending[i]</code>, check map có <code>target - spending[i]</code> chưa.', 'Đây là LeetCode #1 — bài cơ bản nhất, framed cho domain backend.'],
          solution: {
            code: `import java.util.*;

public class FindCustomerPair {
    public static int[] findPair(long[] customerSpendingCents, long targetCents) {
        Map<Long, Integer> seen = new HashMap<>();
        for (int i = 0; i < customerSpendingCents.length; i++) {
            long need = targetCents - customerSpendingCents[i];
            if (seen.containsKey(need)) {
                return new int[]{seen.get(need), i};
            }
            seen.put(customerSpendingCents[i], i);
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        // 4 khách hàng VIP: 2tr, 7tr, 11tr, 15tr (đơn vị xu)
        long[] vipSpending = {2_00_000_000L, 7_00_000_000L, 11_00_000_000L, 15_00_000_000L};
        // Tìm 2 customer có tổng 9tr
        System.out.println(java.util.Arrays.toString(findPair(vipSpending, 9_00_000_000L)));
        // [0, 1]  (customer 0 spend 2tr + customer 1 spend 7tr = 9tr)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'One-pass: tại mỗi customer i, check xem <code>target - spending[i]</code> đã seen chưa. Brute force O(n²) (nested loop). HashMap reduce O(n). Real-world use: tìm pair của loyalty rewards (2 user chung tổng để combine voucher).'
          }
        },
        {
          title: 'Count word frequency',
          prompt: 'Cho String[] words. Return Map từ word → count.',
          hints: ['<code>map.merge(word, 1, Integer::sum)</code>.'],
          solution: {
            code: `import java.util.*;

public class WordCount {
    public static Map<String, Integer> count(String[] words) {
        Map<String, Integer> map = new HashMap<>();
        for (String w : words) {
            map.merge(w, 1, Integer::sum);
        }
        return map;
    }

    public static void main(String[] args) {
        String[] words = {"the", "cat", "the", "dog", "cat", "the"};
        System.out.println(count(words));
        // {the=3, cat=2, dog=1} (order có thể khác)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n × L) · Space O(unique words).',
            explanationVi: '<code>merge(key, defaultValue, BiFunction)</code>: nếu key chưa có → put defaultValue; nếu có → apply BiFunction(old, defaultValue).'
          }
        },
        {
          title: 'First non-repeating character',
          prompt: 'Cho String s. Return ký tự đầu tiên xuất hiện ĐÚNG 1 LẦN. Không có → return null char (\\u0000).',
          hints: ['Pass 1: count freq. Pass 2: tìm char đầu tiên có count = 1.', '<code>LinkedHashMap</code> giữ thứ tự để gộp 2 pass nếu cần.'],
          solution: {
            code: `import java.util.*;

public class FirstUnique {
    public static char firstUniq(String s) {
        Map<Character, Integer> count = new LinkedHashMap<>();
        for (char c : s.toCharArray()) {
            count.merge(c, 1, Integer::sum);
        }
        for (Map.Entry<Character, Integer> e : count.entrySet()) {
            if (e.getValue() == 1) return e.getKey();
        }
        return '\\u0000';   // null char
    }

    public static void main(String[] args) {
        System.out.println(firstUniq("leetcode"));   // 'l'
        System.out.println(firstUniq("aabbcc"));     // '\\u0000'
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(26) cho lowercase letters = O(1).',
            explanationVi: 'LinkedHashMap giữ thứ tự insertion → iterate ra đúng thứ tự xuất hiện. HashMap thường có thể trả char khác đúng.'
          }
        },
        {
          title: 'Group strings by length',
          prompt: 'Cho String[] words. Return Map&lt;Integer, List&lt;String&gt;&gt; group theo length.',
          hints: ['<code>computeIfAbsent</code> lazy init List.'],
          solution: {
            code: `import java.util.*;

public class GroupByLength {
    public static Map<Integer, List<String>> group(String[] words) {
        Map<Integer, List<String>> map = new HashMap<>();
        for (String w : words) {
            map.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);
        }
        return map;
    }

    public static void main(String[] args) {
        String[] words = {"ab", "abc", "xy", "abcd", "pqr"};
        System.out.println(group(words));
        // {2=[ab, xy], 3=[abc, pqr], 4=[abcd]}
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n × L) · Space O(n).',
            explanationVi: '<code>computeIfAbsent(key, k -&gt; new ArrayList&lt;&gt;())</code>: nếu key chưa có, init bằng ArrayList rỗng + put vào map + return nó. Sau đó chain <code>.add(w)</code>. Elegant.'
          }
        },
        {
          title: 'Contains duplicate within k distance',
          prompt: 'Cho int[] nums và int k. Return true nếu tồn tại i, j sao cho <code>nums[i] == nums[j]</code> và <code>|i - j| ≤ k</code>. (LeetCode 219 — Contains Duplicate II)',
          hints: ['HashMap: value → most recent index.', 'Tại mỗi i, check map có value và <code>i - oldIndex ≤ k</code>.'],
          solution: {
            code: `import java.util.*;

public class NearDup {
    public static boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> lastIdx = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (lastIdx.containsKey(nums[i]) && i - lastIdx.get(nums[i]) <= k) {
                return true;
            }
            lastIdx.put(nums[i], i);
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(containsNearbyDuplicate(new int[]{1, 2, 3, 1}, 3));  // true
        System.out.println(containsNearbyDuplicate(new int[]{1, 0, 1, 1}, 1));  // true
        System.out.println(containsNearbyDuplicate(new int[]{1, 2, 3, 1, 2, 3}, 2)); // false
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'HashMap lưu index mới nhất. Tại mỗi i, nếu seen value trong khoảng k → true. Update index (giữ recent).'
          }
        }
      ]
    },

    {
      id: 'l-0-2-4',
      type: 'practice',
      title: 'HashSet — Unique Collection',
      subtitle: { vi: 'Lesson 9/15. HashSet = HashMap chỉ có key.' },
      mentalModel: {
        vi: `HashSet = collection unique items, lookup O(1). Khi cần:
<ul>
<li>Dedup (loại trùng).</li>
<li>Check "đã thấy chưa" — pattern phổ biến cho linked list cycle, duplicate detection.</li>
<li>Intersection / union / difference 2 collection.</li>
</ul>`
      },
      theory: {
        vi: `<h3>API cheat sheet</h3>
<pre>import java.util.HashSet;
import java.util.Set;

Set&lt;Integer&gt; set = new HashSet&lt;&gt;();

set.add(5);                    // return true nếu chưa có
set.contains(5)                // O(1)
set.remove(5)                  // return true nếu có
set.size()
set.isEmpty()

// Iterate (không order)
for (int x : set) System.out.println(x);

// Init nhanh
Set&lt;Integer&gt; s = new HashSet&lt;&gt;(java.util.Arrays.asList(1, 2, 3));
Set&lt;Integer&gt; s2 = Set.of(1, 2, 3);  // immutable

// Bulk ops
set.addAll(otherSet);          // union
set.retainAll(otherSet);       // intersection (giữ lại element CŨNG trong other)
set.removeAll(otherSet);       // difference</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>add() return boolean</strong>: true nếu thêm thành công (chưa có); false nếu đã có. Tận dụng cho dedup logic.</li>
  <li><strong>Set không order</strong>: iterate thứ tự khác lúc add. Cần order → <code>LinkedHashSet</code> hoặc <code>TreeSet</code>.</li>
  <li><strong>Set.of() immutable</strong>.</li>
  <li><strong>Custom object trong Set</strong>: phải override <code>equals()</code> + <code>hashCode()</code>. Quên → 2 object "bằng nhau" vẫn được add lần 2.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Remove duplicates from array',
          prompt: 'Cho int[]. Return int[] mới chứa các giá trị unique (thứ tự không quan trọng).',
          hints: ['HashSet add tất cả. Convert back to array.', 'set.stream().mapToInt(Integer::intValue).toArray() — concise.'],
          solution: {
            code: `import java.util.*;

public class Dedup {
    public static int[] dedup(int[] arr) {
        Set<Integer> set = new HashSet<>();
        for (int x : arr) set.add(x);
        int[] result = new int[set.size()];
        int i = 0;
        for (int x : set) result[i++] = x;
        return result;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 3, 3, 3, 4};
        System.out.println(java.util.Arrays.toString(dedup(arr)));
        // [1, 2, 3, 4] (order có thể khác)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Pattern: collection → Set → collection. Mất order. Cần giữ order: dùng LinkedHashSet hoặc List + check seen.'
          }
        },
        {
          title: 'Contains duplicate',
          prompt: 'Cho int[]. Return true nếu CÓ giá trị xuất hiện ≥ 2 lần. (LeetCode 217)',
          hints: ['HashSet add từng số. Nếu add() trả false → đã có duplicate.', 'Early return — efficient.'],
          solution: {
            code: `import java.util.*;

public class HasDup {
    public static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;   // add return false = đã có
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1, 2, 3, 1}));  // true
        System.out.println(containsDuplicate(new int[]{1, 2, 3, 4}));  // false
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Tận dụng <code>add()</code> trả boolean — clean hơn check contains rồi add.'
          }
        },
        {
          title: 'Intersection of 2 arrays',
          prompt: 'Cho int[] a, int[] b. Return mảng các giá trị xuất hiện ở CẢ 2 (unique). (LeetCode 349)',
          hints: ['HashSet(a). Iterate b, nếu in set → add result.', 'Hoặc <code>retainAll</code> trên Set lớn.'],
          solution: {
            code: `import java.util.*;

public class Intersect {
    public static int[] intersection(int[] a, int[] b) {
        Set<Integer> setA = new HashSet<>();
        for (int x : a) setA.add(x);
        Set<Integer> result = new HashSet<>();
        for (int x : b) {
            if (setA.contains(x)) result.add(x);
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 2, 1}, b = {2, 2};
        System.out.println(java.util.Arrays.toString(intersection(a, b)));
        // [2]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n + m) · Space O(n + m).',
            explanationVi: 'Set tự dedup → result unique. Stream <code>mapToInt</code> convert Set&lt;Integer&gt; → int[].'
          }
        },
        {
          title: 'Happy number',
          prompt: 'Số "happy" = thay thế bằng tổng bình phương các chữ số, lặp lại. Nếu eventually = 1 → happy. (LeetCode 202)',
          hints: ['HashSet detect cycle: nếu number xuất hiện lại → not happy.', 'Loop until n == 1 or seen.contains(n).'],
          solution: {
            code: `import java.util.*;

public class Happy {
    public static boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && !seen.contains(n)) {
            seen.add(n);
            n = squareSum(n);
        }
        return n == 1;
    }

    private static int squareSum(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(isHappy(19));  // true (1² + 9² = 82 → 8² + 2² = 68 → ... → 1)
        System.out.println(isHappy(2));   // false (cycle)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(log n) per step · Space O(unique numbers in chain).',
            explanationVi: 'Set detect cycle — nếu loop quay lại số đã thấy → infinite loop → not happy. Bonus: dùng Floyd cycle detection (Phase 2 Fast/Slow) thay HashSet → O(1) space.'
          }
        },
        {
          title: 'Unique substring count',
          prompt: 'Cho String s và int k. Return số substring length k UNIQUE trong s.',
          hints: ['Sliding window length k.', 'HashSet collect substrings.', '<code>s.substring(i, i+k)</code>.'],
          solution: {
            code: `import java.util.*;

public class UniqueSubstr {
    public static int countUnique(String s, int k) {
        if (s.length() < k) return 0;
        Set<String> set = new HashSet<>();
        for (int i = 0; i + k <= s.length(); i++) {
            set.add(s.substring(i, i + k));
        }
        return set.size();
    }

    public static void main(String[] args) {
        System.out.println(countUnique("abcabc", 2));  // 3 (ab, bc, ca)
        System.out.println(countUnique("aaaaa", 2));   // 1 (aa)
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n × k) · Space O(n × k).',
            explanationVi: 'Sliding window + Set dedup. Mỗi substring k char. n - k + 1 substring tổng.'
          }
        }
      ]
    },

    {
      id: 'l-0-2-5',
      type: 'practice',
      title: 'Conversions — String ↔ char[] ↔ List',
      subtitle: { vi: 'Lesson 10/15. Cuối Module 0.2. Pattern conversion phổ biến.' },
      mentalModel: {
        vi: `Trong LeetCode bạn liên tục convert giữa các format. Master các pattern:
<ul>
<li><code>String ↔ char[]</code>: <code>s.toCharArray()</code>, <code>new String(arr)</code>.</li>
<li><code>String ↔ List&lt;Character&gt;</code>: ít gặp trực tiếp, thường qua stream.</li>
<li><code>int[] ↔ List&lt;Integer&gt;</code>: NHẠY CẢM vì primitive vs wrapper.</li>
<li><code>List ↔ array</code>: <code>list.toArray()</code>, <code>Arrays.asList()</code>.</li>
</ul>`
      },
      theory: {
        vi: `<h3>Conversion cheat sheet</h3>
<pre>// String &lt;-&gt; char[]
String s = "hello";
char[] chars = s.toCharArray();
String back = new String(chars);
String back2 = String.valueOf(chars);    // tương đương

// char[] &lt;-&gt; String slice
new String(chars, 1, 3)                   // chars[1..3], length 3 = "ell"

// String &lt;-&gt; byte[]
byte[] bytes = s.getBytes();              // default charset
byte[] utf8 = s.getBytes(StandardCharsets.UTF_8);

// String -&gt; int / int -&gt; String
int n = Integer.parseInt("42");
String str = Integer.toString(42);
String str2 = String.valueOf(42);
String str3 = "" + 42;                    // hack, KHÔNG khuyên

// int[] -&gt; List&lt;Integer&gt;
int[] arr = {1, 2, 3};
List&lt;Integer&gt; list = Arrays.stream(arr).boxed().collect(Collectors.toList());
List&lt;Integer&gt; list2 = IntStream.of(arr).boxed().toList();   // Java 16+

// List&lt;Integer&gt; -&gt; int[]
int[] arrBack = list.stream().mapToInt(Integer::intValue).toArray();

// Integer[] -&gt; List&lt;Integer&gt;
Integer[] boxed = {1, 2, 3};
List&lt;Integer&gt; list3 = Arrays.asList(boxed);   // FIXED-SIZE
List&lt;Integer&gt; list4 = new ArrayList&lt;&gt;(Arrays.asList(boxed));   // mutable

// String[] -&gt; List&lt;String&gt;
String[] names = {"Alice", "Bob"};
List&lt;String&gt; nameList = Arrays.asList(names);
List&lt;String&gt; nameList2 = new ArrayList&lt;&gt;(Arrays.asList(names));

// List&lt;String&gt; -&gt; String[]
String[] arr2 = nameList.toArray(new String[0]);</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Arrays.asList(int[]) sai</strong>: <code>Arrays.asList(new int[]{1,2,3})</code> → List&lt;int[]&gt; size 1 (chứa cả mảng!). Phải dùng Integer[] hoặc stream.</li>
  <li><strong>Arrays.asList() fixed-size</strong>: <code>list.add()</code> → UnsupportedOperationException.</li>
  <li><strong>list.toArray() trả Object[]</strong>: dùng <code>list.toArray(new String[0])</code> để có String[].</li>
  <li><strong>String + int = String</strong>: <code>"x" + 5 + 3</code> = <code>"x53"</code> KHÔNG <code>"x8"</code>. Vì left-to-right associativity.</li>
  <li><strong>Integer.parseInt() throw</strong>: input không phải số → NumberFormatException. Try-catch hoặc validate trước.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Reverse string via char[]',
          prompt: 'Reverse String dùng char[]. Loop swap như reverse array.',
          hints: ['toCharArray + two pointers swap + new String(arr).'],
          solution: {
            code: `public class ReverseStr2 {
    public static String reverse(String s) {
        char[] arr = s.toCharArray();
        int l = 0, r = arr.length - 1;
        while (l < r) {
            char tmp = arr[l]; arr[l] = arr[r]; arr[r] = tmp;
            l++; r--;
        }
        return new String(arr);
    }

    public static void main(String[] args) {
        System.out.println(reverse("hello"));  // "olleh"
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n) cho char[].',
            explanationVi: 'String immutable → phải char[]. In-place swap + tạo String mới từ kết quả.'
          }
        },
        {
          title: 'int[] → sorted List<Integer>',
          prompt: 'Cho int[]. Return List&lt;Integer&gt; sort tăng dần.',
          hints: ['Arrays.sort(arr) trước.', 'Convert int[] → List qua stream.'],
          solution: {
            code: `import java.util.*;
import java.util.stream.*;

public class IntArrToSortedList {
    public static List<Integer> convert(int[] arr) {
        Arrays.sort(arr);
        return Arrays.stream(arr).boxed().collect(Collectors.toList());
    }

    public static void main(String[] args) {
        System.out.println(convert(new int[]{3, 1, 4, 1, 5, 9, 2, 6}));
        // [1, 1, 2, 3, 4, 5, 6, 9]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n log n) · Space O(n).',
            explanationVi: '<code>Arrays.stream(int[])</code> trả IntStream (primitive). <code>.boxed()</code> convert sang Stream&lt;Integer&gt;. Collect ra List.'
          }
        },
        {
          title: 'Parse CSV',
          prompt: 'Cho String "1,2,3,4,5". Return int[] [1, 2, 3, 4, 5].',
          hints: ['split(",")', 'Stream parseInt → toArray.'],
          solution: {
            code: `import java.util.*;
import java.util.stream.*;

public class ParseCSV {
    public static int[] parse(String csv) {
        return Arrays.stream(csv.split(","))
                     .mapToInt(Integer::parseInt)
                     .toArray();
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(parse("1,2,3,4,5")));
        // [1, 2, 3, 4, 5]
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Stream pattern: split → mapToInt → toArray. <code>Integer::parseInt</code> method reference = <code>s -&gt; Integer.parseInt(s)</code>.'
          }
        },
        {
          title: 'Count character frequency',
          prompt: 'Cho String, return Map&lt;Character, Integer&gt; freq mỗi ký tự.',
          hints: ['Loop char in toCharArray + merge.'],
          solution: {
            code: `import java.util.*;

public class CharFreq {
    public static Map<Character, Integer> freq(String s) {
        Map<Character, Integer> map = new HashMap<>();
        for (char c : s.toCharArray()) {
            map.merge(c, 1, Integer::sum);
        }
        return map;
    }

    public static void main(String[] args) {
        System.out.println(freq("hello"));
        // {h=1, e=1, l=2, o=1}
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(unique chars).',
            explanationVi: 'For-each char + merge — combo phổ biến nhất cho frequency counting.'
          }
        },
        {
          title: 'Valid Anagram',
          prompt: 'Cho 2 String s, t. Return true nếu là anagram (cùng letters, khác order). (LeetCode 242)',
          hints: ['Cách 1: sort 2 string, so sánh.', 'Cách 2: int[26] count, +1 cho s và -1 cho t. Cuối check toàn 0.', 'Cách 1 đơn giản hơn, cách 2 nhanh hơn (O(n) vs O(n log n)).'],
          solution: {
            code: `public class Anagram {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram"));  // true
        System.out.println(isAnagram("rat", "car"));          // false
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(26) = O(1).',
            explanationVi: 'Trick: <code>c - \'a\'</code> map a..z → 0..25. Increment cho s, decrement cho t. Anagram ⇔ count toàn 0 cuối.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          'String ↔ char[]: <code>toCharArray()</code> ↔ <code>new String(arr)</code>.',
          'int[] ↔ List&lt;Integer&gt;: phải qua stream + boxed/mapToInt.',
          'Arrays.asList() FIXED-SIZE — wrap <code>new ArrayList&lt;&gt;()</code> để mutable.',
          'Hết Module 0.2 — đã DÙNG được Array, ArrayList, HashMap, HashSet. Phase 1 sẽ IMPLEMENT lại.'
        ]
      }
    }
  ],
  references: [
    { title: 'Java Collections Framework Tutorial', url: 'https://docs.oracle.com/javase/tutorial/collections/index.html' },
    { title: 'ArrayList JavaDoc (Java 21)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html' },
    { title: 'HashMap JavaDoc (Java 21)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html' }
  ]

}
