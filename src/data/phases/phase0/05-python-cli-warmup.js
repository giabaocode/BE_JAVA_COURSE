// ============================================================================
//  PHASE 0 — Module 0.5: Python & CLI Warm-up (công cụ cho internship)
//  Python basics đủ đọc/sửa script + CLI hằng ngày + Git rollback an toàn.
//  Python là CÔNG CỤ, KHÔNG thay Java. Phục vụ internship + Capstone B (Phase 4).
// ============================================================================

export default
    {
      id: 'mod-0-5',
      title: 'Python & CLI Warm-up — công cụ cho internship',
      prerequisites: { vi: 'Đã quen tư duy biến/điều kiện/vòng lặp/hàm (qua Java ở các module trước). Đây là warm-up <strong>Python + CLI + Git an toàn</strong> — công cụ cho internship & automation, KHÔNG thay Java/Spring (vẫn là career track chính).' },
      lessons: [
        {
          id: 'l-0-5-1',
          type: 'practice',
          title: 'Python basics — đủ để đọc & sửa script',
          subtitle: { vi: 'Cùng tư duy bạn đã có ở Java, chỉ khác cú pháp. Mục tiêu: đọc/sửa được script, không phải thành dev Python.' },
          mentalModel: {
            vi: `Bạn đã biết tư duy lập trình (biến, if, for, hàm) từ Java. Python chỉ là <strong>một cú pháp khác, gọn hơn</strong> cho cùng tư duy đó: không dấu <code>;</code>, không <code>{}</code> — dùng <strong>thụt lề (indent)</strong> để gom khối; không khai báo kiểu cứng.
<br/><br/>
Vì sao học Python ở đây: công ty phần cứng có nhiều việc lặp (nhập kho từ Excel, xuất báo cáo, gọi API) — viết REST API Java cho mỗi việc nhỏ là quá nặng, một <strong>script Python</strong> gọn hơn. Mục tiêu Phase 0 này: <em>đọc được và sửa được</em> script, đủ để Capstone B (Phase 4) và internship.`
          },
          theory: {
            vi: `<h3>Cheat sheet — đối chiếu Java ↔ Python</h3>
<ul>
  <li>Biến: không khai kiểu. <code>x = 5</code>, <code>name = "An"</code>.</li>
  <li>Khối lệnh: dùng <strong>thụt lề</strong> (4 space), kết thúc dòng điều kiện/hàm bằng <code>:</code>.</li>
  <li>List = <code>[1, 2, 3]</code> (như ArrayList). Dict = <code>{"k": "v"}</code> (như HashMap). Set = <code>{1, 2, 3}</code> (như HashSet).</li>
  <li>Hàm: <code>def add(a, b): return a + b</code>.</li>
  <li>In: <code>print(...)</code>. Vòng lặp: <code>for x in items:</code> / <code>for i in range(n):</code>.</li>
</ul>

<h3>Đọc/ghi file, CSV, JSON, gọi API</h3>
<ul>
  <li>File: <code>with open("f.txt") as f: data = f.read()</code> — <code>with</code> tự đóng file (như try-with-resources của Java).</li>
  <li>CSV: module <code>csv</code> (chuẩn) hoặc <code>pandas</code> (mạnh hơn cho Excel).</li>
  <li>JSON: <code>json.loads(s)</code> (chuỗi→dict), <code>json.dumps(obj)</code> (dict→chuỗi).</li>
  <li>Gọi API: thư viện <code>requests</code> — <code>requests.get(url)</code>, <code>.json()</code> để lấy body.</li>
</ul>

<h3>Junior Pitfalls (Python cho người từ Java)</h3>
<ul>
  <li>Trộn tab và space khi thụt lề → <code>IndentationError</code>. Dùng nhất quán 4 space.</li>
  <li><code>=</code> (gán) vs <code>==</code> (so sánh) — giống Java.</li>
  <li>Quên <code>with</code> khi mở file → quên đóng → leak. Luôn dùng <code>with</code>.</li>
  <li>Gọi API không bắt lỗi/timeout → script treo. (Học kỹ ở Capstone B.)</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Python basics trong 1 file',
              lang: 'python',
              code: `# Biến, list, dict
prices = [199, 599, 1299]          # như ArrayList
product = {"name": "SSD 1TB", "price": 1299}   # như HashMap

# Hàm + vòng lặp
def total(items):
    s = 0
    for x in items:
        s += x
    return s

print(total(prices))               # 2097
print(product["name"])             # SSD 1TB

# Điều kiện
if product["price"] > 1000:
    print("hàng cao cấp")
else:
    print("phổ thông")`
            },
            {
              title: 'Đọc CSV/JSON + gọi API',
              lang: 'python',
              code: `import csv, json, requests

# Đọc CSV (mỗi dòng -> dict theo header)
with open("inventory.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["sku"], row["qty"])

# Đọc/ghi JSON
data = json.loads('{"sku": "SSD1TB", "qty": 5}')   # chuỗi -> dict
print(data["qty"])                                   # 5
text = json.dumps(data, ensure_ascii=False)          # dict -> chuỗi

# Gọi API (vd API backend của bạn)
resp = requests.get("http://localhost:8080/api/v1/products")
products = resp.json()        # body JSON -> list/dict
print(len(products))`
            }
          ],
          exercises: [
            {
              title: 'Đọc CSV đếm tồn kho thấp',
              prompt: 'Cho file <code>inventory.csv</code> có cột <code>sku,qty</code>. Viết script in ra các SKU có <code>qty &lt; 5</code> (sắp hết hàng).',
              hints: ['Dùng <code>csv.DictReader</code> — mỗi dòng là dict theo header.', '<code>int(row["qty"])</code> vì CSV đọc ra chuỗi.'],
              solution: {
                code: `import csv

with open("inventory.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if int(row["qty"]) < 5:                  # qty là chuỗi -> ép int
            print("LOW STOCK:", row["sku"], "qty=", row["qty"])`,
                lang: 'python',
                complexityVi: 'Time O(n) theo số dòng · Space O(1).',
                explanationVi: '<code>csv.DictReader</code> map mỗi dòng thành dict theo dòng header. Nhớ <code>int()</code> vì mọi giá trị CSV đọc ra là chuỗi — so sánh chuỗi với số sẽ sai/lỗi. <code>with</code> tự đóng file.'
              }
            },
            {
              title: 'Gọi API + lọc JSON',
              prompt: 'Gọi <code>GET http://localhost:8080/api/v1/products</code> (trả list JSON, mỗi item có <code>name</code>, <code>priceCents</code>). In tên các sản phẩm có giá &gt; 1 triệu (100_000_000 xu).',
              hints: ['<code>requests.get(url).json()</code> trả list dict.', 'Lọc bằng vòng for + if; chú ý key đúng tên.'],
              solution: {
                code: `import requests

resp = requests.get("http://localhost:8080/api/v1/products")
resp.raise_for_status()                 # ném lỗi nếu status 4xx/5xx
for p in resp.json():
    if p["priceCents"] > 100_000_000:
        print(p["name"])`,
                lang: 'python',
                complexityVi: 'Time O(n) theo số sản phẩm.',
                explanationVi: '<code>.json()</code> parse body thành list dict Python. <code>raise_for_status()</code> biến lỗi HTTP thành exception (đừng giả định luôn 200). Đây là nền cho Capstone B (RepairCLI) gọi API backend Java.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Python = cú pháp khác cho cùng tư duy bạn đã có ở Java; dùng thụt lề thay {}.',
              'list/dict/set ≈ ArrayList/HashMap/HashSet.',
              '<code>with open(...)</code> tự đóng file; <code>csv.DictReader</code> đọc CSV; <code>json.loads/dumps</code>; <code>requests.get().json()</code>.',
              'CSV đọc ra CHUỖI — nhớ <code>int()</code> khi so sánh số. Luôn <code>raise_for_status()</code> sau khi gọi API.',
              'Mục tiêu: đọc/sửa được script — Python là công cụ, Java vẫn là track chính.'
            ]
          }
        },
        {
          id: 'l-0-5-2',
          type: 'theory',
          title: 'CLI hằng ngày + Git rollback an toàn + logging + .env',
          subtitle: { vi: 'Terminal là nhà; Git là nút Undo — đặc biệt quan trọng khi làm việc với Claude Code.' },
          mentalModel: {
            vi: `Khi vào internship, bạn sống trong <strong>terminal</strong> và làm việc với code qua <strong>Git</strong>. Quan trọng nhất: Git là <strong>nút Undo</strong> của bạn. Khi Claude Code (hoặc bạn) sửa hỏng, biết cách <em>quay lại trạng thái cũ</em> là kỹ năng cứu mạng — bạn dám thử vì biết luôn lùi được.`
          },
          theory: {
            vi: `<h3>CLI hằng ngày (đủ dùng)</h3>
<ul>
  <li>Di chuyển: <code>cd</code>, <code>ls</code>/<code>dir</code>, <code>pwd</code>.</li>
  <li>Xem nội dung: <code>cat</code>/<code>type</code>, tìm: <code>grep</code> (hoặc Search trong IDE).</li>
  <li>Chạy: <code>./mvnw spring-boot:run</code> (Java), <code>python script.py</code> (Python).</li>
  <li>Đọc lỗi: đọc dòng CUỐI của stack trace trước (thường là nguyên nhân gốc).</li>
</ul>

<h3>Git — workflow cơ bản</h3>
<ul>
  <li><code>git status</code> — xem gì đã đổi.</li>
  <li><code>git add &lt;file&gt;</code> → <code>git commit -m "..."</code> — lưu mốc.</li>
  <li><code>git branch xyz</code> + <code>git switch xyz</code> — làm trên nhánh riêng, KHÔNG sửa thẳng <code>main</code>.</li>
  <li><code>git log --oneline</code> — xem lịch sử mốc.</li>
</ul>

<h3>Git ROLLBACK an toàn (khi Claude Code sửa hỏng) — học kỹ phần này</h3>
<ul>
  <li><strong>Chưa commit, muốn vứt thay đổi 1 file</strong>: <code>git restore &lt;file&gt;</code> (về bản commit gần nhất).</li>
  <li><strong>Vứt TẤT CẢ thay đổi chưa commit</strong>: <code>git restore .</code> (cẩn thận — mất hết sửa chưa lưu).</li>
  <li><strong>Đã commit nhưng muốn bỏ commit cuối, GIỮ thay đổi</strong>: <code>git reset --soft HEAD~1</code>.</li>
  <li><strong>Đã commit, muốn xoá hẳn commit cuối + thay đổi</strong>: <code>git reset --hard HEAD~1</code> (nguy hiểm — chỉ khi chắc chắn).</li>
  <li><strong>Đã push rồi, muốn hoàn tác mà không viết lại lịch sử</strong>: <code>git revert &lt;hash&gt;</code> (tạo commit "đảo ngược").</li>
  <li><strong>Lỡ tay mất commit?</strong> <code>git reflog</code> — xem MỌI vị trí HEAD từng tới, lấy lại được.</li>
</ul>
<em>Quy tắc vàng khi làm với AI: trước khi cho Claude Code sửa nhiều, hãy <code>git add . &amp;&amp; git commit</code> một mốc sạch. Sửa hỏng → <code>git restore .</code> hoặc <code>git reset --hard</code> về mốc đó.</em>

<h3>Logging &amp; đọc config/.env (Python)</h3>
<ul>
  <li>Đừng <code>print()</code> để debug script chạy thật — dùng <code>logging</code> (có level INFO/WARN/ERROR, ghi ra file được).</li>
  <li>Đọc cấu hình từ biến môi trường, KHÔNG hardcode: <code>os.getenv("API_URL")</code>; file <code>.env</code> đọc bằng <code>python-dotenv</code>.</li>
  <li>KHÔNG commit <code>.env</code> (chứa secret) → thêm vào <code>.gitignore</code>.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'logging + đọc .env (Python)',
              lang: 'python',
              code: `import logging, os
from dotenv import load_dotenv

load_dotenv()                                  # đọc file .env vào biến môi trường
API_URL = os.getenv("API_URL", "http://localhost:8080")   # có default
TOKEN = os.getenv("API_TOKEN")                 # KHÔNG hardcode token

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

log.info("Bắt đầu sync với %s", API_URL)       # INFO, không print
if not TOKEN:
    log.error("Thiếu API_TOKEN trong .env")     # ERROR rõ ràng`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự cứu khi Claude Code sửa hỏng',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Trước khi để AI sửa 10 file, tôi nên làm gì để có "điểm lùi" an toàn?
2. AI sửa hỏng, tôi CHƯA commit — lệnh nào vứt hết thay đổi về mốc sạch?
3. Tôi đã commit cái hỏng rồi nhưng CHƯA push — bỏ commit đó mà giữ code thì dùng lệnh gì? Còn xoá hẳn?
4. Tôi đã PUSH cái hỏng lên repo chung — vì sao KHÔNG nên reset --hard mà nên revert?
5. Lỡ reset --hard mất commit quan trọng — còn cách lấy lại không?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Git là nút Undo: trước khi cho AI sửa nhiều, commit 1 mốc sạch.',
              'Chưa commit: <code>git restore</code>. Bỏ commit cuối giữ code: <code>reset --soft</code>. Xoá hẳn: <code>reset --hard</code> (cẩn thận).',
              'Đã push → dùng <code>git revert</code> (không viết lại lịch sử chung). Mất commit → <code>git reflog</code> cứu.',
              'Script thật dùng <code>logging</code> (không print); đọc config từ <code>.env</code> (os.getenv), KHÔNG hardcode secret, KHÔNG commit .env.'
            ]
          }
        }
      ],
      references: [
        { title: 'Python Tutorial (chính thức)', url: 'https://docs.python.org/3/tutorial/' },
        { title: 'csv — Python stdlib', url: 'https://docs.python.org/3/library/csv.html' },
        { title: 'requests — HTTP for Humans', url: 'https://requests.readthedocs.io/' },
        { title: 'Python logging HOWTO', url: 'https://docs.python.org/3/howto/logging.html' },
        { title: 'Pro Git — Undoing Things', url: 'https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things' }
      ]
    }
