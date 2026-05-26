// Module 3.4 — Spring Security 6 & JWT Authentication
export default {
  id: 'mod-3-4',
  title: 'Spring Security 6 & JWT Authentication',
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

// application.yml:
// app:
//   jwt:
//     secret: \${JWT_SECRET:Y291cnNlLWphdmEtZGV2LXNlY3JldC0yMDI0LXNvbWUtbG9uZy1iYXNlNjQ=}
//     ttlMinutes: 30`
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
    }
  ]
}
