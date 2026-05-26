// Module 3.5 — Email Notification System (NEW)
// Spring Mail + SMTP + @Scheduled cron jobs for daily reminders
export default {
  id: 'mod-3-5',
  title: 'Email Notification System — Spring Mail + @Scheduled Cron',
  lessons: [
    {
      id: 'l-3-5-1',
      type: 'theory',
      title: 'SMTP & spring-boot-starter-mail — Cơ chế gửi email',
      subtitle: { vi: 'Email cũng chỉ là 1 protocol TCP cũ xì. Hiểu để debug khi gửi fail.' },
      mentalModel: {
        vi: `Email gửi qua <strong>SMTP</strong> (Simple Mail Transfer Protocol) — protocol có từ 1982. Flow:
<ol>
<li>App (client) connect TCP đến SMTP server cổng 25/465/587.</li>
<li>Handshake: EHLO/HELO.</li>
<li>Auth (nếu cần): AUTH LOGIN với username/password.</li>
<li>Gửi MAIL FROM, RCPT TO, DATA (body).</li>
<li>SMTP server route đến mailbox đích qua MX records DNS.</li>
<li>QUIT.</li>
</ol>
Spring Mail wrap toàn bộ này. Bạn chỉ cần config <code>spring.mail.host</code> + <code>username</code> + <code>password</code> rồi inject <code>JavaMailSender</code>.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) SMTP ports — 3 loại</strong>
<ul>
<li><strong>25</strong>: server-to-server. Ngày nay ISP block port 25 outbound — client không gửi trực tiếp được.</li>
<li><strong>465</strong>: SMTPS (implicit TLS). Legacy.</li>
<li><strong>587</strong>: submission (STARTTLS upgrade). MODERN STANDARD cho client → server.</li>
</ul>
Production: dùng port 587 với STARTTLS.
<br/><br/>
<strong>2) JavaMailSender — Spring abstraction</strong>
<code>JavaMailSenderImpl</code> wrap <code>jakarta.mail.Session</code>. Bean auto-configured khi có <code>spring-boot-starter-mail</code> trong classpath. Inject thẳng.
<br/><br/>
<strong>3) SimpleMailMessage vs MimeMessage</strong>
<ul>
<li><code>SimpleMailMessage</code>: text-only. Simple, không HTML, không attachment.</li>
<li><code>MimeMessage</code>: full RFC 822 message. HTML, multipart, attachment, inline image. Dùng <code>MimeMessageHelper</code> để build dễ hơn.</li>
</ul>
<br/><br/>
<strong>4) Templating với Thymeleaf</strong>
Spring Boot có sẵn Thymeleaf cho email template. <code>email-reminder.html</code> trong <code>resources/templates/</code> với placeholder. Render qua <code>SpringTemplateEngine.process(template, context)</code>.
<br/><br/>
<strong>5) Async sending — quan trọng</strong>
SMTP I/O chậm (100ms - 2s). KHÔNG gửi sync trong request thread → user đợi. Dùng <code>@Async</code> push qua thread pool, return ngay.
<br/><br/>
<strong>6) Retry & DLQ</strong>
SMTP fail tạm thời (network blip, server quá tải). Production: retry 3 lần với exponential backoff. Persistent fail → DLQ (Dead Letter Queue) — chuyên gia review.
<br/><br/>
<strong>7) MailHog cho dev testing</strong>
SMTP server giả + Web UI bắt mọi email gửi qua. CHỈ DEV — không relay đi đâu. Test mà không spam user thật. Container: <code>mailhog/mailhog</code>, port 1025 (SMTP) + 8025 (Web UI).`
      },
      theory: {
        vi: `<h3>The "Why" — Spring Mail vs alternatives?</h3>
<ul>
  <li><strong>Spring Mail (SMTP)</strong>: free, đầy đủ control. Phù hợp self-host hoặc Gmail/SendGrid SMTP.</li>
  <li><strong>SaaS API (SendGrid, Mailgun, AWS SES)</strong>: REST API, deliverability tốt hơn (anti-spam, IP reputation), reporting. Phí per email.</li>
  <li>Production lớn: SaaS. Personal/startup: SMTP qua SaaS provider.</li>
</ul>

<h3>Provider phổ biến</h3>
<ul>
  <li><strong>Gmail SMTP</strong>: smtp.gmail.com:587. Cần App Password (KHÔNG password Google chính). Free 500/day.</li>
  <li><strong>SendGrid</strong>: 100/day free tier. API rất dev-friendly.</li>
  <li><strong>AWS SES</strong>: $0.10 / 1000 email. Cheap nhưng sandbox phải verify domain.</li>
  <li><strong>Mailgun</strong>: 5000/month free 3 tháng đầu.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Hardcode password Gmail</strong> trong code → spam folder + account lock. Dùng App Password.</li>
  <li><strong>Gmail account thật cho production</strong> → giới hạn 500/day + spam risk. Dùng SaaS.</li>
  <li><strong>Gửi sync trong controller</strong> → request chờ SMTP → timeout. Luôn <code>@Async</code>.</li>
  <li><strong>From address khác domain sở hữu</strong> → SPF/DKIM fail → vào spam.</li>
  <li><strong>HTML email không có text fallback</strong> → 1% client không render HTML.</li>
  <li><strong>Quên unsubscribe link</strong> → vi phạm CAN-SPAM, GDPR.</li>
  <li><strong>Production gửi email thật từ dev environment</strong> → spam user thật khi test. MailHog catch.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'pom.xml dependency',
          lang: 'xml',
          code: `<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
<!-- Cho HTML templating -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>`
        },
        {
          title: 'application.yml config — Dev (MailHog) + Prod (Gmail)',
          lang: 'yaml',
          code: `# application.yml (default — dùng cho dev với MailHog)
spring:
  mail:
    host: localhost
    port: 1025               # MailHog SMTP port
    username:                # MailHog không cần auth
    password:
    properties:
      mail:
        smtp:
          auth: false
          starttls.enable: false

app:
  mail:
    from: noreply@bootcamp.dev
    enabled: true            # toggle for tests

---
# application-prod.yml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: \${MAIL_USERNAME}    # env var
    password: \${MAIL_PASSWORD}    # App Password, KHÔNG password Google
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
        # Timeout — tránh request thread hang
        connectiontimeout: 5000
        timeout: 5000
        writetimeout: 5000

app:
  mail:
    from: \${MAIL_FROM:no-reply@yourdomain.com}
    enabled: \${MAIL_ENABLED:true}`
        },
        {
          title: 'docker-compose.yml — thêm MailHog (đã có ở module 3.1)',
          lang: 'yaml',
          code: `services:
  mailhog:
    image: mailhog/mailhog:latest
    container_name: bootcamp-mailhog
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI — mở http://localhost:8025 xem email`
        }
      ],
      socraticPrompts: [
        {
          title: 'Vì sao SMTP phức tạp đến vậy?',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. SMTP có từ 1982 — vì sao vẫn dùng? KHÔNG có chuẩn nào mới hơn sao?
2. Ports 25, 465, 587 — khác nhau ra sao? Production chọn nào?
3. Vì sao Gmail block "less secure apps" và bắt dùng App Password?
4. SPF, DKIM, DMARC — 3 chuẩn này giúp gì? Mail KHÔNG có chúng vào spam ra sao?
5. Email reach inbox vs spam — yếu tố quyết định?`
        },
        {
          title: 'Provider decision',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Startup mới — 100 email/ngày — chọn Gmail SMTP, SendGrid, hay self-host?
2. App 100k user — gửi welcome + reminder daily — chọn nào?
3. Self-host SMTP server: complexity gì? IP reputation, spam list, ...
4. SaaS (SendGrid, Mailgun) — free tier có rate limit không?
5. AWS SES sandbox vs production — khác biệt? Tại sao sandbox phải verify recipient?`
        }
      ]
    },

    {
      id: 'l-3-5-2',
      type: 'practice',
      title: 'Implement EmailService — Send Simple + HTML Email',
      mentalModel: {
        vi: `<code>EmailService</code> = facade encapsulate <code>JavaMailSender</code> + template engine.
<ul>
<li><code>sendSimple(to, subject, body)</code>: plain text — log, debug.</li>
<li><code>sendHtml(to, subject, templateName, model)</code>: render template với data.</li>
</ul>
Mọi method <code>@Async</code> — return <code>CompletableFuture&lt;Void&gt;</code> hoặc void.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) @Async cần @EnableAsync</strong>
Bật <code>@EnableAsync</code> trên config class. Spring proxy method có <code>@Async</code> qua <code>TaskExecutor</code> default. Tự config thread pool cho production.
<br/><br/>
<strong>2) Self-invocation pitfall (lại)</strong>
<code>this.sendHtml(...)</code> trong cùng class → KHÔNG đi qua proxy → KHÔNG async. Phải gọi qua bean khác.
<br/><br/>
<strong>3) Exception trong @Async</strong>
Method <code>@Async void</code> throw exception → KHÔNG lan ra caller. Mất exception. Hai cách:
<ul>
<li>Return <code>CompletableFuture</code> + caller handle.</li>
<li><code>AsyncUncaughtExceptionHandler</code> log central.</li>
</ul>
<br/><br/>
<strong>4) Thread pool sizing</strong>
Default Spring <code>SimpleAsyncTaskExecutor</code> — tạo thread mới mỗi call. KHÔNG production-grade (thread storm). Production: <code>ThreadPoolTaskExecutor</code> với corePoolSize 5-10, maxPoolSize 20.
<br/><br/>
<strong>5) MimeMessageHelper API</strong>
Build MIME message dễ hơn raw API. Set <code>true</code> cho HTML flag. Add inline image với CID, attachment, ...
<br/><br/>
<strong>6) Thymeleaf SpringTemplateEngine</strong>
Khác Thymeleaf web view: cần <code>setPrefix("classpath:/templates/")</code>, <code>setSuffix(".html")</code>. Context = Map của variable cho template.`
      },
      theory: {
        vi: `<h3>The "Why" — Tách EmailService?</h3>
<ul>
  <li>Centralize email logic — 1 chỗ thay đổi provider (Gmail → SES).</li>
  <li>Test dễ — mock EmailService trong unit test, không spin SMTP.</li>
  <li>Audit — log mọi email gửi ở 1 chỗ.</li>
  <li>Feature flag <code>app.mail.enabled</code> để tắt trong test.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên @EnableAsync</strong> → @Async vô tác dụng, gửi sync.</li>
  <li><strong>Self-invocation @Async</strong> → KHÔNG async. Phải qua proxy.</li>
  <li><strong>Catch generic Exception trong @Async void</strong> → mất stack trace.</li>
  <li><strong>Không config thread pool</strong> → SimpleAsyncTaskExecutor tạo thread storm.</li>
  <li><strong>HTML template hard-coded trong code</strong> → khó update, không reusable. Dùng Thymeleaf.</li>
  <li><strong>Quên setFrom()</strong> → SMTP server reject hoặc mark spam.</li>
  <li><strong>Test gọi email service THẬT</strong> → spam user thật. Mock + verify interaction.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'EmailService full implementation',
          code: `@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "emailExecutor")
    public ThreadPoolTaskExecutor emailExecutor() {
        ThreadPoolTaskExecutor exec = new ThreadPoolTaskExecutor();
        exec.setCorePoolSize(5);
        exec.setMaxPoolSize(20);
        exec.setQueueCapacity(100);
        exec.setThreadNamePrefix("email-");
        exec.initialize();
        return exec;
    }
}

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("\${app.mail.from}") private String from;
    @Value("\${app.mail.enabled:true}") private boolean enabled;

    @Async("emailExecutor")
    public void sendSimple(String to, String subject, String body) {
        if (!enabled) { log.info("Mail disabled, skip"); return; }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Sent simple email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
        }
    }

    @Async("emailExecutor")
    public void sendHtml(String to, String subject, String templateName, Map<String, Object> model) {
        if (!enabled) { log.info("Mail disabled, skip"); return; }
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            Context ctx = new Context();
            ctx.setVariables(model);
            String html = templateEngine.process(templateName, ctx);
            helper.setText(html, true);    // true = HTML
            mailSender.send(mime);
            log.info("Sent HTML email '{}' to {}", templateName, to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage(), e);
        }
    }
}`
        },
        {
          title: 'Thymeleaf template: resources/templates/study-reminder.html',
          lang: 'html',
          code: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head><meta charset="UTF-8"><title>Bootcamp Reminder</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2563eb; color: white; padding: 20px;">
    <h1>🔥 Java Bootcamp — Daily Reminder</h1>
  </div>
  <div style="padding: 20px;">
    <p>Chào <strong th:text="\${userName}">bạn</strong>!</p>
    <p>Bạn đã có chuỗi <strong th:text="\${streak}">N</strong> ngày học liên tục.
       Đừng break streak hôm nay nhé!</p>

    <p>📚 Lesson hôm nay đề xuất: <strong th:text="\${nextLesson}">Sliding Window</strong></p>
    <p>📈 Tổng tiến độ: <span th:text="\${progressPct}">0</span>%</p>

    <a th:href="\${appUrl}"
       style="display: inline-block; background: #2563eb; color: white;
              padding: 12px 24px; text-decoration: none; border-radius: 6px;
              margin-top: 16px;">
      Tiếp tục học →
    </a>

    <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
      Bạn nhận được email này vì đã bật reminder. <br/>
      <a th:href="\${unsubscribeUrl}" style="color: #6b7280;">Tắt reminder</a>
    </p>
  </div>
</body>
</html>`
        },
        {
          title: 'Caller sample — service business gửi email',
          code: `@Service
@RequiredArgsConstructor
public class UserOnboardingService {
    private final EmailService emailService;

    @Transactional
    public void onRegister(User user) {
        // ... save user, etc.
        // Gửi welcome email — async, KHÔNG block transaction
        emailService.sendHtml(
            user.getEmail(),
            "Chào mừng đến Java Bootcamp!",
            "welcome",
            Map.of(
                "userName", user.getEmail().split("@")[0],
                "appUrl", "https://bootcamp.dev"
            )
        );
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'Async pitfalls',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. @Async cần annotation gì BẬT trên config class?
2. Self-invocation: <code>this.send()</code> với @Async — có async không? Vì sao không?
3. <code>@Async void</code> throw exception — caller có catch được không?
4. Default Spring TaskExecutor là gì? Vì sao production cần config riêng?
5. Email service gọi trong @Transactional — gửi email NGAY hay sau commit?`
        }
      ],
      exercises: [
        {
          title: 'Send welcome email khi user register',
          prompt: 'Tích hợp EmailService vào AuthController. Khi /register thành công, gửi welcome email async với template "welcome.html".',
          hints: [
            'Câu hỏi 1: Gọi <code>emailService.sendHtml()</code> trong controller hay service? Vì sao service?',
            'Câu hỏi 2: Email fail KHÔNG nên rollback transaction tạo user. Tại sao? Làm sao đảm bảo?'
          ],
          solution: {
            code: `@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final EmailService emailService;
    private final ApplicationEventPublisher eventPublisher;   // alternative: event-driven

    @Transactional
    public User register(String email, String password) {
        if (userRepo.existsByEmail(email))
            throw new DataIntegrityViolationException("Email đã tồn tại");
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(password));
        user.setRole("USER");
        User saved = userRepo.save(user);

        // Gửi email async — KHÔNG block transaction
        // Email fail KHÔNG rollback user creation (vì async, exception không lan ra)
        emailService.sendHtml(
            saved.getEmail(),
            "Chào mừng đến Java Bootcamp!",
            "welcome",
            Map.of(
                "userName", saved.getEmail().split("@")[0],
                "appUrl", "https://bootcamp.dev"
            )
        );

        return saved;
    }
}`,
            lang: 'java',
            complexityVi: 'Time: register O(1) DB. Email O(SMTP roundtrip) chạy NGOÀI transaction, KHÔNG block.',
            explanationVi: '@Async đảm bảo email gửi NGOÀI transaction → fail email KHÔNG rollback user. Tốt hơn nữa: dùng <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> + ApplicationEventPublisher.publishEvent() — chỉ gửi email khi user đã commit thật sự.'
          }
        }
      ]
    },

    {
      id: 'l-3-5-3',
      type: 'theory',
      title: '@Scheduled — Cron Jobs cho Daily Study Reminders',
      mentalModel: {
        vi: `<code>@Scheduled</code> là cách Spring chạy method <strong>định kỳ</strong> mà KHÔNG cần OS cron. 3 cách:
<ul>
<li><code>fixedRate</code>: chạy mỗi N millisecond, KHÔNG đợi previous xong.</li>
<li><code>fixedDelay</code>: chạy N millisecond SAU khi previous xong.</li>
<li><code>cron</code>: Cron expression — flexible nhất.</li>
</ul>
Phải <code>@EnableScheduling</code> trên config class.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Cron expression — 6 fields Spring</strong>
<pre>second minute hour day month day-of-week</pre>
Khác Unix cron (5 fields, thiếu seconds). Examples:
<ul>
<li><code>"0 0 8 * * *"</code> — 8:00 AM mỗi ngày.</li>
<li><code>"0 */15 * * * *"</code> — mỗi 15 phút.</li>
<li><code>"0 0 9 * * MON-FRI"</code> — 9:00 AM thứ 2-6.</li>
<li><code>"0 0 0 1 * *"</code> — 0:00 ngày 1 mỗi tháng.</li>
</ul>
<br/><br/>
<strong>2) ThreadPoolTaskScheduler — production config</strong>
Default Spring scheduler chỉ có 1 thread → 2 job overlap thì 1 phải đợi. Production: config thread pool với <code>setPoolSize(N)</code>.
<br/><br/>
<strong>3) Single-instance vs multi-instance</strong>
App chạy multi-instance (replica) → mỗi instance chạy @Scheduled → JOB DUPLICATE! User nhận email 3 lần.
Solution:
<ul>
<li><strong>Shedlock</strong>: distributed lock qua DB/Redis — chỉ 1 instance chạy.</li>
<li><strong>Quartz cluster mode</strong>: enterprise scheduler với DB locking.</li>
<li><strong>Pull pattern</strong>: job push message vào queue, worker pull (Kafka, RabbitMQ).</li>
</ul>
<br/><br/>
<strong>4) Timezone</strong>
Default <code>@Scheduled</code> dùng JVM timezone. Servers thường UTC. Email reminder 8:00 AM → 8 AM UTC ≠ 8 AM Hà Nội. Set zone: <code>@Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh")</code>.
<br/><br/>
<strong>5) Missed fires</strong>
Server restart đúng lúc job sắp chạy → MISS. Spring KHÔNG re-run missed jobs (khác Quartz). Cron jobs phải IDEMPOTENT — chạy 2 lần OK.
<br/><br/>
<strong>6) Long-running jobs</strong>
Job 30 phút trong @Scheduled fixedRate=10min → 4 instance overlap → memory/DB pressure. Dùng <code>fixedDelay</code> hoặc convert sang queue-based.`
      },
      theory: {
        vi: `<h3>The "Why" — @Scheduled vs OS cron vs Quartz?</h3>
<ul>
  <li><strong>@Scheduled</strong>: built-in Spring, đơn giản, đủ cho monolith single-instance.</li>
  <li><strong>OS cron</strong>: gọi REST endpoint từ shell script — KHÔNG share JVM/DB connection. Phù hợp script cũ.</li>
  <li><strong>Quartz</strong>: enterprise, persistent job store, cluster mode, missed fire policies. Phức tạp.</li>
</ul>

<h3>Use cases trong bootcamp app</h3>
<ul>
  <li>Daily study reminder email (8 AM).</li>
  <li>Cleanup expired tokens / sessions (1 AM).</li>
  <li>Weekly digest email (Sun 10 AM).</li>
  <li>Cache warmup (every 30 min).</li>
  <li>Health check internal services.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên @EnableScheduling</strong> → @Scheduled vô tác dụng.</li>
  <li><strong>Cron expression Unix 5 fields</strong> → Spring throw (Spring dùng 6 fields).</li>
  <li><strong>Long task trong fixedRate</strong> → overlap, memory leak. Dùng fixedDelay hoặc queue.</li>
  <li><strong>Multi-instance không lock</strong> → job chạy N lần. ShedLock.</li>
  <li><strong>Job KHÔNG idempotent</strong> → restart re-run gây data corruption.</li>
  <li><strong>Hard-code timezone</strong> sang server time → bug khi deploy region khác.</li>
  <li><strong>Job query lớn không paginate</strong> → OOM khi user count tăng.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Enable scheduling + custom scheduler',
          code: `@Configuration
@EnableScheduling
public class SchedulingConfig {
    @Bean
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5);
        scheduler.setThreadNamePrefix("scheduled-");
        scheduler.setErrorHandler(t ->
            LoggerFactory.getLogger("scheduled").error("Scheduled task error", t));
        return scheduler;
    }
}`
        },
        {
          title: 'StudyReminderJob — gửi reminder 8 AM mỗi ngày',
          code: `@Component
@RequiredArgsConstructor
@Slf4j
public class StudyReminderJob {
    private final UserRepository userRepo;
    private final ProgressService progressService;
    private final EmailService emailService;

    // Cron: 8:00 AM mỗi ngày, giờ Việt Nam
    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh")
    public void sendDailyReminders() {
        log.info("Starting daily reminder job");
        int sent = 0;

        // Paginate để tránh OOM với user lớn
        int page = 0;
        Page<User> users;
        do {
            users = userRepo.findByEmailReminderEnabledTrue(PageRequest.of(page, 100));
            for (User user : users) {
                try {
                    ProgressSummary p = progressService.getSummary(user.getId());
                    emailService.sendHtml(
                        user.getEmail(),
                        "🔥 Đừng break streak hôm nay!",
                        "study-reminder",
                        Map.of(
                            "userName", user.getEmail().split("@")[0],
                            "streak", p.getStreak(),
                            "nextLesson", p.getNextLessonTitle(),
                            "progressPct", p.getOverallPct(),
                            "appUrl", "https://bootcamp.dev",
                            "unsubscribeUrl", "https://bootcamp.dev/settings"
                        )
                    );
                    sent++;
                } catch (Exception e) {
                    log.error("Failed reminder for user {}", user.getId(), e);
                }
            }
            page++;
        } while (users.hasNext());

        log.info("Daily reminder job done: sent {} emails", sent);
    }

    // Cleanup expired tokens — chạy 1 AM mỗi ngày
    @Scheduled(cron = "0 0 1 * * *", zone = "UTC")
    @Transactional
    public void cleanupExpiredTokens() {
        // ... delete expired refresh tokens
    }

    // Weekly digest — Sunday 10 AM
    @Scheduled(cron = "0 0 10 * * SUN", zone = "Asia/Ho_Chi_Minh")
    public void sendWeeklyDigest() {
        // ... send digest email
    }
}`
        },
        {
          title: 'Cron expression cheat sheet',
          lang: 'text',
          code: `Spring cron: second minute hour day month day-of-week

"0 0 8 * * *"           — 8:00:00 AM mỗi ngày
"0 */15 * * * *"        — mỗi 15 phút (0, 15, 30, 45)
"0 0 9 * * MON-FRI"     — 9 AM thứ 2-6
"0 0 0 1 * *"           — 0:00 ngày 1 mỗi tháng
"0 0 12 * * SUN"        — 12:00 PM mỗi Chủ Nhật
"30 * * * * *"          — 30s mỗi phút
"0 0 0 1 1 *"           — đầu năm (1/1 0:00)
"0 0 22 * * *"          — 10 PM mỗi ngày

Tip: dùng https://crontab.guru để debug (lưu ý: Unix 5 fields,
     bỏ field đầu khi paste vào Spring).`
        }
      ],
      socraticPrompts: [
        {
          title: 'Cron design decisions',
          prompt: `Bạn cần gửi reminder email 8 AM mỗi ngày. KHÔNG cho code. Hỏi tôi:
1. App chạy 3 replica trong Kubernetes — @Scheduled sẽ làm gì? User nhận email mấy lần?
2. Solutions cho duplicate: ShedLock, Quartz cluster, queue-based. Trade-off mỗi cách?
3. Server restart đúng 7:59 AM — job có chạy được 8 AM không? Spring xử lý missed fire ra sao?
4. Job query 1M user — risk gì? Cách pagination?
5. Email fail cho 1 user — có nên throw để retry hết job? Hay catch và continue?`
        },
        {
          title: 'Idempotency',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. "Idempotent" nghĩa là gì cho 1 cron job?
2. Job "send daily reminder" — chạy 2 lần liên tiếp trong cùng ngày, user có nhận 2 email không?
3. Làm sao đảm bảo idempotent? (Hint: track <code>last_reminder_sent_at</code> + check trước gửi)
4. Job restock inventory KHÔNG idempotent — chạy 2 lần dẫn đến gì?
5. Pattern "exactly-once" trong distributed system khó ra sao?`
        }
      ],
      exercises: [
        {
          title: 'Bật/tắt email reminder per-user',
          prompt: 'User có thể opt-in/out email reminder qua /users/me/settings. Schema có cột <code>email_reminder_enabled</code>. Job chỉ gửi cho user enabled.',
          hints: [
            'Câu hỏi 1: Repository method tìm user có flag = true. Method derivation hoặc @Query?',
            'Câu hỏi 2: Pagination như thế nào để job không OOM với 1M user?'
          ],
          solution: {
            code: `// Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByEmailReminderEnabledTrue(Pageable pageable);
}

// Controller endpoint cho user settings
@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserSettingsController {
    private final UserRepository userRepo;

    public record UpdateSettingsRequest(Boolean emailReminderEnabled) {}

    @PatchMapping("/settings")
    @Transactional
    public ResponseEntity<Void> updateSettings(
            @RequestBody UpdateSettingsRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmail(principal.getUsername()).orElseThrow();
        if (req.emailReminderEnabled() != null) {
            user.setEmailReminderEnabled(req.emailReminderEnabled());
        }
        // dirty checking tự save
        return ResponseEntity.noContent().build();
    }
}

// Job iterate paginated
@Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh")
public void sendDailyReminders() {
    int page = 0;
    Page<User> users;
    do {
        users = userRepo.findByEmailReminderEnabledTrue(PageRequest.of(page, 100));
        users.forEach(this::sendReminderSafe);
        page++;
    } while (users.hasNext());
}

private void sendReminderSafe(User u) {
    try {
        emailService.sendHtml(u.getEmail(), "Reminder", "study-reminder", buildModel(u));
    } catch (Exception e) {
        log.error("Failed for user {}", u.getId(), e);   // KHÔNG throw — tiếp tục user khác
    }
}`,
            lang: 'java',
            complexityVi: 'Time: O(N) qua N user với reminder enabled, mỗi user 1 email async. Space O(100) per page.',
            explanationVi: 'Pagination 100 user/batch tránh OOM. Try-catch trong loop đảm bảo 1 user fail KHÔNG dừng job. Email async qua thread pool — không block scheduler thread. <code>@Transactional</code> trên PATCH cho dirty checking auto-save.'
          }
        }
      ]
    }
  ]
}
