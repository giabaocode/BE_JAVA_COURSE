// Module 3.6 — Redis + RabbitMQ (Caching + Messaging Foundations)
// Lý do: production Java backend nào cũng cần ít nhất 1 trong 2.
export default {
  id: 'mod-3-6',
  title: 'Redis + RabbitMQ — Caching & Message Broker',
  lessons: [
    {
      id: 'l-3-6-1',
      type: 'theory',
      title: 'Redis Mental Model — In-Memory Data Structure Server',
      subtitle: { vi: 'Redis KHÔNG phải "cache" — nó là <strong>server data structure trong RAM</strong>. Hiểu bản chất → biết khi nào dùng cái nào.' },
      mentalModel: {
        vi: `Redis = "Java HashMap chạy trên 1 server riêng, mọi app gọi qua network". Đơn giản vậy thôi.
<br/><br/>
Nhưng có 5 kiểu dữ liệu thật khôn:
<ul>
  <li><strong>String</strong>: key → value. Cache đơn giản, counter (INCR atomic).</li>
  <li><strong>Hash</strong>: key → field/value pairs. User profile (uid:42 → {name, email, age}).</li>
  <li><strong>List</strong>: linked list 2-way. Queue, recent activity log.</li>
  <li><strong>Set</strong>: unordered unique. Tags, followers.</li>
  <li><strong>Sorted Set (ZSet)</strong>: set + score. Leaderboard (most powerful).</li>
</ul>
Mọi operation là <strong>O(1) hoặc O(log N)</strong> vì in-memory + structure tốt. Đây là lý do Redis xử lý 100k ops/sec với 1 thread.`
      },
      underTheHood: {
        vi: `<h3>Vì sao Redis NHANH?</h3>
<ul>
  <li><strong>In-RAM</strong>: không có disk seek. RAM access ~ 100ns.</li>
  <li><strong>Single-threaded event loop</strong>: không có lock contention, no context switch. Tất cả command serial → atomic by default.</li>
  <li><strong>Network is bottleneck</strong>: thường network round-trip (~1ms) chiếm phần lớn latency, không phải Redis. Dùng <strong>pipelining</strong> hoặc <strong>Lua script</strong> để batch.</li>
</ul>

<h3>Persistence — nếu server crash?</h3>
<ul>
  <li><strong>RDB</strong>: snapshot disk mỗi N giây. Crash → mất N giây cuối. Restart nhanh.</li>
  <li><strong>AOF</strong>: append-only log mỗi command. Crash → mất 1 giây cuối (config fsync). Restart chậm hơn (replay log).</li>
  <li><strong>Both</strong>: production thường bật cả 2.</li>
</ul>

<h3>Eviction — khi RAM đầy</h3>
<code>maxmemory-policy</code>:
<ul>
  <li><code>noeviction</code>: reject write mới (default — DANGEROUS).</li>
  <li><code>allkeys-lru</code>: xóa least-recently-used.</li>
  <li><code>volatile-lru</code>: chỉ xóa key có TTL.</li>
  <li><code>allkeys-lfu</code>: least-frequently-used (Redis 4+).</li>
</ul>

<h3>TTL (Time-To-Live)</h3>
<code>SET key value EX 60</code> = expire sau 60 giây. KEY cache PHẢI có TTL — nếu không Redis sẽ phình mãi.

<h3>Pub/Sub vs Stream</h3>
<ul>
  <li><strong>PUBLISH/SUBSCRIBE</strong>: fire-and-forget. Subscriber không online → mất message. KHÔNG dùng cho critical events.</li>
  <li><strong>Stream</strong> (Redis 5+): persistent log, consumer group, message ack. Giống Kafka mini.</li>
</ul>

<h3>Khi nào KHÔNG dùng Redis</h3>
<ul>
  <li>Dữ liệu phải durable (ngân hàng, đơn hàng) — dùng Postgres.</li>
  <li>Truy vấn phức tạp (JOIN, GROUP BY) — dùng SQL.</li>
  <li>Data &gt; RAM size — Redis Cluster hoặc disk-based DB.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Khi nào dùng Redis trong Spring Boot app?</h3>
<ul>
  <li><strong>Cache</strong>: query DB tốn 200ms → cache 5 phút, ms cho phần lớn request.</li>
  <li><strong>Session store</strong>: load-balance &gt;1 instance → session phải share.</li>
  <li><strong>Rate limiting</strong>: <code>INCR ip:userIp EX 60</code> → giới hạn 100 req/phút.</li>
  <li><strong>Distributed lock</strong>: <code>SET key value NX EX 30</code> → chỉ 1 instance làm cron.</li>
  <li><strong>Leaderboard</strong>: ZSet score = điểm, ORDER BY score DESC O(log N).</li>
  <li><strong>Queue đơn giản</strong>: LPUSH + BRPOP (block read). Cho workload nhẹ — workload nặng dùng RabbitMQ/Kafka.</li>
</ul>

<h3>Commands cần thuộc (Top 20)</h3>
<pre># String
SET key value [EX seconds]
GET key
DEL key
INCR counter            # atomic +1
EXPIRE key seconds      # set TTL
TTL key                 # còn bao lâu

# Hash
HSET user:42 name "An" age 25
HGET user:42 name
HGETALL user:42

# List (LIFO push left, queue push right)
LPUSH queue task1
RPOP queue              # remove from right (FIFO)
BRPOP queue 5           # block tới 5s nếu rỗng

# Set
SADD tags java spring docker
SISMEMBER tags java     # check membership O(1)
SINTER tag1 tag2        # intersection

# Sorted Set
ZADD leaderboard 100 alice 200 bob
ZRANGE leaderboard 0 9 REV WITHSCORES   # top 10

# Misc
KEYS pattern*           # KHÔNG dùng production — block server
SCAN 0 MATCH user:*     # iterate an toàn
FLUSHDB                 # xóa sạch DB hiện tại</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>KEYS *</strong> trên DB 1M keys → block Redis nhiều giây → all client timeout. Dùng SCAN.</li>
  <li><strong>Quên TTL</strong> trên cache key → Redis phình tới khi OOM → eviction xóa key quan trọng.</li>
  <li><strong>Cache invalidation sai</strong>: UPDATE DB mà quên DELETE cache → stale data.</li>
  <li><strong>Race trong cache pattern</strong>: 2 request cùng cache miss → 2 query DB → cache stampede. Solution: distributed lock hoặc <em>request coalescing</em>.</li>
  <li><strong>Dùng PubSub cho critical event</strong>: subscriber offline → mất. Dùng Stream hoặc RabbitMQ.</li>
  <li><strong>Lưu object Java serialized</strong>: serial format đổi giữa version → cache poison. Dùng JSON.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Tự suy luận Redis design choices',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Redis single-threaded sao xử lý 100k ops/sec mà MySQL multi-thread chỉ vài k? (No lock, in-RAM, network bottleneck.)
2. Bạn có 1 cron chạy mỗi 5 phút, deploy 3 instance — làm sao chỉ 1 chạy? (Distributed lock với SET NX EX.)
3. Cache miss đồng thời 1000 request → DB tải 1000× — tránh sao? (Stampede protection: lock, jitter TTL, request coalescing.)
4. App có 10 service đều cần "user vừa làm gì" — Redis Stream vs PubSub khác gì?
5. Redis RAM 16GB, data 30GB — chiến lược? (Eviction LRU, hot key trong Redis, cold trong DB.)`
        }
      ],
      keyTakeaways: {
        vi: [
          '5 data structure: String, Hash, List, Set, Sorted Set. Mỗi cái có use case rõ.',
          'Single-thread + in-RAM → 100k ops/sec. Network là bottleneck → pipeline + Lua.',
          'KHÔNG dùng KEYS production. Dùng SCAN.',
          'Mọi cache key PHẢI có TTL. Stampede protection cho key quan trọng.',
          'PubSub fire-and-forget; Stream persistent. Critical event → Stream/RabbitMQ.'
        ]
      }
    },

    {
      id: 'l-3-6-2',
      type: 'practice',
      title: 'Spring Data Redis — Caching + Distributed Lock',
      subtitle: { vi: 'Tích hợp Redis vào Spring Boot. 2 pattern thực chiến: @Cacheable + distributed lock.' },
      mentalModel: {
        vi: `Spring Data Redis cung cấp 2 abstraction:
<ul>
  <li><strong>RedisTemplate / StringRedisTemplate</strong>: low-level, gọi command thẳng.</li>
  <li><strong>@Cacheable / @CacheEvict</strong>: high-level annotation. Spring lo cache key + TTL.</li>
</ul>
Cao tầng vs thấp tầng — chọn @Cacheable cho read-heavy queries, RedisTemplate cho operation phức tạp (lock, counter, leaderboard).`
      },
      underTheHood: {
        vi: `<h3>Setup</h3>
<pre>// pom.xml
&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-cache&lt;/artifactId&gt;
&lt;/dependency&gt;

// docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

// application.yml
spring:
  data:
    redis:
      host: localhost
      port: 6379
  cache:
    type: redis
    redis:
      time-to-live: 300000   # 5 minutes default</pre>

<h3>Pattern 1: @Cacheable</h3>
<pre>@Service
public class ProductService {
    private final ProductRepository repo;

    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @CacheEvict(value = "products", key = "#product.id")
    public Product update(Product product) {
        return repo.save(product);
    }

    @CacheEvict(value = "products", allEntries = true)
    public void deleteAll() {
        repo.deleteAll();
    }
}</pre>

<strong>Cách hoạt động</strong>: lần 1 gọi <code>findById(42)</code> → cache miss → query DB → lưu cache. Lần 2 → cache hit, KHÔNG query DB. <code>update</code> xóa cache → lần read tiếp theo refresh.

<h3>Pattern 2: Distributed Lock (manual)</h3>
<pre>@Service
public class CronJobService {
    private final StringRedisTemplate redis;

    @Scheduled(cron = "0 0 * * * *")   // mỗi giờ
    public void hourlyJob() {
        String lockKey = "lock:hourly-job";
        String token = UUID.randomUUID().toString();

        // SET NX EX 300 — chỉ 1 instance acquire được
        Boolean acquired = redis.opsForValue()
            .setIfAbsent(lockKey, token, Duration.ofMinutes(5));

        if (Boolean.TRUE.equals(acquired)) {
            try {
                doWork();
            } finally {
                // Chỉ release nếu token vẫn của mình (tránh release lock người khác)
                String current = redis.opsForValue().get(lockKey);
                if (token.equals(current)) {
                    redis.delete(lockKey);
                }
            }
        }
    }
}</pre>

<strong>Trade-off của distributed lock</strong>: nếu work mất &gt; 5 phút → lock expire → instance khác cũng vào. Solution: hoặc tăng TTL, hoặc periodically renew (Redisson library tự làm).

<h3>Pattern 3: Rate Limiting</h3>
<pre>@Component
public class RateLimiter {
    private final StringRedisTemplate redis;

    public boolean allow(String userId, int limit, Duration window) {
        String key = "rate:" + userId + ":" + (Instant.now().getEpochSecond() / window.toSeconds());
        Long count = redis.opsForValue().increment(key);
        if (count == 1L) {
            redis.expire(key, window);
        }
        return count <= limit;
    }
}</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>@Cacheable trên method có side effect</strong>: cache hit → side effect không chạy. Chỉ dùng cho pure read.</li>
  <li><strong>@Cacheable với param mutable</strong> (DTO không override equals/hashCode) → key compute sai.</li>
  <li><strong>Distributed lock không có UUID token</strong>: instance A acquire, instance B release nhầm sau lock expire → chaos.</li>
  <li><strong>setIfAbsent KHÔNG có EX</strong>: nếu app crash trước DELETE → lock kẹt vĩnh viễn. <em>Luôn</em> SET NX EX cùng lúc.</li>
  <li><strong>JSON serializer mặc định (Jackson)</strong>: thay đổi class structure → cache poison khi deserialize. Version key (<code>v2:products:42</code>) khi đổi schema.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Cache findById Product',
          prompt: 'ProductRepository có method <code>findById(Long)</code> mất 200ms. Thêm @Cacheable để lần 2 trả &lt;1ms. Configure TTL = 10 phút.',
          hints: [
            '@EnableCaching trên main class.',
            '@Cacheable(value = "products", key = "#id") trên service method.',
            'application.yml: spring.cache.redis.time-to-live: 600000.'
          ],
          solution: {
            code: `// 1) Enable caching
@SpringBootApplication
@EnableCaching
public class App { ... }

// 2) Service
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repo;

    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new NotFoundException(id));
    }

    @CacheEvict(value = "products", key = "#product.id")
    public Product update(Product product) {
        return repo.save(product);
    }
}

// 3) application.yml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 600000   # 10 phút
      cache-null-values: false
      key-prefix: "app:"

// 4) Verify với Redis CLI
> KEYS "app:products::*"
1) "app:products::42"
> TTL "app:products::42"
(integer) 587   # ~10 phút - chục giây đã trôi`,
            lang: 'java',
            complexityVi: 'Cache hit: O(1) network round-trip ~1ms. Cache miss: 200ms.',
            explanationVi: '@EnableCaching kích hoạt AOP proxy quanh method. Spring tự generate key từ tham số (mặc định) hoặc dùng SpEL. <code>cache-null-values: false</code> tránh cache poison khi DB trả empty. <code>key-prefix</code> namespace để 2 app share Redis không xung đột.'
          }
        },
        {
          title: 'Distributed lock cho cron',
          prompt: 'Cron <code>@Scheduled(cron = "0 0 * * * *")</code> gửi báo cáo hàng giờ. Deploy 3 instance → KHÔNG được gửi 3 lần. Dùng Redis SET NX EX.',
          hints: [
            'StringRedisTemplate.opsForValue().setIfAbsent(key, token, ttl).',
            'Token = UUID, release chỉ khi token còn match.'
          ],
          solution: {
            code: `@Service
@RequiredArgsConstructor
@Slf4j
public class HourlyReportJob {
    private final StringRedisTemplate redis;
    private final ReportService reports;

    private static final Duration LOCK_TTL = Duration.ofMinutes(10);
    private static final String LOCK_KEY = "lock:hourly-report";

    @Scheduled(cron = "0 0 * * * *")
    public void sendHourlyReport() {
        String token = UUID.randomUUID().toString();

        Boolean acquired = redis.opsForValue()
            .setIfAbsent(LOCK_KEY, token, LOCK_TTL);

        if (!Boolean.TRUE.equals(acquired)) {
            log.info("Another instance is sending report, skip");
            return;
        }

        try {
            log.info("Acquired lock, sending report");
            reports.generateAndSend();
        } finally {
            // Release: chỉ DELETE nếu lock vẫn của mình
            // (nếu work quá TTL, lock đã expire + instance khác lấy → KHÔNG xóa)
            String current = redis.opsForValue().get(LOCK_KEY);
            if (token.equals(current)) {
                redis.delete(LOCK_KEY);
                log.info("Released lock");
            } else {
                log.warn("Lock no longer owned, skip release");
            }
        }
    }
}`,
            lang: 'java',
            complexityVi: 'SET NX + DEL: 2 round-trip Redis ~ 2ms.',
            explanationVi: 'setIfAbsent map sang Redis command <code>SET key value NX EX ttl</code> — atomic SET-if-not-exists với expiry. Token UUID để release đúng instance — race-safe khi lock expire mid-work. Production: dùng <code>Redisson</code> library cho lock có auto-renew + reentrant.'
          }
        },
        {
          title: 'Rate limiting per user',
          prompt: 'Endpoint <code>POST /api/comments</code> — giới hạn 10 comment / phút / user. Trả 429 nếu vượt.',
          hints: [
            'Key: "rate:" + userId + ":" + (timestamp / 60).',
            'INCR + EXPIRE (chỉ EXPIRE lần đầu — counter = 1).'
          ],
          solution: {
            code: `@Component
@RequiredArgsConstructor
public class RateLimiter {
    private final StringRedisTemplate redis;

    public boolean allow(String userId, int limit, Duration window) {
        long bucket = Instant.now().getEpochSecond() / window.toSeconds();
        String key = "rate:" + userId + ":" + bucket;

        Long count = redis.opsForValue().increment(key);
        if (count == 1L) {
            // First hit in this window — set TTL
            redis.expire(key, window);
        }
        return count <= limit;
    }
}

// Interceptor
@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {
    private final RateLimiter limiter;

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        String userId = req.getHeader("X-User-Id");
        if (userId == null) return true;

        if (!limiter.allow(userId, 10, Duration.ofMinutes(1))) {
            res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            res.setHeader("Retry-After", "60");
            return false;
        }
        return true;
    }
}`,
            lang: 'java',
            complexityVi: 'INCR + EXPIRE: 2 round-trip ~ 2ms.',
            explanationVi: '<em>Fixed window counter</em>: chia thời gian thành bucket cố định. INCR atomic → race-safe. EXPIRE chỉ lần đầu để TTL không reset mỗi lần increment. Limitation: burst ở boundary (req 1 vào cuối phút N + req 2 ngay đầu phút N+1 → có thể 20 req trong 1 giây thực). Sliding window phức tạp hơn — dùng sorted set.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          '@Cacheable cho read-heavy. @CacheEvict khi write. TTL bắt buộc.',
          'Distributed lock: SET NX EX với UUID token. Release safe-by-token.',
          'Rate limit: INCR + EXPIRE chỉ lần đầu (counter==1).',
          'Cache invalidation là bài toán khó — chấp nhận stale ngắn hơn race.'
        ]
      }
    },

    {
      id: 'l-3-6-3',
      type: 'theory',
      title: 'RabbitMQ Mental Model — Message Broker, không phải DB',
      subtitle: { vi: 'RabbitMQ là <strong>bưu điện</strong>. Producer gửi thư, broker giữ + route, consumer nhận. Async + decouple.' },
      mentalModel: {
        vi: `4 thành phần cốt lõi:
<ul>
  <li><strong>Producer</strong>: app gửi message.</li>
  <li><strong>Exchange</strong>: "bưu điện" — nhận message, quyết định gửi queue nào.</li>
  <li><strong>Queue</strong>: hộp thư, giữ message đến khi consumer lấy.</li>
  <li><strong>Consumer</strong>: app đọc message từ queue.</li>
</ul>
Message qua đường <strong>Producer → Exchange → (binding rule) → Queue → Consumer</strong>.
<br/><br/>
Vì sao tách Exchange và Queue? → flexibility. 1 exchange có thể fanout 5 queue. 1 queue có thể nhận từ 3 exchange. Routing rule (binding) định cấu hình ngoài code.`
      },
      underTheHood: {
        vi: `<h3>4 loại Exchange</h3>
<ul>
  <li><strong>Direct</strong>: route theo <code>routing_key</code> exact match. Producer set "order.created", queue bind cùng key → nhận.</li>
  <li><strong>Fanout</strong>: broadcast tới MỌI queue bound. Không quan tâm routing_key. Use case: event-driven notify nhiều service.</li>
  <li><strong>Topic</strong>: route theo wildcard pattern. Key "order.created.vn" match pattern "order.*.vn" hoặc "order.created.#".</li>
  <li><strong>Headers</strong>: route theo header. Hiếm dùng.</li>
</ul>

<h3>Acknowledgement — đảm bảo không mất message</h3>
<ul>
  <li><strong>Auto ack</strong>: consumer nhận message → broker xóa ngay. Consumer crash → mất message.</li>
  <li><strong>Manual ack</strong>: consumer xử lý xong → gọi <code>basicAck</code>. Crash giữa chừng → broker re-deliver.</li>
  <li><strong>basicNack / reject</strong>: consumer từ chối, request re-queue hoặc dead-letter.</li>
</ul>

<h3>Durability — không mất khi broker restart</h3>
<ul>
  <li><strong>Queue durable=true</strong>: queue survive broker restart.</li>
  <li><strong>Message persistent=true</strong>: message ghi disk. Mất khi disk fail.</li>
  <li>Cả 2 phải bật để message survive.</li>
</ul>

<h3>Dead Letter Queue (DLQ)</h3>
Message fail nhiều lần / TTL hết → route sang DLQ thay vì loop vô tận. Pattern:
<ul>
  <li>Queue main: TTL 30s, dead-letter-exchange = "dlx".</li>
  <li>Queue dlq: bind vào dlx, không TTL.</li>
  <li>Message fail → re-queue → 30s sau qua dlq (manual review).</li>
</ul>

<h3>Khi nào dùng RabbitMQ vs Kafka vs Redis Stream?</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px">Tool</th>
<th style="border:1px solid #ccc;padding:6px">Best for</th>
<th style="border:1px solid #ccc;padding:6px">Throughput</th>
<th style="border:1px solid #ccc;padding:6px">Retention</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px">RabbitMQ</td><td style="border:1px solid #ccc;padding:6px">Task queue, request-reply</td><td style="border:1px solid #ccc;padding:6px">~50k/s</td><td style="border:1px solid #ccc;padding:6px">Delete on consume</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Kafka</td><td style="border:1px solid #ccc;padding:6px">Event streaming, log</td><td style="border:1px solid #ccc;padding:6px">~1M/s</td><td style="border:1px solid #ccc;padding:6px">Days/weeks</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Redis Stream</td><td style="border:1px solid #ccc;padding:6px">Light event, đã có Redis</td><td style="border:1px solid #ccc;padding:6px">~100k/s</td><td style="border:1px solid #ccc;padding:6px">Configurable</td></tr>
</table>
Khởi đầu: RabbitMQ. Scale lên event-sourcing / analytics: Kafka.`
      },
      theory: {
        vi: `<h3>Use cases trong backend Java</h3>
<ul>
  <li><strong>Async work</strong>: user click "Order" → API trả 200 ngay → message vào queue → worker xử lý payment, gửi email, update inventory.</li>
  <li><strong>Decouple service</strong>: OrderService publish "OrderCreated", PaymentService + InventoryService + NotificationService subscribe — không gọi nhau trực tiếp.</li>
  <li><strong>Buffer load spike</strong>: 10k order/giây vào queue, worker xử lý 1k/giây → queue sẽ giảm sau peak. KHÔNG crash DB.</li>
  <li><strong>Retry safely</strong>: payment provider down → message re-queue → tự retry sau N giây.</li>
  <li><strong>Scheduled delivery</strong>: TTL queue → message "expire" sang queue khác sau N giây.</li>
</ul>

<h3>Setup nhanh với Docker</h3>
<pre>// docker-compose.yml
services:
  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"     # AMQP
      - "15672:15672"   # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin</pre>
Mở <code>http://localhost:15672</code> để xem queue + monitor.

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Auto-ack production</strong>: consumer crash → mất message. <em>Luôn</em> manual ack.</li>
  <li><strong>Queue không durable</strong>: broker restart → queue biến mất + message theo.</li>
  <li><strong>Không có DLQ</strong>: message fail → re-queue forever → infinite loop. Set max-retries + dead-letter.</li>
  <li><strong>Message quá lớn (&gt; 1MB)</strong>: RabbitMQ chậm. Lưu blob ở S3, message chỉ chứa URL.</li>
  <li><strong>Một queue handle tất cả</strong>: queue cao priority bị block bởi message chậm. Tách queue theo priority/throughput.</li>
  <li><strong>Producer không confirm publish</strong>: <code>publish</code> trả ngay khi message vào TCP buffer — broker chưa nhận. Bật <code>publisher-confirms</code> trong Spring AMQP.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Architecture decisions với message broker',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. OrderService gửi email khi tạo đơn — vì sao KHÔNG gọi EmailService trực tiếp REST?
2. Email service down 5 phút — chuyện gì xảy ra nếu (a) gọi direct REST vs (b) gửi qua queue?
3. Message "OrderCreated" bị fail xử lý — re-try mãi mãi vs DLQ — chọn cái nào? Khi nào?
4. 100k order/giây, worker xử lý 1k/giây — RabbitMQ có scale được? Queue có bị OOM?
5. Order critical (PaymentEvent) và Order log (AuditEvent) — chung queue hay khác?
6. RabbitMQ vs Redis PubSub vs database polling — khi nào dùng cái nào?`
        }
      ],
      keyTakeaways: {
        vi: [
          '4 thành phần: Producer → Exchange → Queue → Consumer.',
          '4 loại exchange: direct, fanout, topic, headers. 90% case dùng direct/topic.',
          'Manual ack + durable queue + persistent message = đảm bảo không mất.',
          'DLQ cho message fail. Không có DLQ = infinite loop.',
          'RabbitMQ cho task queue; Kafka cho event streaming hàng triệu/giây.'
        ]
      }
    },

    {
      id: 'l-3-6-4',
      type: 'practice',
      title: 'Spring AMQP — Producer, Consumer, DLQ',
      subtitle: { vi: 'Code thật: gửi event OrderCreated qua RabbitMQ, consumer xử lý + DLQ cho fail case.' },
      mentalModel: {
        vi: `Spring AMQP wrap RabbitMQ với annotation đẹp:
<ul>
  <li><code>RabbitTemplate</code> để gửi (producer).</li>
  <li><code>@RabbitListener</code> để nhận (consumer).</li>
  <li><code>@Bean Queue/Exchange/Binding</code> để declare topology.</li>
</ul>
Annotation hide AMQP complexity nhưng vẫn cho phép tune (ack mode, prefetch, retry).`
      },
      underTheHood: {
        vi: `<h3>Setup pom.xml + application.yml</h3>
<pre>// pom.xml
&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-amqp&lt;/artifactId&gt;
&lt;/dependency&gt;

// application.yml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: admin
    password: admin
    publisher-confirm-type: correlated   # confirm publish
    publisher-returns: true
    listener:
      simple:
        acknowledge-mode: manual
        prefetch: 10
        retry:
          enabled: true
          max-attempts: 3
          initial-interval: 1000
          multiplier: 2.0</pre>

<h3>Declare topology</h3>
<pre>@Configuration
public class RabbitConfig {
    public static final String ORDER_EXCHANGE = "order.exchange";
    public static final String ORDER_CREATED_QUEUE = "order.created";
    public static final String ORDER_CREATED_KEY = "order.created";
    public static final String DLX = "order.dlx";
    public static final String DLQ = "order.dlq";

    @Bean
    DirectExchange orderExchange() {
        return new DirectExchange(ORDER_EXCHANGE, true, false);
    }

    @Bean
    Queue orderCreatedQueue() {
        return QueueBuilder.durable(ORDER_CREATED_QUEUE)
            .withArgument("x-dead-letter-exchange", DLX)
            .withArgument("x-dead-letter-routing-key", "order.failed")
            .build();
    }

    @Bean
    Binding orderCreatedBinding(Queue orderCreatedQueue, DirectExchange orderExchange) {
        return BindingBuilder.bind(orderCreatedQueue)
            .to(orderExchange)
            .with(ORDER_CREATED_KEY);
    }

    // DLQ topology
    @Bean DirectExchange dlx() { return new DirectExchange(DLX, true, false); }
    @Bean Queue dlq() { return QueueBuilder.durable(DLQ).build(); }
    @Bean Binding dlqBinding(Queue dlq, DirectExchange dlx) {
        return BindingBuilder.bind(dlq).to(dlx).with("order.failed");
    }

    // JSON converter — gửi POJO thay byte[]
    @Bean MessageConverter jsonConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean RabbitTemplate rabbitTemplate(ConnectionFactory cf, MessageConverter conv) {
        RabbitTemplate t = new RabbitTemplate(cf);
        t.setMessageConverter(conv);
        return t;
    }
}</pre>

<h3>Producer</h3>
<pre>@Service
@RequiredArgsConstructor
public class OrderService {
    private final RabbitTemplate rabbit;
    private final OrderRepository repo;

    @Transactional
    public Order createOrder(CreateOrderRequest req) {
        Order order = repo.save(new Order(req));

        // Publish event AFTER DB commit
        rabbit.convertAndSend(
            RabbitConfig.ORDER_EXCHANGE,
            RabbitConfig.ORDER_CREATED_KEY,
            new OrderCreatedEvent(order.getId(), order.getUserId(), order.getAmount())
        );
        return order;
    }
}</pre>

<h3>Consumer với manual ack</h3>
<pre>@Component
@Slf4j
@RequiredArgsConstructor
public class OrderCreatedListener {
    private final EmailService emails;

    @RabbitListener(queues = RabbitConfig.ORDER_CREATED_QUEUE)
    public void handle(OrderCreatedEvent event, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            log.info("Processing order {}", event.orderId());
            emails.sendOrderConfirmation(event);
            channel.basicAck(tag, false);
        } catch (TransientException e) {
            log.warn("Transient fail, requeue", e);
            channel.basicNack(tag, false, true);   // requeue
        } catch (Exception e) {
            log.error("Permanent fail, send to DLQ", e);
            channel.basicNack(tag, false, false);  // no requeue → DLQ
        }
    }
}</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>Publish trước DB commit</strong>: consumer xử lý xong nhưng DB fail rollback → inconsistency. Dùng <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> hoặc transactional outbox pattern.</li>
  <li><strong>Auto-ack</strong>: consumer exception → message bị consume mất. Manual ack bắt buộc.</li>
  <li><strong>Quên basicNack(requeue=false) cho permanent error</strong>: bug code → message loop forever.</li>
  <li><strong>Prefetch quá cao</strong>: 1 consumer giữ 1000 message → các consumer khác đói. Mặc định 250 — production thường 10-50.</li>
  <li><strong>Message JSON không có version field</strong>: schema thay đổi → consumer crash. Bao gồm <code>version: "1"</code> trong payload.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Topology + JSON producer',
          prompt: 'Setup exchange + queue + binding cho event "user.registered". Producer gửi <code>UserRegisteredEvent(userId, email, registeredAt)</code> dạng JSON.',
          hints: [
            '@Configuration với DirectExchange + Queue + Binding.',
            'Jackson2JsonMessageConverter cho POJO ↔ JSON.',
            'rabbitTemplate.convertAndSend(exchange, routingKey, payload).'
          ],
          solution: {
            code: `// 1) Topology
@Configuration
public class UserRabbitConfig {
    public static final String EXCHANGE = "user.exchange";
    public static final String QUEUE = "user.registered";
    public static final String KEY = "user.registered";

    @Bean DirectExchange exchange() {
        return new DirectExchange(EXCHANGE, true, false);
    }

    @Bean Queue queue() {
        return QueueBuilder.durable(QUEUE).build();
    }

    @Bean Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(KEY);
    }

    @Bean MessageConverter jsonConverter() {
        return new Jackson2JsonMessageConverter();
    }
}

// 2) Event payload
public record UserRegisteredEvent(
    Long userId,
    String email,
    Instant registeredAt,
    String version
) {
    public UserRegisteredEvent(Long userId, String email, Instant ts) {
        this(userId, email, ts, "1");
    }
}

// 3) Producer
@Service
@RequiredArgsConstructor
public class UserService {
    private final RabbitTemplate rabbit;
    private final UserRepository repo;

    @Transactional
    public User register(RegisterRequest req) {
        User user = repo.save(new User(req));

        // Publish AFTER save (still in same tx — consumer may run before commit!)
        // Tốt hơn: @TransactionalEventListener(phase = AFTER_COMMIT)
        rabbit.convertAndSend(
            UserRabbitConfig.EXCHANGE,
            UserRabbitConfig.KEY,
            new UserRegisteredEvent(user.getId(), user.getEmail(), Instant.now())
        );
        return user;
    }
}`,
            lang: 'java',
            complexityVi: 'Publish ~ 1ms local network.',
            explanationVi: 'Topology defined as Spring beans — start app sẽ auto-declare nếu chưa có. JSON converter để POJO serialize tự động. Version field trong event giúp evolve schema mà không break consumer cũ.'
          }
        },
        {
          title: 'Consumer với DLQ',
          prompt: 'Listen queue "user.registered". Gửi welcome email. Nếu email service throw <code>TransientEmailException</code> → retry; throw <code>PermanentEmailException</code> → DLQ.',
          hints: [
            '@RabbitListener với manual ack mode.',
            'Inject Channel + @Header DELIVERY_TAG.',
            'basicAck / basicNack(requeue=true/false) tuỳ exception type.'
          ],
          solution: {
            code: `// application.yml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: manual

// Add DLQ to UserRabbitConfig
public static final String DLX = "user.dlx";
public static final String DLQ = "user.dlq";

@Bean Queue queueWithDlq() {
    return QueueBuilder.durable(QUEUE)
        .withArgument("x-dead-letter-exchange", DLX)
        .withArgument("x-dead-letter-routing-key", "user.failed")
        .build();
}

@Bean DirectExchange dlx() { return new DirectExchange(DLX, true, false); }
@Bean Queue dlq() { return QueueBuilder.durable(DLQ).build(); }
@Bean Binding dlqBinding(Queue dlq, DirectExchange dlx) {
    return BindingBuilder.bind(dlq).to(dlx).with("user.failed");
}

// Consumer
@Component
@Slf4j
@RequiredArgsConstructor
public class WelcomeEmailListener {
    private final EmailService emails;

    @RabbitListener(queues = UserRabbitConfig.QUEUE)
    public void handle(
        UserRegisteredEvent event,
        Channel channel,
        @Header(AmqpHeaders.DELIVERY_TAG) long tag,
        @Header(value = "x-retry-count", required = false, defaultValue = "0") int retries
    ) throws IOException {
        try {
            log.info("Sending welcome email to {}, retry={}", event.email(), retries);
            emails.sendWelcome(event);
            channel.basicAck(tag, false);
        } catch (TransientEmailException e) {
            if (retries >= 3) {
                log.error("Max retries reached, send to DLQ", e);
                channel.basicNack(tag, false, false);
            } else {
                log.warn("Transient fail, requeue", e);
                channel.basicNack(tag, false, true);
            }
        } catch (PermanentEmailException e) {
            log.error("Permanent fail (invalid email), send to DLQ", e);
            channel.basicNack(tag, false, false);
        } catch (Exception e) {
            log.error("Unexpected, send to DLQ to investigate", e);
            channel.basicNack(tag, false, false);
        }
    }
}`,
            lang: 'java',
            complexityVi: 'Consumer process O(1) mỗi message.',
            explanationVi: 'Manual ack: chỉ ack khi xử lý xong → crash mid-process sẽ re-deliver. basicNack với requeue=false + DLQ binding → message vào DLQ thay vì loop. Retry count tracked qua header (broker không native — Spring AMQP retry config làm tự động trong-memory cho startup). Production: dùng spring-retry hoặc track count trong message header explicit.'
          }
        }
      ],
      socraticPrompts: [
        {
          title: 'Outbox pattern — vì sao cần?',
          prompt: `Code mẫu trên có 1 bug subtle: <code>repo.save() + rabbit.convertAndSend()</code> trong cùng @Transactional. Hỏi tôi:
1. Nếu DB commit nhưng publish fail (RabbitMQ down) — chuyện gì xảy ra? (Save thành công, event mất.)
2. Nếu publish thành công nhưng DB rollback — chuyện gì? (Consumer xử lý đơn KHÔNG tồn tại → bug nghiêm trọng.)
3. Outbox pattern là gì? — Lưu event vào bảng <code>outbox</code> trong cùng tx với business data. Job riêng đọc outbox + publish + đánh dấu sent.
4. Trade-off: thêm phức tạp + latency ~ 1 giây nhưng đảm bảo "at-least-once delivery". Acceptable khi consumer idempotent.`
        }
      ],
      keyTakeaways: {
        vi: [
          'Topology = Exchange + Queue + Binding, declare bằng @Bean.',
          'JSON converter cho POJO ↔ message.',
          'Manual ack bắt buộc production. basicNack requeue=false → DLQ.',
          'Publish trong tx có race — outbox pattern là chuẩn cho critical event.',
          'DLQ + monitoring là phần phải có, không phải nice-to-have.'
        ]
      }
    }
  ]
}
