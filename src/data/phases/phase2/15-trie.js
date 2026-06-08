// Pattern 15 — Trie (Prefix Tree)
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'trie',
  title: 'Pattern 15 — Trie (Prefix Tree)',
  prerequisites: { vi: 'Hoàn thành <code>Pattern 8 — Tree DFS</code>. Trie là generalization của n-ary tree.' },
  mental: `Trie = cây mà mỗi <strong>edge là 1 ký tự</strong>. Đi từ root xuống = ghép thành string. Mỗi node có flag "end-of-word".
<br/><br/>
Mạnh cho: autocomplete, prefix search, spell check, word games. Operations O(L) với L = độ dài word.`,

  under: `<h3>First Principles</h3>
<strong>1) Memory tradeoff</strong>
Mỗi node có mảng 26 children (cho a-z). 1M word → có thể tốn nhiều RAM. Optimize: HashMap thay array nếu alphabet thưa (Unicode).
<br/><br/>
<strong>2) Compressed trie (Radix tree)</strong>
Gộp các edge chỉ có 1 child thành 1 edge dài. Tiết kiệm RAM khổng lồ — production routing tables (Linux kernel, Redis) dùng.
<br/><br/>
<strong>3) Search vs StartsWith</strong>
Search: walk path + check end flag.
StartsWith: walk path đủ — KHÔNG cần check end flag.
Time đều O(L).
<br/><br/>
<strong>4) Trie vs HashMap</strong>
Cả hai O(L) lookup. Trie THẮNG khi cần PREFIX query (autocomplete, "có word nào bắt đầu với P?"). HashMap KHÔNG trả lời được câu hỏi đó O(1).
<br/><br/>
<strong>5) Trie + DFS pattern</strong>
Word Search II, Concatenated Words, ... dùng Trie để PRUNE DFS — nếu prefix không có trong Trie → skip subtree.
<br/><br/>
<strong>6) End flag — quan trọng</strong>
KHÔNG bao giờ chỉ check "có path không" → phân biệt "word" vs "prefix". Vd: insert "apple" rồi search "app" — path tồn tại nhưng KHÔNG phải word đầy đủ.`,

  theory: `<h3>The "Why" — Khi nào Trie?</h3>
<ul>
  <li>Prefix matching (autocomplete).</li>
  <li>Dictionary lookup với wildcards.</li>
  <li>Word search trên grid (combine với DFS).</li>
  <li>IP routing, URL routing.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên end flag</strong> — không phân biệt word vs prefix.</li>
  <li><strong>Memory blow up</strong> với array 26 cho alphabet rộng → dùng HashMap.</li>
  <li><strong>Recursion deep trên long word</strong> → stack overflow. Convert iterative.</li>
  <li><strong>Trie + DFS quên prune word đã tìm</strong> → trùng kết quả.</li>
  <li><strong>Case sensitivity</strong> — đọc constraint kỹ, normalize trước insert.</li>
</ul>`,

  code: `class Trie {
    static class Node { Node[] ch = new Node[26]; boolean end; }
    private final Node root = new Node();

    public void insert(String w) {
        Node n = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new Node();
            n = n.ch[i];
        }
        n.end = true;
    }

    public boolean search(String w) { Node n = walk(w); return n != null && n.end; }
    public boolean startsWith(String p) { return walk(p) != null; }

    private Node walk(String s) {
        Node n = root;
        for (char c : s.toCharArray()) {
            n = n.ch[c - 'a'];
            if (n == null) return null;
        }
        return n;
    }
}`,

  prompts: [
    {
      title: 'Khi nào Trie thay HashMap?',
      prompt: `Cả Trie và HashMap O(L) lookup. KHÔNG cho code. Hỏi tôi:
1. Lookup "có word X" — Trie O(L), HashMap O(L). Khi nào Trie thắng?
2. "Có WORD nào bắt đầu bằng prefix P" — Trie làm thế nào? HashMap?
3. Autocomplete (5 word đầu cho prefix) — Trie nhanh hơn vì sao?
4. Memory: Trie nhiều hơn — khi nào KHÔNG dùng?
5. Compressed Trie (Radix) giải gì?`
    }
  ],

  takeaways: [
    'Node: <code>Map&lt;Character, TrieNode&gt;</code> (flexible) hoặc <code>TrieNode[26]</code> (alphabet only). Flag <code>isEnd</code> đánh dấu word.',
    'Insert/Search: O(m), m = length of word.',
    'Use cases: autocomplete, longest common prefix, word search II (kết hợp DFS grid), replace words, IP routing.',
    'Space: trie có thể to (mỗi prefix branch). Compressed trie/radix tree khi memory critical.',
    'Pitfall: <code>[26]</code> giả sử lowercase only — case-sensitive/unicode → dùng Map; quên đánh dấu <code>isEnd</code> → <code>apple</code> mất khi insert <code>applet</code>.'
  ],

  problems: [
    {
      id: 'p1', title: 'Implement Trie', difficulty: 'Medium', url: LC('implement-trie-prefix-tree'),
      hint: '⭐ ĐIỂM VÀO bắt buộc — Trie không có bài Easy; bài này là "template gốc" mà mọi bài Trie khác xây trên đó. Code thuộc lòng insert/search/startsWith trước rồi mới sang các biến thể (wildcard, word search). Template.',
      hints: [
        'Câu hỏi 1: Insert: walk + create. Search: walk + check end. StartsWith: walk only.',
        'Câu hỏi 2: Node có 26 children array (a-z) + end flag.'
      ],
      solution: {
        code: `class Trie {
    static class Node { Node[] ch = new Node[26]; boolean end; }
    private final Node root = new Node();

    public void insert(String word) {
        Node n = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new Node();
            n = n.ch[i];
        }
        n.end = true;
    }

    public boolean search(String word) {
        Node n = walk(word);
        return n != null && n.end;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private Node walk(String s) {
        Node n = root;
        for (char c : s.toCharArray()) {
            n = n.ch[c - 'a'];
            if (n == null) return null;
        }
        return n;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(L) per op · Space O(N × L × 26) worst case.',
        explanationVi: 'Template. Search vs startsWith chỉ khác check end flag.'
      }
    },
    {
      id: 'p2', title: 'Add and Search Word', difficulty: 'Medium', url: LC('design-add-and-search-words-data-structure'),
      hint: '. → recurse mọi child.',
      hints: [
        'Câu hỏi 1: Wildcard "." match bất kỳ ký tự. Khi gặp ".", recurse vào MỌI non-null child.',
        'Câu hỏi 2: Search ký tự khác → walk như bình thường.'
      ],
      solution: {
        code: `class WordDictionary {
    static class Node { Node[] ch = new Node[26]; boolean end; }
    private final Node root = new Node();

    public void addWord(String word) {
        Node n = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new Node();
            n = n.ch[i];
        }
        n.end = true;
    }

    public boolean search(String word) { return dfs(root, word, 0); }

    private boolean dfs(Node n, String w, int idx) {
        if (idx == w.length()) return n.end;
        char c = w.charAt(idx);
        if (c == '.') {
            for (Node child : n.ch) if (child != null && dfs(child, w, idx + 1)) return true;
            return false;
        }
        Node next = n.ch[c - 'a'];
        return next != null && dfs(next, w, idx + 1);
    }
}`,
        lang: 'java',
        complexityVi: 'Time: addWord O(L), search O(L) avg, O(26^dots × L) worst · Space O(N × L × 26).',
        explanationVi: 'DFS với "." branching. Khi gặp dot, recurse vào mọi child non-null. Other char: walk linear.'
      }
    },
    {
      id: 'p3', title: 'Word Search II', difficulty: 'Hard', url: LC('word-search-ii'),
      hint: 'Trie + DFS; prune word đã tìm.',
      hints: [
        'Câu hỏi 1: Build Trie từ words. DFS grid với Trie pruning — nếu prefix không có trong Trie → skip.',
        'Câu hỏi 2: Tránh duplicate: khi tìm thấy word, mark <code>node.word = null</code> hoặc remove khỏi Trie.'
      ],
      solution: {
        code: `class TrieNode { TrieNode[] ch = new TrieNode[26]; String word; }

public List<String> findWords(char[][] board, String[] words) {
    TrieNode root = new TrieNode();
    for (String w : words) {
        TrieNode n = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new TrieNode();
            n = n.ch[i];
        }
        n.word = w;
    }
    List<String> res = new ArrayList<>();
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            dfs(board, r, c, root, res);
    return res;
}

private void dfs(char[][] b, int r, int c, TrieNode n, List<String> res) {
    if (r < 0 || r >= b.length || c < 0 || c >= b[0].length) return;
    char ch = b[r][c];
    if (ch == '#' || n.ch[ch - 'a'] == null) return;
    n = n.ch[ch - 'a'];
    if (n.word != null) { res.add(n.word); n.word = null; }   // prune
    b[r][c] = '#';
    dfs(b, r+1, c, n, res); dfs(b, r-1, c, n, res); dfs(b, r, c+1, n, res); dfs(b, r, c-1, n, res);
    b[r][c] = ch;
}`,
        lang: 'java',
        complexityVi: 'Time O(N × M × 4^L) worst (N×M cells, L = max word length) · Space O(W × L).',
        explanationVi: 'Trie + DFS classic. Node lưu <code>word</code> (string) thay vì <code>end</code> flag → tiện collect. Set word = null để tránh duplicate.'
      }
    },
    {
      id: 'p4', title: 'Replace Words', difficulty: 'Medium', url: LC('replace-words'),
      hint: 'Insert roots; replace bằng root ngắn nhất khớp.',
      hints: [
        'Câu hỏi 1: Build Trie từ roots. Mỗi word: walk Trie cho đến gặp end flag → đó là root match ngắn nhất.',
        'Câu hỏi 2: Nếu walk hết word mà chưa thấy end → keep original.'
      ],
      solution: {
        code: `class TrieNode { TrieNode[] ch = new TrieNode[26]; boolean end; }

public String replaceWords(List<String> dictionary, String sentence) {
    TrieNode root = new TrieNode();
    for (String w : dictionary) {
        TrieNode n = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new TrieNode();
            n = n.ch[i];
        }
        n.end = true;
    }
    String[] words = sentence.split(" ");
    StringBuilder sb = new StringBuilder();
    for (String w : words) {
        if (sb.length() > 0) sb.append(' ');
        TrieNode n = root;
        StringBuilder cur = new StringBuilder();
        for (char c : w.toCharArray()) {
            if (n.ch[c - 'a'] == null) break;
            n = n.ch[c - 'a'];
            cur.append(c);
            if (n.end) break;
        }
        sb.append(n.end ? cur.toString() : w);
    }
    return sb.toString();
}`,
        lang: 'java',
        complexityVi: 'Time O(total chars) · Space O(total roots × L).',
        explanationVi: 'Trie roots. Mỗi word walk Trie, dừng tại end flag đầu (= root ngắn nhất). Nếu không tìm thấy, giữ nguyên.'
      }
    },
    {
      id: 'p5', title: 'Longest Word in Dictionary', difficulty: 'Medium', url: LC('longest-word-in-dictionary'),
      hint: 'DFS; mọi prefix phải là word.',
      hints: [
        'Câu hỏi 1: Build Trie. DFS từ root, đi qua chỉ những node có <code>end</code> flag (mọi prefix là word).',
        'Câu hỏi 2: Track longest path. Tie-break lexicographic — iterate children theo thứ tự a → z.'
      ],
      solution: {
        code: `class TrieNode { TrieNode[] ch = new TrieNode[26]; String word; }

public String longestWord(String[] words) {
    TrieNode root = new TrieNode();
    for (String w : words) {
        TrieNode n = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new TrieNode();
            n = n.ch[i];
        }
        n.word = w;
    }
    return dfs(root);
}

private String dfs(TrieNode n) {
    String best = n.word == null ? "" : n.word;
    for (TrieNode child : n.ch) {
        if (child != null && child.word != null) {
            String cand = dfs(child);
            if (cand.length() > best.length() || (cand.length() == best.length() && cand.compareTo(best) < 0))
                best = cand;
        }
    }
    return best;
}`,
        lang: 'java',
        complexityVi: 'Time O(N × L) · Space O(N × L).',
        explanationVi: 'DFS chỉ đi qua node có word flag (mọi prefix là word). Tie-break lex bằng compareTo.'
      }
    },
    {
      id: 'p6', title: 'Implement Magic Dictionary', difficulty: 'Medium', url: LC('implement-magic-dictionary'),
      hint: 'Cho phép đúng 1 mismatch.',
      hints: [
        'Câu hỏi 1: Build Trie. DFS với state: <code>changed</code> (boolean đã thay đổi 1 char chưa).',
        'Câu hỏi 2: Nếu char match → recurse với changed cũ. Nếu không match và !changed → thử mọi child khác.'
      ],
      solution: {
        code: `class MagicDictionary {
    static class Node { Node[] ch = new Node[26]; boolean end; }
    private final Node root = new Node();

    public void buildDict(String[] dict) {
        for (String w : dict) {
            Node n = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (n.ch[i] == null) n.ch[i] = new Node();
                n = n.ch[i];
            }
            n.end = true;
        }
    }

    public boolean search(String w) { return dfs(root, w, 0, false); }

    private boolean dfs(Node n, String w, int idx, boolean changed) {
        if (idx == w.length()) return n.end && changed;
        int target = w.charAt(idx) - 'a';
        for (int i = 0; i < 26; i++) {
            if (n.ch[i] == null) continue;
            if (i == target) {
                if (dfs(n.ch[i], w, idx + 1, changed)) return true;
            } else if (!changed) {
                if (dfs(n.ch[i], w, idx + 1, true)) return true;
            }
        }
        return false;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(L × 26) per search · Space O(N × L).',
        explanationVi: 'DFS với "đã thay đổi" flag. Match → recurse với cùng flag. Mismatch chỉ khi flag = false. Cuối: phải end + đã thay đổi đúng 1 lần.'
      }
    },
    {
      id: 'p7', title: 'Map Sum Pairs', difficulty: 'Medium', url: LC('map-sum-pairs'),
      hint: 'Sum tại mỗi node trên path.',
      hints: [
        'Câu hỏi 1: Node lưu <code>sum</code>. Insert: walk + tăng sum mỗi node (delta = newVal - oldVal).',
        'Câu hỏi 2: Sum query: walk prefix, return sum tại node cuối.'
      ],
      solution: {
        code: `class MapSum {
    static class Node { Node[] ch = new Node[26]; int sum; }
    private final Node root = new Node();
    private final Map<String, Integer> stored = new HashMap<>();

    public void insert(String key, int val) {
        int delta = val - stored.getOrDefault(key, 0);
        stored.put(key, val);
        Node n = root;
        for (char c : key.toCharArray()) {
            int i = c - 'a';
            if (n.ch[i] == null) n.ch[i] = new Node();
            n = n.ch[i];
            n.sum += delta;
        }
    }

    public int sum(String prefix) {
        Node n = root;
        for (char c : prefix.toCharArray()) {
            n = n.ch[c - 'a'];
            if (n == null) return 0;
        }
        return n.sum;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(L) per op · Space O(N × L).',
        explanationVi: 'Lazy update: lưu old value trong HashMap. Insert delta vào MỌI node trên path. Query: walk prefix, return sum node cuối.'
      }
    },
    {
      id: 'p8', title: 'Top K Frequent Words (Trie + Heap)', difficulty: 'Medium', url: LC('top-k-frequent-words'),
      hint: 'Alternative trie + heap.',
      hints: [
        'Câu hỏi 1: HashMap count đơn giản hơn nhưng Trie alternative cũng work.',
        'Câu hỏi 2: Sau count, dùng heap như Pattern 12.'
      ],
      solution: {
        code: `public List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> count = new HashMap<>();
    for (String w : words) count.merge(w, 1, Integer::sum);
    PriorityQueue<String> heap = new PriorityQueue<>((a, b) -> {
        int d = count.get(a) - count.get(b);
        return d != 0 ? d : b.compareTo(a);
    });
    for (String w : count.keySet()) {
        heap.offer(w);
        if (heap.size() > k) heap.poll();
    }
    LinkedList<String> res = new LinkedList<>();
    while (!heap.isEmpty()) res.addFirst(heap.poll());
    return res;
}`,
        lang: 'java',
        complexityVi: 'Time O(N log k) · Space O(N).',
        explanationVi: 'HashMap count → min-heap với tie-break custom. addFirst để output "tốt" trước.'
      }
    },
    {
      id: 'p9', title: 'Stream of Characters', difficulty: 'Hard', url: LC('stream-of-characters'),
      hint: 'Insert reversed words; walk từ char mới về sau.',
      hints: [
        'Câu hỏi 1: Stream chars, query "tồn tại word ending tại char mới"? Build Trie từ REVERSED words.',
        'Câu hỏi 2: Mỗi char mới, walk Trie từ char mới về phía sau (chars cũ). Match end flag = answer YES.'
      ],
      solution: {
        code: `class StreamChecker {
    static class Node { Node[] ch = new Node[26]; boolean end; }
    private final Node root = new Node();
    private final StringBuilder stream = new StringBuilder();

    public StreamChecker(String[] words) {
        for (String w : words) {
            Node n = root;
            for (int i = w.length() - 1; i >= 0; i--) {
                int c = w.charAt(i) - 'a';
                if (n.ch[c] == null) n.ch[c] = new Node();
                n = n.ch[c];
            }
            n.end = true;
        }
    }

    public boolean query(char letter) {
        stream.append(letter);
        Node n = root;
        for (int i = stream.length() - 1; i >= 0 && n != null; i--) {
            n = n.ch[stream.charAt(i) - 'a'];
            if (n != null && n.end) return true;
        }
        return false;
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(L_max) per query · Space O(W × L).',
        explanationVi: 'Reversed Trie. Mỗi query walk Trie từ char mới về SAU (chars cũ). Match end flag = word ending tại char hiện tại.'
      }
    },
    {
      id: 'p10', title: 'Concatenated Words', difficulty: 'Hard', url: LC('concatenated-words'),
      hint: 'Trie + DFS check word ghép từ ≥2 word.',
      hints: [
        'Câu hỏi 1: Sort words by length. Build Trie từ shorter words. Check mỗi word: có thể chia thành ≥ 2 word trong Trie không?',
        'Câu hỏi 2: DFS với memo: <code>canSplit(word, start)</code> = exists path of words from start.'
      ],
      solution: {
        code: `public List<String> findAllConcatenatedWordsInADict(String[] words) {
    Set<String> dict = new HashSet<>(Arrays.asList(words));
    List<String> res = new ArrayList<>();
    Map<String, Boolean> memo = new HashMap<>();
    for (String w : words) {
        if (canSplit(w, dict, memo, true)) res.add(w);
    }
    return res;
}

private boolean canSplit(String w, Set<String> dict, Map<String, Boolean> memo, boolean isOriginal) {
    if (memo.containsKey(w)) return memo.get(w);
    if (!isOriginal && dict.contains(w)) { memo.put(w, true); return true; }
    for (int i = 1; i < w.length(); i++) {
        if (dict.contains(w.substring(0, i)) && canSplit(w.substring(i), dict, memo, false)) {
            memo.put(w, true);
            return true;
        }
    }
    memo.put(w, false);
    return false;
}`,
        lang: 'java',
        complexityVi: 'Time O(N × L²) average · Space O(N × L).',
        explanationVi: 'DFS check split. <code>isOriginal</code> flag: word gốc KHÔNG được coi như "word đầy đủ" — phải split thành ≥ 2 word khác. Memo tránh recompute.'
      }
    }
  ],
  references: [
    { title: 'Trie (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Trie' },
    { title: 'Implement Trie -LeetCode', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' }
  ]

}
