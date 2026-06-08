# CLAUDE.md — Project Context for AI Assistant

> **Read this FIRST every new conversation.** Save us both 10 minutes.

## What this project is

**Java + DSA Bootcamp** — bilingual (English / Tiếng Việt) anti-copy-paste curriculum website. React SPA hosted on GitHub Pages, Supabase for persistence.

- **Repo**: https://github.com/giabaocode/BE_JAVA_COURSE
- **Live site**: https://giabaocode.github.io/BE_JAVA_COURSE/
- **Local path**: `c:\Course Java`
- **Tech**: React 18 + Vite + Tailwind + lucide-react + Supabase (anon key)
- **Deploy**: GitHub Actions auto-deploy on push to `main` → ~2-3 min

## User profile (CRITICAL — đọc kỹ)

- **Name**: Gia Bảo (GitHub: giabaocode, email: pn.giabao9705@gmail.com)
- **Level**: BEGINNER backend developer
- **Pain points**: ít luyện LeetCode → tư duy lập trình kém; ít code → quên syntax; **đồ án toàn copy-paste AI không đọc**
- **Goal**: build muscle memory + bỏ thói paste AI + có portfolio backend Java
- **Approach matched to user**: Phase 0 warm-up bắt buộc trước Phase 1
- **Tone**: trả lời tiếng Việt, technical accuracy + thẳng thắn về limitations

## Curriculum structure (6 phases, 101 lessons)

```
Phase 0 — Java Warm-up (NEW — beginner-critical)
├── M0.1 Syntax Essentials (5 lessons: types, conditionals, loops, methods, strings)
├── M0.2 Built-in Collections (5 lessons: arrays, ArrayList, HashMap, HashSet, conversions)
└── M0.3 25 LeetCode Easy (5 groups: array, string, math, LL+tree, stack+misc)

Phase 1 — Java OOP & Data Structures (7 modules, 17 lessons, 36 exercises)
├── M1.1 OOP Pillars
├── M1.2 Arrays & Dynamic Array
├── M1.3 Linked Lists
├── M1.4 Stack & Queue
├── M1.5 HashMap & HashSet (from scratch)
├── M1.6 Trees, BST, PriorityQueue
└── M1.7 Merge Sort + Quick Sort + Divide & Conquer

Phase 2 — 17 LeetCode Patterns (17 modules, 34 lessons, 186 problems)
Sliding Window · Two Pointers · Fast/Slow · Merge Intervals · Cyclic Sort ·
Reversal LL · Tree BFS · Tree DFS · Two Heaps · Backtracking · Modified BS ·
Top K · Graph BFS/DFS · Dijkstra/MST · Trie · DP 1D · DP 2D

Phase 3 — Spring Boot + PostgreSQL + Docker (6 modules, 17 lessons)
├── M3.1 Docker & PostgreSQL
├── M3.2 Spring Foundations (IoC, REST, Exception)
├── M3.3 Spring Data JPA & Hibernate
├── M3.4 Spring Security + JWT
├── M3.5 Email Notification (Spring Mail + @Scheduled cron)
└── M3.6 Testing & Production Hygiene

Phase 4 — 3 Capstone Projects (3 modules, 6 lessons, 36 steps)
├── Devlog (blog API)
├── ShopCore (e-commerce with money/locking/state-machine + email on SHIPPED)
└── TaskFlow (multi-tenant project manager)

Phase 5 — AI Mentor & Interview Prep (3 modules, 10 lessons)
├── M5.1 Socratic AI workflows (anti-copy-paste prompts)
├── M5.2 Architecture & Code Review with AI
└── M5.3 Mock Interview + 20-week beginner-friendly job search plan
```

**Totals**: 6 phases · 39 modules · 101 lessons · 211 LeetCode problems · 91 exercises · 36 project steps · 120+ Socratic prompts.

## Pedagogical philosophy (DO NOT compromise on this)

Every lesson follows this template:
1. **Mental Model** (Vietnamese, with HTML formatting) — tư duy + diagram trước khi code
2. **Under the Hood / First Principles** — cơ chế ngầm (memory, CPU, JVM, framework internals)
3. **The "Why"** — vs alternatives, decision rationale
4. **Junior Pitfalls** — 5-7 lỗi điển hình, cách tránh
5. **Socratic Prompts** — copy-paste vào AI để AI hỏi ngược (NEVER cho đáp án)
6. **Exercises / Problems** with `hints` (1-2 Socratic Vietnamese questions) + `solution` (Java optimal + complexityVi + explanationVi)

Anti-copy-paste enforcement:
- Phase 0 lessons have sticky red banner with 5 rules
- Solution accordion locks when Mock Mode timer running
- Feynman Modal forces 80+ char explanation before mark complete
- Every prompt template starts with "TUYỆT ĐỐI KHÔNG viết code/đáp án"

## File organization

```
src/
├── App.jsx                          # State + localStorage progress tracking
├── main.jsx, index.css              # Entry + Tailwind
├── lib/supabase.js                  # Client + helper functions (fetchActivity,
│                                    # saveFeynmanNote, listVaultSnippets, etc.)
├── components/
│   ├── Sidebar.jsx                  # Collapsible nav + search + per-section progress
│   ├── MainContent.jsx              # Main lesson rendering + Mock Mode + Settings
│   ├── ProgressBar.jsx
│   ├── FeynmanModal.jsx             # Forced explanation modal
│   ├── SyntaxVaultDrawer.jsx        # Typing practice with WPM/accuracy
│   ├── ConsistencyHeatmap.jsx       # 365-day activity grid
│   └── BugJournal.jsx               # Personal StackOverflow
└── data/
    ├── curriculum.js                # Barrel imports phase0..phase5
    └── phases/
        ├── phase0.js + phase0/      # 3 module files
        ├── phase1.js (single file)
        ├── phase2.js + phase2/      # 17 pattern files
        ├── phase3.js + phase3/      # 6 module files
        ├── phase4.js + phase4/      # 3 capstone files
        └── phase5.js + phase5/      # 3 module files

db/supabase_init.sql                 # 6 tables: user_progress, feynman_notes,
                                     # syntax_vault, activity_logs, bug_journal,
                                     # user_settings (RLS off, single-user)

.github/workflows/deploy.yml         # Auto-deploy to GH Pages
public/.nojekyll                     # Tell GH Pages to skip Jekyll
.env.example                         # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
```

## Data schema per lesson

```js
{
  id: 'l-X-Y-Z',                    // unique
  type: 'theory'|'practice'|'problems'|'project'|'ai',
  title: 'English title',
  subtitle: { en, vi } | string,    // both can contain HTML
  mentalModel: { vi },              // HTML
  underTheHood: { vi },             // HTML
  theory: { vi, en? },              // HTML
  codeExamples: [{ title?, code, lang, description? }],
  socraticPrompts: [{ title, prompt }],
  keyTakeaways: { vi: [...] },
  // For problems lessons:
  problems: [{ id, title, difficulty, url, hint?, hints?, solution }],
  // For practice lessons:
  exercises: [{ title, prompt, hint? | hints, solution }],
  // For project lessons:
  steps: [{ id, title, description, mentalModel, socraticPrompts, hints, deliverable }],
  stretchGoals: [...]
}

// solution shape:
{
  code: 'Java code',
  lang: 'java',
  complexityVi: 'Time O(n) · Space O(1).',
  explanationVi: 'HTML explanation in Vietnamese'
}
```

## Workflow

```powershell
# Local dev (HMR)
cd "c:\Course Java"
npm run dev    # http://localhost:5173

# Production build (verify before push)
npx vite build

# Deploy = push to main
git add .
git commit -m "describe change"
git push       # auto-triggers GH Actions deploy
```

## Recent decisions / current state (LAST UPDATED 2026-06-08)

**Status**: Rubric-driven QA pass complete (2026-06-08). Build passes. See "QA pass" entry below.

### QA pass theo RUBRIC_DANH_GIA_NOI_DUNG.md (2026-06-08)
Đánh giá toàn bộ 50 file/125 bài theo rubric 5 nhóm (A-E). Đã sửa:
- **Lỗi chặn (A2)**: `phase0/02` bài "đếm order premium" — `main()` gọi `countEven` không tồn tại + explanation lạc đề → fixed.
- **Lỗi nhỏ**: thêm getter `size()` (`phase1/05`); sửa link Joel→Google Eng Practices (`phase5/02`); disclaimer `double` lương demo (`phase1/08`); thêm `deliverable` cho cả 12 step TaskFlow (`phase4/03`).
- **Lấp khoảng trống nội dung (B6/B7)**: NEW module `phase1/09-java-essentials.js` (Module "Java Core Essentials" — 4 lesson: Exception, Lambda, Stream, Concurrency cơ bản — đặt TRƯỚC oop-mini-projects trong aggregator); NEW lesson `@Transactional` (`phase3/03`, l-3-3-4: propagation/isolation/rollback/self-invocation); NEW lesson mock Fresher (`phase5/03`, l-5-3-fresher: Q&A Java/Spring/SQL, đặt đầu module).
- **C12/C13**: thêm gloss đời thường cho thuật ngữ nặng ở capstone (Conway's Law, bounded context, aggregate root, cursor pagination, ChannelInterceptor ở TaskFlow; optimistic/pessimistic lock ở ShopCore).
- **Khác**: thống nhất build tool Maven (đổi 2 comment `build.gradle`→`pom.xml` ở `phase3/04`); Easy mồi LC703 cho Top-K (`phase2/12`) + chỉ dẫn "điểm vào dễ nhất" cho shortest-path/dp-2d.
- **Re-sequence (DONE 2026-06-08)**: moved `javaEssentials` to position 2 in `phase1.js` (ngay sau oopPillars, trước mọi module data-structure dùng stream). Note: phase1 module titles dùng tên mô tả KHÔNG có số "Module 1.X" → reorder không gây xung đột đánh số hiển thị. Verified trực quan qua preview (sidebar đúng thứ tự, 4 lesson mới render OK).
- **Preview verified (DONE 2026-06-08)**: dev server qua `.claude/launch.json` (Claude Preview MCP). Đã screenshot Exception/@Transactional/Stream/Fresher-mock — render đúng (breadcrumb, code highlight, cross-link, prompts). Navigate nhanh bằng cách set localStorage `java-bootcamp-active-lesson-v1` = lesson id rồi reload.
- **Còn TODO (ưu tiên thấp)**: thêm Easy mồi thật cho các pattern Medium-heavy khác nếu muốn; C12/C13 sâu hơn ở các bước capstone còn lại.

### Pre-QA status
**Status (cũ)**: Pending commit — Phase 1 refactor complete, build passes, awaiting user commit.

### Recent commits (newest first)
1. `ecc5169` **UI polish** — light/dark toggle, particles, XP bar, streak, confetti. Touched the user-customized UI files (App.jsx, Sidebar.jsx, MainContent.jsx, ProgressBar.jsx, index.css, tailwind.config.js etc.) — these are part of the intentional theme work, don't revert.
2. `d1a28a4` **Option B** — 7 Cybersoft gap-filler modules (SQL/Redis/UML/Git etc.) — see breakdown below.
3. `ed43608` docs: add CLAUDE.md for AI assistant context handoff
4. `fe1c0b0` feat: Phase 0 warm-up + 20-week beginner pacing + anti-copy-paste UI

### Pending: Phase 1 refactor (2026-06-02)
Split `phase1.js` (3313 lines, single-file outlier) → aggregator + 8 module files under `phase1/`. Same multi-file pattern as phase0/3/4/5. Zero runtime change; build verified, lesson count parity confirmed (8 modules, 20 lessons, 11 project steps).

```
phase1.js                       (35 lines — aggregator, imports + modules array)
phase1/
├── 01-oop-pillars.js           (713 lines, 4 lessons)
├── 02-arrays-dynamic.js        (285 lines, 2 lessons)
├── 03-linked-lists.js          (378 lines, 2 lessons)
├── 04-stack-queue.js           (344 lines, 2 lessons)
├── 05-hashmap-hashset.js       (196 lines, 1 lesson)
├── 06-trees-bst-heap.js        (319 lines, 2 lessons)
├── 07-sorting.js               (712 lines, 4 lessons)
└── 08-oop-mini-projects.js     (353 lines, 3 lessons + 11 project steps)
```

**Gotcha during refactor**: inter-module gap is normally 5 lines (blank + 3 comment + open `{`), but between modules 1.6→1.7 and 1.7→1.8 there were 7 lines (extra blank lines in the original). Initial slice over-extracted by 2 lines into modules 6 and 7; vite build caught it as `Expected ';', got ','`. Fix: trim last 2 lines + re-strip trailing comma. If future refactors slice by line range, scan the actual close `},` rather than computing from next-module-open.

### What was added (Option B — all 7 items, commit d1a28a4)
1. ✅ **Phase 0 Module 0.4** — Console Mini-Apps (Number Guessing + Mini Bank + Retrospective) — `phase0/04-console-miniapps.js`
2. ✅ **Phase 1 Module 1.8** — OOP Mini Projects (Student/HR/Library Management — Vietnamese CRUD) — appended to `phase1.js`
3. ✅ **Phase 3 Module 3.0** — SQL Foundation Deep Dive (mental model, JOIN, subquery+CTE, GROUP BY, window functions) — `phase3/00-sql-foundation.js`
4. ✅ **Phase 3.1 lesson l-3-1-4** — Database Optimization (EXPLAIN ANALYZE, composite index, batch INSERT, stored procedure) — appended to `phase3/01-docker-postgres.js`
5. ✅ **Phase 3 Module 3.6** — Redis + RabbitMQ (mental model, Spring Data Redis, distributed lock, Spring AMQP + DLQ) — `phase3/06-redis-rabbitmq.js`. Renamed existing `06-testing-deployment.js` → `07-testing-deployment.js`
6. ✅ **Phase 3 Module 3.8** — UML & Project Analysis (requirement analysis, use case diagram, class + sequence diagram, PlantUML) — `phase3/08-uml-analysis.js`
7. ✅ **Phase 5 Module 5.0** — Team Skills (Git Flow + Conventional Commits, Scrum/Jira/Agile vocab, Code Review Etiquette) — `phase5/00-team-skills.js`

### Aggregators updated for Option B
- `phase0.js` — added consoleMiniApps to modules
- `phase3.js` — added sqlFoundation, redisRabbitMQ, umlAnalysis; renumbered modules (now 9 modules)
- `phase5.js` — added teamSkills as first module; updated intro

### Curriculum stats (current)
- **Phases**: 6
- **Modules**: ~**48**
- **Lessons**: ~**131**

### Gotchas to remember
- **JS single-quote escape**: `\\'` doesn't escape an apostrophe inside a `'…'` string — it produces `\` then closes the string. Use double quotes around the JS string when the content contains SQL literal quotes (e.g., `"DATE_TRUNC('month', x)"`). Hit this 5× in SQL lessons.
- **UI file ownership**: Light/dark toggle + particles + XP + streak + confetti now live in the existing UI files (not separate components). When adding non-cosmetic features, still prefer NEW components, but cosmetic tweaks to existing UI files are fair game now.

## Modifications by user/linter to UI files (DO NOT revert)

User did a dark theme overhaul. Files modified:
- `src/App.jsx`, `src/components/Sidebar.jsx`, `src/components/MainContent.jsx`,
- `src/components/FeynmanModal.jsx`, `src/components/SyntaxVaultDrawer.jsx`, `src/components/ProgressBar.jsx`,
- `src/index.css`, `index.html`, `tailwind.config.js`

These changes are intentional. Don't revert.

## Conventions / preferences I learned

1. **Bilingual content always**: technical terms English, explanations Vietnamese. Use `{ vi: '...' }` shape.
2. **HTML allowed in strings**: use `dangerouslySetInnerHTML` when rendering. `<code>`, `<strong>`, `<ul><li>`, `<pre>` are common.
3. **Multi-file split per phase**: 1 aggregator file (`phase2.js`) + module files in subfolder (`phase2/01-sliding-window.js`). Use this pattern for all new phases.
4. **Solution format**: always `{ code, lang, complexityVi, explanationVi }`. Code Java production-ready.
5. **Feynman + Socratic everywhere**: anti-copy-paste is THE differentiator from generic bootcamp.
6. **Vietnamese tone**: thẳng thắn (straightforward), no fluff, technical-rigorous but accessible.
7. **Build before push**: always `npx vite build` to verify before commit.
8. **Don't touch UI files**: user has customized theme. Add features in NEW components if needed.

## What to do in a new session

If user says "continue":
1. Run `git log --oneline -10` to see recent commits.
2. Read this CLAUDE.md.
3. Check pending decision (if any) above.
4. Ask user what to work on next, but show options based on pending state.

If user reports a bug:
1. Reproduce by reading the relevant file.
2. Verify with `npx vite build`.
3. Fix → build → commit → push.

If user requests new content:
1. Use existing file structure pattern (multi-file split for phases).
2. Follow the pedagogical template (Mental Model + Under the Hood + Why + Pitfalls + Socratic + Exercises with hints+solution).
3. Update `curriculum.js` aggregator if adding new phase.
4. Build → push.
