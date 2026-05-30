// Module 0.4 — Console Mini-Apps (Cybersoft-style integration practice)
// Mục đích: GHÉP TẤT CẢ syntax đã học vào 2 app hoàn chỉnh. KHÔNG paste AI.
export default {
  id: 'mod-0-4',
  title: 'Console Mini-Apps — Number Guessing & Mini Bank (Tổng hợp Phase 0)',
  lessons: [
    {
      id: 'l-0-4-1',
      type: 'project',
      title: 'Number Guessing Game — App tổng hợp đầu tiên',
      subtitle: { vi: 'Lesson 16/18. Đây là lần đầu bạn viết một CHƯƠNG TRÌNH hoàn chỉnh chứ không phải snippet. Mục tiêu: tự gõ sạch từ <code>main</code> đến <code>sc.close()</code>, KHÔNG paste, KHÔNG copy mẫu.' },
      mentalModel: {
        vi: `Game logic rất đơn giản, nhưng đây là chỗ bạn phải <strong>tự thiết kế flow</strong>:
<ul>
  <li>Computer chọn số bí mật ngẫu nhiên (1..100).</li>
  <li>User nhập số, chương trình phản hồi "thấp quá" / "cao quá" / "trúng rồi!".</li>
  <li>Đếm số lượt đoán. Cho phép replay.</li>
</ul>
Cái khó KHÔNG phải syntax — mà là <strong>chia bài toán thành các bước nhỏ, mỗi bước map sang 1 method</strong>. Nếu bạn viết hết vào <code>main</code> 60 dòng → chứng tỏ chưa biết tách method.`
      },
      underTheHood: {
        vi: `<h3>Skill cần luyện ở bài này</h3>
<ul>
  <li><strong>Random</strong>: <code>new Random().nextInt(100) + 1</code> sinh int 1..100. Hiểu vì sao <code>+1</code> (<code>nextInt(100)</code> trả 0..99).</li>
  <li><strong>Loop điều kiện</strong>: while user chưa đoán đúng → tiếp tục. KHÔNG biết trước số lần loop → <code>while</code>, không phải <code>for</code>.</li>
  <li><strong>Method tách logic</strong>: <code>playOneRound()</code>, <code>askReplay()</code>, <code>readGuess()</code>. Main chỉ điều phối.</li>
  <li><strong>Input validation</strong>: user nhập "abc" thay vì số → <code>InputMismatchException</code>. Handle bằng <code>sc.hasNextInt()</code> trước khi gọi <code>nextInt()</code>.</li>
  <li><strong>do-while</strong>: replay loop chạy ÍT NHẤT 1 lần (game phải chơi 1 lần đã).</li>
</ul>

<h3>Anti-pattern cần tránh</h3>
<ul>
  <li>❌ Viết tất cả 60 dòng vào <code>main</code>. → Tách method ra ngay khi <code>main</code> &gt; 15 dòng.</li>
  <li>❌ Tạo <code>new Scanner</code> trong loop → leak resource. Một Scanner cho cả app.</li>
  <li>❌ Tạo <code>new Random</code> mới mỗi lần guess → vô nghĩa và chậm.</li>
  <li>❌ Hard-code "y" làm replay flag mà không trim/toLowerCase → user gõ "Y " (có space) là bug.</li>
</ul>`
      },
      steps: [
        {
          id: 'step-0-4-1-1',
          title: 'Step 1 — Vẽ flow trên giấy TRƯỚC khi gõ code',
          description: 'Lấy giấy. Vẽ flowchart: start → sinh số → loop nhập guess → so sánh → kết thúc → replay? Mỗi ô là 1 method tương lai.',
          deliverable: 'Flowchart trên giấy (chụp ảnh upload nếu muốn track tiến độ). KHÔNG MỞ IDE TRƯỚC KHI VẼ XONG.'
        },
        {
          id: 'step-0-4-1-2',
          title: 'Step 2 — Tách thành 3 method',
          description: 'Tạo skeleton: <code>main()</code>, <code>playOneRound(Scanner, Random)</code>, <code>askReplay(Scanner)</code>. Chưa cần code thân — chỉ signature + comment "// TODO".',
          deliverable: 'File .java compile được dù chưa làm gì. Mỗi method có 1 dòng comment mô tả input/output.'
        },
        {
          id: 'step-0-4-1-3',
          title: 'Step 3 — Code <code>playOneRound</code> trước (hardest part)',
          description: 'Sinh số bí mật, loop đọc guess, so sánh, đếm lượt, in kết quả khi trúng. Validate input bằng <code>hasNextInt()</code>.',
          deliverable: 'playOneRound chạy độc lập đúng. Test với guess đầu = đáp án (must work với 1 lượt).',
          socraticPrompts: [
            'Khi user nhập "abc", Scanner sẽ throw exception hay trả false từ hasNextInt? Test thử.',
            'Bạn dùng while hay do-while cho loop guess? Vì sao?',
            'Đáp án nằm trong [1, 100]. Nếu user nhập 999 thì sao? Có nên reject?'
          ],
          hints: [
            'Loop guess: <code>while (guess != target) { ... }</code>. Khi == thì break tự nhiên.',
            'Validate: <code>if (!sc.hasNextInt()) { sc.next(); System.out.println("Phải nhập số"); continue; }</code>'
          ]
        },
        {
          id: 'step-0-4-1-4',
          title: 'Step 4 — askReplay + main loop',
          description: 'Sau mỗi round, hỏi "Chơi tiếp? (y/n)". Trả về boolean. Main dùng do-while quanh playOneRound.',
          deliverable: 'App chạy nhiều round liên tiếp. Sau khi user gõ "n" thì in "Cám ơn!" và đóng Scanner.',
          hints: [
            'Đọc String: <code>sc.next().trim().toLowerCase()</code>. So sánh: <code>"y".equals(answer)</code>.',
            'do-while: <code>do { playOneRound(...); } while (askReplay(sc));</code>.'
          ]
        }
      ],
      socraticPrompts: [
        {
          title: 'Tự kiểm tra hiểu bài',
          prompt: `Sau khi code xong, KHÔNG nhìn code đã viết — trả lời các câu sau bằng giọng nói (recording càng tốt):
1. Vì sao <code>Random</code> instance được pass vào <code>playOneRound</code> thay vì tạo mới trong đó?
2. <code>hasNextInt()</code> trả false → tại sao phải <code>sc.next()</code> để discard token sai?
3. Nếu đổi thành "đoán số 1..1000" thay vì 1..100, dòng nào cần đổi? (Chỉ 1 dòng — đó là dấu hiệu code đã modular tốt.)
4. App của bạn có dùng <code>System.exit(0)</code> ở cuối không? Nên hay không nên? Tại sao?`
        }
      ],
      stretchGoals: [
        'Thêm difficulty: "easy" (1..10, 5 lượt), "medium" (1..100, 7 lượt), "hard" (1..1000, 10 lượt).',
        'Lưu high-score (số lượt thấp nhất) vào file <code>scores.txt</code> bằng <code>FileWriter</code>.',
        'In progress bar mỗi guess: <code>██░░░░ 2/7 lượt</code>.'
      ],
      keyTakeaways: {
        vi: [
          'Vẽ flow TRƯỚC khi code. Main chỉ điều phối, không chứa logic.',
          'Method ≤ 15 dòng. Quá đó là dấu hiệu cần tách.',
          'Một Scanner cho cả app. Đóng ở cuối <code>main</code>.',
          'Input validation là thói quen, không phải optional.'
        ]
      }
    },

    {
      id: 'l-0-4-2',
      type: 'project',
      title: 'Mini Bank Console — OOP-lite (preview Phase 1)',
      subtitle: { vi: 'Lesson 17/18. App này CHƯA cần đầy đủ OOP — mục tiêu là quen với "object có state + thao tác trên state". Phase 1 sẽ làm version OOP chuẩn.' },
      mentalModel: {
        vi: `App giả lập 1 tài khoản ngân hàng:
<ul>
  <li>State: <code>balance</code> (long, đơn vị VND).</li>
  <li>Menu: 1) Nạp tiền · 2) Rút tiền · 3) Xem số dư · 4) Lịch sử giao dịch · 0) Thoát.</li>
  <li>Lịch sử lưu trong <code>ArrayList&lt;String&gt;</code>.</li>
</ul>
Đây là chỗ bạn lần đầu cảm thấy "ArrayList tiện thật". Sau Phase 1 bạn sẽ refactor thành class <code>Account</code> với private balance + method <code>deposit()</code>/<code>withdraw()</code>.`
      },
      underTheHood: {
        vi: `<h3>Vì sao bài này quan trọng</h3>
<ul>
  <li><strong>State persistence trong 1 lần chạy</strong>: balance giữ giá trị giữa các vòng menu. Đây là khái niệm <em>application state</em> — sau này mở rộng thành DB.</li>
  <li><strong>Tách concern</strong>: <code>printMenu()</code>, <code>deposit()</code>, <code>withdraw()</code>, <code>printHistory()</code> — chuẩn bị tinh thần cho OOP.</li>
  <li><strong>Validation là LUẬT</strong>: rút quá số dư → reject. Nạp số âm → reject. KHÔNG được crash, phải in error rõ ràng.</li>
  <li><strong>Format tiền</strong>: <code>String.format("%,d VND", balance)</code> in "1,000,000 VND" — UX tối thiểu.</li>
</ul>

<h3>Anti-pattern</h3>
<ul>
  <li>❌ Dùng <code>double</code> hoặc <code>float</code> cho tiền. → DÙNG <code>long</code> (cents/đồng).</li>
  <li>❌ Cho phép balance âm sau rút. → Validate TRƯỚC khi trừ.</li>
  <li>❌ Lưu history dưới dạng <code>String[]</code> fixed-size. → Dùng <code>ArrayList</code>.</li>
  <li>❌ Validate kiểu <code>if (amount &lt; 0) System.exit(1)</code>. → Print error + tiếp tục menu.</li>
</ul>`
      },
      steps: [
        {
          id: 'step-0-4-2-1',
          title: 'Step 1 — Skeleton + menu loop',
          description: 'Tạo file <code>MiniBank.java</code>. Trong main: while-true loop, in menu, đọc choice, switch theo choice. Chưa cần implement chi tiết.',
          deliverable: 'Menu hiện ra, gõ 0 → thoát. Các choice khác in "TODO" rồi vòng lại menu.',
          hints: [
            'Loop infinite: <code>while (true) { ... }</code>. Choice 0 → <code>break</code>.',
            'Switch trên int choice — switch expression Java 14+ cho clean hơn.'
          ]
        },
        {
          id: 'step-0-4-2-2',
          title: 'Step 2 — deposit + withdraw với validation',
          description: 'Mỗi function nhận Scanner + long currentBalance, return long newBalance. Validate: nạp &gt; 0, rút &gt; 0 và ≤ balance. Lưu giao dịch vào history list.',
          deliverable: 'Nạp 100000 → balance = 100000. Rút 50000 → balance = 50000. Rút 999999999 → in error, balance không đổi.',
          socraticPrompts: [
            'Vì sao method return <code>long</code> thay vì sửa balance trực tiếp? (Vì biến local trong main là pass-by-value — đây là warm-up cho hiểu pass-by-reference sau này.)',
            'Khi validate fail, return giá trị gì? Có nên throw exception?'
          ],
          hints: [
            '<code>if (amount &lt;= 0) { System.out.println("Số tiền phải dương"); return balance; }</code> — giữ nguyên balance.',
            'History format: <code>history.add(String.format("[%s] Nạp %,d VND", timestamp, amount));</code>'
          ]
        },
        {
          id: 'step-0-4-2-3',
          title: 'Step 3 — In số dư + lịch sử (format đẹp)',
          description: 'Print balance: <code>"Số dư: 1,234,567 VND"</code>. Print history: mỗi entry 1 dòng, có thứ tự chronological.',
          deliverable: 'Sau 3 giao dịch, choice "4" in 3 dòng lịch sử rõ ràng có index.',
          hints: [
            '<code>System.out.printf("Số dư: %,d VND%n", balance);</code> — <code>%,d</code> thêm dấu phẩy nghìn.',
            'Loop history: <code>for (int i = 0; i &lt; history.size(); i++) System.out.println((i+1) + ". " + history.get(i));</code>'
          ]
        },
        {
          id: 'step-0-4-2-4',
          title: 'Step 4 — Self-review checklist',
          description: 'Đọc lại code của mình. Đánh dấu chéo từng pitfall trong "Anti-pattern" ở trên. Nếu phạm 1 cái → refactor.',
          deliverable: 'Code không phạm pitfall nào. Method nào &gt; 15 dòng → tách tiếp.'
        }
      ],
      socraticPrompts: [
        {
          title: 'Chuẩn bị tinh thần cho Phase 1',
          prompt: `App này có vấn đề: balance là biến local trong main, phải pass qua mọi method. Phase 1 sẽ giải bằng OOP. Hỏi tôi:
1. Nếu có 2 tài khoản A, B — code hiện tại scale ra sao? (Hint: 2 biến long → 3 → 100? Phải dùng cấu trúc nào?)
2. Method <code>deposit</code> cần balance, history, amount — 3 tham số. Có cách nào "đóng gói" chúng lại? (Hint: class.)
3. Khi nào bạn muốn ngăn caller modify balance trực tiếp? (Đây là encapsulation — sẽ học ở l-1-1-1.)
KHÔNG cho code OOP. Chỉ gợi mở.`
        }
      ],
      stretchGoals: [
        'Multiple accounts: <code>Map&lt;String, Long&gt; accounts</code> với key là tên chủ tài khoản.',
        'Transfer giữa 2 tài khoản (deposit của A + withdraw của B, atomic).',
        'Lưu balance + history vào file khi thoát, load lại khi mở lại app (preview Phase 3 persistence).'
      ],
      keyTakeaways: {
        vi: [
          'Tiền tệ DÙNG <code>long</code>, KHÔNG <code>double</code>.',
          'Validate INPUT trước mọi state mutation. Reject sai → print error, không crash.',
          'ArrayList tốt hơn array khi không biết size trước.',
          'Bạn đã chạm vào limit của procedural code — Phase 1 OOP là giải pháp.'
        ]
      }
    },

    {
      id: 'l-0-4-3',
      type: 'theory',
      title: 'Phase 0 Retrospective — Tự đánh giá trước khi sang Phase 1',
      subtitle: { vi: 'Lesson 18/18. Không phải lesson kỹ thuật — là <strong>check-in với chính mình</strong>. Trả lời thật. Nếu fail nhiều → quay lại Phase 0, không sang Phase 1.' },
      mentalModel: {
        vi: `Mục tiêu Phase 0 không phải là <em>"học xong syntax"</em> — mà là <strong>fingers nhớ syntax mà brain không cần nghĩ</strong>. Đây là phép kiểm tra cuối cùng.`
      },
      theory: {
        vi: `<h3>Self-assessment — Trả lời "có / không" cho 10 câu</h3>
<ol>
  <li>Tôi gõ được <code>for (int i = 0; i &lt; n; i++)</code> KHÔNG cần nhìn bàn phím trong &lt; 3 giây.</li>
  <li>Tôi gõ được skeleton <code>public class X { public static void main(String[] args) { } }</code> trong &lt; 10 giây.</li>
  <li>Tôi biết khi nào dùng <code>int</code> vs <code>long</code> mà không tra Google.</li>
  <li>Tôi giải thích được bằng tiếng Việt: vì sao <code>"abc" == "abc"</code> có thể trả true nhưng KHÔNG nên rely vào điều đó.</li>
  <li>Tôi viết được method có recursion (factorial / fib) mà không cần nhìn mẫu.</li>
  <li>Tôi giải được ≥ 18/25 LeetCode Easy trong Phase 0 mà KHÔNG nhìn solution lần đầu.</li>
  <li>Tôi biết khi nào dùng <code>ArrayList</code> vs <code>HashMap</code> vs <code>HashSet</code> mà không phải đoán.</li>
  <li>Tôi viết được Number Guessing + Mini Bank trong tổng &lt; 90 phút, KHÔNG paste AI.</li>
  <li>Khi gặp <code>NullPointerException</code>, tôi biết &gt;= 2 nguyên nhân khả dĩ trước khi xem stack trace.</li>
  <li>Tôi KHÔNG còn cảm giác "muốn paste AI" khi gặp bài mới. Tôi muốn THỬ TRƯỚC.</li>
</ol>

<h3>Diễn giải kết quả</h3>
<ul>
  <li><strong>9-10 ✅</strong>: Sẵn sàng Phase 1. Đi tiếp.</li>
  <li><strong>7-8 ✅</strong>: Borderline. Pick 2-3 câu chưa pass → ôn 2-3 ngày → re-test.</li>
  <li><strong>5-6 ✅</strong>: <strong>QUAY LẠI</strong> các lesson tương ứng. Đừng ép sang Phase 1, sẽ vỡ.</li>
  <li><strong>&lt; 5 ✅</strong>: Phase 0 chưa thấm. Restart toàn bộ Phase 0 với tinh thần "tay gõ 3 lần" thực sự.</li>
</ul>

<h3>Nếu bạn pass 10/10 — đây là cảnh báo</h3>
Nếu bạn pass 10/10 nhưng cảm thấy <em>quá dễ</em> trong 1 tuần đầu → có khả năng cao là bạn đang paste AI mà tự lừa mình. Phép thử cuối: tắt internet, ngắt AI, viết Mini Bank trong 30 phút từ đầu. Nếu vẫn làm được → thật sự pass. Nếu không → quay lại sự thật.

<h3>Feynman cuối Phase 0</h3>
Mở Feynman Modal. Viết tối thiểu 200 chữ tiếng Việt trả lời:
<ul>
  <li>Cái gì <strong>khó nhất</strong> với tôi trong 3 tuần qua?</li>
  <li>Cái gì tôi <strong>vẫn chưa thực sự hiểu</strong>, chỉ "biết cú pháp"?</li>
  <li>Tôi đã paste AI ít nhất 1 lần chưa? Lần nào? Cảm giác sau đó?</li>
</ul>
Không có self-honesty thì 20 tuần tới sẽ thành chuyến chu du qua tutorial hell.`
      },
      socraticPrompts: [
        {
          title: 'Conversation với chính mình trước khi sang Phase 1',
          prompt: `Ngồi xuống 15 phút. Viết tay (KHÔNG gõ máy) trả lời:
1. Vì sao tôi học backend Java — viết 3 lý do thật. Đừng viết "vì lương cao" nếu không thật.
2. Sau 3 tuần Phase 0, kỳ vọng ban đầu có sai khác gì? Mất motivation chỗ nào?
3. 17 tuần tiếp theo dài hơn 3 tuần đã qua nhiều lần. Lúc burnout tôi sẽ làm gì?
4. Có lúc nào tôi sẽ paste AI không? — TRUNG THỰC. Nếu có, đặt rule trước: "Paste = restart module hiện tại".`
        }
      ],
      keyTakeaways: {
        vi: [
          'Pass 9-10/10 → sang Phase 1. Pass &lt; 7 → ÔN LẠI, không ép.',
          'Phép thử cuối: viết Mini Bank trong 30 phút từ đầu, KHÔNG AI.',
          'Self-honesty quan trọng hơn tốc độ. 20 tuần là dài — đừng tự lừa mình ở tuần 3.',
          'Phase 1 không "khó hơn" — chỉ "deep hơn". Foundations Phase 0 vững là điều kiện cần.'
        ]
      }
    }
  ]
}
