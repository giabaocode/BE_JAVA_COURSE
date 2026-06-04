// Pattern 13 — Graph: BFS/DFS & Union-Find
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'g1',
  title: 'Pattern 13 — Graph: BFS/DFS & Union-Find',
  prerequisites: { vi: 'Hoàn thành <code>Pattern 7, 8</code> (Tree BFS/DFS). Tree là special case của graph.' },
  mental: `Đồ thị (graph) — 2 cách biểu diễn:
<ul>
<li><strong>Adjacency list</strong>: <code>List&lt;List&lt;Integer&gt;&gt; adj</code> — tốt cho sparse.</li>
<li><strong>Grid</strong>: <code>int[][] grid</code> — graph ẩn, neighbor = 4/8 ô lân cận.</li>
</ul>
BFS → shortest path UNWEIGHTED. DFS → connectivity/topological. <strong>Union-Find</strong> → dynamic connectivity, Kruskal MST.`,

  under: `<h3>First Principles</h3>
<strong>1) Union-Find với path compression</strong>
<code>find(x)</code> "phẳng" cây bằng cách trỏ trực tiếp lên root khi recursion về. Amortized O(α(n)) — gần O(1) cho mọi n thực tế (α là inverse Ackermann, &lt; 5 cho n &lt; 2^65).
<br/><br/>
<strong>2) Union by rank/size</strong>
Luôn nối cây thấp vào cây cao → cây tổng KHÔNG cao lên. Kết hợp với path compression cho amortized O(α(n)).
<br/><br/>
<strong>3) Cycle detection — undirected</strong>
DFS với "parent" tracking: nếu gặp visited node KHÁC parent → cycle. Hoặc Union-Find: edge nào union return false → tạo cycle.
<br/><br/>
<strong>4) Cycle detection — directed</strong>
DFS 3-color: WHITE (chưa thăm), GRAY (đang DFS xuống), BLACK (đã xong). Gặp GRAY → back-edge → cycle. Kahn's BFS: nếu xử lý được &lt; n node → có cycle.
<br/><br/>
<strong>5) Topological sort</strong>
DFS post-order REVERSE = topo order. Hoặc Kahn (BFS với in-degree=0 queue). Kahn dễ detect cycle, DFS code ngắn hơn.
<br/><br/>
<strong>6) Visited marker placement</strong>
Đánh dấu visited TRƯỚC PUSH vào queue/stack (KHÔNG sau pop). Tránh push duplicate vào BFS queue → cấp số nhân.`,

  theory: `<h3>The "Why" — BFS vs DFS vs Union-Find?</h3>
<ul>
  <li>Shortest path unweighted → BFS.</li>
  <li>Connectivity check trên static graph → DFS đơn giản.</li>
  <li>Dynamic connectivity (add edges + queries) → Union-Find.</li>
  <li>Topological sort → DFS hoặc Kahn.</li>
  <li>MST → Kruskal (Union-Find) hoặc Prim (heap).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Mark visited SAU pop</strong> → duplicate trong queue → memory blow up.</li>
  <li><strong>Quên path compression</strong> → Union-Find O(log n) average chứ không O(α(n)).</li>
  <li><strong>Cycle undirected: confuse "parent" với "visited"</strong> → false positive cycle.</li>
  <li><strong>Grid bounds check</strong> trước access — tránh ArrayIndexOutOfBoundsException.</li>
  <li><strong>BFS unweighted, dùng Dijkstra</strong> → over-engineering. BFS đủ và đơn giản hơn.</li>
</ul>`,

  code: `// Union-Find với path compression
class UnionFind {
    int[] parent, rank;
    int components;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        components--;
        return true;
    }
}`,

  prompts: [
    {
      title: 'Khi nào Union-Find, khi nào BFS/DFS?',
      prompt: `KHÔNG cho code. Hỏi tôi:
1. Bài cho danh sách edge và hỏi "có bao nhiêu component" — UF hay BFS?
2. Bài cho graph và hỏi shortest path unweighted — BFS hay DFS?
3. Bài "detect cycle in undirected graph" — UF phát hiện thế nào?
4. Topological sort: BFS (Kahn) hay DFS — output khác ra sao?
5. UF path compression amortized complexity?`
    }
  ],

  takeaways: [
    'Đại diện: <strong>adjacency list</strong> (sparse), adjacency matrix (dense). Visited Set hoặc <code>boolean[]</code> để tránh infinite loop.',
    'BFS: shortest path UNweighted, level info. DFS: connected components, topological sort, cycle detect.',
    'Topological sort: DFS post-order reversed, hoặc thuật toán Kahn (BFS với in-degree).',
    'Bidirectional BFS: khi có cả source + target → giảm complexity từ <code>O(b^d)</code> xuống <code>O(b^(d/2))</code>.',
    'Pitfall: quên mark visited TRƯỚC khi enqueue (BFS) → cùng node enqueue nhiều lần; revisit cycle.'
  ],

  problems: [
    {
      id: 'p1', title: 'Number of Islands', difficulty: 'Medium', url: LC('number-of-islands'),
      hint: 'DFS/BFS hoặc Union-Find.',
      hints: [
        'Câu hỏi 1: Mỗi "1" liền kề thuộc cùng island. Scan, mỗi "1" chưa visited → DFS mark all connected "1", count++.',
        'Câu hỏi 2: Mark visited bằng cách flip "1" → "0" tránh extra space.'
      ],
      solution: {
        code: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == '1') { dfs(grid, r, c); count++; }
    return count;
}

private void dfs(char[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';   // mark visited
    dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n) recursion worst case.',
        explanationVi: 'DFS flood-fill. Mark visited in-place bằng "0" — tiết kiệm extra grid. Count = số connected component.'
      }
    },
    {
      id: 'p2', title: 'Max Area of Island', difficulty: 'Medium', url: LC('max-area-of-island'),
      hint: 'DFS return area.',
      hints: [
        'Câu hỏi 1: Cùng Number of Islands, nhưng DFS return area = 1 + sum của 4 neighbor DFS.',
        'Câu hỏi 2: Track max area qua mọi DFS call.'
      ],
      solution: {
        code: `public int maxAreaOfIsland(int[][] grid) {
    int best = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == 1) best = Math.max(best, dfs(grid, r, c));
    return best;
}

private int dfs(int[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != 1) return 0;
    g[r][c] = 0;
    return 1 + dfs(g, r+1, c) + dfs(g, r-1, c) + dfs(g, r, c+1) + dfs(g, r, c-1);
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'DFS return area. Mỗi cell đếm 1, recursive accumulate qua neighbors.'
      }
    },
    {
      id: 'p3', title: 'Surrounded Regions', difficulty: 'Medium', url: LC('surrounded-regions'),
      hint: 'DFS từ biên Os; flip còn lại.',
      hints: [
        'Câu hỏi 1: O thoát ra biên (không bị bao). DFS từ MỌI O ở biên, mark "đặc biệt".',
        'Câu hỏi 2: Sau DFS biên, flip: O còn lại → X; đặc biệt → O.'
      ],
      solution: {
        code: `public void solve(char[][] board) {
    int m = board.length, n = board[0].length;
    for (int i = 0; i < m; i++) { dfs(board, i, 0); dfs(board, i, n - 1); }
    for (int j = 0; j < n; j++) { dfs(board, 0, j); dfs(board, m - 1, j); }
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            if (board[i][j] == 'O') board[i][j] = 'X';
            else if (board[i][j] == '#') board[i][j] = 'O';
        }
}

private void dfs(char[][] b, int r, int c) {
    if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != 'O') return;
    b[r][c] = '#';
    dfs(b, r+1, c); dfs(b, r-1, c); dfs(b, r, c+1); dfs(b, r, c-1);
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n) recursion.',
        explanationVi: 'Reverse thinking: dễ đánh dấu O thoát ra biên hơn O bị bao. DFS từ biên Os → mark "#". Sau đó flip.'
      }
    },
    {
      id: 'p4', title: 'Rotting Oranges', difficulty: 'Medium', url: LC('rotting-oranges'),
      hint: 'Multi-source BFS.',
      hints: [
        'Câu hỏi 1: BFS đồng thời từ MỌI orange rotten ban đầu. Track time = số "wave".',
        'Câu hỏi 2: Cuối: nếu còn fresh orange → -1; ngược lại time.'
      ],
      solution: {
        code: `public int orangesRotting(int[][] grid) {
    Deque<int[]> q = new ArrayDeque<>();
    int fresh = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == 2) q.offer(new int[]{r, c});
            else if (grid[r][c] == 1) fresh++;
        }
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    int time = 0;
    while (!q.isEmpty() && fresh > 0) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            int[] p = q.poll();
            for (int[] d : dirs) {
                int nr = p[0] + d[0], nc = p[1] + d[1];
                if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || grid[nr][nc] != 1) continue;
                grid[nr][nc] = 2;
                fresh--;
                q.offer(new int[]{nr, nc});
            }
        }
        time++;
    }
    return fresh == 0 ? time : -1;
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'Multi-source BFS — push hết rotten ban đầu, BFS từng wave. Track fresh count → -1 nếu còn.'
      }
    },
    {
      id: 'p5', title: 'Walls and Gates', difficulty: 'Medium', url: LC('walls-and-gates'),
      hint: 'BFS từ mọi gate.',
      hints: [
        'Câu hỏi 1: Multi-source BFS từ mọi gate (0). Tại mỗi step, update distance.',
        'Câu hỏi 2: BFS đảm bảo distance shortest unweighted.'
      ],
      solution: {
        code: `public void wallsAndGates(int[][] rooms) {
    Deque<int[]> q = new ArrayDeque<>();
    for (int r = 0; r < rooms.length; r++)
        for (int c = 0; c < rooms[0].length; c++)
            if (rooms[r][c] == 0) q.offer(new int[]{r, c});

    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty()) {
        int[] p = q.poll();
        for (int[] d : dirs) {
            int nr = p[0] + d[0], nc = p[1] + d[1];
            if (nr < 0 || nr >= rooms.length || nc < 0 || nc >= rooms[0].length || rooms[nr][nc] != Integer.MAX_VALUE) continue;
            rooms[nr][nc] = rooms[p[0]][p[1]] + 1;
            q.offer(new int[]{nr, nc});
        }
    }
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n) · Space O(m × n).',
        explanationVi: 'Multi-source BFS từ gates. INF rooms được update distance khi first visited. BFS đảm bảo distance min.'
      }
    },
    {
      id: 'p6', title: 'Course Schedule', difficulty: 'Medium', url: LC('course-schedule'),
      hint: 'Detect cycle.',
      hints: [
        'Câu hỏi 1: Detect cycle trong directed graph. Kahn BFS hoặc DFS 3-color.',
        'Câu hỏi 2: Kahn: tính in-degree, BFS từ in-degree 0. Count xử lý — nếu &lt; n → cycle.'
      ],
      solution: {
        code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    int[] inDeg = new int[numCourses];
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDeg[p[0]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) if (inDeg[i] == 0) q.offer(i);
    int done = 0;
    while (!q.isEmpty()) {
        int c = q.poll();
        done++;
        for (int next : adj.get(c)) if (--inDeg[next] == 0) q.offer(next);
    }
    return done == numCourses;
}`,
        lang: 'java',
        complexityVi: 'Time O(V + E) · Space O(V + E).',
        explanationVi: 'Kahn BFS: bắt đầu từ in-degree 0. Mỗi node xử lý decrement in-degree neighbor. Nếu cycle, một số node KHÔNG bao giờ đến in-degree 0 → done &lt; n.'
      }
    },
    {
      id: 'p7', title: 'Course Schedule II', difficulty: 'Medium', url: LC('course-schedule-ii'),
      hint: 'Topological sort Kahn.',
      hints: [
        'Câu hỏi 1: Như Course Schedule I nhưng return order. Output trong Kahn = topo order.',
        'Câu hỏi 2: Edge case: cycle → return [].'
      ],
      solution: {
        code: `public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    int[] inDeg = new int[numCourses];
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDeg[p[0]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) if (inDeg[i] == 0) q.offer(i);
    int[] order = new int[numCourses];
    int idx = 0;
    while (!q.isEmpty()) {
        int c = q.poll();
        order[idx++] = c;
        for (int n : adj.get(c)) if (--inDeg[n] == 0) q.offer(n);
    }
    return idx == numCourses ? order : new int[0];
}`,
        lang: 'java',
        complexityVi: 'Time O(V + E) · Space O(V + E).',
        explanationVi: 'Output order trong Kahn = topo sort. Return [] nếu detect cycle (idx &lt; n).'
      }
    },
    {
      id: 'p8', title: 'Number of Connected Components', difficulty: 'Medium', url: LC('number-of-connected-components-in-an-undirected-graph'),
      hint: 'Union-Find.',
      hints: [
        'Câu hỏi 1: Union mọi edge. Final components = answer.',
        'Câu hỏi 2: Alternative: DFS/BFS đếm component.'
      ],
      solution: {
        code: `public int countComponents(int n, int[][] edges) {
    int[] parent = new int[n], rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int components = n;
    for (int[] e : edges) {
        int ra = find(parent, e[0]), rb = find(parent, e[1]);
        if (ra != rb) {
            if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
            parent[rb] = ra;
            if (rank[ra] == rank[rb]) rank[ra]++;
            components--;
        }
    }
    return components;
}

private int find(int[] p, int x) {
    if (p[x] != x) p[x] = find(p, p[x]);
    return p[x];
}`,
        lang: 'java',
        complexityVi: 'Time O(E α(n)) ≈ O(E) · Space O(n).',
        explanationVi: 'Union-Find. Mỗi successful union giảm components 1. Final = answer.'
      }
    },
    {
      id: 'p9', title: 'Redundant Connection', difficulty: 'Medium', url: LC('redundant-connection'),
      hint: 'Edge đầu tiên union fail.',
      hints: [
        'Câu hỏi 1: Union mọi edge tuần tự. Edge đầu tiên union return false = edge tạo cycle = answer.',
        'Câu hỏi 2: Tại sao "đầu tiên"? — Đề bài yêu cầu edge LAST trong input gây cycle, mà tuần tự = last khi loop.'
      ],
      solution: {
        code: `public int[] findRedundantConnection(int[][] edges) {
    int n = edges.length;
    int[] parent = new int[n + 1];
    for (int i = 0; i <= n; i++) parent[i] = i;
    for (int[] e : edges) {
        if (!union(parent, e[0], e[1])) return e;
    }
    return new int[0];
}

private boolean union(int[] p, int a, int b) {
    int ra = find(p, a), rb = find(p, b);
    if (ra == rb) return false;
    p[ra] = rb;
    return true;
}

private int find(int[] p, int x) {
    if (p[x] != x) p[x] = find(p, p[x]);
    return p[x];
}`,
        lang: 'java',
        complexityVi: 'Time O(n α(n)) · Space O(n).',
        explanationVi: 'Process edge tuần tự. First fail union = cycle creator = answer. Tree với n node + 1 edge = exact 1 cycle.'
      }
    },
    {
      id: 'p10', title: 'Accounts Merge', difficulty: 'Medium', url: LC('accounts-merge'),
      hint: 'Union emails.',
      hints: [
        'Câu hỏi 1: Mỗi account chứa emails — union mọi pair email cùng account.',
        'Câu hỏi 2: Sau union, group emails by root. Mỗi group + name → output.'
      ],
      solution: {
        code: `public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, String> emailToName = new HashMap<>();
    Map<String, String> parent = new HashMap<>();
    for (List<String> acc : accounts) {
        String name = acc.get(0);
        for (int i = 1; i < acc.size(); i++) {
            parent.putIfAbsent(acc.get(i), acc.get(i));
            emailToName.put(acc.get(i), name);
            if (i > 1) union(parent, acc.get(i), acc.get(1));
        }
    }
    Map<String, TreeSet<String>> groups = new HashMap<>();
    for (String email : parent.keySet()) {
        String root = find(parent, email);
        groups.computeIfAbsent(root, k -> new TreeSet<>()).add(email);
    }
    List<List<String>> res = new ArrayList<>();
    for (Map.Entry<String, TreeSet<String>> e : groups.entrySet()) {
        List<String> merged = new ArrayList<>();
        merged.add(emailToName.get(e.getKey()));
        merged.addAll(e.getValue());
        res.add(merged);
    }
    return res;
}

private String find(Map<String, String> p, String x) {
    if (!p.get(x).equals(x)) p.put(x, find(p, p.get(x)));
    return p.get(x);
}

private void union(Map<String, String> p, String a, String b) {
    String ra = find(p, a), rb = find(p, b);
    if (!ra.equals(rb)) p.put(ra, rb);
}`,
        lang: 'java',
        complexityVi: 'Time O(N α(N) log N) với N = total emails · Space O(N).',
        explanationVi: 'Union emails trong cùng account. Group by root. TreeSet auto-sort emails. Cuối: name + sorted emails.'
      }
    },
    {
      id: 'p11', title: 'Word Ladder', difficulty: 'Hard', url: LC('word-ladder'),
      hint: 'BFS với wildcard bucket.',
      hints: [
        'Câu hỏi 1: BFS từ beginWord. Mỗi step: try đổi từng char thành 25 chars khác, check trong dict.',
        'Câu hỏi 2: Tối ưu: precompute pattern buckets (vd "h*t" → {hot, hit, ...}) để O(L) neighbor lookup.'
      ],
      solution: {
        code: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> dict = new HashSet<>(wordList);
    if (!dict.contains(endWord)) return 0;
    Deque<String> q = new ArrayDeque<>();
    q.offer(beginWord);
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    int steps = 1;
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            String cur = q.poll();
            if (cur.equals(endWord)) return steps;
            char[] chars = cur.toCharArray();
            for (int j = 0; j < chars.length; j++) {
                char old = chars[j];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (c == old) continue;
                    chars[j] = c;
                    String next = new String(chars);
                    if (dict.contains(next) && visited.add(next)) q.offer(next);
                }
                chars[j] = old;
            }
        }
        steps++;
    }
    return 0;
}`,
        lang: 'java',
        complexityVi: 'Time O(N × L² × 26) · Space O(N × L).',
        explanationVi: 'BFS unweighted → shortest path. Neighbor = mọi word khác 1 char. Visited set tránh re-process.'
      }
    },
    {
      id: 'p12', title: 'Clone Graph', difficulty: 'Medium', url: LC('clone-graph'),
      hint: 'DFS/BFS + HashMap visited.',
      hints: [
        'Câu hỏi 1: HashMap original → clone. DFS: nếu đã có clone → return; nếu chưa → tạo clone, recurse cho mỗi neighbor.',
        'Câu hỏi 2: BFS alternative cũng work — push original, lookup hoặc create clone.'
      ],
      solution: {
        code: `public Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> map = new HashMap<>();
    return dfs(node, map);
}

private Node dfs(Node n, Map<Node, Node> map) {
    if (map.containsKey(n)) return map.get(n);
    Node clone = new Node(n.val);
    map.put(n, clone);
    for (Node neighbor : n.neighbors) clone.neighbors.add(dfs(neighbor, map));
    return clone;
}`,
        lang: 'java',
        complexityVi: 'Time O(V + E) · Space O(V).',
        explanationVi: 'HashMap memoize: original Node → clone. DFS traversal đảm bảo mỗi node clone 1 lần. Recursive trên neighbors.'
      }
    }
  ],
  references: [
    { title: 'BFS/DFS on graphs (CP-Algorithms)', url: 'https://cp-algorithms.com/graph/breadth-first-search.html' },
    { title: 'Topological sort', url: 'https://cp-algorithms.com/graph/topological-sort.html' }
  ]

}
