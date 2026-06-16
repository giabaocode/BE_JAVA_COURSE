// ============================================================================
//  PHASE 4 — Capstone A: PC/Laptop Repair & Inventory Backend ("RepairCore")
//  Gắn trực tiếp internship công ty phần cứng. Full stack Phase 3:
//  Java 21 + Spring Boot 3 + PostgreSQL + Docker + Flyway + JWT + JPA + Test.
// ============================================================================

export default {
  id: 'mod-4-4',
  title: 'Capstone A — RepairCore: Repair & Inventory Backend',
  prerequisites: { vi: 'Hoàn thành <strong>Phase 3</strong> (Spring Boot, JPA, Security/JWT, Testing, Docker). Đây là capstone gắn THẲNG internship phần cứng — và là project portfolio "backend doanh nghiệp" mạnh nhất của bạn.' },
  lessons: [
    {
      id: 'l-4-4-overview',
      type: 'theory',
      title: 'RepairCore — Tổng quan, domain & kiến trúc',
      subtitle: { vi: 'Backend quản lý sửa chữa + tồn kho cho công ty PC/laptop. Mô hình hoá đúng nghiệp vụ trước khi code.' },
      mentalModel: {
        vi: `RepairCore là "bộ não phần mềm" sau quầy sửa chữa: khách mang máy tới → tạo <strong>phiếu sửa (repair ticket)</strong> → kỹ thuật viên chẩn đoán → báo giá → sửa → test → trả máy; song song là <strong>tồn kho linh kiện</strong> và <strong>bảo hành</strong>.
<br/><br/>
Đây KHÔNG phải tutorial blog — nó là nghiệp vụ THẬT bạn gặp ở công ty. Mục tiêu: một backend "production-shape" bạn có thể (1) demo cho sếp, (2) đưa vào CV như project backend doanh nghiệp.`
      },
      underTheHood: {
        vi: `<h3>Domain model (10 bảng cốt lõi)</h3>
<ul>
  <li><code>customers</code>, <code>technicians</code> (kèm role).</li>
  <li><code>products</code>/<code>components</code> (catalog), <code>inventory_items</code> (tồn kho), <code>serial_numbers</code> (theo dõi từng máy/linh kiện).</li>
  <li><code>repair_tickets</code> (phiếu sửa — trung tâm), <code>diagnostic_logs</code> (nhật ký chẩn đoán).</li>
  <li><code>warranty_records</code> (bảo hành), <code>quotes</code> (báo giá), <code>orders</code> (đơn hàng).</li>
  <li><code>audit_log</code> (ai làm gì, lúc nào — cho thao tác quan trọng).</li>
</ul>

<h3>Ticket lifecycle = state machine (tái dùng ShopCore)</h3>
<pre>received → diagnosing → waiting_parts → repairing → testing → completed → returned
                                                                         ↘ cancelled</pre>
Mọi chuyển trạng thái đi qua <code>transitionTo()</code> có validate — KHÔNG cho <code>setStatus()</code> tùy tiện (vd không thể nhảy thẳng received → returned).

<h3>Roles &amp; quyền</h3>
<ul>
  <li><strong>ADMIN</strong>: toàn quyền + cấu hình.</li>
  <li><strong>TECHNICIAN</strong>: nhận ticket, cập nhật trạng thái/chẩn đoán.</li>
  <li><strong>SALES</strong>: tạo customer, báo giá, đơn hàng.</li>
  <li><strong>VIEWER</strong>: chỉ đọc (dashboard, tra cứu).</li>
</ul>

<h3>Dashboard API (đọc) — thứ sếp muốn thấy</h3>
số máy đang sửa · ticket quá hạn (quá SLA) · linh kiện tồn kho thấp · doanh thu/báo giá · lỗi phổ biến nhất.

<h3>Tech stack</h3>
Java 21 · Spring Boot 3.x · PostgreSQL 16 · Docker Compose · Flyway · Spring Security/JWT · JPA · Bean Validation · GlobalExceptionHandler (ProblemDetail) · Swagger (springdoc) · Testcontainers · JUnit/Mockito.`
      },
      theory: {
        vi: `<h3>Junior Pitfalls (tránh ngay từ thiết kế)</h3>
<ul>
  <li>Trả Entity ra controller → lộ field nội bộ + N+1. Luôn dùng DTO.</li>
  <li>Endpoint list không phân trang (<code>findAll()</code> public) → chết khi data lớn. Luôn <code>Pageable</code>.</li>
  <li>Cho phép chuyển trạng thái ticket tùy tiện → dữ liệu vô nghĩa. Dùng state machine.</li>
  <li>Tiền (báo giá/đơn) lưu <code>double</code> → sai số. Dùng <code>long</code> (xu) hoặc <code>BigDecimal</code>.</li>
  <li>Serial không UNIQUE → trùng máy. Ràng buộc DB + xử lý 409.</li>
  <li>Quên audit log cho thao tác quan trọng → không truy được "ai đổi giá/đổi trạng thái".</li>
</ul>

<h3>Definition of Done (toàn project)</h3>
<ul>
  <li><code>mvn test</code> xanh; coverage service ≥ 70%.</li>
  <li>Swagger UI chạy, liệt kê đủ endpoint + auth bearer.</li>
  <li><code>docker compose up</code> chạy được trên máy sạch (app + Postgres).</li>
  <li>KHÔNG trả Entity; KHÔNG endpoint list public không phân trang.</li>
  <li>Mã lỗi đúng: 400/401/403/404/409.</li>
  <li>Test phân quyền: ADMIN/TECHNICIAN/SALES/VIEWER + unauthenticated.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Thiết kế schema từ nghiệp vụ',
          prompt: `KHÔNG cho code. Hỏi tôi để tôi tự thiết kế schema RepairCore:
1. Một repair_ticket liên kết tới customer, technician, và (các) linh kiện thay thế — quan hệ nào 1-n, nào n-n?
2. serial_number gắn vào máy khách HAY vào linh kiện trong kho? Có thể cả hai? Khóa chính/UNIQUE ra sao?
3. quote và order khác nhau gì về nghiệp vụ? Khi nào quote thành order?
4. warranty gắn vào serial hay vào order? Tính hạn bảo hành từ mốc nào?
5. Field nào cần cho audit_log để truy "ai đổi trạng thái ticket lúc nào"?`
        },
        {
          title: 'State machine cho ticket',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Vì sao encode chuyển trạng thái bằng Map<Status, Set<Status>> thay vì để service setStatus() tùy ý?
2. received → returned trực tiếp có hợp lệ không? Vì sao cần chặn?
3. cancelled có thể xảy ra ở những trạng thái nào? Sau completed có cancel được không?
4. Khi chuyển sang waiting_parts, cần kiểm tra/ghi nhận gì về tồn kho?`
        }
      ],
      keyTakeaways: {
        vi: [
          'RepairCore = repair ticket (trung tâm) + inventory + warranty, mô hình hoá nghiệp vụ thật.',
          'Ticket lifecycle là state machine có validate (tái dùng ShopCore); không setStatus tùy tiện.',
          '4 role (ADMIN/TECHNICIAN/SALES/VIEWER) + audit log cho thao tác quan trọng.',
          'Definition of Done: test xanh + Swagger + docker compose + không trả Entity + mã lỗi đúng + test phân quyền.'
        ]
      }
    },
    {
      id: 'l-4-4-blueprint',
      type: 'project',
      title: 'RepairCore — Các bước xây (12 bước)',
      subtitle: { vi: 'Build từng bước nhỏ, mỗi bước chạy được. Đi qua quy trình 9 bước Claude Code (Phase 5/6).' },
      steps: [
        {
          id: 's1', title: 'Bootstrap + Docker + Flyway',
          description: { vi: 'Khởi tạo Spring Boot 3 (web, data-jpa, validation, security, postgresql, flyway). docker-compose Postgres. Package theo feature: customer/, product/, inventory/, ticket/, warranty/, quote/, common/.' },
          deliverable: { vi: '<code>docker compose up</code> lên Postgres; app start; Flyway V1 chạy; <code>/actuator/health</code> = UP.' }
        },
        {
          id: 's2', title: 'Schema (Flyway V1)',
          description: { vi: 'Tạo 10 bảng: customers, technicians, products, inventory_items, serial_numbers, repair_tickets, diagnostic_logs, warranty_records, quotes, orders, audit_log.' },
          hints: ['serial_numbers.serial UNIQUE.', 'Tiền lưu BIGINT cents.', 'Index FK (Postgres KHÔNG tự tạo).'],
          deliverable: { vi: 'Migration tạo đủ bảng + ràng buộc UNIQUE/FK + index FK. Có seed data mẫu (V2).' }
        },
        {
          id: 's3', title: 'Auth + 4 roles (JWT)',
          description: { vi: 'register/login trả JWT; role ADMIN/TECHNICIAN/SALES/VIEWER; BCrypt; SecurityFilterChain (Spring Security 6).' },
          deliverable: { vi: 'login lấy token; endpoint protected cần Bearer; role sai → 403; token sai → 401 JSON.' }
        },
        {
          id: 's4', title: 'Customer + Product/Component CRUD',
          description: { vi: 'CRUD customers và products/components. DTO + @Valid + GlobalExceptionHandler (ProblemDetail). List có phân trang.' },
          deliverable: { vi: 'CRUD chạy; input sai → 400; list <code>?page&size&sort</code> đúng; KHÔNG trả Entity.' }
        },
        {
          id: 's5', title: 'Inventory + Serial tracking',
          description: { vi: 'inventory_items (số lượng, ngưỡng low-stock), serial_numbers gắn product/máy khách. API nhập/xuất kho.' },
          hints: ['Serial trùng → 409 (bắt DataIntegrityViolationException).', 'Giảm tồn kho khi dùng linh kiện sửa.'],
          deliverable: { vi: 'Thêm/tra serial; nhập-xuất kho cập nhật số lượng; serial trùng → 409.' }
        },
        {
          id: 's6', title: 'Repair Ticket + State Machine',
          description: { vi: 'Tạo ticket gắn customer + máy (serial). transitionTo() validate theo Map<Status,Set<Status>>. Gán technician.' },
          mentalModel: { vi: 'Mọi đổi trạng thái đi qua 1 cửa duy nhất có validate. received → diagnosing → waiting_parts → repairing → testing → completed → returned (+ cancelled). Sai chuyển → 409/400.' },
          socraticPrompts: [{ title: 'Transition hợp lệ', prompt: 'KHÔNG cho code. Hỏi tôi: từ mỗi trạng thái, được phép sang những trạng thái nào? cancelled từ đâu? completed rồi có quay lại được không? Lưu ai đổi (audit) thế nào?' }],
          deliverable: { vi: 'Tạo ticket → 201; chuyển trạng thái hợp lệ → 200; chuyển sai (vd received→returned) → 409; gán technician đúng role.' }
        },
        {
          id: 's7', title: 'Diagnostic logs + part replacement',
          description: { vi: 'Ghi nhật ký chẩn đoán cho ticket; ghi nhận linh kiện thay thế (trừ tồn kho).' },
          deliverable: { vi: 'Thêm diagnostic log vào ticket; thay linh kiện → tồn kho giảm + ghi log.' }
        },
        {
          id: 's8', title: 'Warranty lookup',
          description: { vi: 'API tra cứu bảo hành theo serial: còn hạn không, mua khi nào, đã sửa gì.' },
          deliverable: { vi: 'GET tra cứu serial trả: trạng thái bảo hành + lịch sử sửa; serial không tồn tại → 404.' }
        },
        {
          id: 's9', title: 'Quote → Order',
          description: { vi: 'Tạo báo giá (line items, tiền = long cents); duyệt quote → tạo order. SALES tạo, ADMIN duyệt.' },
          hints: ['Snapshot đơn giá lúc báo giá (giá đổi sau không ảnh hưởng quote cũ).'],
          deliverable: { vi: 'Tạo quote → order; tổng tiền tính đúng (long cents); phân quyền SALES/ADMIN đúng.' }
        },
        {
          id: 's10', title: 'Audit log',
          description: { vi: 'Ghi audit cho thao tác quan trọng: đổi trạng thái ticket, đổi giá, xuất kho, duyệt order. (ai, hành động, khi nào, entity).' },
          deliverable: { vi: 'Mỗi thao tác quan trọng sinh 1 audit row truy được "ai làm gì lúc nào".' }
        },
        {
          id: 's11', title: 'Dashboard API',
          description: { vi: 'Endpoint đọc tổng hợp: số máy đang sửa, ticket quá hạn (SLA), tồn kho thấp, doanh thu/báo giá, lỗi phổ biến nhất.' },
          hints: ['Dùng aggregate query (GROUP BY) thay vì load hết rồi đếm ở Java.'],
          deliverable: { vi: 'GET /dashboard trả số liệu đúng; query tổng hợp ở DB; VIEWER đọc được.' }
        },
        {
          id: 's12', title: 'Test + Swagger + Docker + README',
          description: { vi: 'Unit (service) + slice (controller) + integration (Testcontainers). Swagger bearer. docker-compose app+DB. README + ERD + Postman/curl + demo script.' },
          deliverable: { vi: '<code>mvn test</code> xanh, coverage service ≥70%; Swagger liệt kê đủ endpoint; <code>docker compose up</code> chạy máy sạch; README + ERD + demo script.' }
        }
      ],
      stretchGoals: { vi: ['SLA + cảnh báo ticket quá hạn (email — tái dùng Phase 3.5).', 'Export báo cáo CSV (để Capstone B Python import/sync).', 'Lịch sử sửa chữa theo khách hàng (customer repair history).'] }
    }
  ],
  references: [
    { title: 'Spring Boot Reference', url: 'https://docs.spring.io/spring-boot/index.html' },
    { title: 'Spring Security 6 Reference', url: 'https://docs.spring.io/spring-security/reference/' },
    { title: 'Flyway Documentation', url: 'https://documentation.red-gate.com/flyway' },
    { title: 'Testcontainers for Java', url: 'https://java.testcontainers.org/' },
    { title: 'PostgreSQL 16 Documentation', url: 'https://www.postgresql.org/docs/16/' }
  ]
}
