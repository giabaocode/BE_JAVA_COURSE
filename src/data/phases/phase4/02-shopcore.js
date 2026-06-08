// Capstone 2 — ShopCore: E-commerce Backend
// Includes Task 4: email notification when order status → SHIPPED
export default {
  id: 'mod-4-2',
  title: 'Capstone 2 — ShopCore: E-commerce Backend',
  prerequisites: { vi: 'Hoàn thành <code>Capstone 1 — Devlog</code> hoặc đã rất thành thạo Spring Boot + JPA + Security.' },
  lessons: [
    {
      id: 'l-4-2-overview',
      type: 'theory',
      title: 'ShopCore — Money, Stock Locking, State Machine, Email Notifications',
      mentalModel: {
        vi: `<strong>ShopCore</strong> = B2C e-commerce backend: catalog → cart → checkout → order → shipped. So với Devlog, dự án này thêm 4 khái niệm <em>khó</em> mà mọi backend engineer phải biết:
<ol>
<li><strong>Money handling</strong>: KHÔNG bao giờ dùng double. Luôn BIGINT cents hoặc BigDecimal.</li>
<li><strong>Concurrent stock locking</strong>: 2 user mua cùng lúc món cuối — chỉ 1 thắng. Optimistic vs pessimistic locking.</li>
<li><strong>Order state machine</strong>: PENDING → PAID → SHIPPED → DELIVERED / CANCELLED. Validate transition.</li>
<li><strong>Transactional email notification</strong>: khi order → SHIPPED, trigger email với tracking info qua JavaMailSender. Reuse module Email Phase 3.</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>First Principles — Production e-commerce concerns</h3>

<strong>1) Money precision</strong>
<code>double</code> = IEEE 754 floating point. 0.1 + 0.2 = 0.30000000000000004. Tích lũy → off bằng cent. KHÔNG ACCEPTABLE cho tiền. Hai lựa chọn:
<ul>
<li><strong>BIGINT cents</strong>: 99.99 USD = 9999. Đơn giản, exact, range đến 92 quadrillion. Mặc định cho production.</li>
<li><strong>NUMERIC(19, 4)</strong> với BigDecimal: cho currency có nhiều digit (JOD 3 digit, BTC 8 digit). Slower hơn BIGINT.</li>
</ul>
<br/><br/>
<strong>2) Snapshot price tại purchase</strong>
order_items.unit_price_cents lưu giá TẠI THỜI ĐIỂM mua. Sau đó admin update product price → order cũ KHÔNG đổi. Đây là vì sao tách order_items thay vì join lại products.
<br/><br/>
<strong>3) Concurrent stock</strong>
Race condition: 2 user A, B cùng checkout, stock = 1.
<ul>
<li>Cả hai SELECT stock = 1, thấy đủ.</li>
<li>Cả hai UPDATE stock = 0.</li>
<li>Stock = 0 nhưng 2 order tạo cho 1 unit → oversold!</li>
</ul>
Hai cách giải (<em>ví dụ đời thường — phòng họp:</em> <strong>pessimistic</strong> = khoá cửa phòng lại, ai vào trước dùng xong người sau mới được vào; <strong>optimistic</strong> = không khoá, ai cũng vào, nhưng lúc ghi kết quả mới kiểm "có ai sửa trước mình không?" — nếu có thì làm lại):
<ul>
<li><strong>Pessimistic lock</strong>: <code>SELECT ... FOR UPDATE</code>. A lock row, B đợi. Đơn giản nhưng chậm khi contention.</li>
<li><strong>Optimistic lock (@Version)</strong>: A, B đọc cùng version=5. A update đúng, version=6. B update fail → throw OptimisticLockException → retry. Nhanh khi contention thấp.</li>
</ul>
<br/><br/>
<strong>4) Order state machine</strong>
Encode transitions trong code: <code>Map&lt;Status, Set&lt;Status&gt;&gt; ALLOWED</code>. Mọi state change đi qua <code>transitionTo(newStatus)</code> — throw nếu không hợp lệ. KHÔNG để service tùy ý <code>order.setStatus(...)</code>.
<br/><br/>
<strong>5) Idempotency cho payment</strong>
Network unreliable. User click "Pay" 2 lần. Server cần charge 1 lần. Cách: idempotency key — header <code>Idempotency-Key: uuid</code>. Server lưu (key, response) trong cache. Request cùng key → trả response cũ, KHÔNG charge lại.
<br/><br/>
<strong>6) Email notification on SHIPPED — transactional event</strong>
Khi order → SHIPPED, gửi email với tracking number. Pattern đúng:
<ol>
<li>Service update status (trong @Transactional).</li>
<li>Publish ApplicationEvent <code>OrderShippedEvent</code>.</li>
<li>@TransactionalEventListener(phase = AFTER_COMMIT) bắt event.</li>
<li>Listener gọi EmailService.sendHtml() — async.</li>
</ol>
Vì sao phase=AFTER_COMMIT? — Email gửi SAU khi DB commit. Nếu transaction rollback, KHÔNG gửi email "Your order shipped" trong khi DB không có order shipped → user confused.`
      },
      theory: {
        vi: `<h3>Scope</h3>
<ul>
  <li>Categories, products, variants, inventory.</li>
  <li>Cart per user.</li>
  <li>Checkout: lock stock + create order.</li>
  <li>Mock payment (FakeGateway interface — swap Stripe later).</li>
  <li>Order state machine với 5 trạng thái.</li>
  <li><strong>Email notifications</strong>: order confirmation, shipped notification với tracking.</li>
  <li>Admin: inventory, sales report.</li>
</ul>

<h3>Stack (giống Devlog) + thêm</h3>
<ul>
  <li>Caffeine cache cho catalog.</li>
  <li>Spring Mail + Thymeleaf email templates.</li>
  <li>Spring Events (ApplicationEventPublisher).</li>
  <li>Spring Batch hoặc @Scheduled cho job restock TTL.</li>
  <li>Micrometer + Prometheus + Grafana (optional).</li>
</ul>

<h3>The "Why" — Tại sao ShopCore là capstone THỨ HAI?</h3>
<ul>
  <li>Bắt buộc deal với money — kỹ năng quan trọng mà Devlog không có.</li>
  <li>Concurrent stock locking — interview question phổ biến.</li>
  <li>State machine + transactional events — pattern enterprise.</li>
  <li>Email integration end-to-end — apply Phase 3 module.</li>
</ul>

<h3>Junior Pitfalls — Money & concurrency</h3>
<ul>
  <li><strong>double cho tiền</strong> → off-by-cent bug âm ỉ.</li>
  <li><strong>Naive stock check-then-update</strong> → race oversold.</li>
  <li><strong>Service tùy ý setStatus</strong> → state corruption (DELIVERED → PENDING).</li>
  <li><strong>Email gửi TRONG @Transactional</strong> → fail email rollback order. Tách AFTER_COMMIT.</li>
  <li><strong>Pay endpoint không idempotent</strong> → user charged 2 lần khi network retry.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: '[ShopCore] Self-quiz money + concurrent stock',
          prompt: `Tôi sắp bắt đầu capstone ShopCore (e-commerce: catalog/cart/checkout/order/shipped).

TUYỆT ĐỐI KHÔNG viết code, KHÔNG cho schema SQL, KHÔNG cho boilerplate.

Đóng vai senior reviewer. Hỏi tôi 7 câu để verify tôi hiểu các "khái niệm khó" TRƯỚC khi gõ dòng đầu tiên:
1. Vì sao KHÔNG dùng double cho tiền? Cho 1 ví dụ cụ thể bug.
2. BIGINT cents vs NUMERIC(19,4) — khi nào chọn cái nào? Tradeoff?
3. Order_items lưu unit_price_cents — vì sao KHÔNG join lại products để lấy price?
4. Race condition oversold xảy ra như thế nào? Vẽ timeline 2 user A, B với stock=1.
5. Optimistic (@Version) vs pessimistic (FOR UPDATE) — chọn cái nào khi nào? Throughput vs simplicity?
6. State machine: tại sao encode <code>Map&lt;Status, Set&lt;Status&gt;&gt;</code> thay vì để service tùy ý <code>setStatus()</code>?
7. Email "Your order shipped" — vì sao phase=AFTER_COMMIT, KHÔNG inside transaction?

Đợi tôi reply từng câu. Câu sai → hỏi tiếp dẫn dắt. Cuối: liệt kê tôi nắm vững gì, gap chỗ nào.`
        },
        {
          title: '[ShopCore] Idempotency-Key — mock interview',
          prompt: `Đóng vai interviewer senior. Hỏi tôi về idempotency cho payment endpoint của ShopCore.

TUYỆT ĐỐI KHÔNG cho đáp án. KHÔNG nói "dùng UUID làm key" hay tương tự.

Hỏi tôi theo thứ tự, đợi reply giữa các câu:
1. Vì sao endpoint Pay cần idempotent? Cho 1 scenario user/network thực tế.
2. Client gửi <code>Idempotency-Key</code> hay server generate? Tradeoff?
3. Server lưu <code>(key, response)</code> ở đâu — DB, Redis, memory? Lifetime bao lâu?
4. Khi client retry với cùng key NHƯNG body khác (sửa amount) — server xử lý sao?
5. 2 request cùng key tới SONG SONG — race condition: cả 2 cùng check "chưa thấy key" rồi cùng charge? Fix bằng gì?
6. Nếu lần đầu charge SUCCESS nhưng response timeout, client retry → idempotency phải trả gì?
7. Edge case: key TTL hết, user retry sau 25h — happen gì? Đúng/sai về business?

Khi tôi đã trả lời hết, scor 1-10 từng câu, nói tôi cần đọc gì.`
        },
        {
          title: '[ShopCore] Self-review transactional email pattern',
          prompt: `Tôi vừa implement: khi order → SHIPPED, gửi email với tracking number.

TUYỆT ĐỐI KHÔNG xem code tôi viết. KHÔNG đề xuất giải pháp.

Đóng vai senior reviewer. Hỏi tôi để verify tôi tránh các pitfalls:
1. Gửi email Ở ĐÂU trong code — trong service method? @EventListener? @TransactionalEventListener? Khác nhau gì?
2. Nếu DB commit thành công NHƯNG email service down — outcome? User confused?
3. Nếu email gửi xong NHƯNG DB rollback (foreign key constraint fail) — outcome? User nhận email "shipped" mà order chưa shipped?
4. phase=AFTER_COMMIT vs AFTER_COMPLETION — khác nhau ở rollback case? Chọn cái nào cho email?
5. Email gửi sync hay async? Nếu sync thì user click "Mark Shipped" phải đợi SMTP — UX ra sao?
6. Email service rate-limit khi 100 order shipped cùng lúc — pattern nào (queue, retry, batch)?
7. Test: làm sao verify email được gửi đúng MÀ không thực sự gửi trong unit test?

Tôi self-explain. KHÔNG dạy đáp án — dẫn tôi đi tới.`
        }
      ],
      keyTakeaways: {
        vi: [
          'Tiền: KHÔNG bao giờ <code>double</code>. BIGINT cents (default) hoặc BigDecimal với NUMERIC(19,4) (cho currency nhiều digit).',
          'order_items lưu snapshot unit_price_cents — admin đổi price sau đó KHÔNG ảnh hưởng order cũ. Đây là vì sao tách order_items.',
          'Race condition oversold: 2 user cùng SELECT stock=1 → cùng UPDATE → bán 2 cho 1 unit. Fix bằng pessimistic (<code>FOR UPDATE</code>) hoặc optimistic (<code>@Version</code>).',
          'State machine encode trong code (<code>Map&lt;Status, Set&lt;Status&gt;&gt; ALLOWED</code>). Mọi state change đi qua <code>transitionTo()</code> — KHÔNG để service tùy ý <code>setStatus()</code>.',
          'Email khi SHIPPED: publish <code>OrderShippedEvent</code> → <code>@TransactionalEventListener(phase=AFTER_COMMIT)</code>. KHÔNG send email trong @Transactional — rollback sẽ leave user confused.',
          'Idempotency key cho payment: client gửi <code>Idempotency-Key</code> header → server cache <code>(key, response)</code>. Retry cùng key trả response cũ, KHÔNG charge lại.'
        ]
      }
    },
    {
      id: 'l-4-2-blueprint',
      type: 'project',
      title: 'ShopCore — 12 Steps with Mental Models',
      steps: [
        {
          id: 's1',
          title: 'Bootstrap & Docker Postgres + MailHog',
          description: { vi: 'Cùng template Devlog. Khác: DB tên <code>shopcore</code>. MailHog ĐÃ có sẵn từ compose Devlog — reuse.' },
          mentalModel: {
            vi: `Tách Db Devlog/Shopcore để dev parallel hai project mà không xung đột data.
<br/><br/>
<strong>First Principles</strong>: Postgres cluster có nhiều database độc lập. <code>CREATE DATABASE shopcore</code> + connection string trỏ tới database mới. Hai project cùng cluster Postgres OK nhưng KHÔNG cùng database.
<br/><br/>
MailHog cùng container cho cả 2 project — không cần dựng riêng. Port 1025 SMTP + 8025 Web UI.
<br/><br/>
<strong>Junior Pitfalls</strong>:
<ul>
<li>Cùng database name "bootcamp" cho 2 project → bảng lẫn lộn.</li>
<li>Mỗi project tự dựng Postgres container → tốn RAM.</li>
<li>MailHog không persistent — restart mất email cũ. OK cho dev.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'DB isolation', prompt: 'KHÔNG cho đáp án. Hỏi tôi: 1) 1 Postgres cho cả Devlog + ShopCore — qua DATABASE riêng hay SCHEMA riêng? 2) Trade-off mỗi cách? 3) Sau này tách microservice — cách nào migrate dễ hơn?' }
          ],
          hints: [
            'Compose project name: <code>docker compose -p shopcore up</code>.',
            'Tạo DB mới: <code>docker exec bootcamp-db createdb -U bootcamp shopcore</code>.',
            'Reuse MailHog từ compose Devlog hoặc dựng riêng container.'
          ]
        },
        {
          id: 's2',
          title: 'Schema: products, variants, inventory, orders, payments',
          description: { vi: 'Bảng: users, categories, products, product_variants, inventory, carts, cart_items, orders, order_items, payments.' },
          mentalModel: {
            vi: `<strong>Money</strong>: <code>price_cents BIGINT NOT NULL</code>. 99.99 USD = 9999 cents. Không có rounding error.
<br/><br/>
<strong>Order snapshot</strong>: <code>order_items.unit_price_cents</code> snapshot TẠI THỜI ĐIỂM purchase. Price product đổi sau → order cũ KHÔNG đổi.
<br/><br/>
<strong>Inventory với version</strong>: <code>inventory.version INTEGER NOT NULL DEFAULT 0</code> cho optimistic locking. JPA tự increment qua @Version.
<br/><br/>
<strong>Orders thêm cột</strong>: <code>status VARCHAR(20)</code> (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED), <code>tracking_number VARCHAR(100)</code>, <code>shipped_at TIMESTAMPTZ</code>.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>BIGINT cents range: ±9.2 quintillion. Đủ cho mọi business.</li>
<li>@Version JPA: Hibernate auto-increment trong UPDATE, throw OptimisticLockException nếu version trong WHERE clause không match.</li>
<li>VARCHAR cho status thay vì Postgres ENUM: dễ ALTER thêm trạng thái mới. ENUM Postgres khó migrate.</li>
<li>Composite UNIQUE (post_id, user_id) cho likes — chống race.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>DOUBLE cho price → 0.1 + 0.2 = 0.30000000000000004 → tích lũy off.</li>
<li>JPY (yen) không có cents — schema BIGINT cents cho USD nhưng JPY cần đơn vị riêng.</li>
<li>Quên @Version → optimistic lock không hoạt động → oversold.</li>
<li>Quên CASCADE cho order_items khi xóa order — orphan rows.</li>
<li>tracking_number NULL initially → khi SHIPPED set giá trị. Cần allow NULL.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Money & precision',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. <code>double price = 0.1 + 0.2</code> — kết quả gì? Vì sao 0.30000000000000004?
2. BigDecimal chính xác — vì sao KHÔNG dùng cho DB thay BIGINT cents?
3. JPY (yen) không có cents — schema xử lý ra sao?
4. Tỷ giá USD/VND — store ở đâu? order_items hay tính dynamic?
5. Tax — client, server, hay DB tính? Lưu ở đâu?`
            }
          ],
          hints: [
            'Composite PK (post_id, tag_id) không có ở đây — mỗi cart_item có id riêng.',
            'inventory.version cho optimistic lock; @Version annotation phía JPA.',
            'orders thêm <code>tracking_number</code> + <code>shipped_at</code> cho email shipped notification.',
            'payments table tách riêng — 1 order có thể nhiều payment attempt.'
          ]
        },
        {
          id: 's3',
          title: 'Catalog API (mostly read) + Caffeine cache',
          description: { vi: '/categories, /products, /products/{id} — public.' },
          mentalModel: {
            vi: `Catalog là <strong>read-heavy</strong>. 99% request là GET. → Cache aggressive: Caffeine cho category list, product detail. TTL 60s đủ cho hầu hết use case.
<br/><br/>
<strong>N+1 risk</strong>: GET /products list 50 sản phẩm, mỗi sản phẩm có .variants → sinh 51 query nếu không fetch. Dùng <code>@EntityGraph</code> hoặc <code>JOIN FETCH</code>.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Caffeine = in-process cache. Latency O(ns). KHÔNG share giữa instances.</li>
<li>Redis = distributed cache. Latency O(ms). Share giữa instances. Phù hợp multi-instance.</li>
<li>Cache invalidation: TTL-based (simple) vs event-based (precise). Bắt đầu TTL.</li>
<li>Cache stampede: TTL expire cùng lúc, N request cùng rebuild cache → load DB spike. Random TTL ±20% để spread.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Cache mutable Object → mutate by 1 caller ảnh hưởng cache. Cache immutable (DTO record).</li>
<li>TTL 1 hour cho product price → admin update giá nhưng client thấy giá cũ trong 1h → bug khó.</li>
<li>Cache penetration: query id không tồn tại lặp → cache miss luôn → DB hammered. Cache "null sentinel" cho missing.</li>
<li>Quên @CacheEvict trên update — stale data sau update.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Cache strategy',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Local cache (Caffeine) vs distributed (Redis) — khi nào cần distributed?
2. TTL 60s — sản phẩm đổi giá ngay lập tức nhưng cache cũ. User checkout với giá NÀO?
3. Cache invalidation on write: admin update product → invalidate trong local cache ra sao?
4. Cache key: <code>product:{id}</code> vs <code>product:{id}:v2</code> — versioning có lợi gì?
5. Cache penetration — cache "null" có nên không?`
            }
          ],
          hints: [
            '@Cacheable("products") + @CacheEvict trên update.',
            'CaffeineCacheManager bean với <code>expireAfterWrite(60, SECONDS)</code>.',
            'Eager-fetch variants + inventory cho single product detail; lazy cho list.',
            'Filter price/category dùng JPA Specifications (như Devlog s8).'
          ]
        },
        {
          id: 's4',
          title: 'Auth & RBAC (CUSTOMER, ADMIN)',
          description: { vi: 'Reuse JWT từ Devlog. Thêm role ADMIN cho admin endpoints.' },
          mentalModel: {
            vi: `Role lưu trong column <code>users.role</code> (VARCHAR). JWT chứa role claim. <code>@PreAuthorize("hasRole('ADMIN')")</code> check.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>RBAC: role → permissions. Đơn giản, đủ cho hầu hết app.</li>
<li>ABAC (Attribute-Based): policy theo attribute (vd: "edit own product"). Phức tạp hơn nhưng granular.</li>
<li>Role hierarchy: ADMIN &gt; MANAGER &gt; USER. Spring Security: <code>RoleHierarchyImpl</code>.</li>
<li>JWT lưu role: nhanh (no DB query mỗi request) nhưng stale khi demote.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Demote user từ ADMIN → USER, token cũ vẫn có ADMIN claim. Solution: short TTL + refresh, hoặc blacklist token.</li>
<li>1 user nhiều role: column VARCHAR không đủ. Cần join table users_roles.</li>
<li>Hard-code role string "ADMIN" rải rác → typo bug. Constant enum.</li>
<li>Quên prefix "ROLE_" trong Spring Security — <code>hasRole("ADMIN")</code> internally check "ROLE_ADMIN".</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'RBAC vs ABAC',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. RBAC vs ABAC — khác? Example?
2. ShopCore chỉ CUSTOMER và ADMIN — đủ. Nhưng nếu thêm MANAGER, SUPPORT, FINANCE — scale ra sao?
3. User nhiều role cùng lúc — schema thế nào?
4. Role hierarchy ADMIN &gt; MANAGER &gt; USER — Spring hỗ trợ ra sao?
5. Permission "edit own product" vs "edit any product" — RBAC giới hạn không?`
            }
          ],
          hints: [
            'Role enum: <code>enum Role { CUSTOMER, ADMIN }</code> thay vì string.',
            'Spring: <code>hasRole("ADMIN")</code> → internally <code>hasAuthority("ROLE_ADMIN")</code>.',
            'Seed admin user qua Flyway repeatable migration.',
            'Refresh token có TTL ngắn cho role change apply nhanh.'
          ]
        },
        {
          id: 's5',
          title: 'Cart management',
          description: { vi: 'POST/PATCH/DELETE /cart/items. GET /cart.' },
          mentalModel: {
            vi: `<strong>Cart open per user</strong>: get-or-create. User đăng nhập có cart "OPEN"; sau checkout cart "CONVERTED". Tạo cart mới cho lần mua tiếp.
<br/><br/>
<strong>Cart KHÔNG lock stock</strong>: chỉ kiểm tra stock đủ tại thời điểm add (best-effort). Stock thật bị lock LÚC CHECKOUT.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Cart UX: persistent (DB) vs ephemeral (cookie/localStorage). DB tốt cho user login; ephemeral cho anonymous.</li>
<li>Reserve stock trong cart → bad UX (item lock 30 phút trong cart của 1 user → user khác KHÔNG mua được). Don't reserve.</li>
<li>Cart total tính dynamic: query product price + sum qty × price. KHÔNG cache total (price có thể đổi).</li>
<li>Merge cart: user login → anonymous cart + saved cart cùng user → merge bằng product_id + qty.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Reserve stock trong cart → block real customer.</li>
<li>Cart total snapshot vào DB → stale khi product price đổi.</li>
<li>Cart abandoned 1 năm vẫn còn → DB bloat. Cleanup job.</li>
<li>1 user nhiều cart open → confusion. Constraint: 1 open cart per user.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Cart lifecycle',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. User add product vào cart — có nên reserve stock luôn? Hệ quả?
2. Cart abandoned — clean up khi nào?
3. Anonymous user có cart không? Lưu ở đâu? Session, cookie, localStorage?
4. User login sau khi add cart anonymous — merge ra sao?
5. Cart có expire? Sau bao lâu?`
            }
          ],
          hints: [
            '1 user 1 OPEN cart — UNIQUE partial index: <code>UNIQUE(user_id) WHERE status = \'OPEN\'</code>.',
            'Cart status: OPEN, CONVERTED, ABANDONED.',
            'Cleanup job @Scheduled: ABANDONED carts &gt; 90 ngày → DELETE.',
            'Cart total tính realtime trong service, KHÔNG store.'
          ]
        },
        {
          id: 's6',
          title: 'Checkout — Transactional Stock Lock',
          description: { vi: 'POST /checkout: cart → order (PENDING) + decrement inventory atomically.' },
          mentalModel: {
            vi: `<strong>Race condition kinh điển</strong>: 2 user A, B cùng checkout. Stock chỉ còn 1.
<br/><br/>
Naive: <code>if (stock &gt;= qty) stock -= qty</code> — KHÔNG atomic. A và B đều đọc 1, đều thấy đủ, đều decrement → stock = -1. ❌
<br/><br/>
<strong>Hai cách giải</strong>:
<ol>
<li><strong>Pessimistic lock</strong>: <code>SELECT ... FOR UPDATE</code>. A lock row, B đợi. B đọc sau khi A commit → thấy stock = 0 → fail. Đơn giản nhưng chậm khi contention.</li>
<li><strong>Optimistic lock</strong> (@Version): A và B đọc cùng version=5. A update đúng, version=6. B update thất bại (version 5 không còn) → OptimisticLockException → retry. Nhanh khi contention thấp.</li>
</ol>
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Postgres row-level locking với <code>SELECT ... FOR UPDATE</code>. Row khóa cho đến commit của transaction giữ lock.</li>
<li>Deadlock: 2 tx cùng lock 2 row theo thứ tự ngược → cả hai chờ nhau. Postgres detect và abort 1 tx. Order locks consistently!</li>
<li>OptimisticLockException → throw thì retry HOẶC trả 409 Conflict cho client.</li>
<li>Transaction propagation: @Transactional(propagation = REQUIRED) default — join existing tx hoặc new.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Naive check-then-update → oversold.</li>
<li>Self-invocation @Transactional → KHÔNG có proxy → KHÔNG có tx.</li>
<li>Publish event trong tx — phải AFTER_COMMIT, nếu không listener thấy entity chưa commit.</li>
<li>Lock contention quá cao → throughput thấp. Solution: shard inventory hoặc queue-based.</li>
<li>Quên handle InsufficientStockException → 500 thay vì 409.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Concurrency control',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 2 thread cùng <code>stock--</code> — vì sao sai dù mỗi op đơn lẻ là instruction?
2. Pessimistic lock: <code>SELECT FOR UPDATE</code> hoạt động ra sao? Lock gì?
3. Optimistic lock (@Version): khi nào Hibernate check version? Throw lúc nào?
4. 1000 user cùng mua 1 sản phẩm — pessimistic vs optimistic, cái nào nhanh hơn?
5. Pessimistic an toàn hơn khi optimistic gây retry storm — khi nào?
6. Distributed lock với Redis — khi nào cần (microservice)?`
            },
            {
              title: 'Transaction boundary',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. @Transactional đặt ở Controller, Service, hay Repository? Vì sao Service?
2. Self-invocation: service A gọi <code>this.b()</code> — propagation hoạt động không? Vì sao không?
3. Checkout có nhiều bước: lock inventory, save order, save items, publish event. Publish fail — rollback gì?
4. <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> giải quyết vấn đề trên ra sao?
5. Nested tx: REQUIRES_NEW vs REQUIRED — kịch bản nào?`
            }
          ],
          hints: [
            '@Lock(LockModeType.PESSIMISTIC_WRITE) trên repository method.',
            'Optimistic: @Version trên entity + try-catch OptimisticLockException + retry.',
            '@Transactional(rollbackFor = Exception.class) để rollback cả checked.',
            'Concurrent test: spawn 100 thread cùng checkout 50 stock → assert đúng 50 thành công.'
          ]
        },
        {
          id: 's7',
          title: 'Mock payment integration',
          description: { vi: 'PaymentGateway interface; FakePaymentGateway impl. /orders/{id}/pay endpoint với idempotency key.' },
          mentalModel: {
            vi: `<strong>Strategy pattern</strong>: <code>PaymentGateway</code> interface, implement FakePaymentGateway (cho test), sau này StripeGateway. Service KHÔNG biết gateway nào — chỉ inject interface.
<br/><br/>
<strong>Idempotency key</strong>: header <code>Idempotency-Key: xxx-uuid</code>. Server lưu (key → response) trong 24h. Request cùng key → trả response cũ. Quan trọng vì payment dễ bị retry (mạng kém, user click 2 lần).
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Strategy pattern = polymorphism. Code depend on abstraction, not concrete.</li>
<li>Idempotency key store: Redis (fast, TTL native) hoặc DB table với cleanup job.</li>
<li>Payment 3 outcomes: SUCCESS, FAILED, PENDING (async webhook). Order status cần handle cả 3.</li>
<li>Stripe webhook signature verification: HMAC-SHA256 với secret. KHÔNG trust webhook payload mà không verify.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Hard-code gateway cụ thể trong service → khó swap.</li>
<li>Quên idempotency → user double-charge khi network glitch.</li>
<li>TTL idempotency 24h cho Stripe (best practice).</li>
<li>Synchronous payment → request timeout khi gateway slow. Use webhook + polling pattern.</li>
<li>Trust webhook không verify signature → attacker fake successful payment!</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Payment idempotency',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. User click "Pay" 2 lần liên tiếp — request gửi 2 lần. Server xử lý ra sao?
2. Mạng timeout sau server đã charge nhưng client không nhận response — client retry. Tránh charge 2 lần?
3. Idempotency key store ở đâu? In-memory, Redis, DB?
4. TTL idempotency key bao lâu? Quá ngắn vs dài — vấn đề?
5. Stripe có idempotency riêng — tại sao app vẫn cần ở layer mình?`
            }
          ],
          hints: [
            'Strategy + Factory: PaymentGatewayFactory chọn gateway theo type.',
            'IdempotencyKey table: (key, response_json, expires_at).',
            'Webhook handler: verify HMAC signature trước parse payload.'
          ]
        },
        {
          id: 's8',
          title: 'Order state machine + Email on SHIPPED (Task 4)',
          description: { vi: 'States: PENDING → PAID → SHIPPED → DELIVERED, plus CANCELLED. Khi → SHIPPED, gửi email tracking qua JavaMailSender.' },
          mentalModel: {
            vi: `<strong>State diagram</strong>:
<pre>PENDING --pay→ PAID --ship→ SHIPPED --deliver→ DELIVERED
   |              |              |
   cancel         cancel         (không cancel sau ship)
   ↓              ↓
CANCELLED      CANCELLED (+ restock!)</pre>

Encode allowed transitions trong <code>EnumMap&lt;Status, Set&lt;Status&gt;&gt;</code>. Mọi state change đi qua <code>transitionTo(newStatus)</code> — throw nếu không hợp lệ.
<br/><br/>
<strong>Task 4: Email khi SHIPPED</strong>
<pre>Admin marks order SHIPPED
    ↓ OrderService.markShipped(orderId, trackingNumber) @Transactional
    ↓ order.transitionTo(SHIPPED)
    ↓ order.setTrackingNumber(trackingNumber)
    ↓ order.setShippedAt(Instant.now())
    ↓ orderRepository.save(order)
    ↓ eventPublisher.publishEvent(new OrderShippedEvent(orderId, trackingNumber))
[Transaction commits]
    ↓ @TransactionalEventListener(phase = AFTER_COMMIT) bắt event
    ↓ Listener gọi emailService.sendHtml(user.email, "Order Shipped", "shipped-notification", model)
    ↓ Email gửi async qua thread pool</pre>

<strong>First Principles</strong>:
<ul>
<li>State machine encode rules → CENTRALIZE validation. Service KHÔNG ad-hoc setStatus.</li>
<li>ApplicationEventPublisher = in-process event bus. Decouple producer (OrderService) khỏi consumer (EmailListener).</li>
<li>@TransactionalEventListener(phase = AFTER_COMMIT): chỉ fire SAU khi tx commit. Email KHÔNG gửi nếu rollback.</li>
<li>@Async trên listener method → email gửi NGOÀI request thread. Response trả sớm.</li>
<li>Email template Thymeleaf với tracking info: order id, items, tracking number, delivery estimate.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>setStatus tùy ý → CANCELLED → SHIPPED khả thi (sai!).</li>
<li>Gửi email TRONG @Transactional → fail email rollback order shipped (data inconsistent).</li>
<li>Gửi email BEFORE_COMMIT → tx rollback, email đã gửi → "Your order shipped" nhưng DB không có shipped.</li>
<li>Synchronous email gửi từ controller → request block 1-2s.</li>
<li>Tracking number không validate format (carrier có format riêng) → email show garbage.</li>
<li>Email retry on failure quá nhiều → spam user.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'State machine design',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Vì sao centralize state transition validation thay vì check khắp nơi?
2. Cancel từ PAID — phải làm gì? Refund + restock? Auto hay manual?
3. PAID → SHIPPED tự động (CRON job) hay admin trigger?
4. Audit log: lưu state change ở đâu? Cùng bảng orders hay riêng?
5. Có cần "DRAFT" trước PENDING không? Khi nào?`
            },
            {
              title: 'Transactional events for email',
              prompt: `KHÔNG cho code. Email khi → SHIPPED. Hỏi tôi:
1. Gửi email synchronous TRONG transaction — vấn đề gì?
2. Gửi BEFORE_COMMIT — tx rollback nhưng email đã gửi → tệ. Vì sao?
3. AFTER_COMMIT phase — đảm bảo gì? Vì sao chuẩn?
4. Email fail SAU commit — order vẫn SHIPPED nhưng user không nhận email. Recover ra sao?
5. Retry email: cơ chế? Dead letter queue khi retry hết?`
            }
          ],
          hints: [
            'EnumMap&lt;Status, Set&lt;Status&gt;&gt; ALLOWED — encode transitions.',
            'Throw IllegalStateTransitionException → 409 Conflict.',
            'Restock inventory khi CANCELLED (chỉ nếu PAID, chưa SHIPPED).',
            'Thymeleaf template: <code>resources/templates/order-shipped.html</code> với placeholders.',
            'Spring ApplicationEventPublisher tự inject — không cần config thêm.',
            'Email listener @Async("emailExecutor") + @TransactionalEventListener.'
          ]
        },
        {
          id: 's9',
          title: 'Admin endpoints + sales report',
          description: { vi: '/admin/orders, /admin/inventory, /admin/reports/sales?from=...&to=...' },
          mentalModel: {
            vi: `Aggregate query với SUM/GROUP BY DATE_TRUNC. CSV export bằng dedicated endpoint.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Reporting query trên 1M order: phải có index trên (created_at, status) → DB skip irrelevant rows.</li>
<li>Materialized view cho heavy report: precompute, refresh nightly. Trade fresh data lấy speed.</li>
<li>Streaming response cho CSV export 1M rows: KHÔNG load hết RAM → StreamingResponseBody trong Spring.</li>
<li>Timezone trong report: from/to phải explicit timezone (vd Asia/Ho_Chi_Minh).</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Sales report 1 năm query toàn bảng → minute-long query → timeout.</li>
<li>Export CSV load List&lt;Order&gt; vào RAM → OOM với 1M rows.</li>
<li>Realtime report cho heavy data → DB choke. Cache result 5-15 phút.</li>
<li>Timezone không explicit → "yesterday" lệch server timezone.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Reporting queries',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Sales report 1 năm — query SUM trên 1M order. Cách nhanh? (Index? Materialized view? Pre-aggregate?)
2. Realtime vs batch report — khi nào dùng cái nào?
3. CSV export 1M rows — load hết vào RAM hay stream? StreamingResponseBody trong Spring?
4. Timezone: <code>from=2024-01-01</code> — theo timezone nào?
5. Caching report — TTL bao lâu cho hôm nay vs tháng trước?`
            }
          ],
          hints: [
            '<code>DATE_TRUNC(\'day\', created_at)</code> cho grouping.',
            'Index <code>(status, created_at)</code> cho filter + sort.',
            'CSV qua <code>StreamingResponseBody</code> tránh OOM.',
            'Limit report range 365 ngày — block query 5 năm.'
          ]
        },
        {
          id: 's10',
          title: 'Testing — concurrency tests',
          description: { vi: 'JUnit + Mockito unit. Testcontainers + CompletableFuture parallel test stock invariant.' },
          mentalModel: {
            vi: `<strong>Concurrency test</strong>: spawn 100 thread cùng checkout sản phẩm chỉ còn 50 stock. ASSERT: đúng 50 thành công, 50 fail, final stock = 0.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Concurrency bug non-deterministic — chạy 100 lần có thể 99 pass 1 fail. Run nhiều iteration.</li>
<li>CountDownLatch sync N thread chạy CÙNG LÚC, max contention.</li>
<li>ExecutorService thread pool + CompletableFuture.allOf() đợi hết.</li>
<li>H2 in-memory KHÔNG expose locking bug → phải Testcontainers Postgres.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Test 1 thread → KHÔNG phát hiện race.</li>
<li>Thread chạy không sync → contention thấp → race không trigger. Dùng CountDownLatch.</li>
<li>H2 → race condition không reproduce. Postgres.</li>
<li>Flaky test do timing → debounce/retry nhiều iteration.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Testing race conditions',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Bug race khó test vì non-deterministic. Strategy?
2. CountDownLatch giúp gì khi muốn N thread chạy CÙNG LÚC?
3. Assert "stock không âm" cuối — đủ? Còn invariant nào?
4. Testcontainers Postgres vs H2 — chỉ Postgres expose locking bug. Tại sao?
5. Flaky test — biết là flaky vs bug thực sự ra sao?`
            }
          ],
          hints: [
            'CountDownLatch + ExecutorService spawn N thread.',
            'Run test 10 iterations → catch flaky.',
            '@SpringBootTest + Testcontainers Postgres cho concurrency test.',
            'Mock email listener trong test — không cần MailHog cho mọi test.'
          ]
        },
        {
          id: 's11',
          title: 'OpenAPI + Postman collection',
          description: { vi: 'Document + export Postman collection cho QA.' },
          mentalModel: {
            vi: `springdoc-openapi tự sinh swagger.json → import vào Postman.
<br/><br/>
<strong>First Principles</strong>: Contract testing — Pact framework để verify API contract giữa producer (backend) và consumer (frontend) tự động.
<br/><br/>
<strong>Junior Pitfalls</strong>:
<ul>
<li>Spec drift: spec không update khi code đổi. springdoc auto-generate giảm risk nhưng vẫn cần review.</li>
<li>Breaking change không version → frontend vỡ. Bump v1 → v2.</li>
<li>Document quá ít — Swagger UI hữu ích.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'API contract testing', prompt: 'KHÔNG cho đáp án. Hỏi tôi: 1) Contract test là gì? 2) Pact framework giải quyết gì? 3) Đổi API — break frontend ra sao? Document có cảnh báo được? 4) Versioning: deprecate cũ + serve cả 2 cùng lúc — implement?' }
          ]
        },
        {
          id: 's12',
          title: 'Containerize + observability + MailHog test email',
          description: { vi: 'Dockerfile multi-stage. Expose /actuator/prometheus. Test email gửi qua MailHog Web UI.' },
          mentalModel: {
            vi: `Micrometer auto-collect JVM, HTTP, DB metrics. Prometheus scrape /actuator/prometheus. Grafana visualize.
<br/><br/>
<strong>Test email integration end-to-end</strong>:
<ol>
<li>docker-compose up (db + app + mailhog).</li>
<li>Tạo order, checkout, pay (qua API).</li>
<li>Admin mark SHIPPED qua /admin/orders/{id}/ship.</li>
<li>Mở MailHog Web UI: <code>http://localhost:8025</code> — email "Your order shipped" hiển thị với tracking info.</li>
</ol>

<strong>First Principles</strong>:
<ul>
<li>MailHog catch mọi outbound SMTP → safe để test. Không gửi đi đâu.</li>
<li>Production thay MailHog bằng SendGrid/SES qua env var SPRING_MAIL_HOST.</li>
<li>Observability custom metrics: <code>orders_shipped_total</code>, <code>emails_sent_total</code>.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Test ship trên production → spam real customer. Always MailHog dev/test.</li>
<li>Quên SPRING_MAIL_HOST env var trong prod → fall back localhost → fail.</li>
<li>KHÔNG monitor email failure rate → bug ẩn.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Observability essentials',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. 3 pillars (Logs/Metrics/Traces) — mỗi cái trả lời câu hỏi gì?
2. Production chậm — nhìn pillar nào TRƯỚC?
3. Distributed tracing — khi nào cần?
4. Log structured (JSON) vs plaintext — prod chọn? Tại sao?
5. Metric "p99 latency" nghĩa gì? Khác mean ra sao? Tại sao p99 quan trọng hơn?`
            }
          ],
          hints: [
            'Use BuildKit cache cho fast rebuilds.',
            'Tag images với git commit SHA.',
            'MeterRegistry inject + <code>counter("orders.shipped").increment()</code>.',
            'Test email manual qua MailHog UI sau khi mark SHIPPED.'
          ]
        }
      ],
      stretchGoals: [
        'Stripe integration (test mode) + webhook signature verification.',
        'Coupon codes (% discount, fixed amount).',
        'Stock reservation TTL — auto release sau 15 phút PENDING (@Scheduled cron).',
        'Search products với OpenSearch.',
        'Event sourcing cho order history.',
        'Weekly sales digest email cho admin (@Scheduled cron Sunday 9 AM).',
        'Refund flow: tạo refund payment record, trigger email refund confirmation.'
      ]
    }
  ],
  references: [
    { title: 'Stripe Idempotent Requests', url: 'https://stripe.com/docs/api/idempotent_requests' },
    { title: 'Money Pattern (Martin Fowler)', url: 'https://martinfowler.com/eaaCatalog/money.html' },
    { title: 'Spring TransactionalEventListener', url: 'https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/event/TransactionalEventListener.html' },
    { title: 'Optimistic vs Pessimistic Locking (Vlad Mihalcea)', url: 'https://vladmihalcea.com/optimistic-vs-pessimistic-locking/' }
  ]

}
