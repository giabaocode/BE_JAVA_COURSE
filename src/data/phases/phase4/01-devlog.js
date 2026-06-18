// Capstone 1 — Devlog: Blog & Comment REST API
export default {
  id: 'mod-4-1',
  title: 'Capstone 1 — Devlog: Blog & Comment REST API',
  prerequisites: { vi: 'Hoàn thành <strong>toàn bộ Phase 3</strong> (Module 3.0–3.7). Đã có setup Spring Boot + Postgres + Docker working.' },
  lessons: [
    {
      id: 'l-4-1-overview',
      type: 'theory',
      title: 'Devlog — Goals, Tech Stack & Architecture',
      mentalModel: {
        vi: `<strong>Devlog</strong> là blog đa người dùng: register → login → post → comment → like. Dự án "đầu tay" ráp xong toàn bộ stack Phase 3.
<br/><br/>
<strong>Luồng dữ liệu</strong> (vẽ ra giấy trước):
<pre>Client (curl/Postman)
    ↓ HTTPS
[JwtAuthFilter] → SecurityContext
    ↓
[Controller] @Valid request body → DTO
    ↓
[Service] @Transactional → business logic
    ↓
[Repository] JPA → SQL → Postgres
    ↓
Postgres trả ResultSet → Hibernate map về Entity
    ↑ ngược lên: Service convert Entity → DTO → JSON</pre>`
      },
      underTheHood: {
        vi: `<h3>First Principles — Vì sao chọn design này?</h3>

<strong>1) Layered architecture</strong>
Controller → Service → Repository → DB. Strict 1 chiều. Service KHÔNG gọi Controller, Repository KHÔNG gọi Service. Tách concern rõ ràng → test dễ, thay đổi 1 layer không phá layer khác.
<br/><br/>
<strong>2) Stateless API qua JWT</strong>
Server KHÔNG lưu session. Mọi state nằm trong token + DB. Scale horizontal dễ — không cần sticky session hay Redis-backed session store.
<br/><br/>
<strong>3) DTO vs Entity</strong>
Entity = DB mapping (has lazy collection, audit fields, password_hash). DTO = wire format (chỉ field client cần thấy). Bao giờ cũng convert ở Service layer.
<br/><br/>
<strong>4) Database migration với Flyway</strong>
Schema versioned trong git. Mọi instance app start chạy migration tự động. KHÔNG <code>hibernate.ddl-auto=update</code> production — drift unstoppable.`
      },
      theory: {
        vi: `<h3>Scope</h3>
<ul>
  <li>Auth: register, login, JWT issue/validate.</li>
  <li>Posts CRUD (markdown body, slug, tags).</li>
  <li>Comments per post.</li>
  <li>Likes — idempotent: <code>PUT /like</code> (like) + <code>DELETE /like</code> (unlike).</li>
  <li>Search + pagination.</li>
  <li>Owner-only update/delete; ADMIN có thể delete bất kỳ.</li>
</ul>

<h3>Stack</h3>
<ul>
  <li>Spring Boot 3.3+ · Java 21 · Maven.</li>
  <li>Postgres 16 + Flyway.</li>
  <li>Spring Security 6 + jjwt 0.12+.</li>
  <li>JUnit 5 + Mockito + Testcontainers.</li>
  <li>Docker Compose dev infra.</li>
  <li>springdoc-openapi cho Swagger UI.</li>
</ul>

<h3>The "Why" — Tại sao Devlog là capstone ĐẦU TIÊN?</h3>
<ul>
  <li>Scope vừa phải — ráp toàn stack không quá phức tạp.</li>
  <li>Domain quen thuộc — ai cũng hiểu blog.</li>
  <li>Touch mọi technical concern: auth, CRUD, search, pagination, authorization.</li>
  <li>Đủ "show" trong CV/interview — interviewer dễ hỏi sâu.</li>
</ul>

<h3>Junior Pitfalls — Mistakes ở dự án đầu</h3>
<ul>
  <li><strong>Mọi field trong Entity public</strong> → setter cho id, createdAt → bug nightmare.</li>
  <li><strong>Trả Entity từ controller</strong> → lộ password_hash, N+1 lazy load.</li>
  <li><strong>Quên @Transactional</strong> → lazy access ngoài tx → LazyInitializationException.</li>
  <li><strong>Hash password bằng SHA256/MD5</strong> → quá nhanh → brute force easy. BCrypt.</li>
  <li><strong>JWT secret hard-code trong code</strong> → leak khi push git.</li>
  <li><strong>findAll() trong endpoint public</strong> → DoS. Luôn paginate.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: '[Devlog] Self-quiz scope + layered architecture',
          prompt: `Tôi sắp bắt đầu capstone Devlog (blog REST API: register/login/post/comment/like).

TUYỆT ĐỐI KHÔNG viết code, KHÔNG vẽ diagram, KHÔNG cho boilerplate.

Đóng vai senior reviewer. Hỏi tôi 7 câu để verify tôi hiểu scope + design TRƯỚC khi gõ dòng đầu tiên:
1. Liệt kê 6 endpoints chính + HTTP method. Endpoint nào cần auth, endpoint nào public?
2. Vẽ luồng request từ curl tới Postgres và ngược lại — gồm những layer/component nào?
3. Vì sao tách Controller / Service / Repository? Service gọi Controller được không?
4. Entity vs DTO khác nhau ở đâu? Convert ở layer nào? Vì sao KHÔNG trả Entity trực tiếp?
5. JWT lưu gì? Server lưu session không? Logout làm sao?
6. Flyway thay <code>hibernate.ddl-auto=update</code> như thế nào trong production?
7. Khi nào dùng @Transactional? Khi nào KHÔNG cần?

Đợi tôi trả lời từng câu. Câu sai → hỏi tiếp dẫn dắt, KHÔNG sửa thẳng. Cuối: liệt kê tôi nắm vững gì, gap chỗ nào.`
        },
        {
          title: '[Devlog] Stuck giữa step — debug Socratic',
          prompt: `Tôi đang implement Devlog step [X] (paste step description). Stuck ở [DESCRIBE BLOCKER].

Đã thử: [LIỆT KÊ những gì đã thử].
Lỗi/symptom: [PASTE error / behavior].

TUYỆT ĐỐI KHÔNG cho tôi code fix. KHÔNG nói "thêm @Transactional" hay "sửa method X".

Hỏi tôi:
1. Symptom xảy ra ở đâu trong request flow (controller? service? repo?)
2. Tôi đoán root cause là gì? Bằng chứng nào support đoán đó?
3. Để confirm/disprove đoán đó, tôi nên log gì, query gì, test gì?
4. Nếu đoán đúng, fix ở layer nào là proper (vs quick fix)?
5. Bug này dạy tôi pattern gì để tránh lần sau?

Đợi reply từng câu. Khi tôi đã có root cause, hỏi câu cuối: tôi sẽ viết test gì để bug này KHÔNG quay lại?`
        },
        {
          title: '[Devlog] Self-review owner-only authorization',
          prompt: `Tôi vừa implement endpoint <code>PUT /posts/{id}</code> cho Devlog với rule: chỉ owner hoặc ADMIN được update.

TUYỆT ĐỐI KHÔNG xem code tôi viết. KHÔNG đề xuất implementation.

Đóng vai security auditor. Hỏi tôi:
1. Check authorization ở đâu — @PreAuthorize, manual if, hay AOP filter? Vì sao chọn cách đó?
2. Có thể nào response 200 OK NHƯNG actually không update không? (silent failure pattern)
3. User A có thể guess endpoint <code>PUT /posts/999</code> rồi bị fail 403 hay 404? Cái nào leak thông tin hơn?
4. Nếu user gửi field <code>{ "ownerId": "B" }</code> trong body — code tôi có cho phép change ownerId không? Test case verify?
5. Race condition: 2 request cùng update post — outcome ra sao? Optimistic lock chưa?

Tôi self-explain từng câu. KHÔNG dạy tôi đáp án — dẫn tôi đi tới.`
        }
      ],
      keyTakeaways: {
        vi: [
          'Layered architecture strict 1 chiều: Controller → Service → Repository. Test dễ, đổi 1 layer không phá layer khác.',
          'JWT = stateless auth. Server KHÔNG lưu session — scale ngang dễ. Đổi lại: logout phức tạp (cần blacklist hoặc short-lived token + refresh).',
          'Entity (DB mapping) ≠ DTO (wire format). Convert ở Service layer. Trả Entity trực tiếp = leak password_hash + N+1 lazy load.',
          'Flyway versioned schema trong git → mọi instance start đều migrate giống nhau. <code>ddl-auto=update</code> production = drift không kiểm soát.',
          'Hash password BẮT BUỘC BCrypt/Argon2. SHA256/MD5 quá nhanh → brute force trong giờ.',
          'Mọi endpoint trả list MUST paginate. <code>findAll()</code> public = DoS chờ ngày bị exploit.'
        ]
      }
    },
    {
      id: 'l-4-1-blueprint',
      type: 'project',
      title: 'Devlog — 12 Steps with Mental Models & Junior Pitfalls',
      steps: [
        {
          id: 's1',
          title: 'Bootstrap Spring Boot project',
          description: { vi: 'Tạo project từ start.spring.io với Web, Validation, Lombok, JPA, Postgres Driver, Flyway, Security, Test, Actuator. Java 21, Maven.' },
          mentalModel: {
            vi: `Cấu trúc package theo FEATURE chứ KHÔNG theo layer:
<pre>src/main/java/com/bootcamp/devlog/
├── DevlogApplication.java
├── auth/         (controller, service, dto, JwtService, filter)
├── user/         (entity, repo)
├── post/         (controller, service, dto, entity, repo)
├── comment/
├── like/
├── tag/
└── common/       (GlobalExceptionHandler, config)</pre>
<strong>Vì sao?</strong> Khi feature lớn (thêm "Follow"), thêm 1 folder mới — KHÔNG đụng đến mọi layer khắp project.
<br/><br/>
<strong>First Principles</strong>: Conway's Law — software structure mirror organization. Package theo feature = mỗi feature owner 1 folder; theo layer = mọi engineer đụng mọi file mỗi PR.
<br/><br/>
<strong>Junior Pitfalls</strong>:
<ul>
<li>Package <code>controllers/</code>, <code>services/</code>, <code>repositories/</code> — code khó tìm khi project lớn.</li>
<li>Quên Lombok annotation processing trong IDE → entity không có constructor → compile fail.</li>
<li>Java version mismatch giữa pom.xml và IDE → compile lỗi khó hiểu.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Cấu trúc package',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Tổ chức theo "layer" hoặc theo "feature" — so sánh trade-off?
2. Feature lớn lên (30 entity), cấu trúc nào dễ tìm hơn?
3. Xóa 1 feature (remove "tags"), cấu trúc nào dễ hơn?
4. Có cần tách subpackage <code>infrastructure/</code> cho config không?
5. application.yml ở đâu cho dev/test/prod khác nhau?`
            }
          ],
          hints: [
            'Pom.xml: thêm jjwt-api, jjwt-impl, jjwt-jackson riêng (không có starter sẵn).',
            'Enable Lombok annotation processing trong IDE (IntelliJ: Settings → Build → Compiler → Annotation Processors).',
            'Tạo profile <code>dev</code> mặc định, <code>test</code> cho integration.',
            'KHÔNG chọn version Spring Boot quá mới (3.4+ có thể break library). 3.3.x stable.'
          ],
          deliverable: { vi: '<code>./mvnw spring-boot:run</code> chạy thành công, in "Started DevlogApplication in X seconds".' }
        },
        {
          id: 's2',
          title: 'Setup Docker Compose (Postgres + pgAdmin + MailHog)',
          description: { vi: 'Tạo docker-compose.yml với Postgres 16-alpine, pgAdmin, và MailHog (cho future welcome email). Verify connect từ host bằng pgAdmin.' },
          mentalModel: {
            vi: `Trong dev: app chạy LOCAL (IDE), DB chạy trong Docker. JDBC URL = <code>jdbc:postgresql://localhost:5432/bootcamp</code>.
<br/><br/>
Khi deploy: app cũng trong Docker, JDBC URL = <code>jdbc:postgresql://db:5432/bootcamp</code> (service name).
<br/><br/>
Hai môi trường khác URL → dùng env var trong application.yml: <code>\${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/bootcamp}</code>.
<br/><br/>
<strong>First Principles</strong>: Docker network = isolated namespace. Cùng compose project = cùng network = service name là DNS. Ngoài compose = phải qua published port trên host.
<br/><br/>
<strong>Junior Pitfalls</strong>:
<ul>
<li>JDBC URL dùng <code>localhost</code> khi app trong cùng compose — connection fail.</li>
<li>pgAdmin Server Host = <code>localhost</code> khi pgAdmin trong compose — fail. Dùng <code>db</code>.</li>
<li>Đổi POSTGRES_PASSWORD sau init lần đầu — KHÔNG đổi (chỉ chạy lần đầu trên volume rỗng). Phải <code>down -v</code> rồi up.</li>
<li>Quên named volume — <code>compose down</code> mất hết data.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Verify Docker setup',
              prompt: `Tôi đã viết docker-compose.yml và chạy <code>docker compose up -d</code>. KHÔNG cho đáp án. Hỏi tôi:
1. Verify Postgres đã sẵn sàng nhận connection — lệnh gì?
2. Xem log Postgres realtime — lệnh gì?
3. Vào psql shell trong container — lệnh gì?
4. pgAdmin Add Server: host = <code>localhost</code> hay <code>db</code>? Vì sao tùy thuộc?
5. Connect fail "connection refused" — checklist 3 nguyên nhân?`
            }
          ],
          hints: [
            'Pin version: <code>postgres:16-alpine</code> chứ KHÔNG <code>postgres:latest</code>.',
            'Named volume <code>pgdata</code> để data survive restart.',
            'Healthcheck với <code>pg_isready</code>.',
            'MailHog mở Web UI ở <code>http://localhost:8025</code> — copy email gửi qua port 1025.'
          ],
          deliverable: { vi: 'Connect được vào DB từ pgAdmin VÀ từ <code>psql</code> CLI. Tạo table thử và insert vài dòng.' }
        },
        {
          id: 's3',
          title: 'Database schema + Flyway V1__init.sql',
          description: { vi: 'Tạo bảng users, posts, tags, post_tags, comments, likes. Đặt index đúng chỗ.' },
          mentalModel: {
            vi: `<strong>Quy tắc thiết kế</strong>:
<ol>
<li>PK = BIGSERIAL (Postgres tự sinh, type long ở Java).</li>
<li>FK = BIGINT REFERENCES, có ON DELETE CASCADE/SET NULL tùy ngữ nghĩa.</li>
<li>Mỗi FK → tự tạo INDEX (Postgres KHÔNG tự).</li>
<li>Timestamps = TIMESTAMPTZ.</li>
<li>Unique constraint cho slug, email, (post_id, user_id) (like).</li>
<li>Junction table post_tags: PK composite (post_id, tag_id).</li>
</ol>
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>BIGSERIAL = sequence + BIGINT. Atomic increment, no race.</li>
<li>TIMESTAMPTZ store UTC internally, display in session timezone. TIMESTAMP (without tz) là bug ẩn khi server đổi timezone.</li>
<li>UNIQUE tự tạo B-tree index — KHÔNG cần CREATE INDEX riêng.</li>
<li>FK constraint = trigger validation tại insert/update + cascade. KHÔNG self-index — phải tự tạo.</li>
</ul>
<br/><br/>
<strong>Junior Pitfalls</strong>:
<ul>
<li>Sửa V1__init.sql sau khi đã chạy → Flyway checksum mismatch → app crash. Tạo V2.</li>
<li>Quên ON DELETE CASCADE/SET NULL — xóa user fail vì FK ràng buộc.</li>
<li>Index <code>(status, created_at)</code> KHÔNG phục vụ <code>WHERE created_at &gt; X</code> đơn lẻ. Leftmost prefix rule.</li>
<li>VARCHAR(255) cho mọi text — body post 10000 chars fail. Dùng TEXT cho long content.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Schema design tradeoffs',
              prompt: `KHÔNG vẽ schema hộ. Hỏi tôi:
1. <code>likes</code> table: PK BIGSERIAL hay composite (post_id, user_id)? Trade-off?
2. ON DELETE CASCADE từ posts đến comments — rủi ro gì? RESTRICT an toàn hơn?
3. Slug UNIQUE — có cần INDEX riêng? Hay đã đủ qua UNIQUE?
4. User delete account: CASCADE (xóa hết), SET NULL, archive — chọn nào?
5. Tags: tách <code>tags</code> + <code>post_tags</code> hay VARCHAR[] trong posts?'`
            }
          ],
          hints: [
            'File path: <code>src/main/resources/db/migration/V1__init.sql</code>.',
            'Index FK: <code>CREATE INDEX idx_posts_author_id ON posts(author_id);</code>',
            'Index composite: <code>(published, created_at DESC)</code> cho query "published mới nhất".',
            'Add <code>email_reminder_enabled BOOLEAN</code> trên users — sẽ dùng cho module Email phase 3.'
          ],
          deliverable: { vi: 'App start chạy Flyway migration thành công; <code>SELECT * FROM flyway_schema_history</code> hiển thị V1 success.' }
        },
        {
          id: 's4',
          title: 'Authentication: Register, Login, JWT',
          description: { vi: 'Build AuthController với /register và /login. Password hash BCrypt. Login trả về JWT.' },
          mentalModel: {
            vi: `<strong>Flow register</strong>:
<pre>POST /api/v1/auth/register {email, password}
    ↓ [Validate format] @Valid
    ↓ [Check email tồn tại?] → 409 nếu có
    ↓ [BCrypt hash password]
    ↓ [Save User entity]
    ↓ Return DTO (KHÔNG kèm password_hash!)</pre>

<strong>Flow login</strong>:
<pre>POST /api/v1/auth/login {email, password}
    ↓ [AuthenticationManager.authenticate]
    ↓ (throw BadCredentialsException nếu sai)
    ↓ [JwtService.issue(userDetails)]
    ↓ Return {accessToken, tokenType, expiresIn}</pre>

<strong>First Principles</strong>:
<ul>
<li>BCrypt slow by design — strength 12 ≈ 100ms hash. Brute force vô nghĩa.</li>
<li>BCrypt output 60 chars chứa salt + hash + strength. Self-contained.</li>
<li>AuthenticationManager wire qua UserDetailsService (load user) + PasswordEncoder (verify). Spring đã setup nếu config đúng.</li>
<li>Return 401 Generic "Invalid credentials" cho cả "user not found" và "wrong password" — KHÔNG leak username enumeration.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Return password_hash trong response register → leak.</li>
<li>Distinguish "email not found" vs "wrong password" trong error message → username enumeration.</li>
<li>Hash password SHA256/MD5 → brute force easy.</li>
<li>JWT TTL 24h+ → leak token = 24h compromise.</li>
<li>Lưu password trong JWT payload → base64 decode lộ.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Auth flow logic',
              prompt: `Hãy giải thích logic JWT Auth nhưng TUYỆT ĐỐI KHÔNG viết code. Đặt câu hỏi:
1. User register, server trả gì? Có nên trả luôn JWT để khỏi login lại?
2. Password lưu plaintext — vấn đề gì? Hash MD5/SHA1 đủ chưa? BCrypt khác gì?
3. BCrypt "strength 12" nghĩa gì? Vì sao chậm hơn lại an toàn hơn?
4. Sai password — response gì? Có nên phân biệt "email không tồn tại" vs "password sai"?
5. JWT trả về client — client lưu ở đâu? localStorage vs cookie HttpOnly?
6. JWT hết hạn — client biết khi nào? Refresh thế nào?`
            },
            {
              title: 'BCrypt deep dive',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Hash function (SHA256) vs Password hash function (BCrypt) — khác?
2. Salt là gì? Vì sao mỗi password có salt riêng?
3. BCrypt output chứa salt không? Vì sao điều đó tiện?
4. Rainbow table attack — BCrypt phòng chống thế nào?
5. Strength 10 vs 12 — chậm gấp bao nhiêu lần? Trade-off?`
            }
          ],
          hints: [
            'BCryptPasswordEncoder(12) — strength 12 cho production.',
            'AuthenticationManager bean expose từ AuthenticationConfiguration.',
            'KHÔNG return password_hash trong DTO bao giờ.',
            'JWT secret tối thiểu 256-bit (base64 32 byte), lưu env var.',
            'Return shape: <code>{token, tokenType: "Bearer", expiresIn: 1800}</code> theo OAuth2 standard.'
          ],
          deliverable: { vi: 'curl <code>POST /register</code> → 201; curl <code>POST /login</code> → 200 với token; curl endpoint protected với Bearer token → 200.' }
        },
        {
          id: 's5',
          title: 'Posts CRUD with ownership',
          description: { vi: 'Tạo PostController + PostService + PostRepository. Slugify title (<em>slug = chuỗi định danh thân thiện URL, viết thường + nối gạch ngang, vd "Tôi học Java" → "toi-hoc-java"</em>). Owner/ADMIN mới được update/delete.' },
          mentalModel: {
            vi: `<strong>Sequence diagram cho POST /posts</strong>:
<pre>Client → POST /api/v1/posts {title, body} + Bearer token
    ↓ JwtAuthFilter set SecurityContext
[PostController.create]
    ↓ @Valid request
    ↓ @AuthenticationPrincipal lấy current user
[PostService.create]
    ↓ Tạo slug từ title (lower + replace non-alnum + dedup -)
    ↓ Tạo Post entity, set author = current user
    ↓ postRepository.save(post)
[Trở về Controller]
    ↓ Convert Entity → PostDto
    ↓ Return 201 + Location header</pre>

<strong>Authorization cho DELETE</strong>: dùng SpEL trong <code>@PreAuthorize</code>: <code>"#post.author.id == principal.id or hasRole('ADMIN')"</code>. Hoặc check thủ công trong service.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>@PreAuthorize chạy TRƯỚC method body — proxy intercept. Method KHÔNG chạy nếu fail.</li>
<li>SpEL có access tới method args (qua <code>#paramName</code>), principal, returnObject (cho @PostAuthorize).</li>
<li>Slug generation idempotent — cùng title luôn ra cùng slug. Cần handle collision khi 2 post cùng title.</li>
<li>Location header trong 201 Created cho RESTful — client biết URL của resource mới.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Check ownership trong controller → DRY violation, lặp lại cho mọi endpoint.</li>
<li>Service load post 2 lần (1 cho check, 1 cho update) — N+1 query.</li>
<li>Slug regen mỗi PUT → bookmark cũ vỡ. Pattern đúng: chỉ regen khi title đổi.</li>
<li>Vietnamese accent trong slug: "Tôi học Java" → KHÔNG xử lý gây slug có ký tự đặc biệt. Cần normalize.</li>
<li>Title empty/blank — @NotBlank validate; service không cần check lại.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Ownership check — đâu là chỗ đúng?',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Check "current user là owner" — nên ở Controller, Service, hay Repository?
2. Để ở Controller, DRY ra sao khi có 5 endpoint cần check tương tự?
3. @PreAuthorize SpEL vs check thủ công trong service — ưu nhược?
4. Check sai → throw exception gì? AccessDenied? Custom?
5. Test cho ownership: cần test cases gì? (owner OK; non-owner FAIL; admin OK; chưa login FAIL)`
            },
            {
              title: 'Slug generation',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. "Hello World 2024!" → slug nên là gì? Quy tắc?
2. 2 post cùng title → slug trùng → vi phạm UNIQUE. Giải quyết? (suffix số? UUID?)
3. Slug có nên chứa Vietnamese accented? "Tôi học Java" → "toi-hoc-java" hay giữ nguyên?
4. User UPDATE title — regen slug? Bookmark cũ thì sao?
5. Slug max length? Title 1000 char thì sao?`
            }
          ],
          hints: [
            'Java text normalization: <code>Normalizer.normalize(title, Form.NFD).replaceAll("\\\\p{M}", "")</code> bỏ accent.',
            'PathVariable Long id vs String slug — endpoint riêng cho mỗi.',
            '@PreAuthorize hoặc custom annotation @OwnerOnly.',
            'Limit slug 100 chars; nếu title quá dài → truncate.'
          ],
          deliverable: { vi: 'User A tạo post → 201. User B PUT post của A → 403. User B GET post của A → 200.' }
        },
        {
          id: 's6',
          title: 'Tags + post_tags junction',
          description: { vi: 'Cho post gắn nhiều tag. Tag tự tạo nếu chưa tồn tại. Filter posts by tag.' },
          mentalModel: {
            vi: `<strong>Quan hệ ManyToMany qua junction table</strong>: <code>posts ↔ post_tags ↔ tags</code>.
<br/><br/>
JPA: Post có <code>@ManyToMany Set&lt;Tag&gt; tags</code>; Tag có <code>@ManyToMany(mappedBy="tags") Set&lt;Post&gt; posts</code>.
<br/><br/>
<strong>Get-or-create tag</strong>: nhận list tagName từ request. Loop: tìm Tag by name; nếu null thì save mới. Tránh duplicate qua UNIQUE(name).
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Junction table autogenerate bởi JPA (KHÔNG entity riêng) — chỉ chứa 2 FK.</li>
<li>Set vs List cho @ManyToMany: Set tránh duplicate, KHÔNG order; List có thể duplicate, có order. Tag thường Set.</li>
<li>Get-or-create race condition: 2 user cùng lúc tạo tag "java" → có thể tạo 2 row. Fix: UNIQUE constraint + catch DataIntegrityViolationException → retry get.</li>
<li>Tag filter dùng JOIN: <code>SELECT p FROM Post p JOIN p.tags t WHERE t.name = :name</code>.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Set không match equals/hashCode → duplicate trong Set! Tag phải override equals theo name.</li>
<li>Cascade ALL trên @ManyToMany → xóa Post xóa luôn Tag (mà Tag đang dùng cho Post khác!). Chỉ MERGE/PERSIST.</li>
<li>Tag name không lowercase trước save → "Java" và "java" thành 2 row.</li>
<li>Quên helper <code>post.addTag(tag) + tag.posts.add(post)</code> — không đồng bộ 2 phía → bug khi flush.</li>
<li>Filter bằng <code>WHERE tags IN (...)</code> — KHÔNG hoạt động cho ManyToMany. Phải JOIN.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'JPA ManyToMany pitfalls',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. @ManyToMany với List vs Set — vì sao Set tốt hơn?
2. <code>cascade = CascadeType.ALL</code> — xóa Post sẽ làm gì với Tag? Có muốn xóa Tag?
3. Helper <code>post.addTag(tag)</code> — vì sao cần set CẢ 2 phía?
4. Concurrent: 2 user tạo post với tag mới "java" — có thể tạo 2 row Tag không? Ngăn?
5. Filter "posts có tag X AND tag Y" — JPQL ra sao? Khó hơn OR ở đâu?`
            }
          ],
          hints: [
            'Junction table chỉ (post_id, tag_id), không entity riêng.',
            'Tag name luôn lowercase trước save.',
            'UNIQUE(name) trên tags để get-or-create không duplicate.',
            'Cascade trên @ManyToMany: chỉ MERGE/PERSIST, KHÔNG REMOVE.'
          ],
          deliverable: { vi: 'Tạo post với <code>["java", "spring"]</code> → tags table 2 row. Tạo post khác cũng với "java" → KHÔNG tạo thêm, chỉ link.' }
        },
        {
          id: 's7',
          title: 'Comments & Likes (like/unlike idempotent đúng chuẩn REST)',
          description: { vi: 'CRUD comment cho post. Like dùng 2 endpoint idempotent: <code>PUT /posts/{id}/like</code> (like) + <code>DELETE /posts/{id}/like</code> (unlike).' },
          mentalModel: {
            vi: `<strong>Cảnh báo: "toggle" KHÔNG idempotent.</strong> Endpoint kiểu "có thì xóa, chưa có thì thêm" — gọi 2 lần lật về trạng thái cũ → retry (mạng chập chờn) gây sai trạng thái.
<br/><br/>
<strong>Thiết kế REST đúng (idempotent):</strong>
<ul>
<li><code>PUT /posts/{id}/like</code> = "đặt trạng thái = ĐÃ like". Gọi N lần vẫn = đã like.</li>
<li><code>DELETE /posts/{id}/like</code> = "đặt trạng thái = CHƯA like". Gọi N lần vẫn = chưa like.</li>
</ul>
Nếu BẮT BUỘC giữ 1 nút toggle (UX), đặt tên rõ <code>POST /posts/{id}/like/toggle</code> và GHI RÕ nó KHÔNG idempotent.
<br/><br/>
Implement: PUT → insert nếu chưa có (đã có thì bỏ qua); DELETE → xóa nếu có (chưa có thì bỏ qua). Return likeCount mới.
<br/><br/>
<strong>Race condition</strong>: 2 request đồng thời từ cùng user — có thể tạo 2 row! Giải quyết: UNIQUE constraint (post_id, user_id) — DB throw → catch và treat as "đã like".
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Idempotent operation: f(f(x)) = f(x). Quan trọng cho retry-safe API (client retry khi timeout không gây hại).</li>
<li>HTTP: GET/PUT/DELETE idempotent theo spec; POST thì KHÔNG. Vì thế like/unlike dùng PUT/DELETE, không phải POST-toggle.</li>
<li>Vì sao KHÔNG dùng 1 POST toggle: client gửi like, mạng timeout, client retry → lần 2 thành unlike → mất like. PUT/DELETE tránh hẳn vấn đề này.</li>
<li>Denormalize likeCount (<em>nói đơn giản: thay vì mỗi lần xem post phải ĐẾM lại số like, ta lưu sẵn 1 cột <code>like_count</code> — đọc nhanh, đổi lại phải nhớ +1/−1 cột đó mỗi lần like/unlike</em>): trade-off — read fast (1 column query) vs write complexity (update count khi like).</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Quên UNIQUE(post_id, user_id) — race condition tạo duplicate.</li>
<li>Count likes mỗi GET post → 1 query/post → N+1 trên list. Denormalize hoặc cached count.</li>
<li>Update like_count bằng <code>UPDATE posts SET like_count = like_count + 1</code> race-safe. KHÔNG <code>SELECT then UPDATE</code>.</li>
<li>Comment có thể nested (reply) — schema cần parent_comment_id. Devlog giữ flat đủ.</li>
<li>DELETE comment cascade DELETE replies? RESTRICT (block) hay archive? Business decision.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Idempotency design',
              prompt: `Like endpoint idempotent. KHÔNG cho code. Hỏi tôi:
1. "Idempotent" nghĩa gì? Endpoint nào trong HTTP mặc định idempotent?
2. POST mặc định KHÔNG idempotent. Biến /like thành idempotent ra sao?
3. UNIQUE(post_id, user_id) — chống race condition ra sao? DB phản ứng thế nào khi vi phạm?
4. Trả response gì? <code>{liked: true, count: 42}</code>?
5. Dùng PUT /like (idempotent native) — design URL?'`
            }
          ],
          hints: [
            'likeCount lấy qua subquery hoặc denormalize <code>like_count</code> trên posts.',
            'Denormalize tăng tốc đọc nhưng cần đồng bộ với write.',
            'Comments flat (1 level) — Devlog không cần nested.',
            'Atomic increment: <code>UPDATE posts SET like_count = like_count + 1 WHERE id = :id</code>.'
          ],
          deliverable: { vi: '<code>PUT /posts/{id}/like</code> gọi 2 lần → vẫn 200, count=1 (idempotent, không cộng dồn). <code>DELETE /posts/{id}/like</code> → count=0; gọi lại vẫn count=0. Retry KHÔNG đổi kết quả. Postman/curl test.' }
        },
        {
          id: 's8',
          title: 'Search + filtering + pagination',
          description: { vi: '/posts?q=...&tag=...&author=...&page=0&size=20 với sort.' },
          mentalModel: {
            vi: `2 cách compose filter động:
<ol>
<li><strong>JPA Criteria API</strong> — type-safe nhưng verbose.</li>
<li><strong>JPA Specifications</strong> — wrap criteria, dễ combine với <code>and</code>/<code>or</code>.</li>
<li><strong>Native query với @Query + COALESCE</strong> — đơn giản nếu filter ít.</li>
</ol>
Khuyên Specifications cho production.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Specifications = builder pattern cho query. Mỗi filter là 1 <code>Predicate</code>, combine bằng <code>and()</code>.</li>
<li><code>Page&lt;T&gt;</code> trả về kèm <code>totalElements</code>, <code>totalPages</code> → Spring sinh thêm 1 COUNT query.</li>
<li>Cursor pagination cho production: sort by (created_at DESC, id DESC) + WHERE (...) — tránh OFFSET chậm với page lớn.</li>
<li>Full-text search: Postgres <code>tsvector</code> + <code>tsquery</code> với GIN index — fast hơn LIKE nhiều.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>32 method <code>findByX/Y/Z</code> kết hợp — combinatorial explosion. Specifications.</li>
<li>OFFSET pagination page 1000 → DB skip 999 page data → chậm thê thảm. Cursor.</li>
<li>Sort theo cột không có index → seq scan → slow.</li>
<li>SQL injection qua <code>like</code> với user input concat → CRITICAL. Parameterized.</li>
<li>Trả <code>List&lt;Entity&gt;</code> thay <code>Page&lt;Dto&gt;</code> → tải toàn bộ.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Filter composition',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 5 filter optional (q, tag, author, fromDate, toDate). Brute-force: 32 method. Vì sao tệ?
2. JPA Specifications hoạt động ra sao? "Spec" là gì khái niệm?
3. Combine: <code>Specification.where(byTag(tag)).and(byAuthor(author))</code> — sinh SQL thế nào?
4. Spec trả null khi filter không áp dụng — Hibernate xử lý ra sao?
5. Performance: 10 filter combine — query nhanh? Index giúp được?`
            }
          ],
          hints: [
            'Spring Data: <code>JpaSpecificationExecutor&lt;Post&gt;</code> trong repository.',
            'Page&lt;PostDto&gt; = page.map(PostDto::from) — KHÔNG load .getContent() và new ArrayList.',
            'Default page=0, size=20, sort=createdAt DESC.',
            'Max size limit (vd 100) tránh client request quá lớn.'
          ],
          deliverable: { vi: 'curl <code>/posts?q=java&tag=spring&page=0&size=10&sort=createdAt,desc</code> trả PageResponse đúng.' }
        },
        {
          id: 's9',
          title: 'Global exception handling',
          description: { vi: '@RestControllerAdvice trả ProblemDetail. Map mọi exception về HTTP code đúng.' },
          mentalModel: {
            vi: `Mapping exception → HTTP code:
<pre>EntityNotFoundException        → 404
MethodArgumentNotValidException → 400 (validation)
ConstraintViolationException   → 400 (DB constraint)
AccessDeniedException          → 403
BadCredentialsException        → 401
DataIntegrityViolationException → 409 (UNIQUE violation)
Exception (fallback)           → 500 (log full stack, return generic)</pre>

<strong>First Principles</strong>:
<ul>
<li>@RestControllerAdvice qua AOP — proxy bắt exception thoát khỏi controller method.</li>
<li>Exception matching theo class hierarchy — specific override general.</li>
<li>ProblemDetail (RFC 7807) chuẩn format JSON cho error: <code>{type, title, status, detail}</code>.</li>
<li>4xx = client error, 5xx = server error. Quyết định dựa trên "ai có lỗi".</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Custom domain exception extends <code>Exception</code> (checked) → Spring KHÔNG auto-rollback transaction. Extend RuntimeException.</li>
<li>Return stack trace cho client → security leak (paths, library versions, SQL).</li>
<li>Quên log exception → 500 trả client nhưng server không log → debug impossible.</li>
<li>Generic 500 cho mọi exception → client không biết phải làm gì. Phân loại đúng 4xx/5xx.</li>
<li>Bắt RuntimeException trong filter → bypass GlobalExceptionHandler (filter chạy trước controller). Phải set response code thẳng.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Exception strategy',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Custom exception (vd <code>InsufficientStockException</code>) — extend gì? RuntimeException hay Exception? Vì sao?
2. Checked vs unchecked — vì sao Spring khuyên unchecked cho service?
3. Lộ exception message cho client — rủi ro gì? "SQLException: column X" lộ schema!
4. Validation lỗi nhiều field — trả 1 hay nhiều lỗi?
5. 4xx vs 5xx — quyết định dựa trên gì?`
            }
          ],
          hints: [
            'ProblemDetail chuẩn RFC 7807 — Spring 3+ hỗ trợ sẵn.',
            'Log exception VỚI stack trace ở server, response KHÔNG kèm.',
            'Add fallback @ExceptionHandler(Exception.class) cho mọi case chưa handle.',
            'Test mỗi exception → đảm bảo status code đúng.'
          ],
          deliverable: { vi: 'Test mọi error: 400 validation, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 500 fallback.' }
        },
        {
          id: 's10',
          title: 'Testing — slice + integration',
          description: { vi: '@WebMvcTest controllers, @DataJpaTest repos, Testcontainers integration.' },
          mentalModel: {
            vi: `<strong>Pyramid Devlog</strong>:
<ul>
<li>~70% unit (service logic, slug util, JwtService).</li>
<li>~20% slice (controllers với MockMvc; repos với @DataJpaTest + Testcontainers).</li>
<li>~10% integration (@SpringBootTest end-to-end happy paths).</li>
</ul>
KHÔNG dùng H2 — luôn Testcontainers Postgres. Vì sao? Postgres-specific SQL (RETURNING, JSONB, COALESCE behavior) sẽ leak.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Unit test: NO Spring context — Mockito mock dependency. Vài ms/test.</li>
<li>Slice test: load 1 lớp Spring (@WebMvcTest = controller layer). 100ms/test.</li>
<li>Integration: full context + real DB. Giây/test. Chỉ cho happy path major.</li>
<li>Testcontainers singleton: share container per test suite (static field) → start 1 lần, 10× faster.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Tất cả test = @SpringBootTest → CI 30 phút.</li>
<li>H2 in-memory thay Testcontainers Postgres → bug leak production.</li>
<li>Test phụ thuộc thứ tự (state leak) → flaky.</li>
<li>Test name generic <code>test1()</code> → fail message vô dụng.</li>
<li>Mock everything → KHÔNG verify integration thật sự.</li>
<li>Test gọi real Stripe/Gmail → flaky + expensive.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Test what?',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Controller test: cover gì? (200 happy, 400 validation, 401, 403, 404). Test happy path nhiều input?
2. Service test: mock repository — vì sao? KHÔNG mock thì test gì khác?
3. Repository test với @DataJpaTest: load gì? Chạy migration Flyway không? Testcontainers config ra sao?
4. Integration test: bao nhiêu đủ? 1 per feature lớn hay 1 per endpoint?
5. Mock vs spy — khác? Khi nào dùng spy?`
            }
          ],
          hints: [
            '@WithMockUser cho test endpoint yêu cầu auth (skip JWT generation).',
            'Testcontainers shared per class via static field — tốc độ.',
            '@Sql để seed data; teardown qua @Transactional rollback.',
            'Coverage tool (JaCoCo) — target ≥ 70% line trên service + controller.'
          ],
          deliverable: { vi: '<code>./mvnw test</code> xanh. Coverage ≥ 70% trên service + controller.' }
        },
        {
          id: 's11',
          title: 'OpenAPI/Swagger documentation',
          description: { vi: 'Thêm springdoc-openapi. Annotate controllers. Test endpoint từ Swagger UI.' },
          mentalModel: {
            vi: `Swagger UI giúp:
<ol>
<li>Khám phá API mà KHÔNG cần đọc code.</li>
<li>Test endpoint không cần Postman.</li>
<li>Generate client SDK tự động (cho frontend team).</li>
<li>Document JWT bearer scheme cho "Authorize" button.</li>
</ol>
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>OpenAPI = spec; Swagger = tool. springdoc auto-generate spec từ controller annotation.</li>
<li>JWT Authorize: cần config <code>@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer")</code>.</li>
<li>API versioning: <code>/v1/</code> trong URL phổ biến hơn header-based versioning.</li>
<li>Spec export YAML/JSON → import vào Postman, generate client.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Expose Swagger UI public trong production → lộ entire API surface. Block hoặc auth.</li>
<li>Quên @Operation summary → endpoint vô danh trong Swagger.</li>
<li>Documentation drift — spec không update khi code đổi. springdoc auto-generate giảm risk.</li>
<li>Hard-code example trong @Schema → maintain manual. Dùng @ExampleObject.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'API documentation',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. OpenAPI vs Swagger — khác? (spec vs tool)
2. Generate doc auto (từ annotation) vs viết tay YAML — trade-off?
3. Document JWT bearer trong Swagger — quan trọng vì sao?
4. Doc trong production: expose Swagger UI hay tắt? Lợi/hại?
5. API versioning: <code>/v1/</code> URL hay header <code>Accept: application/vnd.devlog.v1+json</code>?`
            }
          ],
          hints: [
            'springdoc-openapi-starter-webmvc-ui Maven artifact.',
            'Default URL: <code>/swagger-ui.html</code>.',
            '@Operation(summary = "...") trên method để doc rõ.',
            'Production: secure Swagger với basic auth hoặc IP whitelist.'
          ],
          deliverable: { vi: 'Mở <code>http://localhost:8080/swagger-ui.html</code>, "Authorize" với token, gọi endpoint protected thành công.' }
        },
        {
          id: 's12',
          title: 'Dockerize app + deploy compose',
          description: { vi: 'Multi-stage Dockerfile. Update compose để build + run app cùng DB.' },
          mentalModel: {
            vi: `Sau bước này: clone repo + <code>docker compose up</code> = app chạy. Đó là dấu hiệu professional setup.
<br/><br/>
Mỗi env var cần CHÍNH XÁC. CI/CD sau này sẽ override SPRING_DATASOURCE_URL, JWT_SECRET, ... qua secrets.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Multi-stage build: stage 1 JDK (build) → stage 2 JRE (run). Image final ~200 MB.</li>
<li>Layer caching: COPY pom.xml + RUN mvn deps TRƯỚC COPY src — đổi code không rebuild deps.</li>
<li>Non-root user trong production image — security.</li>
<li>HEALTHCHECK trong Dockerfile → Docker/K8s biết container ready.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>JWT_SECRET trong compose hard-code → leak khi push. Phải env var: <code>\${JWT_SECRET:?required}</code>.</li>
<li>App container restart policy: <code>no</code> (dev), <code>unless-stopped</code> (prod).</li>
<li>Log file thay vì stdout → Docker không capture. Luôn stdout.</li>
<li>Update app = build image mới + restart container → downtime. Zero-downtime cần orchestrator (K8s rolling update).</li>
<li>Backup DB: <code>pg_dump</code> chạy trong container hay host? Trade-off.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Production readiness',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. JWT_SECRET dev hard-code trong compose. Prod — đâu là chỗ đúng để lưu?
2. App restart policy: <code>no</code>, <code>on-failure</code>, <code>always</code>, <code>unless-stopped</code> — dev vs prod?
3. Log: stdout (Docker capture) vs file — vì sao stdout chuẩn cho container?
4. Update app: build image mới — zero-downtime thế nào?
5. Backup DB: <code>pg_dump</code> trong container hay host? Lưu ở đâu?`
            }
          ],
          hints: [
            'Profile <code>SPRING_PROFILES_ACTIVE=prod</code> để load application-prod.yml.',
            'Healthcheck app: <code>HEALTHCHECK CMD curl -f http://localhost:8080/actuator/health</code>.',
            'Tag image với git commit SHA, KHÔNG chỉ <code>latest</code>.',
            'Compose <code>restart: unless-stopped</code> cho production.'
          ],
          deliverable: { vi: '<code>docker compose up --build</code> trên máy sạch → app + db chạy, /actuator/health UP, mọi endpoint hoạt động.' }
        }
      ],
      stretchGoals: [
        'Refresh token với rotation.',
        'Rate limiting với Bucket4j (chống brute-force login).',
        'Email verification on register qua MailHog/SES — gọi <code>emailService.sendHtml()</code> với template verification.',
        'Soft delete posts (@SQLDelete + @Where).',
        'Audit log table tracking user actions.',
        '@Scheduled cron daily cleanup expired refresh tokens.'
      ]
    }
  ],
  references: [
    { title: 'Spring Boot 3.3 Reference', url: 'https://docs.spring.io/spring-boot/docs/3.3.x/reference/html/' },
    { title: 'Flyway Documentation', url: 'https://documentation.red-gate.com/fd/' },
    { title: 'springdoc-openapi', url: 'https://springdoc.org/' },
    { title: 'RFC 7807 -Problem Details', url: 'https://datatracker.ietf.org/doc/html/rfc7807' }
  ]

}
