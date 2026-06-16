# -*- coding: utf-8 -*-
"""Build Playbook A->Z cho đồ án Devlog (Spring Boot 3 + PostgreSQL).
Hướng dẫn tuần tự theo milestone, giữ triết lý chống copy-paste:
khung/config thì cho, business logic thì 'tự viết + gợi ý Socratic'.
Arial (tiếng Việt) + Consolas (code). Không emoji."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                Preformatted, HRFlowable, KeepTogether, ListFlowable, ListItem)

OUT = r"C:\Course Java\Phase3-Build-Playbook-Devlog.pdf"
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Arial", os.path.join(F, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-B", os.path.join(F, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Arial-I", os.path.join(F, "ariali.ttf")))
pdfmetrics.registerFont(TTFont("Mono", os.path.join(F, "consola.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-B", italic="Arial-I", boldItalic="Arial-B")

INDIGO=colors.HexColor("#4f46e5"); INK=colors.HexColor("#1e293b"); GREEN=colors.HexColor("#16a34a")
RED=colors.HexColor("#dc2626"); AMBER=colors.HexColor("#b45309"); GRAY=colors.HexColor("#64748b")
LIGHT=colors.HexColor("#f1f5f9"); CODEBG=colors.HexColor("#0f172a"); TEAL=colors.HexColor("#0e7490")

def style(name, **kw):
    base=dict(fontName="Arial", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6); base.update(kw)
    return ParagraphStyle(name, **base)
S={
 "title": style("title", fontName="Arial-B", fontSize=23, leading=27, textColor=INDIGO, spaceAfter=4),
 "subtitle": style("subtitle", fontName="Arial-I", fontSize=12, leading=16, textColor=GRAY, spaceAfter=12),
 "h1": style("h1", fontName="Arial-B", fontSize=15, leading=19, textColor=colors.white, spaceBefore=14, spaceAfter=9, backColor=INDIGO, borderPadding=(6,8,6,8)),
 "ms": style("ms", fontName="Arial-B", fontSize=13.5, leading=17, textColor=colors.white, spaceBefore=14, spaceAfter=2, backColor=TEAL, borderPadding=(5,8,5,8)),
 "h2": style("h2", fontName="Arial-B", fontSize=11.5, leading=15, textColor=INDIGO, spaceBefore=8, spaceAfter=3),
 "body": style("body"),
 "small": style("small", fontSize=9, leading=12.5, textColor=GRAY),
 "li": style("li", spaceAfter=3),
 "callL": style("callL", fontName="Arial-B", fontSize=10, leading=14),
 "cell": style("cell", fontSize=9.5, leading=13, spaceAfter=0),
 "cellb": style("cellb", fontName="Arial-B", fontSize=9.5, leading=13, spaceAfter=0, textColor=colors.white),
}
CODE=ParagraphStyle("code", fontName="Mono", fontSize=8.3, leading=11.5, textColor=colors.white, spaceAfter=0)
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
story=[]
def P(t,s="body"): story.append(Paragraph(t,S[s]))
def SP(h=6): story.append(Spacer(1,h))
def H1(t): story.append(Paragraph(esc(t),S["h1"]))
def H2(t): story.append(Paragraph(esc(t),S["h2"]))
def steps(items): story.append(ListFlowable([ListItem(Paragraph(x,S["li"]),leftIndent=12) for x in items],
                  bulletType="1", leftIndent=16, bulletFormat="%s.", start=1))
def bullets(items): story.append(ListFlowable([ListItem(Paragraph(x,S["li"]),leftIndent=12,value="•") for x in items],
                    bulletType="bullet", start="•", leftIndent=14))
def code(t):
    # Bọc trong Table nền tối để background luôn vẽ (Preformatted backColor không đáng tin khi block cao)
    tbl=Table([[Preformatted(esc(t),CODE)]],colWidths=[170*mm])
    tbl.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),CODEBG),
        ("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),
        ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8)]))
    story.append(tbl); SP(8)
def rule(): story.append(HRFlowable(width="100%",thickness=0.6,color=colors.HexColor("#cbd5e1"),spaceBefore=4,spaceAfter=10))
def callout(label,color,lines):
    inner=[Paragraph(f'<font color="#{color.hexval()[2:]}"><b>{esc(label)}</b></font>',S["callL"])]
    for ln in lines: inner.append(Paragraph(ln,S["body"]))
    t=Table([[inner]],colWidths=[170*mm]); t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LIGHT),("LINEBEFORE",(0,0),(0,-1),3,color),
        ("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),
        ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story.append(t); SP(8)
def table(header,rows,widths):
    data=[[Paragraph(esc(h),S["cellb"]) for h in header]]
    for r in rows: data.append([Paragraph(esc(c),S["cell"]) for c in r])
    t=Table(data,colWidths=widths,repeatRows=1); t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),INDIGO),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("GRID",(0,0),(-1,-1),0.5,colors.HexColor("#cbd5e1")),
        ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#f8fafc")])]))
    story.append(t); SP(10)

def milestone(num, title, lessons, goal, do_steps, code_block=None, code_title=None,
              self_write=None, done=None, avoid=None):
    story.append(Paragraph(esc(f"Milestone {num} — {title}"), S["ms"]))
    P(f'<i>Bài học liên quan: {esc(lessons)}</i>', "small")
    P(f'<b>Mục tiêu:</b> {goal}')
    H2("Các bước làm")
    steps(do_steps)
    if code_block:
        if code_title: P(f'<b>Khung/cấu hình cho sẵn — {esc(code_title)}:</b>', "small")
        code(code_block)
    if self_write: callout("TỰ VIẾT (đừng paste) — gợi ý Socratic", AMBER, self_write)
    if done: callout("HOÀN THÀNH KHI", GREEN, done)
    if avoid: callout("TRÁNH", RED, avoid)
    rule()

# ===================== COVER =====================
P("Build Playbook A → Z", "title")
P("Hướng dẫn tuần tự xây đồ án <b>Devlog (Blog API)</b> từ thư mục rỗng đến deploy live — áp dụng toàn bộ kiến thức Phase 3. Theo nguyên tắc chống copy-paste: khung &amp; cấu hình cho sẵn, business logic bạn TỰ viết (có gợi ý).", "subtitle")
P('<i>Java + DSA Bootcamp · Tài liệu đồng hành Phase 3 · Stack: Java 21 + Spring Boot 3 + PostgreSQL + Docker</i>', "small")
rule()
H1("Cách dùng Playbook này")
bullets([
 "Đi <b>tuần tự</b> Milestone 0 → 11. Mỗi milestone là một lát cắt 'chạy được', không nhảy cóc.",
 "<b>Khung/cấu hình</b> (docker-compose, pom, application.yml, cấu trúc package, security config) — cho sẵn vì là boilerplate, copy để khỏi mất thời gian vặt.",
 "<b>Business logic</b> (service, mapping, query, luồng nghiệp vụ) — KHỐI 'TỰ VIẾT' màu cam: bạn tự code, có gợi ý Socratic. Đây là phần làm bạn GIỎI và qua được phỏng vấn.",
 "Sau mỗi milestone, chạy phần <b>'Hoàn thành khi'</b> (test/curl thật) — xanh mới đi tiếp.",
 "Đổi domain riêng (JobBoard, RecipeBox...)? Thay 'post/tag/tác giả' bằng thực thể của bạn — các bước y hệt.",
])
P("<b>Mất bao lâu?</b> Khoảng 5–9 tuần nếu học song song DSA (xem lịch ở tài liệu 'Áp dụng Phase 3'). Đừng vội — hiểu sâu quan trọng hơn xong nhanh.", "small")

# ===================== MILESTONES =====================
H1("Lộ trình 12 milestone")
table(["#","Milestone","Kết quả bàn giao"],
 [["0","Chuẩn bị & thiết kế","Repo git + schema + sơ đồ UML"],
  ["1","Hạ tầng local","Postgres chạy bằng Docker"],
  ["2","Khởi tạo Spring Boot","App chạy, /actuator/health = UP"],
  ["3","CRUD Post đầu tiên","API /posts hoạt động + validate + lỗi chuẩn"],
  ["4","Quan hệ + phân trang","Author/Tag, list phân trang, hết N+1"],
  ["5","Auth + JWT","register/login, bảo vệ endpoint, phân quyền"],
  ["6","Email + cron","Welcome email async + job định kỳ"],
  ["7","Cache (tùy chọn)","Redis cache endpoint đọc nhiều"],
  ["8","Testing","unit + slice + integration (Testcontainers)"],
  ["9","Dockerize + Deploy","Image + LINK demo live"],
  ["10","Tính năng AI","1 feature AI (tóm tắt / liên quan / chat)"],
  ["11","Đánh bóng portfolio","README + diagram + demo video"]],
 [12*mm, 48*mm, 110*mm])

H1("Chi tiết từng Milestone")

milestone(0, "Chuẩn bị & thiết kế (vẽ trước, code sau)",
 "3.0 SQL Foundation · 3.8 UML & Analysis",
 "Có repo, schema và sơ đồ TRƯỚC khi viết dòng Java đầu tiên.",
 ["Tạo repo: <code>git init</code>, thêm <code>.gitignore</code> (Java/Maven), commit đầu.",
  "Viết spec 1 trang: ai dùng, làm được gì, KHÔNG làm gì (phạm vi).",
  "Vẽ <b>use case</b> + <b>class diagram</b> + 1 <b>sequence diagram</b> (luồng đăng bài) bằng Mermaid, nhúng vào README.",
  "Thiết kế schema (users, posts, tags, post_tags, comments, likes) và viết 5 query SQL bạn sẽ cần."],
 code_block="# .gitignore (rút gọn)\ntarget/\n*.class\n.env\n.idea/\n\n# Mermaid trong README.md (vẽ class nhanh)\nclassDiagram\n  User \"1\" --> \"*\" Post : writes\n  Post \"*\" --> \"*\" Tag : tagged",
 code_title="git + sơ đồ",
 self_write=["Schema SQL là của BẠN — tự thiết kế quan hệ, khóa chính/ngoại, UNIQUE. Hỏi mình: post–tag là quan hệ gì (1-n hay n-n)? slug có cần UNIQUE? like nên PK gì để chặn like trùng?"],
 done=["README có 2 sơ đồ; có file <code>design/schema.sql</code> + 5 query chạy đúng trên dữ liệu mẫu."],
 avoid=["Bỏ qua bước này rồi code 80% mới phát hiện hiểu sai yêu cầu."])

milestone(1, "Hạ tầng local bằng Docker",
 "3.1 Docker & PostgreSQL",
 "Postgres chạy trong Docker, reset/khởi động lại dễ dàng — không cài trực tiếp lên máy.",
 ["Tạo <code>docker-compose.yml</code> (Postgres + pgAdmin).",
  "<code>docker compose up -d</code> → kiểm tra container chạy.",
  "Connect bằng pgAdmin/psql, tạo database <code>devlog</code>.",
  "Chạy thử <code>EXPLAIN ANALYZE</code> trên 1 query để làm quen đọc query plan."],
 code_block="services:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: devlog\n      POSTGRES_PASSWORD: postgres\n    ports: [\"5432:5432\"]\n    volumes: [\"pgdata:/var/lib/postgresql/data\"]\n  pgadmin:\n    image: dpage/pgadmin4\n    environment:\n      PGADMIN_DEFAULT_EMAIL: admin@local.dev\n      PGADMIN_DEFAULT_PASSWORD: admin\n    ports: [\"5050:80\"]\nvolumes: { pgdata: {} }",
 code_title="docker-compose.yml",
 done=["<code>docker compose up</code> lên DB; connect được; restart container dữ liệu vẫn còn (nhờ volume)."],
 avoid=["Commit volume/dữ liệu thật vào git; để cổng 5432 mở ra internet ở server thật."])

milestone(2, "Khởi tạo Spring Boot",
 "3.2 Spring Foundations",
 "Project chạy được, có cấu trúc package rõ, healthcheck UP.",
 ["Vào <b>start.spring.io</b>: Java 21, Maven, Spring Boot 3.x. Thêm dependencies: Web, Data JPA, Validation, PostgreSQL Driver, Flyway, Lombok, Actuator, Spring Security (thêm sau cũng được).",
  "Tạo <b>cấu trúc package theo feature</b> (xem khung dưới).",
  "Điền <code>application.yml</code> (datasource trỏ Docker DB).",
  "Chạy <code>./mvnw spring-boot:run</code> → mở <code>/actuator/health</code>."],
 code_block="com.devlog\n├── DevlogApplication.java\n├── post/        (controller, service, repository, dto, entity)\n├── auth/        (security, jwt, user)\n├── tag/\n├── common/      (exception handler, config)\n\n# application.yml\nspring:\n  datasource:\n    url: jdbc:postgresql://localhost:5432/devlog\n    username: postgres\n    password: ${DB_PASSWORD}\n  jpa:\n    hibernate.ddl-auto: validate     # KHÔNG để 'update' ở prod\n    open-in-view: false\n  flyway.enabled: true\nmanagement.endpoints.web.exposure.include: health,info",
 code_title="cấu trúc package + application.yml",
 done=["<code>/actuator/health</code> trả <code>{\"status\":\"UP\"}</code>; app kết nối DB không lỗi."],
 avoid=["Gói theo layer (controller/, service/ toàn cục) khi dự án lớn dần; để <code>ddl-auto: update</code>."])

milestone(3, "CRUD Post đầu tiên",
 "3.2 (DTO/Validation/Exception) · 3.3 (Entity/Repository/Flyway)",
 "API tạo/đọc/sửa/xóa Post hoạt động, validate input, trả lỗi chuẩn.",
 ["Viết migration <code>V1__init.sql</code> (Flyway) tạo bảng <code>posts</code>.",
  "Tạo <code>Post</code> entity (khung dưới) + <code>PostRepository extends JpaRepository</code>.",
  "Tạo <code>PostRequest</code>/<code>PostResponse</code> DTO + <code>@Valid</code>.",
  "Viết <code>PostService</code> (logic) + <code>PostController</code> (REST).",
  "Thêm <code>GlobalExceptionHandler</code> (@RestControllerAdvice) trả ProblemDetail."],
 code_block="-- V1__init.sql\nCREATE TABLE posts (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  slug VARCHAR(160) NOT NULL UNIQUE,\n  title VARCHAR(200) NOT NULL,\n  body TEXT NOT NULL,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\n// Post.java — KHUNG (điền nốt field/annotation)\n@Entity @Table(name=\"posts\")\npublic class Post {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;\n  // TODO (bạn viết): slug, title, body, createdAt + getter/setter\n}\n\n// PostController.java — KHUNG\n@RestController @RequestMapping(\"/api/v1/posts\")\nclass PostController {\n  // TODO: @PostMapping create, @GetMapping list/{id}, @PutMapping, @DeleteMapping\n}",
 code_title="Flyway + entity/controller skeleton",
 self_write=["<b>PostService.create()</b>: tự viết. Gợi ý: sinh slug từ title thế nào? Trùng slug thì xử lý ra sao? Map DTO→Entity ở đâu (đừng map trong Controller)?",
  "<b>GlobalExceptionHandler</b>: map mỗi loại exception → status nào? 400 cho validation, 404 cho not found, 409 cho slug trùng — bạn quyết và viết."],
 done=["<code>curl -XPOST /api/v1/posts</code> với body hợp lệ → 201; thiếu title → 400 (ProblemDetail); GET /{id} không tồn tại → 404."],
 avoid=["Trả Entity trực tiếp (lộ field); nhồi logic vào Controller; bắt mọi Exception trả 500."])

milestone(4, "Quan hệ + phân trang",
 "3.3 JPA (relationship, pagination, @Transactional, N+1)",
 "Post gắn Author + Tag; danh sách có phân trang; không dính N+1.",
 ["Thêm bảng <code>users</code>, <code>tags</code>, <code>post_tags</code> (V2 migration).",
  "Khai báo quan hệ: <code>Post @ManyToOne Author</code>, <code>Post @ManyToMany Tag</code> (để LAZY).",
  "List posts dùng <code>Pageable</code> → trả <code>Page&lt;PostResponse&gt;</code>.",
  "Bọc thao tác tạo post + gắn tag trong <code>@Transactional</code> ở Service.",
  "Bật log SQL, kiểm N+1 khi load list; sửa bằng JOIN FETCH / @EntityGraph."],
 self_write=["<b>Truy vấn list có filter</b> (theo tag, theo tác giả): tự viết bằng derived query hoặc @Query. Gợi ý: phân trang nên dùng Pageable hay cursor? Vì sao N+1 xảy ra khi map sang DTO có tags?",
  "<b>Đặt @Transactional ở đâu?</b> Tự quyết: Service hay Repository? Vì sao self-invocation làm nó vô hiệu?"],
 done=["GET <code>/posts?page=0&size=10&sort=createdAt,desc</code> trả Page đúng; log SQL cho thấy KHÔNG có N+1 khi list kèm tags."],
 avoid=["EAGER mọi quan hệ; quên @Transactional khi ghi nhiều bảng; trả lazy collection ra ngoài transaction (LazyInitializationException)."])

milestone(5, "Auth + JWT + phân quyền",
 "3.4 Spring Security 6 & JWT",
 "Đăng ký/đăng nhập trả JWT; bảo vệ endpoint ghi; chỉ chủ sở hữu/ADMIN sửa được.",
 ["Tạo <code>User</code> entity + <code>role</code>; băm mật khẩu bằng <b>BCrypt</b>.",
  "Viết <code>JwtService</code> (issue + validate) — secret đọc từ ENV.",
  "Cấu hình <code>SecurityFilterChain</code> (khung dưới) + JWT filter.",
  "Endpoint <code>/auth/register</code>, <code>/auth/login</code>; bảo vệ POST/PUT/DELETE posts.",
  "Kiểm quyền sở hữu: user chỉ sửa/xóa post của chính mình (trừ ADMIN)."],
 code_block="@Configuration @EnableWebSecurity\nclass SecurityConfig {\n  @Bean SecurityFilterChain chain(HttpSecurity http, JwtFilter jwt) throws Exception {\n    http.csrf(c -> c.disable())\n        .authorizeHttpRequests(a -> a\n            .requestMatchers(\"/auth/**\", \"/actuator/health\").permitAll()\n            .requestMatchers(HttpMethod.GET, \"/api/v1/posts/**\").permitAll()\n            .anyRequest().authenticated())\n        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))\n        .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class);\n    return http.build();\n  }\n  @Bean PasswordEncoder encoder() { return new BCryptPasswordEncoder(12); }\n}",
 code_title="SecurityFilterChain (Spring Security 6)",
 self_write=["<b>JwtService</b>: tự viết issue/validate (dùng jjwt 0.12). Gợi ý: claim nào nên đặt? exp bao lâu? vì sao KHÔNG để secret mặc định trong code?",
  "<b>Ownership check</b>: tự viết. Gợi ý: kiểm ở Service hay @PreAuthorize? Trả 403 hay 404 khi sửa post người khác?"],
 done=["register → login lấy token → gọi POST /posts kèm Bearer (201); user B sửa post của A → 403; token sai/hết hạn → 401 JSON."],
 avoid=["Lưu mật khẩu plaintext; hardcode JWT secret; dùng WebSecurityConfigurerAdapter (đã bỏ); để mọi endpoint authenticated kể cả GET công khai."])

milestone(6, "Email chào mừng + cron job",
 "3.5 Email Notification + @Scheduled",
 "Gửi welcome email (async) khi register; có 1 job định kỳ.",
 ["Thêm MailHog vào docker-compose (SMTP giả để xem email lúc dev).",
  "Viết <code>EmailService</code> gửi HTML (Thymeleaf template), đánh dấu <code>@Async</code>.",
  "Gọi gửi welcome email SAU khi register thành công.",
  "Thêm <code>@Scheduled</code> job (vd digest 'bài hot tuần này')."],
 self_write=["<b>Vì sao gửi email không nên nằm TRONG transaction đăng ký?</b> Tự lý giải và đặt chỗ gọi cho đúng (gợi ý: sự kiện AFTER_COMMIT). Nếu SMTP lỗi, đăng ký có nên fail không?"],
 done=["register → thấy email trong MailHog (cổng 8025); cron chạy đúng lịch (quan sát log)."],
 avoid=["Gửi email đồng bộ trong request (user chờ lâu); gửi trong transaction (rollback nhưng email đã bay)."])

milestone(7, "Cache với Redis (TÙY CHỌN)",
 "3.6 Redis + RabbitMQ",
 "Tăng tốc endpoint đọc nhiều bằng cache; biết cách invalidate.",
 ["Thêm Redis vào docker-compose + starter Spring Data Redis.",
  "Bật <code>@EnableCaching</code>; <code>@Cacheable</code> cho <code>getPostBySlug</code>.",
  "<code>@CacheEvict</code> khi post bị sửa/xóa."],
 self_write=["<b>Cache cái gì, KHÔNG cache cái gì?</b> Tự quyết: list hay detail? TTL bao lâu? Gợi ý: dữ liệu đổi thường xuyên có nên cache? Quên evict thì hậu quả gì?"],
 done=["Gọi lần 2 endpoint được cache (đo bằng log/độ trễ giảm); sửa post → lần đọc kế tiếp ra dữ liệu mới (đã evict)."],
 avoid=["Cache dữ liệu hay đổi mà không invalidate (trả data cũ); cache mọi thứ một cách mù quáng."])

milestone(8, "Testing",
 "3.7 Test Pyramid (unit / slice / integration)",
 "Có lưới an toàn để refactor không sợ vỡ.",
 ["Unit test Service bằng Mockito (mock repository).",
  "Slice test Controller bằng <code>@WebMvcTest</code>.",
  "Integration test với <b>Testcontainers</b> (Postgres thật trong test)."],
 self_write=["<b>Test gì trước?</b> Tự chọn: logic dễ sai nhất (sinh slug, ownership, phân trang). Gợi ý: vì sao Testcontainers tốt hơn H2 cho test JPA? Test cả happy path LẪN lỗi (400/403/404)."],
 done=["<code>./mvnw test</code> xanh; coverage tầng service ≥ 70%; có ít nhất 1 integration test chạy với Postgres thật."],
 avoid=["Chỉ test happy path; test phụ thuộc thứ tự chạy; mock luôn cả thứ đang muốn kiểm."])

milestone(9, "Dockerize + Deploy LIVE",
 "3.7 (Dockerize, Actuator, deploy)",
 "App đóng gói image, có link demo công khai — điểm cộng lớn trên CV.",
 ["Viết <code>Dockerfile</code> multi-stage (build + runtime nhẹ, non-root).",
  "<code>docker compose</code> chạy cả app + DB.",
  "Thêm Actuator + structured logging (MDC) + vài metric Micrometer.",
  "Deploy lên <b>Fly.io</b> hoặc <b>Render</b> (free tier), cấu hình ENV (DB, secret) trên đó."],
 code_block="# Dockerfile (multi-stage)\nFROM eclipse-temurin:21-jdk AS build\nWORKDIR /app\nCOPY . .\nRUN ./mvnw -q -DskipTests package\n\nFROM eclipse-temurin:21-jre\nWORKDIR /app\nRUN useradd -r app && chown app /app\nUSER app\nCOPY --from=build /app/target/*.jar app.jar\nENTRYPOINT [\"java\",\"-XX:MaxRAMPercentage=75\",\"-jar\",\"app.jar\"]",
 code_title="Dockerfile multi-stage",
 done=["<code>docker build</code> + <code>docker run</code> chạy app; có URL demo live click được; <code>/actuator/health</code> UP trên server thật."],
 avoid=["Đóng cả JDK vào image runtime (nặng); chạy bằng root; hardcode secret (đưa qua ENV của Fly/Render)."])

milestone(10, "Thêm 1 tính năng AI",
 "3.9 AI Integration (Spring AI · pgvector · RAG · tool calling)",
 "Một tính năng AI thật, có kiểm soát chi phí + fallback.",
 ["Chọn 1: <b>tóm tắt bài</b> (ChatClient + structured output) / <b>tìm bài liên quan theo nghĩa</b> (embeddings + pgvector) / <b>chat hỏi đáp trên blog của bạn</b> (RAG).",
  "Đổi Postgres image sang <code>pgvector/pgvector:pg16</code> nếu dùng vector.",
  "Dev dùng <b>Ollama</b> (model local, miễn phí) để khỏi tốn tiền.",
  "Thêm timeout + fallback khi AI lỗi; key đọc từ ENV."],
 self_write=["<b>Validate output AI thế nào trước khi hiển thị/lưu?</b> Tự thiết kế. Gợi ý: nếu AI 'bịa', UX nên ra sao? Làm sao 1 user spam không làm cháy hóa đơn (cap token, rate limit)?"],
 done=["1 endpoint AI hoạt động end-to-end; AI provider down → app vẫn chạy (fallback), không sập; không hardcode key."],
 avoid=["Tin mù output; không cap chi phí; để feature AI làm sập toàn app khi provider lỗi."])

milestone(11, "Đánh bóng portfolio",
 "Tổng hợp (gắn Phase 5 — Team Skills & Interview)",
 "Biến code thành thứ gây ấn tượng trong 30 giây đầu interviewer nhìn.",
 ["README: 1 ảnh chụp + 1 đoạn mô tả + tech stack + LINK demo + cách chạy local.",
  "Nhúng sơ đồ kiến trúc (Mermaid) + sequence diagram login.",
  "Quay <b>demo video 90 giây</b>: register → đăng bài → tính năng AI.",
  "Dọn git history (commit message rõ ràng); chuẩn bị kể 'vì sao' cho 2–3 quyết định thiết kế."],
 done=["README mở ra hiểu ngay dự án làm gì + click demo được; có video demo; commit log sạch."],
 avoid=["README 5 trang không có ảnh/demo; commit toàn 'fix', 'wip'; deploy chết ngay lúc phỏng vấn (test trước)."])

# ===================== KẾT =====================
H1("Sau khi xong: bạn có gì")
P("Một backend hình dáng production, deploy live, có cả AI — và quan trọng hơn: bạn <b>tự viết</b> phần lõi nên giải thích được mọi quyết định khi phỏng vấn. Đó là khác biệt giữa 'làm theo tutorial' và 'kỹ sư thật'.")
bullets([
 "REST API (Spring Boot 3, Java 21) + JWT auth + phân quyền + BCrypt.",
 "PostgreSQL + JPA: quan hệ, phân trang, Flyway, xử lý N+1, @Transactional.",
 "Email async + cron; (tùy chọn) cache Redis.",
 "Test unit/slice/integration (Testcontainers); Docker multi-stage; deploy LIVE; Actuator/Micrometer.",
 "Một tính năng AI (Spring AI) kèm kiểm soát chi phí &amp; fallback.",
])
P("<i>Mẹo: mỗi milestone nên là 1–2 commit có ý nghĩa. Git log của bạn kể câu chuyện 'xây dần từ A đến Z' — interviewer rất thích nhìn thấy điều đó.</i>", "small")

doc=SimpleDocTemplate(OUT,pagesize=A4,leftMargin=20*mm,rightMargin=20*mm,topMargin=18*mm,bottomMargin=16*mm,
                      title="Phase 3 Build Playbook - Devlog", author="Java + DSA Bootcamp")
def footer(c,d):
    c.saveState(); c.setFont("Arial",8); c.setFillColor(GRAY)
    c.drawCentredString(A4[0]/2,9*mm,f"Build Playbook A→Z · Devlog · trang {d.page}"); c.restoreState()
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print("WROTE",OUT)
