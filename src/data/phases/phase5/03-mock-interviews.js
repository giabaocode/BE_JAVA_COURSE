// Module 5.3 — Mock Interview with AI + Career Plan
export default {
  id: 'mod-5-3',
  title: 'Mock Interview with AI & 20-Week Job Search Plan',
  prerequisites: { vi: 'Hoàn thành <strong>toàn bộ curriculum</strong> (Phase 0–4) hoặc đang chuẩn bị phỏng vấn trong 4–12 tuần tới.' },
  lessons: [
    {
      id: 'l-5-3-fresher',
      type: 'ai',
      title: 'Fresher/Junior Mock — Java Core · Spring · SQL Q&A (40 phút)',
      subtitle: { en: 'The questions juniors actually get asked in Vietnam.', vi: 'Phỏng vấn fresher VN hỏi LÝ THUYẾT nhiều hơn LeetCode hard — đây là loại mock sát bạn nhất.' },
      mentalModel: {
        vi: `Sự thật ít ai nói với người mới: <strong>phỏng vấn fresher/junior Backend ở Việt Nam phần lớn là hỏi-đáp lý thuyết</strong> (Java core, OOP, Collections, Spring, JPA, SQL), CỘNG 1–2 bài code dễ/vừa — KHÔNG phải LeetCode Hard như các bài mock kia.
<br/><br/>
Vì sao? Công ty tuyển fresher cần kiểm tra bạn <strong>hiểu nền tảng</strong> và <strong>không paste mù</strong>, chứ không kỳ vọng bạn giải Hard. Một câu "HashMap hoạt động thế nào?" lọc ứng viên tốt hơn 1 bài DP 2D.
<br/><br/>
Lesson này cho AI đóng vai interviewer hỏi <strong>rapid-fire</strong> theo đúng ngân hàng câu hỏi fresher hay gặp, bắt bạn trả lời bằng lời (verbalize), rồi chấm theo độ chính xác + độ sâu. Mục tiêu: trả lời trôi chảy, đúng bản chất, không học vẹt.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Vì sao tier này tách riêng?</h3>
<strong>1) Fresher ≠ Senior interview.</strong>
Các bài mock algo/system design trong module này ghi "Senior/FAANG" — đúng để vươn cao, nhưng <strong>không phải</strong> thứ bạn gặp ở buổi phỏng vấn fresher đầu tiên. Tier này khớp đúng thực tế VN: TopCV/ITviec JD fresher thường ghi "nắm vững Java core, OOP, SQL cơ bản, hiểu Spring Boot".
<br/><br/>
<strong>2) Câu hỏi lý thuyết kiểm tra "hiểu" hay "thuộc".</strong>
Interviewer giỏi không hỏi "định nghĩa encapsulation" (Google được) mà hỏi "vì sao <code>==</code> khác <code>.equals()</code>?", "override equals mà quên hashCode thì HashMap hỏng sao?". Câu hỏi "vì sao" lộ ngay ai hiểu bản chất.
<br/><br/>
<strong>3) Curriculum này đã dạy đủ để trả lời.</strong>
Gần như mọi câu hỏi tier fresher đều có đáp án trong các module bạn đã học: <code>==</code> vs equals (M1.1), HashMap internals (M1.5), Exception/Lambda/Stream/Concurrency (M1.9), @Transactional (M3.3), index/JOIN (M3.0). Nếu bí câu nào → quay lại đúng module đó, đừng tra AI.
<br/><br/>
<strong>4) Verbalize là kỹ năng riêng.</strong>
Biết câu trả lời ≠ nói được mạch lạc trong 60 giây dưới áp lực. Mock này luyện đúng kỹ năng đó.`
      },
      theory: {
        vi: `<h3>Ngân hàng câu hỏi fresher hay gặp (tự kiểm tra: bạn trả lời được bao nhiêu?)</h3>
<strong>Java core:</strong>
<ul>
  <li><code>==</code> vs <code>.equals()</code> khác gì? Khi nào dùng cái nào? → <em>M1.1</em></li>
  <li>JDK vs JRE vs JVM? <code>String</code> immutable nghĩa là gì, vì sao lợi?</li>
  <li>Checked vs unchecked exception? <code>final</code> / <code>finally</code> / <code>finalize</code> khác nhau? → <em>M1.9</em></li>
  <li>Lambda là gì? Functional interface? Stream lazy nghĩa là gì? → <em>M1.9</em></li>
</ul>
<strong>OOP:</strong>
<ul>
  <li>4 tính chất OOP — cho ví dụ thực tế mỗi cái. Overloading vs overriding?</li>
  <li>Abstract class vs interface — khi nào dùng cái nào?</li>
  <li>Override <code>equals()</code> mà quên <code>hashCode()</code> → chuyện gì xảy ra với HashMap? → <em>M1.1, M1.5</em></li>
</ul>
<strong>Collections:</strong>
<ul>
  <li>HashMap hoạt động bên trong thế nào (bucket, hash, collision, treeify)? → <em>M1.5</em></li>
  <li>ArrayList vs LinkedList — khác về truy cập/thêm/xoá? → <em>M1.2, M1.3</em></li>
  <li>HashMap vs ConcurrentHashMap — vì sao không dùng HashMap đa luồng? → <em>M1.9</em></li>
</ul>
<strong>Concurrency:</strong>
<ul>
  <li>Race condition là gì? <code>count++</code> vì sao không an toàn? → <em>M1.9</em></li>
  <li><code>volatile</code> vs <code>synchronized</code> vs <code>Atomic</code>? Vì sao @Service Spring nên stateless? → <em>M1.9</em></li>
</ul>
<strong>Spring / JPA:</strong>
<ul>
  <li>IoC & DI là gì? Vì sao tốt hơn tự <code>new</code>? Bean scope mặc định? → <em>M3.2</em></li>
  <li><code>@Transactional</code> hoạt động bằng cơ chế gì? Self-invocation vì sao làm nó vô hiệu? → <em>M3.3</em></li>
  <li>N+1 problem là gì, fix ra sao? LAZY vs EAGER? → <em>M3.3</em></li>
  <li>REST: GET/POST/PUT/PATCH/DELETE khác nhau? Status code 200/201/400/401/403/404/409/500 dùng khi nào? → <em>M3.2</em></li>
</ul>
<strong>SQL:</strong>
<ul>
  <li>INNER vs LEFT JOIN? <code>WHERE</code> vs <code>HAVING</code>? Index giúp gì, đánh đổi gì? → <em>M3.0</em></li>
  <li>Vì sao KHÔNG nối chuỗi SQL (injection)? Transaction ACID là gì? → <em>M3.0, M3.4</em></li>
</ul>

<h3>The "Why" — Cách trả lời ghi điểm</h3>
Công thức 3 lớp: <strong>(1) định nghĩa ngắn → (2) cơ chế "vì sao" → (3) ví dụ/khi nào dùng</strong>. VD "<code>==</code> so sánh reference (cùng object trên heap?), <code>.equals()</code> so sánh nội dung; với String luôn dùng equals vì 2 String cùng nội dung có thể khác object". Đủ 3 lớp = đậu.

<h3>Junior Pitfalls — Khi trả lời lý thuyết</h3>
<ul>
  <li><strong>Học vẹt định nghĩa</strong> nhưng tịt ở "vì sao" → lộ ngay. Luôn hiểu cơ chế.</li>
  <li><strong>Trả lời lan man</strong> 3 phút cho câu 30 giây → luyện trả lời ngắn gọn, đúng trọng tâm.</li>
  <li><strong>Bịa khi không biết</strong> → interviewer biết ngay. Nói thẳng "em chưa chắc, em đoán là... vì..." tốt hơn bịa.</li>
  <li><strong>Không cho ví dụ</strong> → câu trả lời "khô". Một ví dụ thực tế (order, user) ăn điểm.</li>
  <li><strong>Bỏ qua câu hỏi ngược</strong>: cuối buổi luôn có "em có hỏi gì không?" — chuẩn bị 2–3 câu.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Mock] Rapid-fire Q&A fresher Backend (40 phút)',
          prompt: `Bạn là interviewer tuyển FRESHER/JUNIOR Backend Java tại một công ty Việt Nam (không phải FAANG). Phỏng vấn hỏi-đáp lý thuyết 40 phút.

QUY TẮC NGHIÊM NGẶT:
1. Hỏi RAPID-FIRE, mỗi lần MỘT câu, theo thứ tự chủ đề: Java core → OOP → Collections → Concurrency → Spring/JPA → SQL.
2. Độ khó tăng dần. Bắt đầu dễ ("JDK vs JRE vs JVM?") rồi sâu dần ("@Transactional self-invocation vì sao vô hiệu?").
3. TUYỆT ĐỐI KHÔNG cho đáp án trước khi tôi trả lời.
4. Sau mỗi câu tôi trả lời: chấm Đúng / Thiếu / Sai, bổ sung phần tôi miss NGẮN GỌN, rồi hỏi câu tiếp.
5. Nếu tôi trả lời hời hợt, hỏi "vì sao?" để đào sâu (đúng kiểu interviewer thật).
6. Hỏi khoảng 12–15 câu. CUỐI buổi: tổng kết theo chủ đề (chủ đề nào vững/yếu) + 3 việc cần ôn trong 7 ngày + chấm tổng "sẵn sàng phỏng vấn fresher: chưa / gần / sẵn sàng".

Bắt đầu bằng 1 câu chào ngắn + câu hỏi đầu tiên. Đợi tôi trả lời giữa mỗi câu.`
        },
        {
          title: '[Mock] Đào sâu 1 chủ đề (deep dive)',
          prompt: `Tôi muốn luyện sâu chủ đề [chọn: HashMap internals / @Transactional / Exception / Stream / SQL JOIN & index].

YÊU CẦU:
1. Hỏi tôi 5 câu từ nông đến sâu về CHỈ chủ đề này.
2. Mỗi câu, sau khi tôi trả lời, push thêm 1 câu "vì sao/điều gì xảy ra nếu..." để test hiểu bản chất.
3. KHÔNG cho đáp án cho tới khi tôi đã thử.
4. Cuối: chỉ ra chính xác chỗ tôi hiểu sai/nông và bài học (module) nên xem lại.`
        },
        {
          title: '[Mock] Behavioral fresher (chưa có kinh nghiệm đi làm)',
          prompt: `Phỏng vấn behavioral cho fresher CHƯA đi làm chính thức.

QUY TẮC:
1. Hỏi các câu phù hợp người mới: "Giới thiệu bản thân?", "Vì sao chọn Backend Java?", "Kể về một dự án/đồ án bạn tự hào?", "Gặp bug khó nhất bạn xử lý sao?", "Học công nghệ mới bằng cách nào?".
2. Vì tôi chưa đi làm, chấp nhận ví dụ từ ĐỒ ÁN/PROJECT cá nhân (vd capstone Devlog/ShopCore/TaskFlow) thay cho kinh nghiệm công ty.
3. Sau mỗi câu, góp ý cấu trúc trả lời (rõ ràng, có dẫn chứng, không lan man).
4. Cuối: 3 câu chuyện project tôi nên chuẩn bị sẵn để kể trong interview.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Self-eval sau mock fresher',
          prompt: `Sau buổi mock Q&A. KHÔNG cho đáp án trước. Hỏi tôi:
1. Chủ đề nào tôi trả lời tự tin nhất? Chủ đề nào tịt?
2. Có câu nào tôi trả lời được "định nghĩa" nhưng tịt phần "vì sao" không?
3. Tôi có cho ví dụ thực tế không, hay chỉ nói lý thuyết khô?
4. Câu nào tôi BỊA thay vì nói thẳng "chưa chắc"?
5. 3 module cụ thể tôi cần xem lại trong 7 ngày tới?
Tự chấm: tôi đã sẵn sàng cho phỏng vấn fresher chưa?`
        }
      ]
    },

    {
      id: 'l-5-3-algo',
      type: 'ai',
      title: 'Algorithmic Mock Interview (45 phút)',
      mentalModel: {
        vi: `<strong>Tinh thần</strong>: KHÔNG để AI cho đáp án. Yêu cầu AI đóng vai interviewer hỏi clarify, push edge case, ask dry-run. Bạn nói code bằng lời, AI feedback.
<br/><br/>
Sau session, AI score 6 dimension: clarify, approach, code quality, complexity analysis, edge case, communication.
<br/><br/>
<strong>Pattern</strong>: 1 problem medium / 45 phút.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Tại sao mock với AI hiệu quả?</h3>

<strong>1) Cost = 0, available 24/7</strong>
Mock với người real ($50-150/session) + lịch giới hạn. AI free + bất cứ lúc nào. Volume lên → muscle memory.
<br/><br/>
<strong>2) No judgment</strong>
AI không cười bạn khi miss obvious. Bạn dare fail more → learn nhanh hơn.
<br/><br/>
<strong>3) AI tốt cho structured feedback</strong>
Score 6 dimensions với rubric rõ — pattern phổ biến trong training data. AI consistent đánh giá theo rubric.
<br/><br/>
<strong>4) AI tệ cho "đọc body language"</strong>
Interview real: pause + hesitation cũng count. AI chỉ thấy text. Body language phải luyện riêng với human mock.
<br/><br/>
<strong>5) Pattern recognition</strong>
Real interviewer push back theo HUMAN intuition. AI follow rubric — predictable hơn. Sau khi mock AI nhiều, lên human mock để thử "thật".
<br/><br/>
<strong>6) Time-pressure không real với AI</strong>
AI không kick bạn ra sau 45 phút. Bạn TỰ enforce timer (như Mock Interview Mode trong site này).`
      },
      theory: {
        vi: `<h3>The "Why" — AI mock vs human mock vs friend mock?</h3>
<ul>
  <li><strong>AI mock</strong>: volume + consistency. Phase 1 prep.</li>
  <li><strong>Human mock (paid)</strong>: realistic feedback, body language. Phase 2 prep (1 tuần trước real interview).</li>
  <li><strong>Friend mock</strong>: cheap practice, nhưng bias (bạn bè không push hard).</li>
</ul>
Optimal mix: 80% AI + 15% human paid + 5% friend.

<h3>Junior Pitfalls — Mock Interview</h3>
<ul>
  <li><strong>Mock cùng pattern</strong> 100 bài Sliding Window → expert sliding window nhưng tệ pattern khác. Rotate.</li>
  <li><strong>Skip "talking out loud"</strong> trong AI mock → KHÔNG luyện communication. Real interview cần verbalize.</li>
  <li><strong>Accept AI hint dễ dàng</strong> — real interviewer rarely give hint. Tự bí 5-10 phút trước khi xin hint.</li>
  <li><strong>KHÔNG implement code thật</strong> — nói thuật toán xong skip code. Real interview MUST code on screen.</li>
  <li><strong>Skip complexity analysis</strong> — quan trọng để demonstrate understanding.</li>
  <li><strong>Mock chỉ medium</strong> — interview cũng hỏi easy + hard. Mix.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Mock] LeetCode Medium interview 45 phút',
          prompt: `Bạn là interviewer cho vị trí Senior Backend Engineer. Phỏng vấn LeetCode-style 45 phút.

QUY TẮC NGHIÊM NGẶT:
1. Pick MỘT bài medium trong pattern: [chọn: sliding window / two pointers / DP 1D / ...].
2. Present đề bài bằng lời (như interviewer thật), yêu cầu tôi clarify.
3. TUYỆT ĐỐI KHÔNG show solution dù tôi xin.
4. Sau khi tôi trình approach, push back về edge case tôi miss.
5. Sau khi tôi "viết code" (paste hoặc nói bằng lời), bắt tôi dry-run trên input cụ thể.
6. CUỐI session, score 6 dimension 1-10, 1 improvement per dimension:
   - Problem clarification
   - Approach + thuật toán
   - Code quality
   - Complexity analysis
   - Edge case handling
   - Communication (giải thích rõ ràng)

Bắt đầu bằng intro + đề bài. Đợi tôi giữa các turn.`
        },
        {
          title: '[Mock] Hard problem 60 phút (Senior+ level)',
          prompt: `Senior+ algorithmic interview 60 phút. Chỉ HARD problem.

QUY TẮC:
1. Pick HARD pattern: DP 2D, Backtracking, Graph (Dijkstra/MST), Trie, Sliding Window Max, ...
2. Cho tôi 5-7 phút để clarify + edge case BEFORE start approach.
3. Push tôi nghĩ brute force trước → optimize → analyze.
4. Nếu tôi stuck &gt; 5 phút, hỏi 1 câu HƯỚNG (NOT solution).
5. Code phase 25 phút — bắt tôi handle edge case + bug fix.
6. Cuối: feedback per dimension + 1 follow-up question.

KHÔNG cho solution. Khuyến khích bằng câu hỏi.`
        },
        {
          title: '[Mock] Pattern-specific deep dive',
          prompt: `Tôi vừa học pattern [PATTERN_NAME]. Mock interview 3 problem theo pattern này trong 60 phút.

REQUIREMENT:
1. Pick 3 problem độ khó tăng dần: easy → medium → hard.
2. Time-box 20 phút/problem.
3. Sau mỗi problem: tôi self-evaluate trước, bạn correct.
4. Cuối: nhận xét tôi mạnh/yếu trong pattern này. Bài tiếp theo nên focus gì?

KHÔNG cho hint trừ khi tôi bí &gt; 5 phút.`
        },
        {
          title: '[Mock] System design hỗ trợ algo',
          prompt: `Tôi vừa solve problem [LeetCode link]. Bây giờ hỏi tôi follow-up "scale up":

1. Nếu input lên 1 tỷ — solution của tôi work không?
2. Distributed: làm sao chia work cho 10 server?
3. Memory constraint: stream input thay vì load hết — algorithm đổi ra sao?
4. Real-time: input đến từng giây — cấu trúc nào?

Đây là pattern phổ biến SR+ interview: algo + system design hybrid.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Self-eval sau mock',
          prompt: `Sau mock interview. KHÔNG cho đáp án trước. Hỏi tôi:
1. 1 lỗi LỚN nhất tôi mắc — dimension nào?
2. Có phần nào tôi không hiểu interviewer hỏi gì?
3. Tôi có pause để think khi cần, hay rush?
4. Edge case nào AI push mà tôi không tự nghĩ ra?
5. Pattern thinking nào tôi cần luyện thêm?
6. 3 action item cụ thể trong 7 ngày tới?
Self-grade.`
        }
      ]
    },

    {
      id: 'l-5-3-system',
      type: 'ai',
      title: 'System Design Mock Interview (60 phút)',
      mentalModel: {
        vi: `System design = no single right answer. Interview test TRADE-OFF reasoning, không phải "memorize architecture".
<br/><br/>
6 dimensions interviewer score:
<ol>
<li>Requirement clarification (functional + non-functional).</li>
<li>Capacity estimation (QPS, storage, bandwidth).</li>
<li>API design.</li>
<li>Data model.</li>
<li>Scaling (sharding, caching, replication).</li>
<li>Trade-off discussion.</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>First Principles — System design framework</h3>

<strong>1) Time allocation 60 phút</strong>
<ul>
<li>5 phút: clarify requirement, scope.</li>
<li>5 phút: capacity estimation (back-of-envelope).</li>
<li>5 phút: high-level API.</li>
<li>10 phút: data model.</li>
<li>15 phút: high-level diagram (services, DB, cache).</li>
<li>15 phút: scaling deep dive (1-2 area interviewer push).</li>
<li>5 phút: trade-off + alternative.</li>
</ul>
<br/><br/>
<strong>2) Back-of-envelope math</strong>
1M user × 10 request/day = 10M req/day = 115 req/sec average → peak 300 req/sec.
1 KB per request payload → 10 GB/day storage.
Memorize key numbers: SSD seek ~0.1ms, network 1 region ~1ms, network cross-region ~50-100ms.
<br/><br/>
<strong>3) Standard pattern</strong>
Load balancer → API gateway → microservices → cache → DB (read replica) → message queue → workers.
Memorize 5-7 pattern: pagination, rate limiting, distributed cache, eventual consistency, leader election.
<br/><br/>
<strong>4) Trade-off framework</strong>
Mỗi decision liệt kê: PRO, CON, alternative. Không có "right answer" — chỉ có "right for context".
<br/><br/>
<strong>5) AI giúp gì</strong>
Mock format: AI push back câu hỏi typical interviewer hỏi. Bạn luyện structure + reasoning out loud.
<br/><br/>
<strong>6) AI hạn chế</strong>
AI thiếu "intuition" của 10 năm experience engineer. Sau AI mock, lên paid mock với senior để fine-tune.`
      },
      theory: {
        vi: `<h3>The "Why" — System design skill</h3>
<ul>
  <li>SR+ role yêu cầu system design — algo chỉ ở phỏng vấn vòng 1.</li>
  <li>Demonstrate "engineering judgment" — trade-off thinking, not memorization.</li>
  <li>Communication skill — interviewer cần follow bạn nghĩ.</li>
</ul>

<h3>Junior Pitfalls — System Design</h3>
<ul>
  <li><strong>Skip clarification</strong> jump straight to architecture → solve wrong problem.</li>
  <li><strong>Over-engineering</strong> ngay từ đầu: micro-services + Kafka + CQRS cho "URL shortener". Match scale.</li>
  <li><strong>KHÔNG estimate capacity</strong> → architecture random.</li>
  <li><strong>Mention buzzword</strong> (CQRS, Saga, Event Sourcing) mà KHÔNG biết khi nào dùng → lộ shallow.</li>
  <li><strong>Single point of failure</strong> trong diagram → reliability fail.</li>
  <li><strong>KHÔNG hỏi "read-heavy hay write-heavy"</strong> → key decision miss.</li>
  <li><strong>Default SQL cho mọi thứ</strong> hoặc default NoSQL — không biết khi nào dùng cái nào.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Mock] System Design 60 phút',
          prompt: `Bạn là interviewer system design cho Senior Backend Engineer.

DESIGN TARGET: [pick: "URL shortener 10k QPS 100TB", "Twitter feed", "ride-share matching", "Slack realtime", "Stripe-like payment", "Netflix recommend"].

QUY TẮC:
1. Bắt đầu bằng yêu cầu tôi clarify (functional + non-functional).
2. Push tôi estimate QPS, storage, bandwidth bằng SỐ.
3. Probe lựa chọn: SQL vs NoSQL, hash strategy, caching, consistency, sharding.
4. Khi tôi gloss qua chi tiết — drill into.
5. KHÔNG cho đáp án.
6. CHỈ score CUỐI cùng (khi tôi nói "interview complete") trên: requirement, capacity estimation, API design, data model, scaling, trade-off discussion, communication.

Start.`
        },
        {
          title: '[Mock] System Design hard scenario',
          prompt: `Advanced system design 75 phút. Senior Staff level.

TARGET: [pick từ hard list: "Distributed cache à la Redis Cluster", "Real-time leaderboard cho 100M user", "Multi-region deployment với active-active", "Stream processing 1M events/sec"].

QUY TẮC:
1. Assume tôi có background — push tới deep technical detail.
2. Push tôi về CAP theorem trade-off cụ thể.
3. Yêu cầu numerical reasoning: throughput, latency budget, RPO/RTO.
4. Drill failure scenarios: 1 node down, 1 region down, network partition.
5. KHÔNG cho hint. Nếu tôi stuck, ask "Why are you stuck?" thay vì help.

Bắt đầu.`
        },
        {
          title: '[Mock] Trade-off comparison',
          prompt: `Cho tôi 2 design alternative cho [feature], tôi phải defend cái tôi chọn.

SETUP:
1. Bạn propose 2 design A, B với rough sketch.
2. Tôi pick 1 và defend trong 10 phút.
3. Bạn attack: edge case, cost, scale, complexity.
4. Tôi adjust hoặc concede.
5. Cuối: bạn evaluate decision quality.

Đây là format Amazon "Bar Raiser" interview hỏi.`
        }
      ],
      socraticPrompts: [
        {
          title: 'System design self-prep',
          prompt: `Tôi sắp interview system design. KHÔNG cho đáp án. Hỏi tôi:
1. Tôi biết back-of-envelope numbers nào? (SSD seek, network latency, throughput)
2. 7 distributed system patterns tôi giải thích được? (Leader election, consistent hashing, ...)
3. CAP theorem: tôi explain Coca-Cola example được không?
4. Khi nào dùng SQL vs NoSQL — 5 tiêu chí tôi check?
5. Đặt cho tôi 1 system design 10 phút khẩn cấp — tôi có chia time đúng?`
        }
      ]
    },

    {
      id: 'l-5-3-behavioral',
      type: 'ai',
      title: 'Behavioral Mock Interview (STAR)',
      mentalModel: {
        vi: `Behavioral interview test "soft skill + judgment". STAR framework structure câu trả lời:
<ul>
<li><strong>Situation</strong>: bối cảnh.</li>
<li><strong>Task</strong>: việc tôi phải làm.</li>
<li><strong>Action</strong>: hành động cụ thể TÔI (không "we").</li>
<li><strong>Result</strong>: kết quả với metric.</li>
</ul>
Mỗi câu trả lời 2-3 phút. KHÔNG ramble.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Behavioral interview thật sự test gì?</h3>

<strong>1) Past behavior predict future</strong>
Premise: "Cách bạn xử lý conflict trong dự án trước → cách bạn xử lý trong job này". Specific story &gt; abstract claim.
<br/><br/>
<strong>2) STAR forces structure</strong>
Most candidate ramble — interviewer mất focus. STAR ép bạn ngắn gọn → respect interviewer time.
<br/><br/>
<strong>3) Metric quan trọng</strong>
"Tôi cải thiện performance" — vague. "Tôi giảm p99 từ 2s xuống 200ms" — concrete. Metric show ownership + measurement mindset.
<br/><br/>
<strong>4) "I" not "we"</strong>
"Team built it" — interviewer không biết bạn làm gì. "I implemented X, team handled Y" — clear contribution.
<br/><br/>
<strong>5) Vulnerability + Learning</strong>
"Lỗi tôi gây ra" — show humility + growth. KHÔNG fake "tôi không có lỗi nào". Interviewer biết bạn fake.
<br/><br/>
<strong>6) AI mock value</strong>
Practice STAR structure + concise delivery. AI consistent enforce STAR. Sau khi quen, lên human mock cho realistic feel.`
      },
      theory: {
        vi: `<h3>4 categories behavioral question</h3>
<ol>
  <li><strong>Conflict</strong>: với teammate, với manager, với customer.</li>
  <li><strong>Ambiguity</strong>: dự án unclear requirement, deliver dưới deadline.</li>
  <li><strong>Failure</strong>: bug production, project missed, decision sai.</li>
  <li><strong>Leadership</strong>: lead initiative, mentor junior, drive change.</li>
</ol>

<h3>The "Why" — Behavioral matters hơn bạn nghĩ</h3>
<ul>
  <li>Senior roles: technical là baseline; behavioral differentiate.</li>
  <li>"Culture fit" — behavioral interview là proxy.</li>
  <li>Many candidate fail behavioral → easy win nếu prepared.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Generic answer</strong>: "tôi communicate tốt" — không story = không proof.</li>
  <li><strong>Blame teammates</strong>: "Lỗi do team" → red flag.</li>
  <li><strong>Quá negative về cty cũ</strong>: complaint mode → "Will complain about us too".</li>
  <li><strong>Story 10 phút</strong>: lan man. 2-3 phút.</li>
  <li><strong>KHÔNG có metric</strong>: result vague.</li>
  <li><strong>1 story duy nhất</strong> cho mọi câu hỏi: shallow experience.</li>
  <li><strong>Fake confidence</strong>: claim "I solved X" nhưng không deep dive được → caught lying.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Mock] Behavioral interview 30 phút',
          prompt: `Bạn là interviewer behavioral. Dùng STAR framework.

Hỏi 4 câu, từng câu một, cover:
1. Xung đột với teammate.
2. Dự án deliver với requirement mơ hồ.
3. Lỗi tôi gây ở production + bài học.
4. Lần bất đồng với senior engineer.

Sau mỗi câu trả lời:
- Probe missing STAR (Situation, Task, Action, Result).
- Push về số: "Impact bao nhiêu user? % tăng? Thời gian giảm?".
- Score 1-5 với justification 1 câu.

KẾT: hire / no-hire + 2 leverage cao nhất tôi cần improve.

Bắt đầu với câu 1.`
        },
        {
          title: '[Mock] Amazon Leadership Principles',
          prompt: `Amazon-style behavioral. Cover 4 LP trong 4 câu hỏi:
1. Customer Obsession
2. Ownership
3. Dive Deep
4. Have Backbone; Disagree and Commit

QUY TẮC:
- Bắt buộc STAR.
- Sau mỗi answer, push 2 follow-up "Tell me more about that decision" / "What would you do differently?"
- Score theo LP rubric Amazon: STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE.

KHÔNG accept generic answer. Push for specifics.`
        },
        {
          title: '[Mock] Behavioral cho FAANG / unicorn',
          prompt: `Senior+ behavioral 45 phút. Tougher questions.

Hỏi 5 câu, mỗi câu push 3-4 follow-up:
1. Lần bạn ngầm push back team decision và cuối cùng đúng.
2. Lần bạn mentor junior — quantify impact.
3. Cross-functional collaboration: project với PM/design/data scientist.
4. Trade-off giữa technical excellence vs deadline.
5. Decision có ảnh hưởng &gt; 6 tháng — how did you decide?

Per answer: probe missing STAR, push metric, ask "what would do differently". Cuối: full evaluation.`
        },
        {
          title: '[Prep] Story bank generator',
          prompt: `Tôi cần build "story bank" cho behavioral interview. Help me identify stories.

Hỏi tôi 10 câu để extract stories từ experience:
1. Dự án nào bạn proud nhất?
2. Bug production worst-case bạn gây ra?
3. Conflict KHÓ nhất bạn xử lý?
4. Mentor junior thành công nhất?
5. Decision KHÓ nhất bạn drive?
6. Failure lớn nhất + bài học?
7. Cross-team collaboration thành công?
8. Innovation bạn introduce?
9. Time bạn bất đồng với senior?
10. Achievement bạn ít biểu hiện ra nhất?

Sau khi tôi trả lời, help map mỗi story sang multiple behavioral question (1 story dùng cho 2-3 question khác).`
        }
      ],
      socraticPrompts: [
        {
          title: 'Self-reflection sau mock behavioral',
          prompt: `Sau mock behavioral. KHÔNG cho đáp án. Hỏi tôi:
1. Story tôi kể có rõ Situation, Task, Action, Result?
2. Tôi dùng "I" hay "we" — quantify ownership?
3. Có metric concrete (number, %, time saved)?
4. Story 2-3 phút hay ramble 5+?
5. Follow-up câu interviewer hỏi — tôi handle được hay defensive?
6. Story show learning + growth, hay flat?
Self-grade 1-5 per câu.`
        }
      ]
    },

    {
      id: 'l-5-3-plan',
      type: 'theory',
      title: 'Closing — Your 20-Week Job-Search Plan (Beginner-Friendly)',
      mentalModel: {
        vi: `Có kiến thức KHÔNG đủ. Cần process. Đây là plan <strong>20 tuần</strong> biến curriculum này thành offer — version <strong>beginner-friendly</strong> cho người ít luyện code và hay copy-paste AI.
<br/><br/>
4 phase: WARMUP (1-3) → FOUNDATION (4-9) → PATTERNS (10-15) → APPLY + SHARPEN (16-20).
<br/><br/>
<strong>Quy tắc số 1</strong>: KHÔNG paste AI bất kỳ exercise nào trong Phase 0-1. Phát hiện → restart tuần đó.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Job search như marketing funnel</h3>

<strong>1) Application → Screen → Onsite → Offer funnel</strong>
Conversion rate average: 100 apply → 10 screen → 3 onsite → 1 offer. Để 1 offer cần ~100 application. Volume matters.
<br/><br/>
<strong>2) Quality vs Quantity</strong>
Mass apply = low quality, low conversion. Targeted apply (research company + customize CV) = 30-40% conversion vs 5% mass.
<br/><br/>
<strong>3) Network &gt; cold apply</strong>
Referral conversion 3-5× cold apply. Maintain LinkedIn + reach out alumni + tech meetup.
<br/><br/>
<strong>4) Compound learning</strong>
Tuần 1 học 1 pattern → tuần 12 đã practice mỗi pattern ~50 lần. Daily consistency beats weekend marathon.
<br/><br/>
<strong>5) Spaced repetition</strong>
Sliding Window solve tuần 1 → review tuần 3 → review tuần 8. Active recall maintain memory long-term.
<br/><br/>
<strong>6) Track + measure</strong>
Spreadsheet: every interview + outcome + lessons learned. Pattern emerge — bạn fail consistently ở dimension nào?`
      },
      theory: {
        vi: `<h3>Tuần 1-3: WARMUP (Phase 0)</h3>
<ul>
  <li><strong>Mục tiêu</strong>: bỏ thói paste AI, build muscle memory syntax, solve 25 LeetCode easy.</li>
  <li>Tuần 1: Module 0.1 (Syntax Essentials) + Module 0.2 (Built-in Collections) — gõ tay 3 lần mỗi exercise.</li>
  <li>Tuần 2: Module 0.3 — solve 12-15 bài LeetCode easy (group 1, 2, 3).</li>
  <li>Tuần 3: Còn 10 bài + revisit + Feynman note tất cả 25 bài bằng tiếng Việt.</li>
  <li><strong>Pass gate</strong>: solve Two Sum &lt; 5 phút, gõ HashMap syntax không cần Google. Nếu không pass → repeat tuần 3.</li>
</ul>

<h3>Tuần 4-9: FOUNDATION (Phase 1)</h3>
<ul>
  <li><strong>Mục tiêu</strong>: hiểu OOP + implement DS từ scratch + sort algorithm.</li>
  <li>Tuần 4: Module 1.1 (OOP Pillars) — 3 lessons.</li>
  <li>Tuần 5: Module 1.2 (Arrays) + Module 1.3 (LinkedList) — DÙNG → IMPLEMENT.</li>
  <li>Tuần 6: Module 1.4 (Stack/Queue) + Module 1.5 (HashMap) — implement from scratch.</li>
  <li>Tuần 7: Module 1.6 (Trees/BST/Heap).</li>
  <li>Tuần 8: Module 1.7 (Merge Sort + Quick Sort + Divide &amp; Conquer).</li>
  <li>Tuần 9: Review Phase 1 + Feynman note tổng kết. Solve 5 LeetCode medium đầu tiên.</li>
  <li><strong>Pass gate</strong>: implement MyArrayList + MyHashMap không nhìn solution.</li>
</ul>

<h3>Tuần 10-15: PATTERNS (Phase 2)</h3>
<ul>
  <li><strong>Mục tiêu</strong>: master 17 LeetCode patterns + 186 problems.</li>
  <li>Tuần 10: Pattern 1-3 (Sliding Window, Two Pointers, Fast/Slow). ~5 bài/pattern.</li>
  <li>Tuần 11: Pattern 4-6 (Merge Intervals, Cyclic Sort, Reversal LL).</li>
  <li>Tuần 12: Pattern 7-9 (Tree BFS, Tree DFS, Two Heaps).</li>
  <li>Tuần 13: Pattern 10-12 (Backtracking, Binary Search, Top K).</li>
  <li>Tuần 14: Pattern 13-15 (Graph traversal, Shortest path, Trie).</li>
  <li>Tuần 15: Pattern 16-17 (DP 1D, DP 2D). KHÓ NHẤT — dành thời gian.</li>
  <li><strong>Pass gate</strong>: solve 1 medium random &lt; 30 phút không nhìn solution.</li>
  <li><strong>Bắt đầu apply</strong> từ tuần 15 — interview là feedback nhanh nhất.</li>
</ul>

<h3>Tuần 16-20: APPLY + SHARPEN (Phase 3-4-5)</h3>
<ul>
  <li>Tuần 16-17: Phase 3 (Spring Boot + Docker + Postgres). Setup môi trường, hiểu JPA, JWT.</li>
  <li>Tuần 18-19: Capstone 1 (Devlog) end-to-end. Deploy live trên Fly.io/Render.</li>
  <li>Tuần 20: Mock interview daily + apply 5 jobs/ngày + track everything.</li>
  <li>Capstone 2, 3 — làm SAU khi có offer hoặc parallel với interview.</li>
  <li>Daily: 1 LeetCode medium revisit + 1 mock (rotate algo/system/behavioral).</li>
</ul>

<h3>The "Why" — Nguyên tắc</h3>
<ul>
  <li><strong>Consistency &gt; intensity</strong>. 90 phút/ngày × 90 ngày &gt; 10 giờ cuối tuần.</li>
  <li><strong>Có dự án để show, KHÔNG chỉ chứng chỉ</strong>.</li>
  <li><strong>Whiteboard / Google Doc</strong> luyện trước, KHÔNG chỉ IDE.</li>
  <li><strong>AI review code của BẠN</strong>, KHÔNG phải viết hộ bạn.</li>
  <li><strong>Track + iterate</strong>: mỗi interview = data point để improve.</li>
</ul>

<h3>Junior Pitfalls — Job Search</h3>
<ul>
  <li><strong>Học vô tận trước khi apply</strong> — "Đợi xong Phase 5 mới apply". WRONG. Apply sau tuần 4. Interview là feedback fastest.</li>
  <li><strong>KHÔNG track interview</strong> → lặp lỗi cũ.</li>
  <li><strong>Reject offer first vì lương thấp</strong> mà chưa negotiate. Always counter.</li>
  <li><strong>Burn out tuần 4</strong> → bỏ cuộc. Plan rest day mỗi tuần.</li>
  <li><strong>So sánh với người khác</strong> trên LinkedIn → demotivate. Track YOUR progress.</li>
  <li><strong>Ghost employer sau interview</strong> → cháy bridge. Always reply.</li>
  <li><strong>Apply trên job board duy nhất</strong> (LinkedIn) → miss 70% job. Diversify: TopCV, ITviec, VietnamWorks, Wellfound, direct company career page.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Weekly self-review (mỗi Chủ Nhật)',
          prompt: `Cuối tuần. KHÔNG cho đáp án. Hỏi tôi:
1. Tuần này solve bao nhiêu LeetCode? Pattern nào yếu?
2. Có push code lên GitHub không? Commit message clean?
3. Mock interview lần nào? Score dimension nào yếu nhất?
4. Apply bao nhiêu job? Interview nào schedule tuần tới?
5. Sleep + exercise + meal — score 1-10. Burn out warning?
6. Tuần tới 3 priority gì? Realistic?
Self-track trong notion / spreadsheet.`
        },
        {
          title: 'Quarterly career planning',
          prompt: `Cứ 12 tuần 1 lần. KHÔNG cho đáp án. Hỏi tôi:
1. Goal Q này có đạt? Why / why not?
2. Skill gap so với target role (Senior, Staff) — top 3?
3. Network grew bao nhiêu? Quality network — không chỉ LinkedIn add.
4. Side project / open source — có contribute gì?
5. Career path 1 năm tới: vertical (deeper), horizontal (manager), sideways (different domain)?
6. Q tới 3 OKR realistic?`
        }
      ],
      keyTakeaways: {
        vi: [
          'Phase 0 (warmup 3 tuần) BẮT BUỘC cho ai ít luyện code — bỏ qua = struggle Phase 1.',
          'Curriculum này KHÔNG có giá trị nếu bạn copy code từ AI. Phải tự gõ.',
          'Mỗi LeetCode bạn solve KHÔNG nhìn solution = 10 bài copy từ AI.',
          'Feynman note tiếng Việt mỗi lesson — non-negotiable.',
          'GitHub repo có code rõ + README rõ = portfolio thực.',
          'Mock interview với AI ÍT NHẤT 2 lần/tuần trong giai đoạn apply.',
          'Apply EARLY (tuần 15) thay vì đợi "ready" — interview là feedback fastest.',
          'Network &gt; cold apply. Reach out alumni, attend tech meetup.',
          'Consistency &gt; intensity. 90 phút/ngày × 140 ngày &gt; cuối tuần marathon.',
          'Bạn đi đến đâu được — quyết định bằng PROCESS, không phải LUCK.'
        ]
      }
    }
  ],
  references: [
    { title: 'Cracking the Coding Interview (book site)', url: 'https://www.crackingthecodinginterview.com/' },
    { title: 'System Design Primer (free, GitHub)', url: 'https://github.com/donnemartin/system-design-primer' },
    { title: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles' },
    { title: 'STAR method (Indeed guide)', url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique' }
  ]

}
