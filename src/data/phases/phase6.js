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

    // ===================== MODULE 6.0 =====================
    {
      id: 'mod-6-0',
      title: 'Tuần 0: Hardware Fundamentals cho Software Dev (phần cứng từ số 0)',
      prerequisites: { vi: 'Phần cứng ≈ 0 cũng học được — module này dạy ở mức <strong>software dev cần để làm phần mềm + nói chuyện với kỹ thuật viên</strong>, KHÔNG dạy thiết kế mạch/hàn/firmware. Mục tiêu: hiểu đủ để mô hình hoá dữ liệu (Phase 1.10) và đỡ bỡ ngỡ ở công ty lắp ráp PC.' },
      lessons: [
        {
          id: 'l-6-0-1',
          type: 'theory',
          title: 'Linh kiện PC/laptop & vai trò — và vì sao software dev cần biết',
          subtitle: { vi: 'Biết mỗi cục là gì, làm gì, và nó thành dữ liệu gì trong phần mềm. Không cần biết bên trong nó chạy điện ra sao.' },
          mentalModel: {
            vi: `Hình dung một bộ PC như một <strong>văn phòng</strong>: <strong>CPU</strong> = nhân viên xử lý (làm việc nhanh/chậm), <strong>RAM</strong> = mặt bàn (chỗ để việc đang làm — mất điện là sạch), <strong>SSD/HDD</strong> = tủ hồ sơ (lưu lâu dài), <strong>mainboard</strong> = toà nhà nối mọi phòng, <strong>PSU</strong> (nguồn) = trạm điện, <strong>GPU</strong> (card đồ hoạ) = hoạ sĩ chuyên vẽ (game/AI/đồ hoạ).
<br/><br/>
Là <em>software dev</em> ở công ty lắp ráp, bạn KHÔNG cần biết transistor hay điện áp. Bạn cần biết: mỗi linh kiện <strong>là gì, để làm gì, có thông số chính nào</strong> — vì những thông số đó sẽ thành <strong>cột trong database</strong> và <strong>field trong form nhập kho/báo giá</strong>.`
          },
          theory: {
            vi: `<h3>Từng linh kiện là gì — giải thích thật dễ</h3>
Với mỗi linh kiện, mình nói 3 thứ: <em>nó là gì (ví đời thường) · các con số trên hộp NGHĨA LÀ GÌ · phần mềm lưu lại gì</em>. Đọc chậm, không cần thuộc.

<p><strong>1) CPU — "bộ não" của máy</strong><br/>
Là cục tính toán chính, quyết định máy chạy nhanh hay chậm — ví như <em>người nhân viên</em> làm việc. Các con số hay thấy:</p>
<ul>
  <li><strong>Hãng</strong>: Intel hoặc AMD (2 hãng làm CPU lớn nhất).</li>
  <li><strong>Model / đời</strong>: ví dụ "Intel Core i5-13400". Số đời càng mới thường càng mạnh.</li>
  <li><strong>Số nhân (core)</strong>: số "người" cùng làm việc bên trong CPU. Nhiều nhân = làm nhiều việc một lúc tốt hơn.</li>
  <li><strong>Xung (GHz)</strong>: tốc độ mỗi nhân làm việc. Cao hơn = nhanh hơn (giống nhịp tay làm việc nhanh hơn).</li>
  <li><strong>Socket</strong>: "kiểu chân cắm" của CPU. RẤT quan trọng — CPU chỉ cắm vừa mainboard CÙNG loại socket (như phích điện phải đúng ổ).</li>
</ul>
<p><em>→ Phần mềm lưu: model, socket, số nhân.</em></p>

<p><strong>2) RAM — "mặt bàn làm việc"</strong><br/>
Chỗ để mọi việc CPU đang làm dở. Đặc điểm: <strong>tắt điện là mất sạch</strong> (như dọn bàn cuối ngày). Vì thế nó KHÁC ổ cứng (nơi lưu lâu dài).</p>
<ul>
  <li><strong>Dung lượng (GB)</strong>: bàn rộng cỡ nào. Nhiều GB = mở được nhiều việc cùng lúc không lag.</li>
  <li><strong>Loại DDR4 / DDR5</strong>: "thế hệ" của RAM. DDR5 mới hơn. Quan trọng: DDR4 và DDR5 KHÔNG cắm lẫn nhau được.</li>
  <li><strong>Bus / tốc độ (MHz)</strong>: RAM truyền dữ liệu nhanh cỡ nào.</li>
</ul>
<p><em>→ Phần mềm lưu: capacityGB, type (DDR4/5), speed.</em></p>

<p><strong>3) SSD / HDD — "tủ hồ sơ" lưu lâu dài</strong><br/>
Nơi cất dữ liệu KHÔNG mất khi tắt máy (Windows, file, ảnh...). <strong>SSD nhanh hơn HDD rất nhiều</strong> (SSD như tủ ngay cạnh bàn; HDD như kho ở xa, có đĩa quay).</p>
<ul>
  <li><strong>Dung lượng (GB/TB)</strong>: chứa được bao nhiêu.</li>
  <li><strong>Form factor (kích thước/kiểu)</strong>: "hình dáng" của ổ — loại <em>2.5 inch</em> (như hộp nhỏ) hay <em>M.2</em> (như thanh kẹo cao su cắm thẳng lên main). Quan trọng vì main phải có đúng khe cho nó.</li>
  <li><strong>Chuẩn kết nối (SATA / NVMe)</strong>: "đường truyền". NVMe nhanh hơn SATA nhiều.</li>
</ul>
<p><em>→ Phần mềm lưu: capacityGB, formFactor, interface.</em></p>

<p><strong>4) Mainboard (bo mạch chủ) — "toà nhà" nối mọi thứ</strong><br/>
Tấm bảng lớn để cắm mọi linh kiện vào và cho chúng nói chuyện với nhau.</p>
<ul>
  <li><strong>Socket CPU</strong>: kiểu chân cắm CPU mà main này nhận (phải khớp với socket của CPU).</li>
  <li><strong>Số khe RAM</strong> + loại RAM nó nhận (DDR4 hay DDR5).</li>
  <li><strong>Khe M.2</strong>: để cắm SSD loại M.2.</li>
  <li><strong>Chipset</strong>: "đời" của main, quyết định nó hỗ trợ CPU/tính năng nào.</li>
</ul>
<p><em>→ Phần mềm lưu: socket, ramSlots, chipset.</em></p>

<p><strong>5) PSU (nguồn) — "trạm điện" của máy</strong><br/>
Biến điện ngoài ổ cắm thành điện cho linh kiện. Nếu yếu quá, máy chạy không ổn hoặc không lên.</p>
<ul>
  <li><strong>Công suất (W — watt)</strong>: cấp được bao nhiêu điện. Dàn mạnh (nhất là có GPU) cần nhiều W hơn.</li>
  <li><strong>Chuẩn 80 PLUS</strong>: nhãn chứng nhận nguồn chạy HIỆU QUẢ/tiết kiệm điện cỡ nào (Bronze/Gold/Platinum...). LƯU Ý: đây là về hiệu suất, KHÁC với công suất — đừng nhầm "80 PLUS" với "80W".</li>
</ul>
<p><em>→ Phần mềm lưu: wattage.</em></p>

<p><strong>6) GPU (card đồ hoạ, vd NVIDIA) — "hoạ sĩ" chuyên vẽ</strong><br/>
Lo phần hình ảnh nặng: game, đồ hoạ, và AI. Đây là linh kiện công ty bạn bán/lắp nhiều (hợp tác NVIDIA).</p>
<ul>
  <li><strong>Model</strong>: vd "RTX 5080" (cách đọc tên có ở bài 6.0.4).</li>
  <li><strong>VRAM (GB)</strong>: bộ nhớ RIÊNG của card (khác RAM máy). Cao = chạy đồ hoạ/AI nặng tốt hơn.</li>
  <li><strong>Công suất cần (W)</strong>: card mạnh ăn nhiều điện → phải có PSU đủ khoẻ.</li>
  <li><strong>Kích thước</strong>: card to phải vừa thùng máy (case).</li>
</ul>
<p><em>→ Phần mềm lưu: model, vramGB, powerW.</em></p>

<p><strong>7) Linh kiện khác (gọn)</strong></p>
<ul>
  <li><strong>Màn hình</strong>: kích thước (inch), độ phân giải (càng cao càng nét), tần số quét (Hz — cao thì hình mượt hơn).</li>
  <li><strong>Pin</strong> (laptop): dung lượng (Wh); dùng lâu pin "chai" → giữ điện kém đi.</li>
  <li><strong>Adapter (sạc)</strong>: công suất (W) — phải đủ cho máy.</li>
  <li><strong>Cổng kết nối</strong>: các "lỗ cắm" — USB-A/USB-C, HDMI/DisplayPort (cắm màn hình), jack tai nghe.</li>
</ul>

<h3>The "Why" — vì sao biết mấy thứ này lại quan trọng cho phần mềm</h3>
Khi bạn làm form "nhập sản phẩm mới" hay "tạo phiếu sửa", bạn phải biết <em>linh kiện có những thuộc tính gì</em> để thiết kế field/cột đúng. Không biết "SSD có form factor" → form thiếu field → nhập kho sai → phần mềm vô dụng. Đây là lý do domain knowledge = nền của schema (nối thẳng Phase 1.10 domain model).

<h3>Junior Pitfalls (software dev mới chạm phần cứng)</h3>
<ul>
  <li>Nhầm RAM (tạm, mất điện là sạch) với ổ cứng (lưu lâu dài) — 2 thứ hoàn toàn khác.</li>
  <li>Tưởng "GB nào cũng như nhau": RAM 16GB ≠ SSD 16GB ≠ VRAM 16GB (khác vai trò hoàn toàn).</li>
  <li>Bỏ qua đơn vị: công suất = W, dung lượng = GB, xung = GHz/MHz — nhập sai đơn vị = dữ liệu rác.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: '[Hỏi kỹ thuật viên / tự kiểm] Linh kiện → dữ liệu',
              prompt: `KHÔNG cần đáp án sẵn. Tự trả lời (hoặc hỏi anh kỹ thuật):
1. Một cái laptop khách mang tới sửa — phần mềm cần lưu những thông tin gì để quản lý? (gợi ý: serial, cấu hình, lỗi)
2. Khi nhập 1 lô SSD vào kho, form cần những field nào? (dung lượng, form factor, chuẩn, số lượng, serial?)
3. Card GPU (NVIDIA) khác CPU ở chỗ nào về vai trò? Vì sao công ty mình bán/lắp nhiều GPU?
4. Thông số nào của linh kiện ảnh hưởng "lắp có vừa/chạy được không"? (gợi ý: socket, form factor, công suất)`
            }
          ],
          keyTakeaways: {
            vi: [
              'CPU=xử lý, RAM=bộ nhớ tạm (mất điện là sạch), SSD/HDD=lưu lâu dài, mainboard=nối, PSU=nguồn, GPU=đồ hoạ/AI.',
              'Software dev cần biết linh kiện LÀ GÌ + thông số chính → để thiết kế field/cột database, KHÔNG cần biết điện tử.',
              'Thông số chính: CPU(socket), RAM(DDR4/5), SSD(form factor/NVMe), PSU(W), GPU(VRAM/W).',
              'Domain knowledge = nền của schema (nối Phase 1.10). Không học sâu mạch/hàn/firmware.'
            ]
          }
        },
        {
          id: 'l-6-0-2',
          type: 'theory',
          title: 'Compatibility cơ bản — "lắp có vừa & chạy được không"',
          subtitle: { vi: 'Quy tắc tương thích = chính là validation rules phần mềm có thể kiểm. Học để hiểu + để code form không cho cấu hình sai.' },
          mentalModel: {
            vi: `Lắp PC giống ghép Lego: không phải miếng nào cũng ghép được với miếng nào. <strong>Compatibility</strong> = các quy tắc "cái này có khớp cái kia không". Là dev, mỗi quy tắc tương thích là một <strong>validation rule</strong> bạn có thể đưa vào phần mềm (vd: chọn CPU socket LGA1700 thì chỉ cho chọn mainboard cùng socket).`
          },
          theory: {
            vi: `<h3>Các quy tắc tương thích cốt lõi</h3>
<ul>
  <li><strong>CPU ↔ Mainboard</strong>: phải CÙNG <strong>socket</strong> (vd Intel LGA1700, AMD AM5). Khác socket = không lắp được. (Quy tắc tương thích #1.)</li>
  <li><strong>RAM ↔ Mainboard</strong>: phải đúng <strong>loại</strong> (DDR4 vào khe DDR4, DDR5 vào khe DDR5 — không lẫn được) + không vượt số khe / dung lượng tối đa.</li>
  <li><strong>SSD ↔ Mainboard</strong>: đúng <strong>form factor + khe</strong> (M.2 NVMe cần khe M.2; 2.5" SATA cần cổng SATA).</li>
  <li><strong>PSU ↔ cả hệ</strong>: <strong>công suất (W)</strong> phải đủ cho tổng linh kiện (đặc biệt GPU ngốn điện). Thiếu W = không ổn định/không lên.</li>
  <li><strong>GPU ↔ case + PSU</strong>: GPU phải <strong>vừa kích thước</strong> case + PSU đủ W + đủ đầu cắm nguồn.</li>
</ul>

<h3>The "Why" — biến quy tắc thành phần mềm</h3>
Một tính năng giá trị công ty thật cần: <em>"trình cấu hình PC"</em> — khách/nhân viên chọn linh kiện, phần mềm <strong>chặn cấu hình không tương thích</strong> (CPU khác socket mainboard → báo lỗi; PSU thiếu W → cảnh báo). Mỗi quy tắc ở trên = 1 hàm validate. Đây là chỗ domain phần cứng gặp backend của bạn.

<h3>Junior Pitfalls</h3>
<ul>
  <li>Tưởng "cứ cắm là chạy" — sai socket/loại RAM là không lắp được, không phải chậm.</li>
  <li>Quên PSU: dàn mạnh + nguồn yếu = sập nguồn khi tải nặng (thường gặp khi thêm GPU).</li>
  <li>Hard-code danh sách tương thích thay vì dữ liệu hoá (socket/form factor nên là field, để quy tắc tự suy ra).</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: '[Thiết kế] Trình kiểm tra tương thích',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Để phần mềm biết "CPU này có lắp được mainboard kia không", mỗi entity cần lưu field gì?
2. Quy tắc "PSU đủ công suất" — phần mềm tính thế nào? (tổng W các linh kiện so với W của PSU)
3. Nếu khách chọn GPU NVIDIA mạnh nhưng PSU 350W — phần mềm nên báo gì, ở bước nào?
4. Danh sách tương thích nên hard-code hay suy ra từ thuộc tính (socket/formFactor)? Vì sao cách sau dễ bảo trì hơn?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Compatibility = quy tắc ghép linh kiện = validation rules trong phần mềm.',
              'Cốt lõi: CPU↔mainboard (cùng socket), RAM đúng loại DDR, SSD đúng form factor/khe, PSU đủ W, GPU vừa case + đủ nguồn.',
              'Tính năng "trình cấu hình PC chặn cấu hình sai" = nơi domain phần cứng gặp backend.',
              'Dữ liệu hoá thuộc tính (socket/formFactor/W) thay vì hard-code danh sách tương thích.'
            ]
          }
        },
        {
          id: 'l-6-0-3',
          type: 'theory',
          title: 'BIOS/driver/OS + quy trình test + vòng đời sửa chữa',
          subtitle: { vi: 'Hiểu QUY TRÌNH (lắp xong → cài → test → bảo hành) ở mức nhận biết, để mô hình hoá phần mềm quản lý nó.' },
          mentalModel: {
            vi: `Lắp xong phần cứng mới là một nửa — còn phải <strong>cài phần mềm nền + test + theo dõi bảo hành</strong>. Bạn không cần tự làm thợ, nhưng cần hiểu <em>quy trình</em> để xây phần mềm quản lý nó (phiếu sửa, log chẩn đoán, trạng thái, bảo hành).`
          },
          theory: {
            vi: `<h3>Phần mềm nền (mức nhận biết)</h3>
<ul>
  <li><strong>BIOS/UEFI</strong>: phần mềm nhỏ trong mainboard, chạy TRƯỚC hệ điều hành — nhận diện linh kiện, chọn ổ boot. (Bạn chỉ cần biết nó tồn tại + để làm gì.)</li>
  <li><strong>Driver</strong>: phần mềm để OS "nói chuyện" với linh kiện (driver GPU NVIDIA, driver mạng...). Thiếu driver = thiết bị không chạy đúng.</li>
  <li><strong>Cài Windows/Linux</strong>: cài hệ điều hành lên SSD. <strong>Device Manager</strong> (Windows): xem thiết bị nào nhận/lỗi.</li>
</ul>

<h3>Quy trình test (hiểu để GHI LẠI, không cần tự test sâu)</h3>
Sau khi lắp/sửa, kỹ thuật viên kiểm tra máy có "khoẻ" không. Bạn cần biết họ kiểm GÌ để phần mềm ghi lại kết quả:
<ul>
  <li><strong>RAM</strong>: chạy phần mềm dò lỗi bộ nhớ (vd MemTest) → RAM có lỗi không.</li>
  <li><strong>SSD/ổ cứng</strong>: xem "sức khoẻ" ổ (chỉ số SMART) → ổ sắp hỏng chưa.</li>
  <li><strong>Nhiệt độ</strong>: cho máy chạy nặng, đo CPU/GPU nóng tới đâu → có quá nóng không.</li>
  <li><strong>Pin</strong> (laptop): pin còn giữ được bao nhiêu % so với lúc mới (độ "chai").</li>
  <li><strong>Màn hình</strong>: soi điểm chết (chấm không sáng).</li>
</ul>
<em>→ Mỗi lần test ra 1 kết quả = lưu thành 1 dòng <code>DiagnosticLog</code> trong phần mềm (gắn với phiếu sửa). Bạn KHÔNG cần tự biết test sâu — chỉ cần hiểu để thiết kế chỗ ghi kết quả.</em>

<h3>Vòng đời sửa chữa → trạng thái phần mềm</h3>
Khách mang máy → <strong>nhận</strong> (received) → <strong>chẩn đoán</strong> (diagnosing) → <strong>chờ linh kiện</strong> (waiting_parts) → <strong>sửa</strong> (repairing) → <strong>test</strong> (testing) → <strong>hoàn tất</strong> (completed) → <strong>trả máy</strong> (returned). Kèm: <strong>serial number</strong> (định danh từng máy), <strong>warranty</strong> (còn hạn không), <strong>quote</strong> (báo giá). → Đây CHÍNH là domain model bạn code ở Phase 1.10 + Capstone A.

<h3>Chưa cần học sâu (và khi nào mới cần)</h3>
<ul>
  <li>Thiết kế mạch/hàn/PCB/sửa mainboard → chỉ khi được giao làm kỹ thuật (≠ vai phần mềm).</li>
  <li>Firmware, UART/I2C/SPI, MQTT/IoT → chỉ khi phần mềm phải giao tiếp thiết bị (hỏi giám đốc xác nhận trước).</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: '[Nối domain ↔ phần mềm] Từ quy trình tới schema',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Mỗi bước trong vòng đời sửa chữa (nhận → ... → trả) nên là gì trong phần mềm? (gợi ý: enum trạng thái)
2. Kết quả test RAM/SSD/nhiệt độ nên lưu thế nào để tra lại lịch sử? (gợi ý: DiagnosticLog gắn ticket)
3. Làm sao phần mềm biết một máy còn bảo hành? Cần lưu mốc gì + tính ra sao?
4. Vì sao serial number phải UNIQUE trong database?`
            }
          ],
          keyTakeaways: {
            vi: [
              'BIOS/UEFI/driver/Device Manager: hiểu để làm gì ở mức nhận biết, không cần thành thợ.',
              'Mỗi kết quả test (RAM/SSD/nhiệt/pin/màn hình) = 1 DiagnosticLog trong phần mềm.',
              'Vòng đời sửa chữa (received→...→returned) = enum trạng thái; serial/warranty/quote = entity — chính là Phase 1.10 + Capstone A.',
              'Chưa cần: mạch/hàn/firmware/embedded — chờ bằng chứng công ty thực sự cần.'
            ]
          }
        },
        {
          id: 'l-6-0-4',
          type: 'theory',
          title: 'GPU NVIDIA — đọc tên model & nói chuyện ở công ty (RTX 50-series)',
          subtitle: { vi: 'Khi sếp hỏi "biết RTX 5080 không?" — bạn cần ĐỌC ĐƯỢC tên model + biết spec nào quan trọng, KHÔNG cần thuộc bảng giá.' },
          mentalModel: {
            vi: `Tên GPU nhìn rối nhưng có <strong>quy luật</strong>. Học cái <em>bộ giải mã tên</em> (đúng với mọi đời) thì giá trị hơn thuộc lòng vài model (model + giá thay đổi mỗi năm).
<br/><br/>
Với vai <strong>phần mềm/bán hàng</strong>, bạn cần 3 thứ: (1) <strong>đọc tên</strong> → biết model đó thuộc phân khúc nào; (2) biết <strong>spec nào quan trọng</strong> (VRAM, công suất); (3) biết <strong>tra ở đâu</strong> khi cần số chính xác. KHÔNG cần nhớ từng con số.
<br/><br/>
Và quan trọng: sếp hỏi "biết RTX 5080 không?" thường là <em>thăm dò bạn có theo dõi ngành không</em>, không phải bài thi. Trả lời thật + cho thấy học nhanh là đủ.`
          },
          theory: {
            vi: `<h3>Bộ giải mã tên GeForce RTX (gaming/consumer)</h3>
<code>RTX 50 80</code> → đọc: <strong>RTX</strong> = dòng GeForce có ray-tracing; <strong>"50"</strong> = THẾ HỆ (50-series, đời mới nhất 2025, kiến trúc Blackwell); <strong>"80"</strong> = PHÂN KHÚC trong đời đó.
<ul>
  <li>Phân khúc (cao → thấp): <strong>90</strong> (đầu bảng) &gt; <strong>80</strong> (cao cấp) &gt; <strong>70 Ti</strong> &gt; <strong>70</strong> (tầm trung-cao) &gt; <strong>60</strong> (tầm trung) &gt; <strong>50</strong> (phổ thông).</li>
  <li>Hậu tố <strong>Ti</strong> / <strong>Super</strong> = bản mạnh hơn của cùng số (vd 5070 Ti &gt; 5070).</li>
  <li>Vậy: <strong>RTX 5090</strong> = mạnh nhất 50-series; <strong>RTX 5080</strong> = cao cấp; <strong>RTX 5070</strong> = tầm trung-cao. So đời: RTX 5080 (đời 50) mới hơn RTX 4080 (đời 40).</li>
</ul>

<h3>Spec nào quan trọng (cho phần mềm/tư vấn)</h3>
<ul>
  <li><strong>VRAM (GB)</strong> — bộ nhớ riêng của card. Cao = chạy game nặng/đồ hoạ/AI tốt hơn. (Model đầu bảng có VRAM nhiều nhất.)</li>
  <li><strong>Công suất / TDP (W)</strong> — card mạnh ngốn nhiều điện → ảnh hưởng chọn <strong>PSU</strong> (nối thẳng bài compatibility 6.0.2).</li>
  <li><strong>Đời (generation)</strong> + <strong>model</strong> — là product attribute trong DB/báo giá.</li>
</ul>
<em>⚠️ Số VRAM/W/giá chính xác từng model THAY ĐỔI và có nhiều biến thể — đừng học thuộc, hãy TRA ở <strong>nvidia.com</strong>, PCPartPicker, hoặc catalog công ty khi cần.</em>

<h3>Hai điều dễ nhầm</h3>
<ul>
  <li><strong>GeForce RTX (gaming)</strong> KHÁC 2 dòng khác của NVIDIA: (a) <strong>workstation</strong> — dòng RTX "pro" (vd RTX 6000 Ada, có nhãn RTX nhưng cho thiết kế/render); (b) <strong>data-center/AI</strong> — dòng A/H (vd A100, H100, KHÔNG mang nhãn RTX). Nếu công ty hợp tác NVIDIA cho mảng AI thì có thể chạm 2 dòng này — nhưng đừng đào sâu tới khi được giao.</li>
  <li><strong>Founders Edition</strong> = bản NVIDIA tự làm; còn <strong>ASUS/MSI/Gigabyte/Galax...</strong> = đối tác (AIB) làm bản riêng của cùng chip. Công ty lắp ráp thường nhập từ các hãng này → trong DB cùng "GPU model" nhưng khác "brand/SKU".</li>
</ul>

<h3>Cách trả lời sếp (thật + thông minh)</h3>
"Em biết RTX 5080 là dòng cao cấp trong 50-series mới của NVIDIA; em đọc được phân khúc qua tên model và biết spec quan trọng là VRAM + công suất. Về mặt phần mềm, em sẽ lưu model/VRAM/công suất làm thuộc tính sản phẩm và dùng công suất để kiểm tra PSU. Con số chi tiết em tra catalog/NVIDIA khi cần." → cho thấy hiểu hệ thống + liên hệ phần mềm, không cần thuộc lòng.`
          },
          socraticPrompts: [
            {
              title: '[Tự kiểm] Đọc một model GPU bất kỳ',
              prompt: `Cho 1 model GPU (vd RTX 5070 Ti, RTX 4060, RTX 5090). KHÔNG tra vội — tự trả lời:
1. Nó thuộc THẾ HỆ nào, PHÂN KHÚC nào (đọc qua tên)?
2. Giữa 2 model, cái nào cao cấp hơn — chỉ nhìn tên?
3. Spec nào mình PHẢI tra để tư vấn/nhập kho (VRAM? công suất)?
4. Nếu khách lắp con này, nó ảnh hưởng việc chọn linh kiện nào khác? (gợi ý: PSU, case)
5. Trong database sản phẩm, mình lưu những field gì cho một GPU?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Đọc tên: RTX 50|80 = đời 50-series | phân khúc 80 (cao cấp). 90>80>70Ti>70>60>50; Ti/Super = bản mạnh hơn.',
              'Spec quan trọng cho phần mềm: VRAM (GB) + công suất (W, ảnh hưởng PSU) + đời + model.',
              'Số chính xác thay đổi → TRA nvidia.com/PCPartPicker/catalog, đừng học thuộc.',
              'GeForce (gaming) ≠ dòng pro/AI; Founders Edition ≠ bản ASUS/MSI/... (cùng chip, khác brand/SKU).',
              'Trả lời sếp: đọc được phân khúc + biết spec nào quan trọng + liên hệ phần mềm = đủ, không cần thuộc bảng giá.'
            ]
          }
        }
      ],
      references: [
        { title: 'NVIDIA GeForce RTX (dòng sản phẩm chính thức)', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/' },
        { title: 'PCPartPicker (xem thông số & tương thích linh kiện thực tế)', url: 'https://pcpartpicker.com/' },
        { title: 'NVIDIA GPU specs', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/' },
        { title: 'Microsoft — Device Manager', url: 'https://support.microsoft.com/windows/device-manager' }
      ]
    },

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
          underTheHood: {
            vi: `Một app nội bộ thường có 4 lớp dễ nhận ra:
<ul>
  <li><strong>Entry point</strong>: file/nơi app bắt đầu chạy, giống cửa chính của nhà. Với Java có thể là class có <code>main</code>; với Python có thể là <code>app.py</code>, <code>main.py</code>, hoặc lệnh trong README.</li>
  <li><strong>Controller/route/UI</strong>: nơi nhận thao tác của người dùng, giống quầy tiếp nhận.</li>
  <li><strong>Service/business logic</strong>: nơi quyết định luật nghiệp vụ, ví dụ "serial không được trùng" hoặc "đơn sửa xong mới trả máy".</li>
  <li><strong>Data/config</strong>: nơi đọc/ghi database, Excel, API key, file <code>.env</code>. Đây là vùng phải cực kỳ cẩn thận.</li>
</ul>
Nếu chưa tìm được 4 lớp này, bạn chưa thật sự biết mình đang đứng ở đâu trong codebase.`
          },
          theory: {
            vi: `<h3>Việc cần làm</h3>
<p>Đừng mở repo rồi sửa ngay. Hãy đọc nó như đọc bản đồ của một toà nhà lạ: trước tiên tìm cửa vào, sau đó tìm các phòng chính, cuối cùng đánh dấu phòng nguy hiểm.</p>
<ul>
  <li><code>git clone</code> repo; đọc README; chạy project local; chạy test (nếu có).</li>
  <li>Map folder: đâu là entry point, đâu là layer controller/service/data, config nằm đâu.</li>
  <li>Viết <strong>architecture-map.md</strong>: vẽ sơ bộ luồng request đi qua các tầng.</li>
  <li>Viết <strong>CLAUDE.md</strong> cho repo: stack, cách chạy/test/build, quy ước, vùng nguy hiểm "không được tự sửa".</li>
  <li>Tạo <strong>branch riêng</strong> ngay (không sửa thẳng <code>main</code>); dùng <strong>Plan Mode</strong> trước khi đụng bất cứ gì.</li>
</ul>

<h3>Ví dụ architecture-map.md đủ dễ hiểu</h3>
<pre>App chạy từ: main.py
Người dùng bấm nút nhập kho -> route /inventory/import
Route gọi: InventoryService.importFromExcel()
Service ghi vào: inventory_items + serial_numbers
Config nằm ở: .env
Vùng nguy hiểm: file import dữ liệu thật, bảng tồn kho, bảng đơn hàng</pre>

<p>Chỉ cần 6 dòng như vậy là não bạn đã có "bản đồ". Khi sếp hoặc AI nói "sửa import tồn kho", bạn biết ngay nên đọc file nào và file nào KHÔNG được đụng bừa.</p>

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
          underTheHood: {
            vi: `AI không có trách nhiệm pháp lý với dữ liệu công ty. Nó có thể viết code rất nhanh, nhưng nó không tự biết bảng nào là dữ liệu thật, file nào chứa secret, hay câu lệnh nào sẽ xoá nhầm tồn kho.
<br/><br/>
Vì vậy quy trình 9 bước hoạt động như <strong>đèn giao thông</strong>: trước khi code có đèn vàng là plan, trước khi merge có đèn đỏ là review diff, sau khi xong có biên bản là document. Không phải để chậm lại vô ích, mà để mỗi thay đổi đều có đường lui.`
          },
          theory: {
            vi: `<h3>Quy trình 9 bước cho mỗi thay đổi</h3>
<p>Hãy nhớ công thức cực ngắn: <strong>hiểu yêu cầu → lập kế hoạch → sửa nhỏ → test → đọc diff → ghi lại</strong>. Danh sách 9 bước dưới đây chỉ là phiên bản chi tiết của công thức đó.</p>
<ol>
  <li><strong>Requirement</strong> — viết 2–3 câu yêu cầu rõ ràng. Ví dụ: "Thêm filter tìm phiếu sửa theo serial. Không đụng logic thanh toán."</li>
  <li><strong>Domain question</strong> — hỏi lại nghiệp vụ chỗ chưa chắc: serial có unique không, ticket có được xoá không, trạng thái nào được sửa?</li>
  <li><strong>Plan Mode</strong> — bắt Claude lập kế hoạch TRƯỚC, chưa code. Kế hoạch phải nói rõ file nào sẽ đụng.</li>
  <li><strong>Human review plan</strong> — bạn đọc, sửa, duyệt. Nếu plan đụng file nguy hiểm, dừng lại hỏi sếp.</li>
  <li><strong>Small implementation</strong> — làm 1 miếng nhỏ. Ví dụ chỉ thêm filter, chưa thêm export, chưa đổi schema.</li>
  <li><strong>Test</strong> — chạy test sẵn có + thêm test cho phần mới, hoặc ghi rõ cách kiểm bằng tay nếu repo chưa có test.</li>
  <li><strong>Review diff</strong> — đọc TỪNG dòng AI sinh. Dòng nào không hiểu thì hỏi lại, không merge mù.</li>
  <li><strong>Commit</strong> — branch riêng, message rõ; biết <code>git restore</code>/<code>reset</code> để rollback trên máy mình.</li>
  <li><strong>Document</strong> — ghi "yêu cầu / cách làm / test / kết quả" để mai còn nhớ và báo cáo được.</li>
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

    // ===================== MODULE 6.2b =====================
    {
      id: 'mod-6-2b',
      title: 'Tuần 3 (thực chiến): Python Codebase Survival + An toàn dữ liệu + Báo cáo',
      prerequisites: { vi: 'Xong Module 6.2 (chạy được codebase + CLAUDE.md). Module này là phần THỰC CHIẾN còn thiếu: vì sếp <strong>vibe code bằng Python</strong>, bạn phải đọc/sửa được app Python thật + Git cho thành "cơ bắp" + biết bảo vệ dữ liệu + báo cáo sếp. Đây cũng là nơi kéo 1 task nhỏ THẬT lên sớm (tuần 3, không đợi tuần 5).' },
      lessons: [
        {
          id: 'l-6-2b-1',
          type: 'project',
          title: 'Python Codebase Survival — đọc & sửa app Python (như của sếp) + Git cơ bắp',
          subtitle: { vi: 'Làm trên repo Python giả (tự dựng) HOẶC chính repo của sếp. Mục tiêu: hết sợ đụng code Python + giao được 1 thay đổi nhỏ an toàn.' },
          steps: [
            {
              id: 's1', title: 'Dựng môi trường Python chạy được',
              description: { vi: 'Tạo/clone 1 repo Python (giả lập app nội bộ: đọc Excel/SQLite, vài hàm xử lý repair ticket/inventory). Lập <code>venv</code>, <code>pip install -r requirements.txt</code>, tạo <code>.env</code> từ <code>.env.example</code>.' },
              hints: ['<code>python -m venv .venv</code> rồi activate.', 'Thiếu package → đọc lỗi, cài đúng version trong requirements.', 'KHÔNG có .env.example → hỏi sếp biến môi trường nào cần.'],
              deliverable: { vi: 'App chạy local (hoặc ghi rõ lỗi môi trường + cách xử lý). Ghi lệnh chạy vào <code>local-setup-notes.md</code>.' }
            },
            {
              id: 's2', title: 'Tìm entry point + lần luồng',
              description: { vi: 'File nào khởi động app (main.py/app.py/cli)? Dữ liệu lưu ở đâu (SQLite/PostgreSQL/Excel/Google Sheet)? Hàm nào xử lý nghiệp vụ chính?' },
              deliverable: { vi: 'Ghi 5 dòng: "app làm gì · chạy từ đâu · data ở đâu · 3 hàm quan trọng nhất".' }
            },
            {
              id: 's3', title: 'Đọc stack trace khi lỗi',
              description: { vi: 'Cố tình cho input xấu để app ném lỗi. Đọc stack trace: dòng CUỐI thường là nguyên nhân gốc; lần ngược lên xem lỗi ở hàm nào.' },
              deliverable: { vi: '1 lỗi tự gây + giải thích bằng lời "lỗi gì, ở dòng nào, vì sao".' }
            },
            {
              id: 's4', title: 'Thêm logging có ngữ cảnh (thay print)',
              description: { vi: 'Dùng <code>logging</code> (INFO/ERROR) cho 1 flow quan trọng, kèm dữ liệu ngữ cảnh (id, đường dẫn file) — KHÔNG log secret.' },
              deliverable: { vi: '1 flow có log đọc được; chạy thấy log ra đúng.' }
            },
            {
              id: 's5', title: '⭐ MICRO-TASK tuần 3 (task nhỏ THẬT, lên sớm)',
              description: { vi: 'Chọn 1 việc cực nhỏ, ít rủi ro, làm trên DỮ LIỆU GIẢ: sửa 1 validation đơn giản / thêm export CSV / thêm filter. Đi qua Plan Mode → review diff → commit (Phase 6.2 module 9 bước).' },
              mentalModel: { vi: 'GPT review đúng: đừng đợi tuần 5 mới có commit đầu. Một thay đổi nhỏ an toàn ở tuần 3 xây niềm tin với sếp + cho bạn cảm giác "đã đóng góp thật".' },
              hints: ['Chọn task KHÔNG đụng dữ liệu thật/thanh toán.', 'Bắt buộc: review từng dòng diff AI sinh trước khi commit.'],
              deliverable: { vi: '1 commit nhỏ trên branch riêng + note (yêu cầu/cách làm/test/kết quả). Demo được cho sếp.' }
            },
            {
              id: 's6', title: 'Viết 2 test pytest',
              description: { vi: 'Test 1 hàm parse/validate. Nếu repo CHƯA có test (vibe code hay thiếu) → viết characterization test "chụp" hành vi hiện tại trước (nối Phase 1.10).' },
              hints: ['<code>pip install pytest</code>; file <code>test_*.py</code>; hàm <code>def test_...()</code> + <code>assert</code>.'],
              deliverable: { vi: '<code>pytest</code> xanh với ≥ 2 test.' }
            },
            {
              id: 's7', title: 'Git "cơ bắp" — drill trên repo sandbox',
              description: { vi: 'Tạo 1 repo nháp, luyện đến khi KHÔNG cần tra: tạo branch, commit nhỏ, <code>git diff</code>, revert 1 file (<code>git restore</code>), <code>git stash</code>/<code>pop</code>, <code>reset --soft</code> vs <code>--hard</code>, <code>git revert</code> (khi đã push).' },
              mentalModel: { vi: 'Chỉ "biết" lệnh chưa đủ — phải làm tay nhiều lần để hết sợ đụng code thật. Tự gây tình huống "sửa hỏng" rồi tự cứu.' },
              deliverable: { vi: 'Làm trơn cả 6 thao tác trên repo nháp; tự tin rollback khi sếp/AI sửa hỏng.' }
            }
          ]
        },
        {
          id: 'l-6-2b-2',
          type: 'theory',
          title: 'An toàn dữ liệu + Báo cáo sếp (2 file phải có tuần đầu)',
          subtitle: { vi: 'Công ty có kho/bán hàng/bảo hành — lỗi dữ liệu thật rất đắt. Và sếp bận → bạn phải báo cáo cực rõ.' },
          mentalModel: {
            vi: `Dữ liệu công ty giống <strong>sổ tiền + sổ kho + sổ khách hàng</strong>. Làm mất hoặc sửa sai không giống làm hỏng bài tập ở nhà: nó có thể làm sai tồn kho, sai bảo hành, mất niềm tin của khách.
<br/><br/>
Vì vậy tuần đầu bạn cần 2 chiếc "dây an toàn": <strong>data-safety-checklist.md</strong> để biết chỗ nào không được đụng bừa, và <strong>daily-report-template.md</strong> để sếp thấy bạn làm có kiểm soát.`
          },
          underTheHood: {
            vi: `Có 3 loại dữ liệu cần phân biệt:
<ul>
  <li><strong>Dữ liệu thật</strong>: khách thật, đơn thật, tồn kho thật. Sai là ảnh hưởng công ty.</li>
  <li><strong>Dữ liệu giả/local</strong>: dữ liệu tự tạo để tập và test. Sai thì xoá làm lại được.</li>
  <li><strong>Backup</strong>: bản chụp để khôi phục khi có lỗi. Backup chưa thử restore thì vẫn chưa đủ an toàn.</li>
</ul>
Nguyên tắc cho người mới: <strong>test trên dữ liệu giả trước, backup trước khi đụng dữ liệu thật, và phải có người duyệt</strong>.`
          },
          theory: {
            vi: `<h3>1) <code>data-safety-checklist.md</code> — trả lời TRƯỚC khi đụng dữ liệu</h3>
<p>Checklist này không phải giấy tờ cho đẹp. Nó trả lời câu hỏi: "Nếu em hoặc AI làm sai, có cứu được không?" Nếu câu trả lời là "không biết", bạn chưa được chạy script trên dữ liệu thật.</p>
<ul>
  <li>Dữ liệu THẬT nằm ở đâu (DB nào / Excel / Google Sheet)?</li>
  <li>Có <strong>backup</strong> không? Ai backup? Khôi phục được không?</li>
  <li>Có bản <strong>staging / DB local / dữ liệu giả</strong> để test không? (KHÔNG test trên data thật.)</li>
  <li>File <code>.env</code> nào KHÔNG được commit? Có <code>.env.example</code> chưa?</li>
  <li>Bảng/file nào <strong>TUYỆT ĐỐI không sửa/xoá</strong> (đơn hàng, khách, tồn kho, thanh toán)?</li>
  <li>Ai phải <strong>duyệt</strong> trước khi chạy script import/export lên dữ liệu thật?</li>
</ul>

<h3>2) <code>daily-report-template.md</code> — báo cáo sếp mỗi ngày/cuối tuần</h3>
Sếp bận + tự code phần mềm → bạn báo cáo càng rõ càng được tin. 5 dòng:
<ul>
  <li><strong>Hôm nay em đã hiểu/làm gì?</strong></li>
  <li><strong>Em test bằng cách nào?</strong> (đã chắc chưa phá gì cũ?)</li>
  <li><strong>Em đang kẹt ở đâu?</strong> (cần anh giúp/quyết gì?)</li>
  <li><strong>Rủi ro nếu sửa tiếp là gì?</strong></li>
  <li><strong>Ngày mai em định làm gì?</strong></li>
</ul>

<h3>Ví dụ báo cáo 5 dòng</h3>
<pre>Hôm nay: Em chạy được app local và map được luồng import tồn kho.
Test: Em dùng file Excel giả 5 dòng, chưa đụng dữ liệu thật.
Kẹt: Chưa rõ cột serial có bắt buộc unique không.
Rủi ro: Nếu import sai có thể làm lệch tồn kho, nên em chưa chạy trên file thật.
Ngày mai: Em hỏi anh quy tắc serial rồi viết test import trên data giả.</pre>

<h3>3) Checklist review diff (khi bạn còn là SV, đọc diff Python phức tạp)</h3>
<ul>
  <li>Thay đổi này ĐỘNG tới file/hàm nào? Có ngoài phạm vi mong đợi không?</li>
  <li>Input/output của hàm đổi có đúng không? Có ca null/rỗng/âm chưa xử lý?</li>
  <li>Có vô tình xoá/sửa logic cũ không (đọc cả phần bị xoá)?</li>
  <li>Có log secret / hardcode key / câu lệnh nguy hiểm (drop/delete) không?</li>
  <li>Nếu hỏng, rollback thế nào? (đã commit mốc sạch trước chưa?)</li>
</ul>

<h3>4) Cạm bẫy dữ liệu Excel (gặp NGAY khi import kho — rất hay vấp)</h3>
File Excel của nhà cung cấp/công ty hay làm hỏng dữ liệu một cách ÂM THẦM. Phải biết để xử lý:
<ul>
  <li><strong>Serial dài bị đổi thành "số khoa học"</strong>: vd <code>123456789012</code> hiện thành <code>1.23E+11</code> → lưu sai. Đọc cột serial dạng <strong>chuỗi (str)</strong>, đừng để pandas tự đoán: <code>pd.read_excel(f, dtype={"serial": str})</code>.</li>
  <li><strong>Mất số 0 đầu</strong>: mã <code>00123</code> bị cắt thành <code>123</code>. Cũng đọc dạng chuỗi.</li>
  <li><strong>Lỗi dấu tiếng Việt (encoding)</strong>: CSV xuất từ Excel có thể là UTF-8-BOM/Windows-1258 → đọc bị "Ä‘á»". Thử <code>encoding="utf-8-sig"</code>; vẫn lỗi thì hỏi nguồn file dùng encoding gì.</li>
  <li><strong>Khoảng trắng thừa</strong>: <code>" SSD1TB "</code> → <code>.strip()</code> trước khi so/lưu.</li>
</ul>
Quy tắc: <strong>làm sạch + validate</strong> dữ liệu Excel TRƯỚC khi đẩy vào DB; dòng nào lỗi thì gom lại báo cáo, đừng để hỏng cả lô.`
          },
          socraticPrompts: [
            {
              title: '[Hỏi sếp tuần đầu] An toàn dữ liệu',
              prompt: `Copy đi hỏi sếp/senior (đừng đoán):
1. Dữ liệu thật của phần mềm đang nằm ở đâu, và có backup không?
2. Em có môi trường staging / dữ liệu giả để test không, hay chỉ có data thật?
3. Bảng/dữ liệu nào em TUYỆT ĐỐI không được sửa/xoá?
4. Trước khi chạy script đụng dữ liệu thật, em cần ai duyệt?
5. Nếu em (hoặc AI) lỡ làm hỏng dữ liệu, quy trình khôi phục là gì?`
            }
          ],
          keyTakeaways: {
            vi: [
              'Trước khi đụng dữ liệu: trả lời data-safety-checklist (data thật ở đâu, backup, staging, .env, bảng cấm, ai duyệt).',
              'Báo cáo sếp 5 dòng/ngày: hiểu-làm gì · test sao · kẹt đâu · rủi ro · mai làm gì.',
              'Review diff có checklist: phạm vi · input/output · logic bị xoá · secret/lệnh nguy hiểm · cách rollback.',
              'Repo không có test (vibe code hay thiếu) → viết characterization test TRƯỚC khi sửa.',
              'KHÔNG test trên dữ liệu thật — luôn có data giả/staging.'
            ]
          }
        },
        {
          id: 'l-6-2b-3',
          type: 'project',
          title: '3 drill thực chiến: Python app map · Backup-Restore · Ticket→PR→Merge',
          subtitle: { vi: 'Biến checklist thành KỸ NĂNG TAY. Làm trên repo/dữ liệu GIẢ trước khi đụng đồ thật của công ty.' },
          steps: [
            {
              id: 's1', title: 'Drill A — Python "app map" (nếu code sếp là WEB/GUI, không chỉ script)',
              description: { vi: 'Lấy/dựng 1 repo Python theo đúng kiểu của sếp: Flask / FastAPI / Streamlit / Tkinter. Code web/GUI có thêm "tầng route/màn hình" mà script thuần không có — phải map riêng.' },
              mentalModel: { vi: 'Script Excel/SQLite: lần thẳng hàm. Web/GUI: phải lần <em>route/màn hình → hàm xử lý → dữ liệu</em>. Vd Flask/FastAPI: tìm các <code>@app.route</code>/<code>@app.get</code>; Streamlit/Tkinter: tìm phần dựng UI + callback nút bấm.' },
              hints: ['FastAPI/Flask: grep <code>@app.</code> hoặc <code>@router.</code> để liệt kê endpoint.', 'Streamlit: tìm <code>st.</code>; Tkinter: tìm <code>command=</code> của button.'],
              deliverable: { vi: 'File <code>python-app-map.md</code>: app chạy từ file nào · route/màn hình nào gọi hàm nào · data đọc/ghi ở đâu · config/env ở đâu · chỗ KHÔNG được sửa · cách chạy test · cách rollback.' }
            },
            {
              id: 's2', title: 'Drill B — Backup → (cố tình) hỏng → Restore → Verify',
              description: { vi: 'Tạo dữ liệu giả mô phỏng customers/inventory/serial/repair_tickets. Tập đường lùi THẬT trước khi công ty cho chạy import Excel lên dữ liệu thật.' },
              mentalModel: { vi: 'Với công ty kho/bán hàng/bảo hành, "hỏi có backup không" CHƯA đủ — bạn phải tự làm được backup→restore. Khi lỡ tay (hoặc AI lỡ tay), bạn cần biết chính xác cách khôi phục.' },
              hints: ['SQLite: copy file .db; Postgres: <code>pg_dump</code> / <code>pg_restore</code>; Excel: copy file.', 'Sau restore, chạy query/COUNT để xác nhận số dòng + vài bản ghi khớp.'],
              deliverable: { vi: 'File <code>data-restore-runbook.md</code>: lệnh backup · cách restore · query/checklist xác nhận dữ liệu quay lại đúng. Đã chạy thử end-to-end trên data giả.' }
            },
            {
              id: 's3', title: 'Drill C — Workflow team: Ticket → Branch → PR → Review → Merge',
              description: { vi: 'Trên repo giả, làm 3 ticket nhỏ: (1) sửa validation, (2) thêm export CSV, (3) thêm logging + 1 pytest. Mỗi ticket đi đủ vòng đời như công ty dùng GitHub/GitLab.' },
              mentalModel: { vi: 'Module 6.2 mạnh ở Git rollback CÁ NHÂN; cái này là workflow NHÓM: issue → branch → commit → mở PR (mô tả: requirement/test/risk) → tự review diff → resolve comment → squash & merge. Khái niệm chi tiết xem Phase 5 (Team Skills).' },
              hints: ['1 ticket = 1 branch = 1 PR (PR nhỏ < 400 dòng).', 'PR description: yêu cầu · cách test · rủi ro · ảnh/log kết quả.', 'Tập cả squash merge + viết 1 dòng release note.'],
              deliverable: { vi: '3 PR (trên repo giả/GitHub cá nhân) có branch riêng + mô tả đầy đủ + tự review diff trước khi merge. Cross-link: Phase 5 mod-5-0 (Git/PR/code review).' }
            }
          ],
          stretchGoals: { vi: ['Tự gây 1 merge conflict rồi resolve (Phase 5 có scenario).', 'Thêm GitHub Actions CI chạy pytest cho repo giả (Phase 3.7 có mẫu).'] }
        }
      ],
      references: [
        { title: 'FastAPI', url: 'https://fastapi.tiangolo.com/' },
        { title: 'Flask', url: 'https://flask.palletsprojects.com/' },
        { title: 'PostgreSQL — pg_dump / pg_restore (backup)', url: 'https://www.postgresql.org/docs/16/backup-dump.html' },
        { title: 'GitHub Flow (PR workflow)', url: 'https://docs.github.com/en/get-started/using-github/github-flow' },
        { title: 'Python venv (môi trường ảo)', url: 'https://docs.python.org/3/library/venv.html' },
        { title: 'pytest — Getting Started', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
        { title: 'Python logging HOWTO', url: 'https://docs.python.org/3/howto/logging.html' },
        { title: 'Pro Git — Undoing Things', url: 'https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things' }
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
            vi: `Intern giỏi không chờ task "to và oách". Họ <strong>giao giá trị nhỏ nhưng THẬT</strong>, đều đặn, không làm hỏng cái đang chạy. Niềm tin xây bằng nhiều PR nhỏ an toàn, không phải 1 PR lớn rủi ro.
<br/><br/>
Hình dung bạn đang phụ sửa một cửa hàng đang mở cửa. Việc tốt đầu tiên không phải xây lại cả cửa hàng, mà là sửa cái kệ lệch, dán nhãn rõ hơn, hoặc làm bảng kiểm hàng dễ đọc hơn. Trong phần mềm cũng vậy: task nhỏ nhưng làm đúng sẽ giúp mọi người tin bạn.`
          },
          underTheHood: {
            vi: `<strong>Definition of Done</strong> nghĩa là "xong thật", không phải "em thấy chạy trên máy em". Một task chỉ xong khi có đủ 4 bằng chứng:
<ul>
  <li><strong>Đúng yêu cầu</strong>: người cần dùng xác nhận hoặc bạn có checklist so lại.</li>
  <li><strong>Đã kiểm tra</strong>: có test tự động hoặc các bước test tay rõ ràng.</li>
  <li><strong>Không phá cũ</strong>: chạy lại test/flow cũ liên quan.</li>
  <li><strong>Có thể giải thích</strong>: bạn đọc được diff và nói được vì sao sửa như vậy.</li>
</ul>`
          },
          theory: {
            vi: `<h3>Task gợi ý (chọn theo cái công ty cần)</h3>
<p>Task nhỏ tốt là task có phạm vi hẹp, nhìn thấy giá trị, và nếu sai thì rollback được. Đừng chọn "viết lại toàn bộ app". Hãy chọn thứ giống một viên gạch nhỏ.</p>
<ul>
  <li><strong>Sửa validation</strong>: ví dụ không cho lưu serial rỗng, không cho số lượng âm.</li>
  <li><strong>Sửa bug nhỏ</strong>: ví dụ tìm kiếm phân biệt hoa/thường làm nhân viên không tìm được khách.</li>
  <li><strong>Thêm logging có ngữ cảnh</strong>: log ticketId/fileName để lỗi xảy ra còn lần lại được.</li>
  <li><strong>Thêm export CSV hoặc filter/search</strong>: giúp nhân viên lấy báo cáo nhanh hơn.</li>
  <li><strong>Thêm field/status vào repair ticket</strong>: ví dụ thêm trạng thái <code>waiting_parts</code> nếu quy trình thật cần.</li>
  <li><strong>Thêm API tra cứu serial</strong>: nhập serial → trả về máy nào, bảo hành còn không.</li>
  <li><strong>Viết script Python import dữ liệu từ Excel</strong>: chỉ làm sau khi đã có data giả + backup + người duyệt.</li>
</ul>
<h3>Definition of Done cho MỖI task nhỏ</h3>
<ul>
  <li>Chạy đúng yêu cầu + có test (hoặc cách kiểm chứng rõ ràng).</li>
  <li>Không phá behavior cũ (chạy lại test sẵn có).</li>
  <li>Đi qua quy trình 9 bước; diff đã được bạn đọc kỹ.</li>
  <li>Có note: <em>yêu cầu / cách làm / test / kết quả</em>.</li>
  <li>Commit trên branch riêng, message rõ; sẵn sàng demo cho sếp.</li>
</ul>

<h3>Ví dụ "Done" vs "chưa Done"</h3>
<ul>
  <li><strong>Chưa Done</strong>: "Em thêm export CSV rồi, máy em bấm thấy tải file."</li>
  <li><strong>Done</strong>: "Em thêm export CSV cho danh sách tồn kho; đã test 3 dòng, 0 dòng, tên sản phẩm có dấu tiếng Việt; không đụng dữ liệu thật; diff chỉ thay 2 file; có note cách test."</li>
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
          mentalModel: {
            vi: `CV không chỉ kể "em từng ở đâu"; CV kể <strong>em đã tạo giá trị phần mềm gì</strong>. Cùng một kỳ thực tập, nếu viết "hardware intern" thì nhà tuyển dụng backend có thể nghĩ bạn đi sửa máy. Nếu viết "software intern làm internal tools cho quy trình sửa chữa/tồn kho" thì họ thấy bạn làm phần mềm thật.
<br/><br/>
Nói đơn giản: công ty là bối cảnh, còn kỹ năng bạn bán cho nhà tuyển dụng là <strong>backend, data, automation, testing, domain modeling</strong>.`
          },
          underTheHood: {
            vi: `Một bullet CV mạnh thường có 3 mảnh:
<ol>
  <li><strong>Hành động</strong>: thiết kế, xây dựng, viết script, thêm test, tối ưu.</li>
  <li><strong>Đối tượng thật</strong>: phiếu sửa, tồn kho, serial, bảo hành, import Excel.</li>
  <li><strong>Công nghệ/kết quả</strong>: Spring Boot, PostgreSQL, Python, REST API, test, giảm nhập tay, giảm lỗi.</li>
</ol>
Nếu thiếu đối tượng thật, bullet nghe như bài tập. Nếu thiếu công nghệ/kết quả, bullet nghe chung chung.`
          },
          theory: {
            vi: `<h3>Cách nghĩ trước khi viết CV</h3>
<p>Đừng giấu internship phần cứng, nhưng cũng đừng để nó nuốt mất vai trò phần mềm của bạn. Câu chuyện đúng là: "Em làm phần mềm nội bộ cho một domain phần cứng thật". Domain phần cứng giúp CV có màu thực tế; backend/internal tools mới là trục chính.</p>

<h3>3 phiên bản title CV</h3>
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
