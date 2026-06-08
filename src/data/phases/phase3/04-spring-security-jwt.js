// Module 3.4 — Spring Security 6 & JWT Authentication
export default {
  id: 'mod-3-4',
  title: 'Spring Security 6 & JWT Authentication',
  prerequisites: { vi: 'Hoàn thành <code>Module 3.2 (Spring Boot REST), 3.3 (JPA)</code>. Hiểu @RestController, repository.' },
  lessons: [
    {
      id: 'l-3-4-1',
      type: 'theory',
      title: 'Spring Security Filter Chain — How Auth Works',
      mentalModel: {
        vi: `Mỗi HTTP request vào Spring Boot đi qua <strong>chuỗi filter</strong> trước khi đến controller. Spring Security thêm hàng chục filter vào chuỗi này:
<ol>
<li>CORS filter — handle preflight.</li>
<li>CSRF filter — check token (cho session-based).</li>
<li><strong>Authentication filter</strong> — đọc credential (Basic, JWT, ...) và xác thực.</li>
<li><strong>Authorization filter</strong> — check role/permission cho request.</li>
<li>Exception translation filter — đổi exception thành 401/403.</li>
</ol>
JWT: chèn 1 custom filter ĐỌC <code>Authorization: Bearer ...</code>, decode, set <code>SecurityContext</code>. Các filter sau biết "đã auth" và cho qua.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) SecurityContext qua ThreadLocal</strong>
Spring Security lưu authenticated user trong ThreadLocal — mỗi request có context riêng. Sau request, Spring clear ThreadLocal. Đây là lý do bạn LẤY ĐƯỢC user hiện tại từ BẤT CỨ ĐÂU trong code business mà KHÔNG cần truyền parameter.
<br/><br/>
<strong>2) Stateless vs Session</strong>
<ul>
<li><strong>Session-based</strong>: server lưu sessionId → user. Cần sticky session hoặc Redis-backed session store. Khó scale horizontally.</li>
<li><strong>JWT stateless</strong>: token CHỨA user info + signature. Server CHỈ verify signature. Scale dễ. NHƯỢC: KHÔNG revoke được token (trừ blacklist).</li>
</ul>
<br/><br/>
<strong>3) JWT anatomy</strong>
3 parts cách bởi dấu chấm: <code>header.payload.signature</code>.
<ul>
<li><strong>Header</strong>: <code>{"alg":"HS256","typ":"JWT"}</code> Base64URL.</li>
<li><strong>Payload (Claims)</strong>: <code>sub</code>, <code>iat</code>, <code>exp</code>, custom claims (roles, ...). Base64URL.</li>
<li><strong>Signature</strong>: <code>HMAC-SHA256(header + "." + payload, secret)</code>.</li>
</ul>
Server VERIFY signature → biết payload chưa bị sửa. <strong>JWT KHÔNG mã hóa</strong> — ai cũng decode được payload. KHÔNG bỏ password vào JWT.
<br/><br/>
<strong>JWS vs JWE — "JWT" là tên chung</strong>
"JWT" trong 95% bài viết thực ra là <strong>JWS (JSON Web Signature)</strong> — chỉ SIGN, payload base64 decode được. Còn <strong>JWE (JSON Web Encryption)</strong> encrypt payload nữa, chỉ holder của decryption key đọc được. jjwt 0.12+ hỗ trợ cả hai (xem <code>Jwts.builder().encryptWith(...)</code>). Khi nào dùng JWE? — payload có PII (email, số CMND) phải đi qua bên thứ ba. Còn data thường (user id, roles) → JWS đủ. Lesson này dạy JWS.
<br/><br/>
<strong>4) JWT secret</strong>
KHÔNG commit secret. Tối thiểu 256-bit cho HS256. Sinh: <code>openssl rand -base64 32</code>. Trong K8s: dùng Secret object. Trong dev: env var.
<br/><br/>
<strong>5) Token expiration</strong>
TTL ngắn (15 phút) + refresh token dài hơn (7 ngày) là pattern phổ biến. Access token expire → client gửi refresh → server cấp access mới. Hạn chế damage khi token leak.
<br/><br/>
<strong>6) BCrypt password hash</strong>
KHÔNG bao giờ lưu plaintext. Cũng KHÔNG dùng SHA256/MD5 (quá nhanh — brute force easy). BCrypt slow by design — strength 12 default. Salt built-in mỗi password.
<br/><br/>
<strong>7) AuthenticationManager flow</strong>
<ol>
<li>UserDetailsService load user from DB by email.</li>
<li>PasswordEncoder (BCrypt) verify password.</li>
<li>Return UsernamePasswordAuthenticationToken nếu OK.</li>
<li>SecurityContext set authenticated user.</li>
</ol>`
      },
      theory: {
        vi: `<h3>The "Why" — JWT vs Session?</h3>
<ul>
  <li><strong>JWT</strong>: scale horizontal dễ, mobile/SPA friendly, microservices auth.</li>
  <li><strong>Session</strong>: revoke dễ (xóa server-side), không lo token leak persistent.</li>
  <li>JWT thắng cho stateless API. Session thắng cho server-rendered web cần revoke ngay.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>JWT trong localStorage</strong> — vulnerable XSS. Cookie HttpOnly an toàn hơn nhưng cần CSRF protection.</li>
  <li><strong>Lưu password trong JWT payload</strong> — payload base64 decode-able. Chỉ lưu user id + roles.</li>
  <li><strong>Secret 16 ký tự</strong> — quá ngắn. Tối thiểu 256-bit (32 byte) cho HS256.</li>
  <li><strong>TTL 24 giờ + không refresh</strong> — leak = 24h compromise. Ngắn + refresh.</li>
  <li><strong>Không verify signature</strong> — attacker sửa payload (role = ADMIN). Luôn verify trước khi trust.</li>
  <li><strong>alg: none attack</strong> — old libs accept "no signature". Thư viện modern (jjwt) tránh.</li>
  <li><strong>Trả 200 cho "user not found"</strong> trong /login — leak username. Trả 401 generic "Invalid credentials" cho cả 2 case.</li>
  <li><strong>Default JWT secret trong application.yml</strong> — junior commit lên git, secret thật bị leak. <strong>BẮT BUỘC</strong> env var, fail-fast nếu thiếu: <code>\${JWT_SECRET:?JWT_SECRET env var required}</code>.</li>
  <li><strong>Không rate-limit /login</strong> — attacker brute-force 100 password/giây. Phải có rate-limit (Bucket4j) + account lockout sau N lần fail.</li>
  <li><strong>Không config AuthenticationEntryPoint</strong> — Spring default trả HTML trắng cho 401, SPA/mobile không parse được. Phải custom ra ProblemDetail JSON (RFC 7807).</li>
  <li><strong>Catch JwtException ignored trong filter</strong> — token sai/hết hạn thì silent fail, request đi tiếp như chưa auth. Tốt hơn: log + set 401 thẳng với ProblemDetail.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'SecurityConfig hoàn chỉnh',
          code: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity                         // bật @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())     // JWT stateless → không cần CSRF
            .cors(cors -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll()
                .anyRequest().authenticated())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // strength 12
    }
}

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse resp,
                                    FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, resp);
            return;
        }
        String token = header.substring(7);
        try {
            String email = jwtService.extractUsername(token);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userDetailsService.loadUserByUsername(email);
                if (jwtService.isValid(token, user)) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException ignored) { /* invalid token → tiếp tục như chưa auth */ }
        chain.doFilter(req, resp);
    }
}`
        }
      ],
      socraticPrompts: [
        {
          title: 'JWT vs Session',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Server cần lưu thông tin gì về user khi dùng JWT?
2. User đổi password — JWT cũ vẫn hợp lệ? Làm sao "logout" thực sự?
3. Secret bị lộ — chuyện gì xảy ra? Rotate ra sao?
4. Vì sao KHÔNG đặt password vào JWT payload, dù được encrypt?
5. Refresh token là gì? Vì sao cần?
6. JWT trong cookie HttpOnly vs localStorage — đâu an toàn hơn? Tại sao?`
        },
        {
          title: 'Suy luận filter chain',
          prompt: `KHÔNG cho code. Hỏi tôi:
1. Request không có Authorization header — JwtAuthFilter làm gì? SecurityContext sau filter?
2. Filter sau (authorization) thấy SecurityContext empty — kết luận gì? Cho qua hay từ chối?
3. <code>/api/v1/auth/login</code> có <code>permitAll()</code> — vì sao? Cần JWT để LẤY JWT không?
4. <code>@PreAuthorize("hasRole('ADMIN')")</code> hoạt động ở giai đoạn nào?
5. App có cả JWT và OAuth2 — filter nào chạy trước?`
        }
      ]
    },

    {
      id: 'l-3-4-2',
      type: 'practice',
      title: 'JwtService — Issue & Validate Tokens',
      mentalModel: {
        vi: `<code>JwtService</code> là CHỖ DUY NHẤT trong app làm việc với JWT. Tách rõ:
<ul>
<li><code>issue(user)</code>: tạo token từ user info.</li>
<li><code>extractUsername(token)</code>: parse + verify, trả subject.</li>
<li><code>isValid(token, user)</code>: check subject match + chưa expire.</li>
</ul>`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) jjwt library</strong>
<code>io.jsonwebtoken:jjwt-api</code> + <code>jjwt-impl</code> + <code>jjwt-jackson</code>. Implementation chuẩn cho Java. Không tự rinh JWT (dễ sai signature/parsing).
<br/><br/>
<strong>2) Claims standard</strong>
<ul>
<li><code>sub</code> (subject) — username/userId.</li>
<li><code>iat</code> (issued at) — Unix timestamp.</li>
<li><code>exp</code> (expiration) — Unix timestamp.</li>
<li><code>iss</code> (issuer) — ai cấp token.</li>
<li><code>aud</code> (audience) — ai nhận token.</li>
</ul>
Custom claims: thêm bất kỳ key-value (roles, ...).
<br/><br/>
<strong>3) HS256 vs RS256</strong>
<ul>
<li><strong>HS256 (HMAC)</strong>: symmetric — cùng secret để sign + verify. Đơn giản. Dùng trong monolith.</li>
<li><strong>RS256 (RSA)</strong>: asymmetric — private key sign, public key verify. Phù hợp microservices (chỉ Auth Service có private key).</li>
</ul>
<br/><br/>
<strong>4) Verify trước khi trust</strong>
<code>Jwts.parser().verifyWith(key).build().parseSignedClaims(token)</code> — verify signature first. Nếu invalid, throw <code>JwtException</code>. KHÔNG bao giờ <code>parseClaimsUnsecured</code>.
<br/><br/>
<strong>5) Clock skew</strong>
Server time có thể lệch vài giây giữa các machine. jjwt cho phép <code>setAllowedClockSkewSeconds</code> để tolerance. Default 0 — strict.`
      },
      theory: {
        vi: `<h3>The "Why" — Custom service vs library magic</h3>
<ul>
  <li>Centralize JWT logic — 1 chỗ thay đổi (algorithm, claims) impact toàn app.</li>
  <li>Test dễ — mock JwtService trong unit test.</li>
  <li>Tách concern: filter chỉ orchestrate, service làm crypto.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>TTL 24h+ cho access token</strong> — leak = damage lớn. 15-30 phút + refresh token.</li>
  <li><strong>Quên rotate refresh token</strong> — leak persistent. Mỗi lần refresh, cấp refresh mới + revoke cũ.</li>
  <li><strong>Lưu roles trong JWT</strong> — demote user, role cũ vẫn dùng cho đến hết TTL. Trade-off: query DB mỗi request (chậm) vs stale role (security).</li>
  <li><strong>Quên null check token</strong> — Authorization header missing → token = null → NPE. Filter pattern xử lý sẵn.</li>
  <li><strong>Throw exception ra filter</strong> → Spring KHÔNG handle qua @RestControllerAdvice (filter chạy trước controller). Phải set response status thẳng hoặc catch trong filter.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'JwtService production-ready',
          code: `@Service
public class JwtService {
    @Value("\${app.jwt.secret}") private String secret;
    @Value("\${app.jwt.ttlMinutes}") private long ttlMinutes;

    public String issue(UserDetails user) {
        return Jwts.builder()
            .subject(user.getUsername())
            .issuedAt(Date.from(Instant.now()))
            .expiration(Date.from(Instant.now().plus(ttlMinutes, ChronoUnit.MINUTES)))
            .claim("roles", user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList())
            .signWith(key())
            .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        Claims c = parseClaims(token);
        return c.getSubject().equals(user.getUsername())
            && c.getExpiration().after(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key()).build()
            .parseSignedClaims(token).getPayload();
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}

// application.yml — KHÔNG default secret. Fail-fast nếu thiếu env var:
// app:
//   jwt:
//     secret: \${JWT_SECRET:?JWT_SECRET env var required — generate by: openssl rand -base64 32}
//     ttlMinutes: 30
//     refreshTtlDays: 7`
        }
      ],
      socraticPrompts: [
        {
          title: 'JWT security pitfalls',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. TTL JWT bao lâu là hợp lý? Quá ngắn / quá dài — vấn đề gì?
2. Vì sao lưu <code>roles</code> trong JWT thay vì query DB mỗi request?
3. Nhược điểm khi lưu roles: admin demote user, token cũ vẫn có role ADMIN. Giải quyết?
4. Bug bảo mật kinh điển: <code>alg: none</code> attack. Là gì? jjwt tránh ra sao?
5. Replay attack: kẻ tấn công cắp token và dùng lại. JWT có ngăn được không?`
        }
      ],
      exercises: [
        {
          title: 'AuthController với register + login',
          prompt: 'Build AuthController có /register (tạo user, hash BCrypt) và /login (verify, trả JWT). Validate input.',
          hints: [
            'Câu hỏi 1: Register: hash password, save user. Login: AuthenticationManager.authenticate() trước khi issue token. Vì sao tách 2 step?',
            'Câu hỏi 2: Return shape của login: chỉ <code>{token: "..."}</code> hay kèm thêm <code>expiresIn</code>, <code>tokenType</code>?'
          ],
          solution: {
            code: `public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8) String password) {}
public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
public record AuthResponse(String token, String tokenType, long expiresIn) {}

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.email()))
            throw new DataIntegrityViolationException("Email đã tồn tại");
        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setRole("USER");
        userRepo.save(user);
        String token = jwtService.issue(toUserDetails(user));
        return ResponseEntity.status(201).body(new AuthResponse(token, "Bearer", 30 * 60));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        UserDetails user = userRepo.findByEmail(req.email())
            .map(this::toUserDetails)
            .orElseThrow();
        return new AuthResponse(jwtService.issue(user), "Bearer", 30 * 60);
    }

    private UserDetails toUserDetails(User u) {
        return org.springframework.security.core.userdetails.User.builder()
            .username(u.getEmail())
            .password(u.getPasswordHash())
            .authorities("ROLE_" + u.getRole())
            .build();
    }
}`,
            lang: 'java',
            complexityVi: 'Time: BCrypt hash O(2^strength) — ~100ms strength 12. Login O(1) DB + 1 BCrypt verify. Space O(1).',
            explanationVi: 'Register: BCrypt hash trước khi save (NEVER plaintext). Login: AuthenticationManager xử lý verify (qua UserDetailsService + PasswordEncoder Spring đã wire). 401 nếu BadCredentials — Spring tự throw. Return <code>tokenType: "Bearer"</code> theo OAuth2 standard.'
          }
        }
      ]
    },

    {
      id: 'l-3-4-3',
      type: 'practice',
      title: 'Production Hardening — Refresh Token, Rate Limit, AuthenticationEntryPoint, Swagger',
      mentalModel: {
        vi: `Lesson 1+2 dạy JWT auth CƠ BẢN. Production-ready cần 4 thứ nữa mà junior thường BỎ QUA:
<ol>
<li><strong>Refresh token</strong> — access token TTL 15p + refresh token 7d. Leak access = damage 15p, không phải 24h.</li>
<li><strong>AuthenticationEntryPoint + AccessDeniedHandler</strong> — return ProblemDetail JSON 401/403 (RFC 7807) thay vì HTML default. SPA/mobile cần JSON để parse.</li>
<li><strong>Rate limit + account lockout</strong> — chặn brute-force <code>/login</code>. Bucket4j 10 req/phút per IP, lockout sau 5 lần fail liên tục.</li>
<li><strong>Swagger bearer auth + CORS</strong> — UI test JWT endpoint từ Swagger, SPA call cross-origin.</li>
</ol>
Bài này là <strong>checklist trước khi deploy</strong>. Skip = backend hoạt động được trên Postman nhưng SPA gọi sẽ vỡ.`
      },
      underTheHood: {
        vi: `<h3>First Principles</h3>

<strong>1) Refresh token rotation</strong>
<ul>
<li><strong>Access token</strong> (JWT, 15-30 phút) — gửi trong header mỗi request, stateless verify.</li>
<li><strong>Refresh token</strong> (opaque random string, 7-30 ngày) — lưu trong DB hashed (như password). Khi access hết hạn, client gửi refresh → server cấp access mới + cấp refresh MỚI + revoke refresh CŨ. Pattern này gọi là <em>rotation</em>.</li>
</ul>
Vì sao rotation? — Nếu attacker steal refresh, dùng 1 lần → server cấp refresh mới cho attacker. Khi nạn nhân dùng refresh cũ → server detect "refresh đã rotate" → invalidate cả family → buộc re-login. Đây là detection mechanism cho token theft.
<br/><br/>
<strong>2) AuthenticationEntryPoint vs AccessDeniedHandler</strong>
<ul>
<li><strong>EntryPoint</strong>: chạy khi request CHƯA auth (chưa có SecurityContext). Trả <strong>401</strong>.</li>
<li><strong>AccessDeniedHandler</strong>: chạy khi ĐÃ auth nhưng KHÔNG có quyền (vd USER gọi endpoint ADMIN). Trả <strong>403</strong>.</li>
</ul>
Default Spring trả HTML trắng. Override để trả ProblemDetail (RFC 7807) JSON.
<br/><br/>
<strong>3) Rate limit — Bucket4j</strong>
Algorithm <em>Token Bucket</em>: bucket có capacity N tokens, refill rate R/giây. Mỗi request tiêu 1 token. Hết → 429 Too Many Requests. Per-IP filter trước SecurityFilterChain.
<br/><br/>
<strong>4) Account lockout</strong>
Trường <code>failedLoginCount</code>, <code>lockedUntil</code> trên user. Login fail → increment. Đạt 5 → set lockedUntil = now() + 15 phút. Login success → reset count. Lockout per-user khác rate-limit per-IP — kết hợp cả hai.
<br/><br/>
<strong>5) Swagger bearer auth</strong>
springdoc-openapi tự generate OpenAPI 3.1 spec. Annotation <code>@SecurityScheme</code> ở app class + <code>@SecurityRequirement</code> ở method để UI Swagger có nút "Authorize" → paste token → test endpoint protected.
<br/><br/>
<strong>6) CORS cho SPA</strong>
Browser block cross-origin request mặc định. SPA <code>http://localhost:5173</code> gọi API <code>http://localhost:8080</code> → preflight OPTIONS. Spring Security xử lý qua <code>CorsConfigurationSource</code> bean — KHÔNG dùng <code>@CrossOrigin</code> annotation (chỉ work ở controller, bị filter chain block trước).`
      },
      theory: {
        vi: `<h3>The "Why" — Vì sao 4 thứ này KHÔNG optional?</h3>
<ul>
  <li><strong>Refresh token</strong>: bài interview backend hỏi PHỔ BIẾN. Không có = "junior chỉ đọc tutorial".</li>
  <li><strong>ProblemDetail 401/403 JSON</strong>: SPA/mobile parse response thì cần JSON. HTML trắng = UX vỡ, error generic.</li>
  <li><strong>Rate limit</strong>: bot scan endpoint <code>/login</code> 10k req/giây. Không có = service down hoặc account bị brute-force.</li>
  <li><strong>Swagger + CORS</strong>: dev team frontend dùng Swagger để discover API. Không có CORS = SPA dev call fail với CORS error, dev phải config proxy thủ công.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Refresh token = JWT</strong> — refresh phải opaque + hashed trong DB để revoke được. JWT stateless KHÔNG revoke được.</li>
  <li><strong>Refresh không rotate</strong> — cấp 1 refresh dùng nhiều lần. Leak = compromise persistent. Mỗi lần refresh CẤP MỚI + REVOKE CŨ.</li>
  <li><strong>Cùng endpoint /refresh nhận cả access + refresh</strong> — client gửi nhầm access vào /refresh → leak access trong request body. Tách biệt: refresh chỉ qua endpoint /auth/refresh với refresh token only.</li>
  <li><strong>Rate-limit chỉ per-IP</strong> — attacker xài 1000 IP (botnet). Kết hợp per-IP + per-username lockout.</li>
  <li><strong>AccessDeniedHandler không set Content-Type: application/problem+json</strong> — client không nhận biết là RFC 7807 ProblemDetail.</li>
  <li><strong>CORS allow * với credentials</strong> — browser reject. Phải liệt kê origin cụ thể nếu cho credentials.</li>
  <li><strong>@CrossOrigin trên controller cho Spring Security app</strong> — không work, filter chain block trước. Phải dùng CorsConfigurationSource bean.</li>
</ul>`
      },
      codeExamples: [
        {
          title: 'Refresh token entity + rotation flow',
          code: `@Entity @Table(name = "refresh_tokens")
public class RefreshToken {
    @Id @GeneratedValue private Long id;
    @Column(nullable = false, unique = true) private String tokenHash;  // SHA-256 hash, KHÔNG plaintext
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(nullable = false) private User user;
    @Column(nullable = false) private Instant expiresAt;
    @Column(nullable = false) private boolean revoked;
    @Column private Long replacedBy;  // ID của refresh mới (để detect reuse)
    // getters/setters/constructors omitted
}

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository repo;
    private static final SecureRandom RNG = new SecureRandom();

    public TokenPair issuePair(User user, JwtService jwt) {
        String accessToken = jwt.issue(toUserDetails(user));
        String refreshPlain = generateOpaqueToken();
        RefreshToken rt = new RefreshToken();
        rt.setTokenHash(sha256(refreshPlain));
        rt.setUser(user);
        rt.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        repo.save(rt);
        return new TokenPair(accessToken, refreshPlain);
    }

    @Transactional
    public TokenPair rotate(String refreshPlain, JwtService jwt) {
        RefreshToken old = repo.findByTokenHash(sha256(refreshPlain))
            .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        if (old.isRevoked()) {
            // REUSE detected — invalidate cả family (mọi token của user này)
            repo.revokeAllForUser(old.getUser().getId());
            throw new BadCredentialsException("Refresh token reuse detected — re-login required");
        }
        if (old.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh token expired");
        }

        TokenPair pair = issuePair(old.getUser(), jwt);
        old.setRevoked(true);
        old.setReplacedBy(repo.findByTokenHash(sha256(pair.refresh())).get().getId());
        return pair;
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[32];
        RNG.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    private String sha256(String s) {
        try {
            byte[] h = MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(h);
        } catch (NoSuchAlgorithmException e) { throw new IllegalStateException(e); }
    }
}

public record TokenPair(String access, String refresh) {}`
        },
        {
          title: 'AuthenticationEntryPoint + AccessDeniedHandler (ProblemDetail JSON)',
          code: `@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper om;
    public JwtAuthEntryPoint(ObjectMapper om) { this.om = om; }

    @Override
    public void commence(HttpServletRequest req, HttpServletResponse resp,
                         AuthenticationException ex) throws IOException {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        pd.setTitle("Unauthorized");
        pd.setDetail(ex.getMessage());
        pd.setInstance(URI.create(req.getRequestURI()));

        resp.setStatus(401);
        resp.setContentType("application/problem+json");
        om.writeValue(resp.getWriter(), pd);
    }
}

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper om;
    public JwtAccessDeniedHandler(ObjectMapper om) { this.om = om; }

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse resp,
                       AccessDeniedException ex) throws IOException {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        pd.setTitle("Forbidden");
        pd.setDetail("You don't have permission to access this resource");
        pd.setInstance(URI.create(req.getRequestURI()));

        resp.setStatus(403);
        resp.setContentType("application/problem+json");
        om.writeValue(resp.getWriter(), pd);
    }
}

// Trong SecurityConfig:
.exceptionHandling(eh -> eh
    .authenticationEntryPoint(jwtAuthEntryPoint)
    .accessDeniedHandler(jwtAccessDeniedHandler))`
        },
        {
          title: 'Rate limit (Bucket4j) + Swagger bearer + CORS',
          code: `// pom.xml dependency: com.bucket4j:bucket4j-core:8.10.1 (groupId:artifactId:version)

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String ip) {
        return buckets.computeIfAbsent(ip, k -> Bucket.builder()
            .addLimit(Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1))))
            .build());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse resp,
                                    FilterChain chain) throws ServletException, IOException {
        if (!req.getRequestURI().endsWith("/auth/login")) {
            chain.doFilter(req, resp); return;
        }
        String ip = req.getRemoteAddr();
        if (resolveBucket(ip).tryConsume(1)) {
            chain.doFilter(req, resp);
        } else {
            resp.setStatus(429);
            resp.setContentType("application/problem+json");
            resp.getWriter().write("""
                {"status":429,"title":"Too Many Requests","detail":"Login rate limit exceeded (10/min)"}""");
        }
    }
}

// CORS — KHÔNG dùng @CrossOrigin, dùng CorsConfigurationSource bean:
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("http://localhost:5173", "https://app.example.com"));
    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    cfg.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    cfg.setAllowCredentials(true);
    cfg.setMaxAge(3600L);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", cfg);
    return source;
}

// Swagger bearer auth — main app class:
@OpenAPIDefinition(
    info = @Info(title = "Devlog API", version = "v1"),
    security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(
    name = "bearerAuth", type = SecuritySchemeType.HTTP,
    scheme = "bearer", bearerFormat = "JWT")
@SpringBootApplication
public class DevlogApplication { ... }
// pom.xml dependency: org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0
// Truy cập: http://localhost:8080/swagger-ui/index.html`
        }
      ],
      exercises: [
        {
          title: 'POST /auth/refresh — token rotation endpoint',
          prompt: 'Build endpoint <code>POST /api/v1/auth/refresh</code> nhận <code>{refreshToken: "..."}</code>, validate qua RefreshTokenService.rotate(), trả về <code>TokenPair</code> mới. Handle 401 nếu invalid/expired/reused.',
          hints: [
            'Câu 1: Endpoint /refresh có cần JWT trong Authorization header không? Vì sao có / vì sao không?',
            'Câu 2: Reuse detection logic ở đâu — controller, service, hay repository? Vì sao tách như thế?',
            'Câu 3: Response shape giống /login (access + refresh + expiresIn) hay khác?'
          ],
          solution: {
            code: `public record RefreshRequest(@NotBlank String refreshToken) {}

@PostMapping("/refresh")
public AuthResponse refresh(@Valid @RequestBody RefreshRequest req) {
    TokenPair pair = refreshTokenService.rotate(req.refreshToken(), jwtService);
    return new AuthResponse(pair.access(), pair.refresh(), "Bearer", 15 * 60);
}

// Bổ sung shape AuthResponse:
public record AuthResponse(String accessToken, String refreshToken,
                           String tokenType, long expiresIn) {}

// SecurityConfig: /refresh phải permitAll() vì chưa có access token hợp lệ:
.requestMatchers("/api/v1/auth/login", "/api/v1/auth/refresh").permitAll()`,
            lang: 'java',
            complexityVi: 'Time: 1 query DB (find refresh by hash) + 1 insert (cấp mới) + 1 update (revoke cũ). ~10ms total. Space O(1).',
            explanationVi: '/refresh KHÔNG cần Authorization header — client chưa có access hợp lệ, đó là lý do gọi refresh. Reuse detection nằm trong RefreshTokenService.rotate() (line 33 code example trên) — khi gặp refresh đã revoked = attacker dùng lại token đã rotate → invalidate cả family. Response shape khác /login: phải có CẢ access và refresh mới.'
          }
        }
      ],
      socraticPrompts: [
        {
          title: 'Refresh token theft scenario',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Attacker steal được 1 refresh token. Họ dùng /refresh → server cấp pair mới cho attacker. Nạn nhân vẫn dùng refresh cũ. Chuyện gì xảy ra?
2. "Family invalidation" sau khi detect reuse — implement ra sao trong DB? Câu SQL nào revoke hết refresh của user?
3. Nạn nhân bị force re-login. Họ có biết tài khoản từng bị xâm phạm không? Notification ra sao?
4. Trade-off: rotation strict (mỗi /refresh cấp mới) vs sliding (extend cùng refresh) — production nên chọn cái nào?`
        },
        {
          title: 'Rate limit design',
          prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Rate-limit per-IP — attacker dùng 1000 IP. Làm sao chặn?
2. Rate-limit per-username — attacker biết tên user, lock user vô tội bằng login fail 5 lần. Đây gọi là attack gì?
3. CAPTCHA sau N lần fail vs lockout 15 phút — chọn cái nào, lúc nào?
4. Distributed system 10 instance app — Bucket4j in-memory không share state. Dùng gì để share rate limit cross-instance?`
        }
      ],
      keyTakeaways: {
        vi: [
          'Access token (JWT, 15-30p) + refresh token (opaque, 7d hashed DB). Rotation: mỗi /refresh cấp mới + revoke cũ. Detect reuse → invalidate cả family.',
          'AuthenticationEntryPoint cho 401, AccessDeniedHandler cho 403. Trả <code>application/problem+json</code> (RFC 7807) để SPA/mobile parse được.',
          'Rate limit /login: Bucket4j per-IP (10 req/phút) + account lockout per-username (5 fail → khóa 15p). Combo hai layer chặn cả botnet và targeted brute-force.',
          'CORS cho SPA: <code>CorsConfigurationSource</code> bean, KHÔNG <code>@CrossOrigin</code>. Liệt kê origin cụ thể, KHÔNG <code>*</code> khi <code>allowCredentials=true</code>.',
          'Swagger bearer: <code>@SecurityScheme(scheme="bearer", bearerFormat="JWT")</code> ở app class → Swagger UI có nút Authorize để test endpoint protected.',
          'Distributed rate-limit: Bucket4j in-memory KHÔNG share cross-instance. Production dùng Redis backend (<code>bucket4j-redis</code>) hoặc API gateway (Spring Cloud Gateway).'
        ]
      }
    }
  ],
  references: [
    { title: 'Spring Security 6.3 Reference', url: 'https://docs.spring.io/spring-security/reference/6.3/' },
    { title: 'jjwt 0.12 GitHub', url: 'https://github.com/jwtk/jjwt' },
    { title: 'RFC 7519 -JSON Web Token', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
    { title: 'RFC 7807 -Problem Details for HTTP APIs', url: 'https://datatracker.ietf.org/doc/html/rfc7807' },
    { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' }
  ]

}
