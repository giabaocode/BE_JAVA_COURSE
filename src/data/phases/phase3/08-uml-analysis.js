// Module 3.8 — UML & Project Analysis
// Mục đích: viết được spec/diagram trước khi code. Skill team senior expect.
export default {
  id: 'mod-3-8',
  title: 'UML & Project Analysis — Vẽ trước, code sau',
  prerequisites: { vi: 'Hoàn thành <strong>Phase 1 (OOP)</strong>. Tốt nhất đã xong <code>Module 1.8</code> (OOP mini projects).' },
  lessons: [
    {
      id: 'l-3-8-1',
      type: 'theory',
      title: 'Requirement Analysis — Từ yêu cầu mơ hồ tới spec rõ ràng',
      subtitle: { vi: 'Không có spec → code 80% xong mới biết hiểu sai. Đây là kỹ năng ai cũng cần nhưng không trường nào dạy kỹ.' },
      mentalModel: {
        vi: `Khách hàng nói: "Tôi muốn website bán hàng". Đây KHÔNG phải spec — đây là <strong>vision</strong>. Phải đào sâu thành:
<ul>
  <li><strong>Actor</strong> — Ai dùng? (Customer, Admin, Shipper?)</li>
  <li><strong>Use case</strong> — Họ làm gì? (Search, Order, Pay, Track?)</li>
  <li><strong>Constraint</strong> — Giới hạn gì? (Đơn ≤ 50 sản phẩm? Chỉ thanh toán VNPay?)</li>
  <li><strong>NFR (Non-Functional Requirement)</strong> — Performance, security, scalability? (1k user concurrent? 99.9% uptime?)</li>
</ul>
Output: <strong>SRS (Software Requirement Spec)</strong> — tài liệu mà dev + tester + khách đều ký vào.`
      },
      underTheHood: {
        vi: `<h3>5W + 1H — frame câu hỏi đào spec</h3>
<ul>
  <li><strong>Who</strong>: Ai dùng? Vai trò gì? Bao nhiêu user?</li>
  <li><strong>What</strong>: Họ làm gì? Output mong đợi?</li>
  <li><strong>When</strong>: Có flow theo thời gian không (giỏ hàng → checkout → ship)?</li>
  <li><strong>Where</strong>: Mobile? Web? Cả hai? Multi-region?</li>
  <li><strong>Why</strong>: Business value? Đo bằng metric gì?</li>
  <li><strong>How</strong>: Hệ thống hiện tại liên quan? Integration?</li>
</ul>

<h3>3 loại requirement</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px">Loại</th>
<th style="border:1px solid #ccc;padding:6px">Ví dụ</th>
<th style="border:1px solid #ccc;padding:6px">Đo lường</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px"><strong>Functional</strong></td><td style="border:1px solid #ccc;padding:6px">"User đăng nhập bằng email+password"</td><td style="border:1px solid #ccc;padding:6px">Test case PASS/FAIL</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px"><strong>Non-functional</strong></td><td style="border:1px solid #ccc;padding:6px">"API response &lt; 200ms p95"</td><td style="border:1px solid #ccc;padding:6px">Benchmark, metric</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px"><strong>Constraint</strong></td><td style="border:1px solid #ccc;padding:6px">"Stack Java + Postgres", "Budget 50M VND"</td><td style="border:1px solid #ccc;padding:6px">Lựa chọn bị giới hạn</td></tr>
</table>

<h3>Cấu trúc SRS đơn giản (~5 trang đủ cho mini project)</h3>
<ol>
  <li><strong>Mục tiêu</strong> (1 paragraph): vấn đề gì? thành công đo sao?</li>
  <li><strong>Actor</strong>: list role + mô tả ngắn.</li>
  <li><strong>Use case</strong>: bảng "Actor | Use case | Mô tả | Priority" — priority MoSCoW (Must/Should/Could/Won't).</li>
  <li><strong>Functional requirements</strong>: chi tiết mỗi use case.</li>
  <li><strong>Non-functional</strong>: performance, security, availability.</li>
  <li><strong>Constraint</strong>: tech stack, budget, deadline.</li>
  <li><strong>Out of scope</strong>: <em>QUAN TRỌNG</em> — list cái KHÔNG làm.</li>
</ol>

<h3>User Story format (Agile)</h3>
<pre>As a [actor],
I want to [action],
so that [benefit].

Acceptance Criteria:
- Given [context],
- When [action],
- Then [outcome].</pre>

Ví dụ:
<pre>As a customer,
I want to filter products by price range,
so that I can find products within my budget.

AC:
- Given I'm on the product listing page,
- When I set min=100k, max=500k and click Apply,
- Then only products with price in [100k, 500k] are shown,
- And the URL contains ?minPrice=100000&maxPrice=500000.</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Skip spec, code thẳng</strong>: 70% scope thay đổi sau khi khách thấy demo → rework gấp đôi thời gian tiết kiệm được.</li>
  <li><strong>Spec mơ hồ ("user-friendly", "fast")</strong>: không đo được → không bao giờ "xong". Phải đo: p95 &lt; 200ms, click 3 lần tới checkout.</li>
  <li><strong>Quên "Out of scope"</strong>: khách thêm feature giữa chừng → scope creep.</li>
  <li><strong>Lẫn functional vs constraint</strong>: "phải dùng React" KHÔNG phải user need — là constraint.</li>
  <li><strong>Edge case không define</strong>: "thêm sản phẩm vào giỏ" — nếu sản phẩm đã hết hàng? Đã có trong giỏ? User đăng xuất giữa chừng?</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao viết spec quan trọng với junior?</h3>
<ul>
  <li><strong>Bắt buộc hiểu vấn đề trước khi giải</strong> — không thể "code first, think later".</li>
  <li><strong>Tài liệu giao tiếp với non-dev</strong> — PM, designer, sale, khách đều đọc được.</li>
  <li><strong>Test có cơ sở</strong> — mỗi AC = 1 test case.</li>
  <li><strong>Quote estimate đúng</strong> — không có spec thì estimate là đoán mò.</li>
  <li><strong>Skill phỏng vấn</strong> — interviewer hỏi "design X system" thực ra là test khả năng đào spec.</li>
</ul>

<h3>Ví dụ thực tế: từ "trang chủ" tới spec</h3>
<strong>Vague</strong>: "Tôi muốn trang chủ đẹp."
<br/><br/>
<strong>Đào sâu</strong>:
<ul>
  <li>Đẹp = gì? Modern? Minimal? Lễ hội?</li>
  <li>Có những section nào? Hero? Featured products? Categories?</li>
  <li>Hero kích thước? Carousel hay static? Bao nhiêu slide?</li>
  <li>Featured products lấy từ đâu? Admin chọn tay hay auto theo sale?</li>
  <li>Responsive bao nhiêu breakpoint? iOS Safari có support?</li>
</ul>
<br/>
<strong>Spec</strong>:
<ul>
  <li>FR-01: Hero section là 1 image fixed 1920×800px, có CTA button "Mua ngay" link tới /products.</li>
  <li>FR-02: Section "Sản phẩm nổi bật" hiển thị 8 sản phẩm. Admin đánh dấu <code>is_featured = true</code>. Sort theo <code>featured_at DESC</code>.</li>
  <li>FR-03: 4 category card link tới /products?category=X.</li>
  <li>NFR-01: First Contentful Paint &lt; 1.5s trên 4G Vietnam.</li>
  <li>NFR-02: Responsive 320px → 1920px. Tested trên Chrome, Safari iOS, Samsung Internet.</li>
  <li>Out of scope: chat box, blog section, multi-language (Phase 2).</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Practice: đào spec từ vision mơ hồ',
          prompt: `Khách hàng nói: "Tôi muốn app quản lý nhân sự cho công ty 200 người". Đặt cho mình 15 câu hỏi để đào spec TRƯỚC khi viết 1 dòng code. KHÔNG cho code. KHÔNG cho database schema. Chỉ hỏi:
1. Actor nào dùng? (HR? Manager? Employee thường?)
2. Mỗi actor làm gì cụ thể? Liệt kê use case.
3. Quy trình hiện tại đang dùng gì? (Excel? Phần mềm khác?)
4. Tích hợp với hệ thống nào? (Payroll, Slack, AD?)
5. ... (tự nghĩ tiếp 10 câu)
Khi nghĩ xong, viết SRS 3 trang dạng list — sẽ cảm thấy "ah, code dễ hơn nhiều khi có cái này".`
        }
      ],
      keyTakeaways: {
        vi: [
          'Spec trước, code sau. Skip spec = rework 2×.',
          '3 loại requirement: functional, non-functional, constraint — KHÔNG được lẫn.',
          '"Out of scope" quan trọng không kém scope.',
          'Mỗi user story phải có AC đo được — Given/When/Then.',
          'Junior senior khác nhau ở khả năng đào spec, không phải gõ phím nhanh.'
        ]
      }
    },

    {
      id: 'l-3-8-2',
      type: 'theory',
      title: 'Use Case Diagram — Map actor và chức năng',
      subtitle: { vi: 'Vẽ 1 diagram thay 5 trang text. Use case diagram = bản đồ chức năng level cao nhất.' },
      mentalModel: {
        vi: `Use case diagram trả lời câu hỏi: <em>"Hệ thống làm gì cho ai?"</em>
<ul>
  <li><strong>Actor</strong> (hình người): user/system bên ngoài tương tác với hệ thống.</li>
  <li><strong>Use case</strong> (oval): 1 chức năng có giá trị business.</li>
  <li><strong>System boundary</strong> (rectangle): ranh giới giữa "trong" và "ngoài".</li>
  <li><strong>Relationship</strong>:
    <ul>
      <li><code>--&gt;</code> association (actor dùng use case)</li>
      <li><code>&lt;&lt;include&gt;&gt;</code>: use case A LUÔN gọi B (Login include CheckCredentials)</li>
      <li><code>&lt;&lt;extend&gt;&gt;</code>: use case A CÓ THỂ extend B (Order extend ApplyCoupon)</li>
      <li><code>generalization</code>: actor inherit (Admin is-a User)</li>
    </ul>
  </li>
</ul>`
      },
      underTheHood: {
        vi: `<h3>Ví dụ: E-commerce app</h3>
<pre>+--------------------------- System: E-Shop ----------------------------+
|                                                                       |
|     ( Browse Products )                                               |
|            ^                                                          |
|  Customer  |              ( Apply Coupon )                            |
|     o------+-----( Add to Cart )------|                               |
|     |             ^         |          v   &lt;&lt;extend&gt;&gt;                |
|     |             |         +-----&gt; ( Checkout ) &lt;----                |
|     |             |                       |    &lt;&lt;include&gt;&gt;            |
|     |             |                       v                          |
|     |             |              ( Process Payment )                  |
|     |             |                       |                          |
|     |     ( Track Order )                 v                          |
|     |             ^         ( Send Confirmation Email )               |
|     |             |                                                  |
|     v             |                                                  |
|     ( Login )-----+----&lt;&lt;include&gt;&gt;---( Verify Credentials )         |
|                                                                       |
|     o Admin (extends Customer)                                        |
|     |                                                                |
|     +-----( Manage Products )                                        |
|     +-----( View Reports )                                            |
+-----------------------------------------------------------------------+

Actors outside:
  - Customer (human)
  - Admin (human, extends Customer)
  - Payment Gateway (external system) ----&gt; ( Process Payment )</pre>

<h3>Quy tắc viết tốt</h3>
<ul>
  <li><strong>Use case = verb + noun</strong>: "Track Order" not "Order Tracking".</li>
  <li><strong>Mức độ phù hợp</strong>: không quá chi tiết. "Click button" không phải use case, "Place Order" mới là.</li>
  <li><strong>Mỗi use case phải có business value</strong> — actor đạt được mục tiêu sau khi hoàn thành.</li>
  <li><strong>5-15 use case mỗi diagram</strong>. Nhiều quá → tách module.</li>
</ul>

<h3>Tool vẽ</h3>
<ul>
  <li><strong>draw.io / diagrams.net</strong>: free, web/desktop, có UML shape sẵn.</li>
  <li><strong>PlantUML</strong>: code-based, version control friendly. Vẽ bằng text:
<pre>@startuml
actor Customer
actor Admin

Customer --&gt; (Browse Products)
Customer --&gt; (Add to Cart)
Customer --&gt; (Checkout)
(Checkout) ..&gt; (Process Payment) : &lt;&lt;include&gt;&gt;
(Checkout) &lt;.. (Apply Coupon)   : &lt;&lt;extend&gt;&gt;

Admin --|&gt; Customer
Admin --&gt; (Manage Products)
@enduml</pre>
  </li>
  <li><strong>Mermaid</strong>: chạy được trong markdown/Notion/GitHub.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Use case quá nhỏ</strong>: "Click Login Button" → đó là interaction, không phải use case. "Authenticate User" mới là.</li>
  <li><strong>Use case quá to</strong>: "Use System" — vô nghĩa. Phải break down.</li>
  <li><strong>Quên external system</strong> như Payment Gateway, Email Service — chúng là actor.</li>
  <li><strong>Lẫn include vs extend</strong>: include = LUÔN gọi, extend = CÓ THỂ. "Login include CheckPassword" (luôn), "Checkout extend ApplyCoupon" (optional).</li>
  <li><strong>Diagram đẹp nhưng không đúng spec</strong>: vẽ xong mang cho khách check — nếu họ không hiểu thì làm lại.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Vẽ use case cho Library Management',
          prompt: `Lấy giấy + bút. Vẽ use case diagram cho hệ thống thư viện (đã làm ở Phase 1.8). Tự kiểm tra:
1. Actor đầy đủ chưa? Librarian, Member, AdminLibrary?
2. Use case có verb+noun? "Borrow Book" ✓, "Book" ✗.
3. Use case "Pay Late Fee" — extend "Return Book" hay standalone?
4. "Send Overdue Reminder" — actor là ai? (System tự gọi qua scheduler.)
5. Có External actor không? (Email service?)
Sau khi vẽ, mở PlantUML/draw.io và transcribe — luyện cả 2 hình thức.`
        }
      ],
      keyTakeaways: {
        vi: [
          'Use case diagram = bản đồ chức năng level cao.',
          'Actor + Use case + System boundary + Relationship.',
          'Use case = verb + noun, có business value, 5-15 cái/diagram.',
          'include LUÔN, extend CÓ THỂ — không lẫn.',
          'PlantUML cho diagram-as-code, version control friendly.'
        ]
      }
    },

    {
      id: 'l-3-8-3',
      type: 'theory',
      title: 'Class Diagram & Sequence Diagram — Static & Dynamic view',
      subtitle: { vi: 'Class diagram trả lời "có gì". Sequence diagram trả lời "chạy thế nào". 2 mặt của 1 đồng xu.' },
      mentalModel: {
        vi: `<strong>Class Diagram</strong> = chụp ảnh "đứng yên" cấu trúc code:
<ul>
  <li>Có class nào (User, Order, Product).</li>
  <li>Class có field/method gì.</li>
  <li>Class quan hệ với nhau ra sao (1-1, 1-N, N-N).</li>
</ul>

<strong>Sequence Diagram</strong> = phim "chuyển động" của 1 use case:
<ul>
  <li>Actor + objects tham gia.</li>
  <li>Message gửi qua lại theo thứ tự thời gian (đọc trên xuống).</li>
  <li>Return value, condition (alt/loop).</li>
</ul>
Cả 2 ăn ý với nhau: class diagram nói "có gì", sequence nói "chạy ra sao".`
      },
      underTheHood: {
        vi: `<h3>Class Diagram Notation</h3>
<pre>+-------------------+
|     User          |
+-------------------+
| - id: Long        |    -- private
| - name: String    |
| # email: String   |    # protected
| + role: Role      |    + public
+-------------------+
| + login(p): bool  |
| + logout(): void  |
+-------------------+

Relationships:
  ┌──────┐               ┌────────┐
  │ User │1───────── n*  │ Order  │   1-N association
  └──────┘               └────────┘

  ┌──────┐               ┌────────┐
  │ Car  │◇─────────     │ Engine │   composition (Car CHỨA Engine; Car chết → Engine chết)
  └──────┘               └────────┘

  ┌──────┐               ┌────────┐
  │ Lib  │◊─────────     │ Book   │   aggregation (Lib CÓ Book; Lib chết → Book sống)
  └──────┘               └────────┘

  ┌──────────┐           ┌────────┐
  │ Customer │ ────►     │ User   │   inheritance (Customer is-a User)
  └──────────┘           └────────┘

  ┌──────────────┐  ─ ─ ─►  ┌─────────────┐
  │ OrderService │           │ Repository  │   dependency (uses temporarily)
  └──────────────┘          └─────────────┘</pre>

<h3>PlantUML class diagram</h3>
<pre>@startuml
class User {
  -id: Long
  -name: String
  +login(password): boolean
}

class Order {
  -id: Long
  -amount: BigDecimal
  -status: OrderStatus
  +cancel(): void
}

class OrderItem {
  -quantity: int
  -unitPrice: BigDecimal
}

User "1" --&gt; "*" Order : places
Order "1" *-- "*" OrderItem : contains
Order --&gt; Product

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  CANCELLED
}
@enduml</pre>

<h3>Sequence Diagram Notation</h3>
<pre>Actor          Controller       OrderService       PaymentGateway
  |                 |                 |                   |
  |--POST /order--&gt;|                 |                   |
  |                 |--createOrder()-&gt;|                  |
  |                 |                 |--charge()-------&gt;|
  |                 |                 |                  |
  |                 |                 |&lt;-----success-----|
  |                 |                 |--save DB---------|
  |                 |&lt;----Order-------|                  |
  |&lt;---201 Created--|                 |                  |
  |                 |                 |                  |
</pre>

<h3>PlantUML sequence — Checkout flow</h3>
<pre>@startuml
actor Customer
participant Controller
participant OrderService
participant InventoryService
database PostgreSQL
participant PaymentGateway
queue RabbitMQ

Customer -&gt; Controller : POST /checkout
activate Controller

Controller -&gt; OrderService : createOrder(cart)
activate OrderService

OrderService -&gt; InventoryService : reserveItems(items)
activate InventoryService
InventoryService -&gt; PostgreSQL : UPDATE stock
InventoryService --&gt; OrderService : reserved
deactivate InventoryService

OrderService -&gt; PaymentGateway : charge(amount, card)
activate PaymentGateway
PaymentGateway --&gt; OrderService : payment_token
deactivate PaymentGateway

OrderService -&gt; PostgreSQL : INSERT order
OrderService -&gt; RabbitMQ : publish OrderCreatedEvent
OrderService --&gt; Controller : Order
deactivate OrderService

Controller --&gt; Customer : 201 Created
deactivate Controller
@enduml</pre>

<h3>Activation bar, alt, loop</h3>
<ul>
  <li><strong>Activation bar</strong>: vạch dọc thể hiện thời gian object đang xử lý.</li>
  <li><strong>alt / else</strong>: condition branch.</li>
  <li><strong>loop</strong>: lặp.</li>
  <li><strong>opt</strong>: optional (chỉ chạy nếu condition).</li>
</ul>

<pre>alt payment success
  PaymentGateway --&gt; OrderService : token
  OrderService -&gt; DB : save order PAID
else payment fail
  PaymentGateway --&gt; OrderService : error
  OrderService -&gt; DB : save order FAILED
  OrderService -&gt; RabbitMQ : notify
end</pre>

<h3>Pitfalls</h3>
<ul>
  <li><strong>Class diagram quá chi tiết</strong>: liệt kê all getter/setter → noise. Chỉ public API quan trọng.</li>
  <li><strong>Lẫn composition vs aggregation</strong>: composition "chết theo", aggregation "sống độc lập". Library + Book = aggregation.</li>
  <li><strong>Sequence diagram thiếu return</strong>: chỉ vẽ call, không vẽ return → hiểu chỉ 1 chiều.</li>
  <li><strong>Quên alt/loop cho error path</strong>: chỉ vẽ happy path → spec thiếu error handling.</li>
  <li><strong>Class diagram &gt; 20 class trong 1 hình</strong>: không đọc được. Tách theo bounded context.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Khi nào vẽ cái nào?</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px">Diagram</th>
<th style="border:1px solid #ccc;padding:6px">Khi nào</th>
<th style="border:1px solid #ccc;padding:6px">Audience</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px">Use Case</td><td style="border:1px solid #ccc;padding:6px">Đầu project, scope chức năng</td><td style="border:1px solid #ccc;padding:6px">Khách, PM, Dev</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Class</td><td style="border:1px solid #ccc;padding:6px">Design data model + architecture</td><td style="border:1px solid #ccc;padding:6px">Dev team</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sequence</td><td style="border:1px solid #ccc;padding:6px">Design 1 flow phức tạp (checkout, login, payment)</td><td style="border:1px solid #ccc;padding:6px">Dev, tester</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">ER Diagram</td><td style="border:1px solid #ccc;padding:6px">Design DB schema</td><td style="border:1px solid #ccc;padding:6px">Dev, DBA</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Component</td><td style="border:1px solid #ccc;padding:6px">Architecture overview microservice</td><td style="border:1px solid #ccc;padding:6px">Architect, Ops</td></tr>
</table>

<h3>Workflow thực tế</h3>
<ol>
  <li>Đọc requirement → vẽ <strong>use case diagram</strong> để confirm scope.</li>
  <li>Identify domain entity → vẽ <strong>class diagram</strong> + ER diagram cho DB.</li>
  <li>Với mỗi use case quan trọng → vẽ <strong>sequence diagram</strong>.</li>
  <li>Code → diagram update khi design đổi (KHÔNG để diagram outdated).</li>
</ol>

<h3>Diagram-as-code (recommend)</h3>
PlantUML + Mermaid là <em>text-based</em> → commit Git → review trong PR như code. Khác Visio/draw.io xuất binary file khó diff.
<br/><br/>
GitHub render Mermaid natively trong README:
<pre>\`\`\`mermaid
sequenceDiagram
    Customer-&gt;&gt;+Controller: POST /order
    Controller-&gt;&gt;+OrderService: create()
    OrderService--&gt;&gt;-Controller: Order
    Controller--&gt;&gt;-Customer: 201
\`\`\`</pre>`
      },
      socraticPrompts: [
        {
          title: 'Design checkout từ đầu',
          prompt: `Bạn được giao thiết kế use case "Checkout" cho e-commerce. KHÔNG cho code. KHÔNG cho diagram. Hỏi tôi:
1. Actor nào tham gia? (Customer + external: PaymentGateway, EmailService)
2. Pre-condition: cần có giỏ hàng ≥ 1 sản phẩm, user đã login.
3. Happy path bao gồm các bước nào? Liệt kê 5-7 bước theo thứ tự.
4. Error path? (Hết hàng giữa chừng, payment fail, network drop.)
5. State trước và sau Checkout của: Order, Inventory, Payment?
6. Async vs sync — bước nào có thể async để response nhanh hơn?
7. Khi diagram xong, peer review: ai cũng hiểu được không?`
        }
      ],
      keyTakeaways: {
        vi: [
          'Class diagram = static, sequence diagram = dynamic.',
          'Composition (chết theo) vs aggregation (sống độc lập).',
          'Sequence diagram phải có cả happy path + alt cho error.',
          'Diagram-as-code (PlantUML, Mermaid) > Visio cho review/version control.',
          'Diagram phải updated cùng code — outdated diagram tệ hơn không có.'
        ]
      }
    }
  ],
  references: [
    { title: 'UML 2.5.1 Specification (OMG)', url: 'https://www.omg.org/spec/UML/2.5.1/' },
    { title: 'PlantUML Documentation', url: 'https://plantuml.com/' },
    { title: 'Use Case Diagram tutorial', url: 'https://www.uml-diagrams.org/use-case-diagrams.html' }
  ]

}
