// Module 5.2 — AI for Architecture & Code Review
export default {
  id: 'mod-5-2',
  title: 'AI for Architecture & Code Review',
  prerequisites: { vi: 'Hoàn thành <strong>ít nhất 1 capstone Phase 4</strong>. Có codebase Spring Boot để review.' },
  lessons: [
    {
      id: 'l-5-2-arch',
      type: 'ai',
      title: 'Using AI to Explain & Critique Architecture',
      mentalModel: {
        vi: `Khi join team mới, codebase lạ → mất 2-4 tuần để hiểu. AI có thể giảm xuống 2-3 ngày NẾU bạn biết hỏi đúng.
<br/><br/>
3 use case chính:
<ol>
<li><strong>Code tour</strong> — AI tổng hợp architecture từ package tree + sample controller.</li>
<li><strong>Trade-off analysis</strong> — chọn giữa 2 design alternative.</li>
<li><strong>Architectural smell detection</strong> — god class, anemic domain, layering violation.</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>First Principles — AI hiểu architecture ra sao?</h3>

<strong>1) AI pattern-match từ training data</strong>
LLM thấy package <code>controller/</code>, <code>service/</code>, <code>repository/</code> → recognize "layered architecture" từ patterns trong training. Hiểu BỀ NỔI.
<br/><br/>
<strong>2) AI KHÔNG biết business context</strong>
Codebase "WidgetService" — AI không biết "Widget" là sản phẩm IoT hay UI component. Bạn phải brief.
<br/><br/>
<strong>3) AI KHÔNG có persistent memory</strong>
Mỗi chat session reset. Onboard liên tục → ghi lại "team conventions" vào personal Markdown file → paste vào prompt mỗi lần.
<br/><br/>
<strong>4) Architectural smell phát hiện tốt</strong>
God class, anemic domain, circular dependency — pattern phổ biến trong training. AI flag được. Nhưng "smell hợp lý cho context này" — AI không phân biệt được.
<br/><br/>
<strong>5) Trade-off analysis — AI list được pros/cons nhưng KHÔNG quyết được</strong>
Cuối cùng decision là CỦA BẠN, dựa trên team size, SLA, infra hiện có. AI là sounding board, KHÔNG là decision maker.
<br/><br/>
<strong>6) Verify recommendation</strong>
AI suggest "dùng CQRS pattern" — đúng cho hệ thống write-heavy nhưng OVERKILL cho CRUD đơn giản. Verify với context project.`
      },
      theory: {
        vi: `<h3>The "Why" — AI onboarding vs reading code mù</h3>
<ul>
  <li>Code 50k lines — đọc mỗi file: 2 tuần.</li>
  <li>AI tour: bạn chỉ đọc representative samples → AI tổng hợp pattern → 2 ngày overview.</li>
  <li>Catch: AI có thể SAI. Verify với senior team member.</li>
</ul>

<h3>Khi nào AI architecture giúp ích nhất</h3>
<ul>
  <li>Join project mới — nhanh chóng tổng quan.</li>
  <li>So sánh 2 design alternative trước khi commit.</li>
  <li>Code review architecture-level (vs syntax-level).</li>
  <li>Document existing system cho new hire.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Tin AI 100% về architecture</strong> → AI miss business context. Verify với team lead.</li>
  <li><strong>Áp dụng pattern AI suggest</strong> blindly → over-engineering (DDD cho CRUD app).</li>
  <li><strong>KHÔNG cung cấp context</strong> (team size, SLA, infra) → AI suggest generic.</li>
  <li><strong>Hỏi AI thay vì hỏi senior</strong> → mất cơ hội build relationship.</li>
  <li><strong>Skip code reading</strong> hoàn toàn → KHÔNG hiểu nuance, KHÔNG ownership.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Onboard] Code tour 30 phút',
          prompt: `Tôi mới join team, codebase Spring Boot lạ. Cho tôi tour.

PACKAGE TREE:
[paste tree -L 3]

MAIN CLASS:
[paste @SpringBootApplication class]

1 CONTROLLER + 1 SERVICE + 1 REPO ĐẶC TRƯNG:
[paste]

Yêu cầu:
1. Vẽ kiến trúc layered bằng English plain (không buzzword).
2. Identify convention LẠ (custom annotation, aspect, base class).
3. List 5 câu hỏi tôi NÊN hỏi original author trước khi sửa.
4. Highlight architectural smell (god class, anemic domain, layering violation).
5. Highlight pattern HAY tôi nên học từ codebase này.`
        },
        {
          title: '[Trade-off] So sánh 2 design',
          prompt: `Tôi cần chọn giữa 2 design cho [feature].

OPTION A:
[paste design + sketch + pros bạn nghĩ]

OPTION B:
[paste design + sketch + pros bạn nghĩ]

CONTEXT:
- Team size: [N] engineer.
- QPS dự kiến: [Q].
- SLA: [...].
- Infra hiện có: [...].
- Deadline: [...].

Per option:
- Lý do MẠNH NHẤT để chọn.
- Lý do MẠNH NHẤT để bỏ.
- Cost ẩn team thường miss.
- Reversibility: chuyển sang option kia sau 1 năm — đau ra sao?

Kết: recommendation + DECIDING factor (1 lý do quyết định).`
        },
        {
          title: '[Architecture] Detect smell',
          prompt: `Class/module dưới đây có vẻ "off" nhưng tôi chưa rõ tại sao.

CODE:
[paste class hoặc package summary]

CHECK theo checklist architectural smell:
1. God class (>500 lines, nhiều unrelated responsibility)?
2. Anemic domain (entity chỉ getter/setter, business logic ở service)?
3. Layering violation (controller gọi repo trực tiếp, repo gọi service)?
4. Circular dependency (A → B → A)?
5. Inappropriate intimacy (class biết quá nhiều về internal class khác)?
6. Long parameter list (>4 param)?
7. Feature envy (method dùng nhiều field của class khác hơn class chứa nó)?

Per smell found: severity (BLOCKER/MAJOR/MINOR) + 1 refactor suggestion.`
        },
        {
          title: '[Documentation] Generate ADR (Architectural Decision Record)',
          prompt: `Tôi vừa quyết định [decision, vd: "dùng PostgreSQL thay vì MongoDB"]. Viết ADR document.

CONTEXT:
- Project: [name + brief]
- Stage: [MVP / Growth / Scale]
- Team: [size + experience]

DECISION:
[Quyết định cụ thể]

REASONS:
[Lý do chính 3-5 ý]

FORMAT ADR:
1. Title: ADR-XXX: [decision]
2. Status: Accepted / Superseded / Deprecated
3. Context: vấn đề + constraint
4. Decision: chọn cái gì + tại sao
5. Consequences: positive + negative + neutral
6. Alternatives considered: list options khác + lý do bỏ

Output Markdown ready để commit.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Onboarding strategy',
          prompt: `Tôi vừa join team. KHÔNG cho đáp án. Hỏi tôi:
1. Tuần đầu tôi nên ưu tiên gì — đọc code, gặp người, hay viết code đầu tiên?
2. Tài liệu nào tôi MUST đọc? README, ADR, runbook?
3. Question naive nào tôi NÊN hỏi ngay vs save sau? (Sợ "look stupid")
4. PR đầu tiên — scope thế nào? Bug fix nhỏ hay refactor lớn?
5. Sau 1 tháng — milestone hiểu architecture là gì?`
        }
      ]
    },

    {
      id: 'l-5-2-review',
      type: 'ai',
      title: 'AI-Assisted Code Review on Your Own PRs',
      mentalModel: {
        vi: `Trước khi send PR cho teammate, run qua AI với reviewer-style criteria. Catch stuff obvious yourself → senior reviewer focus on architectural feedback, không waste time với typo.
<br/><br/>
6 review lens:
<ol>
<li>Correctness — implement đúng ticket?</li>
<li>Edge cases — null, empty, concurrent, transaction boundary.</li>
<li>Test coverage — branch quan trọng có test?</li>
<li>Security — input validation, authn/authz, secret.</li>
<li>Performance — N+1, allocation thừa, blocking call.</li>
<li>Readability — naming, layering, comment.</li>
</ol>`
      },
      underTheHood: {
        vi: `<h3>First Principles — Self-review chất lượng</h3>

<strong>1) AI thấy CODE nhưng KHÔNG thấy intent</strong>
PR diff cho AI thấy "what changed". Nhưng KHÔNG biết "why". Bạn brief context (ticket, business reason) → AI feedback relevant hơn.
<br/><br/>
<strong>2) AI tốt cho "obvious mistake"</strong>
Missing null check, off-by-one, unclosed resource, SQL injection pattern. Common in training data → high accuracy.
<br/><br/>
<strong>3) AI tệ cho "nuanced design decision"</strong>
"Sao không dùng Strategy pattern?" — đúng generally nhưng có thể OVERKILL cho 1 case duy nhất. Trade-off cần human judgment.
<br/><br/>
<strong>4) Severity tagging</strong>
Bắt AI tag BLOCKER/MAJOR/MINOR/NIT → bạn priorize fix. Blockers fix trước push; nits có thể leave cho human reviewer.
<br/><br/>
<strong>5) Self-review không thay code review</strong>
AI self-review = first pass. Human review vẫn cần — catch architectural issues, business logic, team conventions.`
      },
      theory: {
        vi: `<h3>The "Why" — Pre-commit self-review</h3>
<ul>
  <li>Catch obvious bug trước khi reviewer thấy → save reviewer time.</li>
  <li>Learn pattern: review nhiều → biết tự tránh.</li>
  <li>Confidence: ship code biết đã pass quality bar cơ bản.</li>
  <li>Reduce review iteration: PR cleaner → merge nhanh hơn.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Tin AI 100% finding</strong> → AI suggest "add null check" nhưng field KHÔNG bao giờ null theo invariant. Verify trước fix.</li>
  <li><strong>Fix mọi nit AI raise</strong> → PR phình to, mất focus. Chỉ fix BLOCKER/MAJOR pre-submit.</li>
  <li><strong>Skip senior review</strong> sau khi AI pass → miss high-level feedback.</li>
  <li><strong>Không brief context</strong> — AI review without intent → flag valid pattern as "smell".</li>
  <li><strong>Self-review cùng AI bạn vừa code với</strong> — bias. Open new chat session.</li>
</ul>`
      },
      prompts: [
        {
          title: '[Review] PR self-check',
          prompt: `Review diff dưới đây như staff Java engineer khó tính.

DIFF:
[paste git diff]

TICKET CONTEXT:
[1 paragraph: feature đang làm, business reason]

Áp dụng 6 lens theo thứ tự:
1. Correctness — implement đúng ticket; logic bug?
2. Edge case — null, empty, concurrent, transaction boundary.
3. Test coverage — branch quan trọng có test?
4. Security — input validation, authn/authz, secret handling.
5. Performance — N+1, allocation thừa, blocking call.
6. Readability — naming, layering, comment.

Per finding: severity (BLOCKER/MAJOR/MINOR/NIT), 1-sentence description, fix gợi ý.

KHÔNG missing finding important. Cũng KHÔNG nitpick nếu không cần.`
        },
        {
          title: '[Review] Security-focused',
          prompt: `Review code dưới với mindset security engineer.

CODE:
[paste code, especially controller / service layer]

CHECK OWASP Top 10:
1. Injection (SQL, NoSQL, command, LDAP)?
2. Broken authentication / session?
3. Sensitive data exposure (log secret, return password)?
4. XML/JSON external entity (XXE)?
5. Broken access control (missing @PreAuthorize, IDOR)?
6. Security misconfiguration (default password, exposed admin endpoint)?
7. XSS (return user input không escape)?
8. Insecure deserialization?
9. Component with known vulnerability (dep với CVE)?
10. Insufficient logging (KHÔNG log security event)?

Per finding: severity + exploit scenario + fix.`
        },
        {
          title: '[Review] Performance-focused',
          prompt: `Review code dưới cho performance issue.

CODE:
[paste]

CHECK:
1. Database: N+1, missing index, full table scan, bulk vs single?
2. Memory: collection grow unbounded, autoboxing in tight loop, large object retention?
3. Concurrency: synchronized over-broad, lock contention, blocking call in async context?
4. Algorithm: O(n²) where O(n) possible?
5. IO: sync file/network in request thread, no streaming for large data?
6. Cache: missing cache opportunity, stale cache?

Per finding: severity + benchmark estimate + fix.`
        },
        {
          title: '[Review] Test quality review',
          prompt: `Review unit/integration test trong PR này.

TEST CODE:
[paste tests]

PRODUCTION CODE BEING TESTED:
[paste class under test — chỉ phần modified]

CHECK:
1. Coverage: happy + edge case major?
2. Test name: <code>should_X_when_Y</code> readable?
3. AAA: Arrange-Act-Assert tách rõ?
4. Mock: setup minimum, no over-mock?
5. Assertion: shape + value, không chỉ NotNull?
6. Independence: test KHÔNG phụ thuộc thứ tự, không share state?
7. Realistic: data setup phản ánh production case?

Per finding: severity + fix.`
        }
      ],
      socraticPrompts: [
        {
          title: 'Code review checklist',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Diff thay đổi public API? Backward compatible?
2. Có migration DB? Rollback strategy?
3. Test mới cover happy + sad path?
4. Performance: query mới? Index?
5. Log mới: lộ thông tin nhạy cảm không?
6. TODO/FIXME mới — đã ticket chưa?
7. Behavior thay đổi — update doc/README?
Self-audit từng câu.`
        }
      ]
    }
  ],
  references: [
    { title: 'ADR (Michael Nygard original)', url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions' },
    { title: 'OWASP Top 10 (2021)', url: 'https://owasp.org/Top10/' },
    { title: 'Spring Framework Code Style', url: 'https://github.com/spring-projects/spring-framework/wiki/Code-Style' },
    { title: 'Joel on Software -Code Reviews', url: 'https://www.joelonsoftware.com/2007/03/22/seven-steps-to-remarkable-customer-service/' }
  ]

}
