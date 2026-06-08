# Bộ tiêu chí đánh giá nội dung học Backend Java

> **Cách dùng với Claude Code (VS Code):**
> Mở file bài học (`.md`, `.html`, `.java`...) rồi ra lệnh, ví dụ:
> *"Đọc file bài học đang mở và chấm điểm theo `RUBRIC_DANH_GIA_NOI_DUNG.md`. Với mỗi tiêu chí cho điểm 0–2, trích dẫn câu/đoạn làm bằng chứng, và liệt kê những chỗ cần sửa."*
>
> **Thang điểm mỗi tiêu chí:** 0 = thiếu/sai · 1 = có nhưng chưa đạt · 2 = đạt tốt.
> **Ngưỡng phát hành:** một bài chỉ được "PASS" khi **không có tiêu chí nào ở nhóm A (Chính xác) bị 0 điểm** và **tổng điểm ≥ 80%**.

---

## Bối cảnh người học (Claude Code cần ghi nhớ khi chấm)

- Người học **bắt đầu từ con số 0**, tư duy thuật toán còn yếu, ít code.
- Mục tiêu cuối: **đi làm Backend Java cho tập đoàn lớn**.
- Vì vậy nội dung phải **vừa dễ tiếp cận cho người mới**, **vừa đúng chuẩn doanh nghiệp** (không dạy kiểu "cho chạy được là xong").

---

## Nhóm A — Tính chính xác kỹ thuật (quan trọng nhất, không được 0 điểm)

1. **Thuật ngữ & khái niệm đúng:** Định nghĩa các khái niệm (JVM, JDK, JRE, bean, DI, ORM, transaction...) chính xác, không nhầm lẫn hay nói mơ hồ.
2. **Code chạy được:** Mọi đoạn code biên dịch và chạy đúng như mô tả; không thiếu import, không sai cú pháp, không "code giả".
3. **API & phiên bản còn dùng được:** Không dùng API đã deprecated/removed mà không cảnh báo; nêu rõ phiên bản (Java 17/21 LTS, Spring Boot 3.x...) khi cần.
4. **Giải thích cơ chế đúng:** Khi nói "vì sao" (vì sao `==` khác `.equals()`, vì sao cần `@Transactional`...) thì lý do phải đúng bản chất, không bịa.
5. **Không sai nguy hiểm về bảo mật/dữ liệu:** Không dạy thói quen sai (lưu mật khẩu plaintext, SQL nối chuỗi, để lộ secret...) như thể là chuẩn.

## Nhóm B — Tính đầy đủ & lộ trình

6. **Đủ kiến thức nền Java:** Cú pháp, OOP (4 tính chất), Collections, Generics, Exception, Stream/Lambda, đa luồng cơ bản.
7. **Đủ mảng Backend cốt lõi:** Build tool (Maven/Gradle), Spring Boot (IoC/DI, cấu hình), REST API, Spring Data JPA/Hibernate, SQL & thiết kế CSDL, Spring Security (auth, JWT), Testing (JUnit/Mockito).
8. **Có phần "sát doanh nghiệp lớn":** Git, Docker, logging/observability, CI/CD cơ bản, design pattern & SOLID, REST chuẩn (versioning, mã lỗi, OpenAPI/Swagger); giới thiệu microservices/messaging/caching ở mức nhận biết.
9. **Bài học có ranh giới rõ ràng:** Mỗi bài nêu rõ *học xong làm được gì*, không nhồi quá nhiều khái niệm trong một bài.
10. **Liên kết trước–sau hợp lý:** Bài sau chỉ dùng kiến thức đã dạy ở bài trước; không "nhảy cóc" giả định người học đã biết.

## Nhóm C — Phù hợp người mới / tư duy thuật toán yếu

11. **Tiền điều kiện minh bạch:** Đầu bài nêu rõ cần biết gì trước đó; nếu dùng khái niệm mới thì giải thích hoặc dẫn link.
12. **Giải thích trước, thuật ngữ sau:** Khái niệm khó được diễn giải bằng ngôn ngữ đời thường / ví dụ đời sống trước khi dùng từ chuyên ngành.
13. **Bù tư duy nền:** Khi cần logic/thuật toán (vòng lặp, điều kiện, cấu trúc dữ liệu), có giải thích cách nghĩ chứ không chỉ đưa đáp án.
14. **Không "khoảng nhảy" quá lớn:** Độ khó tăng dần; không nhảy từ "Hello World" sang hệ thống phức tạp trong một bước.

## Nhóm D — Chất lượng sư phạm & ví dụ

15. **Ví dụ có ngữ cảnh thật:** Dùng tình huống gần thực tế (quản lý user, đơn hàng...) thay vì `foo/bar` vô nghĩa.
16. **Có thực hành & tiêu chí "đúng":** Mỗi bài có bài tập/checklist tự kiểm tra để người học biết mình làm đúng chưa.
17. **Chỉ ra lỗi thường gặp:** Nêu các bẫy/sai lầm phổ biến và cách sửa (rất quan trọng với người mới).
18. **Code kèm giải thích từng phần:** Đoạn code quan trọng được chú thích vì sao viết thế, không chỉ dán code.
19. **Clean code làm gương:** Code mẫu đặt tên biến/hàm rõ ràng, định dạng nhất quán, theo convention Java — vì người mới sẽ bắt chước y hệt.

## Nhóm E — Cập nhật & nguồn

20. **Phản ánh thực tế hiện nay:** Công nghệ/cách làm được nêu vẫn đang được doanh nghiệp dùng (không dạy đồ đã lỗi thời mà không ghi chú).
21. **Dẫn nguồn kiểm chứng được:** Khi nêu số liệu, "best practice", hoặc đặc tả, có dẫn tài liệu chính thống (docs Spring/Oracle...) để đối chiếu.

---

## Mẫu báo cáo Claude Code nên xuất ra

```
BÀI: <tên file / tiêu đề bài>
KẾT LUẬN: PASS / FAIL  (Tổng: __/42 = __%)

NHÓM A (Chính xác):  A1 _ A2 _ A3 _ A4 _ A5 _
NHÓM B (Đầy đủ):     B6 _ B7 _ B8 _ B9 _ B10 _
NHÓM C (Người mới):  C11 _ C12 _ C13 _ C14 _
NHÓM D (Sư phạm):    D15 _ D16 _ D17 _ D18 _ D19 _
NHÓM E (Cập nhật):   E20 _ E21 _

🔴 LỖI CHẶN (tiêu chí A bị 0 điểm) — phải sửa trước khi học:
- ...

🟡 CẦN CẢI THIỆN:
- <tiêu chí>: <vấn đề> → <đề xuất sửa> (trích dẫn: "...")

🟢 ĐIỂM TỐT:
- ...
```

---

## Lưu ý khi tinh chỉnh rubric

- Bộ này giả định stack chuẩn doanh nghiệp lớn là **Java (17/21 LTS) + Spring Boot 3.x + Spring Data JPA + SQL**. Nếu bạn chọn stack khác, sửa tiêu chí B7/B8 cho khớp.
- Có thể tăng trọng số nhóm A và C (gấp đôi) nếu muốn ưu tiên "đúng" và "dễ cho người mới".
