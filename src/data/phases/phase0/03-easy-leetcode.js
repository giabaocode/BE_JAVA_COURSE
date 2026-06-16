// Module 0.3 — 25 LeetCode Warm-up (24 Easy + 1 Medium intro)
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'mod-0-3',
  title: '25 LeetCode Warm-up — 24 Easy + 1 Medium intro (KHÔNG paste AI, 20p tự thử trước)',
  prerequisites: { vi: 'Hoàn thành <code>Module 0.1, 0.2</code>. Đã quen <code>int[]</code>, <code>HashMap</code>, <code>for</code>, <code>while</code>.' },
  lessons: [
    {
      id: 'l-0-3-1',
      type: 'theory',
      title: 'Workflow giải LeetCode (đọc trước khi bắt đầu)',
      mentalModel: {
        vi: `<strong>Quy trình KHÔNG paste AI</strong> cho mỗi bài:
<ol>
<li>📖 Đọc đề 2 lần. Hiểu input/output rõ ràng.</li>
<li>📝 Viết ví dụ ra giấy. Trace manual cho input nhỏ.</li>
<li>🧠 Brute force trước. KHÔNG cần tối ưu vội.</li>
<li>⌨️ Tự gõ code Java. KHÔNG copy AI.</li>
<li>▶️ Submit. Pass → next. Fail → debug.</li>
<li>⏰ <strong>HẾT 20 PHÚT</strong> mà vẫn stuck → mở solution của tôi → đọc → đóng lại → tự gõ lại từ đầu.</li>
<li>✍️ Viết Feynman note tiếng Việt: "Bài này dạy tôi pattern gì? Khi nào áp dụng?"</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>Vì sao quy trình này hiệu quả?</h3>

<strong>1) Brute force trước</strong>
Brute force luôn solve được (chỉ chậm). Có lời giải trước khi tối ưu = đỡ stress. Optimize từ working code dễ hơn từ blank.
<br/><br/>
<strong>2) 20 phút timer</strong>
Sau 20p stuck = bạn thiếu KIẾN THỨC, không phải effort. Xem solution = học pattern mới. KHÔNG xem = stuck mãi, demoralize.
<br/><br/>
<strong>3) "Tự gõ lại từ đầu" sau khi xem solution</strong>
KEY anti-copy-paste. Đọc solution = thấy quen thuộc. Tự gõ = đảm bảo fingers nhớ. Brain learns by DOING, not READING.
<br/><br/>
<strong>4) Feynman note</strong>
Giải thích bằng lời của mình = ép brain reconstruct concept. Đây là <em>active recall / testing effect</em>: chủ động tự tái tạo kiến thức giúp nhớ lâu hơn rõ rệt so với đọc lại thụ động (Roediger &amp; Karpicke, 2006). <em>(Con số "bội lần" cụ thể chỉ là ước lượng minh họa — điều chắc chắn là hiệu ứng tồn tại, không phải mức tăng chính xác.)</em>
<br/><br/>
<strong>5) 25 bài trong 3 tuần</strong>
~ 1 bài/ngày. Đủ chậm để hấp thụ, đủ nhanh để momentum. Hoàn thành Phase 0 → đã giải 25 bài → confidence boost cho Phase 1.`
      },
      theory: {
        vi: `<h3>25 bài chia thành 5 group</h3>
<table style="width:100%;border-collapse:collapse">
<tr style="background:#f0f0f0"><th style="padding:6px;text-align:left">Group</th><th style="padding:6px;text-align:left">Bài</th><th style="padding:6px;text-align:left">Skill</th></tr>
<tr><td style="padding:6px">1. Array basics</td><td style="padding:6px">Two Sum, Contains Duplicate, Move Zeroes, Best Time Buy Stock, Maximum Subarray</td><td style="padding:6px">HashMap, two pointers, Kadane intro</td></tr>
<tr><td style="padding:6px">2. String basics</td><td style="padding:6px">Reverse String, Valid Anagram, Valid Palindrome, First Unique Char, Roman to Int</td><td style="padding:6px">char[], HashMap, two pointers</td></tr>
<tr><td style="padding:6px">3. Math + Loops</td><td style="padding:6px">FizzBuzz, Palindrome Number, Plus One, Sqrt, Climbing Stairs</td><td style="padding:6px">Modulo, while, binary search, DP intro</td></tr>
<tr><td style="padding:6px">4. Linked List + Tree intro</td><td style="padding:6px">Reverse LL, Merge Two Sorted LL, LL Cycle, Max Depth Tree, Same Tree</td><td style="padding:6px">Pointer, recursion</td></tr>
<tr><td style="padding:6px">5. Stack + Misc</td><td style="padding:6px">Valid Parentheses, Single Number, Longest Common Prefix, Invert Tree, Symmetric Tree</td><td style="padding:6px">Stack, XOR, mirror recursion</td></tr>
</table>

<h3>Tốc độ recommend</h3>
<ul>
  <li><strong>Tuần 1</strong>: 8 bài (group 1 + 2 + 3 đầu). Khoảng 1h/ngày.</li>
  <li><strong>Tuần 2</strong>: 9 bài (group 3 + 4). Đây là tuần khó nhất — linked list + tree recursion.</li>
  <li><strong>Tuần 3</strong>: 8 bài (group 5 + revisit + Feynman note). Solidify.</li>
</ul>
Hoàn thành 25 → ready Phase 1.`
      },
      socraticPrompts: [
        {
          title: 'Self-check trước mỗi bài',
          prompt: `Trước khi mở solution. KHÔNG nhờ AI code. Hỏi tôi:
1. Tôi đã đọc đề mấy lần? Có hiểu input/output không?
2. Tôi đã trace example ra giấy chưa?
3. Brute force của tôi là gì? Complexity?
4. Tôi đã thử 20 phút chưa? Hay mới 5 phút đã muốn xem đáp án?
5. Nếu xem solution, tôi có cam kết tự gõ lại từ đầu không?
Self-rate 1-10 mỗi câu. Tổng < 35 = đang lười, đừng xem solution vội.`
        }
      ]
    },

    {
      id: 'l-0-3-2',
      type: 'problems',
      title: 'Group 1 — Array Basics (5 bài)',
      problems: [
        {
          id: 'p1', title: '1. Two Sum', difficulty: 'Easy', url: LC('two-sum'),
          hints: [
            'Câu 1: Brute force O(n²) — 2 vòng for. Bạn implement được không?',
            'Câu 2: HashMap reduce O(n) — lưu value → index. Tại mỗi i, check map có <code>target - nums[i]</code> chưa.'
          ],
          solution: {
            code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) return new int[]{seen.get(need), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Một pass. Map value → index. Mỗi i, tính cần gì → check seen. Bài LeetCode đầu tiên — phải solve được không nhìn.'
          }
        },
        {
          id: 'p2', title: '217. Contains Duplicate', difficulty: 'Easy', url: LC('contains-duplicate'),
          hints: [
            'Câu 1: HashSet add từng số. Nếu add() trả false → đã có.',
            'Câu 2: Bonus: sort + check liên tiếp — O(n log n) time, O(1) space.'
          ],
          solution: {
            code: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;
        }
        return false;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Tận dụng <code>set.add()</code> trả boolean. Early return ngay khi gặp duplicate đầu tiên.'
          }
        },
        {
          id: 'p3', title: '283. Move Zeroes', difficulty: 'Easy', url: LC('move-zeroes'),
          hints: [
            'Câu 1: 2 pointers — read và write. Write tăng khi gặp non-zero.',
            'Câu 2: Sau khi điền non-zero, fill phần đuôi bằng 0.'
          ],
          solution: {
            code: `class Solution {
    public void moveZeroes(int[] nums) {
        int write = 0;
        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != 0) nums[write++] = nums[read];
        }
        while (write < nums.length) nums[write++] = 0;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Same-direction two pointers. Read luôn tiến; write chỉ tiến khi gặp non-zero. Phase 2 → mở rộng.'
          }
        },
        {
          id: 'p4', title: '121. Best Time to Buy and Sell Stock', difficulty: 'Easy', url: LC('best-time-to-buy-and-sell-stock'),
          hints: [
            'Câu 1: Track min so far. Mỗi ngày, tính profit nếu bán hôm đó = price - min.',
            'Câu 2: Update best max.'
          ],
          solution: {
            code: `class Solution {
    public int maxProfit(int[] prices) {
        int min = prices[0], best = 0;
        for (int i = 1; i < prices.length; i++) {
            best = Math.max(best, prices[i] - min);
            min = Math.min(min, prices[i]);
        }
        return best;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'One pass. Track min PRICE seen, max PROFIT possible. KHÔNG cần DP — đây là DP 1D đơn giản nhất.'
          }
        },
        {
          id: 'p5', title: '53. Maximum Subarray (Kadane)', difficulty: 'Medium', url: LC('maximum-subarray'),
          hints: [
            'Câu 1: Tại mỗi i, có 2 lựa chọn: tiếp tục subarray cũ HOẶC bắt đầu mới.',
            'Câu 2: <code>curr = max(nums[i], curr + nums[i])</code>. Track global best.'
          ],
          solution: {
            code: `class Solution {
    public int maxSubArray(int[] nums) {
        int curr = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            best = Math.max(best, curr);
        }
        return best;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Kadane algorithm — DP 1D classic. <code>curr</code> = max sum kết thúc tại i. Nếu curr âm, restart từ i. Bài này MEDIUM nhưng essential cho warm-up.'
          }
        }
      ]
    },

    {
      id: 'l-0-3-3',
      type: 'problems',
      title: 'Group 2 — String Basics (5 bài)',
      problems: [
        {
          id: 'p1', title: '344. Reverse String', difficulty: 'Easy', url: LC('reverse-string'),
          hints: ['Câu 1: Two pointers từ 2 đầu, swap, tiến/lùi.', 'Câu 2: char[] input → modify in-place.'],
          solution: {
            code: `class Solution {
    public void reverseString(char[] s) {
        int l = 0, r = s.length - 1;
        while (l < r) {
            char tmp = s[l]; s[l] = s[r]; s[r] = tmp;
            l++; r--;
        }
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'In-place two pointers. Classic.'
          }
        },
        {
          id: 'p2', title: '242. Valid Anagram', difficulty: 'Easy', url: LC('valid-anagram'),
          hints: ['Câu 1: 2 string anagram ⇔ cùng letter frequency.', 'Câu 2: int[26] count. +1 cho s, -1 cho t. Cuối check toàn 0.'],
          solution: {
            code: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(26) = O(1).',
            explanationVi: '<code>c - \'a\'</code> map a..z → 0..25. Phổ biến trick. Length diff → false ngay.'
          }
        },
        {
          id: 'p3', title: '125. Valid Palindrome', difficulty: 'Easy', url: LC('valid-palindrome'),
          hints: ['Câu 1: Two pointers, skip non-alphanumeric.', 'Câu 2: <code>Character.isLetterOrDigit(c)</code> và <code>Character.toLowerCase(c)</code>.'],
          solution: {
            code: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Inner while skip không hợp lệ. KHÔNG check <code>l &lt; r</code> trong inner → over-skip. Lowercase 2 char trước compare.'
          }
        },
        {
          id: 'p4', title: '387. First Unique Character', difficulty: 'Easy', url: LC('first-unique-character-in-a-string'),
          hints: ['Câu 1: Pass 1 count freq. Pass 2 find char đầu có count = 1.', 'Câu 2: int[26] count enough cho lowercase letters.'],
          solution: {
            code: `class Solution {
    public int firstUniqChar(String s) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'a']++;
        for (int i = 0; i < s.length(); i++) {
            if (count[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(26) = O(1).',
            explanationVi: 'Pass 1 build freq, pass 2 scan. Return INDEX, không phải char.'
          }
        },
        {
          id: 'p5', title: '13. Roman to Integer', difficulty: 'Easy', url: LC('roman-to-integer'),
          hints: ['Câu 1: Roman: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.', 'Câu 2: Trick: nếu char nhỏ hơn char tiếp theo (vd "IV" → I before V), trừ. Ngược lại, cộng.'],
          solution: {
            code: `class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> map = Map.of(
            'I', 1, 'V', 5, 'X', 10, 'L', 50,
            'C', 100, 'D', 500, 'M', 1000
        );
        int sum = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = map.get(s.charAt(i));
            if (i + 1 < s.length() && cur < map.get(s.charAt(i + 1))) sum -= cur;
            else sum += cur;
        }
        return sum;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: '"IV" = 4 because I (1) + V (5) — but I trừ vì nó nhỏ hơn V đứng sau. Sum + đảo dấu cho subtraction cases.'
          }
        }
      ]
    },

    {
      id: 'l-0-3-4',
      type: 'problems',
      title: 'Group 3 — Math + Loops (5 bài)',
      problems: [
        {
          id: 'p1', title: '412. Fizz Buzz', difficulty: 'Easy', url: LC('fizz-buzz'),
          hints: ['Câu 1: 1..n. Check chia hết 3, 5, hoặc cả 2.', 'Câu 2: Thứ tự check: cả 2 (chia hết 15) TRƯỚC, rồi 3, rồi 5.'],
          solution: {
            code: `class Solution {
    public List<String> fizzBuzz(int n) {
        List<String> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0)     result.add("FizzBuzz");
            else if (i % 3 == 0) result.add("Fizz");
            else if (i % 5 == 0) result.add("Buzz");
            else                  result.add(String.valueOf(i));
        }
        return result;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Cổ điển interview warmup. <code>i % 15 == 0</code> check 15 trước; nếu check 3 trước, 15 sẽ thành "Fizz" sai.'
          }
        },
        {
          id: 'p2', title: '9. Palindrome Number', difficulty: 'Easy', url: LC('palindrome-number'),
          hints: ['Câu 1: Số âm KHÔNG palindrome (vì có -).', 'Câu 2: Reverse number bằng mod 10 + chia 10. Compare với original.'],
          solution: {
            code: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        long original = x, reversed = 0;
        while (x > 0) {
            reversed = reversed * 10 + x % 10;
            x /= 10;
        }
        return original == reversed;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(log10 x) · Space O(1).',
            explanationVi: '<code>reversed * 10 + last digit</code> = build reverse number. <code>long</code> tránh overflow khi x lớn. Bonus: chỉ reverse HALF — Phase 2.'
          }
        },
        {
          id: 'p3', title: '66. Plus One', difficulty: 'Easy', url: LC('plus-one'),
          hints: ['Câu 1: Từ phải qua trái, +1. Nếu digit = 9 → 0, carry sang trái. Nếu &lt; 9 → +1, return.', 'Câu 2: Edge case: toàn 9 → cần thêm 1 digit đầu.'],
          solution: {
            code: `class Solution {
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        int[] result = new int[digits.length + 1];
        result[0] = 1;
        return result;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1) (worst case O(n) khi toàn 9).',
            explanationVi: 'Từ phải qua. <code>&lt; 9</code> → ++ return ngay. <code>== 9</code> → set 0 + carry. Edge: toàn 9 → new array length+1 với [0] = 1, còn lại 0.'
          }
        },
        {
          id: 'p4', title: '69. Sqrt(x)', difficulty: 'Easy', url: LC('sqrtx'),
          hints: ['Câu 1: Binary search trên [0, x]. Tìm số lớn nhất mid sao cho <code>mid² ≤ x</code>.', 'Câu 2: <code>mid * mid</code> overflow → dùng long hoặc <code>mid &lt;= x / mid</code>.'],
          solution: {
            code: `class Solution {
    public int mySqrt(int x) {
        if (x < 2) return x;
        int lo = 1, hi = x / 2;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            long sq = (long) mid * mid;
            if (sq == x) return mid;
            if (sq < x) lo = mid + 1;
            else        hi = mid - 1;
        }
        return hi;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(log x) · Space O(1).',
            explanationVi: 'Binary search. Sau loop, <code>hi</code> = floor(sqrt(x)). <code>(long) mid * mid</code> tránh overflow.'
          }
        },
        {
          id: 'p5', title: '70. Climbing Stairs', difficulty: 'Easy', url: LC('climbing-stairs'),
          hints: ['Câu 1: <code>f(n) = f(n-1) + f(n-2)</code>. Fibonacci.', 'Câu 2: Iterative với 2 biến — O(1) space.'],
          solution: {
            code: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'DP 1D đầu tiên. f(1)=1, f(2)=2, f(n) = f(n-1)+f(n-2). Recursive naive O(2^n) — DP O(n).'
          }
        }
      ]
    },

    {
      id: 'l-0-3-5',
      type: 'problems',
      title: 'Group 4 — Linked List + Tree Intro (5 bài)',
      problems: [
        {
          id: 'p1', title: '206. Reverse Linked List', difficulty: 'Easy', url: LC('reverse-linked-list'),
          hints: ['Câu 1: 3 pointers: prev, curr, next.', 'Câu 2: Lưu next TRƯỚC khi cắt <code>curr.next = prev</code>.'],
          solution: {
            code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Pattern 3 con trỏ. Thứ tự thao tác cực quan trọng. Vẽ ra giấy nếu bí.'
          }
        },
        {
          id: 'p2', title: '21. Merge Two Sorted Lists', difficulty: 'Easy', url: LC('merge-two-sorted-lists'),
          hints: ['Câu 1: Dummy node head. Two pointers trên 2 list, append node nhỏ hơn.', 'Câu 2: Sau loop, append phần còn lại của list không null.'],
          solution: {
            code: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
            else                    { tail.next = l2; l2 = l2.next; }
            tail = tail.next;
        }
        tail.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n + m) · Space O(1).',
            explanationVi: 'Dummy trick — tránh special case head. Tail follow append.'
          }
        },
        {
          id: 'p3', title: '141. Linked List Cycle', difficulty: 'Easy', url: LC('linked-list-cycle'),
          hints: ['Câu 1: Slow (1 bước) + Fast (2 bước). Nếu cycle → gặp nhau.', 'Câu 2: Nếu không cycle → fast hit null.'],
          solution: {
            code: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Floyd tortoise-hare. Phase 2 Pattern 3 sẽ deep dive — đây là warmup.'
          }
        },
        {
          id: 'p4', title: '104. Maximum Depth of Binary Tree', difficulty: 'Easy', url: LC('maximum-depth-of-binary-tree'),
          hints: ['Câu 1: Recursion. Base case: null → 0.', 'Câu 2: <code>1 + max(left depth, right depth)</code>.'],
          solution: {
            code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(h) recursion stack.',
            explanationVi: 'Recursion classic. Tree problems = base case (null) + combine 2 subtree results. Phase 1 + 2 mở rộng.'
          }
        },
        {
          id: 'p5', title: '100. Same Tree', difficulty: 'Easy', url: LC('same-tree'),
          hints: ['Câu 1: Recursion. Cả 2 null → same.', 'Câu 2: 1 null + 1 không → different. Cùng val + 2 subtree match.'],
          solution: {
            code: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        return p.val == q.val
            && isSameTree(p.left, q.left)
            && isSameTree(p.right, q.right);
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(min(n, m)) · Space O(min(h1, h2)).',
            explanationVi: 'Recurse pair-wise. Edge case order matters: cả 2 null TRƯỚC, rồi 1 null.'
          }
        }
      ]
    },

    {
      id: 'l-0-3-6',
      type: 'problems',
      title: 'Group 5 — Stack + Misc (5 bài)',
      problems: [
        {
          id: 'p1', title: '20. Valid Parentheses', difficulty: 'Easy', url: LC('valid-parentheses'),
          hints: ['Câu 1: Stack. Push opener. Khi gặp closer, pop và check match.', 'Câu 2: Cuối: stack phải empty (không còn opener thừa).'],
          solution: {
            code: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') stack.push(c);
            else {
                if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
            }
        }
        return stack.isEmpty();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'Stack classic. <code>Deque</code> instead of legacy <code>Stack</code> class. Phase 1 Module 1.4 sẽ deep dive.'
          }
        },
        {
          id: 'p2', title: '136. Single Number', difficulty: 'Easy', url: LC('single-number'),
          hints: ['Câu 1: Mọi số xuất hiện 2 lần, trừ 1. Tìm cái 1 lần.', 'Câu 2: XOR magic: <code>a ^ a = 0</code>, <code>a ^ 0 = a</code>. XOR tất cả → còn lại cái single.'],
          solution: {
            code: `class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int x : nums) result ^= x;
        return result;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'XOR trick elegant. Pair cancel, single left. O(1) space win over HashSet O(n).'
          }
        },
        {
          id: 'p3', title: '14. Longest Common Prefix', difficulty: 'Easy', url: LC('longest-common-prefix'),
          hints: ['Câu 1: Vertical scan — duyệt char index 0, check tất cả strs cùng char.', 'Câu 2: Nếu mismatch hoặc hết string → return prefix tới index trước.'],
          solution: {
            code: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) return "";
        for (int i = 0; i < strs[0].length(); i++) {
            char c = strs[0].charAt(i);
            for (int j = 1; j < strs.length; j++) {
                if (i == strs[j].length() || strs[j].charAt(i) != c) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0];
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(S) với S = total chars · Space O(1).',
            explanationVi: 'Vertical scan — check col-by-col. Stop khi 1 string hết hoặc mismatch.'
          }
        },
        {
          id: 'p4', title: '226. Invert Binary Tree', difficulty: 'Easy', url: LC('invert-binary-tree'),
          hints: ['Câu 1: Recurse. Swap left/right children mỗi node.', 'Câu 2: Order swap vs recurse không ảnh hưởng kết quả.'],
          solution: {
            code: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(h).',
            explanationVi: 'Post-order swap. Mỗi node swap children sau khi recurse cả 2 subtree.'
          }
        },
        {
          id: 'p5', title: '101. Symmetric Tree', difficulty: 'Easy', url: LC('symmetric-tree'),
          hints: ['Câu 1: Symmetric ⇔ left subtree là mirror của right.', 'Câu 2: Helper <code>isMirror(a, b)</code>: <code>a.val == b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left)</code>.'],
          solution: {
            code: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val
            && isMirror(a.left, b.right)
            && isMirror(a.right, b.left);
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(h).',
            explanationVi: 'Mirror = cross children. <code>a.left ↔ b.right</code>, <code>a.right ↔ b.left</code>. Cuối Group 5 → ready Phase 1.'
          }
        }
      ]
    },

    {
      id: 'l-0-3-7',
      type: 'theory',
      title: 'Phase 0 Complete — Self-Evaluation',
      mentalModel: {
        vi: `Chúc mừng đã giải 25 bài easy! Trước khi qua Phase 1, self-evaluate.`
      },
      theory: {
        vi: `<h3>Checklist hoàn thành Phase 0</h3>
<ul>
<li>☐ Tôi đã solve 25/25 bài, mỗi bài tự gõ tay 3 lần.</li>
<li>☐ Tôi KHÔNG paste AI bất kỳ solution nào (kể cả 1 lần).</li>
<li>☐ Mỗi bài tôi đã viết Feynman note tiếng Việt.</li>
<li>☐ Tôi gõ <code>for (int i = 0; i &lt; n; i++)</code> KHÔNG cần nhìn bàn phím.</li>
<li>☐ Tôi nhớ syntax HashMap put/get/merge KHÔNG cần Google.</li>
<li>☐ Tôi gõ <code>public class X { public static void main... }</code> trong 30 giây.</li>
<li>☐ Tôi giải Two Sum trong &lt; 5 phút mà KHÔNG nhìn lại solution.</li>
</ul>

<h3>Nếu CHƯA đủ 7 điểm</h3>
KHÔNG qua Phase 1. Quay lại 25 bài, làm lại 1 lần nữa. Phase 1 yêu cầu syntax đã muscle memory.

<h3>Nếu đủ 7 điểm</h3>
✅ Sẵn sàng Phase 1. Bạn đã:
<ul>
<li>Build muscle memory syntax Java cơ bản.</li>
<li>Solve 25 LeetCode easy — confidence boost.</li>
<li>Break thói paste AI — biggest win.</li>
<li>Build habit Feynman note — sẽ tiếp tục Phase 1+.</li>
</ul>

<h3>Next: Phase 1</h3>
Phase 1 sẽ:
<ul>
<li>OOP từ ground up (class, inheritance, polymorphism).</li>
<li>IMPLEMENT ArrayList, LinkedList, Stack, Queue, HashMap from scratch (đã DÙNG ở Phase 0, giờ build).</li>
<li>Tree + BST + Heap.</li>
<li>Sort algorithms (Merge Sort, Quick Sort).</li>
</ul>
Tốc độ khuyến nghị: 1 lesson / 1-2 ngày. Tổng Phase 1: ~4-6 tuần.`
      },
      socraticPrompts: [
        {
          title: 'Self-evaluation honest',
          prompt: `Trước khi qua Phase 1. KHÔNG self-deceive. Hỏi tôi:
1. Tôi đã solve TỰ TAY 25 bài? Hay copy AI 5+ bài?
2. Tôi nhớ Two Sum algorithm KHÔNG cần nhìn? Hay phải Google?
3. Tôi gõ HashMap syntax muscle memory? Hay autocomplete IDE giúp?
4. Feynman note tôi viết tiếng Việt hay copy-paste?
5. Nếu interviewer cho Two Sum + 10 phút, tôi solve được không?

Honest answer. < 4 điểm → quay lại Phase 0.`
        }
      ],
      keyTakeaways: {
        vi: [
          '25 bài easy = foundation. Hoàn thành tự tay = ready for Phase 1.',
          'Anti-copy-paste habit là biggest win Phase 0 — giữ habit này SUỐT bootcamp.',
          'Feynman note tiếng Việt mỗi lesson — non-negotiable.',
          'Nếu phải copy AI 1 lần → ngay lập tức Feynman note "tại sao phải copy" để học từ failure.',
          'Phase 1 sẽ KHÓ hơn. Solid Phase 0 trước.'
        ]
      }
    }
  ],
  references: [
    { title: 'LeetCode Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/' },
    { title: 'NeetCode 150 Roadmap', url: 'https://neetcode.io/roadmap' },
    { title: 'Java Standard Library JavaDoc', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/index.html' }
  ]

}
