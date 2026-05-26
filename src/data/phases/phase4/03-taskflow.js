// Capstone 3 — TaskFlow: Multi-tenant Project Manager
export default {
  id: 'mod-4-3',
  title: 'Capstone 3 — TaskFlow: Multi-tenant Project Manager',
  lessons: [
    {
      id: 'l-4-3-overview',
      type: 'theory',
      title: 'TaskFlow — Multi-tenant Collaboration & Real-time Events',
      mentalModel: {
        vi: `<strong>TaskFlow</strong> = Jira/Trello-lite: workspace → project → task. Khác Devlog/ShopCore: dự án này đào sâu <strong>multi-tenant authorization</strong> — mỗi user là thành viên của nhiều workspace với role khác nhau, mọi mutation phải check role trong workspace cụ thể.
<br/><br/>
Đây là dự án "cuối cấp" — kết hợp tất cả: ACL phức tạp, real-time updates qua WebSocket, file upload, activity feed cursor pagination.`
      },
      underTheHood: {
        vi: `<h3>First Principles — Multi-tenancy patterns</h3>

<strong>1) 3 cách isolate tenant</strong>
<ul>
<li><strong>Separate DB per tenant</strong>: max isolation, max ops complexity. Banking, healthcare.</li>
<li><strong>Separate schema per tenant</strong>: balance. Cùng cluster Postgres, schema riêng. Connection pool tricky.</li>
<li><strong>Shared table với tenant_id column</strong>: simplest, cheapest. Mọi query MUST filter tenant_id. TaskFlow chọn cách này.</li>
</ul>
<br/><br/>
<strong>2) Tenant context propagation</strong>
Mỗi request gắn workspace_id (từ header X-Workspace-Id hoặc path). Filter set context → service inject via custom annotation. KHÔNG để service tự lấy workspace_id từ argument — dễ quên.
<br/><br/>
<strong>3) Authorization matrix</strong>
4 role: OWNER, ADMIN, MEMBER, VIEWER. Mỗi resource × mỗi action × mỗi role = ô trong matrix. TaskFlow:
<pre>           Read  Create  Edit  Delete
OWNER       Y      Y       Y     Y
ADMIN       Y      Y       Y     Y (except workspace)
MEMBER      Y      Y       own   own
VIEWER      Y      N       N     N</pre>
<br/><br/>
<strong>4) Event-driven activity feed</strong>
Mỗi mutation publish ApplicationEvent → @EventListener insert activity row. Decouple business logic khỏi audit log. Phase AFTER_COMMIT để KHÔNG log rolled-back action.
<br/><br/>
<strong>5) Cursor pagination cho feed</strong>
Activity feed có thể 1M rows. OFFSET pagination chậm. Cursor:
<pre>WHERE (created_at, id) &lt; (last_seen_at, last_seen_id)
ORDER BY created_at DESC, id DESC
LIMIT 50</pre>
Composite cursor break tie khi cùng timestamp.
<br/><br/>
<strong>6) WebSocket real-time</strong>
STOMP protocol over WebSocket. Client subscribe topic /workspaces/{id}. Server publish event → broadcast tới subscribers. Auth qua JWT trong CONNECT frame.`
      },
      theory: {
        vi: `<h3>Scope</h3>
<ul>
  <li>Workspace với members (OWNER, ADMIN, MEMBER, VIEWER).</li>
  <li>Projects trong workspace.</li>
  <li>Tasks với status (TODO/DOING/REVIEW/DONE), assignee, labels, due date.</li>
  <li>Comments + mentions.</li>
  <li>File attachments (local fs → swap S3 sau).</li>
  <li>Activity feed cursor-paginated.</li>
  <li>WebSocket realtime updates (stretch goal).</li>
</ul>

<h3>The "Why" — Tại sao TaskFlow là capstone CUỐI?</h3>
<ul>
  <li>Multi-tenant ACL — pattern enterprise phổ biến nhất.</li>
  <li>Event-driven architecture — preview cho microservices.</li>
  <li>Real-time qua WebSocket — modern UX.</li>
  <li>File storage — touch S3 / cloud storage pattern.</li>
  <li>Cursor pagination — chuẩn production.</li>
</ul>

<h3>Junior Pitfalls — Multi-tenant security</h3>
<ul>
  <li><strong>Quên filter tenant_id</strong> trong query → user A thấy data của user B (CROSS-TENANT LEAK). CRITICAL.</li>
  <li><strong>Check role tại Controller scattered</strong> → 1 endpoint quên check → leak. Centralize bằng @PreAuthorize.</li>
  <li><strong>Hard-code permission</strong> trong code → không thay đổi runtime. Database-driven cho enterprise.</li>
  <li><strong>403 vs 404 nhầm</strong> — leak resource existence. 404 cho "không thuộc workspace" an toàn hơn 403.</li>
  <li><strong>WebSocket không auth</strong> → ai cũng subscribe được. Verify JWT trong handshake.</li>
</ul>`
      }
    },
    {
      id: 'l-4-3-blueprint',
      type: 'project',
      title: 'TaskFlow — 12 Steps',
      steps: [
        {
          id: 's1',
          title: 'Bootstrap',
          description: { vi: 'Cùng template Devlog/ShopCore. Package theo feature: workspace/, project/, task/, comment/, attachment/, common/.' },
          mentalModel: {
            vi: `Package theo feature scale tốt hơn theo layer khi project lớn.
<br/><br/>
<strong>First Principles</strong>: Conway's Law + Bounded Context (DDD). Mỗi feature = bounded context. Package tách rõ → khi tách microservice sau này, mỗi package thành 1 service riêng.
<br/><br/>
<strong>Junior Pitfalls</strong>:
<ul>
<li>Package cross-import lung tung → hard to extract sau này.</li>
<li>"Service god class" trong package — tách theo aggregate root (Task, Workspace, ...).</li>
<li>Common package phình to → trở thành "junk drawer".</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Package boundary', prompt: 'KHÔNG cho code. Hỏi tôi: 1) Workspace package có nên import từ Task package không? 2) Module boundary strict (private class) hay loose? 3) Khi nào tách thành Maven multi-module?' }
          ],
          hints: [
            'Mỗi feature 1 package với controller + service + repo + dto + entity.',
            'common/ chỉ chứa truly cross-cutting (exception handler, config).',
            'Avoid cross-feature import. Nếu cần, dùng events.'
          ]
        },
        {
          id: 's2',
          title: 'Schema design (multi-tenant shared table)',
          description: { vi: 'workspaces, workspace_members, projects, tasks, comments, labels, task_labels, attachments, activities.' },
          mentalModel: {
            vi: `<strong>Multi-tenant key</strong>: mỗi entity có <code>workspace_id</code> column. Mọi query filter theo nó. Membership check trong workspace_members.
<br/><br/>
<strong>Activity log</strong>: JSONB column trong Postgres lưu payload tự do. Lợi: schema flexible; Hại: query khó (cần JSONB operators).
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>workspace_members có (workspace_id, user_id, role). Composite PK hoặc UNIQUE.</li>
<li>workspace_id propagate qua mọi child entity — DENORMALIZED nhưng cần thiết cho query performance + RLS (Row-Level Security).</li>
<li>JSONB trong Postgres index được (GIN index). Nhưng schema-on-read → mất type safety.</li>
<li>activities.entity_type + entity_id = polymorphic — task, comment, project share cùng bảng activity.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Forget workspace_id trên tasks → muốn query "mọi task của workspace" phải JOIN qua project. Denormalize.</li>
<li>JSONB payload không document schema → 6 tháng sau quên field gì có.</li>
<li>RLS Postgres không setup → app bug filter tenant_id → leak. RLS là safety net.</li>
<li>1 tenant data lớn (1TB) → partition strategy chưa nghĩ.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Multi-tenant strategy',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 3 cách isolate tenant: separate DB, separate schema, shared table với tenant_id. Trade-off?
2. TaskFlow chọn shared table — vì sao?
3. 1 tenant data 1TB — partition strategy?
4. Backup riêng cho 1 tenant — schema/DB tách thì dễ; shared table thì sao?
5. SOC 2/GDPR — 1 tenant request xóa data — strategy?`
            }
          ],
          hints: [
            'workspace_members PK composite (workspace_id, user_id).',
            'Mọi entity con (task, comment, ...) có workspace_id (denormalize).',
            'activities.payload JSONB + index GIN nếu cần query.',
            'Optional: RLS Postgres làm safety net.'
          ]
        },
        {
          id: 's3',
          title: 'Auth + WorkspaceContextFilter',
          description: { vi: 'JWT auth + filter đọc X-Workspace-Id header, validate membership.' },
          mentalModel: {
            vi: `Sau JwtAuthFilter set user, WorkspaceContextFilter đọc <code>X-Workspace-Id</code> header → load WorkspaceMember → put vào ThreadLocal. Controller inject <code>@CurrentWorkspaceMember</code> custom annotation.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>ThreadLocal cho context propagation — same pattern Spring Security SecurityContext.</li>
<li>Filter order quan trọng: JwtAuthFilter TRƯỚC WorkspaceContextFilter — cần user trước.</li>
<li>Custom HandlerMethodArgumentResolver cho @CurrentWorkspaceMember — Spring inject auto.</li>
<li>403 vs 404: 404 không leak resource existence. Production: 404 cho "not member".</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>ThreadLocal không clear → leak qua thread pool reuse → context bẩn.</li>
<li>Filter order sai → WorkspaceContextFilter không có user → fail.</li>
<li>Cache membership KHÔNG invalidate khi role change → stale permission.</li>
<li>Header X-Workspace-Id missing → app crash thay vì 400.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Context propagation',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Header X-Workspace-Id vs path <code>/workspaces/{wsId}/...</code> — cách nào tốt hơn? Trade-off?
2. ThreadLocal — vì sao Spring Security dùng cho SecurityContext? Nhược điểm trong async/reactive?
3. Custom annotation <code>@CurrentWorkspaceMember</code> — implement qua HandlerMethodArgumentResolver. Vì sao tiện hơn extract trong mỗi controller?
4. 403 vs 404 khi user truy cập workspace họ không thuộc — chọn nào? Lộ thông tin gì?
5. Caching membership trong filter — TTL bao lâu? Khi nào invalidate?`
            }
          ],
          hints: [
            'ThreadLocal trong WorkspaceContextHolder; finally clear trong filter.',
            'HandlerMethodArgumentResolver cho @CurrentWorkspaceMember.',
            'Filter order: <code>@Order(after JwtAuthFilter)</code>.',
            '404 thay vì 403 cho "not member" — không leak workspace existence.'
          ]
        },
        {
          id: 's4',
          title: 'Workspace + members CRUD',
          description: { vi: 'OWNER create. ADMIN/OWNER invite. Mỗi member có role.' },
          mentalModel: {
            vi: `Invite qua email — sinh token, gửi email với link. Recipient accept → tạo workspace_members row.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Invite token: UUID + expires_at (7 ngày). Single-use — accept rồi delete row.</li>
<li>Invite email recipient chưa có account → invite vẫn valid, link đến /signup?invite=...</li>
<li>Email invite reuse EmailService từ Phase 3 — same template engine, same async pattern.</li>
<li>OWNER unique per workspace — transfer ownership thay vì add OWNER mới.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Invite token không expire → leak token vô thời hạn.</li>
<li>Token UUID nhỏ → guessable. Dùng <code>SecureRandom</code>.</li>
<li>Email recipient sai → ai có link cũng accept. Bind invite tới recipient email + verify.</li>
<li>Owner xóa account → workspace orphan. Force transfer trước hoặc auto-promote ADMIN.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Invitation flow', prompt: 'KHÔNG cho code. Hỏi tôi: 1) Token invite — sinh thế nào? UUID đủ chưa? Cần expire không? 2) Email chưa tồn tại trong hệ thống — tạo user mới khi accept hay từ chối? 3) Pending invitations storage — bảng riêng hay member với status PENDING? 4) Resend invite — token mới hay reuse?' }
          ],
          hints: [
            'invitations table: (workspace_id, email, token, role, expires_at, created_by).',
            'Token = <code>UUID.randomUUID()</code> hoặc <code>SecureRandom</code>.',
            'EmailService.sendHtml(email, "Invited to workspace", "invite-template", model).',
            'Endpoint /invitations/accept?token=... validate + create membership.'
          ]
        },
        {
          id: 's5',
          title: 'Projects scoped to workspace',
          description: { vi: 'CRUD projects. Permission: MEMBER read, ADMIN+ write.' },
          mentalModel: {
            vi: `<code>@PreAuthorize("@wsSec.hasRole(#workspaceId, 'ADMIN')")</code> — gọi bean <code>wsSec</code> kiểm tra role. SpEL pattern mạnh cho permission phức tạp.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>SpEL trong @PreAuthorize có access tới method args (qua <code>#paramName</code>), principal, current bean (<code>@beanName</code>).</li>
<li>Custom permission evaluator: Spring <code>PermissionEvaluator</code> interface cho complex auth.</li>
<li>Test permission matrix bằng @ParameterizedTest qua role + endpoint.</li>
<li>Method-level @PreAuthorize > endpoint-level — cho phép service reuse với same protection.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>@PreAuthorize trên private method → KHÔNG hoạt động (proxy chỉ intercept public).</li>
<li>SpEL typo → silent fail (security hole!). Test mọi permission.</li>
<li>Quên check workspace_id trong service → user A workspace 1 sửa project workspace 2 mà KHÔNG có check membership cụ thể.</li>
<li>Cascade delete project → tasks bị xóa? Comments? Quyết định business.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Permission expression', prompt: 'KHÔNG cho code. Hỏi tôi: 1) Hardcode @PreAuthorize("hasRole(\'ADMIN\')") vs custom bean — khi nào dùng cái nào? 2) Permission "can edit if owner OR has ADMIN role" — viết SpEL ra sao? 3) Test permission — write integration test với 4 role + cover mọi endpoint — strategy?' }
          ],
          hints: [
            '<code>@Component("wsSec")</code> bean cho permission methods.',
            '@PreAuthorize("@wsSec.hasRole(#workspaceId, \'ADMIN\')")',
            'Cascade tasks khi delete project; comments theo task.',
            'Test mỗi endpoint 4 role × member/non-member matrix.'
          ]
        },
        {
          id: 's6',
          title: 'Task CRUD + filtering + bulk-edit',
          description: { vi: 'Filter status, assignee, label, due range. Bulk PATCH status.' },
          mentalModel: {
            vi: `JPA Specifications compose filter động. Bulk update qua @Modifying query để tránh N query.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Bulk update: <code>@Modifying @Query("UPDATE Task t SET t.status = :status WHERE t.id IN :ids")</code>. 1 query thay N.</li>
<li>Bulk action atomicity: all-or-nothing (transaction) vs best-effort (process each independently). UX decision.</li>
<li>Filter qua Specifications: composable, type-safe.</li>
<li>Cursor pagination cho task list lớn — same pattern activity feed.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Bulk update qua loop save() → N queries → chậm thê thảm.</li>
<li>Bulk update không return affected rows count → không biết bao nhiêu thực sự update.</li>
<li>JPA Specifications: criteria builder verbose. MapStruct alternative.</li>
<li>Atomic bulk fail 1 record → rollback all. User confusion. Cân nhắc partial success response.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Bulk vs single', prompt: 'KHÔNG cho code. Hỏi tôi: 1) PATCH 100 task chuyển status — 100 request hay 1 bulk? Trade-off? 2) Bulk partial failure (50 success, 50 fail) — response shape? 3) Atomic toàn bộ hay best-effort? 4) Throttling bulk size — bao nhiêu là quá?' }
          ],
          hints: [
            '@Modifying @Query cho bulk UPDATE/DELETE.',
            'Specifications cho filter động.',
            'Bulk size limit (vd 100) tránh memory blow.',
            'Response shape: <code>{succeeded: [...], failed: [...errors]}</code> cho best-effort.'
          ]
        },
        {
          id: 's7',
          title: 'Comments + @mentions + notifications',
          description: { vi: 'Comment trên task. Detect @username → notify + email (optional).' },
          mentalModel: {
            vi: `Regex extract @mentions. Resolve username → user_id. Insert notifications row + optionally trigger email.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Parse @mention: regex <code>@(\\w+)</code> bắt username. Resolve qua HashMap lookup hoặc DB query (cache cho perf).</li>
<li>Notification pipeline: in-app DB row (always) + email (opt-in) + push (mobile, future). Multi-channel pattern.</li>
<li>Email mention reuse EmailService — template "you-were-mentioned.html".</li>
<li>Mute notifications per task: schema preferences (user_id, task_id, mute=true).</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Parse @mention client side only → user typo "@admiin" → no notify, no error.</li>
<li>Sync send email cho mỗi mention → request slow if 10 mentions.</li>
<li>Edit comment có mention mới → re-notify hay không? Decision.</li>
<li>Mention deleted user → resolve null → NPE. Skip gracefully.</li>
<li>Spam: 1 user mention 100 user → notify storm. Rate limit.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Mention pipeline', prompt: 'KHÔNG cho code. Hỏi tôi: 1) Parse @mention ở client (richer UX) vs server (authoritative). Trade-off? 2) Notification: email + in-app — 2 kênh, async. Cách publish event? 3) Mute notifications cho 1 task — schema lưu ở đâu? 4) Edit comment có @mention mới — re-notify? 5) Mention deleted user — clean up?' }
          ],
          hints: [
            'Regex: <code>Pattern.compile("@(\\\\w+)")</code>.',
            'Publish CommentCreatedEvent → @TransactionalEventListener xử lý notify.',
            'EmailService cho email channel; NotificationRepository cho in-app.',
            'Mute table: (user_id, entity_type, entity_id).'
          ]
        },
        {
          id: 's8',
          title: 'Attachments (local FS, plan S3)',
          description: { vi: 'Upload image/PDF. Validate MIME, size ≤ 10MB.' },
          mentalModel: {
            vi: `Phase 1: lưu local filesystem dưới <code>workspaces/{wsId}/tasks/{taskId}/{uuid}-{filename}</code>. Phase 2 (stretch): swap S3 với signed URL TTL 5 phút.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Local FS đơn giản nhưng multi-instance app share storage → NFS/EFS phức tạp. S3 cloud-native.</li>
<li>Signed URL: presigned URL với expiration, KHÔNG cần proxy file qua app → save bandwidth + app load.</li>
<li>MIME type validation: KHÔNG trust Content-Type header (client forge). Check magic bytes của file.</li>
<li>Virus scan: clamd integration, async sau upload. Sandbox file đến khi clean.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Trust Content-Type header → upload .exe rename thành .pdf bypass.</li>
<li>Filename không sanitize → path traversal: "../../etc/passwd".</li>
<li>Stream file qua RAM → OOM với large file. StreamingResponseBody.</li>
<li>S3 bucket public → mọi file accessible URL guess. Always private + signed URL.</li>
<li>Quota: 1 workspace upload 100GB → bill shock. Track quota per workspace.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'File storage trade-offs', prompt: 'KHÔNG cho code. Hỏi tôi: 1) Local FS vs S3 — khác nhau ở scale, backup, multi-instance ra sao? 2) Upload qua app vs direct S3 (presigned URL) — security? 3) Virus scan — ai chịu? Khi nào? 4) Image resize cho thumbnail — synchronous on upload hay async? 5) Storage cost — track quota per workspace?' }
          ],
          hints: [
            'MIME check: <code>Apache Tika</code> detect magic bytes.',
            'Filename sanitize: keep alphanumeric + dot + dash.',
            'Stream với MultipartFile.transferTo() — không load RAM hết.',
            'S3 presigned URL TTL 5-15 phút.'
          ]
        },
        {
          id: 's9',
          title: 'Activity feed (cursor pagination + events)',
          description: { vi: 'Mỗi mutation publish event → @EventListener write activity row.' },
          mentalModel: {
            vi: `<strong>Spring ApplicationEventPublisher</strong> decouple. Controller/Service publish event → @EventListener xử lý ngoài transaction (or AFTER_COMMIT).
<br/><br/>
<strong>Cursor pagination</strong>: sort by (created_at DESC, id DESC). Cursor = composite (timestamp, id). Tránh OFFSET chậm.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Event-driven decouple: producer KHÔNG biết consumer. Add new listener không sửa producer.</li>
<li>@TransactionalEventListener(phase = AFTER_COMMIT): chỉ fire sau commit. Tránh log action chưa commit (rollback).</li>
<li>Async listener (@Async): listener chạy ngoài request thread. Latency request KHÔNG ảnh hưởng.</li>
<li>Cursor format: <code>base64(created_at + ":" + id)</code> — opaque, client KHÔNG manipulate.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>@EventListener (không Transactional) → fire ngay khi publish, kể cả rollback → log corrupted.</li>
<li>Sync listener → request slow nếu listener heavy.</li>
<li>Cursor plain (không encode) → client edit cursor, leak structure.</li>
<li>Sort tie không break → cursor không stable, skip rows.</li>
<li>Activity feed cross-workspace leak — quên filter workspace_id.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Event-driven within monolith',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Event-driven trong monolith vs gọi service trực tiếp — vì sao có lợi với "activity log"?
2. @TransactionalEventListener(phase=AFTER_COMMIT) — vì sao quan trọng? Edge case nếu listener fail?
3. Async event với @Async — exception ở đâu? Bắt ra sao?
4. Cursor pagination: cursor opaque (encrypted) hay plain (timestamp, id)? Trade-off?
5. Feed merge từ nhiều workspace — strategy?`
            }
          ],
          hints: [
            'ApplicationEventPublisher inject tự động trong @Service.',
            '@TransactionalEventListener(phase = AFTER_COMMIT) cho audit.',
            'Cursor: Base64 encode (created_at, id).',
            'Index <code>(workspace_id, created_at DESC, id DESC)</code> cho feed.'
          ]
        },
        {
          id: 's10',
          title: 'WebSocket (optional, stretch)',
          description: { vi: 'STOMP endpoint /ws/workspaces/{id}. Bridge ApplicationEvent → broadcast.' },
          mentalModel: {
            vi: `Browser open WebSocket → subscribe topic per workspace. Server publish event → forward sang topic.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>STOMP = sub-protocol over WebSocket. Frame-based: CONNECT, SUBSCRIBE, SEND, MESSAGE.</li>
<li>WebSocket auth: JWT trong CONNECT frame header. Verify trong <code>ChannelInterceptor</code>.</li>
<li>Multi-instance broadcast: in-memory broker không share. Phải Redis Pub/Sub hoặc RabbitMQ relay.</li>
<li>Reconnect logic: client implement exponential backoff. Server đơn giản accept lại.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>WebSocket KHÔNG có HTTP header auth chuẩn — pass JWT qua query param hoặc CONNECT frame.</li>
<li>Sticky session khi scale nhiều instance: client connect instance A, event fire trên instance B → mất broadcast.</li>
<li>WebSocket connection limit per server (~5-10k) — cần plan capacity.</li>
<li>Mobile network drop → connection fail. Client phải reconnect + replay missed events.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'WS auth & scaling', prompt: 'KHÔNG cho code. Hỏi tôi: 1) WebSocket KHÔNG có header auth chuẩn — pass JWT thế nào? Query param có an toàn? 2) Sticky session khi scale ra nhiều instance? 3) Redis Pub/Sub bridge giữa instance — khi nào cần? 4) Heartbeat / reconnect — client logic ra sao? 5) Mobile network drop — UX?' }
          ],
          hints: [
            'Spring WebSocket + STOMP starter.',
            'ChannelInterceptor verify JWT trong CONNECT.',
            'simpMessagingTemplate.convertAndSend("/topic/workspaces/" + wsId, event).',
            'Redis broker cho multi-instance.'
          ]
        },
        {
          id: 's11',
          title: 'Testing + authorization matrix',
          description: { vi: 'Test mọi endpoint với 4 role × 2 trạng thái (member/not member).' },
          mentalModel: {
            vi: `@ParameterizedTest qua role. Snapshot test cho activity feed.
<br/><br/>
<strong>First Principles</strong>:
<ul>
<li>Authorization matrix: N endpoint × M role × K state. Cover hết = (N×M×K) test cases. Parameterize.</li>
<li>Snapshot test: capture output 1 lần, compare lần sau. Phát hiện regression schema activity feed.</li>
<li>Test "cross-tenant" CRITICAL: user workspace 1 truy cập workspace 2 → 404. Test mọi resource.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>Test chỉ happy path → permission bug leak prod.</li>
<li>Manual test 4 role × 30 endpoint = 120 test viết tay. ParameterizedTest.</li>
<li>Snapshot test không update khi schema legit đổi → false fail. Workflow update snapshot.</li>
<li>Mock auth bằng @WithMockUser cho slice test; integration test cần JWT real.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Authorization test matrix', prompt: 'KHÔNG cho code. Hỏi tôi: 1) Endpoint A có 4 outcomes (200, 401, 403, 404) tùy role. Cần bao nhiêu test? 2) Parameterize input để giảm code lặp? 3) Test "user thuộc workspace 1 nhưng request workspace 2" — kiểm tra leak ra sao? 4) Snapshot test activity feed — pros/cons?' }
          ],
          hints: [
            '@ParameterizedTest + @MethodSource cho role + expected status.',
            'Test cross-tenant: setup user A workspace 1, gọi workspace 2 → assert 404.',
            'Snapshot library: Approval Tests cho Java.'
          ]
        },
        {
          id: 's12',
          title: 'OpenAPI + Docker + deploy',
          description: { vi: 'springdoc-openapi + Dockerfile + compose. Deploy Fly.io / Render free tier.' },
          mentalModel: {
            vi: `Đến đây bạn có 3 production-shape backend trên GitHub. Đó là portfolio THẬT — không phải chứng chỉ.
<br/><br/>
<strong>First Principles — Portfolio polish</strong>:
<ul>
<li>README đầu tiên thu hút trong 30s: 1 screenshot + 1 paragraph + tech stack chips + live link.</li>
<li>Architecture diagram quan trọng — Mermaid (markdown native) hoặc Excalidraw image.</li>
<li>Demo video 90s show core flow → interviewer ấn tượng.</li>
<li>Deploy live (Fly.io/Render free) → interviewer click vào demo được. KHÔNG link GitHub là đủ.</li>
</ul>

<strong>Junior Pitfalls</strong>:
<ul>
<li>README dài 5 trang nhưng không demo screenshot.</li>
<li>Architecture chỉ text → interviewer skip.</li>
<li>Deploy fail giữa interview → embarrassing. Test trước.</li>
<li>Code clean nhưng commit history bừa → "WIP", "fix" — interviewer review git log thấy ngay. Squash trước push public.</li>
</ul>`
          },
          socraticPrompts: [
            { title: 'Portfolio polish', prompt: 'KHÔNG cho đáp án. Hỏi tôi: 1) README có gì để interviewer click vào trong 30 giây? 2) Architecture diagram — vẽ bằng gì? Mermaid? Excalidraw? 3) Demo video 90s — script khung thế nào? 4) Deploy live có cần thiết hay link GitHub đủ? 5) Bạn sẽ kể câu chuyện gì về dự án trong interview behavioral?' }
          ],
          hints: [
            'README với badges (build status, coverage, license).',
            'Architecture: Mermaid sequence diagram trong README.md.',
            'Deploy: Fly.io free tier hỗ trợ Postgres + Java app.',
            'Demo flow video: register → create workspace → invite member → realtime update.'
          ]
        }
      ],
      stretchGoals: [
        'GraphQL endpoint song song REST cho nested fetch.',
        'AI tóm tắt comments — gọi Anthropic API.',
        'Time tracking — start/stop timer trên task.',
        'Multi-language (Spring MessageSource).',
        'SAML/OAuth2 SSO.',
        'Daily digest email cho từng user (@Scheduled cron) — reuse Phase 3 Email module.',
        'Activity feed export PDF qua iText.'
      ]
    }
  ]
}
