# -*- coding: utf-8 -*-
"""Sổ tay học hiệu quả cho Java + DSA Bootcamp + checklist in được.
Arial (tiếng Việt) + Consolas. Không emoji. Checkbox = ô vuông viền (in ra tick tay)."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                HRFlowable, ListFlowable, ListItem)

OUT=r"C:\Course Java\So-Tay-Hoc-Hieu-Qua.pdf"
F=r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Arial",os.path.join(F,"arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-B",os.path.join(F,"arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Arial-I",os.path.join(F,"ariali.ttf")))
pdfmetrics.registerFont(TTFont("Mono",os.path.join(F,"consola.ttf")))
pdfmetrics.registerFontFamily("Arial",normal="Arial",bold="Arial-B",italic="Arial-I",boldItalic="Arial-B")

INDIGO=colors.HexColor("#4f46e5"); INK=colors.HexColor("#1e293b"); GREEN=colors.HexColor("#16a34a")
RED=colors.HexColor("#dc2626"); AMBER=colors.HexColor("#b45309"); GRAY=colors.HexColor("#64748b")
LIGHT=colors.HexColor("#f1f5f9"); TEAL=colors.HexColor("#0e7490")

def style(name,**kw):
    base=dict(fontName="Arial",fontSize=10.5,leading=15,textColor=INK,spaceAfter=6); base.update(kw)
    return ParagraphStyle(name,**base)
S={
 "title": style("title",fontName="Arial-B",fontSize=23,leading=27,textColor=INDIGO,spaceAfter=4),
 "subtitle": style("subtitle",fontName="Arial-I",fontSize=12,leading=16,textColor=GRAY,spaceAfter=12),
 "h1": style("h1",fontName="Arial-B",fontSize=15,leading=19,textColor=colors.white,spaceBefore=14,spaceAfter=9,backColor=INDIGO,borderPadding=(6,8,6,8)),
 "h2": style("h2",fontName="Arial-B",fontSize=12,leading=16,textColor=INDIGO,spaceBefore=8,spaceAfter=3),
 "body": style("body"),
 "small": style("small",fontSize=9,leading=12.5,textColor=GRAY),
 "li": style("li",spaceAfter=3),
 "cell": style("cell",fontSize=9.7,leading=13,spaceAfter=0),
 "cellb": style("cellb",fontName="Arial-B",fontSize=9.7,leading=13,spaceAfter=0,textColor=colors.white),
 "big": style("big",fontName="Arial-B",fontSize=12.5,leading=17,textColor=RED),
 "task": style("task",fontSize=10.5,leading=14,spaceAfter=0),
}
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
story=[]
def P(t,s="body"): story.append(Paragraph(t,S[s]))
def SP(h=6): story.append(Spacer(1,h))
def H1(t): story.append(Paragraph(esc(t),S["h1"]))
def H2(t): story.append(Paragraph(esc(t),S["h2"]))
def bullets(items): story.append(ListFlowable([ListItem(Paragraph(x,S["li"]),leftIndent=12,value="•") for x in items],bulletType="bullet",start="•",leftIndent=14))
def steps(items): story.append(ListFlowable([ListItem(Paragraph(x,S["li"]),leftIndent=12) for x in items],bulletType="1",leftIndent=16,bulletFormat="%s.",start=1))
def rule(): story.append(HRFlowable(width="100%",thickness=0.6,color=colors.HexColor("#cbd5e1"),spaceBefore=4,spaceAfter=10))
def callout(label,color,lines):
    inner=[Paragraph(f'<font color="#{color.hexval()[2:]}"><b>{esc(label)}</b></font>',S["h2"])]
    for ln in lines: inner.append(Paragraph(ln,S["body"]))
    t=Table([[inner]],colWidths=[170*mm]); t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LIGHT),("LINEBEFORE",(0,0),(0,-1),3,color),
        ("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),
        ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story.append(t); SP(8)
def table(header,rows,widths):
    data=[[Paragraph(esc(h),S["cellb"]) for h in header]]
    for r in rows: data.append([Paragraph(c,S["cell"]) for c in r])
    t=Table(data,colWidths=widths,repeatRows=1); t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),INDIGO),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("GRID",(0,0),(-1,-1),0.5,colors.HexColor("#cbd5e1")),
        ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#f8fafc")])]))
    story.append(t); SP(10)
def checkbox():
    b=Table([[""]],colWidths=[4.2*mm],rowHeights=[4.2*mm])
    b.setStyle(TableStyle([("BOX",(0,0),(-1,-1),0.9,INK)]))
    return b
def checklist(items, accent=GREEN):
    rows=[[checkbox(), Paragraph(esc(it),S["task"])] for it in items]
    t=Table(rows,colWidths=[8*mm,162*mm]); t.setStyle(TableStyle([
        ("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),2),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LINEBELOW",(0,0),(-1,-2),0.4,colors.HexColor("#e2e8f0"))]))
    story.append(t); SP(8)

# ================= COVER =================
P("Sổ Tay Học Hiệu Quả", "title")
P("Cách dùng web khóa học &amp; cách học sao cho biến từ 'paste AI' thành 'kỹ sư hiểu việc'. Kèm checklist in ra tick mỗi ngày.", "subtitle")
P('<i>Java + DSA Bootcamp · dành cho người mới, đích đến Backend Java junior</i>', "small")
rule()

# ================= QUY TẮC 1 =================
H1("Quy tắc số 1 — quyết định mọi thứ")
P("KHÔNG paste AI · KHÔNG nhìn lời giải trước khi tự vật lộn.", "big")
P("Cả khóa được xây để chống đúng một thứ: học mà không hiểu. Đọc-hiểu cho cảm giác 'dễ mà', nhưng <b>tự gõ lại từ trí nhớ</b> mới tạo ra kỹ năng. Đây không phải lời khuyên đạo đức — đây là cách não học (active recall). Paste = mọi tính năng của web trở nên vô nghĩa và bạn quay lại vạch xuất phát.")

# ================= CÔNG CỤ =================
H1("Dùng công cụ trên web thế nào")
table(["Nút / Tính năng","Dùng khi","Cách dùng đúng"],
 [["Banner đỏ 5 quy tắc (Phase 0)","Mọi lúc","Đọc lại mỗi khi tay ngứa muốn paste"],
  ["Mock Interview Mode","Luyện 1 bài như thi thật","Bật timer -> lời giải bị KHÓA -> buộc tự nghĩ"],
  ["Feynman Modal (lúc Mark Complete)","Cuối mỗi bài","Giải thích bài bằng lời của bạn (80+ ký tự). Viết không nổi = chưa hiểu"],
  ["Syntax Vault","Hằng ngày 5-10'","Gõ lại snippet để nhớ cú pháp (đo WPM/accuracy)"],
  ["Consistency Heatmap","Theo dõi đều đặn","Mục tiêu: tô xanh MỖI ngày, dù chỉ 20 phút"],
  ["Bug Journal","Mỗi lần dính bug","Ghi: lỗi gì -> nguyên nhân -> cách sửa. 'StackOverflow của riêng bạn'"],
  ["Socratic Prompts (trong bài)","Khi bí, muốn nhờ AI","Copy prompt -> dán vào AI -> AI HỎI NGƯỢC bạn, không cho đáp án"]],
 [44*mm,40*mm,86*mm])

# ================= QUY TRÌNH MỖI BÀI =================
H1("Quy trình học MỖI bài (lặp đi lặp lại)")
H2("Bài lý thuyết (theory)")
steps(["Đọc theo thứ tự: Mental Model -> Under the Hood -> The Why -> Junior Pitfalls.",
 "ĐÓNG bài lại. Tự giải thích cho 'đứa em tưởng tượng': bài này nói gì, VÌ SAO lại thế.",
 "Giải thích trôi chảy -> Mark Complete (viết Feynman note). Tịt ở 'vì sao' -> đọc lại bước 1."])
H2("Bài tập / LeetCode (practice / problems)")
steps(["Thử 20 phút KHÔNG nhìn solution. Bí cũng cứ ngồi với nó.",
 "Vẫn bí -> mở Socratic Prompt, để AI hỏi ngược (không xin đáp án).",
 "Giải được HOẶC hết 20' -> mở lời giải, đọc hiểu -> ĐÓNG lại -> TỰ GÕ LẠI từ trí nhớ (3 lần, lần cuối gần như không nhìn).",
 "Dính bug -> ghi vào Bug Journal."])
callout("CÂU THẦN CHÚ", TEAL, ["Đọc hiểu ≠ làm được. Chỉ tự gõ lại từ trí nhớ mới tính."])

# ================= AI =================
H1("Dùng AI cho ĐÚNG (quan trọng nhất với bạn)")
P("AI không phải máy trả lời, mà là <b>gia sư Socratic</b>. Hai cách dùng đúng:")
bullets(["<b>Khi bí:</b> dán prompt mở đầu bằng <i>'TUYỆT ĐỐI KHÔNG viết code/đáp án. Hãy hỏi ngược tôi từng câu để tôi tự tìm ra.'</i>",
 "<b>Sau khi TỰ viết xong:</b> <i>'Đây là code của tôi [dán]. Đừng viết lại. Hãy chỉ điểm yếu và hỏi tôi vì sao về 3 quyết định.'</i>"])
callout("TUYỆT ĐỐI TRÁNH", RED, ["'Viết hộ tôi hàm X' — đó là bước lùi, đúng cái thói bạn đang cố bỏ."])

# ================= LỘ TRÌNH =================
H1("Lộ trình & nhịp học")
P("<b>Cổng bắt buộc</b> trước khi rẽ nhánh: Phase 0 (toàn bộ) -> Phase 1.1 OOP -> Java Core Essentials (Exception/Lambda/Stream) -> Phase 3.0 SQL.")
P("<b>Sau cổng, chạy 2 track song song:</b>")
bullets(["<b>Track NỀN</b> (mỗi ngày 30-45', như tập gym): Phase 2 DSA — luyện phỏng vấn coding.",
 "<b>Track XÂY</b> (deep work theo buổi): Phase 3 Spring -> build đồ án Devlog theo Build Playbook -> Phase 4 capstone (stretch).",
 "<b>Cuối:</b> Phase 5 (mock interview + job search)."])
P("<b>Nhịp:</b> đều đặn quan trọng hơn dồn dập. 1 giờ/ngày × 6 ngày tốt hơn nhiều 7 giờ dồn 1 ngày. Thực tế ~5-9 tháng để sẵn sàng phỏng vấn junior nếu học đều.", "small")

# ================= ĐÚNG/SAI =================
H1("Dấu hiệu học ĐÚNG vs SAI")
table(["Đúng hướng","Báo động"],
 [["Giải thích được bài mà không nhìn note","Mark Complete xong quên ngay hôm sau"],
  ["Gõ lại solution từ trí nhớ","Copy solution rồi bấm next"],
  ["Heatmap xanh đều","Học dồn rồi nghỉ cả tuần"],
  ["Bug Journal dày lên","Bug nào cũng hỏi AI cho đáp án"],
  ["Áp dụng vào đồ án ngay","Chỉ đọc, không bao giờ code"]],
 [85*mm,85*mm])

# ================= SAI LẦM =================
H1("5 sai lầm hay gặp — tránh ngay")
steps(["BỎ QUA Phase 0 vì thấy 'dễ' -> mất nền gõ tay, sau tịt syntax. Đừng skip.",
 "TUTORIAL HELL — đọc/xem mãi mà không tự code. Học 20% -> áp dụng 80%.",
 "CẦU TOÀN — đợi 'đủ giỏi' mới làm đồ án/nộp đơn. Không bao giờ thấy đủ; làm sớm, sửa dần.",
 "LÀM TUẦN TỰ CỨNG NHẮC — đợi cày hết DSA mới đụng Spring. Hai cái học song song được.",
 "SO TỐC ĐỘ với người khác. Đi chậm mà chắc vượt người học vẹt nhanh."])

# ================= CHECKLIST =================
H1("Checklist HẰNG NGÀY (in ra, tick mỗi ngày)")
checklist([
 "Học/làm ít nhất 1 bài (giữ streak Heatmap).",
 "Tự vật lộn 20 phút TRƯỚC khi xem giải / hỏi AI.",
 "Gõ lại ít nhất 1 solution từ trí nhớ.",
 "Viết Feynman note cho bài vừa hoàn thành.",
 "Syntax Vault 5-10 phút.",
 "Ghi Bug Journal nếu dính bug.",
 "KHÔNG paste AI / không xin đáp án lần nào hôm nay.",
])
H1("Checklist HẰNG TUẦN")
checklist([
 "Track Nền: giải xong 5-7 bài DSA (Phase 2).",
 "Track Xây: hoàn thành 1 milestone đồ án (hoặc 1 phần rõ ràng).",
 "Heatmap: tô xanh ít nhất 6/7 ngày.",
 "Ôn lại Bug Journal tuần này — còn nhớ cách sửa không?",
 "Tự kiểm: giải thích trôi chảy 1 khái niệm khó học tuần này.",
 "Commit code đồ án (git log kể chuyện tiến độ).",
])

rule()
P("Tóm tắt 1 câu: Tự vật lộn 20' -> tự gõ lại từ trí nhớ -> giải thích bằng lời (Feynman) -> áp dụng ngay vào đồ án -> đều đặn mỗi ngày.", "h2")
P('<i>Sổ tay đồng hành khóa Java + DSA Bootcamp.</i>', "small")

doc=SimpleDocTemplate(OUT,pagesize=A4,leftMargin=20*mm,rightMargin=20*mm,topMargin=18*mm,bottomMargin=16*mm,
                      title="So tay hoc hieu qua", author="Java + DSA Bootcamp")
def footer(c,d):
    c.saveState(); c.setFont("Arial",8); c.setFillColor(GRAY)
    c.drawCentredString(A4[0]/2,9*mm,f"Sổ tay học hiệu quả · trang {d.page}"); c.restoreState()
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print("WROTE",OUT)
