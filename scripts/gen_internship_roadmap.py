# -*- coding: utf-8 -*-
"""Sổ tay định hướng internship (công ty phần cứng) — 15 phần roadmap.
Arial (tiếng Việt) + Consolas. Không emoji. Checkbox = ô vuông in được."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                HRFlowable, ListFlowable, ListItem)

OUT = r"C:\Course Java\So-Tay-Dinh-Huong-Internship.pdf"
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Arial", os.path.join(F, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-B", os.path.join(F, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Arial-I", os.path.join(F, "ariali.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-B", italic="Arial-I", boldItalic="Arial-B")

INDIGO=colors.HexColor("#4f46e5"); INK=colors.HexColor("#1e293b"); GREEN=colors.HexColor("#16a34a")
RED=colors.HexColor("#dc2626"); AMBER=colors.HexColor("#b45309"); GRAY=colors.HexColor("#64748b")
LIGHT=colors.HexColor("#f1f5f9"); TEAL=colors.HexColor("#0e7490")

def style(name, **kw):
    base=dict(fontName="Arial", fontSize=10.3, leading=14.5, textColor=INK, spaceAfter=5); base.update(kw)
    return ParagraphStyle(name, **base)
S={
 "title": style("title", fontName="Arial-B", fontSize=22, leading=26, textColor=INDIGO, spaceAfter=4),
 "sub": style("sub", fontName="Arial-I", fontSize=11.5, leading=15, textColor=GRAY, spaceAfter=12),
 "h1": style("h1", fontName="Arial-B", fontSize=14, leading=18, textColor=colors.white, spaceBefore=13, spaceAfter=8, backColor=INDIGO, borderPadding=(5,7,5,7)),
 "h2": style("h2", fontName="Arial-B", fontSize=11.5, leading=15, textColor=INDIGO, spaceBefore=7, spaceAfter=3),
 "body": style("body"),
 "small": style("small", fontSize=8.8, leading=12, textColor=GRAY),
 "li": style("li", spaceAfter=2.5),
 "cell": style("cell", fontSize=8.7, leading=11.5, spaceAfter=0),
 "cellb": style("cellb", fontName="Arial-B", fontSize=8.7, leading=11.5, spaceAfter=0, textColor=colors.white),
 "task": style("task", fontSize=10, leading=13.5, spaceAfter=0),
 "callL": style("callL", fontName="Arial-B", fontSize=10, leading=13.5),
}
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
story=[]
def P(t,s="body"): story.append(Paragraph(t,S[s]))
def SP(h=6): story.append(Spacer(1,h))
def H1(t): story.append(Paragraph(esc(t),S["h1"]))
def H2(t): story.append(Paragraph(esc(t),S["h2"]))
def bullets(items): story.append(ListFlowable([ListItem(Paragraph(x,S["li"]),leftIndent=12,value="•") for x in items],bulletType="bullet",start="•",leftIndent=14))
def rule(): story.append(HRFlowable(width="100%",thickness=0.6,color=colors.HexColor("#cbd5e1"),spaceBefore=3,spaceAfter=9))
def table(header,rows,widths):
    data=[[Paragraph(esc(h),S["cellb"]) for h in header]]
    for r in rows: data.append([Paragraph(c,S["cell"]) for c in r])
    t=Table(data,colWidths=widths,repeatRows=1); t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),INDIGO),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("GRID",(0,0),(-1,-1),0.5,colors.HexColor("#cbd5e1")),
        ("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#f8fafc")])]))
    story.append(t); SP(8)
def callout(label,color,lines):
    inner=[Paragraph(f'<font color="#{color.hexval()[2:]}"><b>{esc(label)}</b></font>',S["callL"])]
    for ln in lines: inner.append(Paragraph(ln,S["body"]))
    t=Table([[inner]],colWidths=[170*mm]); t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LIGHT),("LINEBEFORE",(0,0),(0,-1),3,color),
        ("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),
        ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
    story.append(t); SP(7)
def checkbox():
    b=Table([[""]],colWidths=[4*mm],rowHeights=[4*mm]); b.setStyle(TableStyle([("BOX",(0,0),(-1,-1),0.9,INK)])); return b
def checklist(items):
    rows=[[checkbox(),Paragraph(esc(it),S["task"])] for it in items]
    t=Table(rows,colWidths=[8*mm,162*mm]); t.setStyle(TableStyle([
        ("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),2),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LINEBELOW",(0,0),(-1,-2),0.4,colors.HexColor("#e2e8f0"))]))
    story.append(t); SP(7)

# ===== COVER =====
P("Sổ Tay Định Hướng Internship", "title")
P("Backend Java (đường dài) + Python automation + domain phần cứng + Claude Code kỷ luật — KHÔNG đánh mất Java & LeetCode. Roadmap Phase 0–6 cho công ty PC/laptop.", "sub")
P('<i>Tài liệu đồng hành khóa Java + DSA Bootcamp · cá nhân hoá cho internship phần cứng</i>', "small")
rule()

# 1
H1("1. Tóm tắt định hướng mới")
P("<b>Đích dài hạn KHÔNG đổi:</b> Backend Java/Spring → công ty phần mềm lớn. <b>Đòn bẩy mới vì internship:</b> Python automation + hiểu domain phần cứng + quy trình Claude Code kỷ luật.")
callout("XƯƠNG SỐNG", INDIGO, ["Java/Spring = career track chính. Python = công cụ. Hardware = domain. Claude Code = cách làm việc. LeetCode = vé vào công ty lớn. Không cái nào thay được Java."])
P("Câu của giám đốc ('phần cứng là toàn bộ', 'Java ít dùng, Python nhiều hơn') đúng <i>trong bối cảnh công ty nhỏ làm tool nội bộ</i> — nghe để thích nghi, không nghe để đổi nghề.", "small")

# 2
H1("2. Roadmap mới Phase 0–6")
table(["Phase","Giữ","Thêm"],
 [["0 — Foundation Reset","Java syntax, collections, LeetCode easy","CLI hằng ngày, Git rollback an toàn, Python basics (file/CSV/JSON/requests), logging"],
  ["1 — Java Core + Maintainable","OOP, Generics, Exception, Stream, Concurrency, DS, Sorting","Đọc code AI/người khác, refactor có test, domain model phần cứng"],
  ["2 — LeetCode Patterns","17 pattern, mental model, Socratic","Lịch 3 buổi/tuần, gắn pattern với domain công ty, sổ tay pattern"],
  ["3 — Backend Java + Python Bridge","Spring Boot, Postgres, Docker, JPA, JWT, Test, Swagger","Schema nghiệp vụ công ty, API repair/inventory, Python bridge scripts"],
  ["4 — Capstone","(cũ optional)","Capstone A Repair&Inventory (Java) + Capstone B Automation Toolkit (Python)"],
  ["5 — Team + Claude Code","Git, Agile, review, mock interview","Quy trình hoá vibe code (9 bước), CLAUDE.md, review AI code, báo cáo tuần"],
  ["6 — Internship (MỚI)","—","Domain discovery → codebase setup → small tasks → mini feature (12 tuần)"]],
 [38*mm,58*mm,74*mm])

# 3
H1("3. Bảng so sánh roadmap cũ vs mới")
table(["Khía cạnh","Cũ","Mới"],
 [["Đích","Backend Java junior","+ internal-tools/automation"],
  ["Ngôn ngữ","Java only","Java (chính) + Python (công cụ)"],
  ["Domain","blog/shop chung chung","PC/laptop repair/inventory/warranty"],
  ["Capstone","Devlog/ShopCore/TaskFlow","+ RepairCore (Java) + RepairCLI (Python)"],
  ["AI","Socratic mentor","+ Claude Code disciplined workflow"],
  ["Phase","0–5","0–6 (thêm Phase 6 internship)"]],
 [34*mm,58*mm,78*mm])

# 4
H1("4. Lịch 12 tuần đầu")
P("Mỗi 'buổi' = 60–90 phút. Trung bình 2–3 giờ/ngày. <b>Sàn cứng/tuần: ≥2 Backend Java, 3 LeetCode, ≥1 Python/domain.</b>", "small")
table(["Tuần","Java","Py","HW","LC","CC","Việc công ty","Output cuối tuần"],
 [["1","2","1","2","3","1","Domain Discovery","domain-notes.md + flow diagram"],
  ["2","2","1","2","3","1","Domain Discovery","glossary + pain points + dữ liệu quan trọng"],
  ["3","2","1","1","3","2","Codebase setup","local-setup-notes + chạy project"],
  ["4","2","1","1","3","2","Codebase setup","CLAUDE.md + architecture-map + risk list"],
  ["5","2","1","1","3","1","Small task #1","PR nhỏ (validation/bug) + note"],
  ["6","2","1","1","3","1","Small task #2","PR (logging/export CSV) + test"],
  ["7","2","1","1","3","1","Small task #3","PR (filter/search/field)"],
  ["8","2","1","1","3","1","Small task #4","script import + demo nhỏ"],
  ["9","2","1","1","3","2","Mini feature","scope + ERD"],
  ["10","3","1","0","3","1","Mini feature","API/feature chạy được"],
  ["11","3","1","0","3","1","Mini feature","test + README"],
  ["12","2","1","1","3","1","Demo","demo + lesson-learned"]],
 [12*mm,11*mm,9*mm,9*mm,9*mm,9*mm,40*mm,75*mm])
P("Tuần bận: cắt Python/HW xuống 0–1, cắt capstone, NHƯNG giữ 2 Java + 3 LeetCode ngắn (30').", "small")

# 5
H1("5. Tỉ lệ thời gian học đề xuất")
table(["Mảng","Tỉ lệ","Ghi chú"],
 [["Backend Java","35%","Trục chính, không bao giờ <30%"],
  ["LeetCode","20%","Bất khả xâm phạm — vé công ty lớn"],
  ["Hardware/Domain","18%","Nặng tuần 1–4, giảm dần"],
  ["Python thực dụng","15%","Công cụ, không thành main track"],
  ["Claude Code workflow","12%","Tăng khi sửa codebase công ty"]],
 [42*mm,22*mm,106*mm])
callout("KIỂM TRA", AMBER, ["Nếu tháng nào Java + LeetCode < 50% tổng thời gian → bạn đang lệch hướng."])

# 6
H1("6. Checklist câu hỏi hỏi giám đốc")
H2("A. Phần cứng")
checklist(["Công ty tập trung mảng nào nhất (bán/lắp/sửa/bảo hành — hay tất cả)?",
 "Em cần hiểu phần cứng tới mức nào để hỗ trợ phần mềm?",
 "Em có cần tự chẩn đoán/sửa máy không, hay chỉ làm phần mềm quản lý?",
 "Có thiết bị nào phần mềm phải GIAO TIẾP TRỰC TIẾP không (máy in tem, đầu đọc serial)?"])
H2("B. Phần mềm")
checklist(["Stack hiện tại là gì (ngôn ngữ/framework/DB)?",
 "Codebase nằm ở đâu (Git/local/Drive)?","Có database thật không hay đang dùng Excel?",
 "Có tài liệu/README/test không?","Pain point lớn nhất hiện tại là gì?"])
H2("C. Vai trò của em")
checklist(["1 tháng đầu anh muốn em làm được gì?","Em nên học phần nào trước?",
 "Task nhỏ đầu tiên là gì?","Em được đọc/sửa repo nào — và cái nào KHÔNG được đụng?",
 "Quy trình review code trước khi merge/deploy?"])
H2("D. Claude Code")
checklist(["Anh dùng Claude Code theo quy trình nào (Plan Mode hay để tự chạy)?",
 "Repo đã có CLAUDE.md chưa?","Có dùng git branch/commit hay sửa thẳng?",
 "Có test trước khi deploy không?","Phần nào TUYỆT ĐỐI không được để AI tự sửa?"])

# 7
H1("7. Capstone mới")
H2("Capstone A — RepairCore: Repair & Inventory Backend (Java, trục chính)")
bullets(["Stack: Java 21 + Spring Boot 3 + PostgreSQL + Docker + Flyway + JWT + JPA + Testcontainers.",
 "Domain: customers, products/components, inventory, serial, repair_tickets, diagnostic_logs, warranty, quotes, orders, audit_log.",
 "Ticket lifecycle (state machine): received→diagnosing→waiting_parts→repairing→testing→completed→returned (+cancelled).",
 "Roles: ADMIN/TECHNICIAN/SALES/VIEWER + audit log. Dashboard API: máy đang sửa / ticket quá hạn / tồn kho thấp / doanh thu / lỗi phổ biến.",
 "Deliverables: README, ERD, Swagger, docker-compose, seed, tests, Postman/curl, demo script."])
H2("Capstone B — RepairCLI: Automation Toolkit (Python, công cụ)")
bullets(["Stack: Python + Typer + requests + pandas/openpyxl + logging + dotenv + pytest.",
 "GỌI API của Capstone A (không có DB riêng) → chứng minh cầu nối Java↔Python.",
 "Commands: import-inventory (Excel→API), validate-serials, export-report, generate-quote.",
 "Điểm CV: 'Backend Java + Python automation' — đúng công cụ cho đúng việc."])

# 8
H1("8. Python track cần học (và DỪNG ở đâu)")
bullets(["Cú pháp, list/dict/set, file I/O, csv/json, pathlib.","requests (GET/POST), logging, python-dotenv (.env).",
 "argparse/typer (CLI), pandas/openpyxl (Excel), pytest cơ bản.","(tuỳ) FastAPI — CHỈ khi công ty thực sự cần API Python."])
callout("DỪNG Ở ĐÂY", RED, ["Không Django, async sâu, ML, data science. Python là dao, không phải nhà."])

# 9
H1("9. Hardware/domain track cần học (mức software dev)")
table(["Học (đủ để làm phần mềm)","KHÔNG cần (chưa)"],
 [["Linh kiện: CPU/RAM/SSD/mainboard/PSU/GPU/màn hình/pin/cổng","Thiết kế mạch, hàn, PCB"],
  ["Compatibility: socket, RAM type, SSD form factor, PSU wattage, GPU size","Datasheet điện áp chi tiết"],
  ["BIOS/UEFI, driver, cài Win/Linux, Device Manager","Firmware, bootloader nội bộ"],
  ["Quy trình test RAM/SSD/nhiệt/pin (hiểu quy trình)","Sửa mainboard chuyên sâu"],
  ["Nghiệp vụ: serial, SKU, warranty, ticket, diagnostic, inventory, quote, order","Embedded UART/I2C/SPI (trừ khi có thiết bị)"]],
 [88*mm,82*mm])

# 10
H1("10. LeetCode plan giữ lại")
bullets(["Lịch: 3 buổi/tuần × 60–90'. 2 buổi bài mới + 1 buổi review (spaced repetition).",
 "Patterns ưu tiên: Array/HashMap → Two Pointers → Sliding Window → Stack/Queue → Binary Search → Tree BFS/DFS → Heap → Graph cơ bản → DP cơ bản.",
 "AI = Socratic interviewer (gợi ý/edge case/review approach/mock) — KHÔNG giải hộ.",
 "Gắn domain: HashMap→tra serial · Sliding Window→rolling log · Queue→hàng đợi ticket · Heap→top lỗi/linh kiện · Binary Search→tìm theo range · Graph→dependency · Tree→category.",
 "Output: sổ tay pattern + danh sách must-do junior (~50–70 bài)."])

# 11
H1("11. Claude Code workflow cho internship (9 bước)")
bullets(["1) Requirement → 2) Domain question → 3) Plan Mode → 4) Human review plan → 5) Small implementation → 6) Test → 7) Review diff → 8) Commit → 9) Document."])
callout("LUẬT ĐỎ", RED, ["Không cho AI chạy lệnh phá huỷ (drop table, rm -rf, deploy) khi chưa hiểu.",
 "Repo thật → luôn branch, không sửa thẳng main.",
 "Vùng cấm (thanh toán, dữ liệu khách) → người làm, không để AI tự quyết. Chốt chặn quan trọng nhất = review PLAN và review DIFF."])

# 12
H1("12. Những thứ CHƯA cần học sâu (và khi nào thì cần)")
table(["Chủ đề","Khi nào mới cần"],
 [["Thiết kế mạch / hàn / sửa mainboard / PCB","Khi được giao làm kỹ thuật sửa chữa (≠ vai phần mềm)"],
  ["Firmware","Khi phần mềm phải flash/cập nhật firmware thiết bị"],
  ["UART/I2C/SPI (embedded)","Khi phần mềm phải giao tiếp board (giám đốc xác nhận)"],
  ["MQTT/IoT","Khi có thiết bị gửi telemetry về server"],
  ["AI/ML hardware optimization","Không liên quan vai trò — bỏ qua"],
  ["System design cao cấp","Khi phỏng vấn mid/senior (sau 1–2 năm)"],
  ["Microservices phức tạp","Chỉ sau khi có monolith vững + lý do scale thật"]],
 [70*mm,100*mm])
P("Nguyên tắc: KHÔNG học đầu cơ. Mục cần 'bằng chứng công ty dùng' thì đợi bằng chứng.", "small")

# 13
H1("13. CV positioning (không bị đóng khung 'hardware intern')")
H2("3 title")
bullets(["Backend Java Intern with Python Automation","Software Intern — PC/Laptop Repair & Inventory Management System","Backend / Internal Tools Developer Intern (Java + Python)"])
H2("5 bullet achievements mẫu (sửa số liệu cho khớp)")
bullets(["Xây module phiếu sửa chữa (lifecycle 7 trạng thái) bằng Spring Boot 3 + PostgreSQL + JPA, phân quyền JWT.",
 "Python automation import ~N nghìn dòng tồn kho từ Excel → sync qua REST API.",
 "Thiết kế schema (customers/inventory/serial/warranty) + Flyway; thêm API tra cứu serial & bảo hành.",
 "Quy trình phát triển có kiểm soát với Claude Code (Plan Mode → review diff → test → commit); viết CLAUDE.md.",
 "Test JUnit/Mockito/Testcontainers + tài liệu Swagger cho endpoint mới."])
H2("Giải thích khi phỏng vấn + chứng minh không lệch")
bullets(["Kể: 'làm phần mềm nội bộ — backend Java quản lý sửa chữa/tồn kho + tool Python', nhấn backend + domain modeling + production codebase, KHÔNG nhấn 'sửa máy'.",
 "Giữ LeetCode đều + có 1 project backend không-hardware (vd blog API) + Capstone A full stack chuẩn phỏng vấn."])

# 14
H1("14. Rủi ro nếu đi sai hướng")
table(["Rủi ro","Dấu hiệu","Chặn bằng"],
 [["Thành 'người sửa máy'","Tuần nào cũng chỉ làm hardware","Sàn 2 Java + 3 LeetCode/tuần"],
  ["Python nuốt Java","Code Python cả tuần, Spring bỏ xó","Capstone A (Java) bắt buộc"],
  ["Mất LeetCode","'Bận quá, skip' thành thói quen","3 buổi ngắn 30' vẫn tính"],
  ["Vibe code mù","Merge code AI không đọc/test","Quy trình 9 bước, review diff"],
  ["CV đóng khung hardware","Title/bullet toàn 'repair'","Positioning mục 13"]],
 [40*mm,62*mm,68*mm])

# 15
H1("15. Checklist tự đánh giá")
H2("Sau 1 tháng")
checklist(["Hiểu công ty bán/sửa gì + vẽ được flow nhận→sửa→trả máy.",
 "Chạy được codebase công ty local (hoặc xác nhận chưa có).","Có CLAUDE.md + company-domain-notes.md.",
 "Giữ 3 buổi LeetCode/tuần + tiến độ Spring (REST + JPA cơ bản).","Viết được 1 Python script đọc CSV/JSON chạy thật."])
H2("Sau 3 tháng")
checklist(["Merge 2–4 PR nhỏ vào phần mềm công ty (có test + review).",
 "Capstone A có CRUD + auth; Capstone B import qua API.",
 "LeetCode: xong Array/HashMap/Two Pointers/Sliding Window/Stack-Queue/Binary Search.",
 "Áp dụng quy trình 9 bước Claude Code thành thói quen."])
H2("Sau 6 tháng")
checklist(["Capstone A production-shape: Docker + test + Swagger + deploy; có README/demo.",
 "Hoàn thành 1 mini feature thật trong phần mềm công ty (demo cho sếp).",
 "LeetCode chạm Tree/Heap/Graph/DP cơ bản; sổ tay ~50–70 bài.",
 "CV theo positioning mục 13; bắt đầu apply junior backend công ty lớn hơn.",
 "Tự trả lời: internship này đưa mình GẦN HƠN hay XA HƠN backend?"])

rule()
P("Tóm tắt 1 câu: Giữ Java + LeetCode làm trục; thêm Python/hardware/Claude Code làm đòn bẩy internship; mỗi phase có output cụ thể; không học đầu cơ; không vibe code mù.", "h2")

doc=SimpleDocTemplate(OUT,pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,topMargin=16*mm,bottomMargin=15*mm,
                      title="So tay dinh huong internship", author="Java + DSA Bootcamp")
def footer(c,d):
    c.saveState(); c.setFont("Arial",8); c.setFillColor(GRAY)
    c.drawCentredString(A4[0]/2,9*mm,f"Sổ tay định hướng internship · trang {d.page}"); c.restoreState()
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print("WROTE",OUT)
