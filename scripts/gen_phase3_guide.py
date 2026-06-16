# -*- coding: utf-8 -*-
"""Sinh PDF: Hướng dẫn áp dụng từng bài Phase 3 vào đồ án thực tế.
Dùng Arial (tiếng Việt) + Consolas (code). Không dùng emoji (tránh tofu box)."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                Preformatted, HRFlowable, KeepTogether, ListFlowable, ListItem)

OUT = r"C:\Course Java\Phase3-Huong-Dan-Ap-Dung-Do-An.pdf"
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Arial", os.path.join(F, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-B", os.path.join(F, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Arial-I", os.path.join(F, "ariali.ttf")))
pdfmetrics.registerFont(TTFont("Mono", os.path.join(F, "consola.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-B", italic="Arial-I", boldItalic="Arial-B")

INDIGO = colors.HexColor("#4f46e5")
INK    = colors.HexColor("#1e293b")
GREEN  = colors.HexColor("#16a34a")
RED    = colors.HexColor("#dc2626")
AMBER  = colors.HexColor("#b45309")
GRAY   = colors.HexColor("#64748b")
LIGHT  = colors.HexColor("#f1f5f9")
CODEBG = colors.HexColor("#0f172a")

ss = getSampleStyleSheet()
def style(name, **kw):
    base = dict(fontName="Arial", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6)
    base.update(kw); return ParagraphStyle(name, **base)

S = {
 "title":  style("title", fontName="Arial-B", fontSize=24, leading=28, textColor=INDIGO, spaceAfter=4),
 "subtitle":style("subtitle", fontName="Arial-I", fontSize=12.5, leading=17, textColor=GRAY, spaceAfter=14),
 "h1":     style("h1", fontName="Arial-B", fontSize=16, leading=20, textColor=colors.white, spaceBefore=16, spaceAfter=10, backColor=INDIGO, borderPadding=(6,8,6,8), leftIndent=0),
 "h2":     style("h2", fontName="Arial-B", fontSize=12.5, leading=16, textColor=INDIGO, spaceBefore=10, spaceAfter=4),
 "body":   style("body"),
 "bodywhite": style("bodywhite", textColor=colors.white),
 "small":  style("small", fontSize=9, leading=12.5, textColor=GRAY),
 "li":     style("li", spaceAfter=3),
 "callL":  style("callL", fontName="Arial-B", fontSize=10, leading=14),
 "cell":   style("cell", fontSize=9.5, leading=13, spaceAfter=0),
 "cellb":  style("cellb", fontName="Arial-B", fontSize=9.5, leading=13, spaceAfter=0, textColor=colors.white),
 "cellh":  style("cellh", fontName="Arial-B", fontSize=9.5, leading=13, spaceAfter=0, textColor=INDIGO),
}
CODE = ParagraphStyle("code", fontName="Mono", fontSize=8.5, leading=12, textColor=colors.white,
                      backColor=CODEBG, borderPadding=(7,8,7,8), spaceAfter=8)

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
story = []
def P(t, s="body"): story.append(Paragraph(t, S[s]))
def SP(h=6): story.append(Spacer(1, h))
def H1(t): story.append(Paragraph(esc(t), S["h1"]))
def H2(t): story.append(Paragraph(esc(t), S["h2"]))
def bullets(items, st="li"):
    story.append(ListFlowable([ListItem(Paragraph(x, S[st]), leftIndent=12, value="•") for x in items],
                              bulletType="bullet", start="•", leftIndent=14))
def code(t): story.append(Preformatted(esc(t), CODE))
def callout(label, color, lines):
    # khung màu trái: nhãn + nội dung
    inner = [Paragraph(f'<font color="#{color.hexval()[2:]}"><b>{esc(label)}</b></font>', S["callL"])]
    for ln in lines:
        inner.append(Paragraph(ln, S["body"]))
    t = Table([[inner]], colWidths=[170*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1), LIGHT),
        ("LINEBEFORE",(0,0),(0,-1), 3, color),
        ("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),
        ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),
    ]))
    story.append(t); SP(8)
def rule(): story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#cbd5e1"), spaceBefore=4, spaceAfter=10))

def table(header, rows, widths):
    data = [[Paragraph(esc(h), S["cellb"]) for h in header]]
    for r in rows:
        data.append([Paragraph(c if isinstance(c,str) else esc(c), S["cell"]) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1)
    sty = [("BACKGROUND",(0,0),(-1,0), INDIGO),
           ("VALIGN",(0,0),(-1,-1),"TOP"),
           ("GRID",(0,0),(-1,-1),0.5, colors.HexColor("#cbd5e1")),
           ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
           ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
           ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, colors.HexColor("#f8fafc")])]
    t.setStyle(TableStyle(sty)); story.append(t); SP(10)

# ============================== COVER ==============================
P("Phase 3 → Đồ Án Thực Tế", "title")
P("Hướng dẫn áp dụng từng bài học Phase 3 (Spring Boot + PostgreSQL + Docker) vào một đồ án backend thật — để vừa học vừa có sản phẩm cho CV.", "subtitle")
P('<i>Khóa: Java + DSA Bootcamp · giabaocode.github.io/BE_JAVA_COURSE · Tài liệu đồng hành Phase 3</i>', "small")
rule()

# ============================== PHẦN 0 ==============================
H1("Phần 0 — Đọc trước khi dùng")

H2("Mình thực hành trên 3 đồ án của khóa hay một đồ án khác?")
P("Câu trả lời ngắn: <b>xây MỘT đồ án xuyên suốt</b> làm trục chính, build dần theo từng bài Phase 3. Không làm 3 cái cùng lúc.")
callout("KHUYẾN NGHỊ", INDIGO, [
 "<b>Trục chính (build-along):</b> chọn 1 đồ án và xây nó lớn dần theo Phase 3 — mỗi module thêm một lớp. Khóa học vốn đã dùng <b>Devlog</b> (Blog API) làm ví dụ xuyên suốt Phase 3 (bài 3.1 đã có sẵn schema mẫu cho Devlog). Nên Devlog là lựa chọn an toàn nhất.",
 "<b>Muốn CV nổi bật hơn?</b> Dùng <b>ý tưởng của riêng bạn</b> nhưng CÙNG cấu trúc với Devlog (API có user + đăng nhập + 1 tài nguyên chính + quan hệ). Cùng kỹ năng Phase 3, nhưng bạn kể chuyện về sản phẩm của mình tốt hơn khi phỏng vấn.",
 "<b>Hai capstone còn lại</b> (ShopCore, TaskFlow) — để DÀNH lại làm đồ án 'nâng cao' SAU khi xong cái đầu, mỗi cái khoe một kỹ năng sâu: ShopCore = tiền/khóa đồng thời/máy trạng thái; TaskFlow = multi-tenant + realtime.",
])
P("<b>Gợi ý vài ý tưởng riêng cùng 'khuôn' Devlog</b> (nếu muốn cá nhân hóa):", "body")
bullets([
 "<b>JobBoard</b> — đăng tin tuyển dụng, ứng viên nộp hồ sơ.",
 "<b>RecipeBox</b> — chia sẻ công thức nấu ăn, tag, lưu yêu thích.",
 "<b>HabitTracker</b> — theo dõi thói quen, nhắc nhở hằng ngày (hợp với module Email/@Scheduled).",
 "<b>MiniForum</b> — hỏi đáp kiểu StackOverflow thu nhỏ, vote câu trả lời.",
])

H2("Cách dùng tài liệu này")
bullets([
 "Học xong mỗi module Phase 3 → mở đúng mục của module đó ở Phần 2.",
 "Làm phần <b>'Áp dụng vào đồ án'</b> ngay trên đồ án trục chính của bạn (đừng để dồn).",
 "Tick <b>'Hoàn thành khi'</b> để biết mình đã làm đủ chưa. Đọc <b>'Tránh'</b> để né lỗi điển hình.",
 "Mục tiêu cuối Phase 3: một API backend hoàn chỉnh, deploy live, có cả tính năng AI — đủ để đưa vào CV và kể trong phỏng vấn.",
])

# ============================== PHẦN 1 — ROADMAP ==============================
H1("Phần 1 — Lộ trình: mỗi module bạn xây thêm gì")
table(
 ["Module Phase 3", "Sau module này, đồ án của bạn có thêm"],
 [
  ["3.0  SQL Foundation", "Schema được thiết kế đúng + bộ truy vấn SQL bạn sẽ cần (trên giấy & chạy thật)."],
  ["3.1  Docker & Postgres", "Hạ tầng local: Postgres chạy bằng Docker, schema đã tạo."],
  ["3.2  Spring Foundations", "CRUD đầu tiên: REST API + DTO + validation + xử lý lỗi chuẩn."],
  ["3.3  Spring Data JPA", "Entity + quan hệ + phân trang + Flyway migration + transaction."],
  ["3.4  Security + JWT", "Đăng ký/đăng nhập, JWT, phân quyền, mật khẩu BCrypt."],
  ["3.5  Email + @Scheduled", "Email chào mừng (async) + một cron job định kỳ."],
  ["3.6  Redis + RabbitMQ", "Cache cho endpoint nóng + (tùy chọn) xử lý bất đồng bộ qua hàng đợi."],
  ["3.7  Testing & Deploy", "Bộ test (unit/slice/integration) + Dockerize + deploy LIVE + observability."],
  ["3.8  UML & Analysis", "Spec + sơ đồ (use case, class, sequence) trong README. LÀM SỚM."],
  ["3.9  AI Integration", "Một tính năng AI thật (tóm tắt / tìm theo nghĩa / chat hỏi đáp / trợ lý)."],
 ],
 [55*mm, 115*mm])
P("<i>Lưu ý thứ tự: 3.8 (vẽ sơ đồ) nên làm SỚM, song song lúc bắt đầu 3.2 — vẽ trước, code sau. 3.6 phần lớn là tùy chọn nâng cao, không bắt buộc cho bản đầu.</i>", "small")

# ============================== PHẦN 2 — CHI TIẾT ==============================
H1("Phần 2 — Áp dụng chi tiết từng module")
P("Ví dụ minh họa dùng đồ án <b>Devlog (Blog API)</b>. Nếu bạn chọn domain khác, thay 'post/tác giả/tag' bằng thực thể tương ứng của bạn — các bước y hệt.")

def module(code_id, title, lessons, apply_lines, done_lines, avoid_lines, code_block=None):
    blk = [Paragraph(f'<b>{esc(code_id)}  {esc(title)}</b>', S["h2"]),
           Paragraph("<i>Các bài: " + esc(lessons) + "</i>", S["small"])]
    story.append(KeepTogether(blk)); SP(2)
    callout("ÁP DỤNG VÀO ĐỒ ÁN", INDIGO, apply_lines)
    if code_block: code(code_block)
    callout("HOÀN THÀNH KHI", GREEN, done_lines)
    callout("TRÁNH", RED, avoid_lines)
    rule()

module("3.0", "SQL Foundation Deep Dive",
 "Mental model · JOIN · Subquery/CTE · GROUP BY/HAVING · Window functions",
 ["Trước khi viết dòng Java nào: <b>thiết kế schema</b> cho đồ án trên giấy (vd: users, posts, tags, post_tags, comments, likes).",
  "Viết tay 5–7 câu <b>SQL thuần</b> bạn chắc chắn sẽ cần và chạy thử trên Postgres, ví dụ:",
  "• '10 bài mới nhất kèm tên tác giả' → JOIN &nbsp; • 'số bài mỗi tác giả' → GROUP BY",
  "• 'xếp hạng bài theo lượt like trong mỗi category' → Window function (RANK).",
  "Mục tiêu: hiểu SQL TRƯỚC khi JPA che giấu nó đi — để sau này đọc được SQL Hibernate sinh ra."],
 ["Có file <code>schema.sql</code> và ít nhất 5 truy vấn chạy đúng trên dữ liệu mẫu."],
 ["Nhảy thẳng vào JPA khi chưa hiểu JOIN/GROUP BY — sẽ không debug nổi N+1 và query chậm sau này."])

module("3.1", "Docker & PostgreSQL",
 "Container vs VM · docker-compose · PG foundations (index, transaction, MVCC) · EXPLAIN/optimization",
 ["Tạo <code>docker-compose.yml</code> chạy <b>Postgres + pgAdmin</b> cho đồ án (không cài Postgres trực tiếp lên máy).",
  "Nạp <code>schema.sql</code> vào DB. Thêm vài dòng dữ liệu mẫu.",
  "Chạy <code>EXPLAIN ANALYZE</code> trên 1 truy vấn để thấy index có/không được dùng."],
 ["<code>docker compose up</code> lên Postgres; connect được qua pgAdmin/psql; schema đã tạo; restart vẫn còn dữ liệu (volume)."],
 ["Cài Postgres trực tiếp (khó reset, 'chạy trên máy tôi thì được'); commit dữ liệu thật/volume vào git."],
 code_block="services:\n  db:\n    image: postgres:16        # hoặc pgvector/pgvector:pg16 nếu định dùng module 3.9\n    environment: { POSTGRES_PASSWORD: postgres }\n    ports: [\"5432:5432\"]\n    volumes: [\"pgdata:/var/lib/postgresql/data\"]\nvolumes: { pgdata: {} }")

module("3.2", "Spring Boot — IoC, REST, Validation, Exception",
 "IoC/DI (constructor injection) · REST Controller + DTO + @Valid · Global Exception (ProblemDetail)",
 ["Khởi tạo project Spring Boot (Maven). Tạo <b>Controller → Service → Repository</b> cho 1 tài nguyên chính (vd Post).",
  "Dùng <b>DTO</b> cho request/response (KHÔNG trả Entity trực tiếp) + <code>@Valid</code> để validate input.",
  "Thêm <code>@RestControllerAdvice</code> trả lỗi chuẩn (ProblemDetail RFC 7807).",
  "Đây là lúc đồ án 'sống' lần đầu: CRUD <code>/api/v1/posts</code> chạy được."],
 ["CRUD posts trả JSON; input sai → 400 với thông báo rõ; lỗi không mong muốn → ProblemDetail, không lộ stack trace."],
 ["Trả Entity trực tiếp (lộ field nhạy cảm); nhồi business logic vào Controller; field injection (@Autowired vào field)."])

module("3.3", "Spring Data JPA & Hibernate",
 "Entity lifecycle/persistence context · Repository/Pagination/@Query · application.yml + Flyway · @Transactional",
 ["Map entity ↔ bảng; khai báo <b>quan hệ</b> (Post–Author @ManyToOne, Post–Tag @ManyToMany).",
  "Repository + <b>phân trang</b> cho danh sách bài. Dùng <b>Flyway</b> migration (V1__init.sql) thay vì <code>ddl-auto</code>.",
  "Bọc thao tác ghi nhiều bảng trong <code>@Transactional</code> (ở tầng Service). Để LAZY mặc định, sửa N+1 bằng JOIN FETCH/@EntityGraph."],
 ["List có phân trang đúng; quan hệ load không bị N+1 (kiểm tra log SQL); Flyway V1 chạy; sửa field entity trong @Transactional tự UPDATE."],
 ["EAGER mọi quan hệ; quên @Transactional khi ghi nhiều bảng; gọi this.method() nội bộ làm @Transactional vô hiệu (self-invocation)."])

module("3.4", "Spring Security 6 & JWT",
 "Filter chain · JwtService (issue/validate) · Refresh token, rate limit, hardening",
 ["Thêm <b>register/login</b> trả JWT. Băm mật khẩu bằng <b>BCrypt</b>. Bảo vệ endpoint ghi (chỉ tác giả/ADMIN sửa được bài của mình).",
  "Cấu hình bằng <code>SecurityFilterChain</code> (Spring Security 6, KHÔNG dùng WebSecurityConfigurerAdapter).",
  "Nâng cao (tùy sức): refresh token + rotation, rate-limit endpoint login."],
 ["register → login lấy token → gọi endpoint protected bằng Bearer token (200); user B sửa bài của user A → 403; token sai → 401 JSON, không 500."],
 ["Lưu mật khẩu plaintext; hardcode JWT secret trong code/yml; trả 500 khi token hỏng; để mọi endpoint public."])

module("3.5", "Email Notification — Spring Mail + @Scheduled",
 "SMTP & starter-mail · EmailService (HTML, @Async) · @Scheduled cron",
 ["Gửi <b>email chào mừng</b> khi user register — chạy <b>bất đồng bộ</b> (@Async), KHÔNG chặn request.",
  "Thêm 1 <b>cron job</b> phù hợp domain (vd: digest 'bài hot tuần này', hoặc nhắc nhở hằng ngày nếu là HabitTracker).",
  "Môi trường dev dùng <b>MailHog</b> (xem email trong trình duyệt, không gửi thật)."],
 ["register → thấy email trong MailHog; cron chạy đúng lịch (log/observe); email là template HTML (Thymeleaf)."],
 ["Gửi email đồng bộ trong request (user chờ lâu); gửi email BÊN TRONG transaction (rollback rồi nhưng email đã bay)."])

module("3.6", "Redis + RabbitMQ (caching & messaging) — phần lớn TÙY CHỌN",
 "Redis mental model · Cache + distributed lock · RabbitMQ · Spring AMQP + DLQ",
 ["<b>Cache</b> một endpoint đọc-nhiều (vd <code>getPostById</code>) bằng Spring Cache + Redis; nhớ invalidate khi bài bị sửa.",
  "Nếu chạy nhiều instance: <b>distributed lock</b> cho cron để không gửi email trùng.",
  "Nâng cao: chuyển gửi email/notification sang <b>RabbitMQ</b> (producer → queue → consumer + DLQ) để tách tải."],
 ["Lần gọi thứ 2 của endpoint được cache (đo bằng log/độ trễ); message đẩy vào queue được consumer xử lý."],
 ["Cache dữ liệu hay đổi mà không invalidate (trả data cũ); coi RabbitMQ như database; quên DLQ → mất message lỗi."])

module("3.7", "Testing, Containerize & Production Hygiene",
 "Test pyramid (unit/slice/integration + Testcontainers) · Dockerize app · Actuator/observability",
 ["Viết <b>test</b>: unit (service, Mockito) + slice (@WebMvcTest controller) + 1 integration (Testcontainers Postgres thật).",
  "<b>Dockerize</b> app bằng Dockerfile multi-stage; <code>docker-compose</code> chạy cả app + DB.",
  "Thêm <b>Actuator</b> + structured logging (MDC) + vài metric Micrometer.",
  "<b>Deploy LIVE</b> lên Fly.io/Render (free tier) — đây là điểm cộng lớn trên CV."],
 ["<code>mvn test</code> xanh, coverage ≥ 70% tầng service; app chạy trong Docker; có LINK demo live click được."],
 ["Chỉ test happy path; deploy fail vì secret hardcode; log ra stdout không cấu trúc ở production."])

module("3.8", "UML & Project Analysis — LÀM SỚM (song song 3.2)",
 "Requirement analysis · Use case diagram · Class + Sequence diagram",
 ["Trước khi code nhiều: viết <b>spec ngắn</b> (ai dùng, làm được gì) + vẽ <b>use case</b>, <b>class diagram</b>, và 1 <b>sequence diagram</b> (vd luồng login).",
  "Vẽ bằng <b>Mermaid</b> (markdown) hoặc PlantUML, rồi nhúng thẳng vào <code>README.md</code> — interviewer rất thích."],
 ["README có ít nhất 1 sơ đồ kiến trúc + 1 sequence diagram; spec nêu rõ phạm vi 'làm được gì / không làm gì'."],
 ["Vẽ cho có rồi không cập nhật khi code đổi; bỏ qua bước này rồi code 80% mới phát hiện hiểu sai yêu cầu."])

module("3.9", "AI Integration — Spring AI · RAG · pgvector · Tool Calling",
 "ChatClient · Embeddings + pgvector · RAG (QuestionAnswerAdvisor) · Tool calling",
 ["Thêm <b>một tính năng AI</b> vào đồ án — chọn theo domain của bạn:",
  "• <b>Tóm tắt</b> nội dung bài bằng AI (ChatClient + structured output).",
  "• <b>Tìm bài liên quan theo NGHĨA</b> (embeddings + pgvector — chính Postgres bạn đã dựng).",
  "• <b>Chat hỏi đáp trên nội dung của bạn</b> (RAG — 'mở sách', chống bịa).",
  "• <b>Trợ lý tra cứu</b> gọi được dữ liệu thật (tool calling, vd 'bài này có bao nhiêu like').",
  "Luyện không tốn tiền bằng <b>Ollama</b> (model chạy local); key AI đọc từ biến môi trường."],
 ["1 endpoint AI hoạt động end-to-end; có timeout + fallback khi AI lỗi; không hardcode API key; output được validate trước khi dùng."],
 ["Tin mù output AI rồi lưu/hiển thị; không giới hạn chi phí (user spam → cháy hóa đơn); để tính năng AI làm sập cả app khi provider down."])

# ============================== PHẦN 3 — SAU PHASE 3 ==============================
H1("Phần 3 — Sau Phase 3: đồ án của bạn có gì & viết vào CV thế nào")
P("Hoàn thành đúng cách, đồ án trục chính của bạn sẽ là một backend 'hình dáng production': REST API có versioning, xác thực JWT, PostgreSQL + JPA, email async + cron, cache, test nhiều tầng, Docker, deploy live, và một tính năng AI. Đây là các gạch đầu dòng bạn có thể đưa thẳng vào CV (sửa số liệu cho khớp):")
bullets([
 "Xây REST API (Spring Boot 3, Java 21) cho [domain] với xác thực <b>JWT</b> + phân quyền theo vai trò, mật khẩu băm BCrypt.",
 "Thiết kế CSDL <b>PostgreSQL</b> + Spring Data JPA; xử lý <b>N+1</b>, phân trang, migration bằng Flyway.",
 "Tích hợp <b>email bất đồng bộ</b> + cron job; <b>cache</b> bằng Redis cho endpoint đọc nhiều.",
 "Viết test <b>unit/slice/integration</b> (JUnit5, Mockito, Testcontainers), coverage ~70%.",
 "<b>Dockerize</b> (multi-stage) + <b>deploy live</b> trên Fly.io/Render; theo dõi bằng Actuator + Micrometer.",
 "Tích hợp <b>tính năng AI</b> (Spring AI: RAG/semantic search/tool calling) — kèm kiểm soát chi phí & fallback.",
])
P("<i>Mẹo phỏng vấn: chuẩn bị kể được 'vì sao' cho 2–3 quyết định thiết kế (vì sao DTO, vì sao @Transactional ở Service, vì sao cache cái này mà không cache cái kia). Đó là thứ phân biệt bạn với người chỉ làm theo tutorial.</i>", "small")

# ============================== PHẦN 4 — LỊCH SONG SONG ==============================
H1("Phần 4 — Gợi ý lịch học song song (Track xây + Track nền)")
P("DSA (Phase 2) và Spring Boot là 2 nhánh độc lập — học song song được. <b>Cổng tối thiểu</b> phải xong TRƯỚC khi vào Spring: Phase 0 + Phase 1.1 (OOP) + Java Core Essentials (Exception/Lambda/Stream) + Phase 3.0 (SQL). Sau đó chạy 2 track:")
table(
 ["Tuần (sau khi qua cổng)", "Track XÂY (deep work — đồ án)", "Track NỀN (mỗi ngày 30–45')"],
 [
  ["1–2", "3.8 vẽ sơ đồ + 3.1 Docker/Postgres + 3.2 CRUD đầu tiên", "Phase 2: Two Pointers, Sliding Window"],
  ["3–4", "3.3 JPA: quan hệ, phân trang, Flyway, @Transactional", "Phase 2: Binary Search, Tree BFS/DFS"],
  ["5–6", "3.4 Security + JWT; phân quyền", "Phase 2: HashMap patterns, Top-K"],
  ["7", "3.5 Email + @Scheduled", "Phase 2: Backtracking (Subsets trước)"],
  ["8–9", "3.7 Test + Dockerize + deploy LIVE", "Phase 2: Graph (Flood Fill → Islands), DP 1D"],
  ["10", "3.9 thêm 1 tính năng AI", "Phase 2: DP 2D (Unique Paths trước)"],
  ["11–12", "3.6 (tùy chọn) cache/queue; đánh bóng README + demo video", "Ôn tập + mock phỏng vấn (Phase 5)"],
 ],
 [32*mm, 86*mm, 52*mm])
P("<i>Track nền là 'tập gym' — đều đặn, ngắn. Track xây là 'deep work' — làm theo buổi dài. Đừng trộn 2 loại trong cùng một buổi.</i>", "small")
SP(6)
P('<i>Tài liệu sinh tự động kèm khóa học. Mọi nội dung kỹ thuật bám theo các bài Phase 3 trong khóa.</i>', "small")

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm,
                        topMargin=18*mm, bottomMargin=16*mm,
                        title="Phase 3 - Huong dan ap dung vao do an", author="Java + DSA Bootcamp")
def footer(canvas, d):
    canvas.saveState(); canvas.setFont("Arial", 8); canvas.setFillColor(GRAY)
    canvas.drawCentredString(A4[0]/2, 9*mm, f"Phase 3 → Đồ án thực tế   ·   trang {d.page}")
    canvas.restoreState()
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("WROTE", OUT)
