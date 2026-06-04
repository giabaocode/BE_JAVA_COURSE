// Pattern 5 — Cyclic Sort
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'cs',
  title: 'Pattern 5 — Cyclic Sort',
  prerequisites: { vi: 'Hoàn thành <code>Phase 1 Module 1.2</code>. Hiểu swap in-place.' },
  mental: `Mảng chứa số trong dải BIẾT TRƯỚC (vd: 1..n hoặc 0..n)? <strong>Đặt mỗi giá trị vào đúng INDEX</strong> qua swap liên tục. Sau xong, index nào sai = số bị thiếu/lặp.
<br/><br/>
O(n) time, O(1) space — vượt trội so với sort thường.`,

  under: `<h3>First Principles</h3>
<strong>1) Vì sao O(n) chứ không O(n²)?</strong>
Mỗi swap đặt ÍT NHẤT 1 số vào đúng chỗ → tổng swap ≤ n. Vòng for chạy n bước, mỗi bước hoặc swap hoặc tiến i. Tổng operation ≤ 2n. Amortized analysis chặt chẽ.
<br/><br/>
<strong>2) Vì sao swap, không gán?</strong>
Cần BẢO TOÀN giá trị đang ở vị trí đích. Nếu gán, mất giá trị đó vĩnh viễn → invariant phá vỡ. Swap "đưa giá trị đích về vị trí cần xét" → có thể tiếp tục.
<br/><br/>
<strong>3) Index mapping</strong>
<ul>
<li>1..n trên size n: <code>correct = nums[i] - 1</code>.</li>
<li>0..n trên size n+1: <code>correct = nums[i]</code> (bỏ qua n vì không có index n).</li>
</ul>
<br/><br/>
<strong>4) Stopping condition</strong>
Khi nào tiến i? Khi <code>nums[i] == nums[correct]</code> (đã đúng chỗ HOẶC duplicate đang ở chỗ đúng). KHÔNG check <code>nums[i] == i+1</code> trực tiếp — handle duplicate sai.
<br/><br/>
<strong>5) Generalization</strong>
Pattern này extend cho mọi bài "n numbers trong known range". Bản chất: dùng index như HashMap implicit với O(1) extra space.`,

  theory: `<h3>The "Why" — Khi nào Cyclic Sort?</h3>
<ul>
  <li>Mảng chứa số trong dải nhỏ biết trước.</li>
  <li>Yêu cầu O(1) space (constraint).</li>
  <li>Tìm missing / duplicate / mismatch.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Off-by-one</strong>: 1..n hay 0..n? Mapping <code>correct</code> khác nhau. Cẩn thận.</li>
  <li><strong>Vòng <code>while (i &lt; n)</code> với tăng i conditional</strong>: nếu tăng i mỗi iteration, infinite loop khi swap (i không tăng đúng).</li>
  <li><strong>Stopping check sai</strong>: <code>nums[i] != i+1</code> thay vì <code>nums[i] != nums[correct]</code> → duplicate gây infinite swap.</li>
  <li><strong>Bỏ qua case out-of-range</strong>: bài "First Missing Positive" có thể có số 0 hoặc &gt; n — phải skip.</li>
  <li><strong>Sửa mảng input</strong> mà đề bài cấm. Đọc constraint kỹ.</li>
</ul>`,

  code: `int i = 0;
while (i < nums.length) {
    int correct = nums[i] - 1;    // 1..n
    if (nums[i] != nums[correct]) {
        int t = nums[i]; nums[i] = nums[correct]; nums[correct] = t;
    } else {
        i++;
    }
}`,

  prompts: [
    {
      title: 'Suy luận cyclic sort',
      prompt: `Cho mảng 1..n, tìm số thiếu. O(1) space. KHÔNG cho code. Hỏi tôi:
1. HashSet O(n) space — vì sao tệ?
2. XOR trick — XOR mọi index + mọi value. Vì sao đúng?
3. Cyclic sort: đặt giá trị tại "đúng index". Đúng nghĩa là gì?
4. Khi nào swap, khi nào tiến i?
5. Sau khi xong, tìm số thiếu ra sao?`
    }
  ],

  takeaways: [
    'Điều kiện áp dụng: array chứa số trong range <code>[0..n-1]</code> hoặc <code>[1..n]</code>.',
    'Algorithm: place each <code>nums[i]</code> ở index đúng = <code>nums[i]</code> (hoặc <code>nums[i]-1</code>). Swap khi sai.',
    'Time O(n), Space O(1) — tốt hơn HashSet O(n) space.',
    'Use cases: find missing number, find duplicate, first missing positive, all missing/duplicate.',
    'Pitfall: nhầm với sort thường (cyclic CHỈ work khi range bound bởi n); infinite loop nếu swap condition sai.'
  ],

  problems: [
    {
      id: 'p1', title: 'Missing Number', difficulty: 'Easy', url: LC('missing-number'),
      hint: 'Cyclic sort rồi tìm index sai.',
      hints: [
        'Câu hỏi 1: Mảng 0..n trên size n+1. Map: <code>correct = nums[i]</code>. Khi nào skip swap?',
        'Câu hỏi 2: Bonus: XOR trick → O(n) time, O(1) space, không sửa mảng.'
      ],
      solution: {
        code: `public int missingNumber(int[] nums) {
    int n = nums.length, res = n;
    for (int i = 0; i < n; i++) {
        res ^= i ^ nums[i];   // XOR mọi index 0..n-1 và mọi value
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'XOR trick: XOR mọi index 0..n và mọi value. Các số xuất hiện 2 lần triệt tiêu, còn lại = số thiếu. Đơn giản hơn cyclic sort cho bài này, cùng complexity.'
      }
    },
    {
      id: 'p2', title: 'Find All Numbers Disappeared in an Array', difficulty: 'Easy', url: LC('find-all-numbers-disappeared-in-an-array'),
      hint: 'Sau sort, index sai = số thiếu.',
      hints: [
        'Câu hỏi 1: Mảng 1..n trên size n. Cyclic sort. Sau khi sort, index <code>i</code> nào có <code>nums[i] != i+1</code>?',
        'Câu hỏi 2: Alternative: dùng SIGN của <code>nums[abs(nums[i])-1]</code> làm "đã thấy" marker. O(n) time, O(1) extra space.'
      ],
      solution: {
        code: `public List<Integer> findDisappearedNumbers(int[] nums) {
    int n = nums.length;
    int i = 0;
    while (i < n) {
        int c = nums[i] - 1;
        if (nums[i] != nums[c]) {
            int t = nums[i]; nums[i] = nums[c]; nums[c] = t;
        } else i++;
    }
    List<Integer> res = new ArrayList<>();
    for (int j = 0; j < n; j++) if (nums[j] != j + 1) res.add(j + 1);
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1) extra (output không tính).',
        explanationVi: 'Cyclic sort kinh điển. Sau loop, mỗi i: nếu <code>nums[i] == i+1</code> → đúng; ngược lại <code>i+1</code> là số thiếu.'
      }
    },
    {
      id: 'p3', title: 'Find the Duplicate Number', difficulty: 'Medium', url: LC('find-the-duplicate-number'),
      hint: 'Cyclic sort variant.',
      hints: [
        'Câu hỏi 1: Mảng 1..n trên size n+1, ÍT NHẤT 1 duplicate. Nếu KHÔNG sửa mảng, dùng Floyd (Pattern 3).',
        'Câu hỏi 2: Nếu cho phép sửa, cyclic sort: khi <code>nums[i] == nums[correct]</code> và <code>i != correct</code> → đó là duplicate.'
      ],
      solution: {
        code: `public int findDuplicate(int[] nums) {
    // Floyd's cycle finding — không sửa mảng
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    int p = nums[0];
    while (p != slow) { p = nums[p]; slow = nums[slow]; }
    return p;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1). KHÔNG sửa mảng.',
        explanationVi: 'Floyd algorithm — coi mảng như implicit LL. Cycle vì 2 index trỏ cùng value (duplicate). Entry cycle = duplicate. (Cyclic sort variant cũng work nhưng sửa mảng.)'
      }
    },
    {
      id: 'p4', title: 'Find All Duplicates in an Array', difficulty: 'Medium', url: LC('find-all-duplicates-in-an-array'),
      hint: 'Như Missing, gom tất cả.',
      hints: [
        'Câu hỏi 1: 1..n trên size n, mỗi số xuất hiện 1 hoặc 2 lần. Cyclic sort, sau đó <code>i</code> nào có <code>nums[i] != i+1</code>?',
        'Câu hỏi 2: Alternative: sign-flip — <code>nums[abs(nums[i])-1] *= -1</code>; nếu gặp đã âm → duplicate.'
      ],
      solution: {
        code: `public List<Integer> findDuplicates(int[] nums) {
    List<Integer> res = new ArrayList<>();
    for (int x : nums) {
        int idx = Math.abs(x) - 1;
        if (nums[idx] < 0) res.add(idx + 1);   // đã thấy
        else nums[idx] = -nums[idx];
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1) extra.',
        explanationVi: 'Sign-flip trick. Lần đầu thấy giá trị <code>v</code>, flip <code>nums[v-1]</code> âm. Lần thứ 2 thấy, <code>nums[v-1]</code> đã âm → duplicate. Không sửa giá trị (chỉ sign), khôi phục được nếu cần.'
      }
    },
    {
      id: 'p5', title: 'Set Mismatch', difficulty: 'Easy', url: LC('set-mismatch'),
      hint: 'Cyclic sort + sweep.',
      hints: [
        'Câu hỏi 1: Mảng 1..n size n. 1 số bị duplicate, 1 số bị missing. Cyclic sort, sweep tìm cả hai.',
        'Câu hỏi 2: Tại index sai sau sort: <code>nums[i]</code> = duplicate (giá trị này xuất hiện 2 lần), <code>i+1</code> = missing.'
      ],
      solution: {
        code: `public int[] findErrorNums(int[] nums) {
    int n = nums.length, i = 0;
    while (i < n) {
        int c = nums[i] - 1;
        if (nums[i] != nums[c]) {
            int t = nums[i]; nums[i] = nums[c]; nums[c] = t;
        } else i++;
    }
    for (int j = 0; j < n; j++) if (nums[j] != j + 1) return new int[]{nums[j], j + 1};
    return new int[]{-1, -1};
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Cyclic sort + sweep. Tại i sai: nums[i] là duplicate (đang chiếm chỗ của i+1), i+1 là missing.'
      }
    },
    {
      id: 'p6', title: 'First Missing Positive', difficulty: 'Hard', url: LC('first-missing-positive'),
      hint: 'Cyclic sort, bỏ qua số ngoài 1..n.',
      hints: [
        'Câu hỏi 1: Answer ∈ [1, n+1]. Vì sao? (n phần tử, nếu chứa đủ 1..n thì answer = n+1; ngược lại số thiếu ∈ 1..n.)',
        'Câu hỏi 2: Skip nums[i] ≤ 0 hoặc &gt; n. Sau cyclic sort, tìm i đầu tiên có nums[i] != i+1.'
      ],
      solution: {
        code: `public int firstMissingPositive(int[] nums) {
    int n = nums.length, i = 0;
    while (i < n) {
        int v = nums[i];
        if (v > 0 && v <= n && nums[v - 1] != v) {
            int t = nums[i]; nums[i] = nums[v - 1]; nums[v - 1] = t;
        } else i++;
    }
    for (int j = 0; j < n; j++) if (nums[j] != j + 1) return j + 1;
    return n + 1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Cyclic sort skip values ngoài 1..n. Answer guarantees ∈ [1, n+1]. Sau sort, scan tìm vị trí đầu sai. Nếu mọi vị trí đúng → n+1.'
      }
    },
    {
      id: 'p7', title: 'Kth Missing Positive Number', difficulty: 'Easy', url: LC('kth-missing-positive-number'),
      hint: 'Binary search cũng được.',
      hints: [
        'Câu hỏi 1: Tại index i, số missing trước đó = <code>arr[i] - (i + 1)</code>. Vì sao? (arr[i] tự nó là số thứ ?)',
        'Câu hỏi 2: Binary search tìm i nhỏ nhất sao cho missing_count(i) ≥ k.'
      ],
      solution: {
        code: `public int findKthPositive(int[] arr, int k) {
    int lo = 0, hi = arr.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int missing = arr[mid] - (mid + 1);
        if (missing < k) lo = mid + 1;
        else             hi = mid;
    }
    return lo + k;
}`,
        lang: 'java',
        complexityVi: 'Time O(log n) · Space O(1).',
        explanationVi: 'Binary search trên missing-count. Sau loop, <code>lo</code> = số phần tử PRESENT trước answer → answer = lo + k. Elegant.'
      }
    },
    {
      id: 'p8', title: 'Couples Holding Hands', difficulty: 'Hard', url: LC('couples-holding-hands'),
      hint: 'Swap couple vào đúng cặp ghế.',
      hints: [
        'Câu hỏi 1: Couple <code>(2k, 2k+1)</code>. Tại mỗi cặp ghế (2i, 2i+1), nếu không phải couple, swap để nó là couple.',
        'Câu hỏi 2: Đếm số swap = lời giải.'
      ],
      solution: {
        code: `public int minSwapsCouples(int[] row) {
    int swaps = 0, n = row.length;
    int[] pos = new int[n];
    for (int i = 0; i < n; i++) pos[row[i]] = i;
    for (int i = 0; i < n; i += 2) {
        int partner = row[i] ^ 1;   // couple của row[i] (XOR 1: 0↔1, 2↔3, ...)
        if (row[i + 1] != partner) {
            int j = pos[partner];
            // swap row[i+1] và row[j]
            pos[row[i + 1]] = j;
            pos[partner] = i + 1;
            int t = row[i + 1]; row[i + 1] = row[j]; row[j] = t;
            swaps++;
        }
    }
    return swaps;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(n).',
        explanationVi: 'Greedy: tại mỗi cặp ghế, nếu không phải couple, swap partner vào. <code>row[i] XOR 1</code> = partner của row[i] (vì 2k và 2k+1 chỉ khác bit cuối). Track <code>pos</code> để swap O(1).'
      }
    },
    {
      id: 'p9', title: 'Find the Difference', difficulty: 'Easy', url: LC('find-the-difference'),
      hint: 'XOR trick warm-up.',
      hints: [
        'Câu hỏi 1: t = s + thêm 1 ký tự. XOR mọi ký tự của s và t → các cặp triệt tiêu, còn lại = ký tự thêm.',
        'Câu hỏi 2: Cũng có thể count freq nhưng XOR O(1) space.'
      ],
      solution: {
        code: `public char findTheDifference(String s, String t) {
    char res = 0;
    for (char c : s.toCharArray()) res ^= c;
    for (char c : t.toCharArray()) res ^= c;
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'XOR pair-cancellation. Mỗi ký tự trong s xuất hiện trong t cũng → triệt tiêu. Còn lại = ký tự thêm.'
      }
    },
    {
      id: 'p10', title: 'Single Number', difficulty: 'Easy', url: LC('single-number'),
      hint: 'XOR mọi số.',
      hints: [
        'Câu hỏi 1: Mọi số xuất hiện 2 lần trừ 1 số. XOR mọi số → các cặp triệt tiêu (a XOR a = 0), còn lại = số duy nhất.',
        'Câu hỏi 2: Tại sao XOR commutative + associative → thứ tự không quan trọng.'
      ],
      solution: {
        code: `public int singleNumber(int[] nums) {
    int res = 0;
    for (int n : nums) res ^= n;
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'XOR all. <code>a ^ a = 0</code>, <code>a ^ 0 = a</code>. Mọi pair triệt tiêu, single number còn lại. Elegant nhất trong CS classic.'
      }
    }
  ],
  references: [
    { title: 'LeetCode Cyclic Sort discuss', url: 'https://leetcode.com/discuss/study-guide/2188531/Cyclic-sort-pattern' },
    { title: 'Find Missing Number (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Find_first_set' }
  ]

}
