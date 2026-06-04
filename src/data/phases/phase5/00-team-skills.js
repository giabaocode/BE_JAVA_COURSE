// Module 5.0 — Team Skills: Git Collaboration + Jira/Agile + Code Review
// Mục đích: skill mà 100% công ty expect nhưng bootcamp ít dạy.
export default {
  id: 'mod-5-0',
  title: 'Team Skills — Git Workflow, Jira/Agile, Code Review Etiquette',
  prerequisites: { vi: 'Hoàn thành <strong>ít nhất 1 capstone Phase 4</strong>. Đã có git history thực để luyện workflow.' },
  lessons: [
    {
      id: 'l-5-0-1',
      type: 'theory',
      title: 'Git Workflow — Branch, PR, Merge Conflict trong team',
      subtitle: { vi: 'Git solo và Git team là 2 môn khác nhau. Bài này cover team workflow.' },
      mentalModel: {
        vi: `Git solo: commit, push main, xong.
<br/>
Git team: branch, PR, review, conflict, rebase vs merge, hotfix, release. Mỗi step có nguyên tắc + lỗi điển hình.
<br/><br/>
Có 3 workflow chính:
<ul>
  <li><strong>GitHub Flow</strong> (đơn giản): main + feature branch + PR + merge. Continuous deployment.</li>
  <li><strong>Git Flow</strong> (cồng kềnh): develop + main + feature + release + hotfix. Cho sản phẩm release theo phiên bản.</li>
  <li><strong>Trunk-based</strong>: mọi người commit thẳng main + feature flag. Cần CI tốt + test coverage cao.</li>
</ul>
Hầu hết startup VN dùng <strong>GitHub Flow</strong> — bài này tập trung vào nó.`
      },
      underTheHood: {
        vi: `<h3>GitHub Flow chuẩn (7 bước)</h3>
<pre>1) git checkout main
   git pull origin main                    # sync latest
2) git checkout -b feat/add-coupon         # branch từ main, naming convention
3) [code, code, code]
   git add .
   git commit -m "feat(checkout): add coupon validation"
4) git push -u origin feat/add-coupon
5) Tạo Pull Request trên GitHub UI
6) Reviewer comment, request changes → bạn push commit mới
7) Approved → Squash and merge → branch xóa</pre>

<h3>Branch naming convention</h3>
<ul>
  <li><code>feat/...</code> — feature mới (vd <code>feat/jwt-auth</code>)</li>
  <li><code>fix/...</code> — bug fix (vd <code>fix/null-pointer-cart</code>)</li>
  <li><code>refactor/...</code> — refactor không đổi behavior</li>
  <li><code>chore/...</code> — config, CI, deps</li>
  <li><code>hotfix/...</code> — fix khẩn cấp trên production</li>
  <li><code>docs/...</code> — chỉ đổi docs</li>
</ul>

<h3>Commit message — Conventional Commits</h3>
<pre>&lt;type&gt;(&lt;scope&gt;): &lt;subject&gt;

[body optional]

[footer optional]

# Ví dụ:
feat(auth): add JWT refresh token endpoint

- Add POST /auth/refresh
- Refresh token TTL 7 days
- Old token invalidated on use

Closes #142</pre>

Type: feat, fix, refactor, docs, style, test, chore, perf, ci.
<br/>
Tools: <code>commitlint</code> + <code>husky</code> enforce convention.

<h3>Merge conflict — bình tĩnh</h3>
Conflict xảy ra khi 2 branch sửa cùng dòng. Git mark:
<pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
your code
=======
their code
&gt;&gt;&gt;&gt;&gt;&gt;&gt; main</pre>
Quy trình resolve:
<ol>
  <li><code>git status</code> xem file nào conflict.</li>
  <li>Mở từng file, đọc 2 phiên bản, quyết định: giữ A, giữ B, hay merge cả 2.</li>
  <li>Xóa marker (<code>&lt;&lt;&lt;</code> ... <code>&gt;&gt;&gt;</code>).</li>
  <li><code>git add &lt;file&gt;</code> đánh dấu resolved.</li>
  <li>Test toàn bộ — conflict resolve có thể tạo logic bug.</li>
  <li><code>git commit</code> (Git tự generate message) hoặc <code>git rebase --continue</code>.</li>
</ol>

<h3>Rebase vs Merge — cuộc chiến muôn đời</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px"></th>
<th style="border:1px solid #ccc;padding:6px">git merge main</th>
<th style="border:1px solid #ccc;padding:6px">git rebase main</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px">Lịch sử</td><td style="border:1px solid #ccc;padding:6px">Có merge commit, history "nhiều nhánh"</td><td style="border:1px solid #ccc;padding:6px">Linear, gọn</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">An toàn</td><td style="border:1px solid #ccc;padding:6px">An toàn (không sửa commit cũ)</td><td style="border:1px solid #ccc;padding:6px">Phải force-push, RISK</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Khi nào</td><td style="border:1px solid #ccc;padding:6px">Sync branch người khác cùng làm</td><td style="border:1px solid #ccc;padding:6px">Local feature branch, làm 1 mình</td></tr>
</table>

<strong>Quy tắc vàng</strong>: KHÔNG rebase branch ai khác đang cùng làm. Force-push ghi đè commit của họ.

<h3>Pull Request best practice</h3>
<ul>
  <li><strong>PR ngắn</strong>: &lt; 400 dòng diff. PR &gt; 1000 dòng → reviewer skim → bug lọt.</li>
  <li><strong>1 PR = 1 logical change</strong>: refactor + feature trong cùng PR → khó review.</li>
  <li><strong>Description rõ</strong>: What, Why, How tested. Screenshot nếu UI.</li>
  <li><strong>Self-review trước</strong>: đọc PR diff của mình trên GitHub UI trước khi tag reviewer — 50% lỗi tự thấy.</li>
  <li><strong>Reviewer 1-2 người</strong> đủ. Quá nhiều reviewer → không ai chịu trách nhiệm.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Push thẳng main</strong>: protected branch sẽ chặn. Nếu không protected → vẫn KHÔNG nên.</li>
  <li><strong>Commit hugh "WIP"</strong>: 1 commit chứa 50 file thay đổi đủ loại. → Commit nhỏ, mỗi commit 1 mục đích.</li>
  <li><strong>force-push branch shared</strong>: ghi đè commit người khác → mất công.</li>
  <li><strong>git pull mà không pull --rebase</strong>: tạo merge commit không cần thiết khi branch khác đã có commit mới.</li>
  <li><strong>Conflict resolve "chọn của tôi" cho an toàn</strong> → mất code đồng đội.</li>
  <li><strong>Commit credentials/.env</strong>: leaked Git history vĩnh viễn. Dùng <code>.gitignore</code> + <code>git-secrets</code>.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao GitHub Flow chiến thắng?</h3>
<ul>
  <li><strong>Đơn giản</strong>: 2 loại branch (main + feature). Không "develop" "release" rối rắm.</li>
  <li><strong>CI/CD friendly</strong>: merge PR → auto deploy staging → auto deploy prod (sau approval).</li>
  <li><strong>PR-centric</strong>: code review là barrier chính. Mỗi commit vào main đã có ≥ 2 mắt review.</li>
</ul>

<h3>Lệnh Git cần thuộc lòng (Top 20)</h3>
<pre># Daily
git status                                # luôn check trước khi action
git diff                                  # xem thay đổi chưa stage
git diff --staged                         # xem thay đổi đã stage
git add . / git add &lt;file&gt;                # stage
git commit -m "..."                       # commit
git log --oneline -20                     # xem 20 commit gần nhất

# Branch
git branch                                # list local
git checkout -b feat/x                    # tạo + chuyển
git checkout main                         # chuyển
git branch -d feat/x                      # xóa (đã merge)
git branch -D feat/x                      # force xóa

# Sync
git pull --rebase origin main             # pull (rebase tránh merge commit)
git fetch                                 # fetch không merge
git push origin feat/x                    # push
git push -u origin feat/x                 # push + track

# Fix history
git commit --amend                        # sửa commit cuối (CHƯA push)
git reset HEAD~1                          # bỏ commit cuối (giữ thay đổi)
git stash / git stash pop                 # cất tạm thay đổi
git cherry-pick &lt;sha&gt;                     # apply 1 commit từ branch khác

# Recovery
git reflog                                # xem mọi HEAD movement (recover lost commit)
git revert &lt;sha&gt;                          # tạo commit ngược lại (safe undo published)</pre>

<h3>.gitignore tối thiểu cho Java + Node</h3>
<pre># Java
target/
*.class
*.jar
.mvn/

# IDE
.idea/
.vscode/
*.iml

# OS
.DS_Store
Thumbs.db

# Secrets
.env
*.pem
application-local.yml

# Node
node_modules/
dist/
build/</pre>`
      },
      socraticPrompts: [
        {
          title: 'Conflict resolve scenario',
          prompt: `Tình huống: bạn pull request feat/coupon. Reviewer approve. Lúc merge có conflict với main (đồng nghiệp vừa merge feat/discount trước bạn 10 phút). KHÔNG cho code. Hỏi tôi:
1. Tại sao có conflict — bạn và đồng nghiệp sửa cái gì cùng nhau?
2. Resolve trên branch nào — feat/coupon hay main?
3. Sau khi resolve local, bạn dùng <code>git push</code> hay <code>git push --force-with-lease</code>? Tại sao?
4. Test cần chạy lại bao nhiêu — chỉ test phần conflict hay full suite?
5. Đồng nghiệp đã pull branch feat/coupon trước khi bạn rebase — họ làm gì giờ?`
        }
      ],
      keyTakeaways: {
        vi: [
          'GitHub Flow: main + feature branch + PR + merge. 90% công ty dùng.',
          'Commit nhỏ, Conventional Commits format. 1 PR = 1 logical change.',
          'Rebase local branch của mình. KHÔNG rebase branch shared.',
          'force-push: dùng <code>--force-with-lease</code> để tránh ghi đè commit người khác.',
          'Self-review PR trước khi tag reviewer. 50% lỗi tự thấy.'
        ]
      }
    },

    {
      id: 'l-5-0-2',
      type: 'theory',
      title: 'Jira / Agile / Scrum — Vocabulary và Workflow',
      subtitle: { vi: 'Mọi công ty IT VN đều dùng. Nghe các từ "sprint, story point, standup" mà không hiểu = lỡ team chat.' },
      mentalModel: {
        vi: `Agile = <strong>tư duy</strong>, không phải tool. Cốt lõi:
<ul>
  <li>Làm việc theo iteration ngắn (1-2 tuần — gọi là <strong>sprint</strong>).</li>
  <li>Demo + review cuối mỗi sprint. Thay đổi scope linh hoạt.</li>
  <li>Ưu tiên working software hơn comprehensive documentation.</li>
</ul>
<strong>Scrum</strong> = 1 framework implement Agile. Có role, ceremony, artifact cụ thể.
<strong>Kanban</strong> = framework khác, không có sprint cứng — flow liên tục.
<strong>Jira</strong> = tool quản lý ticket, support cả Scrum và Kanban.`
      },
      underTheHood: {
        vi: `<h3>Scrum Roles</h3>
<ul>
  <li><strong>Product Owner (PO)</strong>: định ưu tiên, viết user story, là "voice of customer".</li>
  <li><strong>Scrum Master (SM)</strong>: facilitate ceremony, gỡ blocker, KHÔNG quản lý dev.</li>
  <li><strong>Dev Team</strong>: 3-9 người, cross-functional, tự tổ chức.</li>
</ul>

<h3>Scrum Ceremonies (4 + 1)</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px">Ceremony</th>
<th style="border:1px solid #ccc;padding:6px">Khi nào</th>
<th style="border:1px solid #ccc;padding:6px">Mục đích</th>
<th style="border:1px solid #ccc;padding:6px">Thời lượng</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sprint Planning</td><td style="border:1px solid #ccc;padding:6px">Đầu sprint</td><td style="border:1px solid #ccc;padding:6px">Chọn ticket cho sprint, estimate</td><td style="border:1px solid #ccc;padding:6px">2-4 giờ</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Daily Standup</td><td style="border:1px solid #ccc;padding:6px">Mỗi sáng</td><td style="border:1px solid #ccc;padding:6px">Sync 3 câu hỏi</td><td style="border:1px solid #ccc;padding:6px">15 phút</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sprint Review</td><td style="border:1px solid #ccc;padding:6px">Cuối sprint</td><td style="border:1px solid #ccc;padding:6px">Demo cho stakeholder</td><td style="border:1px solid #ccc;padding:6px">1-2 giờ</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Retrospective</td><td style="border:1px solid #ccc;padding:6px">Cuối sprint</td><td style="border:1px solid #ccc;padding:6px">Cải tiến process</td><td style="border:1px solid #ccc;padding:6px">1 giờ</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Backlog Refinement</td><td style="border:1px solid #ccc;padding:6px">Giữa sprint</td><td style="border:1px solid #ccc;padding:6px">Groom story cho sprint sau</td><td style="border:1px solid #ccc;padding:6px">1-2 giờ</td></tr>
</table>

<h3>Daily Standup — 3 câu cố định</h3>
<ol>
  <li>Hôm qua tôi làm gì?</li>
  <li>Hôm nay tôi làm gì?</li>
  <li>Tôi đang stuck cái gì? (Blocker — Scrum Master ghi nhận để gỡ.)</li>
</ol>
KHÔNG: status report dài dòng, technical discussion (lập meeting riêng).

<h3>Story Point — đo độ phức tạp, KHÔNG phải thời gian</h3>
Dùng Fibonacci: 1, 2, 3, 5, 8, 13. Lý do:
<ul>
  <li>1 point = task siêu nhỏ (đổi text, fix typo).</li>
  <li>3 = task vừa, 1 ngày.</li>
  <li>8 = task lớn, vài ngày.</li>
  <li>13 = quá lớn → break thành nhiều ticket nhỏ.</li>
</ul>
<strong>Story point KHÔNG phải giờ</strong>. 8 points không = 8 giờ. Đo "phức tạp + uncertainty + effort" relative.
<br/><br/>
<strong>Velocity</strong> = tổng story point team complete mỗi sprint. Sau 3-4 sprint → đo được. Dùng để plan sprint sau.

<h3>Ticket lifecycle (Jira workflow điển hình)</h3>
<pre>Backlog → To Do → In Progress → In Review → Done

      ↑
      ↓
   Blocked (stuck)</pre>

<ul>
  <li><strong>Backlog</strong>: story chưa lên kế hoạch.</li>
  <li><strong>To Do</strong>: trong sprint, chưa làm.</li>
  <li><strong>In Progress</strong>: đang làm. Chỉ 1-2 ticket "In Progress" / dev cùng lúc.</li>
  <li><strong>In Review</strong>: PR pending review.</li>
  <li><strong>Done</strong>: merged + deployed + meet Definition of Done.</li>
</ul>

<h3>Definition of Done (DoD) — Quy tắc của team</h3>
Mẫu:
<ul>
  <li>Code merged vào main.</li>
  <li>CI pass: build + unit test + integration test.</li>
  <li>Code review đã approve ≥ 1 reviewer.</li>
  <li>Deployed lên staging, QA tested.</li>
  <li>Documentation updated.</li>
  <li>No P0/P1 bug open.</li>
</ul>
Mỗi team có DoD riêng — confirm với team khi join.

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Standup dài 30 phút</strong>: tranh luận technical. → Move sang meeting riêng, chỉ "block by X, will sync với Y after".</li>
  <li><strong>Estimate quá lạc quan</strong>: 1 story point = 1 ngày. → Đo relative không tuyệt đối. Sau 3 sprint sẽ tự calibrate.</li>
  <li><strong>Move ticket sang Done khi chưa merge</strong>: tự lừa metric. Done = DoD met.</li>
  <li><strong>Quên update ticket</strong>: PM hỏi status, bạn nói "đang làm", trong khi ticket vẫn "To Do" — mất lòng tin.</li>
  <li><strong>Im lặng khi block</strong>: stuck 2 ngày mà không kêu → trễ deadline cả sprint.</li>
  <li><strong>Take 5 ticket "In Progress" cùng lúc</strong>: context switch giết productivity. WIP limit = 1-2.</li>
</ul>`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao team cần Scrum/Agile?</h3>
<ul>
  <li><strong>Visibility</strong>: PM/stakeholder biết tiến độ mọi lúc qua Jira board.</li>
  <li><strong>Predictability</strong>: velocity → plan release date.</li>
  <li><strong>Adapt fast</strong>: scope đổi giữa sprint? Đợi sprint sau hoặc swap ticket cùng size.</li>
  <li><strong>Continuous improvement</strong>: retrospective tìm cải tiến mỗi 2 tuần.</li>
</ul>

<h3>Anti-pattern thường gặp</h3>
<ul>
  <li><strong>"Scrum" nhưng không có retrospective</strong>: không học từ sai lầm.</li>
  <li><strong>Manager đóng vai Scrum Master + PO</strong>: conflict of interest, dev không dám flag risk.</li>
  <li><strong>Story point biến thành OKR</strong>: dev inflate điểm. → Đánh giá team theo outcome (feature shipped), không phải velocity.</li>
  <li><strong>Daily standup &gt; 15 phút</strong>: signal team quá lớn hoặc thiếu discipline.</li>
  <li><strong>Scope thêm giữa sprint mà không trade-off ticket nào ra</strong>: sprint commitment vỡ.</li>
</ul>

<h3>Tool ngoài Jira</h3>
<ul>
  <li><strong>Trello</strong>: Kanban đơn giản, free, ít feature. Cho team nhỏ &lt; 5.</li>
  <li><strong>Linear</strong>: hiện đại, nhanh, UX đẹp. Startup tech-forward thích.</li>
  <li><strong>GitHub Projects</strong>: tích hợp với repo. Cho dev-only team.</li>
  <li><strong>ClickUp / Asana</strong>: phổ thông, nhiều feature.</li>
</ul>`
      },
      socraticPrompts: [
        {
          title: 'Practice: estimate story point',
          prompt: `Cho 5 ticket sau, estimate Fibonacci (1/2/3/5/8/13). KHÔNG cho đáp án. Hỏi tôi:
1. "Đổi label button từ 'Order' sang 'Đặt hàng'" — bao nhiêu? Vì sao?
2. "Implement JWT refresh token endpoint" — bao nhiêu? So sánh với #1.
3. "Migration đơn hàng từ MySQL sang Postgres, giữ data, downtime &lt; 5 phút" — bao nhiêu?
4. "Tích hợp VNPay payment gateway, có webhook + retry + reconciliation" — bao nhiêu?
5. "Audit log mọi action trên admin panel" — bao nhiêu?
Khi estimate, nghĩ về: scope, uncertainty, dependency. KHÔNG nghĩ "tôi làm trong X giờ".`
        }
      ],
      keyTakeaways: {
        vi: [
          'Scrum: 3 role, 4 ceremony, sprint 1-2 tuần.',
          'Standup 15 phút, 3 câu hỏi cố định. KHÔNG technical deep dive.',
          'Story point đo độ phức tạp relative, KHÔNG phải giờ.',
          'WIP limit 1-2 ticket "In Progress" / dev.',
          'Done = DoD met (merged + tested + deployed + reviewed), không phải "code xong".'
        ]
      }
    },

    {
      id: 'l-5-0-3',
      type: 'practice',
      title: 'Code Review Etiquette — Cho và Nhận như senior',
      subtitle: { vi: 'Code review là kỹ năng quan trọng nhất để teamwork tốt. Sai lầm ở đây = team unhappy + chậm shipping.' },
      mentalModel: {
        vi: `Code review là <strong>conversation</strong>, không phải <strong>exam</strong>. Mục tiêu:
<ul>
  <li>Bắt bug logic, security trước khi vào prod.</li>
  <li>Share kiến thức 2 chiều — reviewer học context từ author, author học best practice từ reviewer.</li>
  <li>Đảm bảo code maintainable — người sau 6 tháng đọc vẫn hiểu.</li>
</ul>
KHÔNG phải mục tiêu: thể hiện trình độ, áp đặt style cá nhân, "kiểm tra" junior.`
      },
      underTheHood: {
        vi: `<h3>Là REVIEWER — Cách comment</h3>

<strong>Levels of comment (tag rõ)</strong>:
<ul>
  <li><code>[blocker]</code> — bug, security, KHÔNG được merge nếu chưa fix.</li>
  <li><code>[suggestion]</code> — đề xuất cải thiện, author quyết định.</li>
  <li><code>[question]</code> — bạn không hiểu, cần explain.</li>
  <li><code>[nit]</code> — picky (typo, formatting), không block.</li>
  <li><code>[praise]</code> — khen ngợi (clean code, smart solution).</li>
</ul>

<strong>Phrasing đúng (constructive)</strong>:
<ul>
  <li>❌ "Code này sai."</li>
  <li>✅ "[question] Function này không handle case input null — có phải đã validate ở caller?"</li>
  <li>❌ "Tại sao không dùng Stream?"</li>
  <li>✅ "[suggestion] Có thể replace for loop bằng <code>list.stream().filter(...).toList()</code> — concise hơn. Nhưng for loop hiện tại cũng OK."</li>
  <li>❌ "Đặt tên biến tệ."</li>
  <li>✅ "[nit] Biến <code>x</code> — đổi thành <code>orderCount</code> sẽ rõ ý hơn."</li>
</ul>

<strong>Quy tắc</strong>:
<ul>
  <li>Comment code, không comment người.</li>
  <li>Đề xuất kèm lý do ("vì ...").</li>
  <li>Hỏi trước, conclude sau. Có thể bạn thiếu context.</li>
  <li>Praise good code, không chỉ tìm lỗi.</li>
</ul>

<h3>Là AUTHOR — Nhận feedback</h3>

<strong>Mindset</strong>:
<ul>
  <li>Reviewer comment ≠ tấn công cá nhân. Mục tiêu chung là code tốt hơn.</li>
  <li>Không phải comment nào cũng phải implement. Reasonable disagree được phép.</li>
  <li>Reply mỗi comment — kể cả "Done", "Will fix in next PR", hoặc "Disagree because ...".</li>
</ul>

<strong>Phrasing đúng khi disagree</strong>:
<ul>
  <li>❌ "Không, làm như mày bảo sẽ chậm."</li>
  <li>✅ "Anh đề xuất Stream nhưng bench đã đo for loop nhanh hơn 30% với N nhỏ. Em giữ for loop được không?"</li>
</ul>

<strong>Khi reviewer block mà bạn vẫn không đồng ý</strong>:
<ol>
  <li>Discuss trong PR thread.</li>
  <li>Nếu không resolve → call sync 5 phút.</li>
  <li>Nếu vẫn deadlock → escalate (tech lead, team meeting). KHÔNG merge bypass.</li>
</ol>

<h3>Checklist Reviewer (đọc theo thứ tự)</h3>
<ol>
  <li><strong>Description</strong>: hiểu mục đích PR? Có link Jira ticket?</li>
  <li><strong>Test</strong>: có test cho code mới? Test cover edge case?</li>
  <li><strong>Logic correctness</strong>: code có làm đúng việc muốn?</li>
  <li><strong>Security</strong>: có SQL injection, XSS, auth bypass?</li>
  <li><strong>Performance</strong>: N+1 query, loop trong loop, missing index?</li>
  <li><strong>Error handling</strong>: exception nuốt, retry không có max?</li>
  <li><strong>Readability</strong>: tên rõ, comment hợp lý, method ≤ 30 dòng?</li>
  <li><strong>Architecture</strong>: đặt code đúng layer? Tách concern?</li>
</ol>

<h3>Checklist Author trước khi tag reviewer</h3>
<ol>
  <li>Self-review PR diff trên GitHub UI.</li>
  <li>CI pass — không có test fail.</li>
  <li>Description có context: What, Why, How tested, screenshot if UI.</li>
  <li>Title rõ ràng, follow Conventional Commits.</li>
  <li>Link Jira ticket trong description.</li>
  <li>PR &lt; 400 dòng diff. Nếu lớn hơn → tách PR.</li>
  <li>Branch sync với main (rebase nếu cần).</li>
</ol>

<h3>Pitfalls</h3>
<ul>
  <li><strong>Reviewer "rubber stamp" approve</strong>: không đọc, click approve cho xong → bug vào prod, mất uy tín.</li>
  <li><strong>Author "argue everything"</strong>: bảo vệ code thay vì cải thiện → reviewer ngại review sau này.</li>
  <li><strong>PR review &gt; 24h pending</strong>: dev block, deadline trễ. Team agree SLA &lt; 4h trong giờ làm việc.</li>
  <li><strong>Personal style enforce</strong>: "Tôi không thích cách này" → không phải lý do. Phải có technical rationale.</li>
  <li><strong>Reviewer dump 50 nits</strong> → noise → author miss bug thật. Ưu tiên blocker/suggestion.</li>
  <li><strong>Không respond comment</strong>: reviewer thấy bị ignore → ngại review lần sau.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Rewrite comment khó nghe',
          prompt: 'Một junior PR endpoint <code>POST /orders</code> nhưng quên validate input. Reviewer comment: "Sao không validate? Lỗi sơ đẳng vậy mà cũng quên." Hãy rewrite comment cho constructive + clear.',
          hints: [
            'Tag [blocker] hoặc [suggestion] phù hợp.',
            'Đặt câu hỏi trước (có thể họ có lý do).',
            'Đề xuất cụ thể: validate ở đâu, dùng tool gì.'
          ],
          solution: {
            code: `Ví dụ comment tốt:

[blocker] @author Mình không thấy validation cho input của endpoint POST /orders.
Nếu request gửi quantity = -1 hoặc productId = null, code sẽ:
- Tạo order với quantity âm (logic bug)
- Throw NullPointerException ở line 42

Đề xuất:
1. Add @Valid trên @RequestBody parameter
2. Thêm @NotNull, @Min(1) trên CreateOrderRequest DTO
3. ExceptionHandler trả 400 BadRequest với detail field error

Mình có thể pair 15 phút để show cách setup Bean Validation nếu cần.

(Nếu validation đã có ở layer khác mà mình miss, sorry — có thể chỉ giúp mình ở đâu không?)`,
            lang: 'markdown',
            complexityVi: 'Comment chuẩn senior — productive feedback.',
            explanationVi: 'Cấu trúc: (1) Tag rõ severity, (2) chỉ ra vấn đề cụ thể với line number, (3) giải thích hậu quả (logic bug, NPE), (4) đề xuất CỤ THỂ (không nói chung chung "thêm validation"), (5) offer help — cho junior cảm thấy support, không bị tấn công, (6) hỏi cuối để giả định mình có thể sai.'
          }
        },
        {
          title: 'Disagree professionally',
          prompt: 'Reviewer comment: "[suggestion] Replace for loop này bằng Stream cho clean hơn." Bạn đã benchmark và for loop nhanh hơn 30% với data nhỏ. Cách disagree polite + có data?',
          hints: [
            'Acknowledge suggestion trước.',
            'Đưa data cụ thể (benchmark).',
            'Đề xuất action — giữ for loop, hoặc giải pháp khác.'
          ],
          solution: {
            code: `Reply gợi ý:

Cảm ơn anh suggestion! Em đã benchmark 2 cách với data thực tế:

Input: List<Order> size 50 (typical batch trong production)
- For loop:  avg 1.2 µs (n=10000 iterations)
- Stream:    avg 1.7 µs (n=10000 iterations)
=> For loop nhanh hơn ~30% với input nhỏ.

JIT inline for loop tốt hơn stream pipeline khi N nhỏ.
Source: https://shipilev.net/blog/2014/jmh-pitfalls/

Em đề xuất:
- Giữ for loop ở chỗ hot path (loop này gọi 1M lần/giờ).
- Nếu anh thấy readability quan trọng hơn perf ở đây, em đổi sang Stream — confirm giúp em?

(Nếu N >= 10000, Stream sẽ nhanh hơn nhờ parallelStream — không phải case của method này.)`,
            lang: 'markdown',
            complexityVi: 'Disagree dựa trên data, không phải opinion.',
            explanationVi: 'Cấu trúc: (1) Acknowledge suggestion (tôn trọng), (2) đưa benchmark cụ thể có data, (3) cite source authoritative, (4) đề xuất 2 path forward (giữ for loop hoặc đổi nếu anh nhấn mạnh readability), (5) thêm nuance (parallelStream với N lớn) — show bạn hiểu nuance, không phải bướng. Reviewer sẽ approve hoặc đưa lý do khác — conversation productive.'
          }
        }
      ],
      socraticPrompts: [
        {
          title: 'Self-assessment skills',
          prompt: `Đánh giá kỹ năng code review của bạn (lần cuối làm với team thật, hoặc imagined):
1. Comment cuối cùng bạn viết — có tag [blocker/suggestion/nit] không?
2. Bạn block 1 PR vì lý do "personal style" không? Nếu có, làm gì để fix?
3. Khi nhận feedback tệ ("code này sai"), bạn react thế nào? Defensive hay grateful?
4. Bạn dành bao lâu review 1 PR 300 dòng? &lt; 10 phút là rubber stamp; 30-60 phút là solid.
5. Bạn comment praise lần cuối khi nào? Code review không chỉ là criticism.
6. Khi disagree với senior — bạn argue, im lặng, hay disagree-and-commit?`
        }
      ],
      keyTakeaways: {
        vi: [
          'Code review = conversation, KHÔNG phải exam.',
          'Tag comment với severity: [blocker], [suggestion], [question], [nit], [praise].',
          'Reviewer: hỏi trước, conclude sau. Author: reply mỗi comment.',
          'Disagree với data + đề xuất cụ thể, không argue chung chung.',
          'SLA review &lt; 4h, PR &lt; 400 dòng. Lớn hơn = tách.'
        ]
      }
    }
  ],
  references: [
    { title: 'Conventional Commits 1.0', url: 'https://www.conventionalcommits.org/en/v1.0.0/' },
    { title: 'Pro Git Book (free, official)', url: 'https://git-scm.com/book/en/v2' },
    { title: 'Scrum Guide 2020 (official)', url: 'https://scrumguides.org/scrum-guide.html' },
    { title: 'GitHub Flow', url: 'https://docs.github.com/en/get-started/using-github/github-flow' }
  ]

}
