// Module 3.1 — Docker & PostgreSQL Foundations
export default {
  id: 'mod-3-1',
  title: 'Docker & PostgreSQL — Dựng hạ tầng local',
  prerequisites: { vi: 'Hoàn thành <code>Module 3.0 — SQL Foundation</code>. Đã cài Docker Desktop.' },
  lessons: [
    {
      id: 'l-3-1-1',
      type: 'theory',
      title: 'Docker — Container vs VM vs Host',
      subtitle: { vi: 'Hiểu CHÍNH XÁC Docker làm gì trước khi gõ lệnh.' },
      mentalModel: {
        vi: `Hình dung 3 cấp độ:
<ul>
  <li><strong>Host</strong>: OS bạn đang dùng (Windows/Mac/Linux). 1 kernel.</li>
  <li><strong>VM (VirtualBox/VMware)</strong>: máy ảo hoàn chỉnh — kernel riêng. Boot chậm, tốn RAM.</li>
  <li><strong>Container (Docker)</strong>: KHÔNG kernel riêng — chia sẻ kernel host nhưng có filesystem, network, process namespace cô lập. Boot trong giây.</li>
</ul>
<strong>Container = process bị "nhốt" trong sandbox</strong>. Bên trong: tưởng là root của một mini Linux. Bên ngoài: chỉ là 1 process trên host kernel.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Bản chất ngầm</h3>

<strong>1) Linux namespaces — cô lập "thấy" cái gì</strong>
Kernel feature: PID namespace (process tree riêng), Mount namespace (filesystem riêng), Network namespace (network stack riêng), UTS (hostname), IPC, User. Docker dùng 6 namespaces này để mỗi container "nhìn" thấy riêng — kể cả nó vẫn share kernel.
<br/><br/>
<strong>2) cgroups — giới hạn "dùng được" bao nhiêu</strong>
Control groups giới hạn CPU, RAM, IO per container. <code>docker run --memory=512m</code> map sang cgroup memory limit. KHÔNG ảo hóa tài nguyên — chỉ giới hạn cứng.
<br/><br/>
<strong>3) Union filesystem (overlay2)</strong>
Image layers chồng lên nhau. Mỗi layer = diff so với layer trước. Container "writable layer" trên cùng — thay đổi không lan xuống image. Nhiều container share cùng base image → tiết kiệm disk RAM.
<br/><br/>
<strong>4) Image vs Container</strong>
<ul>
<li><strong>Image</strong>: template READ-ONLY (vd <code>postgres:16-alpine</code>). Mỗi <code>RUN</code> trong Dockerfile = 1 layer.</li>
<li><strong>Container</strong>: instance đang chạy của image + 1 writable layer.</li>
</ul>
<br/><br/>
<strong>5) Layer caching</strong>
Docker reuse layer chưa thay đổi giữa các build. Đặt <code>COPY pom.xml</code> + <code>mvn dependency:resolve</code> TRƯỚC <code>COPY src/</code> — đổi code KHÔNG trigger rebuild dependency layer.
<br/><br/>
<strong>6) Volume vs Bind mount</strong>
<ul>
<li><strong>Volume</strong>: Docker quản lý (under <code>/var/lib/docker/volumes</code>). Persistent qua restart. Dùng cho DB data.</li>
<li><strong>Bind mount</strong>: trỏ thẳng vào folder host. Hot reload dev code.</li>
</ul>
<br/><br/>
<strong>7) Network — service discovery built-in</strong>
Container trong cùng docker network giao tiếp qua <strong>service name</strong> (vd <code>db:5432</code>) — KHÔNG cần biết IP. Docker DNS resolver lo việc đó.`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao Docker thay vì cài trực tiếp?</h3>
<ul>
  <li><strong>Reproducible</strong>: "works on my machine" biến mất. Image chạy giống nhau mọi env.</li>
  <li><strong>Isolated</strong>: Postgres 14 (project A) + Postgres 16 (project B) trên cùng máy, KHÔNG xung đột.</li>
  <li><strong>Disposable</strong>: <code>docker compose down -v</code> xóa sạch trong 2 giây. Build lại fresh trong 10 giây.</li>
  <li><strong>Shareable</strong>: team mới clone repo → <code>docker compose up</code> → có DB chạy.</li>
  <li><strong>Production parity</strong>: dev image ≈ staging ≈ prod. Tránh "bug only in prod".</li>
</ul>

<h3>Lệnh CẦN THUỘC</h3>
<ul>
  <li><code>docker ps</code> — list container đang chạy.</li>
  <li><code>docker images</code> — list images đã pull.</li>
  <li><code>docker compose up -d</code> — chạy stack từ docker-compose.yml (detached).</li>
  <li><code>docker compose down</code> — stop & remove container.</li>
  <li><code>docker compose down -v</code> — XÓA CẢ VOLUME (mất data!).</li>
  <li><code>docker compose logs -f &lt;service&gt;</code> — xem log realtime.</li>
  <li><code>docker exec -it &lt;container&gt; bash</code> — shell vào container.</li>
  <li><code>docker compose ps</code> — status mọi service trong stack.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Dùng <code>postgres:latest</code></strong> trong production → version drift bất ngờ. Luôn pin: <code>postgres:16-alpine</code>.</li>
  <li><strong>Quên named volume cho data</strong> → <code>compose down</code> mất hết data.</li>
  <li><strong>Build image trên dev rồi copy file .jar manually</strong> → image không có dependency chuẩn. Luôn build TRONG Dockerfile.</li>
  <li><strong>Hardcode credentials trong Dockerfile</strong> → leak khi push image. Dùng env vars hoặc Docker secrets.</li>
  <li><strong>Run as root</strong> trong image production → security hole. Tạo non-root user trong Dockerfile.</li>
  <li><strong>Confuse <code>EXPOSE</code> và port mapping</strong>: <code>EXPOSE 8080</code> chỉ document; <code>-p 8080:8080</code> mới thực sự mở port.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Tự suy luận Docker layering',
          prompt: `Tôi muốn hiểu sâu Docker. KHÔNG cho code. Hỏi tôi:
1. Vì sao container "nhẹ" hơn VM dù chạy cùng software?
2. Image nhiều layer — vì sao thiết kế vậy thay vì 1 file flat?
3. Build image, đổi 1 dòng source — Docker rebuild từ đầu hay chỉ phần thay đổi?
4. Container restart — data có giữ? Volume khác bind mount ra sao?
5. 2 container trong cùng compose gọi nhau bằng cách nào? (KHÔNG localhost!)
6. Image production nên dùng <code>-alpine</code> hoặc <code>-slim</code> — vì sao?`
        }
      ]
    },

    {
      id: 'l-3-1-2',
      type: 'practice',
      title: 'docker-compose.yml — Postgres + pgAdmin Setup',
      mentalModel: {
        vi: `<code>docker-compose.yml</code>: KHAI BÁO toàn bộ stack (DB, app, cache, ...) trong 1 file. <code>docker compose up</code> dựng tất cả; <code>compose down</code> xóa sạch.
<br/><br/>
Lợi ích cho dev:
<ul>
<li>Mỗi project có DB riêng → không xung đột port/version.</li>
<li>Team mới clone repo → 1 lệnh có DB chạy.</li>
<li>Rebuild DB sạch trong 5 giây để test migration.</li>
</ul>`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Named volume cho persistent data</strong>
Container có thể <code>compose down</code> nhưng volume tồn tại. Mất container = OK, mất volume = mất data. Volume mặc định nằm ở <code>/var/lib/docker/volumes/&lt;name&gt;/_data</code> trên host.
<br/><br/>
<strong>2) Port mapping host:container</strong>
<code>"5432:5432"</code>: trái = host port, phải = container port. Đổi <code>5433:5432</code> nếu port 5432 host đã bận. Container internal port LUÔN 5432 (Postgres default).
<br/><br/>
<strong>3) Service name = DNS hostname</strong>
Trong cùng compose network, app gọi DB bằng <code>jdbc:postgresql://db:5432/bootcamp</code> (KHÔNG localhost). Docker DNS auto-resolve <code>db</code> → IP container hiện tại.
<br/><br/>
<strong>4) healthcheck</strong>
App có thể start TRƯỚC khi Postgres ready → connection refused. <code>depends_on.condition: service_healthy</code> + healthcheck đảm bảo app đợi DB sẵn sàng.
<br/><br/>
<strong>5) Network isolation</strong>
Mỗi compose project tự tạo network riêng. Hai compose project khác KHÔNG thấy nhau trừ khi share network explicit.`
      },
      theory: {
        vi: `<h3>The "Why" — Compose vs <code>docker run</code></h3>
<ul>
  <li><code>docker run</code> dài 200 ký tự cho 1 container → khó nhớ.</li>
  <li>Compose: 1 file YAML version control trong git.</li>
  <li>Multi-container app (db + cache + queue + app) trong 1 lệnh.</li>
  <li>Network + volume auto-managed.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>JDBC URL dùng localhost</strong> khi app trong cùng compose → connection fail. Dùng service name.</li>
  <li><strong>pgAdmin: Host name = localhost</strong> khi pgAdmin cùng compose → fail. Dùng <code>db</code>.</li>
  <li><strong>Sửa POSTGRES_PASSWORD sau khi đã start lần đầu</strong> → password KHÔNG đổi (Postgres init chỉ chạy lần đầu trên volume rỗng). Phải <code>compose down -v</code> rồi up lại.</li>
  <li><strong>Quên healthcheck</strong> → app start trước DB ready → crash loop.</li>
  <li><strong>Bind mount source code</strong> trong production → security/perf issues. Chỉ dev.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'docker-compose.yml hoàn chỉnh — copy ngay dùng',
          lang: 'yaml',
          code: `services:
  db:
    image: postgres:16-alpine          # alpine: ~150MB thay vì 400MB
    container_name: bootcamp-db
    environment:
      POSTGRES_DB: bootcamp
      POSTGRES_USER: bootcamp
      POSTGRES_PASSWORD: bootcamp       # dev only — prod dùng secret
    ports:
      - "5432:5432"                     # host:container
    volumes:
      - pgdata:/var/lib/postgresql/data # persistent
      - ./db/init:/docker-entrypoint-initdb.d  # SQL chạy lần đầu
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bootcamp"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: bootcamp-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@bootcamp.dev
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"                       # http://localhost:5050
    depends_on:
      db:
        condition: service_healthy

  # MailHog — local SMTP test (dùng ở module Email)
  mailhog:
    image: mailhog/mailhog:latest
    container_name: bootcamp-mailhog
    ports:
      - "1025:1025"                     # SMTP
      - "8025:8025"                     # Web UI

volumes:
  pgdata:`
        },
        {
          title: 'Lệnh hay dùng',
          lang: 'bash',
          code: `# Dựng stack (background)
docker compose up -d

# Xem log Postgres realtime
docker compose logs -f db

# Vào psql shell trong container
docker exec -it bootcamp-db psql -U bootcamp -d bootcamp

# Stop nhưng GIỮ data
docker compose stop

# Stop và xóa container (data trong volume vẫn còn)
docker compose down

# DANGER: xóa cả data
docker compose down -v

# Build image cho app khi có Dockerfile
docker compose build app
docker compose up -d --build`
        }
      ],
      socraticPrompts: [
        {
          title: 'Verify Docker setup',
          prompt: `Tôi vừa <code>docker compose up -d</code>. KHÔNG cho đáp án. Hỏi tôi:
1. Mở pgAdmin tại đâu? Login bằng gì?
2. Trong pgAdmin "Add new server" — Host name nên là <code>localhost</code> hay <code>db</code>? Vì sao tùy thuộc?
3. Connect từ Spring Boot CHẠY LOCAL (IDE) — JDBC URL là gì?
4. Connect từ Spring Boot CHẠY TRONG compose — JDBC URL khác gì?
5. Port 5432 đã bị chiếm — sửa compose thế nào?`
        }
      ],
      exercises: [
        {
          title: 'Verify DB up + connect',
          prompt: 'Chạy compose up. Vào pgAdmin tạo connection. Tạo table thử và insert vài dòng.',
          hints: [
            'Câu hỏi 1: Server name trong pgAdmin Add Server, dùng <code>db</code> nếu pgAdmin cùng compose. Tại sao?',
            'Câu hỏi 2: <code>jdbc:postgresql://localhost:5432/bootcamp</code> hay <code>jdbc:postgresql://db:5432/bootcamp</code> — chọn cái nào cho app local IDE?'
          ],
          solution: {
            code: `-- Trong psql shell hoặc pgAdmin Query Tool:
CREATE TABLE test_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO test_users (email) VALUES
    ('alice@test.com'),
    ('bob@test.com');

SELECT * FROM test_users;
-- Output: 2 rows`,
            lang: 'sql',
            complexityVi: 'CREATE TABLE: O(1) metadata. INSERT: O(1) + index. SELECT *: O(n).',
            explanationVi: 'Setup chuẩn: BIGSERIAL auto-increment PK, TIMESTAMPTZ cho timestamp (timezone-aware). UNIQUE constraint email. Connect từ host (localhost:5432) hoặc từ container khác (db:5432).'
          }
        },
        {
          title: 'Restart persistence test',
          prompt: 'Dừng container db, restart. Data còn không? Tại sao? Giờ <code>docker compose down -v</code>. Restart. Data còn không?',
          hints: [
            'Câu hỏi 1: <code>compose stop</code> vs <code>compose down</code> vs <code>compose down -v</code> — khác nhau thế nào?',
            'Câu hỏi 2: Volume <code>pgdata</code> tồn tại sau case nào?'
          ],
          solution: {
            code: `# Test 1: stop + start — data CÒN (container giữ writable layer)
docker compose stop db
docker compose start db
# psql query test_users → 2 rows

# Test 2: down + up — data CÒN (volume independent)
docker compose down
docker compose up -d
# psql query test_users → 2 rows

# Test 3: down -v + up — data MẤT (volume bị xóa)
docker compose down -v
docker compose up -d
# psql query test_users → table không tồn tại`,
            lang: 'bash',
            complexityVi: 'N/A — lifecycle operations.',
            explanationVi: '<strong>stop/start</strong>: container giữ writable layer + volume. <strong>down/up</strong>: container bị xóa nhưng volume <code>pgdata</code> giữ data. <strong>down -v</strong>: xóa cả volume → mất sạch. Đây là lý do dùng named volume cho DB.'
          }
        }
      ]
    },

    {
      id: 'l-3-1-3',
      type: 'theory',
      title: 'PostgreSQL Foundations — Schema, Index, Transaction, MVCC',
      mentalModel: {
        vi: `Postgres tổ chức:
<ul>
<li><strong>Cluster</strong> = instance Postgres (process postmaster).</li>
<li><strong>Database</strong> = bộ data độc lập (mỗi project nên có 1).</li>
<li><strong>Schema</strong> = namespace bên trong database (mặc định <code>public</code>).</li>
<li><strong>Table</strong>, <strong>Index</strong>, <strong>Sequence</strong> = objects trong schema.</li>
</ul>
Khi nghi ngờ — connect bằng psql, gõ <code>\\dt</code> (list table), <code>\\d table_name</code> (mô tả), <code>\\di</code> (list index).`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Index = B-tree riêng</strong>
Postgres maintain B-tree riêng cho mỗi index. Lookup O(log n), full scan O(n). Trade-off: index TĂNG SELECT nhưng LÀM CHẬM INSERT/UPDATE/DELETE — vì phải update cả index. Mỗi index thêm 1 lượt I/O ghi.
<br/><br/>
<strong>2) Khi nào tạo index?</strong>
<ul>
<li>Cột trong WHERE thường.</li>
<li>Cột FK (Postgres KHÔNG tự tạo!).</li>
<li>Cột UNIQUE.</li>
<li>Cột ORDER BY thường.</li>
</ul>
KHÔNG index cột ít distinct (gender, status với 2 giá trị) — full scan đôi khi nhanh hơn.
<br/><br/>
<strong>3) Composite index — thứ tự cột quan trọng</strong>
Index trên (status, created_at) phục vụ query <code>WHERE status = X ORDER BY created_at</code> rất tốt. KHÔNG phục vụ <code>WHERE created_at &gt; X</code> đơn lẻ. Quy tắc: leftmost prefix.
<br/><br/>
<strong>4) Transaction & ACID</strong>
<ul>
<li><strong>Atomicity</strong>: tất cả hoặc không gì. ROLLBACK hủy toàn bộ.</li>
<li><strong>Consistency</strong>: constraint không vi phạm tại commit.</li>
<li><strong>Isolation</strong>: transaction concurrent không thấy state dở dang của nhau.</li>
<li><strong>Durability</strong>: sau COMMIT, data sống dù crash (WAL — Write-Ahead Log).</li>
</ul>
<br/><br/>
<strong>5) MVCC (Multi-Version Concurrency Control)</strong>
Mỗi UPDATE thực sự tạo ROW MỚI, mark row cũ "dead". Readers không bị block bởi writers. <code>VACUUM</code> dọn dead rows sau. Đây là vì sao Postgres KHÔNG block reader khi writer chạy — high concurrency built-in.
<br/><br/>
<strong>6) Isolation levels</strong>
<ul>
<li>READ COMMITTED (default): mỗi query thấy snapshot riêng.</li>
<li>REPEATABLE READ: cả transaction thấy 1 snapshot.</li>
<li>SERIALIZABLE: như chạy tuần tự — đắt nhất.</li>
</ul>
<br/><br/>
<strong>7) EXPLAIN ANALYZE — bạn của developer</strong>
<code>EXPLAIN ANALYZE SELECT ...</code> show plan thực tế + thời gian. Phát hiện sequential scan thay vì index scan, sai cardinality estimation, ...`
      },
      theory: {
        vi: `<h3>SQL cần thuộc</h3>
<ul>
  <li><code>SELECT ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT N OFFSET M</code></li>
  <li><code>INSERT INTO ... (cols) VALUES (...) RETURNING *</code> — RETURNING tiết kiệm 1 round-trip.</li>
  <li><code>UPDATE ... SET ... WHERE ... RETURNING *</code></li>
  <li><code>DELETE FROM ... WHERE ...</code></li>
  <li>JOIN: <code>INNER</code>, <code>LEFT</code>, <code>RIGHT</code>, <code>FULL OUTER</code></li>
  <li>CTE: <code>WITH cte AS (...) SELECT ... FROM cte</code></li>
  <li>Window: <code>ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)</code></li>
</ul>

<h3>The "Why" — Postgres vs MySQL vs MongoDB?</h3>
<ul>
  <li>Postgres: feature-rich (JSON, array, full-text, GIS), strict standards-compliant, MVCC mạnh.</li>
  <li>MySQL: phổ biến hơn, replication dễ hơn, performance đơn giản hơn cho read-heavy.</li>
  <li>Mongo: schema-less, horizontal scale dễ, nhưng yếu transaction. Dùng cho document store, KHÔNG cho relation phức tạp.</li>
</ul>

<h3>Junior Pitfalls — Postgres</h3>
<ul>
  <li><strong>Quên index trên FK</strong>: Postgres KHÔNG tự tạo. Mỗi <code>REFERENCES</code> cần INDEX riêng cho cột FK đó.</li>
  <li><strong>SELECT *</strong> trong production code → lộ schema, network overhead, brittle khi thêm column.</li>
  <li><strong>Quên LIMIT</strong> trên admin query → trả về 1M rows, kill connection.</li>
  <li><strong>SQL injection</strong>: KHÔNG concat string. Luôn parameterized: <code>WHERE email = ?</code>.</li>
  <li><strong>TIMESTAMP WITHOUT TZ</strong>: bug nightmare khi server đổi múi giờ. Luôn <code>TIMESTAMPTZ</code>.</li>
  <li><strong>DOUBLE cho tiền</strong>: floating-point error. Luôn <code>NUMERIC(19, 2)</code> hoặc <code>BIGINT</code> cents.</li>
  <li><strong>Quên VACUUM</strong>: dead rows tích lũy → bloat → slow. <code>autovacuum</code> default ON nhưng config có thể tune.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Schema mẫu cho Devlog (Phase 4)',
          lang: 'sql',
          code: `-- File: src/main/resources/db/migration/V1__init.sql (Flyway tự chạy)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,         -- UNIQUE đã tự tạo index
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_reminder_enabled BOOLEAN NOT NULL DEFAULT FALSE,  -- cho module Email
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Postgres KHÔNG tự index FK → tự tạo
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Composite index cho query: "published posts mới nhất"
CREATE INDEX idx_posts_published_created_at ON posts(published, created_at DESC);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_post_id ON comments(post_id);`
        }
      ],
      socraticPrompts: [
        {
          title: 'Database design tradeoffs',
          prompt: `Thiết kế bảng <code>orders</code>. KHÔNG cho schema. Hỏi tôi:
1. <code>id</code>: BIGSERIAL, UUID, hay INT? Trade-off?
2. Giá tiền: DOUBLE, NUMERIC, BIGINT cents? Vì sao DOUBLE NGUY HIỂM?
3. <code>status</code> (PENDING/PAID/SHIPPED): VARCHAR, TEXT, hay Postgres ENUM? ENUM có nhược điểm gì?
4. <code>created_at</code>: TIMESTAMP hay TIMESTAMPTZ? Server đổi múi giờ ra sao?
5. FK <code>user_id</code> — cần INDEX riêng không? (Postgres KHÔNG tự tạo!)
6. ON DELETE: CASCADE/SET NULL/RESTRICT — chọn nào và vì sao?`
        },
        {
          title: 'Index decision',
          prompt: `Bảng <code>products</code> 1M rows. KHÔNG cho đáp án. Hỏi tôi:
1. Query "WHERE category_id = X" chậm. Tạo index thế nào?
2. Query "WHERE category_id = X AND status='ACTIVE' ORDER BY price ASC" — index nào tối ưu? Thứ tự cột trong composite quan trọng không?
3. Cột <code>status</code> chỉ 2 giá trị — có nên đứng đầu composite? Tại sao không?
4. EXPLAIN ANALYZE trả gì? Đọc plan thế nào?
5. Index tốn chi phí gì? Khi nào KHÔNG tạo?`
        }
      ]
    },

    // ========================================================================
    // l-3-1-4 — Database Optimization (EXPLAIN, stored procedure, batch INSERT)
    // Cybersoft-style: trước khi JPA tự sinh query, phải biết DB tự tối ưu ra sao.
    // ========================================================================
    {
      id: 'l-3-1-4',
      type: 'practice',
      title: 'Database Optimization — EXPLAIN, Stored Procedures, Batch INSERT',
      subtitle: { vi: 'Lesson cuối module 3.1. 3 kỹ năng performance: đọc query plan, dùng stored proc khi cần, batch insert đúng cách.' },
      mentalModel: {
        vi: `Có 3 cấp độ tối ưu DB, mỗi cấp cao hơn 10x:
<ul>
  <li><strong>Index</strong>: giảm O(N) → O(log N). 90% bottleneck giải bằng index đúng.</li>
  <li><strong>Query rewrite</strong>: cùng kết quả, viết khác → engine chọn plan tốt hơn (SELECT đặt cột thay *, JOIN order, sub vs CTE).</li>
  <li><strong>Schema / batch / stored proc</strong>: đổi cách tương tác (1 query batch thay 1000 query single, pre-compile trong stored proc).</li>
</ul>
Chìa khoá là <code>EXPLAIN ANALYZE</code> — DB cho bạn xem plan + thời gian thật của từng node.`
      },
      underTheHood: {
        vi: `<h3>1) EXPLAIN ANALYZE — đọc query plan</h3>
<pre>EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) AS cnt
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.country = 'VN'
GROUP BY u.id, u.name
HAVING COUNT(o.id) &gt; 5;</pre>

Output mẫu:
<pre>HashAggregate  (cost=1234.56..1300.00 rows=100 width=64) (actual time=45.123..47.456 rows=87 loops=1)
  Group Key: u.id, u.name
  Filter: (count(o.id) &gt; 5)
  -&gt; Hash Right Join  (cost=...) (actual time=10.5..40.2 rows=15000)
        Hash Cond: (o.user_id = u.id)
        -&gt; Seq Scan on orders o  (cost=...) (actual time=0.1..5.3 rows=20000)
        -&gt; Hash  (cost=...) (actual time=2.0..2.0 rows=500)
              -&gt; Index Scan using idx_users_country on users u  (rows=500)
                    Index Cond: (country = 'VN')
Planning Time: 0.5 ms
Execution Time: 47.8 ms</pre>

Đọc plan:
<ul>
  <li><strong>Đọc TỪ DƯỚI LÊN</strong>: leaf nodes (Seq Scan, Index Scan) chạy trước.</li>
  <li><strong>Seq Scan</strong> = full table scan. Bad cho bảng lớn.</li>
  <li><strong>Index Scan</strong> = dùng index. Good.</li>
  <li><strong>Hash Join</strong> tốt cho bảng lớn; <strong>Nested Loop</strong> tốt cho bảng nhỏ.</li>
  <li><strong>actual time</strong> = thời gian thật. Cost là estimate (đơn vị tự định nghĩa).</li>
  <li><strong>rows</strong> estimate vs actual lệch nhiều → statistics outdated → <code>ANALYZE table_name;</code>.</li>
</ul>

<h3>2) Stored Procedure — khi nào dùng?</h3>
Postgres function (PL/pgSQL):
<pre>CREATE OR REPLACE FUNCTION transfer_funds(
  from_id INT, to_id INT, amount NUMERIC
) RETURNS VOID AS $$
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;

  IF (SELECT balance FROM accounts WHERE id = from_id) &lt; 0 THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Gọi: SELECT transfer_funds(1, 2, 100);</pre>

Khi nào DÙNG:
<ul>
  <li>Atomic operation phức tạp cần nhiều UPDATE — giảm round trip.</li>
  <li>Business logic cần consistency dưới load cao + đảm bảo race-free.</li>
  <li>Heavy ETL: 1M row transformations.</li>
</ul>
Khi nào KHÔNG dùng:
<ul>
  <li>Logic dễ thay đổi — code Java dễ test/version hơn PL/pgSQL.</li>
  <li>Logic depend on external service (gọi API trong stored proc = anti-pattern).</li>
  <li>Test khó — không có JUnit cho PL/pgSQL (có plpgunit, nhưng adoption thấp).</li>
</ul>

<h3>3) Batch INSERT — 100× nhanh hơn từng cái</h3>
<pre>-- BAD: 1000 INSERT separate (1000 round trips)
INSERT INTO orders (user_id, amount) VALUES (1, 100);
INSERT INTO orders (user_id, amount) VALUES (2, 200);
-- ...

-- GOOD: 1 INSERT với nhiều VALUES
INSERT INTO orders (user_id, amount)
VALUES (1, 100), (2, 200), (3, 300), ...;
-- 1 round trip, parse 1 lần.

-- GREAT: COPY (10× nhanh hơn INSERT batch)
COPY orders (user_id, amount) FROM STDIN;
1\\t100
2\\t200
\\.</pre>

Java code (JDBC batch):
<pre>String sql = "INSERT INTO orders (user_id, amount) VALUES (?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    for (Order o : orders) {
        ps.setLong(1, o.userId());
        ps.setBigDecimal(2, o.amount());
        ps.addBatch();
    }
    ps.executeBatch();   // 1 round trip cho cả batch
}</pre>

JPA batch (application.yml):
<pre>spring.jpa.properties.hibernate.jdbc.batch_size: 50
spring.jpa.properties.hibernate.order_inserts: true
spring.jpa.properties.hibernate.order_updates: true</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>Index trên cột thấp selectivity</strong> (status chỉ 2 giá trị): index không giúp, tốn disk.</li>
  <li><strong>Quên ANALYZE sau bulk insert</strong>: statistics outdated → optimizer chọn plan kém.</li>
  <li><strong>Stored proc thay vì JPA query đơn giản</strong>: over-engineering.</li>
  <li><strong>Batch size quá lớn</strong> (10000+): consume memory + lock dài. 50-500 là sweet spot.</li>
  <li><strong>EXPLAIN không ANALYZE</strong>: chỉ estimate, không chạy. Production tránh ANALYZE trên UPDATE/DELETE (sẽ chạy thật!) hoặc wrap trong transaction + ROLLBACK.</li>
</ul>`
      },
      exercises: [
        {
          title: 'EXPLAIN — phát hiện missing index',
          prompt: 'Bảng <code>orders(id PK, user_id, status, created_at)</code> có 1M row, KHÔNG có index ngoài PK. Query: <code>SELECT * FROM orders WHERE user_id = 12345</code> mất 3 giây. Viết: (1) lệnh EXPLAIN ANALYZE, (2) lệnh tạo index, (3) lệnh kiểm tra plan đã đổi.',
          hints: [
            'Trước index: plan sẽ là Seq Scan.',
            '<code>CREATE INDEX idx_orders_user_id ON orders(user_id);</code>',
            'Sau index, EXPLAIN lại → plan đổi thành Index Scan.'
          ],
          solution: {
            code: `-- (1) Đọc plan hiện tại
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 12345;
-- Output: Seq Scan on orders (cost=0..21345.00 rows=10 width=...)
--          Filter: (user_id = 12345)
--          Rows Removed by Filter: 999990
--          Execution Time: 3000+ ms

-- (2) Tạo index
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- (3) ANALYZE để optimizer biết
ANALYZE orders;

-- (4) Kiểm tra plan mới
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 12345;
-- Output: Index Scan using idx_orders_user_id (cost=0.43..8.45 rows=10)
--          Index Cond: (user_id = 12345)
--          Execution Time: 0.5 ms`,
            lang: 'sql',
            complexityVi: 'Trước: O(N) full scan. Sau: O(log N) B-Tree lookup.',
            explanationVi: 'Seq Scan đọc TẤT CẢ 1M row, filter giữ ~10. Index Scan đi B-Tree → tìm 10 row trong ~log₂(1M) ≈ 20 bước. Tốc độ chênh 1000×. ANALYZE sau CREATE INDEX để statistics fresh — optimizer cần biết index distribution.'
          }
        },
        {
          title: 'Composite index — thứ tự cột',
          prompt: "Query thường xuyên: <code>SELECT * FROM orders WHERE user_id = ? AND status = 'PAID' ORDER BY created_at DESC</code>. Tạo index tối ưu. Vì sao thứ tự cột quan trọng?",
          hints: [
            'Thứ tự: cột equality trước, sort cuối.',
            'Cột selectivity cao (user_id 1M giá trị) trước cột selectivity thấp (status 3 giá trị).'
          ],
          solution: {
            code: `CREATE INDEX idx_orders_user_status_date
ON orders(user_id, status, created_at DESC);

-- Test:
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE user_id = 12345 AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;

-- Output: Index Scan using idx_orders_user_status_date
--   Index Cond: ((user_id = 12345) AND (status = 'PAID'))
--   Execution Time: < 1ms`,
            lang: 'sql',
            complexityVi: 'O(log N) lookup + O(K) scan với K = số match.',
            explanationVi: 'Quy tắc composite index: (1) cột equality trước (=), (2) cột range/sort sau. user_id và status đều equality → đặt user_id trước vì selectivity cao hơn (1M vs 3 giá trị). created_at DESC để ORDER BY match index → engine bỏ qua sort step. Nếu đảo thứ tự (status, user_id) → index vẫn dùng được nhưng kém hiệu quả với query này.'
          }
        },
        {
          title: 'Batch INSERT 10000 row',
          prompt: 'Java: insert 10000 Order objects. So sánh 3 cách: (a) loop INSERT từng cái, (b) JDBC executeBatch, (c) Postgres COPY. Viết code cho (b).',
          hints: [
            'PreparedStatement.addBatch() + executeBatch().',
            'Transaction wrap: autoCommit false → commit ở cuối.'
          ],
          solution: {
            code: `// JDBC batch INSERT
String sql = "INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)";
try (Connection conn = dataSource.getConnection()) {
    conn.setAutoCommit(false);
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        int count = 0;
        for (Order o : orders) {
            ps.setLong(1, o.userId());
            ps.setBigDecimal(2, o.amount());
            ps.setString(3, o.status());
            ps.addBatch();
            if (++count % 500 == 0) {
                ps.executeBatch();   // flush every 500
            }
        }
        ps.executeBatch();   // remaining
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}

// Benchmark expected (10000 rows):
// (a) Loop:        ~5 seconds
// (b) Batch 500:   ~150 ms     (33×)
// (c) COPY:        ~50 ms      (100×)`,
            lang: 'java',
            complexityVi: 'Network round-trip giảm từ N xuống N/batch_size.',
            explanationVi: 'Chia batch 500 để tránh OOM + giữ memory ổn. Wrap transaction để atomic — fail giữa chừng rollback hết. COPY nhanh nhất nhưng skip Hibernate/triggers. JPA setting <code>hibernate.jdbc.batch_size=50</code> tự enable batch khi EntityManager.flush().'
          }
        },
        {
          title: 'Stored procedure — transfer atomic',
          prompt: 'Tạo PostgreSQL function <code>transfer(from_id, to_id, amount)</code> thực hiện chuyển tiền giữa 2 account. Phải: (1) atomic (cả 2 update OR cả 2 rollback), (2) reject nếu balance &lt; amount, (3) reject nếu account không tồn tại.',
          hints: [
            'PL/pgSQL function với BEGIN ... END.',
            'RAISE EXCEPTION sẽ tự rollback.',
            'PERFORM dùng cho query không cần result.'
          ],
          solution: {
            code: `CREATE OR REPLACE FUNCTION transfer(
  from_id BIGINT,
  to_id BIGINT,
  amount NUMERIC(18,2)
) RETURNS VOID AS $$
DECLARE
  from_balance NUMERIC(18,2);
BEGIN
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Lock row for update (tránh race condition)
  SELECT balance INTO from_balance
  FROM accounts WHERE id = from_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'From account % not found', from_id;
  END IF;

  IF from_balance < amount THEN
    RAISE EXCEPTION 'Insufficient funds: % < %', from_balance, amount;
  END IF;

  -- Check to_id exists
  PERFORM 1 FROM accounts WHERE id = to_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'To account % not found', to_id;
  END IF;

  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;
END;
$$ LANGUAGE plpgsql;

-- Test:
SELECT transfer(1, 2, 100.50);   -- success
SELECT transfer(1, 2, 99999);    -- raises Insufficient funds
-- Whole function atomic — exception → both UPDATE rollback.`,
            lang: 'sql',
            complexityVi: 'O(1) cho mỗi UPDATE với index PK.',
            explanationVi: '<code>FOR UPDATE</code> lock row → tránh concurrent transfer race. RAISE EXCEPTION trigger ROLLBACK toàn function. PL/pgSQL exception-safe by default — không cần BEGIN/EXCEPTION/END block trừ khi muốn catch. <em>Trade-off</em>: logic này có thể viết trong Java với @Transactional + repository — dễ test hơn. Stored proc tốt khi traffic cao + cần tránh round-trip.'
          }
        }
      ],
      socraticPrompts: [
        {
          title: 'Performance debugging mindset',
          prompt: `Khách báo: "Query danh sách đơn hàng chậm — 5 giây". KHÔNG hỏi code, KHÔNG đoán. Hỏi tôi:
1. Bạn lấy EXPLAIN ANALYZE TRƯỚC khi đoán nguyên nhân chưa?
2. Plan có Seq Scan trên bảng &gt; 100k rows? → likely missing index.
3. rows estimate vs actual lệch &gt; 10×? → ANALYZE outdated.
4. Index có nhưng không dùng? → cột bị wrap trong function (vd <code>WHERE LOWER(email) = ...</code>) → expression index.
5. JOIN order kỳ lạ? → set <code>join_collapse_limit</code> hoặc <code>SET random_page_cost</code>.
6. Đôi khi không phải DB — bottleneck ở network, serialization, application code.
Đừng "tạo index thử xem sao" — đo, đọc plan, hành động có dữ liệu.`
        }
      ],
      keyTakeaways: {
        vi: [
          'EXPLAIN ANALYZE đọc TỪ DƯỚI LÊN. Seq Scan trên bảng lớn = đỏ.',
          'Composite index: equality trước, sort cuối. Selectivity cao trước.',
          'Batch INSERT 100× nhanh hơn loop. JDBC executeBatch / JPA batch_size=50.',
          'Stored proc cho atomic complex + traffic cao. KHÔNG cho logic dễ đổi.',
          'ANALYZE sau bulk insert/update để optimizer fresh.'
        ]
      }
    }
  ],
  references: [
    { title: 'Docker Get Started', url: 'https://docs.docker.com/get-started/' },
    { title: 'PostgreSQL official Docker image', url: 'https://hub.docker.com/_/postgres' },
    { title: 'PostgreSQL EXPLAIN ANALYZE', url: 'https://www.postgresql.org/docs/16/using-explain.html' }
  ]

}
