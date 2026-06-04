// Pattern 14 — Graph: Dijkstra & MST
const LC = (slug) => `https://leetcode.com/problems/${slug}/`

export default {
  id: 'g2',
  title: 'Pattern 14 — Graph: Dijkstra & MST',
  mental: `Graph có trọng số dương, shortest path? → <strong>Dijkstra</strong> với min-heap. O((V+E) log V).
<br/><br/>
Cây bao trùm chi phí tối thiểu (MST)? → <strong>Kruskal</strong> (sort edges + Union-Find) hoặc <strong>Prim</strong> (như Dijkstra, "thêm node gần nhất chưa có").`,

  under: `<h3>First Principles</h3>
<strong>1) Dijkstra correctness</strong>
Khi pop node u khỏi heap, dist[u] = min CHẮC CHẮN. Lý do: mọi path khác đến u qua node v đã pop trước → dist[v] ≤ dist[u] hiện tại + weight(v, u). Greedy: lấy thằng dist nhỏ nhất chưa xác định.
<br/><br/>
<strong>2) Edge âm phá Dijkstra</strong>
Giả định "đã chốt dist[u] tối ưu khi pop" KHÔNG hold nếu có edge âm. Path qua u sau khi pop có thể NGẮN HƠN. Cần Bellman-Ford O(VE).
<br/><br/>
<strong>3) Lazy deletion trong heap</strong>
Push duplicate (u, dist_new) là OK — chỉ cần skip khi pop nếu <code>d &gt; dist[u]</code> (stale). Đơn giản hơn indexed PQ.
<br/><br/>
<strong>4) Bellman-Ford</strong>
Relax mọi edge V-1 lần. Nếu round V relax được nữa → negative cycle. O(VE).
<br/><br/>
<strong>5) Floyd-Warshall</strong>
All-pairs shortest path. O(V³). DP: <code>dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</code> qua mọi k.
<br/><br/>
<strong>6) Kruskal vs Prim</strong>
Kruskal: sort edges, union-find, O(E log E). Cho sparse graph. Prim: như Dijkstra với heap O(E log V). Cho dense graph.`,

  theory: `<h3>The "Why" — Algorithm nào?</h3>
<ul>
  <li>Weighted positive, single-source SP → Dijkstra.</li>
  <li>Có thể có edge âm → Bellman-Ford.</li>
  <li>All-pairs SP, V nhỏ → Floyd-Warshall.</li>
  <li>MST → Kruskal (sparse) hoặc Prim (dense).</li>
  <li>Unweighted SP → BFS (không cần Dijkstra).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Dijkstra với edge âm</strong> → sai. Phải Bellman-Ford.</li>
  <li><strong>Forget skip stale entry</strong> trong heap → process duplicate, sai dist final.</li>
  <li><strong>Update dist[v] mà KHÔNG push lại heap</strong> → mất chance relax.</li>
  <li><strong>BFS unweighted dùng Dijkstra</strong> — over-engineering, O((V+E) log V) thay O(V+E).</li>
  <li><strong>Kruskal quên sort edges</strong> hoặc dùng wrong comparator.</li>
</ul>`,

  code: `// Dijkstra với min-heap
int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[src] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);   // [node, distSoFar]
pq.offer(new int[]{src, 0});
while (!pq.isEmpty()) {
    int[] cur = pq.poll();
    int u = cur[0], d = cur[1];
    if (d > dist[u]) continue;        // SKIP STALE entry
    for (int[] e : graph[u]) {
        int v = e[0], w = e[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.offer(new int[]{v, dist[v]});
        }
    }
}`,

  prompts: [
    {
      title: 'Dijkstra correctness',
      prompt: `Vì sao Dijkstra hoạt động? KHÔNG đáp án. Hỏi tôi:
1. Tại sao khi pop u khỏi heap, dist[u] CHẮC CHẮN min?
2. Edge âm gây bug gì? Vẽ counter-example.
3. Vì sao push duplicate vào heap vẫn ổn (skip stale)?
4. Khi nào dừng — pop hết heap, hay khi tìm target?
5. Modify: SP với ràng buộc "ít nhất K stops" — thêm gì vào state?`
    }
  ],

  takeaways: [
    'Dijkstra: weights ≥ 0, MinHeap, O((V+E) log V). KHÔNG work với weight âm.',
    'Bellman-Ford: handle weight âm, detect negative cycle, O(VE).',
    'A*: Dijkstra + heuristic <code>h(n)</code> → guided search, dùng cho pathfinding game/map.',
    'MST: <strong>Kruskal</strong> (sort edges + UnionFind, O(E log E)) hoặc <strong>Prim</strong> (greedy + heap, O((V+E) log V)).',
    'Pitfall: dùng Dijkstra với negative weight → silent wrong; quên relax check (chỉ update khi dist mới &lt; dist cũ).'
  ],

  problems: [
    {
      id: 'p1', title: 'Network Delay Time', difficulty: 'Medium', url: LC('network-delay-time'),
      hint: 'Dijkstra.',
      hints: [
        'Câu hỏi 1: Single-source SP. Max của dist[i] qua mọi i = answer. -1 nếu unreachable.',
        'Câu hỏi 2: Build adjacency list từ times. Dijkstra từ k.'
      ],
      solution: {
        code: `public int networkDelayTime(int[][] times, int n, int k) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
    for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});

    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{k, 0});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[0], d = cur[1];
        if (d > dist[u]) continue;
        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    int max = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == Integer.MAX_VALUE) return -1;
        max = Math.max(max, dist[i]);
    }
    return max;
}`,
        lang: 'java',
        complexityVi: 'Time O((V + E) log V) · Space O(V + E).',
        explanationVi: 'Dijkstra classic. Answer = max dist (chờ node xa nhất). -1 nếu node unreachable.'
      }
    },
    {
      id: 'p2', title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: LC('cheapest-flights-within-k-stops'),
      hint: 'Bellman-Ford k+1 iter.',
      hints: [
        'Câu hỏi 1: Constraint "≤ k stops". Bellman-Ford k+1 iterations (k+1 edges = k stops).',
        'Câu hỏi 2: Mỗi iteration: relax dùng PREV state (tránh chain trong cùng iter).'
      ],
      solution: {
        code: `public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] tmp = dist.clone();   // dùng PREV state
        for (int[] f : flights) {
            if (dist[f[0]] == Integer.MAX_VALUE) continue;
            tmp[f[1]] = Math.min(tmp[f[1]], dist[f[0]] + f[2]);
        }
        dist = tmp;
    }
    return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
}`,
        lang: 'java',
        complexityVi: 'Time O(k × E) · Space O(V).',
        explanationVi: 'Bellman-Ford with edge limit. Clone <code>dist</code> mỗi iter → relax dùng PREV state, đảm bảo edges count tăng đúng 1.'
      }
    },
    {
      id: 'p3', title: 'Path With Minimum Effort', difficulty: 'Medium', url: LC('path-with-minimum-effort'),
      hint: 'Dijkstra với max edge weight.',
      hints: [
        'Câu hỏi 1: Cost path = max |height diff| trên path. Modified Dijkstra: dist[v] = max edge weight đến v.',
        'Câu hỏi 2: Relax: <code>newDist = max(dist[u], |height[v] - height[u]|)</code>.'
      ],
      solution: {
        code: `public int minimumEffortPath(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    dist[0][0] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[2] - b[2]);
    pq.offer(new int[]{0, 0, 0});
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[0], c = cur[1], d = cur[2];
        if (r == m - 1 && c == n - 1) return d;
        if (d > dist[r][c]) continue;
        for (int[] dir : dirs) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            int newDist = Math.max(d, Math.abs(heights[nr][nc] - heights[r][c]));
            if (newDist < dist[nr][nc]) {
                dist[nr][nc] = newDist;
                pq.offer(new int[]{nr, nc, newDist});
            }
        }
    }
    return 0;
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n × log(m × n)) · Space O(m × n).',
        explanationVi: 'Modified Dijkstra: cost = MAX edge weight (không sum). Relax dùng max. Heap min by cost. Early return khi đến góc.'
      }
    },
    {
      id: 'p4', title: 'Swim in Rising Water', difficulty: 'Hard', url: LC('swim-in-rising-water'),
      hint: 'Dijkstra hoặc binary search.',
      hints: [
        'Câu hỏi 1: Cost = max grid value trên path. Modified Dijkstra như Path With Min Effort.',
        'Câu hỏi 2: Alternative: BS trên T, check connectivity với cells ≤ T.'
      ],
      solution: {
        code: `public int swimInWater(int[][] grid) {
    int n = grid.length;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[2] - b[2]);
    pq.offer(new int[]{0, 0, grid[0][0]});
    boolean[][] visited = new boolean[n][n];
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[0], c = cur[1], t = cur[2];
        if (visited[r][c]) continue;
        visited[r][c] = true;
        if (r == n - 1 && c == n - 1) return t;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nr >= n || nc < 0 || nc >= n || visited[nr][nc]) continue;
            pq.offer(new int[]{nr, nc, Math.max(t, grid[nr][nc])});
        }
    }
    return -1;
}`,
        lang: 'java',
        complexityVi: 'Time O(n² log n) · Space O(n²).',
        explanationVi: 'Min-heap by max-elevation so far. Pop smallest max → đó là answer khi đến góc. Visited để skip revisit.'
      }
    },
    {
      id: 'p5', title: 'The Maze II', difficulty: 'Medium', url: LC('the-maze-ii'),
      hint: 'Dijkstra weighted by roll distance.',
      hints: [
        'Câu hỏi 1: Ball lăn cho đến khi đụng tường. Mỗi "roll" có distance. Edge weight = roll distance.',
        'Câu hỏi 2: Dijkstra: relax với dist[u] + rollDist.'
      ],
      solution: {
        code: `public int shortestDistance(int[][] maze, int[] start, int[] dest) {
    int m = maze.length, n = maze[0].length;
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    dist[start[0]][start[1]] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[2] - b[2]);
    pq.offer(new int[]{start[0], start[1], 0});
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[0], c = cur[1], d = cur[2];
        if (d > dist[r][c]) continue;
        for (int[] dir : dirs) {
            int nr = r, nc = c, steps = 0;
            while (nr + dir[0] >= 0 && nr + dir[0] < m && nc + dir[1] >= 0 && nc + dir[1] < n
                && maze[nr + dir[0]][nc + dir[1]] == 0) {
                nr += dir[0]; nc += dir[1]; steps++;
            }
            if (d + steps < dist[nr][nc]) {
                dist[nr][nc] = d + steps;
                pq.offer(new int[]{nr, nc, d + steps});
            }
        }
    }
    return dist[dest[0]][dest[1]] == Integer.MAX_VALUE ? -1 : dist[dest[0]][dest[1]];
}`,
        lang: 'java',
        complexityVi: 'Time O(m × n × max(m, n) × log(m × n)) · Space O(m × n).',
        explanationVi: 'Mỗi "neighbor" = chỗ ball dừng sau khi lăn. Inner while: lăn đến đụng tường. Edge weight = số ô lăn.'
      }
    },
    {
      id: 'p6', title: 'Path with Maximum Probability', difficulty: 'Medium', url: LC('path-with-maximum-probability'),
      hint: 'Dijkstra với max-heap.',
      hints: [
        'Câu hỏi 1: Tìm MAX probability — đảo Dijkstra (max-heap). Probability path = product.',
        'Câu hỏi 2: Relax: <code>prob[v] = max(prob[v], prob[u] × edgeProb)</code>.'
      ],
      solution: {
        code: `public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
    List<List<double[]>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int i = 0; i < edges.length; i++) {
        adj.get(edges[i][0]).add(new double[]{edges[i][1], succProb[i]});
        adj.get(edges[i][1]).add(new double[]{edges[i][0], succProb[i]});
    }
    double[] prob = new double[n];
    prob[start] = 1.0;
    PriorityQueue<double[]> pq = new PriorityQueue<>((a, b) -> Double.compare(b[1], a[1]));
    pq.offer(new double[]{start, 1.0});
    while (!pq.isEmpty()) {
        double[] cur = pq.poll();
        int u = (int) cur[0];
        double p = cur[1];
        if (u == end) return p;
        if (p < prob[u]) continue;
        for (double[] e : adj.get(u)) {
            int v = (int) e[0];
            double np = p * e[1];
            if (np > prob[v]) {
                prob[v] = np;
                pq.offer(new double[]{v, np});
            }
        }
    }
    return 0;
}`,
        lang: 'java',
        complexityVi: 'Time O((V + E) log V) · Space O(V + E).',
        explanationVi: 'Max-heap by probability. Product (×) thay sum. Early return khi pop end (greedy guarantee).'
      }
    },
    {
      id: 'p7', title: 'Min Cost to Connect All Points', difficulty: 'Medium', url: LC('min-cost-to-connect-all-points'),
      hint: 'MST Prim/Kruskal.',
      hints: [
        'Câu hỏi 1: Tìm MST. Edge weight = Manhattan distance. Build full graph O(n²) edges.',
        'Câu hỏi 2: Prim với heap nhanh cho dense graph. Kruskal cũng work — sort edges + UF.'
      ],
      solution: {
        code: `public int minCostConnectPoints(int[][] points) {
    int n = points.length;
    boolean[] inMST = new boolean[n];
    int[] minDist = new int[n];
    Arrays.fill(minDist, Integer.MAX_VALUE);
    minDist[0] = 0;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int u = -1, best = Integer.MAX_VALUE;
        for (int j = 0; j < n; j++) {
            if (!inMST[j] && minDist[j] < best) {
                u = j; best = minDist[j];
            }
        }
        inMST[u] = true;
        total += best;
        for (int j = 0; j < n; j++) {
            if (!inMST[j]) {
                int d = Math.abs(points[u][0] - points[j][0]) + Math.abs(points[u][1] - points[j][1]);
                minDist[j] = Math.min(minDist[j], d);
            }
        }
    }
    return total;
}`,
        lang: 'java',
        complexityVi: 'Time O(n²) · Space O(n).',
        explanationVi: 'Prim O(V²) — không heap, đơn giản. Cho dense graph (n²/2 edges) thì O(V²) tốt hơn O(E log V).'
      }
    },
    {
      id: 'p8', title: 'Connecting Cities With Min Cost', difficulty: 'Medium', url: LC('connecting-cities-with-minimum-cost'),
      hint: 'Kruskal.',
      hints: [
        'Câu hỏi 1: Sort edges by cost, greedy union nếu chưa connected. Total = sum.',
        'Câu hỏi 2: Cuối: check components == 1 → -1 nếu không.'
      ],
      solution: {
        code: `public int minimumCost(int n, int[][] connections) {
    Arrays.sort(connections, (a, b) -> a[2] - b[2]);
    int[] parent = new int[n + 1];
    for (int i = 0; i <= n; i++) parent[i] = i;
    int total = 0, edges = 0;
    for (int[] c : connections) {
        if (union(parent, c[0], c[1])) {
            total += c[2];
            edges++;
        }
    }
    return edges == n - 1 ? total : -1;
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
        complexityVi: 'Time O(E log E) · Space O(V).',
        explanationVi: 'Kruskal classic. Sort edges, union-find, count edges thành công. MST size = V-1 → check.'
      }
    },
    {
      id: 'p9', title: 'Find City With Smallest Neighbors', difficulty: 'Medium', url: LC('find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance'),
      hint: 'Floyd-Warshall.',
      hints: [
        'Câu hỏi 1: All-pairs SP với V ≤ 100 → Floyd-Warshall O(V³) đủ nhanh.',
        'Câu hỏi 2: Sau Floyd, count city có dist ≤ threshold cho mỗi city. Min count → tie-break by city number max.'
      ],
      solution: {
        code: `public int findTheCity(int n, int[][] edges, int distanceThreshold) {
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE / 2);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) {
        dist[e[0]][e[1]] = e[2];
        dist[e[1]][e[0]] = e[2];
    }
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
    int best = Integer.MAX_VALUE, ans = -1;
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) if (i != j && dist[i][j] <= distanceThreshold) count++;
        if (count <= best) { best = count; ans = i; }
    }
    return ans;
}`,
        lang: 'java',
        complexityVi: 'Time O(V³) · Space O(V²).',
        explanationVi: 'Floyd-Warshall classic. DP: dist[i][j] qua intermediate k. Tie-break "city with max number" → dùng <code>&lt;=</code> để overwrite với i lớn hơn.'
      }
    },
    {
      id: 'p10', title: 'Reachable Nodes With Restrictions', difficulty: 'Medium', url: LC('reachable-nodes-with-restrictions'),
      hint: 'BFS/DFS với skip set.',
      hints: [
        'Câu hỏi 1: BFS từ 0, skip nodes trong restricted set.',
        'Câu hỏi 2: Build adj list trên undirected tree (mỗi edge 2 chiều).'
      ],
      solution: {
        code: `public int reachableNodes(int n, int[][] edges, int[] restricted) {
    Set<Integer> rest = new HashSet<>();
    for (int r : restricted) rest.add(r);
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    boolean[] visited = new boolean[n];
    Deque<Integer> q = new ArrayDeque<>();
    q.offer(0); visited[0] = true;
    int count = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        count++;
        for (int v : adj.get(u)) {
            if (!visited[v] && !rest.contains(v)) {
                visited[v] = true;
                q.offer(v);
            }
        }
    }
    return count;
}`,
        lang: 'java',
        complexityVi: 'Time O(V + E) · Space O(V + E).',
        explanationVi: 'BFS classic + skip restricted. Adj list cho tree undirected. Count nodes BFS reach được.'
      }
    }
  ],
  references: [
    { title: 'Dijkstra algorithm (CP-Algorithms)', url: 'https://cp-algorithms.com/graph/dijkstra.html' },
    { title: 'Bellman-Ford (CP-Algorithms)', url: 'https://cp-algorithms.com/graph/bellman_ford.html' },
    { title: 'MST: Kruskal vs Prim', url: 'https://cp-algorithms.com/graph/mst_kruskal.html' }
  ]

}
