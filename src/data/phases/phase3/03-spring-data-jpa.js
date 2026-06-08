// Module 3.3 — Spring Data JPA & Hibernate
export default {
  id: 'mod-3-3',
  title: 'Spring Data JPA & Hibernate — Behind the Scenes',
  prerequisites: { vi: 'Hoàn thành <code>Module 3.0 (SQL), 3.1 (Docker+Postgres), 3.2 (Spring foundations)</code>.' },
  lessons: [
    {
      id: 'l-3-3-1',
      type: 'theory',
      title: 'JPA Entity Lifecycle & Persistence Context',
      mentalModel: {
        vi: `Hibernate KHÔNG phải "java code thẳng đi DB". Có một <strong>Persistence Context</strong> ở giữa — cache trong 1 transaction.
<br/><br/>
4 trạng thái entity:
<ul>
<li><strong>Transient</strong>: <code>new Post()</code> — chưa lưu DB, không trong context.</li>
<li><strong>Managed</strong>: <code>repository.save()</code> hoặc <code>find()</code> trả về → Hibernate theo dõi mọi thay đổi.</li>
<li><strong>Detached</strong>: transaction kết thúc → entity vẫn còn nhưng KHÔNG được theo dõi.</li>
<li><strong>Removed</strong>: <code>delete()</code> → sẽ bị xóa khi flush.</li>
</ul>
<strong>Bí kíp</strong>: trong <code>@Transactional</code>, sửa field của managed entity tự động UPDATE — KHÔNG cần gọi save().`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Dirty checking</strong>
Cuối transaction, Hibernate so sánh state HIỆN TẠI của mọi managed entity với SNAPSHOT khi load. Field nào đổi → sinh UPDATE statement. Đây là vì sao bạn KHÔNG cần gọi save() sau khi sửa field.
<br/><br/>
<strong>2) Flush — khi SQL thật sự gửi DB</strong>
Hibernate KHÔNG gửi SQL ngay — gom vào batch và flush. Default <code>AUTO</code>: flush trước query (đảm bảo consistency) và khi commit. Force: <code>entityManager.flush()</code>.
<br/><br/>
<strong>3) First-level cache (Persistence Context)</strong>
Trong cùng transaction, query cùng entity 2 lần — Hibernate trả từ cache, KHÔNG hit DB lần 2. Đây là persistence context. Cache scope = transaction.
<br/><br/>
<strong>4) N+1 problem — bug ẩn phổ biến nhất</strong>
Load 1 Post → access <code>post.comments</code> (LAZY) → Hibernate sinh 1 query cho mỗi post. 100 posts → 101 query. Fix:
<ul>
<li><code>JOIN FETCH</code> trong JPQL → 1 query.</li>
<li><code>@EntityGraph(attributePaths = "comments")</code> trên repo method.</li>
<li><code>@BatchSize(size = 50)</code> trên collection → giảm n+1 thành n/50 + 1.</li>
</ul>
<br/><br/>
<strong>5) FetchType.LAZY vs EAGER</strong>
<ul>
<li>LAZY (default cho @OneToMany, @ManyToMany): tải khi access lần đầu.</li>
<li>EAGER (default cho @ManyToOne, @OneToOne): tải cùng entity chính.</li>
</ul>
<strong>Quy tắc</strong>: LUÔN dùng LAZY cho mọi relationship. EAGER tự tạo N+1 ẩn (mỗi findAll trigger fetch của @ManyToOne).
<br/><br/>
<strong>6) Loại quan hệ</strong>
<ul>
<li><code>@ManyToOne</code>: n-side, có FK trong table này. Default EAGER (CẢNH BÁO).</li>
<li><code>@OneToMany(mappedBy = "...")</code>: 1-side, mappedBy = field bên kia. Default LAZY.</li>
<li><code>@ManyToMany</code>: qua bảng join. Default LAZY.</li>
<li><code>@OneToOne</code>: 1-1. Default EAGER.</li>
</ul>
<br/><br/>
<strong>7) Cascade & orphanRemoval</strong>
<code>cascade = ALL</code> + <code>orphanRemoval = true</code>: xóa parent → xóa hết children. Mạnh nhưng nguy hiểm — dùng cẩn thận.`
      },
      theory: {
        vi: `<h3>The "Why" — JPA vs raw JDBC?</h3>
<ul>
  <li><strong>JPA</strong>: ORM, code ít, type-safe, productivity cao. Phù hợp 80% use case CRUD.</li>
  <li><strong>JDBC raw</strong>: control hoàn toàn, no magic, performance tối ưu. Phù hợp query phức tạp, batch lớn.</li>
  <li><strong>JdbcTemplate / jOOQ</strong>: middle ground — type-safe SQL.</li>
</ul>
Tip: dự án Spring Boot thường JPA cho CRUD + JdbcTemplate cho query phức tạp.

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>EAGER cho mọi relationship</strong> → N+1 hidden, mọi findAll tải hết tree.</li>
  <li><strong>Quên @Transactional</strong> trên service method có lazy access → LazyInitializationException ngoài tx.</li>
  <li><strong>open-in-view = true</strong> (default) — giấu lazy bug. SET <code>spring.jpa.open-in-view=false</code> trong production.</li>
  <li><strong>Modify entity ngoài @Transactional</strong> → dirty checking không hoạt động → KHÔNG save.</li>
  <li><strong>Lombok @Data trên entity</strong> → toString() trigger lazy load của mọi collection → infinite recursion với bidirectional relationship.</li>
  <li><strong>save() rồi sửa field</strong> trong cùng tx → 2 UPDATE statements. Sửa rồi save 1 lần.</li>
  <li><strong>findById() rồi gọi save()</strong> trong cùng tx → THỪA. Dirty checking auto-save.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Entity Post với relationship đầy đủ',
          code: `@Entity
@Table(name = "posts")
@Getter @Setter
@NoArgsConstructor                              // JPA cần default constructor
@AllArgsConstructor
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String title;
    @Column(nullable = false, unique = true) private String slug;
    @Column(nullable = false, columnDefinition = "TEXT") private String body;
    @Column(nullable = false) private boolean published;

    // ManyToOne — owning side (có FK author_id)
    @ManyToOne(fetch = FetchType.LAZY)            // BẮT BUỘC LAZY
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    // OneToMany — inverse side; mappedBy trỏ field của Comment
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @CreationTimestamp                             // Hibernate auto set
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;

    // Helper giữ 2 phía đồng bộ
    public void addComment(Comment c) {
        comments.add(c);
        c.setPost(this);
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'N+1 problem',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Code: <code>List&lt;Post&gt; posts = postRepo.findAll(); for (Post p : posts) sout(p.getComments().size());</code> — vì sao 101 query?
2. EAGER giải quyết được không? Tại sao EAGER LẠI TỆ HƠN nhiều trường hợp?
3. <code>JOIN FETCH</code> trong JPQL — 1 query. Rủi ro gì với pagination?
4. <code>@EntityGraph</code> khác @Query JPQL ra sao?
5. <code>@BatchSize(size = 50)</code> — sinh bao nhiêu query cho 100 post?`
        },
        {
          title: 'Dirty checking',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Trong @Transactional, <code>post.setTitle("new")</code> nhưng KHÔNG gọi save(). DB có update? Tại sao?
2. Tx throw exception sau setTitle — DB có update?
3. Ngoài @Transactional: load, setTitle, không save — DB update không? Tại sao khác?
4. Hibernate so sánh với cái gì để biết "dirty"?
5. TẮT dirty checking để tăng perf — cách nào?`
        }
      ]
    },

    {
      id: 'l-3-3-2',
      type: 'theory',
      title: 'Spring Data Repository, Pagination, @Query',
      mentalModel: {
        vi: `Spring Data tự sinh implementation cho interface extends <code>JpaRepository</code>. Bạn chỉ khai báo method, Spring đọc tên method và sinh JPQL/SQL.
<br/><br/>
3 cách viết query:
<ol>
<li><strong>Method name derivation</strong>: <code>findByEmailIgnoreCase</code>, <code>findByAuthorIdAndPublishedTrueOrderByCreatedAtDesc</code>.</li>
<li><strong>@Query JPQL</strong>: query theo entity name + field name.</li>
<li><strong>@Query nativeQuery = true</strong>: SQL thuần. Dùng khi cần Postgres-specific.</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Method name derivation</strong>
Spring parse method name → JPQL: <code>findByEmail</code> → <code>SELECT p FROM Post p WHERE p.email = ?1</code>. Keywords: <code>And</code>, <code>Or</code>, <code>IgnoreCase</code>, <code>OrderBy</code>, <code>Between</code>, <code>Like</code>, <code>In</code>, ...
<br/><br/>
<strong>2) Pageable internals</strong>
Spring auto thêm <code>LIMIT</code> + <code>OFFSET</code> + sinh 2 query (1 cho data, 1 cho count). LƯU Ý: <code>OFFSET</code> lớn (page 1000) Postgres CHẬM vì phải skip 999 page.
<br/><br/>
<strong>3) Cursor pagination — production solution</strong>
Thay vì OFFSET, sort theo id/timestamp + <code>WHERE id &gt; lastSeen</code>. Constant-time per page. Nhược: KHÔNG jump tới page N tùy ý, KHÔNG total count đơn giản.
<br/><br/>
<strong>4) @Modifying + @Transactional</strong>
BẮT BUỘC cho UPDATE/DELETE query. Spring throw nếu thiếu <code>@Modifying</code>. Lý do: phân biệt SELECT với DML (cần flush, cache eviction).
<br/><br/>
<strong>5) Native query — khi nào cần?</strong>
<ul>
<li>Feature Postgres-specific (JSONB operators, full-text, window functions).</li>
<li>Query phức tạp JPQL không express được.</li>
<li>Performance tuning (force index hint).</li>
</ul>
Trade-off: mất database portability, nhưng không phải concern thật sự (production rarely changes DB).
<br/><br/>
<strong>6) JPA Specifications</strong>
Cho dynamic queries (filter optional). <code>JpaSpecificationExecutor</code> + Spec object compose. Tránh tạo 32 method <code>findByXAndYAnd...</code> cho 5 optional filter.
<br/><br/>
<strong>7) Projections</strong>
DTO projection trực tiếp từ query: <code>interface PostSummary { Long getId(); String getTitle(); }</code> — Hibernate sinh SQL chỉ select 2 column. Tiết kiệm bandwidth.`
      },
      theory: {
        vi: `<h3>The "Why" — Method derivation vs @Query?</h3>
<ul>
  <li><strong>Method derivation</strong>: ngắn, type-safe, compile-time error nếu method tên sai. Phù hợp simple query.</li>
  <li><strong>@Query JPQL</strong>: phức tạp hơn (joins, projection), tránh method name dài 80 ký tự.</li>
  <li><strong>Native</strong>: chỉ khi JPQL không đủ.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>OFFSET pagination cho page lớn</strong> → query chậm thê thảm. Cursor cho production.</li>
  <li><strong>@Query không có @Modifying</strong> cho UPDATE/DELETE → throw runtime.</li>
  <li><strong>Native query không inject parameter</strong> (string concat) → SQL injection.</li>
  <li><strong>Trả về List&lt;Entity&gt;</strong> thay vì Page&lt;Dto&gt; cho pagination endpoint → tải toàn bộ.</li>
  <li><strong>save() trong loop</strong> mà không batch → N queries thay vì 1. Dùng <code>saveAll()</code> + <code>spring.jpa.properties.hibernate.jdbc.batch_size</code>.</li>
  <li><strong>findAll() trong endpoint public</strong> → DoS vector. Luôn paginate.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'PostRepository — đủ kiểu query',
          code: `public interface PostRepository extends JpaRepository<Post, Long> {

    // 1. Derive theo tên method
    Optional<Post> findBySlug(String slug);
    Page<Post> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    boolean existsByAuthorIdAndSlug(Long authorId, String slug);

    // 2. JPQL — tham chiếu entity và field
    @Query("""
        select p from Post p
        join fetch p.author
        where p.published = true
          and lower(p.title) like lower(concat('%', :q, '%'))
    """)
    Page<Post> search(@Param("q") String q, Pageable pageable);

    // 3. Native — Postgres full-text
    @Query(value = """
        SELECT p.* FROM posts p
        WHERE to_tsvector('english', p.title || ' ' || p.body)
              @@ plainto_tsquery('english', :q)
    """, nativeQuery = true)
    List<Post> fullTextSearch(@Param("q") String q);

    // 4. UPDATE — phải @Modifying + @Transactional
    @Modifying
    @Query("update Post p set p.published = true where p.id = :id")
    int publish(@Param("id") Long id);

    // 5. Projection — chỉ select 2 cột
    interface PostSummary {
        Long getId();
        String getTitle();
    }
    List<PostSummary> findByPublishedTrue();
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'Pagination strategy',
          prompt: `Phân trang 1M post. KHÔNG cho code. Hỏi tôi:
1. Offset pagination (LIMIT/OFFSET): vì sao page 10000 chậm? DB làm gì với OFFSET 100000?
2. Cursor pagination: sort id + WHERE id &gt; lastSeen. Vì sao nhanh hơn?
3. Cursor có nhược điểm gì? (KHÔNG jump tới page bất kỳ, total count khó)
4. Khi nào dùng cách nào?
5. Sort theo created_at — cursor là gì? (Composite: (createdAt, id) break tie)`
        }
      ]
    },

    {
      id: 'l-3-3-3',
      type: 'practice',
      title: 'application.yml & Flyway Migrations',
      mentalModel: {
        vi: `<code>application.yml</code> = TẤT CẢ cấu hình của Spring Boot app. Dev: trỏ vào Docker Postgres. Prod: trỏ vào DB thật qua env var.
<br/><br/>
<strong>Flyway</strong>: schema migration tool. Files <code>V1__init.sql</code>, <code>V2__add_likes.sql</code> trong <code>resources/db/migration</code>. Mỗi lần app start, Flyway check bảng <code>flyway_schema_history</code> và chạy migration mới.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Tại sao Flyway thay vì <code>hibernate.ddl-auto=update</code>?</strong>
<ul>
<li><code>update</code> KHÔNG bao giờ DROP cột — chỉ thêm. Schema drift dần.</li>
<li><code>update</code> KHÔNG đổi tên column được — phải xóa và tạo lại (mất data!).</li>
<li>Production cần migration KIỂM SOÁT TỪNG BƯỚC — Flyway version-controlled.</li>
</ul>
<br/><br/>
<strong>2) Flyway workflow</strong>
<ol>
<li>App start, Flyway connect DB.</li>
<li>Check bảng <code>flyway_schema_history</code> — đã chạy migration nào.</li>
<li>Scan classpath:db/migration cho file V*__*.sql.</li>
<li>Chạy migration mới theo thứ tự version number.</li>
<li>Record vào <code>flyway_schema_history</code>.</li>
</ol>
<br/><br/>
<strong>3) Quy tắc vàng</strong>
<ul>
<li>KHÔNG bao giờ sửa file migration đã chạy (checksum sẽ sai → app crash).</li>
<li>Migration mới cần backward-compatible (zero-downtime deploy).</li>
<li>Đặt index <code>CONCURRENTLY</code> trong production để không lock bảng.</li>
</ul>
<br/><br/>
<strong>4) Connection pool — HikariCP</strong>
Spring Boot default dùng HikariCP. Maintain N connection idle ready. Khi app cần, lấy từ pool; trả về khi xong. Tránh chi phí TCP handshake mỗi query.
<br/><br/>
<strong>5) Connection pool sizing</strong>
Pool size phụ thuộc: số CPU server + IO wait. Rule of thumb: <code>connections = ((core_count × 2) + effective_spindle_count)</code>. Cho web app: 10-20 thường đủ.
<br/><br/>
<strong>6) open-in-view — anti-pattern</strong>
Default = true (Spring Boot). Giữ session JPA open suốt request → lazy load OK trong view template. Nhưng:
<ul>
<li>Giấu bug N+1 khi serialize Jackson.</li>
<li>Connection bị giữ lâu → pool exhaustion.</li>
<li>Khuyến nghị production: <code>spring.jpa.open-in-view: false</code>.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Profile-based config</h3>
<ul>
  <li>Dev: full SQL log, dev Postgres, MailHog SMTP.</li>
  <li>Test: H2 in-memory hoặc Testcontainers.</li>
  <li>Prod: env vars cho secrets, conservative pool size, log WARN+.</li>
</ul>
Switch profile: <code>SPRING_PROFILES_ACTIVE=prod</code>.

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>ddl-auto: update trong prod</strong> → drift, mất data khi rename. Dùng <code>validate</code>.</li>
  <li><strong>Password trong yml committed git</strong> → leak. Dùng env var <code>\${SPRING_DATASOURCE_PASSWORD}</code>.</li>
  <li><strong>Pool size = 100</strong> → connection storm trên DB. Postgres default max_connections = 100. Quá vài client là đủ.</li>
  <li><strong>open-in-view = true</strong> trong prod → hide bug N+1.</li>
  <li><strong>Sửa V1__init.sql sau khi đã chạy</strong> → checksum mismatch → Flyway fail. Tạo V2 mới.</li>
  <li><strong>SHOW_SQL = true trong prod</strong> → log spam, perf hit. Chỉ DEV.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'application.yml hoàn chỉnh',
          lang: 'yaml',
          code: `spring:
  application:
    name: bootcamp-app

  datasource:
    # Dev: Docker Postgres expose 5432; Prod: env var
    url: \${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/bootcamp}
    username: \${SPRING_DATASOURCE_USERNAME:bootcamp}
    password: \${SPRING_DATASOURCE_PASSWORD:bootcamp}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10           # connection pool
      minimum-idle: 2
      idle-timeout: 30000
      connection-timeout: 5000

  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate              # PROD: validate. KHÔNG update/create
    open-in-view: false               # TẮT — chống N+1 và lazy bug
    properties:
      hibernate:
        format_sql: true
        jdbc:
          batch_size: 50              # batch insert/update
        order_inserts: true
        order_updates: true

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  jackson:
    serialization:
      write-dates-as-timestamps: false # ISO-8601

server:
  port: 8080
  error:
    include-message: never            # KHÔNG lộ message cho client
    include-stacktrace: never

logging:
  level:
    org.hibernate.SQL: DEBUG          # xem SQL trong dev
    org.hibernate.orm.jdbc.bind: TRACE # parameter binding`
        },
        {
          title: 'V1__init.sql',
          lang: 'sql',
          code: `CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_reminder_enabled BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published_created_at ON posts(published, created_at DESC);`
        }
      ],
      socraticPrompts: [
        {
          title: 'Cấu hình production-ready',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. <code>ddl-auto: validate / update / create / none</code> — khác nhau? Prod chọn nào, dev chọn nào?
2. <code>open-in-view: false</code> — vì sao Spring Boot default true nhưng nên TẮT?
3. Connection pool size 10 — dựa vào đâu? Quá nhỏ thì sao, quá lớn thì sao?
4. Vì sao password DB nên env var, không viết thẳng yml?
5. <code>batch_size: 50</code> giúp gì? Khi nào KHÔNG có tác dụng?`
        }
      ]
    },
    {
      id: 'l-3-3-4',
      type: 'theory',
      title: '@Transactional — Propagation, Isolation & Rollback Rules',
      subtitle: { en: 'The boundary where commit or rollback happens.', vi: 'Ranh giới quyết định "lưu hết" hay "huỷ hết" — và 3 cái bẫy kinh điển khi phỏng vấn.' },
      mentalModel: {
        vi: `Hình dung <code>@Transactional</code> như một <strong>cái khung bao quanh method</strong>: trước khi vào method, Spring mở một DB transaction (BEGIN); nếu method chạy xong êm → COMMIT (lưu hết); nếu method ném exception → ROLLBACK (huỷ hết, như chưa từng xảy ra).
<br/><br/>
Đây là cách bạn đảm bảo <strong>tính nguyên tử nghiệp vụ</strong>: "trừ kho VÀ tạo order" phải cùng thành công hoặc cùng thất bại — không có chuyện trừ kho rồi order lỗi mà kho vẫn bị trừ.
<br/><br/>
3 câu hỏi mọi transaction phải trả lời (3 thuộc tính):
<ul>
  <li><strong>Propagation</strong>: method A (đã có transaction) gọi method B (cũng @Transactional) — B dùng CHUNG transaction của A hay mở transaction MỚI?</li>
  <li><strong>Isolation</strong>: transaction này "nhìn thấy" thay đổi chưa commit của transaction khác tới mức nào?</li>
  <li><strong>Rollback rule</strong>: exception loại nào thì rollback? (Bẫy: mặc định KHÔNG phải mọi exception!)</li>
</ul>`
      },
      underTheHood: {
        vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) @Transactional chạy bằng PROXY (AOP), không phải phép màu.</strong>
Spring bọc bean của bạn trong một proxy. Khi code ngoài gọi <code>service.method()</code>, thực ra gọi proxy → proxy mở transaction → gọi method thật → commit/rollback. <strong>Hệ quả cực quan trọng</strong>: nếu method A trong cùng class gọi thẳng method B (<code>this.B()</code>), lời gọi KHÔNG đi qua proxy → @Transactional trên B <strong>bị bỏ qua hoàn toàn</strong>. Đây là "self-invocation pitfall" — bẫy phỏng vấn số 1.
<br/><br/>
<strong>2) Rollback mặc định CHỈ cho unchecked exception.</strong>
Spring rollback khi gặp <code>RuntimeException</code> và <code>Error</code>. Với <strong>checked exception</strong> (IOException, hay custom checked) → Spring <strong>VẪN COMMIT</strong>! Rất phản trực giác. Muốn rollback cả checked: <code>@Transactional(rollbackFor = Exception.class)</code>.
<br/><br/>
<strong>3) Propagation REQUIRED (mặc định) vs REQUIRES_NEW.</strong>
<code>REQUIRED</code>: nếu đã có transaction thì THAM GIA (cùng commit/rollback). <code>REQUIRES_NEW</code>: luôn TẠM DỪNG transaction ngoài, mở transaction riêng (commit độc lập). Dùng REQUIRES_NEW cho audit log: "dù order rollback, log vẫn phải lưu".
<br/><br/>
<strong>4) Isolation & các hiện tượng đọc bẩn.</strong>
Postgres mặc định <code>READ_COMMITTED</code> (không đọc dữ liệu chưa commit của người khác). Tăng lên <code>REPEATABLE_READ</code> / <code>SERIALIZABLE</code> chống "non-repeatable read"/"phantom read" nhưng đắt hơn + dễ deadlock. Đa số CRUD để mặc định; chỉ nâng khi nghiệp vụ thật sự cần (vd báo cáo tài chính).
<br/><br/>
<strong>5) <code>readOnly = true</code></strong> báo Hibernate bỏ dirty checking + báo driver/replica đây là query đọc → tối ưu nhẹ cho method chỉ đọc.`
      },
      theory: {
        vi: `<h3>Đặt @Transactional ở đâu?</h3>
<ul>
  <li><strong>Tầng Service</strong>, KHÔNG phải Repository hay Controller. Service là nơi gom nhiều thao tác DB thành 1 đơn vị nghiệp vụ.</li>
  <li>Method phải <code>public</code> — proxy chỉ chặn được public method (với JDK/CGLIB proxy mặc định). @Transactional trên private/protected → bị bỏ qua câm.</li>
  <li>Query chỉ đọc → <code>@Transactional(readOnly = true)</code>.</li>
</ul>

<h3>The "Why" — Vì sao đây là chủ đề phỏng vấn lõi?</h3>
Vì nó là nơi <strong>3 bẫy</strong> hội tụ (self-invocation, checked-không-rollback, propagation sai) — và cả 3 đều gây bug "thầm lặng" ở production: dữ liệu lưu một nửa, rollback không xảy ra, hoặc transaction lồng nhau sai. Interviewer hỏi để xem bạn hiểu cơ chế PROXY hay chỉ "thấy annotation thì dán".

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Self-invocation</strong>: method public không @Transactional gọi <code>this.transactionalMethod()</code> → annotation vô hiệu. Sửa: tách sang bean khác, hoặc self-inject, hoặc dùng <code>TransactionTemplate</code>.</li>
  <li><strong>Tưởng mọi exception đều rollback</strong>: bắt checked exception trong service mà không <code>rollbackFor</code> → commit dữ liệu lỗi.</li>
  <li><strong>catch exception rồi không ném lại</strong>: nuốt exception trong @Transactional → Spring không biết để rollback → commit.</li>
  <li><strong>@Transactional trên private method</strong> → bị bỏ qua, không báo lỗi.</li>
  <li><strong>Gọi HTTP/gửi email TRONG transaction</strong>: giữ transaction (và DB connection) suốt thời gian chờ API ngoài → cạn connection pool. Tách ra ngoài hoặc dùng event AFTER_COMMIT.</li>
  <li><strong>readOnly nhưng vẫn ghi</strong>: ghi trong method readOnly → lỗi hoặc bị bỏ qua tuỳ provider.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Self-invocation pitfall — vì sao @Transactional "không chạy"',
          code: `@Service
public class OrderService {

    // ❌ BUG: createOrder() KHÔNG có @Transactional, gọi this.charge()
    //     → lời gọi nội bộ KHÔNG qua proxy → @Transactional trên charge() BỊ BỎ QUA.
    public void createOrder(Long userId, Long amount) {
        saveOrderRow(userId, amount);
        this.charge(userId, amount);   // ⚠️ self-invocation: transaction KHÔNG mở
    }

    @Transactional
    public void charge(Long userId, Long amount) {
        // ... nếu ở đây ném exception, sẽ KHÔNG rollback như mong đợi
    }
}

// ✅ SỬA 1: đặt @Transactional ở method "ngoài cùng" được gọi từ ngoài (controller)
@Service
public class OrderServiceFixed {
    @Transactional                      // proxy chặn ở đây → cả block là 1 transaction
    public void createOrder(Long userId, Long amount) {
        saveOrderRow(userId, amount);
        charge(userId, amount);         // gọi nội bộ giờ nằm TRONG transaction của createOrder
    }
    private void charge(Long userId, Long amount) { /* ... */ }
}

// ✅ SỬA 2 (khi cần transaction RIÊNG): tách charge sang bean khác + REQUIRES_NEW
@Service
public class PaymentService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void charge(Long userId, Long amount) { /* commit độc lập */ }
}`,
          lang: 'java',
          description: 'Self-invocation: gọi this.method() không qua proxy nên @Transactional vô hiệu. Hai cách sửa.'
        },
        {
          title: 'Rollback rule: checked exception KHÔNG tự rollback',
          code: `@Service
public class TransferService {

    // ❌ BUG: ném checked exception → Spring VẪN COMMIT (trừ tiền A nhưng không cộng B... đã lưu!)
    @Transactional
    public void transfer(Long from, Long to, long cents) throws InsufficientFundsException {
        debit(from, cents);
        if (balanceOf(to) < 0) {
            throw new InsufficientFundsException();  // checked → KHÔNG rollback mặc định!
        }
        credit(to, cents);
    }

    // ✅ SỬA: khai báo rollbackFor để rollback cả checked exception
    @Transactional(rollbackFor = Exception.class)
    public void transferFixed(Long from, Long to, long cents) throws InsufficientFundsException {
        debit(from, cents);
        if (balanceOf(to) < 0) throw new InsufficientFundsException();
        credit(to, cents);
    }
}`,
          lang: 'java',
          description: 'Mặc định Spring chỉ rollback RuntimeException/Error. Checked exception cần rollbackFor.'
        }
      ],
      socraticPrompts: [
        {
          title: 'Thiết kế ranh giới transaction',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. @Transactional chạy bằng cơ chế gì (proxy/AOP)? Vì sao gọi <code>this.method()</code> lại làm nó vô hiệu?
2. Method ném <code>IOException</code> (checked) trong @Transactional — Spring commit hay rollback? Vì sao? Sửa thế nào?
3. "Trừ kho + tạo order + ghi audit log" — nếu order rollback nhưng audit log PHẢI lưu, dùng propagation nào cho log?
4. Tôi gọi API thanh toán bên ngoài (2 giây) ngay giữa @Transactional. Hậu quả gì với connection pool? Nên làm gì?
5. Đặt @Transactional ở Controller, Service hay Repository? Vì sao?`
        }
      ],
      keyTakeaways: {
        vi: [
          '@Transactional = AOP proxy mở/commit/rollback transaction quanh method PUBLIC ở tầng Service.',
          'Self-invocation: gọi <code>this.method()</code> trong cùng class KHÔNG qua proxy → annotation bị bỏ qua câm.',
          'Mặc định CHỈ rollback RuntimeException/Error; checked exception vẫn COMMIT → cần <code>rollbackFor = Exception.class</code>.',
          'Propagation REQUIRED (tham gia transaction sẵn có) là mặc định; REQUIRES_NEW mở transaction độc lập (audit log).',
          'KHÔNG gọi API ngoài/gửi email trong transaction (giữ connection lâu); query chỉ đọc dùng readOnly = true.'
        ]
      }
    }
  ],
  references: [
    { title: 'Spring Data JPA Reference', url: 'https://docs.spring.io/spring-data/jpa/reference/' },
    { title: 'Hibernate 6.5 User Guide', url: 'https://docs.jboss.org/hibernate/orm/6.5/userguide/html_single/Hibernate_User_Guide.html' },
    { title: 'Vlad Mihalcea -JPA persistence context', url: 'https://vladmihalcea.com/jpa-persistence-context/' },
    { title: 'Spring Transaction Management (Reference)', url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction.html' },
    { title: 'Spring @Transactional rollback rules', url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html' }
  ]

}
