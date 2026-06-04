// Module 3.0 — SQL Foundation Deep Dive (PRE-requisite trước khi học JPA)
// Mục đích: trước khi ORM ẩn SQL đi, bạn phải tự viết được SQL ngon.
export default {
  id: 'mod-3-0',
  title: 'SQL Foundation Deep Dive — Hiểu SQL trước khi JPA ẩn nó đi',
  prerequisites: { vi: 'Hoàn thành <strong>Phase 0+1</strong>. Có kiến thức cơ bản về database (table, row, column).' },
  lessons: [
    {
      id: 'l-3-0-1',
      type: 'theory',
      title: 'SQL Mental Model — Relational Algebra, không phải "ngôn ngữ truy vấn"',
      subtitle: { vi: 'SQL khác mọi ngôn ngữ bạn biết. Nó là <strong>declarative</strong>: bạn nói cái CẦN, DB engine tự tìm cách lấy.' },
      mentalModel: {
        vi: `Hình dung mỗi bảng là một <strong>set các row</strong>. SQL operations là các phép trên set:
<ul>
  <li><strong>SELECT</strong>: project columns (giữ cột nào).</li>
  <li><strong>WHERE</strong>: filter rows (giữ row nào).</li>
  <li><strong>JOIN</strong>: combine 2 set theo điều kiện.</li>
  <li><strong>GROUP BY</strong>: partition set thành các nhóm.</li>
  <li><strong>ORDER BY</strong>: sắp xếp output.</li>
</ul>
SQL = <em>relational algebra</em> (Codd 1970). Bạn KHÔNG bảo "vòng for qua mỗi row" — bạn bảo "tôi muốn set thoả điều kiện X". DB engine có optimizer tự chọn index, join order, parallel.`
      },
      underTheHood: {
        vi: `<h3>Thứ tự execution KHÁC thứ tự viết</h3>
SQL viết theo thứ tự: <code>SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT</code>
<br/>
Engine thực thi theo thứ tự:
<ol>
  <li><code>FROM</code> + <code>JOIN</code> — xác định bảng nguồn.</li>
  <li><code>WHERE</code> — filter rows.</li>
  <li><code>GROUP BY</code> — gom nhóm.</li>
  <li><code>HAVING</code> — filter sau group.</li>
  <li><code>SELECT</code> — chọn cột (và compute expression).</li>
  <li><code>DISTINCT</code> — bỏ duplicate.</li>
  <li><code>ORDER BY</code> — sort.</li>
  <li><code>LIMIT/OFFSET</code> — lấy slice.</li>
</ol>
Đây là lý do WHERE KHÔNG dùng được alias SELECT (alias chưa tồn tại lúc WHERE chạy).

<h3>Index — bí mật của tốc độ</h3>
<ul>
  <li>Bảng 10 triệu row + không index + WHERE x = 5 → <strong>full scan</strong> O(N).</li>
  <li>Index B-Tree trên cột x → <strong>O(log N)</strong>. Nhưng INDEX TỐN DISK + chậm INSERT.</li>
  <li>Index trên PK + FK là MIẶC ĐỊNH. Cột WHERE thường xuyên → add index.</li>
  <li><code>EXPLAIN ANALYZE SELECT ...</code> cho biết engine dùng index hay scan.</li>
</ul>

<h3>NULL — không phải "trống", là "không biết"</h3>
<ul>
  <li><code>WHERE col = NULL</code> SAI — luôn UNKNOWN. Phải <code>WHERE col IS NULL</code>.</li>
  <li><code>NULL + 5 = NULL</code>. <code>NULL = NULL</code> trả NULL (không TRUE).</li>
  <li>Aggregate (COUNT, SUM) bỏ qua NULL — trừ <code>COUNT(*)</code> đếm cả row có NULL.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao học SQL thẳng trước khi học JPA?</h3>
<ul>
  <li><strong>JPA generate SQL dở</strong> nếu bạn không kiểm soát được. N+1 query là pitfall #1 của JPA — bạn không phát hiện được nếu không đọc được SQL log.</li>
  <li><strong>Optimizer trong SQL = real magic</strong>. JPA không thay thế được — chỉ wrap. Index + EXPLAIN là kỹ năng SQL, không phải JPA.</li>
  <li><strong>Phỏng vấn backend</strong> — câu hỏi SQL chiếm 30%. JOIN, GROUP BY, window function là must-know.</li>
  <li><strong>Analytics, reporting</strong> — không dùng được JPA. Phải SQL raw.</li>
</ul>

<h3>Setup học SQL</h3>
<ul>
  <li>Cài <code>PostgreSQL 16</code> qua Docker (lesson 3.1.2). Hoặc dùng pgAdmin trên cloud.</li>
  <li>Tự seed 3 bảng: <code>users(id, name, email, country)</code>, <code>products(id, name, price, category_id)</code>, <code>orders(id, user_id, product_id, quantity, created_at)</code>.</li>
  <li>Insert ~ 100 row mỗi bảng để test JOIN/GROUP BY có sense.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>SELECT *</strong> trong production query → trả nhiều cột thừa, tốn network + RAM. Liệt kê cột cụ thể.</li>
  <li><strong>Quên WHERE trong UPDATE/DELETE</strong> → cả bảng bị sửa/xoá. ALWAYS test bằng SELECT trước.</li>
  <li><strong>Implicit JOIN</strong> (<code>FROM a, b WHERE a.id = b.aid</code>) → khó đọc, dễ quên condition → CROSS JOIN ngầm. Dùng <code>JOIN ... ON</code> explicit.</li>
  <li><strong>NULL = NULL</strong> nhầm là TRUE → query trả 0 row. Dùng <code>IS NULL</code>.</li>
  <li><strong>SELECT count(*) FROM huge_table</strong> mỗi request → chậm. Cache hoặc đếm sample.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Tự suy luận trước khi đọc tài liệu',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Tại sao <code>WHERE</code> chạy TRƯỚC <code>SELECT</code> dù viết sau? (Logic: filter row trước rồi mới chọn cột — ngược lại sẽ thừa.)
2. Index làm INSERT chậm — tại sao? (B-Tree phải rebalance.)
3. <code>NULL + 5 = ?</code>. Vì sao kết quả thế? (Three-valued logic.)
4. Một query trên bảng 10 triệu row mất 30 giây — bạn check gì TRƯỚC? (EXPLAIN, index, WHERE selectivity.)`
        }
      ],
      keyTakeaways: {
        vi: [
          'SQL là declarative — bảo CẦN gì, engine lo CÁCH.',
          'Execution order khác viết order: FROM → WHERE → GROUP → SELECT → ORDER.',
          'Index B-Tree giảm O(N) xuống O(log N) nhưng tốn disk + chậm INSERT.',
          'NULL ≠ "trống" — là "không biết". So sánh bằng <code>IS NULL</code>.',
          'Học SQL THẲNG trước JPA — JPA chỉ wrap, không thay thế.'
        ]
      }
    },

    {
      id: 'l-3-0-2',
      type: 'practice',
      title: 'JOIN Deep Dive — INNER / LEFT / RIGHT / FULL / SELF',
      subtitle: { vi: 'JOIN là chỗ 80% bug SQL của junior. Bài này đào tận gốc.' },
      mentalModel: {
        vi: `JOIN ghép 2 bảng theo điều kiện match. 5 loại quan trọng:
<ul>
  <li><strong>INNER JOIN</strong>: chỉ row có match ở CẢ 2 bảng.</li>
  <li><strong>LEFT JOIN</strong>: mọi row bảng trái + match bảng phải (NULL nếu không match).</li>
  <li><strong>RIGHT JOIN</strong>: ngược LEFT (ít dùng — swap bảng + LEFT cho dễ đọc).</li>
  <li><strong>FULL OUTER JOIN</strong>: mọi row 2 bên, fill NULL nếu thiếu.</li>
  <li><strong>SELF JOIN</strong>: bảng join với chính nó (vd employee-manager).</li>
</ul>
Quy tắc nhớ: <em>"LEFT giữ trái, INNER giữ chung, FULL giữ tất cả"</em>.`
      },
      theory: {
        vi: `<h3>Schema mẫu</h3>
<pre>users         orders
id|name       id|user_id|product
1 |Alice      101|1|Book
2 |Bob        102|1|Pen
3 |Charlie    103|2|Notebook
                       (Charlie chưa order)
                       (orders 104 user_id=99 - không có user)</pre>

<h3>5 loại JOIN — kết quả khác nhau ra sao</h3>

<strong>INNER JOIN</strong> (chỉ match):
<pre>SELECT u.name, o.product
FROM users u
INNER JOIN orders o ON o.user_id = u.id;

-- Alice|Book
-- Alice|Pen
-- Bob  |Notebook
-- (Charlie không có order → bỏ; order 104 không có user → bỏ)</pre>

<strong>LEFT JOIN</strong> (giữ tất cả users):
<pre>SELECT u.name, o.product
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;

-- Alice  |Book
-- Alice  |Pen
-- Bob    |Notebook
-- Charlie|NULL  ← giữ Charlie, product NULL</pre>

<strong>RIGHT JOIN</strong> (giữ tất cả orders):
<pre>SELECT u.name, o.product
FROM users u
RIGHT JOIN orders o ON o.user_id = u.id;

-- Alice|Book
-- Alice|Pen
-- Bob  |Notebook
-- NULL |??? (order 104)  ← user_id=99 không match user nào</pre>

<strong>FULL OUTER JOIN</strong> (giữ cả 2):
<pre>SELECT u.name, o.product
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;

-- Alice  |Book
-- Alice  |Pen
-- Bob    |Notebook
-- Charlie|NULL
-- NULL   |??? (order 104)</pre>

<strong>SELF JOIN</strong> — employees(id, name, manager_id):
<pre>SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>JOIN không ON</strong> → CROSS JOIN (Cartesian product). Bảng 1000 × 1000 = 1 triệu row.</li>
  <li><strong>WHERE thay cho ON trong LEFT JOIN</strong>: <code>LEFT JOIN o ON true WHERE o.user_id = u.id</code> → equivalent INNER JOIN (lọc bỏ NULL).</li>
  <li><strong>Lặp row sau JOIN</strong>: nếu 1 user có 3 orders → user xuất hiện 3 lần. Cần <code>DISTINCT</code> hoặc <code>GROUP BY</code>.</li>
  <li><strong>COUNT(o.id) vs COUNT(*) sau LEFT JOIN</strong>: <code>COUNT(*)</code> đếm cả row NULL (Charlie); <code>COUNT(o.id)</code> bỏ qua NULL.</li>
  <li><strong>JOIN 5+ bảng không có index trên FK</strong> → query chết.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Users có/không order',
          prompt: 'Schema: <code>users(id, name)</code>, <code>orders(id, user_id, product, created_at)</code>. Query 1: liệt kê tất cả users + product họ order (LEFT JOIN). Query 2: liệt kê users CHƯA TỪNG order.',
          hints: [
            'Query 1: <code>LEFT JOIN ... ON</code>.',
            'Query 2: filter <code>WHERE o.id IS NULL</code> sau LEFT JOIN.'
          ],
          solution: {
            code: `-- Q1: All users + their orders (NULL nếu chưa order)
SELECT u.name, o.product
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
ORDER BY u.name;

-- Q2: Users chưa từng order
SELECT u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
            lang: 'sql',
            complexityVi: 'O(N+M) với index trên user_id. Không index → O(N×M).',
            explanationVi: 'LEFT JOIN giữ mọi user; WHERE o.id IS NULL lọc ra user không match → đây là pattern "anti-join". Cách khác: <code>WHERE u.id NOT IN (SELECT user_id FROM orders)</code> nhưng có thể chậm hơn + cẩn thận NULL.'
          }
        },
        {
          title: 'Tổng order mỗi user (kể cả user 0 đơn)',
          prompt: 'Trả về <code>name, total_orders</code>. Users 0 đơn → total = 0, không bỏ qua.',
          hints: [
            'LEFT JOIN + GROUP BY u.id.',
            'COUNT(o.id) NOT COUNT(*) — để 0 đơn trả 0.'
          ],
          solution: {
            code: `SELECT u.name, COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total_orders DESC, u.name;`,
            lang: 'sql',
            complexityVi: 'O((N+M) log N) với index. Group + sort.',
            explanationVi: '<code>COUNT(*)</code> sẽ đếm cả row "Charlie | NULL" thành 1 đơn (sai). <code>COUNT(o.id)</code> bỏ qua NULL → đúng. Phải GROUP BY cả id + name (PostgreSQL strict mode).'
          }
        },
        {
          title: 'Self-join: employees + manager name',
          prompt: 'Schema: <code>employees(id, name, manager_id)</code> (manager_id là FK trỏ về cùng bảng). Liệt kê <code>employee, manager_name</code>. CEO (manager_id NULL) hiện "—".',
          hints: [
            'Alias cùng bảng 2 lần: <code>e</code> cho employee, <code>m</code> cho manager.',
            "LEFT JOIN để giữ CEO. <code>COALESCE(m.name, '—')</code> thay NULL."
          ],
          solution: {
            code: `SELECT
  e.name AS employee,
  COALESCE(m.name, '—') AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;`,
            lang: 'sql',
            complexityVi: 'O(N log N) với index trên id.',
            explanationVi: 'SELF JOIN dùng alias để phân biệt 2 "phiên bản" của cùng bảng. LEFT JOIN giữ CEO. COALESCE trả giá trị đầu tiên không NULL.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          'LEFT JOIN giữ trái, INNER giữ chung, FULL giữ tất cả.',
          'WHERE sau LEFT JOIN → có thể biến thành INNER. Đặt condition trong ON nếu muốn giữ NULL.',
          'COUNT(col) bỏ qua NULL; COUNT(*) đếm tất.',
          'Anti-join pattern: <code>LEFT JOIN ... WHERE other.id IS NULL</code> để tìm "không có".'
        ]
      }
    },

    {
      id: 'l-3-0-3',
      type: 'practice',
      title: 'Subquery & CTE — Query trong query',
      subtitle: { vi: 'Khi 1 SELECT không đủ. CTE (WITH) làm query phức tạp đọc được.' },
      mentalModel: {
        vi: `<strong>Subquery</strong>: query lồng trong query. 3 vị trí:
<ul>
  <li><strong>SELECT</strong> (scalar subquery — trả 1 giá trị): <code>SELECT name, (SELECT count(*) FROM orders o WHERE o.user_id = u.id) AS total FROM users u;</code></li>
  <li><strong>FROM</strong> (derived table): <code>SELECT ... FROM (SELECT ...) AS t;</code></li>
  <li><strong>WHERE</strong> (filter): <code>WHERE id IN (SELECT ...)</code> hoặc <code>WHERE EXISTS (SELECT 1 ...)</code>.</li>
</ul>

<strong>CTE (Common Table Expression)</strong> = WITH clause = named subquery, đọc trên xuống dưới.`
      },
      theory: {
        vi: `<h3>Subquery vs CTE — chọn cái nào?</h3>
<ul>
  <li><strong>Subquery</strong>: ngắn, dùng 1 lần. Nested deep → khó đọc.</li>
  <li><strong>CTE</strong>: clearer khi nhiều bước. Reuse được trong query. Recursive CTE giải graph/tree.</li>
</ul>

<h3>4 dạng subquery</h3>
<strong>Scalar subquery</strong> (trả 1 row × 1 col):
<pre>SELECT name,
       (SELECT MAX(salary) FROM employees) AS top_salary
FROM employees;</pre>

<strong>Correlated subquery</strong> (subquery ref outer):
<pre>SELECT e.name
FROM employees e
WHERE e.salary &gt; (
  SELECT AVG(salary)
  FROM employees
  WHERE department_id = e.department_id   -- ref outer e
);
-- Lương cao hơn avg department của họ</pre>

<strong>IN / EXISTS</strong>:
<pre>-- IN: simple, nhưng NULL gây bug
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders);

-- EXISTS: optimizer thường tốt hơn cho large set
SELECT name FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);</pre>

<strong>CTE syntax</strong>:
<pre>WITH high_value_orders AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  GROUP BY user_id
  HAVING SUM(amount) &gt; 1000000
),
vip_users AS (
  SELECT u.id, u.name, hvo.total
  FROM users u
  JOIN high_value_orders hvo ON hvo.user_id = u.id
)
SELECT * FROM vip_users WHERE name LIKE 'A%';</pre>

<h3>Recursive CTE — đi qua tree/graph</h3>
<pre>-- Liệt kê tất cả cấp dưới của manager_id = 1
WITH RECURSIVE subordinates AS (
  SELECT id, name, manager_id
  FROM employees WHERE id = 1            -- anchor
  UNION ALL
  SELECT e.id, e.name, e.manager_id
  FROM employees e
  JOIN subordinates s ON e.manager_id = s.id   -- recurse
)
SELECT * FROM subordinates;</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>IN với NULL</strong>: <code>WHERE x NOT IN (1, 2, NULL)</code> trả 0 row LUÔN (vì NULL = UNKNOWN). Dùng NOT EXISTS.</li>
  <li><strong>Correlated subquery trong SELECT</strong>: chạy 1 lần mỗi row outer → chậm với N lớn. Thay bằng JOIN.</li>
  <li><strong>CTE materialization</strong>: trong PostgreSQL ≤ 11, CTE bị materialize (lưu tạm) → có thể chậm hơn subquery. PG 12+ tự inline.</li>
  <li><strong>Recursive CTE infinite loop</strong>: thiếu base case hoặc cycle trong data → loop. Add <code>LIMIT</code> để safety.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Lương cao hơn AVG department (correlated subquery)',
          prompt: 'Liệt kê tên + lương + dept_id của nhân viên có lương &gt; lương trung bình của department họ.',
          hints: [
            'Correlated: subquery ref <code>e.department_id</code> từ outer.',
            'Alternative: window function — sẽ học bài sau.'
          ],
          solution: {
            code: `SELECT e.name, e.salary, e.department_id
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department_id = e.department_id
)
ORDER BY e.department_id, e.salary DESC;`,
            lang: 'sql',
            complexityVi: 'O(N²) nếu không tối ưu (subquery chạy mỗi outer row). Optimizer hiện đại biết rewrite thành GROUP BY.',
            explanationVi: 'Correlated subquery — chạy 1 lần cho mỗi row outer e. Nếu N=10000 → 10000 subquery. Optimizer thường rewrite thành JOIN với agg precomputed. Window function (lesson 5) viết clean hơn.'
          }
        },
        {
          title: 'Top 3 sản phẩm bán chạy nhất mỗi category (CTE)',
          prompt: 'Schema: <code>products(id, name, category_id)</code>, <code>orders(id, product_id, quantity)</code>. Lấy 3 sản phẩm có tổng quantity cao nhất trong MỖI category.',
          hints: [
            'CTE 1: sum quantity per product. CTE 2: rank within category.',
            'Hoặc window function ROW_NUMBER (sẽ học bài sau).'
          ],
          solution: {
            code: `WITH product_sales AS (
  SELECT p.id, p.name, p.category_id,
         COALESCE(SUM(o.quantity), 0) AS total_qty
  FROM products p
  LEFT JOIN orders o ON o.product_id = p.id
  GROUP BY p.id, p.name, p.category_id
),
ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY category_id
    ORDER BY total_qty DESC
  ) AS rnk
  FROM product_sales
)
SELECT category_id, name, total_qty
FROM ranked
WHERE rnk <= 3
ORDER BY category_id, rnk;`,
            lang: 'sql',
            complexityVi: 'O(N log N) cho group + window.',
            explanationVi: 'CTE 1 tính tổng. CTE 2 rank within category bằng <code>ROW_NUMBER() OVER (PARTITION BY ...)</code>. Final filter rnk ≤ 3. Đây là pattern <em>top-N-per-group</em> kinh điển.'
          }
        },
        {
          title: 'Recursive CTE: tất cả subordinates của 1 manager',
          prompt: '<code>employees(id, name, manager_id)</code>. Cho manager_id = 1, in tất cả nhân viên cấp dưới (direct + indirect), kèm depth.',
          hints: [
            'Anchor: manager_id = 1 (direct reports).',
            'Recurse: ai có manager_id = id của row trong CTE.'
          ],
          solution: {
            code: `WITH RECURSIVE subs AS (
  -- Anchor: direct reports of manager 1
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id = 1

  UNION ALL

  -- Recurse: reports of reports
  SELECT e.id, e.name, e.manager_id, s.depth + 1
  FROM employees e
  JOIN subs s ON e.manager_id = s.id
)
SELECT * FROM subs ORDER BY depth, id;`,
            lang: 'sql',
            complexityVi: 'O(N + E) với E = số edge trong tree.',
            explanationVi: 'Anchor query định nghĩa "tầng 1". Recursive part join CTE với chính bảng để mở rộng. UNION ALL giữ duplicate (KHÔNG UNION). Depth tăng theo level. Thiếu UNION ALL hoặc thiếu join condition → infinite loop.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          'Subquery 3 vị trí: SELECT (scalar), FROM (derived), WHERE (filter).',
          'CTE (WITH) cho readability — không nhanh hơn subquery về performance (PG 12+ inline).',
          'NOT IN + NULL → 0 row. Dùng NOT EXISTS.',
          'Recursive CTE giải tree/graph. Anchor + UNION ALL + recursive part.'
        ]
      }
    },

    {
      id: 'l-3-0-4',
      type: 'practice',
      title: 'GROUP BY + Aggregate + HAVING — Analytics cơ bản',
      subtitle: { vi: 'Mọi báo cáo, dashboard, KPI đều dựa GROUP BY. Phải thành thạo.' },
      mentalModel: {
        vi: `<strong>GROUP BY</strong> = partition bảng thành các "buckets" theo cột. Mỗi bucket sau đó được aggregate (COUNT, SUM, AVG, MIN, MAX).
<br/><br/>
Quy tắc: trong SELECT, mọi cột KHÔNG phải aggregate PHẢI có trong GROUP BY. Lý do: 1 bucket có nhiều row → engine không biết chọn row nào nếu cột không group.`
      },
      theory: {
        vi: `<h3>Aggregate functions cốt lõi</h3>
<ul>
  <li><code>COUNT(*)</code> — số row.</li>
  <li><code>COUNT(col)</code> — số row có col NOT NULL.</li>
  <li><code>COUNT(DISTINCT col)</code> — số giá trị unique.</li>
  <li><code>SUM, AVG, MIN, MAX</code> — bỏ qua NULL.</li>
  <li><code>STRING_AGG(col, ',')</code> (PG) — concat string trong group.</li>
  <li><code>ARRAY_AGG(col)</code> (PG) — collect vào array.</li>
</ul>

<h3>WHERE vs HAVING</h3>
<ul>
  <li><strong>WHERE</strong>: filter BEFORE group — không thấy aggregate.</li>
  <li><strong>HAVING</strong>: filter AFTER group — có thể ref aggregate.</li>
</ul>
<pre>-- ĐÚNG: filter user trước, group sau
SELECT user_id, COUNT(*) AS cnt
FROM orders
WHERE created_at &gt;= '2025-01-01'
GROUP BY user_id
HAVING COUNT(*) &gt; 5;

-- SAI: WHERE không ref được aggregate
WHERE COUNT(*) &gt; 5   -- ERROR</pre>

<h3>GROUPING SETS, ROLLUP, CUBE (advanced)</h3>
<pre>-- Tổng theo dept + tổng cả công ty trong 1 query
SELECT
  COALESCE(department, 'ALL') AS dept,
  SUM(salary) AS total
FROM employees
GROUP BY ROLLUP(department);</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>SELECT non-grouped column</strong>: <code>SELECT user_id, product, COUNT(*) FROM orders GROUP BY user_id</code> → ERROR. <code>product</code> không group + không aggregate.</li>
  <li><strong>COUNT(*) vs COUNT(col)</strong> sau LEFT JOIN: COUNT(*) đếm cả NULL → kết quả sai cho "đếm match".</li>
  <li><strong>HAVING không cần GROUP BY</strong>: filter aggregate trên toàn bảng. <code>SELECT SUM(amount) FROM orders HAVING SUM(amount) &gt; 1M</code>.</li>
  <li><strong>AVG trên int → trunc</strong>: <code>AVG(quantity)</code> nếu quantity int có thể trả int trong vài DB. Cast: <code>AVG(quantity::numeric)</code>.</li>
  <li><strong>GROUP BY trên cột có NULL</strong>: tất cả NULL gom thành 1 nhóm — đôi khi không mong muốn.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Doanh thu mỗi tháng năm 2025',
          prompt: 'Schema: <code>orders(id, user_id, amount, created_at)</code>. In tháng + tổng doanh thu (sắp xếp theo tháng).',
          hints: [
            "Group by month: <code>DATE_TRUNC('month', created_at)</code> (Postgres).",
            'WHERE để filter năm 2025.'
          ],
          solution: {
            code: `SELECT
  DATE_TRUNC('month', created_at)::date AS month,
  SUM(amount) AS revenue,
  COUNT(*) AS order_count
FROM orders
WHERE created_at >= '2025-01-01'
  AND created_at <  '2026-01-01'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;`,
            lang: 'sql',
            complexityVi: 'O(N log G) với G = số group. Index trên created_at giúp WHERE.',
            explanationVi: "<code>DATE_TRUNC('month', x)</code> trả về date của ngày 1 tháng đó → group theo tháng. WHERE dùng range (KHÔNG <code>EXTRACT(YEAR ...)</code>) để optimizer dùng index."
          }
        },
        {
          title: 'Top 5 user chi nhiều nhất, có ít nhất 3 đơn',
          prompt: 'Liệt kê top 5 user có tổng amount cao nhất, NHƯNG chỉ tính user có ≥ 3 đơn.',
          hints: [
            'HAVING COUNT(*) ≥ 3.',
            'ORDER BY total DESC + LIMIT 5.'
          ],
          solution: {
            code: `SELECT
  u.id, u.name,
  COUNT(o.id) AS order_count,
  SUM(o.amount) AS total_spent
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
HAVING COUNT(o.id) >= 3
ORDER BY total_spent DESC
LIMIT 5;`,
            lang: 'sql',
            complexityVi: 'O(N log N) — group + sort + limit.',
            explanationVi: 'INNER JOIN (không LEFT) vì cần user CÓ đơn (≥ 3). HAVING lọc sau group — không thể đưa vào WHERE. ORDER BY + LIMIT chọn top 5 cuối cùng.'
          }
        },
        {
          title: 'String_agg: list sản phẩm mỗi đơn',
          prompt: 'Schema: <code>order_items(order_id, product_name)</code>. In mỗi order kèm danh sách sản phẩm (comma-separated).',
          hints: [
            "PG: <code>STRING_AGG(product_name, ', ' ORDER BY product_name)</code>.",
            'MySQL: <code>GROUP_CONCAT</code>.'
          ],
          solution: {
            code: `SELECT
  order_id,
  COUNT(*) AS item_count,
  STRING_AGG(product_name, ', ' ORDER BY product_name) AS products
FROM order_items
GROUP BY order_id
ORDER BY order_id;`,
            lang: 'sql',
            complexityVi: 'O(N log N).',
            explanationVi: 'STRING_AGG là aggregate đặc biệt — concat string trong group, có optional ORDER BY. Application: log, report, deduplicate names. ARRAY_AGG return array nếu cần xử lý tiếp.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          'GROUP BY = partition + aggregate.',
          'Mọi cột non-aggregate trong SELECT phải có trong GROUP BY.',
          'WHERE filter row trước group; HAVING filter sau group + dùng aggregate.',
          'DATE_TRUNC để group theo time bucket — KHÔNG break index.'
        ]
      }
    },

    {
      id: 'l-3-0-5',
      type: 'practice',
      title: 'Window Functions — Rank, Running Total, Lag/Lead',
      subtitle: { vi: 'Window functions là "GROUP BY mà không lose row". Đây là điểm break-through từ junior lên mid-level SQL.' },
      mentalModel: {
        vi: `Khác với GROUP BY (gom row lại → ít row hơn), <strong>window function</strong> tính aggregate "qua một cửa sổ row" mà KHÔNG gom — mỗi row giữ nguyên + có thêm cột computed.
<br/><br/>
Ví dụ: muốn rank lương trong department NHƯNG vẫn giữ tất cả row → GROUP BY không làm được. Window function: <code>RANK() OVER (PARTITION BY dept ORDER BY salary DESC)</code>.`
      },
      theory: {
        vi: `<h3>Syntax</h3>
<pre>function() OVER (
  [PARTITION BY col1, col2]    -- chia cửa sổ theo nhóm
  [ORDER BY col3]              -- thứ tự trong cửa sổ
  [ROWS BETWEEN ...]           -- frame: row nào tính
)</pre>

<h3>3 nhóm window functions</h3>

<strong>1) Ranking</strong>:
<ul>
  <li><code>ROW_NUMBER()</code> — số thứ tự, không trùng (1,2,3,4).</li>
  <li><code>RANK()</code> — trùng có gap (1,2,2,4).</li>
  <li><code>DENSE_RANK()</code> — trùng không gap (1,2,2,3).</li>
  <li><code>NTILE(4)</code> — chia 4 nhóm bằng nhau (quartile).</li>
</ul>

<strong>2) Aggregate over window</strong>:
<ul>
  <li><code>SUM() OVER (...)</code> — running total.</li>
  <li><code>AVG() OVER (...)</code> — moving average.</li>
  <li><code>COUNT() OVER (...)</code> — running count.</li>
</ul>

<strong>3) Position</strong>:
<ul>
  <li><code>LAG(col, n)</code> — giá trị col của row trước n.</li>
  <li><code>LEAD(col, n)</code> — row sau n.</li>
  <li><code>FIRST_VALUE(col)</code>, <code>LAST_VALUE(col)</code> — đầu/cuối frame.</li>
</ul>

<h3>Ví dụ: rank lương trong department</h3>
<pre>SELECT
  name, department, salary,
  RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS d_rnk
FROM employees;

-- IT  | Alice  | 100 | 1 | 1
-- IT  | Bob    | 100 | 1 | 1   ← trùng
-- IT  | Carol  |  90 | 3 | 2   ← RANK skip 2, DENSE_RANK không
-- HR  | David  |  80 | 1 | 1   ← reset vì partition mới</pre>

<h3>Running total</h3>
<pre>SELECT
  created_at, amount,
  SUM(amount) OVER (ORDER BY created_at) AS running_total
FROM orders
ORDER BY created_at;</pre>

<h3>LAG: so sánh với row trước</h3>
<pre>-- Tăng/giảm doanh thu so với tháng trước
SELECT
  month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) AS diff
FROM monthly_revenue;</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>Window function trong WHERE</strong> → ERROR. Window chạy SAU WHERE. Wrap trong subquery/CTE để filter.</li>
  <li><strong>Frame mặc định khác nhau</strong>: với ORDER BY → <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. Không ORDER BY → toàn partition.</li>
  <li><strong>RANK với NULL</strong>: NULL gom thành 1 nhóm + rank cuối hoặc đầu tuỳ DB. Specify <code>NULLS FIRST/LAST</code>.</li>
  <li><strong>Performance</strong>: window function thường chậm hơn GROUP BY tương đương vì giữ all rows. Cân nhắc khi N lớn.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Top 3 nhân viên lương cao nhất mỗi department',
          prompt: 'Schema: <code>employees(id, name, department, salary)</code>. Trả top 3 lương cao nhất MỖI department (ties cùng rank ok).',
          hints: [
            'CTE với <code>DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)</code>.',
            'Filter rnk ≤ 3 ở outer.'
          ],
          solution: {
            code: `WITH ranked AS (
  SELECT
    id, name, department, salary,
    DENSE_RANK() OVER (
      PARTITION BY department ORDER BY salary DESC
    ) AS rnk
  FROM employees
)
SELECT department, name, salary
FROM ranked
WHERE rnk <= 3
ORDER BY department, salary DESC;`,
            lang: 'sql',
            complexityVi: 'O(N log N) — sort within partition.',
            explanationVi: 'DENSE_RANK để 2 người cùng lương đều được "top 3" (RANK sẽ skip vị trí kế tiếp, ROW_NUMBER chọn arbitrary 1 trong 2). Window function không filter được trực tiếp trong WHERE → wrap CTE.'
          }
        },
        {
          title: 'Running revenue per day',
          prompt: '<code>orders(created_at::date, amount)</code>. In: ngày, doanh thu ngày đó, doanh thu cộng dồn từ đầu kỳ.',
          hints: ['<code>SUM(amount) OVER (ORDER BY day)</code>.', 'Group by day trước, rồi window trên kết quả.'],
          solution: {
            code: `WITH daily AS (
  SELECT created_at::date AS day, SUM(amount) AS daily_revenue
  FROM orders
  GROUP BY created_at::date
)
SELECT
  day,
  daily_revenue,
  SUM(daily_revenue) OVER (ORDER BY day) AS cumulative_revenue
FROM daily
ORDER BY day;`,
            lang: 'sql',
            complexityVi: 'O(N log N).',
            explanationVi: 'CTE daily aggregate trước. Window SUM với ORDER BY tự dùng frame <code>UNBOUNDED PRECEDING → CURRENT ROW</code> → running total.'
          }
        },
        {
          title: 'So sánh tháng trước (LAG)',
          prompt: 'Schema: <code>monthly_sales(month, revenue)</code>. Trả: month, revenue, prev_month_revenue, pct_change.',
          hints: [
            '<code>LAG(revenue) OVER (ORDER BY month)</code>.',
            'pct_change = (curr - prev) / prev × 100. Cẩn thận chia 0.'
          ],
          solution: {
            code: `SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
  CASE
    WHEN LAG(revenue) OVER (ORDER BY month) IS NULL THEN NULL
    WHEN LAG(revenue) OVER (ORDER BY month) = 0 THEN NULL
    ELSE ROUND(
      (revenue - LAG(revenue) OVER (ORDER BY month))::numeric
      * 100.0 / LAG(revenue) OVER (ORDER BY month),
      2
    )
  END AS pct_change
FROM monthly_sales
ORDER BY month;`,
            lang: 'sql',
            complexityVi: 'O(N log N).',
            explanationVi: 'LAG trả NULL cho row đầu (không có row trước). CASE để handle NULL + chia 0. Cast numeric để pct_change có decimal. Trong production, dùng CTE để không repeat LAG 3 lần.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          'Window function = aggregate qua "cửa sổ" mà KHÔNG gom row.',
          'PARTITION BY giống GROUP BY nhưng giữ row. ORDER BY tạo running aggregate.',
          'RANK skip, DENSE_RANK không skip, ROW_NUMBER unique.',
          'LAG/LEAD so sánh với row trước/sau — power tool cho time-series.',
          'Window không filter được trong WHERE → wrap CTE.'
        ]
      }
    }
  ],
  references: [
    { title: 'PostgreSQL 16 -SELECT', url: 'https://www.postgresql.org/docs/16/sql-select.html' },
    { title: 'Use The Index, Luke (SQL indexing)', url: 'https://use-the-index-luke.com/' },
    { title: 'SQL JOIN visual explanation', url: 'https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/' },
    { title: 'Window Functions (PostgreSQL docs)', url: 'https://www.postgresql.org/docs/16/tutorial-window.html' }
  ]

}
