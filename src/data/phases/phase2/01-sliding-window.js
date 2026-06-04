// Pattern 1 — Sliding Window
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'sw',
  title: 'Pattern 1 — Sliding Window',
  mental: `Bài hỏi về <strong>subarray/substring LIÊN TỤC</strong> với tính chất nào đó (max sum, longest valid, shortest with X)? → Sliding window.
<br/><br/>
Hai con trỏ <code>left</code> và <code>right</code> bao quanh "cửa sổ". EXPAND bằng cách tăng <code>right</code>, SHRINK bằng cách tăng <code>left</code>. Mỗi index thăm tối đa 2 lần → O(n).
<br/><br/>
<strong>Dấu hiệu nhận biết</strong>: input là chuỗi/mảng, hỏi "subarray contiguous", có ràng buộc về sum/length/số distinct char/repeat.`,

  under: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Tại sao O(n) chứ không phải O(n²)?</strong>
Vì <strong>left không bao giờ lùi</strong>. Nó chỉ tiến hoặc đứng yên. Tổng số bước của left ≤ n, tổng số bước của right ≤ n → tổng ≤ 2n operation. Đây là "amortized two pointers" — chứng minh chặt chẽ qua "potential function" trong textbook.
<br/><br/>
<strong>2) Vì sao window không lùi?</strong>
Vì khi <code>[l..r]</code> KHÔNG hợp lệ, mở rộng r thêm cũng KHÔNG làm nó hợp lệ (với điều kiện monotonic — đa số bài SW đều thế). → l buộc phải tiến.
<br/><br/>
<strong>3) State của cửa sổ — phải maintain incremental</strong>
Khi r tiến 1: update state bằng <code>O(1)</code> (add char mới vào HashMap, hoặc cộng vào sum). Khi l tiến 1: update tương tự (remove char). Nếu update tốn O(window length) thì pattern thoái hóa thành O(n²). CRITICAL.
<br/><br/>
<strong>4) Fixed-size vs Variable-size</strong>
<ul>
<li><strong>Fixed</strong>: cửa sổ độ dài k cố định, slide qua mảng. State = sum/count trong k phần tử gần nhất.</li>
<li><strong>Variable</strong>: shrink/expand theo điều kiện. State = HashMap/Set tracking chính xác cái gì có trong window.</li>
</ul>`,

  theory: `<h3>The "Why" — Khi nào dùng Sliding Window?</h3>
<ul>
  <li>Bài CÓ contiguity → SW áp dụng. <em>"Tìm subsequence ..."</em> KHÔNG phải SW (subsequence ≠ subarray).</li>
  <li>Ràng buộc có thể check incrementally → SW work. Nếu check tốn O(n) thì brute force.</li>
  <li>Best/longest/shortest/count với điều kiện monotonic về size.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Quên xóa key khỏi HashMap khi count về 0</strong> → <code>map.size()</code> sai → invariant break trong bài "k distinct chars".</li>
  <li><strong>Update <code>best</code> ngoài while</strong> cho bài "longest valid" — phải update SAU khi while xong (window đã hợp lệ).</li>
  <li><strong>Update <code>best</code> trong while</strong> cho bài "shortest valid" — phải update TRONG while (mỗi lần window còn hợp lệ trước khi shrink).</li>
  <li><strong>Bỏ qua case empty input</strong> — return 0 hoặc giá trị sentinel.</li>
  <li><strong>Confuse window length</strong>: <code>r - l + 1</code> (CẢ HAI inclusive), NHỚ +1.</li>
</ul>`,

  code: `// Variable-size template
int left = 0, best = 0;
Map<Character, Integer> count = new HashMap<>();
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count.merge(c, 1, Integer::sum);

    while (windowInvalid(count)) {              // điều kiện bài
        char l = s.charAt(left++);
        count.merge(l, -1, Integer::sum);
        if (count.get(l) == 0) count.remove(l);  // QUAN TRỌNG: xóa khi 0
    }

    best = Math.max(best, right - left + 1);    // update SAU while cho "longest"
}
return best;`,

  prompts: [
    {
      title: 'Tự suy luận template Sliding Window',
      prompt: `Tôi muốn tự nghĩ ra Sliding Window mà không học vẹt. KHÔNG cho code. Hỏi tôi:
1. Brute force O(n²) — vì sao chậm? Có bước nào lặp lại không cần thiết?
2. Khi cửa sổ [l..r] hợp lệ, mở rộng r — tôi có cần tính lại từ đầu không?
3. Khi cửa sổ KHÔNG hợp lệ, di chuyển l hay r? Tại sao l không lùi?
4. Track state gì của cửa sổ (count, sum, set)?
5. Update kết quả lúc nào — trong while, sau while, hay cả hai?
Dẫn tôi đến template.`
    },
    {
      title: 'Longest vs Shortest pattern',
      prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Bài "longest valid" — update best Ở ĐÂU? Trước hay sau while shrink?
2. Bài "shortest valid" — update best Ở ĐÂU? Cùng chỗ với longest?
3. Cho 1 case cụ thể (vd: "longest substring without repeating") — trace với input "abcabc".
4. Cho 1 case "shortest" (vd: "min subarray sum ≥ target") — trace với [2,3,1,2,4,3], target=7.`
    }
  ],

  takeaways: [
    'Áp dụng khi: subarray/substring LIÊN TỤC + ràng buộc monotonic về size/sum/count.',
    '2 variant: <strong>fixed-size</strong> (slide đều, state delta) và <strong>variable-size</strong> (expand right, shrink left khi vi phạm).',
    'Invariant cốt lõi: <strong>left không bao giờ lùi</strong> → O(n) thay vì O(n²).',
    '<strong>Longest valid</strong>: update best NGOÀI while shrink. <strong>Shortest valid</strong>: update best TRONG while.',
    'KHÔNG dùng cho subsequence (không liên tục) — switch sang DP/backtracking.'
  ],

  problems: [
    {
      id: 'p1', title: 'Maximum Subarray', difficulty: 'Easy', url: LC('maximum-subarray'),
      hint: 'Kadane variant.',
      hints: [
        'Câu hỏi 1: Tại mỗi index i, có 2 lựa chọn — TIẾP TỤC subarray cũ hay BẮT ĐẦU mới tại i. Quyết định dựa vào gì?',
        'Câu hỏi 2: Cần lưu bao nhiêu state? Chỉ cần "sum kết thúc tại i" hay nhiều hơn?'
      ],
      solution: {
        code: `public int maxSubArray(int[] nums) {
    int curr = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curr = Math.max(nums[i], curr + nums[i]);  // tiếp tục hay bắt đầu mới
        best = Math.max(best, curr);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Kadane: <code>curr</code> = max sum kết thúc tại i. Nếu <code>curr + nums[i] &lt; nums[i]</code> (curr âm), bắt đầu mới tại i. Cập nhật best.'
      }
    },
    {
      id: 'p2', title: 'Maximum Average Subarray I', difficulty: 'Easy', url: LC('maximum-average-subarray-i'),
      hint: 'Fixed-size k.',
      hints: [
        'Câu hỏi 1: Window size cố định = k. Khi slide, cần tính lại sum từ đầu không?',
        'Câu hỏi 2: Sum mới = sum cũ + (nums[r] - nums[l-k])?'
      ],
      solution: {
        code: `public double findMaxAverage(int[] nums, int k) {
    double sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    double best = sum;
    for (int i = k; i < nums.length; i++) {
        sum += nums[i] - nums[i - k];   // slide: thêm phải, bớt trái
        best = Math.max(best, sum);
    }
    return best / k;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Fixed-size SW kinh điển. Cộng phần tử mới, trừ phần tử rời khỏi window. Tránh tính lại O(k) mỗi step.'
      }
    },
    {
      id: 'p3', title: 'Contains Duplicate II', difficulty: 'Easy', url: LC('contains-duplicate-ii'),
      hint: 'HashSet size k, drop left khi slide.',
      hints: [
        'Câu hỏi 1: Window kích thước ≤ k. Tại mỗi index r, tôi check gì?',
        'Câu hỏi 2: Khi window vượt size k, xóa element nào khỏi Set?'
      ],
      solution: {
        code: `public boolean containsNearbyDuplicate(int[] nums, int k) {
    Set<Integer> window = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        if (window.contains(nums[i])) return true;
        window.add(nums[i]);
        if (window.size() > k) window.remove(nums[i - k]);
    }
    return false;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(min(n,k)).',
        explanationVi: 'Window là Set chứa k phần tử gần nhất. Check trước khi add. Khi vượt k, drop element rời khỏi window (nums[i-k]).'
      }
    },
    {
      id: 'p4', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: LC('longest-substring-without-repeating-characters'),
      hint: 'Shrink khi count[c] >= 2.',
      hints: [
        'Câu hỏi 1: Window invariant: không có ký tự lặp. Khi thêm char vi phạm, làm gì?',
        'Câu hỏi 2: Update best TRƯỚC hay SAU shrink? (Longest pattern!)'
      ],
      solution: {
        code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> count = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        count.merge(c, 1, Integer::sum);
        while (count.get(c) > 1) {              // vi phạm: c đã có
            char l = s.charAt(left++);
            count.merge(l, -1, Integer::sum);
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(min(n, alphabet)).',
        explanationVi: 'Variable-size SW. Shrink cho đến khi <code>c</code> chỉ còn 1 trong window. Update best SAU shrink (longest pattern). Có thể optimize bằng "jump left" với HashMap&lt;char, lastIndex&gt; thay vì incrementing.'
      }
    },
    {
      id: 'p5', title: 'Minimum Size Subarray Sum', difficulty: 'Medium', url: LC('minimum-size-subarray-sum'),
      hint: 'Shrink trong khi sum >= target.',
      hints: [
        'Câu hỏi 1: Window invariant: sum &lt; target. Khi sum đủ, làm gì?',
        'Câu hỏi 2: Update best Ở ĐÂU? Shortest pattern → khác longest pattern.'
      ],
      solution: {
        code: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {                  // window VALID — track + shrink
            best = Math.min(best, right - left + 1);
            sum -= nums[left++];
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Shortest pattern: update best TRONG while (mỗi window valid). Shrink để tìm window NGẮN nhất vẫn valid. Return 0 nếu không tồn tại.'
      }
    },
    {
      id: 'p6', title: 'Permutation in String', difficulty: 'Medium', url: LC('permutation-in-string'),
      hint: 'Fixed window |s1|, compare freq array.',
      hints: [
        'Câu hỏi 1: Permutation = same character frequency. Window cố định size = s1.length(). Compare bằng cách nào nhanh?',
        'Câu hỏi 2: Compare 2 int[26] mỗi step = O(26). Có optimize được không? (Hint: track "match count")'
      ],
      solution: {
        code: `public boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    int[] need = new int[26], have = new int[26];
    for (char c : s1.toCharArray()) need[c - 'a']++;

    int k = s1.length();
    for (int i = 0; i < s2.length(); i++) {
        have[s2.charAt(i) - 'a']++;
        if (i >= k) have[s2.charAt(i - k) - 'a']--;
        if (i >= k - 1 && Arrays.equals(need, have)) return true;
    }
    return false;
}`,
        lang: 'java',
        complexityVi: 'Time O(n × 26) = O(n) · Space O(1).',
        explanationVi: 'Fixed window size = s1.length(). Maintain freq array. Slide window: add char mới, drop char rời. Compare freq arrays khi window đủ size.'
      }
    },
    {
      id: 'p7', title: 'Find All Anagrams in a String', difficulty: 'Medium', url: LC('find-all-anagrams-in-a-string'),
      hint: 'Như permutation, ghi nhận mọi left.',
      hints: [
        'Câu hỏi 1: Khác Permutation In String chỗ nào? Output là gì?',
        'Câu hỏi 2: Khi window match, lưu index nào — left của window?'
      ],
      solution: {
        code: `public List<Integer> findAnagrams(String s, String p) {
    List<Integer> res = new ArrayList<>();
    if (p.length() > s.length()) return res;
    int[] need = new int[26], have = new int[26];
    for (char c : p.toCharArray()) need[c - 'a']++;

    int k = p.length();
    for (int i = 0; i < s.length(); i++) {
        have[s.charAt(i) - 'a']++;
        if (i >= k) have[s.charAt(i - k) - 'a']--;
        if (i >= k - 1 && Arrays.equals(need, have)) res.add(i - k + 1);
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n × 26) = O(n) · Space O(1) cho counters, O(answer) cho output.',
        explanationVi: 'Cùng template với Permutation In String, nhưng add <code>i - k + 1</code> (left index của window) vào kết quả mỗi lần match.'
      }
    },
    {
      id: 'p8', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: LC('longest-repeating-character-replacement'),
      hint: 'windowLen - maxFreq ≤ k.',
      hints: [
        'Câu hỏi 1: Window valid khi: số ký tự CẦN replace ≤ k. Số cần replace = windowLen - maxFreq. Vì sao?',
        'Câu hỏi 2: maxFreq có cần decrement chính xác khi shrink không, hay có thể "lazy"?'
      ],
      solution: {
        code: `public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0, maxFreq = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        count[s.charAt(right) - 'A']++;
        maxFreq = Math.max(maxFreq, count[s.charAt(right) - 'A']);

        while (right - left + 1 - maxFreq > k) {  // số cần replace > k
            count[s.charAt(left) - 'A']--;
            left++;
            // KHÔNG cần update maxFreq xuống — best vẫn đúng vì best chỉ tăng
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(26) = O(1).',
        explanationVi: 'Trick: <code>maxFreq</code> không cần "đúng" sau khi shrink. Vì best chỉ tăng khi maxFreq tăng. Giữ maxFreq cũ — best result vẫn đúng. Tinh tế.'
      }
    },
    {
      id: 'p9', title: 'Fruit Into Baskets', difficulty: 'Medium', url: LC('fruit-into-baskets'),
      hint: 'Longest substr với ≤2 distinct.',
      hints: [
        'Câu hỏi 1: 2 basket → ≤ 2 loại fruit. Rephrase: longest window với ≤ 2 distinct elements?',
        'Câu hỏi 2: Generalize sang K distinct — template thay đổi gì?'
      ],
      solution: {
        code: `public int totalFruit(int[] fruits) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < fruits.length; right++) {
        count.merge(fruits[right], 1, Integer::sum);
        while (count.size() > 2) {
            count.merge(fruits[left], -1, Integer::sum);
            if (count.get(fruits[left]) == 0) count.remove(fruits[left]);
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1) (max 3 keys).',
        explanationVi: '"At most K distinct" template. Quan trọng: <code>remove(key)</code> khi count về 0 — nếu không, <code>map.size()</code> sai. Generalize sang K bằng cách đổi <code>2</code> thành <code>k</code>.'
      }
    },
    {
      id: 'p10', title: 'Max Consecutive Ones III', difficulty: 'Medium', url: LC('max-consecutive-ones-iii'),
      hint: 'Longest window với ≤k số 0.',
      hints: [
        'Câu hỏi 1: Rephrase: tìm longest subarray với ≤ k zeros. Window valid khi zeroCount ≤ k.',
        'Câu hỏi 2: Cần đếm số 0 trong window — track bằng gì?'
      ],
      solution: {
        code: `public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left++] == 0) zeros--;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) · Space O(1).',
        explanationVi: 'Track <code>zeros</code> trong window. Window invariant: zeros ≤ k. Shrink khi vi phạm. Cập nhật best sau shrink (longest pattern).'
      }
    },
    {
      id: 'p11', title: 'Minimum Window Substring', difficulty: 'Hard', url: LC('minimum-window-substring'),
      hint: 'Track số char đã satisfy; shrink khi đủ.',
      hints: [
        'Câu hỏi 1: Có quá nhiều biến cần track. Trick: maintain <code>matched</code> = số DISTINCT char đã đủ count. Khi nào tăng/giảm <code>matched</code>?',
        'Câu hỏi 2: Window valid khi <code>matched == need.size()</code>. Shortest pattern — update Ở ĐÂU?'
      ],
      solution: {
        code: `public String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

    Map<Character, Integer> have = new HashMap<>();
    int matched = 0, required = need.size();
    int left = 0, bestL = 0, bestLen = Integer.MAX_VALUE;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        have.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && have.get(c).intValue() == need.get(c).intValue()) matched++;

        while (matched == required) {                    // window VALID
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestL = left;
            }
            char lc = s.charAt(left++);
            have.merge(lc, -1, Integer::sum);
            if (need.containsKey(lc) && have.get(lc) < need.get(lc)) matched--;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
}`,
        lang: 'java',
        complexityVi: 'Time O(n + m) · Space O(alphabet).',
        explanationVi: 'Trick lớn: <code>matched</code> đếm DISTINCT char đã satisfy (have ≥ need). Tăng khi <code>have == need</code> chính xác (không phải mỗi lần ≥). Giảm khi <code>have &lt; need</code>. So sánh <code>matched == required</code> O(1) thay vì duyệt map.'
      }
    },
    {
      id: 'p12', title: 'Sliding Window Maximum', difficulty: 'Hard', url: LC('sliding-window-maximum'),
      hint: 'Monotonic decreasing deque.',
      hints: [
        'Câu hỏi 1: Brute O(nk). Cần O(n). Vì sao heap O(n log k) còn chưa tối ưu? (Lazy deletion phức tạp)',
        'Câu hỏi 2: Deque chứa gì — value hay INDEX? Giữ tính chất monotonic gì? Khi nào pop từ front, khi nào pop từ back?'
      ],
      solution: {
        code: `public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();   // chứa INDEX, monotonic decreasing
    for (int i = 0; i < n; i++) {
        // Pop từ back những index có value < nums[i] (chúng không bao giờ là max nữa)
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
        dq.offerLast(i);
        // Pop từ front nếu index đã rời window
        if (dq.peekFirst() <= i - k) dq.pollFirst();
        // Khi window đủ size, ghi max = nums[dq.peekFirst()]
        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
    }
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(n) amortized — mỗi index push/pop ≤ 1 lần. Space O(k).',
        explanationVi: 'Monotonic decreasing deque INDEX. <code>peekFirst()</code> = max trong window. Khi value mới &gt; back, pop back (chúng bị che). Khi front index quá cũ, pop front. Đây là pattern monotonic deque kinh điển.'
      }
    }
  ],
  references: [
    { title: 'LeetCode Sliding Window tag', url: 'https://leetcode.com/tag/sliding-window/' },
    { title: 'NeetCode Sliding Window playlist', url: 'https://neetcode.io/courses/lessons/dsa-for-beginners' }
  ]

}
