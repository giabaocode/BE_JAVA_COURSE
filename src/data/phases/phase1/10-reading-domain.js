// ============================================================================
//  PHASE 1 — Module 1.10: Reading & Refactoring Code + Hardware Domain Model
//  Kỹ năng intern THỰC SỰ cần: đọc code người khác/AI, refactor an toàn CÓ TEST,
//  và mô hình hoá nghiệp vụ phần cứng thành class Java (nền cho Capstone A + internship).
// ============================================================================

export default
    {
      id: 'mod-1-10',
      title: 'Reading & Refactoring Code + Domain Model phần cứng',
      prerequisites: { vi: 'Hoàn thành <strong>OOP Pillars</strong> + <strong>Java Core Essentials</strong> (Exception/Lambda/Stream). Module này dạy kỹ năng intern dùng hằng ngày: đọc code có sẵn, refactor an toàn, và mô hình hoá domain — nền trực tiếp cho Capstone A (RepairCore) & internship.' },
      lessons: [
        {
          id: 'l-1-10-1',
          type: 'theory',
          title: 'Đọc code người khác/AI + Refactor an toàn (có test)',
          subtitle: { vi: 'Intern ĐỌC code nhiều hơn VIẾT. Và sửa code có sẵn mà không phá thứ đang chạy.' },
          mentalModel: {
            vi: `Sự thật ít trường dạy: một intern/junior <strong>đọc code nhiều hơn viết</strong> — đặc biệt code do AI hoặc đồng nghiệp viết. Hai kỹ năng quyết định:
<br/><br/>
<strong>1) Đọc code lạ</strong> mà không hoảng: tìm entry point → lần theo luồng dữ liệu → đọc tên hàm/biến để đoán ý đồ, KHÔNG đọc tuần tự từ trên xuống.
<br/><br/>
<strong>2) Refactor an toàn</strong>: muốn sửa cấu trúc mà không đổi hành vi → phải có <strong>lưới an toàn = test</strong>. Quy trình: viết test "chụp" hành vi HIỆN TẠI (characterization test) → test xanh → refactor → test VẪN xanh. Test đỏ = bạn vừa đổi hành vi (có thể là bug).`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Đọc code = đọc Ý ĐỒ, không phải từng dòng.</strong>
Hỏi: "Hàm này NHẬN gì, TRẢ gì, có side effect gì (ghi DB/gọi API)?". Đọc signature + tên trước; chỉ đọc thân khi cần. Code AI sinh thường <em>chạy được</em> nhưng có thể thừa, đặt tên kém, hoặc thiếu xử lý lỗi — đọc để PHÁT HIỆN, không tin mù.
<br/><br/>
<strong>2) "Chạy được" ≠ "maintainable".</strong>
Code chạy được: cho output đúng hôm nay. Code maintainable: người khác (và bạn 3 tháng sau) đọc-sửa được mà không sợ. Khác biệt: tên rõ nghĩa, hàm 1 việc, ít lồng sâu, không magic number, có test. AI rất giỏi "chạy được", bạn là người nâng nó lên "maintainable".
<br/><br/>
<strong>3) Vì sao test TRƯỚC khi refactor?</strong>
Không có test, mỗi lần refactor là đánh cược "chắc không hỏng gì". Có test chụp hành vi cũ → refactor trở thành an toàn: nếu lỡ đổi hành vi, test đỏ báo ngay. Đây là cách sửa code production mà không gây sự cố (gắn thẳng Phase 6 — small tasks).
<br/><br/>
<strong>4) Refactor nhỏ, từng bước.</strong>
Đổi tên biến → chạy test. Tách 1 hàm → chạy test. KHÔNG refactor 500 dòng rồi mới chạy test (đỏ thì không biết bước nào hỏng).`
          },
          theory: {
            vi: `<h3>Junior Pitfalls khi đọc/refactor</h3>
<ul>
  <li>Refactor + đổi hành vi cùng lúc → không biết bug do refactor hay do logic mới. Tách 2 việc.</li>
  <li>Refactor mà KHÔNG có test → "chắc ổn" → 2 ngày sau lộ bug ở production.</li>
  <li>Tin mù code AI vì "nó chạy" → bỏ qua thiếu validate/N+1/lỗi bảo mật.</li>
  <li>Đọc tuần tự từ dòng 1 → lạc. Hãy bắt đầu từ entry point + luồng dữ liệu.</li>
  <li>Refactor khổng lồ trong 1 commit → review khó, rollback khó. Nhiều bước nhỏ.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Trước/sau refactor — và TEST làm lưới an toàn',
              code: `// ===== TRƯỚC: chạy được nhưng khó maintain =====
public int calc(List<int[]> o) {       // tên vô nghĩa: calc? o?
    int r = 0;
    for (int i = 0; i < o.size(); i++)
        if (o.get(i)[2] == 1) r += o.get(i)[0] * o.get(i)[1];  // [2]==1? magic
    return r;
}

// ===== TEST chụp hành vi HIỆN TẠI (viết TRƯỚC khi refactor) =====
@Test
void totalPaidRevenue_onlyCountsPaidLines() {
    List<int[]> lines = List.of(
        new int[]{100, 2, 1},   // price, qty, paid(1)
        new int[]{ 50, 3, 0});  // chưa trả -> không tính
    assertEquals(200, new Billing().calc(lines));   // chụp kết quả cũ = 200
}

// ===== SAU: cùng hành vi (test vẫn xanh), nhưng đọc được =====
record OrderLine(long priceCents, int qty, boolean paid) {
    long lineTotal() { return paid ? priceCents * qty : 0; }
}
public long totalPaidRevenue(List<OrderLine> lines) {   // tên nói rõ ý đồ
    return lines.stream().mapToLong(OrderLine::lineTotal).sum();
}`,
              lang: 'java',
              description: 'Quy trình: viết test chụp hành vi cũ → test xanh → refactor (đặt tên rõ, bỏ magic number, dùng record + stream) → test VẪN xanh = an toàn.'
            }
          ],
          socraticPrompts: [
            {
              title: 'Đọc một đoạn code AI vừa sinh',
              prompt: `Tôi vừa được AI sinh một method. KHÔNG cho đáp án. Hỏi tôi:
1. Method này NHẬN gì, TRẢ gì, có side effect gì (ghi DB / gọi API / đổi state)?
2. Có input nào làm nó vỡ không (null, rỗng, số âm, quá lớn)?
3. Tên hàm/biến có nói đúng việc nó làm không? Chỗ nào gây hiểu nhầm?
4. Trước khi tôi refactor nó, tôi cần viết test gì để "chụp" hành vi hiện tại?
5. Tôi nên tách thành mấy bước refactor nhỏ, mỗi bước chạy test?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Intern đọc code nhiều hơn viết — đọc Ý ĐỒ (nhận/trả/side effect), bắt đầu từ entry point.',
              '"Chạy được" ≠ "maintainable": tên rõ, hàm 1 việc, không magic number, có test.',
              'Refactor an toàn: viết test chụp hành vi cũ → test xanh → refactor → test VẪN xanh.',
              'Tách refactor và đổi-logic thành 2 việc; refactor từng bước nhỏ, chạy test sau mỗi bước.',
              'KHÔNG tin mù code AI: soi validate/N+1/bảo mật/lỗi biên.'
            ]
          }
        },
        {
          id: 'l-1-10-2',
          type: 'practice',
          title: 'Domain model phần cứng — biến nghiệp vụ thành class Java',
          subtitle: { vi: 'Mô hình hoá công ty PC/laptop thành class/entity. Đây là bước đầu của MỌI backend — và nền cho Capstone A.' },
          mentalModel: {
            vi: `Sau khi hiểu nghiệp vụ (Phase 6 — domain discovery), việc đầu tiên của backend dev là <strong>biến nghiệp vụ thành class/entity</strong>: mỗi "thứ" trong đời thực (sản phẩm, phiếu sửa, bảo hành) thành một class; quan hệ giữa chúng thành field/reference.
<br/><br/>
Mô hình tốt = đọc class là hiểu nghiệp vụ. Mô hình tệ = dữ liệu rời rạc, dễ sai. Module này luyện kỹ năng đó trên domain công ty bạn — KHÔNG cần Spring/DB, chỉ class Java thuần.`
          },
          underTheHood: {
            vi: `<h3>First Principles — nguyên tắc mô hình hoá</h3>
<ul>
  <li><strong>Mỗi danh từ nghiệp vụ = 1 class</strong>: Product, Component, RepairTicket, Warranty, InventoryItem, Technician, DiagnosticLog, Customer.</li>
  <li><strong>Trạng thái hữu hạn = enum</strong>: <code>RepairStatus</code> (RECEIVED, DIAGNOSING, ... ) thay vì String tự do (chống gõ sai + ép hợp lệ).</li>
  <li><strong>Tiền = <code>long</code> (xu) hoặc BigDecimal</strong>, KHÔNG double.</li>
  <li><strong>Value object bất biến</strong> (Money, địa chỉ) → dùng <code>record</code> (Java 21).</li>
  <li><strong>Quan hệ</strong>: RepairTicket "thuộc về" 1 Customer + (có thể) 1 Technician + nhiều DiagnosticLog → field reference, không nhồi mọi thứ vào 1 class.</li>
  <li><strong>ID + timestamp</strong>: mỗi entity nên có <code>id</code> + <code>createdAt</code> (immutable sau khi tạo).</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Domain model phần cứng (class Java thuần)',
              code: `import java.time.LocalDate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

// Trạng thái hữu hạn -> enum (KHÔNG dùng String tự do)
enum RepairStatus { RECEIVED, DIAGNOSING, WAITING_PARTS, REPAIRING, TESTING, COMPLETED, RETURNED, CANCELLED }
enum Role { ADMIN, TECHNICIAN, SALES, VIEWER }

// Catalog
record Product(long id, String sku, String name, long priceCents) {}      // tiền = long xu
record Component(long id, String sku, String name, String category) {}

// Người
record Customer(long id, String name, String phone) {}
record Technician(long id, String name, Role role) {}

// Tồn kho + serial
class InventoryItem {
    final long id; final String sku; int quantity; final int lowStockThreshold;
    InventoryItem(long id, String sku, int quantity, int lowStockThreshold) {
        this.id = id; this.sku = sku; this.quantity = quantity; this.lowStockThreshold = lowStockThreshold;
    }
    boolean isLowStock() { return quantity < lowStockThreshold; }   // hành vi đi cùng dữ liệu
}

// Bảo hành (gắn theo serial)
record Warranty(long id, String serial, LocalDate purchasedAt, int months) {
    boolean isValidOn(LocalDate date) { return !date.isAfter(purchasedAt.plusMonths(months)); }
}

// Nhật ký chẩn đoán
record DiagnosticLog(long id, String note, Instant at, long technicianId) {}

// Phiếu sửa — trung tâm, gom quan hệ
class RepairTicket {
    final long id;
    final Customer customer;
    final String deviceSerial;
    Technician assignedTo;                 // có thể null lúc đầu
    RepairStatus status = RepairStatus.RECEIVED;
    final Instant createdAt = Instant.now();
    final List<DiagnosticLog> logs = new ArrayList<>();

    RepairTicket(long id, Customer customer, String deviceSerial) {
        this.id = id; this.customer = customer; this.deviceSerial = deviceSerial;
    }
    void addLog(DiagnosticLog log) { logs.add(log); }
}`,
              lang: 'java',
              description: 'enum cho trạng thái/role, record cho value object, class cho entity có hành vi (isLowStock/isValidOn). Tiền long xu. RepairTicket gom quan hệ qua reference.'
            }
          ],
          exercises: [
            {
              title: 'Thêm hành vi validate chuyển trạng thái',
              prompt: 'Thêm method <code>transitionTo(RepairStatus next)</code> vào <code>RepairTicket</code>: chỉ cho phép chuyển trạng thái HỢP LỆ (vd RECEIVED→DIAGNOSING ok; RECEIVED→RETURNED không). Sai → ném IllegalStateException.',
              hints: [
                'Câu hỏi 1: Encode "từ trạng thái X được sang những trạng thái nào" bằng cấu trúc nào? (gợi ý: Map<RepairStatus, Set<RepairStatus>>)',
                'Câu hỏi 2: Vì sao đặt luật ở 1 method transitionTo() thay vì cho sửa field status tự do?'
              ],
              solution: {
                code: `import java.util.*;

// trong class RepairTicket:
private static final Map<RepairStatus, Set<RepairStatus>> ALLOWED = Map.of(
    RepairStatus.RECEIVED,      Set.of(RepairStatus.DIAGNOSING, RepairStatus.CANCELLED),
    RepairStatus.DIAGNOSING,    Set.of(RepairStatus.WAITING_PARTS, RepairStatus.REPAIRING, RepairStatus.CANCELLED),
    RepairStatus.WAITING_PARTS, Set.of(RepairStatus.REPAIRING, RepairStatus.CANCELLED),
    RepairStatus.REPAIRING,     Set.of(RepairStatus.TESTING, RepairStatus.CANCELLED),
    RepairStatus.TESTING,       Set.of(RepairStatus.COMPLETED, RepairStatus.REPAIRING),
    RepairStatus.COMPLETED,     Set.of(RepairStatus.RETURNED),
    RepairStatus.RETURNED,      Set.of(),
    RepairStatus.CANCELLED,     Set.of()
);

void transitionTo(RepairStatus next) {
    Set<RepairStatus> ok = ALLOWED.getOrDefault(status, Set.of());
    if (!ok.contains(next))
        throw new IllegalStateException("Không thể chuyển " + status + " -> " + next);
    this.status = next;
}`,
                lang: 'java',
                complexityVi: 'Time O(1) mỗi lần chuyển.',
                explanationVi: 'Đây là <strong>state machine</strong>: luật chuyển trạng thái encode trong <code>Map&lt;Status, Set&lt;Status&gt;&gt;</code>. Mọi đổi trạng thái đi qua MỘT cửa <code>transitionTo()</code> có validate → không thể nhảy bậy (RECEIVED→RETURNED). Đây chính là pattern bạn dùng lại ở Capstone A (RepairCore) và ShopCore.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Mỗi danh từ nghiệp vụ = 1 class; trạng thái hữu hạn = enum; tiền = long xu.',
              'value object bất biến → record (Java 21); entity có hành vi → class (isLowStock, isValidOn).',
              'Quan hệ thể hiện bằng reference field, không nhồi mọi thứ vào 1 class.',
              'transitionTo() + Map<Status,Set<Status>> = state machine; mọi đổi trạng thái qua 1 cửa có validate.',
              'Mô hình tốt = đọc class là hiểu nghiệp vụ — nền cho Capstone A & internship.'
            ]
          }
        }
      ],
      references: [
        { title: 'Java records (Oracle)', url: 'https://docs.oracle.com/en/java/javase/21/language/records.html' },
        { title: 'Refactoring — Martin Fowler (catalog)', url: 'https://refactoring.com/catalog/' },
        { title: 'Characterization test (Working Effectively with Legacy Code)', url: 'https://martinfowler.com/bliki/CharacterizationTest.html' }
      ]
    }
