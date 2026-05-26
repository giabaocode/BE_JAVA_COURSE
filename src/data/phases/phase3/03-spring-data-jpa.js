// Module 3.3 — Spring Data JPA & Hibernate
export default {
  id: 'mod-3-3',
  title: 'Spring Data JPA & Hibernate — Behind the Scenes',
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
    }
  ]
}
