// Module 3.1 — Docker & PostgreSQL Foundations
export default {
  id: 'mod-3-1',
  title: 'Docker & PostgreSQL — Dựng hạ tầng local',
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
    }
  ]
}
