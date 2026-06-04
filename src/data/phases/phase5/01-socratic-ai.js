// Module 5.1 — AI as Socratic Mentor (Anti-Copy-Paste)
export default {
  id: 'mod-5-1',
  title: 'AI as Socratic Mentor — Anti-Copy-Paste Workflows',
  prerequisites: { vi: 'Hoàn thành <strong>Phase 0–3</strong>. Có kinh nghiệm dùng ChatGPT/Claude trong quá trình học.' },
  lessons: [
    {
      id: 'l-5-1-socratic',
      type: 'ai',
      title: 'The Socratic Prompt Pattern — Make AI Ask You Back',
      mentalModel: {
        vi: `<strong>Vấn đề</strong>: bạn copy đề bài LeetCode vào AI, AI cho code, bạn paste vào, AC, qua bài tiếp theo. 3 tháng sau interview — bạn KHÔNG nhớ gì.
<br/><br/>
<strong>Giải pháp</strong>: viết prompt mà AI BUỘC PHẢI hỏi ngược thay vì giải. Bạn trở thành người chủ động — AI là examiner.
<br/><br/>
<strong>Cấu trúc Socratic prompt</strong>:
<ol>
<li>Mở đầu: "TUYỆT ĐỐI KHÔNG viết code / đáp án".</li>
<li>Vai trò: "Hãy đóng vai gia sư..." hoặc "Hãy đặt câu hỏi dẫn dắt...".</li>
<li>Quy tắc: "Đợi tôi trả lời từng câu rồi mới đi câu tiếp".</li>
<li>Tiêu chí kết thúc: "Chỉ khi tôi đã trả lời cả 5 câu, hãy summarize và chỉ ra chỗ tôi sai/yếu".</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>First Principles — LLM thực sự là gì?</h3>

<strong>1) LLM = "autocomplete khổng lồ"</strong>
GPT/Claude/Gemini chỉ làm 1 việc duy nhất: dự đoán <strong>token tiếp theo</strong> dựa trên context. Không có "suy luận" hay "ý chí". Mọi behavior bạn thấy đều là <em>pattern match</em> từ training data.
<br/><br/>
<strong>2) Tại sao "TUYỆT ĐỐI KHÔNG" hoạt động?</strong>
Training data có rất nhiều ví dụ "instruction-following" — câu lệnh + response tuân thủ. Khi bạn viết "TUYỆT ĐỐI KHÔNG", model match pattern này và sinh response tuân thủ. Caps lock + repetition + explicit constraint = signal mạnh.
<br/><br/>
<strong>3) Tại sao prompt mơ hồ thất bại?</strong>
"giúp tôi học LeetCode" — model có MUÔN VÀN cách response. Default behavior phổ biến nhất trong training data là "cho đáp án" (vì user thường muốn câu trả lời). Để OVERRIDE default, bạn cần signal rõ ràng.
<br/><br/>
<strong>4) Context window — bộ nhớ ngắn hạn</strong>
LLM "nhớ" toàn bộ conversation hiện tại (Claude ~200k token, GPT-4 ~128k token). NHƯNG sau khi đóng chat hoặc reset, bộ nhớ về 0. <strong>KHÔNG có học hỏi cross-session</strong>. Mỗi conversation phải tự load context.
<br/><br/>
<strong>5) Hallucination — bug đặc trưng</strong>
LLM sinh text "plausible" không phải "correct". Có thể bịa method API không tồn tại, dependency phiên bản sai, JPA annotation deprecated. <strong>Luôn verify code trước khi chạy</strong>.
<br/><br/>
<strong>6) Tại sao Socratic prompt hiệu quả hơn "explain X"?</strong>
"Explain X" → model dump info → bạn passive đọc → 1 tuần sau quên. Socratic prompt → bạn ACTIVE think → encoding sâu hơn → nhớ lâu. Đây là <em>active recall</em> + <em>spaced repetition</em> trong nghiên cứu giáo dục.`
      },
      theory: {
        vi: `<h3>The "Why" — Socratic prompt vs prompt thường</h3>
<ul>
  <li><strong>Prompt thường</strong>: "Explain JPA persistence context" → AI dump 500 chữ → bạn skim → quên.</li>
  <li><strong>Socratic prompt</strong>: "Hỏi tôi 5 câu về persistence context, đợi tôi trả lời" → bạn vừa tự nhớ vừa được correct → nhớ lâu.</li>
  <li>Khoa học giáo dục: <strong>active recall</strong> (tự nhớ) hiệu quả gấp 5-10× <strong>passive review</strong> (đọc).</li>
</ul>

<h3>Khi nào dùng Socratic prompt</h3>
<ul>
  <li>Học khái niệm mới (Spring lifecycle, JPA cache, Kafka partition).</li>
  <li>Solve LeetCode KHÔNG nhìn solution.</li>
  <li>Debug bug khó — bắt AI hỏi để bạn tự find root cause.</li>
  <li>Review code của bản thân — bắt AI hỏi "tại sao mày làm thế này?".</li>
</ul>

<h3>Junior Pitfalls — Sử dụng AI sai cách</h3>
<ul>
  <li><strong>Paste đề LeetCode → copy đáp án → submit</strong>. 3 tháng sau không nhớ. NIGHTMARE cho interview.</li>
  <li><strong>"Tôi đang học Java, dạy tôi"</strong> — quá mơ hồ. AI dump generic content. Phải SPECIFIC topic + level.</li>
  <li><strong>Tin AI 100% mà không verify</strong> — hallucination thật. JPA method không tồn tại, Spring annotation sai.</li>
  <li><strong>Dùng AI thay vì đọc doc chính thức</strong> — doc luôn correct, AI có thể outdated (training cutoff).</li>
  <li><strong>Bỏ qua "Why does it work"</strong> — chỉ care output. Interview hỏi sâu → bạn không trả lời được.</li>
  <li><strong>Mở 5 chat parallel hỏi cùng câu</strong> để "verify" — vô nghĩa, model cùng training data.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Master Template] Học khái niệm mới Socratic',
          prompt: `Tôi muốn học về [TOPIC] (ví dụ: "JPA persistence context", "Java memory model", "Postgres MVCC").

TUYỆT ĐỐI KHÔNG giải thích trực tiếp. KHÔNG viết code.

Hãy đóng vai gia sư Socratic. Quy tắc:
1. Đặt cho tôi 5-7 câu hỏi từ DỄ đến KHÓ về topic này.
2. ĐỢI tôi trả lời từng câu rồi mới đi câu tiếp.
3. Nếu tôi trả lời sai, hỏi tiếp để dẫn tôi đến chỗ đúng — KHÔNG sửa thẳng.
4. Nếu tôi trả lời đúng nhưng chưa đầy đủ, hỏi mở rộng.
5. Khi tôi đã trả lời hết, summarize: tôi nắm vững gì, tôi yếu chỗ nào, tôi nên học gì tiếp.

Bắt đầu bằng câu hỏi đầu tiên ngay.`
        },
        {
          title: '[LeetCode] Solve không nhìn đáp án',
          prompt: `Bài LeetCode: [PASTE PROBLEM URL hoặc đề bài].

TUYỆT ĐỐI KHÔNG cho tôi solution, KHÔNG cho code, KHÔNG cho thuật toán cụ thể.

Hãy hỏi tôi từng bước:
1. Bài này thuộc pattern nào? (Tôi đoán, bạn xác nhận hoặc dẫn dắt)
2. Brute force trước — time/space?
3. Có cấu trúc dữ liệu nào giúp tối ưu? Vì sao?
4. Edge case tôi cần xét?
5. Pseudo code — không cho tôi code Java, chỉ hỏi tôi flow.
6. Phân tích complexity của approach tôi vừa nghĩ.

Đợi tôi reply giữa các câu. Nếu tôi bí, hỏi câu phụ giúp tôi suy luận chứ KHÔNG cho đáp án.`
        },
        {
          title: '[Debug] Tìm root cause không hint',
          prompt: `Tôi đang gặp lỗi sau:
[PASTE error message + stack trace + relevant code]

TUYỆT ĐỐI KHÔNG cho tôi fix code. KHÔNG nói lỗi ở đâu.

Hãy đặt cho tôi câu hỏi dẫn dắt:
1. Dòng error nào nói lên gì? Component nào throw?
2. Tôi nên kiểm tra log nào để xác nhận giả thuyết?
3. Có thể reproduce bằng test nhỏ không? Test ra sao?
4. Nếu giả thuyết của tôi đúng, tôi expect thấy gì khi check X?
5. Khi đã có root cause, fix ở layer nào (quick fix vs proper fix)?

Đừng cho đáp án. Hỏi từng câu.`
        },
        {
          title: '[Anti-Hallucination] Verify trước khi tin',
          prompt: `Trước khi tôi áp dụng giải pháp bạn vừa đề xuất, hãy GIÚP TÔI verify:

1. Method/class/annotation bạn dùng — link doc chính thức (Spring docs, Oracle Java docs)?
2. Phiên bản library nào? Method có deprecated trong version mới chưa?
3. Có alternative cách tiếp cận nào không? So sánh với cách bạn chọn — vì sao chọn cái này?
4. Edge case bạn ĐÃ tính tới khi viết solution? Liệt kê.
5. 3 cách solution này có thể fail trong production?

KHÔNG defend solution. Đóng vai code reviewer khó tính, tìm vấn đề.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Tự đánh giá việc dùng AI',
          prompt: `Sau 1 tuần dùng AI để học. KHÔNG cho đáp án trước. Hỏi tôi:
1. Tôi đã viết code TỰ TAY (không copy-paste AI) cho bao nhiêu % bài?
2. Khi gặp bug mới, phản xạ đầu tiên là Google, đọc doc, hay paste AI?
3. Sau khi AI giải thích 1 concept, tôi có thể giải thích lại bằng lời cho người khác không?
4. Code AI viết tôi có hiểu MỌI DÒNG không? Có dòng nào tôi không biết tại sao có?
5. Tôi có học vẹt prompt template hay tự viết prompt mới khi cần?
Self-score 1-10 mỗi câu. Tổng < 35 là dấu hiệu copy-paste.`
        }
      ]
    },

    {
      id: 'l-5-1-tests',
      type: 'ai',
      title: 'AI for Test Generation — Context-Heavy Prompts',
      mentalModel: {
        vi: `<strong>Test sinh từ AI thường shallow</strong> vì AI không biết edge case của BẠN. Cách fix: prompt phải chứa (1) class under test full source, (2) interface của dependencies, (3) DANH SÁCH edge case bạn muốn cover.
<br/><br/>
<strong>Quy tắc</strong>: AI giỏi nhất khi bạn ĐÃ nghĩ ra edge case + cung cấp context. AI tệ khi bạn để nó tự suy luận edge case.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Tại sao AI test shallow?</h3>

<strong>1) AI thiếu domain context</strong>
LLM thấy class <code>OrderService</code>. KHÔNG biết business rule: "VND không có cents", "max 100 items per order", "VIP customer free shipping over 50k". Bạn phải FEED rules.
<br/><br/>
<strong>2) AI default sinh test happy path</strong>
Training data nhiều test "should_returnX_when_input_is_Y" — happy path. Edge case (null, empty, race condition, OutOfMemory) hiếm xuất hiện trong public code. AI default theo distribution.
<br/><br/>
<strong>3) Context window decay</strong>
Prompt dài → AI có thể quên đầu prompt. Quan trọng đặt EDGE CASE list ở CUỐI prompt (gần response area) để model attention focus.
<br/><br/>
<strong>4) Test quality = prompt quality</strong>
Garbage in, garbage out. Prompt rõ → test rõ. Prompt mơ hồ → test generic không cover bug thực sự.
<br/><br/>
<strong>5) Tradeoff: AI tests vs hand-written</strong>
AI tests fast ban đầu. NHƯNG: KHÔNG hiểu nuance → khi refactor, test maintainability kém. Strategy: AI scaffold + bạn refine.`
      },
      theory: {
        vi: `<h3>The "Why" — AI tests vs hand-write</h3>
<ul>
  <li><strong>AI scaffold</strong>: tốc độ 10× cho boilerplate (mock setup, AAA structure, assertions).</li>
  <li><strong>Hand refine</strong>: edge case domain-specific, naming theo convention team.</li>
  <li>Pattern đúng: AI sinh 80% → bạn review + thêm 20% edge case → commit.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>"Write tests for this class"</strong> mà KHÔNG cung cấp dependencies → AI mock random → test fail compile.</li>
  <li><strong>Accept AI tests blindly</strong> → 100 test cùng pattern shallow, KHÔNG cover thực bug.</li>
  <li><strong>AI dùng method/library không tồn tại</strong> (hallucination) → tests không compile. Verify imports.</li>
  <li><strong>Mock everything</strong> → test thật ra test mock, KHÔNG test logic. Cân bằng.</li>
  <li><strong>Test name generic AI sinh</strong>: "test1, test2" — fail message vô dụng. Rename.</li>
  <li><strong>Quên integration test</strong> — AI default unit test. Bạn phải explicitly ask.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Unit Test] Generator với edge case explicit',
          prompt: `Bạn là Senior Java engineer. Viết JUnit 5 + Mockito + AssertJ test cho class dưới đây.

CLASS UNDER TEST:
[paste full source]

DEPENDENCIES (interfaces only):
[paste each interface or constructor param]

CONVENTION:
- 1 test class per class, suffix Test.
- Method naming: should<Behavior>_when<Condition>.
- AAA structure (Arrange-Act-Assert), blank line giữa các phần.
- Mock mọi dependency, KHÔNG spin Spring context.
- AssertJ assertions, KHÔNG JUnit assertions.

EDGE CASES PHẢI COVER:
1. Happy path với default input.
2. Empty/null input nơi áp dụng.
3. Validation error throw.
4. Dependency throw exception → service translate đúng.
5. Boundary (0, -1, MAX_INT, MIN_INT) nếu áp dụng.
6. [Add bài cụ thể của tôi: ví dụ "Concurrent stock decrement", "VND order không có cents"]

Output CHỈ test class. Không giải thích.`
        },
        {
          title: '[Integration Test] Testcontainers Postgres',
          prompt: `Viết @SpringBootTest cho [ControllerName] với:
- Testcontainers Postgres 16-alpine
- WebEnvironment.RANDOM_PORT
- TestRestTemplate
- @Sql seed từ /test-data.sql

ENDPOINTS PHẢI COVER:
[list endpoints với method + path]

PER ENDPOINT ASSERTIONS:
- 200/201 happy path, assert shape qua JSONPath.
- 400 khi validation fail.
- 401 khi thiếu auth.
- 403 khi sai role.
- 404 khi resource không tồn tại.

Use @DynamicPropertySource override DataSource. Add @BeforeEach reset state.

Không sinh test cho endpoint không list. Không cover edge case ngoài list.`
        },
        {
          title: '[Repository Test] @DataJpaTest + Testcontainers',
          prompt: `Viết @DataJpaTest cho [RepositoryName] với Testcontainers Postgres.

PHẢI TEST:
1. Custom query method (search, findByX) — assert result correct.
2. Pagination — return Page với content + totalElements đúng.
3. @Modifying @Query update/delete — return affected count.
4. Constraint violation (UNIQUE, FK) — throw DataIntegrityViolationException.
5. JOIN FETCH không trigger N+1 (assert query count với @Sql + Hibernate stats).

Seed data qua @Sql. KHÔNG dùng H2 — phải Testcontainers Postgres.

Output CHỈ test class.`
        },
        {
          title: '[Test Review] Kiểm tra chất lượng',
          prompt: `Tôi vừa nhận test từ AI. Trước khi commit, REVIEW giúp tôi như senior code reviewer:

[PASTE generated tests]

CRITIC theo 6 lens:
1. Coverage: test có cover happy + 3 edge case major không?
2. Naming: method name describe behavior + condition?
3. AAA: Arrange-Act-Assert tách rõ?
4. Mock setup: mock đủ, không over-mock?
5. Assertion: check shape + value, không chỉ NotNull?
6. Maintainability: nếu refactor class, test breaks bao nhiêu?

Output: severity (BLOCKER/MAJOR/MINOR) per finding. Suggest fix.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Test quality review',
          prompt: `AI viết xong test. KHÔNG accept ngay. Hỏi tôi:
1. Test có cover happy path KHÔNG đủ — có test edge case nào?
2. Assertion chỉ check status, hay cả response body?
3. Mock setup quá "happy" — có test khi dependency throw không?
4. Test có dependent thứ tự không (state leak giữa test)?
5. Test name có đọc được không, hay generic "test1", "test2"?
Review từng test theo 5 tiêu chí.`
        }
      ]
    },

    {
      id: 'l-5-1-debug',
      type: 'ai',
      title: 'AI for Debugging — Triage Prompts',
      mentalModel: {
        vi: `<strong>Debug với AI</strong> không phải "paste error → cho fix". Đó là copy-paste workflow tệ. Đúng:
<ol>
<li>Paste stack trace + relevant code + config.</li>
<li>Bắt AI IDENTIFY root cause + EXPLAIN cơ chế.</li>
<li>Show minimal fix.</li>
<li>List "related mistakes" để học rộng hơn.</li>
</ol>
Triage = phân loại + diagnose, không phải patch.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Tại sao AI debug đôi khi sai?</h3>

<strong>1) AI thấy stack trace nhưng không thấy environment</strong>
Stack trace nói "NPE at line 42". AI đoán nguyên nhân từ pattern. Nhưng thật sự có thể là <em>config mismatch</em>, <em>race condition</em>, <em>library version conflict</em> — info không có trong stack.
<br/><br/>
<strong>2) Common bug → AI biết</strong>
NullPointer, ClassCast, ConcurrentModification — common trong training data → AI diagnose tốt.
<br/><br/>
<strong>3) Rare bug → AI bịa</strong>
Library bug, JVM bug, OS-specific issue — AI hallucinate plausible nhưng SAI. Verify với issue tracker chính thức.
<br/><br/>
<strong>4) Quick fix vs root cause</strong>
AI default suggest "quick fix" (add null check) thay vì "root cause fix" (tại sao field null?). Bạn phải explicitly ask "root cause".
<br/><br/>
<strong>5) Spring/JPA error đặc trưng</strong>
Stack trace Spring siêu dài (50+ frames AOP). AI tốt với "common Spring errors" — N+1, LazyInit, BeanCreationException. Tệ với "edge case interaction" giữa 3 framework.`
      },
      theory: {
        vi: `<h3>The "Why" — Debug pattern</h3>
<ul>
  <li><strong>Identify component</strong>: dòng error nào nói component nào throw?</li>
  <li><strong>Reproduce</strong>: viết minimal test reproduce → confirm hypothesis.</li>
  <li><strong>Root cause vs symptom</strong>: NPE là symptom. Tại sao field null?</li>
  <li><strong>Fix layer</strong>: fix tại source (validate sớm) hay catch downstream?</li>
  <li><strong>Prevent</strong>: học gì để KHÔNG bug này nữa?</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Paste error → copy AI fix → áp dụng</strong> mà không hiểu → fix symptom, root cause vẫn còn.</li>
  <li><strong>Không cung cấp version</strong> — AI dùng API deprecated trong Spring Boot 3.</li>
  <li><strong>Không reproduce</strong> — fix có thể "work" trên dev nhưng không phải root cause.</li>
  <li><strong>AI bịa method tồn tại</strong> — hallucination. Verify trên Spring docs.</li>
  <li><strong>Quên check log</strong> — error message có thể incomplete; full log có context.</li>
  <li><strong>Dùng AI thay vì <code>git log</code></strong> — đôi khi bug do commit gần đây. git blame nhanh hơn.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Debug] Stack trace triage',
          prompt: `Tôi đang gặp lỗi này trong Spring Boot 3.3:

STACK TRACE:
[paste full stack]

CODE LIÊN QUAN:
[paste class referenced]

application.yml:
[paste relevant config]

Yêu cầu:
1. Identify root cause trong 1 câu.
2. Giải thích VÌ SAO lỗi xảy ra (cơ chế Spring/JPA/Security bên dưới).
3. Show minimal code change để fix.
4. List 2 lỗi liên quan tôi dễ mắc tiếp + cách tránh.

KHÔNG copy lại toàn bộ stack — chỉ trỏ dòng quan trọng.`
        },
        {
          title: '[Debug] N+1 query detection',
          prompt: `Tôi nghi ngờ code này có N+1 query. Xác nhận hoặc bác bỏ với lý do.

CODE:
[paste service method + entities]

HIBERNATE LOG (show_sql enabled):
[paste vài giây log SQL]

Nếu có N+1:
- Chỉ chỗ lazy access đang trigger query.
- Fix: JOIN FETCH, EntityGraph, hoặc @BatchSize — đề xuất cách phù hợp NHẤT cho case này.
- Ước tính giảm query: "1 + n → 1" hay "1 + n → 2 (batch 50)".

Nếu KHÔNG phải N+1 mà chậm vì lý do khác — chỉ ra.`
        },
        {
          title: '[Debug] Concurrent / race condition',
          prompt: `Tôi gặp bug INTERMITTENT trong production. Local KHÔNG reproduce.

SYMPTOMS:
[describe — vd "stock đôi khi âm dù check trước"]

CODE:
[paste service method + entity]

REQUIREMENTS:
1. Hypothesis về race condition: lúc nào 2+ thread interleave gây bug?
2. Cách reproduce trong test (CountDownLatch + ExecutorService).
3. Fix: pessimistic lock, optimistic @Version, hay distributed lock?
4. Trade-off của mỗi cách (perf vs simplicity)?
5. Test sau fix — assert invariant nào?

Đừng đoán mò. Phân tích step-by-step interleave 2 thread.`
        },
        {
          title: '[Debug] Performance regression',
          prompt: `Endpoint từ 200ms → 2s sau deploy hôm qua. KHÔNG có error.

INFO:
- Endpoint: [path]
- Code thay đổi gần đây: [git diff hoặc commits]
- Database size unchanged.
- Hibernate log: [paste]

DIAGNOSE step-by-step:
1. Top 3 suspect dựa trên diff (N+1 mới, missing index, blocking call)?
2. Cách verify từng suspect: EXPLAIN ANALYZE? Hibernate stats? Profiler?
3. Fix mỗi suspect ra sao?
4. Prevention: monitoring nào catch sớm hơn?

Không jump to conclusion. Hypothesis → verify → fix.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Debug mindset',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Khi gặp bug, phản xạ đầu tiên là gì? Đọc log? Reproduce? Hỏi AI? Stack Overflow?
2. "It works on my machine" — vì sao environment khác nhau gây bug?
3. Bug intermittent (1/100 lần fail) — chiến lược điều tra?
4. Bisect (git bisect) — khi nào dùng?
5. Log statement: print everywhere vs debugger break point — chọn cái nào, khi nào?`
        }
      ]
    },

    {
      id: 'l-5-1-refactor',
      type: 'ai',
      title: 'AI for Safe Refactoring — Constrained Prompts',
      mentalModel: {
        vi: `Sai lầm phổ biến: "refactor giúp class này" → AI viết lại từ đầu, behavior khác chút, bạn không biết khác chỗ nào. Cách đúng: <strong>constrain phạm vi</strong> + <strong>bắt AI mô tả change TRƯỚC khi paste code</strong>.
<br/><br/>
Refactor = thay đổi STRUCTURE không thay đổi BEHAVIOR. Test trước + sau phải PASS.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Refactor an toàn</h3>

<strong>1) Refactor != rewrite</strong>
Refactor: small steps, test xanh sau mỗi step. Rewrite: throw away + start fresh — risk cao, behavior drift.
<br/><br/>
<strong>2) Test as safety net</strong>
KHÔNG refactor mà thiếu test. Test xanh trước → refactor → test xanh sau = bảo đảm behavior preserved.
<br/><br/>
<strong>3) AI default sang "rewrite"</strong>
"Refactor class" → AI sinh class mới từ đầu. Có thể logic thay đổi subtle. Constrain: "ONLY refactor method X, KHÔNG đổi signature".
<br/><br/>
<strong>4) "Describe before paste"</strong>
Bắt AI tóm tắt change trước khi xuất code → bạn review intent. Nếu sai → reject sớm. Nếu đúng → expect code matches description.
<br/><br/>
<strong>5) Diff vs full rewrite</strong>
Ask AI return DIFF (unified format), KHÔNG full file. Easier review, easier verify mental model.`
      },
      theory: {
        vi: `<h3>The "Why" — Constrained refactor prompts</h3>
<ul>
  <li>Without constraint: AI rewrite freely → behavior drift.</li>
  <li>With constraint (signature, dependencies, exceptions, side effects): preserved behavior.</li>
  <li>Pattern: "Refactor X to be more Y, BUT preserve Z" — explicit invariants.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>"Make this code better"</strong> — AI tùy ý interpret "better" → có thể introduce abstraction premature.</li>
  <li><strong>Refactor without test</strong> → silent regression.</li>
  <li><strong>Accept AI refactor without comparing diff</strong> → miss subtle change.</li>
  <li><strong>Refactor + new feature trong cùng commit</strong> → khó review, khó revert.</li>
  <li><strong>Refactor toàn class trong 1 commit lớn</strong> → reviewer impossible. Small commits.</li>
  <li><strong>"Optimize for performance" without benchmark</strong> — micro-optimization có thể slow hơn JIT.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Refactor] Safe refactor 1 method',
          prompt: `Refactor method dưới đây KHÔNG đổi public behavior, KHÔNG đổi signature.

CODE HIỆN TẠI:
[paste]

GOAL (priority):
1. Giảm cyclomatic complexity.
2. Extract private helper (tên verb-noun).
3. Thay nested if-else bằng guard clause hoặc polymorphism nếu hợp.
4. Giữ NGUYÊN exception throw, side effect, log.

CONSTRAINT:
- KHÔNG đổi signature method.
- KHÔNG thêm dependency mới.
- KHÔNG reflection, KHÔNG framework magic.
- Cho phép Java 21: record, pattern matching, switch expression.

OUTPUT (theo thứ tự):
1. 1 đoạn paragraph mô tả change.
2. Refactored code.
3. Bullet list "behavior giữ nguyên" để tôi sanity check.`
        },
        {
          title: '[Refactor] Extract service từ god class',
          prompt: `Class này quá lớn (1000+ lines). Tách thành nhiều service nhỏ.

CODE:
[paste class]

REQUIREMENTS:
1. Identify Bounded Contexts trong class (vd: "user management", "billing", "notification").
2. Suggest 3-5 service mới với:
   - Tên service (theo bounded context).
   - Method nào chuyển từ class gốc sang.
   - Dependency injection update ra sao.
3. Migration plan: small steps để KHÔNG break production. Test sau mỗi step.
4. List risk: API change cho callers, transaction boundary, ...

KHÔNG output toàn bộ code refactored — chỉ skeleton + first method per service.`
        },
        {
          title: '[Refactor] Replace nested if với polymorphism',
          prompt: `Method dưới có chain if-else trên enum/type. Refactor sang Strategy pattern.

CODE:
[paste method với chain if-else]

REQUIREMENTS:
1. Identify "type switch" — biến nào dispatch?
2. Tách thành interface + concrete impl per case.
3. Caller dùng polymorphism: <code>strategy.execute()</code>.
4. KHÔNG đổi public API caller hiện tại.
5. Test trước/sau preserve cùng behavior.

Trade-off: code lines tăng nhưng SOLID better. Show tôi diff so sánh.`
        },
        {
          title: '[Refactor] Convert sang record (Java 21)',
          prompt: `Class POJO dưới đây — convert sang Java record.

CODE:
[paste POJO với fields + getter/setter/equals/hashCode]

CHECK trước khi convert:
1. Class có mutable state không? Record IMMUTABLE — KHÔNG convert được.
2. Có inheritance? Record final — KHÔNG extend.
3. Field nào nullable? Record allow nhưng nên explicit.
4. equals/hashCode custom? Record auto-generate — confirm OK.

Nếu PHÙ HỢP: show record version + migration cho callers.
Nếu KHÔNG PHÙ HỢP: giải thích vì sao + alternative (sealed class? value type?).`
        }
      ],
      socraticPrompts: [
        {
          title: 'Refactor decision framework',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Refactor vì sao bây giờ? Code work — có cần thiết?
2. Test coverage hiện tại — đủ làm safety net?
3. Scope: 1 method, 1 class, hay multiple? Small step?
4. Behavior preserved — verify bằng cách nào?
5. Reviewer dễ review không? Commit nhỏ?`
        }
      ]
    }
  ],
  references: [
    { title: 'Anthropic Prompt Engineering Guide', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview' },
    { title: 'OpenAI Prompt Cookbook', url: 'https://cookbook.openai.com/' },
    { title: 'Active Recall research (Karpicke)', url: 'https://en.wikipedia.org/wiki/Active_recall' }
  ]

}
