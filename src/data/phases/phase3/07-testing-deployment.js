// Module 3.7 — Testing, Containerize App & Production Hygiene
export default {
  id: 'mod-3-7',
  title: 'Testing, Containerize App & Production Hygiene',
  prerequisites: { vi: 'Hoàn thành <code>Module 3.2, 3.3, 3.4</code>. Đã có 1 REST endpoint hoạt động để viết test.' },
  lessons: [
    {
      id: 'l-3-7-1',
      type: 'theory',
      title: 'Test Pyramid — Unit, Slice, Integration',
      mentalModel: {
        vi: `<strong>Test pyramid</strong>:
<ul>
<li>Đáy (NHIỀU): unit test — mock dependency, kiểm thử logic 1 class. Nhanh, vài ms.</li>
<li>Giữa: slice test (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>) — chỉ load 1 lớp Spring. Vài trăm ms.</li>
<li>Đỉnh (ÍT): integration test (<code>@SpringBootTest</code> + Testcontainers) — full app + real Postgres. Vài giây/test.</li>
</ul>
Sai lầm: làm NGƯỢC (nhiều integration, ít unit) → CI chậm, debug khó.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) @SpringBootTest vs slice test</strong>
<code>@SpringBootTest</code> load TOÀN BỘ app context — nặng (3-10s/test class). Slice test (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>) load CHỈ 1 lớp — nhanh hơn 5-10×.
<br/><br/>
<strong>2) @MockBean vs Mockito @Mock</strong>
<ul>
<li><code>@Mock</code>: Mockito tạo mock object, KHÔNG đăng ký vào Spring context. Dùng cho pure unit test (không Spring).</li>
<li><code>@MockBean</code>: Spring REPLACE bean thật trong context bằng mock. Dùng trong @SpringBootTest / @WebMvcTest.</li>
</ul>
<br/><br/>
<strong>3) Testcontainers</strong>
Library Java khởi động Docker container (Postgres, Redis, Kafka, ...) trong test. Mỗi test class có DB SẠCH. Đảm bảo test ↔ prod CÙNG DB engine — H2 in-memory ẨN BUG (Postgres-specific SQL khác).
<br/><br/>
<strong>4) @DirtiesContext vs @Transactional rollback</strong>
<ul>
<li><code>@Transactional</code> trên test method → rollback cuối test → nhanh.</li>
<li>NHƯNG: sequence không reset (Postgres BIGSERIAL counter). Identity column id "leaked" between tests.</li>
<li>@DirtiesContext → reload context → CHẬM. Dùng khi test thực sự cần fresh state.</li>
</ul>
<br/><br/>
<strong>5) Singleton container pattern</strong>
Testcontainers shared per test SUITE (static field) — start container 1 lần, dùng cho mọi test. Nhanh hơn 10× so với @Container instance field.
<br/><br/>
<strong>6) MockMvc vs TestRestTemplate vs WebTestClient</strong>
<ul>
<li><code>MockMvc</code>: Spring web layer mock — KHÔNG real HTTP. Nhanh nhất. Dùng cho controller slice test.</li>
<li><code>TestRestTemplate</code>: real HTTP qua RestTemplate. Dùng integration test full stack.</li>
<li><code>WebTestClient</code>: cho reactive Spring WebFlux.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Test pyramid balance</h3>
<ul>
  <li><strong>70% unit</strong>: business logic, no Spring, no DB. Nhanh.</li>
  <li><strong>20% slice</strong>: controller serialize OK, repository query đúng SQL.</li>
  <li><strong>10% integration</strong>: happy path end-to-end qua full stack.</li>
</ul>
Ratio sai (50% integration) → CI 30+ phút, dev wait → giảm chất lượng.

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Test bug khó debug</strong>: integration test fail không rõ tại sao. Unit test fail biết ngay class nào.</li>
  <li><strong>H2 thay Testcontainers Postgres</strong> → Postgres-specific feature (JSONB, RETURNING, ILIKE) không có. Bug leak prod.</li>
  <li><strong>Test phụ thuộc thứ tự</strong> — state leak. Each test phải reset state.</li>
  <li><strong>Test tên generic</strong>: <code>test1()</code>, <code>test2()</code>. Fail message vô dụng.</li>
  <li><strong>Mock everything</strong> → test KHÔNG verify integration thật sự. Cân bằng.</li>
  <li><strong>Hardcode timestamp/UUID</strong> → flaky. Inject Clock/UUIDProvider.</li>
  <li><strong>Test gọi real external API</strong> (Stripe, Gmail) → flaky, expensive. Mock.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Unit test — Mockito',
          code: `@ExtendWith(MockitoExtension.class)
class PostServiceTest {
    @Mock PostRepository postRepo;
    @InjectMocks PostService postService;

    @Test
    void findById_returnsDto_whenFound() {
        // Arrange
        Post p = new Post(); p.setId(1L); p.setTitle("X");
        when(postRepo.findById(1L)).thenReturn(Optional.of(p));

        // Act
        PostDto dto = postService.findById(1L);

        // Assert
        assertThat(dto.title()).isEqualTo("X");
        verify(postRepo).findById(1L);
    }

    @Test
    void findById_throwsNotFound_whenMissing() {
        when(postRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.findById(99L))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("99");
    }
}`
        },
        {
          title: 'Slice test — @WebMvcTest controller only',
          code: `@WebMvcTest(PostController.class)
@Import(SecurityConfig.class)
class PostControllerTest {
    @Autowired MockMvc mvc;
    @MockBean PostService postService;

    @Test
    @WithMockUser
    void get_returns200() throws Exception {
        when(postService.findById(1L))
            .thenReturn(new PostDto(1L, "X", "x", "u", Instant.now()));

        mvc.perform(get("/api/v1/posts/1"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.title").value("X"));
    }

    @Test
    @WithMockUser
    void get_returns404() throws Exception {
        when(postService.findById(99L)).thenThrow(new EntityNotFoundException("Post 99"));

        mvc.perform(get("/api/v1/posts/99"))
           .andExpect(status().isNotFound())
           .andExpect(jsonPath("$.detail").value(containsString("99")));
    }

    @Test
    void post_returns401_whenUnauthenticated() throws Exception {
        mvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"title\\":\\"X\\",\\"body\\":\\"...\\"}"))
           .andExpect(status().isUnauthorized());
    }
}`
        },
        {
          title: 'Integration test — Testcontainers Postgres',
          code: `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class PostIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired TestRestTemplate rest;

    @Test
    void canCreateAndFetchPost() {
        // Register + login first to get token
        var auth = rest.postForObject("/api/v1/auth/register",
            new RegisterRequest("test@x.com", "password123"), AuthResponse.class);

        HttpHeaders h = new HttpHeaders();
        h.setBearerAuth(auth.token());

        // Create
        var req = new CreatePostRequest("Hello", "Body...");
        var created = rest.exchange("/api/v1/posts", HttpMethod.POST,
            new HttpEntity<>(req, h), PostDto.class).getBody();
        assertThat(created.id()).isNotNull();

        // Fetch
        var fetched = rest.getForObject("/api/v1/posts/" + created.id(), PostDto.class);
        assertThat(fetched.title()).isEqualTo("Hello");
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'Test strategy decision',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Test "service tính giảm giá theo nhiều rule" — loại test nào? Vì sao?
2. Test "controller trả 404 khi resource missing" — slice hay integration?
3. Test "transaction rollback khi exception" — phải dùng test gì? Mock có làm được?
4. Vì sao Testcontainers tốt hơn H2 in-memory cho repository test?
5. Test slow — strategy gì để CI không quá 5 phút?`
        }
      ]
    },

    {
      id: 'l-3-7-2',
      type: 'practice',
      title: 'Dockerize Spring Boot App',
      mentalModel: {
        vi: `<strong>Multi-stage Dockerfile</strong>: stage 1 build (JDK + Maven), stage 2 chỉ JRE. Image cuối ~200 MB thay vì 600+ MB.
<br/><br/>
Image production cần: KHÔNG Maven, KHÔNG source, KHÔNG root user, log ra stdout.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Layer caching trong Dockerfile</strong>
<code>COPY pom.xml</code> + <code>mvn dependency:go-offline</code> TRƯỚC <code>COPY src/</code>. Đổi code không invalidate layer dependency → build nhanh 10× cho thay đổi code.
<br/><br/>
<strong>2) Multi-stage build</strong>
Stage 1 (build): cần JDK + Maven (~600 MB). Stage 2 (runtime): chỉ JRE (~200 MB). COPY artifact từ stage 1 → stage 2. Image final nhẹ + KHÔNG có Maven (attack surface ít).
<br/><br/>
<strong>3) JVM trong container</strong>
Từ Java 10+, JVM tự detect container memory limit qua <code>cgroups</code>. Trước đó phải <code>-XX:+UseContainerSupport</code> manual. Set <code>-XX:MaxRAMPercentage=75.0</code> để JVM dùng 75% RAM container.
<br/><br/>
<strong>4) Non-root user</strong>
Container chạy root mặc định — security hole. <code>RUN addgroup -S app && adduser -S app -G app</code> + <code>USER app</code>. Nếu attacker escape, không có sudo.
<br/><br/>
<strong>5) HEALTHCHECK</strong>
Docker check health của container qua command. Combine với <code>/actuator/health</code>: <code>HEALTHCHECK CMD curl -f http://localhost:8080/actuator/health</code>. Orchestrator (K8s, ECS) dùng để biết container ready.
<br/><br/>
<strong>6) .dockerignore</strong>
Tránh COPY <code>target/</code>, <code>.git/</code>, <code>.idea/</code> vào build context. Build nhanh hơn, image nhỏ hơn. Quan trọng như .gitignore.
<br/><br/>
<strong>7) Tag strategy</strong>
KHÔNG dùng <code>latest</code> trong production — không biết version nào. Tag với git commit SHA hoặc semver: <code>bootcamp-app:1.2.3</code> hoặc <code>bootcamp-app:a3f2b1c</code>.`
      },
      theory: {
        vi: `<h3>The "Why" — Multi-stage vs single-stage?</h3>
<ul>
  <li><strong>Single-stage</strong>: Dockerfile đơn giản nhưng image 600+ MB, có Maven, có .git nếu COPY lung tung.</li>
  <li><strong>Multi-stage</strong>: phức tạp hơn 1 chút nhưng image ~200 MB, chỉ runtime cần thiết.</li>
</ul>
Production: LUÔN multi-stage.

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>COPY src/ trước COPY pom.xml</strong> → mỗi đổi code rebuild deps. Order matters!</li>
  <li><strong>FROM openjdk:21 (đã deprecated)</strong> → dùng eclipse-temurin (Adoptium).</li>
  <li><strong>Build jar trên dev, COPY vào image</strong> → image không reproducible. Build TRONG Dockerfile.</li>
  <li><strong>Quên .dockerignore</strong> → COPY toàn bộ project bao gồm node_modules nếu có.</li>
  <li><strong>EXPOSE 8080 mà không -p</strong> → port không expose ra host. EXPOSE chỉ document.</li>
  <li><strong>Hard-code secret trong ENV</strong> → leak qua docker history.</li>
  <li><strong>JVM heap 4G trong container 2G</strong> → OOMKilled. <code>-XX:MaxRAMPercentage</code>.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Dockerfile multi-stage hoàn chỉnh',
          lang: 'dockerfile',
          code: `# Stage 1: build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B           # cache deps layer
COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: runtime (chỉ JRE)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# JVM detect container memory + 75% heap
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Healthcheck cho Docker/K8s
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`
        },
        {
          title: '.dockerignore',
          lang: 'gitignore',
          code: `target/
.git/
.idea/
.vscode/
*.log
*.iml
node_modules/
dist/
.DS_Store
.env*`
        },
        {
          title: 'docker-compose.yml hoàn chỉnh (DB + app + MailHog)',
          lang: 'yaml',
          code: `services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: bootcamp
      POSTGRES_USER: bootcamp
      POSTGRES_PASSWORD: bootcamp
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bootcamp"]
      interval: 5s
      retries: 5

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI

  app:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/bootcamp
      SPRING_DATASOURCE_USERNAME: bootcamp
      SPRING_DATASOURCE_PASSWORD: bootcamp
      SPRING_MAIL_HOST: mailhog
      SPRING_MAIL_PORT: 1025
      APP_JWT_SECRET: \${JWT_SECRET:?must be set}
    depends_on:
      db:
        condition: service_healthy
      mailhog:
        condition: service_started
    restart: unless-stopped

volumes:
  pgdata:`
        },
        {
          title: 'GitHub Actions CI — test + build + Docker image',
          lang: 'yaml',
          code: `# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      # 'verify' chạy unit + integration test.
      # Testcontainers TỰ dựng Postgres trong test (cần Docker — runner ubuntu có sẵn).
      - name: Test + build
        run: ./mvnw -B verify

      - name: Build Docker image (chỉ build, chưa push)
        run: docker build -t devlog:ci .`
        }
      ],
      socraticPrompts: [
        {
          title: 'Production Docker best practices',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Multi-stage vs single-stage: vì sao multi-stage giảm size?
2. Vì sao image production KHÔNG nên chạy root user?
3. <code>EXPOSE 8080</code> có "mở port" thực sự không? Hay chỉ document?
4. Health check trong docker-compose vs trong app (<code>/actuator/health</code>) — khác gì?
5. Build image trên dev xong push lên prod — risk gì? CI/CD build ra sao?
6. <code>ENV JAVA_OPTS=...</code> vs <code>CMD java -Xmx...</code> — cách nào linh hoạt hơn?`
        }
      ]
    },

    {
      id: 'l-3-7-3',
      type: 'theory',
      title: 'Actuator, Observability & Production Logging',
      mentalModel: {
        vi: `<strong>Spring Actuator</strong> = built-in endpoints cho health/metrics/info. KHÔNG cần code thêm gì — chỉ add dependency.
<br/><br/>
3 pillars observability:
<ul>
<li><strong>Logs</strong>: text events.</li>
<li><strong>Metrics</strong>: number aggregates (count, gauge, histogram).</li>
<li><strong>Traces</strong>: request flow qua nhiều service (microservices).</li>
</ul>`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Actuator endpoints — quan trọng nhất</strong>
<ul>
<li><code>/actuator/health</code>: UP/DOWN + sub-checks (DB, Redis, disk).</li>
<li><code>/actuator/info</code>: app version, git commit.</li>
<li><code>/actuator/metrics</code>: list metrics + query.</li>
<li><code>/actuator/prometheus</code>: scrape format cho Prometheus.</li>
<li><code>/actuator/loggers</code>: change log level runtime.</li>
</ul>
<br/><br/>
<strong>2) Endpoint exposure</strong>
Default: chỉ <code>health</code> + <code>info</code> public. Khác phải explicit expose. Production: expose <code>prometheus</code> + <code>health</code>, secure rest với Spring Security.
<br/><br/>
<strong>3) Micrometer — metrics abstraction</strong>
Spring Boot dùng Micrometer (slf4j của metrics). Code dùng Micrometer API, runtime export sang Prometheus/Datadog/CloudWatch tùy config.
<br/><br/>
<strong>4) Custom metrics</strong>
<code>@Timed</code>, <code>@Counted</code> annotation. Hoặc programmatic: <code>meterRegistry.counter("orders.created").increment()</code>.
<br/><br/>
<strong>5) Structured logging</strong>
Plain text log: <code>2024-01-01 INFO User created: 42</code> — khó parse. JSON log: <code>{"ts":"...", "level":"INFO", "event":"user.created", "user_id":42}</code> — Datadog/Splunk parse được. Logback encoder <code>LogstashEncoder</code>.
<br/><br/>
<strong>6) MDC (Mapped Diagnostic Context)</strong>
ThreadLocal context cho log. Set <code>MDC.put("request_id", id)</code> đầu request → mọi log line trong request có <code>request_id</code> tự động. Tracing across log lines.
<br/><br/>
<strong>7) p50/p95/p99 latency</strong>
Mean lý tưởng nhưng misleading — 1 outlier kéo lên. Percentile:
<ul>
<li>p50 (median): 50% request nhanh hơn.</li>
<li>p95: 95% nhanh hơn. UX cảm nhận.</li>
<li>p99: 99% nhanh hơn. Tail latency — phát hiện slow query, GC pause.</li>
</ul>
Đo SLA bằng p99, không phải mean.`
      },
      theory: {
        vi: `<h3>The "Why" — Observability</h3>
<ul>
  <li><strong>Logs</strong>: "Tại sao request này fail?" — chi tiết, debug.</li>
  <li><strong>Metrics</strong>: "Có bao nhiêu request fail?" — aggregate, alert.</li>
  <li><strong>Traces</strong>: "Request đi qua đâu, chỗ nào chậm?" — distributed system.</li>
</ul>

<h3>Stack phổ biến</h3>
<ul>
  <li><strong>Logs</strong>: Datadog, Splunk, ELK (Elasticsearch + Logstash + Kibana), Loki.</li>
  <li><strong>Metrics</strong>: Prometheus + Grafana, Datadog, CloudWatch.</li>
  <li><strong>Traces</strong>: Jaeger, Zipkin, Datadog APM, OpenTelemetry.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Log everything DEBUG trong prod</strong> → spam log + perf hit + storage cost.</li>
  <li><strong>Log password / PII</strong> → GDPR violation, security breach.</li>
  <li><strong>Mean latency</strong> trong SLA → outliers giấu đi. Dùng p95/p99.</li>
  <li><strong>Expose mọi Actuator endpoint public</strong> → leak metrics, config. Secure.</li>
  <li><strong>Sync log to disk</strong> → IO block request thread. Async appender.</li>
  <li><strong>KHÔNG có request ID</strong> → debug cross-microservice impossible. MDC + propagate header.</li>
  <li><strong>KHÔNG monitor business metrics</strong> (signup rate, payment success) — chỉ có CPU/RAM. Track cả business KPI.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'pom.xml + application.yml cho Actuator + Prometheus',
          lang: 'xml',
          code: `<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>`
        },
        {
          title: 'application.yml — Actuator config',
          lang: 'yaml',
          code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers
  endpoint:
    health:
      show-details: when_authorized        # chỉ admin xem detail
      probes:
        enabled: true                       # K8s liveness/readiness
  metrics:
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
  info:
    git:
      mode: full

# Spring info — show ở /actuator/info
info:
  app:
    name: \${spring.application.name}
    version: 1.0.0`
        },
        {
          title: 'MDC + structured logging',
          code: `@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {
    private static final String HEADER = "X-Request-Id";
    private static final String MDC_KEY = "request_id";

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String id = req.getHeader(HEADER);
        if (id == null || id.isBlank()) id = UUID.randomUUID().toString();
        MDC.put(MDC_KEY, id);
        res.setHeader(HEADER, id);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.remove(MDC_KEY);   // PHẢI clear — tránh leak qua thread pool reuse
        }
    }
}

// Mọi log line trong request có request_id tự động:
// {"ts":"...", "level":"INFO", "request_id":"abc-123", "msg":"User created"}`
        },
        {
          title: 'Custom metric với Micrometer',
          code: `// SNIPPET minh họa Micrometer (@Timed + counter) — Order/CheckoutRequest/InsufficientStockException
// là class domain GIẢ ĐỊNH; trọng tâm là cách đặt metric, không phải logic checkout.
@Service
@RequiredArgsConstructor
public class OrderService {
    private final MeterRegistry registry;

    @Timed(value = "orders.checkout", percentiles = {0.5, 0.95, 0.99})
    public Order checkout(CheckoutRequest req) {
        try {
            Order order = doCheckout(req);          // business logic của bạn ở đây
            registry.counter("orders.success").increment();
            return order;
        } catch (InsufficientStockException e) {
            registry.counter("orders.failed", "reason", "out_of_stock").increment();
            throw e;
        }
    }
}

// Sample queries trong Prometheus:
//   rate(orders_success_total[5m])                  → orders/sec
//   histogram_quantile(0.95, orders_checkout_seconds_bucket)  → p95 latency
//   sum by (reason) (rate(orders_failed_total[5m]))  → failure breakdown`
        }
      ],
      socraticPrompts: [
        {
          title: 'Observability essentials',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. 3 pillars (Logs/Metrics/Traces) — mỗi cái trả lời câu hỏi gì?
2. Production chậm — bạn nhìn pillar nào TRƯỚC?
3. Distributed tracing (OpenTelemetry) — khi nào cần?
4. Log structured (JSON) vs plaintext — production chọn? Tại sao?
5. Metric "p99 latency" nghĩa gì? Khác mean ra sao? Tại sao p99 quan trọng hơn?
6. Alert phải dùng metric nào? Mean, p95, hay p99?`
        }
      ]
    }
  ],
  references: [
    { title: 'JUnit 5 User Guide', url: 'https://junit.org/junit5/docs/current/user-guide/' },
    { title: 'Mockito Documentation', url: 'https://site.mockito.org/' },
    { title: 'Testcontainers Java', url: 'https://java.testcontainers.org/' },
    { title: 'Spring Boot Testing Reference', url: 'https://docs.spring.io/spring-boot/docs/3.3.x/reference/html/features.html#features.testing' }
  ]

}
