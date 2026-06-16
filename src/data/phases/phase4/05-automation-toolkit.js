// ============================================================================
//  PHASE 4 — Capstone B: Internal Automation Toolkit ("RepairCLI") — Python
//  Công cụ nội bộ: import kho từ Excel, export report, validate serial, báo giá.
//  ĐIỂM MẤU CHỐT: gọi API của Capstone A (RepairCore) -> chứng minh cầu nối Java↔Python.
//  Python là CÔNG CỤ, không phải main backend track.
// ============================================================================

export default {
  id: 'mod-4-5',
  title: 'Capstone B — RepairCLI: Automation Toolkit (Python)',
  prerequisites: { vi: 'Đã có <strong>Capstone A (RepairCore)</strong> chạy với API. Biết Python cơ bản (Phase 0 warm-up): file/CSV/JSON, requests, logging. Đây là CÔNG CỤ hỗ trợ — không thay thế Java backend track.' },
  lessons: [
    {
      id: 'l-4-5-overview',
      type: 'theory',
      title: 'RepairCLI — Vì sao Python ở đây, và ranh giới',
      subtitle: { vi: 'Tool nội bộ tự động hoá việc lặp lại — và bằng chứng bạn nối được Java backend với Python automation.' },
      mentalModel: {
        vi: `Ở công ty phần cứng, có nhiều việc lặp đi lặp lại: nhập tồn kho từ file Excel của nhà cung cấp, xuất báo cáo, kiểm tra serial hàng loạt. Viết một REST API Java cho mỗi việc nhỏ này là quá nặng — <strong>một script Python CLI</strong> gọn hơn nhiều.
<br/><br/>
<strong>Điểm mấu chốt:</strong> RepairCLI KHÔNG có database riêng. Nó <strong>gọi API của RepairCore (Capstone A)</strong> để đọc/ghi dữ liệu. Tức là: Java backend là nguồn sự thật, Python là tay automation. Đây chính xác là vai "Backend Java + Python automation" bạn muốn trên CV — và là cách trả lời câu "Java vs Python" của giám đốc một cách kỹ thuật.`
      },
      underTheHood: {
        vi: `<h3>Stack</h3>
Python 3 · <strong>Typer</strong> (hoặc argparse) cho CLI · <strong>requests</strong> gọi API RepairCore · <strong>pandas/openpyxl</strong> đọc Excel · <strong>logging</strong> · <strong>python-dotenv</strong> (đọc API URL + token từ <code>.env</code>) · <strong>pytest</strong>.

<h3>Ranh giới (đừng vượt)</h3>
<ul>
  <li>Python ở đây là <em>tool/script</em>, KHÔNG phải nơi chứa business logic chính. Logic nghiệp vụ (validate trạng thái ticket, tính tiền) nằm ở RepairCore (Java).</li>
  <li>Không build web API lớn bằng Python trong capstone này (FastAPI chỉ học khi công ty thực sự cần).</li>
  <li>Không hardcode token/URL — đọc từ <code>.env</code> (đúng nguyên tắc bảo mật).</li>
</ul>

<h3>Vì sao tách Java/Python rõ ràng lại tốt cho CV</h3>
Nhà tuyển dụng backend thấy: bạn hiểu <em>khi nào dùng cái nào</em> — backend doanh nghiệp (Java/Spring) cho hệ thống lõi, Python cho automation/tooling. Đó là tư duy kỹ sư, không phải "biết nhiều ngôn ngữ".`
      },
      theory: {
        vi: `<h3>Junior Pitfalls (Python tooling)</h3>
<ul>
  <li><code>print()</code> thay vì <code>logging</code> → không debug được khi chạy ngầm/định kỳ.</li>
  <li>Không xử lý lỗi khi gọi API (timeout, 4xx/5xx) → script chết câm. Bắt lỗi + log rõ + exit code khác 0.</li>
  <li>Hardcode token/URL trong code → lộ secret. Dùng <code>.env</code> + <code>python-dotenv</code>.</li>
  <li>Đọc cả file Excel khổng lồ vào RAM một lần → chậm/OOM. Xử lý theo batch nếu lớn.</li>
  <li>Không validate dữ liệu trước khi gửi API → đẩy rác vào hệ thống. Validate serial/format trước.</li>
</ul>

<h3>Output mong đợi</h3>
Vừa hỗ trợ công ty thật (giảm nhập tay), vừa chứng minh bạn biết Python thực dụng — mà KHÔNG làm lệch khỏi Backend Java.`
      },
      socraticPrompts: [
        {
          title: 'Khi nào script, khi nào API?',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Việc "import 5000 dòng tồn kho từ Excel 1 lần/tuần" — nên là REST endpoint trong RepairCore hay Python script? Vì sao?
2. RepairCLI gọi API RepairCore — token lấy thế nào, lưu ở đâu cho an toàn?
3. Nếu API trả 409 (serial trùng) giữa chừng khi import 5000 dòng — script nên dừng, bỏ qua dòng đó, hay gom lỗi báo cuối? Trade-off?
4. Business logic (vd validate trạng thái ticket) nên nằm ở Python script hay Java backend? Vì sao?`
        }
      ],
      keyTakeaways: {
        vi: [
          'RepairCLI KHÔNG có DB riêng — nó GỌI API RepairCore (Java là nguồn sự thật).',
          'Python = công cụ automation/tooling, không phải nơi chứa business logic chính.',
          'logging (không print), xử lý lỗi API, đọc token/URL từ .env.',
          'Tách Java/Python rõ ràng = tư duy "đúng công cụ cho đúng việc" — ăn điểm phỏng vấn.'
        ]
      }
    },
    {
      id: 'l-4-5-blueprint',
      type: 'project',
      title: 'RepairCLI — Các bước xây',
      subtitle: { vi: 'Mỗi command là một việc thật ở công ty. Có pytest cơ bản.' },
      steps: [
        {
          id: 's1', title: 'Setup project + CLI skeleton',
          description: { vi: 'Tạo project Python (venv), cài typer/requests/pandas/openpyxl/python-dotenv/pytest. CLI skeleton với Typer; đọc <code>API_URL</code> + <code>API_TOKEN</code> từ <code>.env</code>.' },
          deliverable: { vi: '<code>python -m repaircli --help</code> liệt kê command; đọc được .env (không hardcode).' }
        },
        {
          id: 's2', title: 'Command: import-inventory (Excel/CSV → API)',
          description: { vi: 'Đọc file tồn kho (pandas/openpyxl), validate từng dòng, gọi API RepairCore tạo/cập nhật inventory. Gom lỗi báo cuối.' },
          hints: ['Validate serial/format TRƯỚC khi gọi API.', 'Xử lý 409 (trùng) không làm chết cả batch.', 'logging mỗi dòng thành công/thất bại.'],
          deliverable: { vi: '<code>repaircli import-inventory file.xlsx</code> sync vào RepairCore; báo cáo cuối "X thành công, Y lỗi (lý do)".' }
        },
        {
          id: 's3', title: 'Command: validate-serials',
          description: { vi: 'Đọc danh sách serial từ file, gọi API tra cứu, xuất ra serial nào không tồn tại/sai format.' },
          deliverable: { vi: '<code>repaircli validate-serials file.csv</code> → báo cáo serial hợp lệ/không hợp lệ.' }
        },
        {
          id: 's4', title: 'Command: export-report',
          description: { vi: 'Gọi dashboard API RepairCore, xuất báo cáo CSV (số máy đang sửa, tồn kho thấp, doanh thu...).' },
          deliverable: { vi: '<code>repaircli export-report --out report.csv</code> tạo file CSV đúng số liệu.' }
        },
        {
          id: 's5', title: 'Command: generate-quote',
          description: { vi: 'Nhận input (customer + line items), gọi API tạo quote HOẶC sinh file HTML/CSV báo giá.' },
          deliverable: { vi: '<code>repaircli generate-quote ...</code> tạo quote (qua API) hoặc file báo giá có tổng tiền đúng.' }
        },
        {
          id: 's6', title: 'Error handling + logging + pytest',
          description: { vi: 'Bọc mọi call API (timeout, retry có giới hạn, log lỗi rõ, exit code). Viết pytest cho phần parse/validate (mock API bằng responses/monkeypatch).' },
          deliverable: { vi: 'API lỗi → script không chết câm (log + exit code ≠ 0); <code>pytest</code> xanh cho logic parse/validate.' }
        },
        {
          id: 's7', title: 'README + demo',
          description: { vi: 'README: cài đặt, .env mẫu, từng command + ví dụ. Demo script chạy thật với RepairCore local.' },
          deliverable: { vi: 'README đầy đủ + demo: chạy import-inventory rồi thấy dữ liệu xuất hiện trong RepairCore (Swagger/DB).' }
        }
      ],
      stretchGoals: { vi: ['Đóng gói thành 1 lệnh cài (pipx).', 'Thêm command sync định kỳ (cron) — tái dùng kiến thức @Scheduled nhưng phía tool.', 'Xuất quote ra PDF (reportlab/weasyprint).'] }
    }
  ],
  references: [
    { title: 'Typer (Python CLI)', url: 'https://typer.tiangolo.com/' },
    { title: 'requests (HTTP for Humans)', url: 'https://requests.readthedocs.io/' },
    { title: 'pandas — read_excel/read_csv', url: 'https://pandas.pydata.org/docs/' },
    { title: 'Python logging HOWTO', url: 'https://docs.python.org/3/howto/logging.html' },
    { title: 'pytest', url: 'https://docs.pytest.org/' }
  ]
}
