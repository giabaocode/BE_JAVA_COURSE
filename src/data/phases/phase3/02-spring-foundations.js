// Module 3.2 — Spring Boot Foundations
export default {
  id: 'mod-3-2',
  title: 'Spring Boot — IoC, REST, Validation, Exception Handling',
  lessons: [
    {
      id: 'l-3-2-1',
      type: 'theory',
      title: 'Spring IoC Container — Bean & Dependency Injection',
      mentalModel: {
        vi: `Spring có "container" (<code>ApplicationContext</code>) — bạn nói "tôi cần thứ này", Spring tạo và đưa cho. KHÔNG <code>new</code> service/repository nữa.
<br/><br/>
3 cách inject:
<ul>
<li><strong>Constructor injection</strong> (KHUYẾN NGHỊ) — dependency vào tham số constructor. Final field. Test dễ.</li>
<li><strong>Field injection</strong> (<code>@Autowired</code> field) — code ngắn nhưng test khó, circular dep lỗi.</li>
<li><strong>Setter injection</strong> — hiếm dùng.</li>
</ul>
Tip: Lombok <code>@RequiredArgsConstructor</code> để khỏi viết constructor cho final fields.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Bean lifecycle khi app start</strong>
<ol>
<li>Spring scan package tìm class có <code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@Controller</code>, <code>@RestController</code> (đều là <code>@Component</code> meta-annotation).</li>
<li>Tạo instance MỘT LẦN (singleton scope mặc định).</li>
<li>Wire dependency: với mỗi bean, xem constructor cần gì, lấy bean khác inject.</li>
<li>Call <code>@PostConstruct</code> nếu có.</li>
<li>Sẵn sàng phục vụ request.</li>
</ol>
<br/><br/>
<strong>2) Circular dependency</strong>
A cần B, B cần A → Spring fail nếu cả 2 constructor injection. Workaround: field injection hoặc <code>@Lazy</code> — nhưng đó là DẤU HIỆU sai thiết kế.
<br/><br/>
<strong>3) Vì sao singleton mặc định?</strong>
Service thường stateless — 1 instance phục vụ mọi request OK. Stateful → <code>@Scope("prototype")</code> hoặc <code>@RequestScope</code>.
<br/><br/>
<strong>4) Proxy mechanism — AOP magic</strong>
Khi class có <code>@Transactional</code> hoặc <code>@Async</code>, Spring KHÔNG trả về object thật — trả về PROXY wrap quanh. Proxy intercept method call, mở/đóng transaction trước/sau. Vì sao bạn KHÔNG thấy gì khác — magic ẩn.
<br/><br/>
<strong>5) Self-invocation pitfall</strong>
Method A gọi <code>this.b()</code> trong cùng class → KHÔNG đi qua proxy → <code>@Transactional</code> trên <code>b()</code> KHÔNG hoạt động. Phải gọi qua bean khác (hoặc inject self).
<br/><br/>
<strong>6) Component scan boundary</strong>
<code>@SpringBootApplication</code> ngụ ý <code>@ComponentScan(basePackages = "current package + sub")</code>. Class ngoài package gốc KHÔNG được scan → bean không có.`
      },
      theory: {
        vi: `<h3>Layered architecture chuẩn</h3>
<ul>
  <li><strong>Controller</strong> (<code>@RestController</code>) — HTTP in/out, validation, DTO mapping.</li>
  <li><strong>Service</strong> (<code>@Service</code>) — business logic, transaction, orchestration.</li>
  <li><strong>Repository</strong> (<code>@Repository</code>, extends <code>JpaRepository</code>) — DB access.</li>
  <li><strong>Entity</strong> (<code>@Entity</code>) — mapping với DB table.</li>
  <li><strong>DTO</strong> — wire format giao tiếp client.</li>
</ul>
<strong>Quy tắc vàng</strong>: controller MỎNG, service DÀY, repository CHỈ làm query.

<h3>The "Why" — Vì sao IoC?</h3>
<ul>
  <li><strong>Loose coupling</strong>: caller phụ thuộc interface, KHÔNG class. Swap implementation dễ.</li>
  <li><strong>Test</strong>: mock dependency vào constructor — không cần Spring context cho unit test.</li>
  <li><strong>Lifecycle</strong>: Spring quản lý create/destroy, init order. KHÔNG manual.</li>
  <li><strong>Cross-cutting concerns</strong>: AOP (logging, transactions, security) wrap qua proxy — KHÔNG sửa code business.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Field injection</strong> (<code>@Autowired</code> trên field) — Spring team khuyên KHÔNG. Vì sao? Final field impossible, test khó (cần reflection), circular dep không phát hiện compile-time.</li>
  <li><strong>Self-invocation gọi <code>@Transactional</code> method</strong> → transaction KHÔNG mở. Bug ẩn nguy hiểm.</li>
  <li><strong>5+ dependencies trong constructor</strong> — dấu hiệu SRP vi phạm. Tách class.</li>
  <li><strong>Class ngoài root package</strong> không được scan → "no qualifying bean".</li>
  <li><strong>Tạo bean bằng <code>new</code></strong> trong code business → bypass IoC, không có proxy.</li>
  <li><strong>Inject EntityManager bằng <code>@Autowired</code></strong> → dùng <code>@PersistenceContext</code> mới đúng (thread-safe wrapper).</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Constructor injection chuẩn với Lombok',
          code: `@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor                  // Lombok generate constructor cho final field
public class PostController {
    private final PostService postService;  // KHÔNG @Autowired — Spring tự suy

    @GetMapping("/{id}")
    public PostDto getById(@PathVariable Long id) {
        return postService.findById(id);
    }
}

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)            // default readOnly; write override
public class PostService {
    private final PostRepository postRepository;

    public PostDto findById(Long id) {
        return postRepository.findById(id)
            .map(PostDto::from)
            .orElseThrow(() -> new EntityNotFoundException("Post " + id + " not found"));
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'Vì sao constructor injection?',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Field injection ngắn hơn. Vì sao team Spring khuyên KHÔNG?
2. Constructor injection cho phép field <code>final</code> — vì sao có lợi?
3. Unit test service: với field injection làm sao set mock? Constructor injection thế nào?
4. Circular dep: A cần B, B cần A. Constructor injection xử lý ra sao? Field injection?
5. 5 dependencies trong constructor — "xấu" không? Hay là SIGNAL gì?`
        },
        {
          title: 'AOP proxy mechanism',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Khi bạn gọi method có <code>@Transactional</code>, ai mở transaction? Code business của bạn?
2. Spring intercept ra sao mà bạn KHÔNG cần sửa code? (Hint: proxy)
3. Self-invocation: <code>this.b()</code> bên trong class — proxy có intercept không? Vì sao không?
4. Workaround cho self-invocation là gì?
5. <code>@Async</code> hoạt động tương tự — ra sao?`
        }
      ]
    },

    {
      id: 'l-3-2-2',
      type: 'theory',
      title: 'REST Controllers, DTO & Validation',
      mentalModel: {
        vi: `Mỗi REST endpoint = 1 method trong controller. HTTP verb → annotation:
<ul>
<li><code>@GetMapping</code> — read.</li>
<li><code>@PostMapping</code> — create.</li>
<li><code>@PutMapping</code> — full replace.</li>
<li><code>@PatchMapping</code> — partial update.</li>
<li><code>@DeleteMapping</code> — delete.</li>
</ul>
<strong>Quy tắc URL</strong>: danh từ số nhiều cho resource (<code>/posts</code>, KHÔNG <code>/getPost</code>). Hành động đã ẩn trong HTTP verb. Nested: <code>/posts/123/comments</code>.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Request flow trong Spring MVC</strong>
<ol>
<li>Browser → HTTP request → Tomcat (servlet container).</li>
<li><code>DispatcherServlet</code> nhận → routing đến controller method match URL + verb.</li>
<li><code>HandlerMethodArgumentResolver</code> resolve @PathVariable, @RequestBody (Jackson deserialize), @RequestParam, ...</li>
<li>Method invoke. Return value handled bởi <code>HandlerMethodReturnValueHandler</code> (Jackson serialize sang JSON).</li>
<li>Response gửi về browser.</li>
</ol>
<br/><br/>
<strong>2) Entity vs DTO — phân biệt rõ</strong>
<ul>
<li><strong>Entity</strong>: object map với DB row. Có <code>@Entity</code>, relationships JPA.</li>
<li><strong>DTO</strong>: format JSON gửi/nhận client.</li>
</ul>
KHÔNG dùng entity làm response vì:
<ol>
<li>Lộ schema DB → client phụ thuộc DB structure → đổi DB phá API.</li>
<li>Lazy field → Jackson serialize → trigger lazy load → N+1 query.</li>
<li>Bảo mật — entity có password_hash, internal_id, ... lộ ra hết.</li>
</ol>
<br/><br/>
<strong>3) Java 16+ <code>record</code></strong>
Idiomatic cho DTO: immutable, compact, auto equals/hashCode/toString. Replace POJO + Lombok cho data carriers.
<br/><br/>
<strong>4) Jackson — JSON ↔ Object</strong>
Spring auto-config Jackson. Default: snake_case field name có thể conflict với camelCase JSON. Config <code>spring.jackson.property-naming-strategy=SNAKE_CASE</code> nếu cần.
<br/><br/>
<strong>5) Validation pipeline</strong>
<code>@Valid @RequestBody</code> → Jackson deserialize → Hibernate Validator chạy → throw <code>MethodArgumentNotValidException</code> nếu fail. Bắt bằng <code>@RestControllerAdvice</code>.
<br/><br/>
<strong>6) Content negotiation</strong>
Client gửi <code>Accept: application/json</code> → Spring chọn Jackson. Có thể serve XML, CSV — config converter tương ứng.`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao tách DTO?</h3>
<ul>
  <li>Public API contract độc lập với DB structure → đổi DB không phá client.</li>
  <li>Chọn field nào expose — KHÔNG lộ password, internal IDs, ...</li>
  <li>Aggregate data từ nhiều entity (UserDto có cả profile + counts).</li>
  <li>Versioning: PostV1Dto + PostV2Dto cho API evolution.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Trả entity trực tiếp</strong> → N+1 lazy bug, lộ schema, lộ field nhạy cảm.</li>
  <li><strong>Quên <code>@Valid</code></strong> → validation annotation vô tác dụng. <code>@NotBlank</code> không enforce.</li>
  <li><strong>Trả về <code>List&lt;Entity&gt;</code></strong> trong endpoint pagination → tải hết DB. Dùng <code>Page&lt;Dto&gt;</code>.</li>
  <li><strong>HTTP verb sai</strong>: GET với side effects (DELETE qua GET) → cache poison, browser prefetch gây delete data!</li>
  <li><strong>200 OK cho mọi response</strong> kể cả error → client khó parse. Dùng đúng 4xx/5xx.</li>
  <li><strong>POST /createUser thay vì POST /users</strong> → vi phạm REST conventions.</li>
  <li><strong>Catch Exception trong controller</strong> → quên xử lý → leak stack trace. Dùng <code>@RestControllerAdvice</code> centralize.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Controller + DTO + Validation đầy đủ',
          code: `public record CreatePostRequest(
        @NotBlank(message = "Title không được trống")
        @Size(max = 255, message = "Title tối đa 255 ký tự")
        String title,

        @NotBlank
        String body
) {}

public record PostDto(Long id, String title, String slug, String authorName, Instant createdAt) {
    public static PostDto from(Post p) {
        return new PostDto(p.getId(), p.getTitle(), p.getSlug(),
                p.getAuthor().getEmail(), p.getCreatedAt());
    }
}

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostDto> create(
            @Valid @RequestBody CreatePostRequest req,
            @AuthenticationPrincipal UserDetails user) {
        PostDto saved = postService.create(req, user.getUsername());
        URI location = URI.create("/api/v1/posts/" + saved.id());
        return ResponseEntity.created(location).body(saved);
    }

    @GetMapping
    public Page<PostDto> list(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return postService.search(q, pageable);
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'Tại sao tách DTO?',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Dùng Entity làm response. Đổi cột DB <code>password_hash</code> thành <code>pwd</code> — client phá vỡ gì?
2. Entity Post có @OneToMany List&lt;Comment&gt;. Jackson serialize → trigger lazy load → N+1. Tại sao?
3. DTO record có lợi gì so với POJO setter/getter?
4. 10 endpoint shape khác nhau — 10 DTO record hay reuse?
5. Mapping Entity→DTO viết tay vs MapStruct — trade-off?`
        }
      ]
    },

    {
      id: 'l-3-2-3',
      type: 'theory',
      title: 'Global Exception Handling (RFC 7807 Problem Details)',
      mentalModel: {
        vi: `KHÔNG bao giờ để exception thô lọt ra client (stack trace, NullPointer ...). Bắt MỌI exception ở 1 chỗ trung tâm — <code>@RestControllerAdvice</code> — và biến thành JSON chuẩn.
<br/><br/>
Spring Boot 3 hỗ trợ <strong>ProblemDetail</strong> (RFC 7807) — standard format JSON cho error:
<pre>{"type": "...", "title": "...", "status": 404, "detail": "..."}</pre>`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) @RestControllerAdvice qua AOP</strong>
Spring wrap mỗi controller bằng proxy. Khi exception thoát khỏi controller method, proxy bắt và route đến <code>@ExceptionHandler</code> tương ứng (matching by exception type, nearest superclass).
<br/><br/>
<strong>2) Exception hierarchy</strong>
Spring match exception theo class hierarchy. <code>@ExceptionHandler(RuntimeException.class)</code> bắt cả <code>NullPointerException</code>, <code>IllegalArgumentException</code>, ... Specific override general.
<br/><br/>
<strong>3) Priority</strong>
Handler trong <code>@RestControllerAdvice</code> global thua handler nội bộ trong cùng <code>@Controller</code>. Hữu ích khi 1 controller cần custom logic.
<br/><br/>
<strong>4) ProblemDetail (RFC 7807)</strong>
Format JSON chuẩn cho HTTP API errors. Thay vì mỗi service custom error format → industry standard. Spring 3+ build-in.
<br/><br/>
<strong>5) Log vs Return separation</strong>
LOG stack trace ở server (cho debug) nhưng KHÔNG return cho client (lộ implementation detail, paths, queries). Return MESSAGE thân thiện.`
      },
      theory: {
        vi: `<h3>Mapping exception → HTTP status</h3>
<ul>
<li><code>EntityNotFoundException</code> → 404</li>
<li><code>MethodArgumentNotValidException</code> → 400 (Bean Validation fail)</li>
<li><code>ConstraintViolationException</code> → 400 (DB constraint)</li>
<li><code>AccessDeniedException</code> → 403</li>
<li><code>BadCredentialsException</code> → 401</li>
<li><code>DataIntegrityViolationException</code> → 409 (UNIQUE violation, FK violation)</li>
<li><code>Exception</code> (fallback) → 500 (log full, return generic message)</li>
</ul>

<h3>The "Why" — Centralized vs scattered</h3>
<ul>
  <li>Scattered try-catch trong mỗi method → DRY violation, dễ miss.</li>
  <li>Centralized → consistent error response format, dễ audit.</li>
  <li>Easy to add new exception types — chỉ thêm handler.</li>
  <li>Test cũng centralized — verify response shape ở 1 chỗ.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Custom domain exception extends <code>Exception</code></strong> (checked) → Spring KHÔNG auto-rollback transaction. Extends <code>RuntimeException</code> (unchecked).</li>
  <li><strong>Return stack trace cho client</strong> → security leak (paths, library versions, SQL queries).</li>
  <li><strong>Quên LOG exception</strong> → 500 trả về client nhưng server không log gì → debug impossible.</li>
  <li><strong>Generic 500 cho mọi exception</strong> → client không biết phải làm gì. Phân loại đúng 4xx vs 5xx.</li>
  <li><strong>Mixed return types</strong>: lúc return DTO, lúc Map, lúc String → client confusion. Luôn ProblemDetail cho error.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'GlobalExceptionHandler hoàn chỉnh',
          code: `@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ProblemDetail handleNotFound(EntityNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Validation failed");
        pd.setDetail(ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining("; ")));
        return pd;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Access denied");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCreds(BadCredentialsException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataConflict(DataIntegrityViolationException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "Data conflict");
    }

    @ExceptionHandler(Exception.class)    // fallback
    public ProblemDetail handleAny(Exception ex) {
        log.error("Unhandled exception", ex);   // LOG stack trace ở server
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
            "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'Exception strategy',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Custom exception (vd <code>InsufficientStockException</code>) — extend gì? RuntimeException hay Exception? Vì sao?
2. Checked vs unchecked — vì sao Spring khuyên unchecked cho service?
3. Lộ exception message cho client — rủi ro gì? "SQLException: column X" lộ schema!
4. Validation lỗi nhiều field — trả 1 hay nhiều lỗi trong response?
5. 4xx vs 5xx — quyết định dựa trên gì? (Hint: ai có lỗi)`
        }
      ]
    }
  ],
  references: [
    { title: 'Spring Boot 3.3 Reference', url: 'https://docs.spring.io/spring-boot/docs/3.3.x/reference/html/' },
    { title: 'Spring Framework 6 Reference', url: 'https://docs.spring.io/spring-framework/reference/' },
    { title: 'Spring IoC & DI', url: 'https://docs.spring.io/spring-framework/reference/core/beans.html' }
  ]

}
