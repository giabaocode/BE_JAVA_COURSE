// ============================================================================
//  PHASE 6 — Internship Specialization: PC/Laptop Business Software Track
//  Bối cảnh: intern ở công ty phần cứng (lắp ráp/sửa chữa/bảo hành/kho/bán).
//  Mục tiêu: làm phần mềm nội bộ + giữ Backend Java + LeetCode làm trục dài hạn.
//  LƯU Ý: phase-level intro/tagline KHÔNG được app render -> mọi nội dung nằm ở
//  module.prerequisites / lesson.* / module.references (đều render).
// ============================================================================

export const phase6 = {
  id: 'phase-6',
  title: 'Phase 6 — Internship: PC/Laptop Business Software',
  tagline: 'Biến internship phần cứng thành kinh nghiệm Backend + Internal Tools thật.',
  intro: { vi: 'Domain discovery → codebase & Claude Code setup → small value tasks → mini feature. Giữ Java + LeetCode là trục.' },
  modules: [

    // ===================== MODULE 6.1 =====================
    {
      id: 'mod-6-1',
      title: 'Tuần 1–2: Domain Discovery (hiểu công ty trước khi code)',
      prerequisites: { vi: 'Đang/sắp bắt đầu internship ở công ty phần cứng. Đã xong <strong>Phase 0</strong> (Java + CLI cơ bản). Chưa cần biết codebase công ty.' },
      lessons: [
        {
          id: 'l-6-1-1',
          type: 'theory',
          title: 'Hiểu nghiệp vụ, quy trình & phần mềm hiện tại',
          subtitle: { vi: 'Tuần đầu KHÔNG code. Hiểu domain trước — đây là việc một software dev giỏi luôn làm.' },
          mentalModel: {
            vi: `Một intern dở lao vào sửa code ngay. Một intern giỏi <strong>hiểu nghiệp vụ trước</strong>: công ty bán/sửa gì, quy trình ra sao, phần mềm đang giải quyết vấn đề nào.
<br/><br/>
Giám đốc nói "phần cứng là toàn bộ nhưng không cần hiểu quá sâu" → dịch ra: bạn cần hiểu phần cứng <strong>đủ để mô hình hoá thành dữ liệu/phần mềm</strong> (serial, bảo hành, phiếu sửa, tồn kho), KHÔNG cần thành kỹ sư sửa mainboard.
<br/><br/>
Mục tiêu 2 tuần này: nói được bằng lời <em>"khách mang máy tới → chuyện gì xảy ra → dữ liệu nào sinh ra → phần mềm chạm vào đâu"</em>.`
          },
          theory: {
            vi: `<h3>Việc cần làm</h3>
<ul>
  <li>Hỏi giám đốc/senior theo checklist 4 nhóm (xem Socratic prompts bên dưới — copy đi hỏi thật).</li>
  <li>Vẽ <strong>flow nghiệp vụ</strong>: khách mang máy → nhận máy → chẩn đoán → báo giá → sửa → test → trả máy → bảo hành.</li>
  <li>Lập <strong>glossary</strong> (giải nghĩa bằng lời của bạn): serial, SKU, warranty, diagnostic, part replacement, ticket, technician, inventory, quote, order.</li>
  <li>Ghi lại <strong>pain point</strong> lớn nhất của phần mềm hiện tại + dữ liệu quan trọng nhất.</li>
</ul>

<h3>Chưa cần học sâu lúc này (và khi nào mới cần)</h3>
<ul>
  <li><strong>Thiết kế mạch / hàn / sửa mainboard / PCB</strong> → chỉ khi được giao làm kỹ thuật sửa chữa (≠ vai phần mềm).</li>
  <li><strong>Firmware</strong> → khi phần mềm phải flash/cập nhật firmware thiết bị.</li>
  <li><strong>UART/I2C/SPI (embedded)</strong> → chỉ khi phần mềm phải giao tiếp board/vi điều khiển (giám đốc xác nhận có thiết bị).</li>
  <li><strong>MQTT/IoT</strong> → khi có thiết bị gửi telemetry về server.</li>
  <li><strong>Microservices / system design cao cấp</strong> → sau khi có 1 backend monolith vững + lý do scale thật.</li>
</ul>
Nguyên tắc: <strong>không học đầu cơ</strong>. Mục nào cần "bằng chứng công ty dùng" thì đợi bằng chứng.`
          },
          socraticPrompts: [
            {
              title: '[Hỏi giám đốc] Nhóm A — Phần cứng',
              prompt: `Câu hỏi hỏi giám đốc/senior về phần cứng (mục tiêu: hiểu đủ để làm phần mềm):
1. Công ty tập trung mảng nào nhất: bán PC/laptop, lắp ráp, sửa chữa, hay bảo hành — hay tất cả?
2. Em cần hiểu phần cứng tới mức nào để hỗ trợ phần mềm (tra cứu? nhập kho? hay chẩn đoán)?
3. Em có cần tự chẩn đoán/sửa máy không, hay chỉ làm phần mềm quản lý quy trình đó?
4. Có thiết bị/máy nào phần mềm phải GIAO TIẾP TRỰC TIẾP không (máy in tem, đầu đọc barcode/serial, máy test pin)?`
            },
            {
              title: '[Hỏi giám đốc] Nhóm B — Phần mềm',
              prompt: `Câu hỏi về phần mềm hiện tại:
1. Stack hiện tại là gì (ngôn ngữ, framework, database)?
2. Codebase nằm ở đâu (Git? máy local? Drive?)?
3. Có database thật không, hay đang dùng Excel/Google Sheet?
4. Có tài liệu / README / test không?
5. Pain point lớn nhất của phần mềm hiện tại là gì?`
            },
            {
              title: '[Hỏi giám đốc] Nhóm C — Vai trò của em',
              prompt: `Câu hỏi về vai trò:
1. 1 tháng đầu anh muốn em làm được việc gì cụ thể?
2. Em nên học phần nào trước để giúp được sớm?
3. Task nhỏ đầu tiên em có thể bắt đầu là gì?
4. Em được phép đọc/sửa repo/môi trường nào — và cái nào TUYỆT ĐỐI không được đụng?
5. Quy trình review code trước khi merge/deploy ra sao?`
            },
            {
              title: '[Hỏi giám đốc] Nhóm D — Claude Code',
              prompt: `Câu hỏi về cách dùng Claude Code ở công ty:
1. Anh đang dùng Claude Code theo quy trình nào (Plan Mode? hay để AI tự chạy)?
2. Repo đã có CLAUDE.md chưa?
3. Có dùng git branch/commit hay sửa thẳng?
4. Có test trước khi deploy không?
5. Phần nào TUYỆT ĐỐI không được để AI tự sửa (thanh toán, dữ liệu khách, tồn kho thật)?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Tuần đầu hiểu nghiệp vụ trước, KHÔNG code.',
              'Hiểu phần cứng đủ để mô hình hoá thành dữ liệu (serial/warranty/ticket/inventory), không cần thành kỹ sư sửa máy.',
              'Hỏi giám đốc theo 4 nhóm (phần cứng / phần mềm / vai trò / Claude Code) — copy prompt đi hỏi thật.',
              'Không học đầu cơ embedded/mạch/microservices khi chưa có bằng chứng công ty cần.'
            ]
          }
        },
        {
          id: 'l-6-1-2',
          type: 'project',
          title: 'Output tuần 1–2 — tài liệu domain',
          subtitle: { vi: 'Bằng chứng bạn hiểu công ty. Đây là deliverable đầu tiên gây ấn tượng với sếp.' },
          steps: [
            {
              id: 's1', title: 'company-domain-notes.md',
              description: { vi: 'Ghi lại: công ty bán/sửa gì, các quy trình chính, phần mềm hiện tại làm gì, stack (nếu có).' },
              deliverable: { vi: 'File <code>company-domain-notes.md</code> ≥ 1 trang, viết bằng lời của bạn (không copy brochure).' }
            },
            {
              id: 's2', title: 'Flow diagram quy trình sửa chữa',
              description: { vi: 'Vẽ luồng: khách mang máy → nhận → chẩn đoán → báo giá → sửa → test → trả → bảo hành. Dùng Mermaid hoặc ảnh chụp sơ đồ tay.' },
              deliverable: { vi: '1 sơ đồ flow nhúng trong markdown (Mermaid) hoặc file ảnh.' }
            },
            {
              id: 's3', title: 'Glossary thuật ngữ',
              description: { vi: 'Giải nghĩa: serial, SKU, warranty, diagnostic, part replacement, ticket, technician, inventory, quote, order — bằng lời dễ hiểu.' },
              deliverable: { vi: 'File <code>glossary.md</code> ≥ 10 thuật ngữ, mỗi cái 1–2 câu.' }
            },
            {
              id: 's4', title: 'Pain points + dữ liệu quan trọng',
              description: { vi: 'Liệt kê 3–5 pain point của phần mềm hiện tại + các loại dữ liệu quan trọng nhất (cái gì mất là công ty đau nhất).' },
              deliverable: { vi: 'Danh sách pain points + danh sách dữ liệu quan trọng (ưu tiên cho thiết kế schema sau này).' }
            }
          ]
        }
      ],
      references: [
        { title: 'Mermaid — vẽ flow/diagram trong markdown', url: 'https://mermaid.js.org/' },
        { title: 'Domain-Driven Design Reference (Eric Evans)', url: 'https://www.domainlanguage.com/ddd/reference/' }
      ]
    },

    // ===================== MODULE 6.2 =====================
    {
      id: 'mod-6-2',
      title: 'Tuần 3–4: Codebase & Claude Code Setup (an toàn)',
      prerequisites: { vi: 'Xong Module 6.1 (hiểu domain). Có quyền truy cập repo công ty (hoặc xác nhận công ty CHƯA có codebase).' },
      lessons: [
        {
          id: 'l-6-2-1',
          type: 'theory',
          title: 'Lên codebase công ty an toàn + viết CLAUDE.md',
          subtitle: { vi: 'Chạy được project, hiểu cấu trúc, lập bản đồ rủi ro TRƯỚC khi sửa dòng nào.' },
          mentalModel: {
            vi: `Bạn là <strong>kiến trúc sư</strong>, Claude là <strong>thợ xây</strong>. Trước khi để thợ xây đụng vào, kiến trúc sư phải đọc bản vẽ: project chạy thế nào, file nào quan trọng, đụng vào đâu thì hỏng.
<br/><br/>
Quy tắc vàng tuần này: <strong>chưa hiểu thì chưa sửa</strong>. Mục tiêu là <em>chạy được + hiểu cấu trúc + biết chỗ nào nguy hiểm</em>, không phải sửa gì cả.`
          },
          theory: {
            vi: `<h3>Việc cần làm</h3>
<ul>
  <li><code>git clone</code> repo; đọc README; chạy project local; chạy test (nếu có).</li>
  <li>Map folder: đâu là entry point, đâu là layer controller/service/data, config nằm đâu.</li>
  <li>Viết <strong>architecture-map.md</strong>: vẽ sơ bộ luồng request đi qua các tầng.</li>
  <li>Viết <strong>CLAUDE.md</strong> cho repo: stack, cách chạy/test/build, quy ước, vùng nguy hiểm "không được tự sửa".</li>
  <li>Tạo <strong>branch riêng</strong> ngay (không sửa thẳng <code>main</code>); dùng <strong>Plan Mode</strong> trước khi đụng bất cứ gì.</li>
</ul>
<h3>Nếu công ty CHƯA có codebase</h3>
Đây là cơ hội: đề xuất khởi tạo repo theo chuẩn (Capstone A của bạn chính là bản mẫu). Khi đó "architecture map" = thiết kế bạn đề xuất, không phải đọc code có sẵn.`
          },
          socraticPrompts: [
            {
              title: '[Hỏi AI] Hiểu codebase lạ — KHÔNG sửa',
              prompt: `Tôi vừa clone một repo lạ. TUYỆT ĐỐI KHÔNG sửa gì. Hãy giúp tôi HIỂU:
1. Đâu là entry point của app? Luồng khởi động ra sao?
2. Có những tầng/module chính nào? Mỗi tầng chịu trách nhiệm gì?
3. Config/secret/DB connection cấu hình ở đâu?
4. Lệnh nào để chạy / test / build?
5. Những file/khu vực nào "nhạy cảm" mà sửa dễ gây hỏng? (chỉ liệt kê, đừng sửa)
Chỉ đọc và giải thích. Không đề xuất thay đổi.`
            }
          ],
          keyTakeaways: {
            vi: [
              'Chạy được + hiểu cấu trúc + biết vùng nguy hiểm TRƯỚC khi sửa.',
              'Luôn tạo branch riêng; không sửa thẳng main.',
              'Viết CLAUDE.md cho repo công ty (stack, cách chạy, vùng cấm AI tự sửa).',
              'Công ty chưa có codebase = cơ hội khởi tạo chuẩn (dùng Capstone A làm mẫu).'
            ]
          }
        },
        {
          id: 'l-6-2-2',
          type: 'theory',
          title: 'Quy trình Claude Code 9 bước — biến vibe code thành kỹ thuật',
          subtitle: { vi: 'Giám đốc vibe code; nhiệm vụ của bạn là quy trình hoá nó để không phá hệ thống đang chạy.' },
          mentalModel: {
            vi: `Vibe coding nhanh nhưng nguy hiểm trên hệ thống thật (mất dữ liệu khách, sai tồn kho). Bạn không chống lại nó — bạn <strong>thêm rào chắn</strong> để nó an toàn.
<br/><br/>
Bạn quyết định <em>"làm gì"</em>; AI lo <em>"viết thế nào"</em>; nhưng <strong>bạn luôn review</strong> trước khi merge.`
          },
          theory: {
            vi: `<h3>Quy trình 9 bước cho mỗi thay đổi</h3>
<ol>
  <li><strong>Requirement</strong> — viết 2–3 câu yêu cầu rõ ràng.</li>
  <li><strong>Domain question</strong> — hỏi lại nghiệp vụ chỗ chưa chắc (serial có unique? ticket xoá được không?).</li>
  <li><strong>Plan Mode</strong> — bắt Claude lập kế hoạch TRƯỚC, chưa code.</li>
  <li><strong>Human review plan</strong> — bạn đọc, sửa, duyệt. Đây là chốt chặn quan trọng nhất.</li>
  <li><strong>Small implementation</strong> — làm 1 feature nhỏ, không ôm to.</li>
  <li><strong>Test</strong> — chạy test sẵn có + thêm test cho phần mới.</li>
  <li><strong>Review diff</strong> — đọc TỪNG dòng AI sinh; không hiểu thì hỏi, không merge mù.</li>
  <li><strong>Commit</strong> — branch riêng, message rõ; biết <code>git restore</code>/<code>reset</code> để rollback.</li>
  <li><strong>Document</strong> — ghi "yêu cầu / cách làm / test / kết quả".</li>
</ol>
<h3>Luật cứng (đỏ)</h3>
<ul>
  <li>KHÔNG cho AI chạy lệnh phá huỷ (drop table, xoá DB, <code>rm -rf</code>, deploy) mà chưa hiểu.</li>
  <li>Repo thật → luôn branch, không sửa thẳng <code>main</code>.</li>
  <li>Vùng "cấm" trong CLAUDE.md (thanh toán, dữ liệu khách) → người làm, không để AI tự quyết.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: '[Mẫu] Yêu cầu Claude vào Plan Mode',
              prompt: `Tôi cần [mô tả yêu cầu ngắn]. ĐỪNG code ngay.
1. Trước hết hỏi tôi các câu hỏi nghiệp vụ/kỹ thuật bạn cần để hiểu đúng.
2. Sau đó lập KẾ HOẠCH: file nào đụng, thay đổi gì, rủi ro gì, cần test gì.
3. Đợi tôi duyệt kế hoạch rồi mới làm, và làm TỪNG bước nhỏ.
Không sửa file nào cho tới khi tôi nói "duyệt".`
            }
          ],
          keyTakeaways: {
            vi: [
              '9 bước: Requirement → Domain Q → Plan → Review plan → Small impl → Test → Review diff → Commit → Document.',
              'Chốt chặn quan trọng nhất = review PLAN và review DIFF (không merge mù).',
              'Luật đỏ: không lệnh phá huỷ, luôn branch, vùng cấm AI tự sửa.',
              'Bạn quyết "làm gì", AI lo "viết thế nào" — nhưng bạn review.'
            ]
          }
        },
        {
          id: 'l-6-2-3',
          type: 'project',
          title: 'Output tuần 3–4 — setup an toàn',
          steps: [
            { id: 's1', title: 'local-setup-notes.md', description: { vi: 'Ghi lại các bước chạy project local + lệnh chạy/test/build.' }, deliverable: { vi: 'Project chạy được local; file ghi đủ lệnh để người khác lặp lại.' } },
            { id: 's2', title: 'architecture-map.md', description: { vi: 'Sơ đồ tầng + luồng request + vị trí config/DB.' }, deliverable: { vi: 'Bản đồ kiến trúc đủ để bạn định vị code trong 30 giây.' } },
            { id: 's3', title: 'CLAUDE.md cho repo công ty', description: { vi: 'Stack, cách chạy/test/build, quy ước, VÙNG CẤM AI tự sửa.' }, deliverable: { vi: 'CLAUDE.md commit vào branch của bạn.' } },
            { id: 's4', title: 'Risk list', description: { vi: 'Danh sách khu vực sửa dễ gây hỏng + cách phòng (test/branch/backup).' }, deliverable: { vi: 'Danh sách rủi ro — chia sẻ với sếp để xác nhận vùng cấm.' } }
          ]
        }
      ],
      references: [
        { title: 'Pro Git (sách miễn phí) — branch & undo', url: 'https://git-scm.com/book/en/v2' },
        { title: 'Google Engineering Practices — Code Review', url: 'https://google.github.io/eng-practices/review/' }
      ]
    },

    // ===================== MODULE 6.3 =====================
    {
      id: 'mod-6-3',
      title: 'Tuần 5–8: Small Value Tasks (giá trị nhỏ, không phá hệ thống)',
      prerequisites: { vi: 'Xong Module 6.2 (chạy được codebase + CLAUDE.md + quy trình 9 bước). Đã được sếp giao vùng được phép sửa.' },
      lessons: [
        {
          id: 'l-6-3-1',
          type: 'theory',
          title: 'Làm software intern đúng nghĩa: task nhỏ + Definition of Done',
          mentalModel: {
            vi: `Intern giỏi không chờ task "to và oách". Họ <strong>giao giá trị nhỏ nhưng THẬT</strong>, đều đặn, không làm hỏng cái đang chạy. Niềm tin xây bằng nhiều PR nhỏ an toàn, không phải 1 PR lớn rủi ro.`
          },
          theory: {
            vi: `<h3>Task gợi ý (chọn theo cái công ty cần)</h3>
<ul>
  <li>Sửa validation / sửa bug nhỏ.</li>
  <li>Thêm logging có ngữ cảnh.</li>
  <li>Thêm export CSV; thêm filter/search.</li>
  <li>Thêm field vào repair ticket; thêm status cho quy trình sửa.</li>
  <li>Thêm API tra cứu serial; thêm test cho logic sẵn có.</li>
  <li>Viết script (Python) import dữ liệu từ Excel.</li>
</ul>
<h3>Definition of Done cho MỖI task nhỏ</h3>
<ul>
  <li>Chạy đúng yêu cầu + có test (hoặc cách kiểm chứng rõ ràng).</li>
  <li>Không phá behavior cũ (chạy lại test sẵn có).</li>
  <li>Đi qua quy trình 9 bước; diff đã được bạn đọc kỹ.</li>
  <li>Có note: <em>yêu cầu / cách làm / test / kết quả</em>.</li>
  <li>Commit trên branch riêng, message rõ; sẵn sàng demo cho sếp.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: '[Tự hỏi] Task này đã "Done" chưa?',
              prompt: `Trước khi báo "xong" một task, tự trả lời:
1. Mình đã chạy lại test cũ để chắc không phá gì chưa?
2. Có test/cách kiểm chứng cho phần mới không?
3. Mình đã đọc TỪNG dòng diff chưa, hay merge mù?
4. Nếu sếp hỏi "vì sao làm thế này", mình giải thích được không?
5. Có note lại yêu cầu/cách làm/kết quả để báo cáo chưa?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Nhiều PR nhỏ an toàn > 1 PR lớn rủi ro.',
              'Mỗi task có Definition of Done: chạy đúng + test + không phá cũ + note + branch.',
              'Mỗi task đi qua quy trình 9 bước Claude Code.',
              'Luôn chuẩn bị demo + giải thích "vì sao" cho sếp.'
            ]
          }
        },
        {
          id: 'l-6-3-2',
          type: 'project',
          title: 'Output tuần 5–8 — 2–4 PR/commit nhỏ',
          steps: [
            { id: 's1', title: 'Task #1', description: { vi: 'Chọn 1 task nhỏ (vd sửa validation). Đi đủ 9 bước.' }, deliverable: { vi: '1 PR/commit + note (yêu cầu/cách làm/test/kết quả).' } },
            { id: 's2', title: 'Task #2', description: { vi: 'Thêm logging hoặc export CSV.' }, deliverable: { vi: '1 PR/commit + test + note.' } },
            { id: 's3', title: 'Task #3', description: { vi: 'Thêm filter/search hoặc field/status mới.' }, deliverable: { vi: '1 PR/commit + test.' } },
            { id: 's4', title: 'Task #4 + demo', description: { vi: 'Viết 1 script import dữ liệu (Python) hoặc thêm API nhỏ.' }, deliverable: { vi: 'Script/API chạy được + demo nhỏ cho sếp.' } }
          ]
        }
      ],
      references: [
        { title: 'Conventional Commits', url: 'https://www.conventionalcommits.org/' }
      ]
    },

    // ===================== MODULE 6.4 =====================
    {
      id: 'mod-6-4',
      title: 'Tuần 9–12: Mini Feature + định vị CV',
      prerequisites: { vi: 'Xong Module 6.3 (đã merge vài task nhỏ an toàn). Đã quen quy trình + codebase.' },
      lessons: [
        {
          id: 'l-6-4-1',
          type: 'project',
          title: 'Mini feature có thể demo',
          subtitle: { vi: 'Chọn 1 feature đủ nhỏ để xong trong 4 tuần, đủ thật để demo cho sếp và đưa vào CV.' },
          steps: [
            { id: 's1', title: 'Chọn scope + Plan Mode', description: { vi: 'Chọn 1: repair ticket module / inventory low-stock alert / warranty lookup / quote generator / technician task board / import product from Excel / customer repair history / basic dashboard. Lập kế hoạch + ERD.' }, deliverable: { vi: 'Scope chốt + ERD/schema + kế hoạch đã review.' } },
            { id: 's2', title: 'Implement backend/API (hoặc script)', description: { vi: 'Làm từng phần nhỏ, có logging + error handling.' }, deliverable: { vi: 'Feature chạy được end-to-end.' } },
            { id: 's3', title: 'Test cơ bản', description: { vi: 'Unit/integration test cho phần lõi; test ca lỗi.' }, deliverable: { vi: 'Test xanh; cover happy path + ít nhất 1 ca lỗi.' } },
            { id: 's4', title: 'README + demo + lesson-learned', description: { vi: 'Viết README (chạy thế nào), demo script, và note bài học rút ra.' }, deliverable: { vi: 'README + demo script + 1 file lesson-learned.' } }
          ]
        },
        {
          id: 'l-6-4-2',
          type: 'theory',
          title: 'Định vị CV — đừng để bị đóng khung "hardware intern"',
          subtitle: { vi: 'Cách trình bày để nhà tuyển dụng backend thấy bạn vẫn là dân phần mềm.' },
          theory: {
            vi: `<h3>3 phiên bản title CV</h3>
<ul>
  <li>Backend Java Intern with Python Automation</li>
  <li>Software Intern — PC/Laptop Repair &amp; Inventory Management System</li>
  <li>Backend / Internal Tools Developer Intern (Java + Python)</li>
</ul>

<h3>5 bullet achievements mẫu (sửa số liệu cho khớp thật)</h3>
<ul>
  <li>Thiết kế &amp; xây dựng module phiếu sửa chữa (lifecycle 7 trạng thái) bằng Spring Boot 3 + PostgreSQL + JPA, phân quyền JWT (ADMIN/TECHNICIAN/SALES).</li>
  <li>Viết Python automation import ~N nghìn dòng tồn kho từ Excel → đồng bộ qua REST API, giảm nhập tay thủ công.</li>
  <li>Thiết kế schema nghiệp vụ (customers/inventory/serial/warranty) + Flyway migration; thêm API tra cứu serial &amp; bảo hành.</li>
  <li>Áp dụng quy trình phát triển có kiểm soát với Claude Code (Plan Mode → review diff → test → commit); viết CLAUDE.md cho repo nội bộ.</li>
  <li>Viết unit/integration test (JUnit/Mockito/Testcontainers) + tài liệu Swagger cho các endpoint mới.</li>
</ul>

<h3>3 project portfolio nên có</h3>
<ul>
  <li>Capstone A — Repair &amp; Inventory Backend (Java, full stack doanh nghiệp).</li>
  <li>Capstone B — Automation Toolkit (Python, gọi API Capstone A).</li>
  <li>1 project backend "thuần phần mềm" KHÔNG dính hardware (vd blog API) để chứng minh không lệch domain.</li>
</ul>

<h3>Giải thích internship trong phỏng vấn backend</h3>
"Em thực tập ở công ty phần cứng nhưng làm mảng <strong>phần mềm nội bộ</strong> — xây backend Java quản lý sửa chữa/tồn kho + tool Python automation. Em học được mô hình hoá domain thật, làm việc trên codebase production, và quy trình review code có kỷ luật." → nhấn <strong>backend + domain modeling + production codebase</strong>, KHÔNG nhấn "sửa máy".

<h3>Chứng minh vẫn theo software/backend</h3>
<ul>
  <li>Giữ LeetCode đều (Phase 2) — vé vào công ty lớn.</li>
  <li>Có 1 project backend không-hardware.</li>
  <li>Capstone A dùng full stack chuẩn phỏng vấn (Spring/JWT/Docker/test).</li>
</ul>`
          },
          keyTakeaways: {
            vi: [
              'Title CV nhấn "Backend/Software", không phải "Hardware".',
              'Bullet đo bằng kết quả + công nghệ (Spring/JWT/Python/test), không chung chung.',
              'Có 1 project backend KHÔNG dính hardware để chứng minh không lệch.',
              'Phỏng vấn: kể "phần mềm nội bộ + domain thật + production codebase", giữ LeetCode đều.'
            ]
          }
        }
      ],
      references: [
        { title: 'Testcontainers for Java', url: 'https://java.testcontainers.org/' },
        { title: 'Spring Boot Reference', url: 'https://docs.spring.io/spring-boot/index.html' }
      ]
    }
  ]
}
