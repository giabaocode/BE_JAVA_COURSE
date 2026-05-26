# Java + DSA Bootcamp — Hiểu sâu, không copy-paste

Một website học bootcamp Java backend bilingual (English / Tiếng Việt) với triết lý chống copy-paste từ AI. Build bằng React + Vite + Tailwind, persistence qua Supabase.

## Numbers

- **5 phases** · **36 modules** · **84 lessons**
- **186 LeetCode problems** với hints Socratic + lời giải Java optimal
- **36 project blueprint steps** cho 3 capstones (Devlog, ShopCore, TaskFlow)
- **115 Socratic AI prompts** copy-paste vào AI mentor — bắt AI hỏi ngược thay vì cho đáp án
- **~500 Junior Pitfalls** rải khắp curriculum

## Curriculum coverage

| Phase | Nội dung | Stats |
|-------|----------|-------|
| **1** | Java OOP & Data Structures (Under the Hood) | 7 mod · 17 lessons · 36 exercises |
| **2** | 17 LeetCode Patterns (Mental Models) | 17 mod · 34 lessons · 186 problems |
| **3** | Spring Boot + PostgreSQL + Docker + Email | 6 mod · 17 lessons · 5 exercises |
| **4** | 3 Capstone Projects (Anti-Copy-Paste) | 3 mod · 6 lessons · 36 steps |
| **5** | AI as Mentor & Interview Prep | 3 mod · 10 lessons |

## Features

- **Bilingual rendering** — mỗi lesson có theory tiếng Anh và tiếng Việt song song.
- **Mental Model cards** — luồng tư duy + sequence diagram trước khi code.
- **Under the Hood cards** — First Principles: memory model, GC, vtable, MVCC, ...
- **Socratic AI Prompts** — copy-paste template để AI hỏi ngược bạn.
- **Mock Interview Mode** — sticky 25-min timer, ẩn theory, lock solution khi timer chạy.
- **Hints + Solution accordions** — toggle reveal mỗi problem.
- **Feynman Modal** — bắt buộc viết note giải thích (≥ 80 char) trước khi mark lesson complete.
- **Syntax Vault** — practice typing template Java với WPM/accuracy stats.
- **Consistency Heatmap** — GitHub-style 365-day grid.
- **Bug Journal** — personal StackOverflow (bug → root cause → fix → prevention).
- **Email reminder** — daily study reminder via Supabase preferences.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + lucide-react
- **Persistence**: Supabase (Postgres + Auth optional)
- **Deploy**: GitHub Pages via GitHub Actions

## Quick start

```powershell
# Install dependencies
npm install

# Dev server with HMR
npm run dev    # http://localhost:5173

# Production build
npm run build  # outputs to dist/

# Preview production build locally
npm run preview
```

## Supabase setup (optional)

The app works offline with localStorage. To enable Feynman notes, Syntax Vault stats, Heatmap, and Bug Journal:

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → paste `db/supabase_init.sql` → Run.
3. Settings → API → copy URL + anon key.
4. Create `.env.local` from `.env.example`:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
5. Restart dev server.

For deployment, set these as **GitHub repo secrets** (`Settings → Secrets and variables → Actions`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Project structure

```
src/
├── App.jsx                          # State management (lesson tracking, localStorage)
├── main.jsx                         # Entry
├── index.css                        # Tailwind + custom utilities
├── lib/
│   └── supabase.js                  # Supabase client + helper functions
├── components/
│   ├── Sidebar.jsx                  # Collapsible phase/module/lesson nav
│   ├── MainContent.jsx              # Lesson rendering + Mock Mode + Settings
│   ├── ProgressBar.jsx              # Reusable progress bar
│   ├── FeynmanModal.jsx             # Forced explanation before complete
│   ├── SyntaxVaultDrawer.jsx        # Code typing practice
│   ├── ConsistencyHeatmap.jsx       # 365-day activity grid
│   └── BugJournal.jsx               # Personal StackOverflow
└── data/
    ├── curriculum.js                # Barrel: imports all phases
    └── phases/
        ├── phase1.js                # Java OOP & DSA
        ├── phase2.js                # Aggregator for 17 patterns
        ├── phase2/                  # One file per pattern
        ├── phase3.js                # Aggregator for Spring/Postgres/Docker
        ├── phase3/                  # One file per module
        ├── phase4.js                # Aggregator for capstones
        ├── phase4/                  # One file per capstone
        ├── phase5.js                # Aggregator for AI mentor
        └── phase5/                  # One file per module

db/
└── supabase_init.sql                # 6 tables: user_progress, feynman_notes,
                                     # syntax_vault, activity_logs, bug_journal, user_settings

.github/
└── workflows/
    └── deploy.yml                   # Auto-deploy to GitHub Pages on push to main
```

## Philosophy — Anti-copy-paste

Mọi lesson follow công thức:

1. **Mental Model** — bí kíp tư duy + sequence diagram (Vietnamese).
2. **First Principles (Under the Hood)** — cơ chế bên dưới (memory, CPU, framework internals).
3. **The "Why"** — vs alternatives, decision rationale.
4. **Junior Pitfalls** — 5-7 lỗi điển hình mỗi lesson với cách phòng.
5. **Socratic Prompts** — copy vào AI để AI hỏi ngược bạn.
6. **Exercises** with hints (1-2 Socratic questions) + reference solution (Java optimal + complexity).

Tinh thần: AI là **gia sư khó tính, không phải thợ code**. Mọi prompt template có dòng "TUYỆT ĐỐI KHÔNG viết code".

## License

MIT — feel free to fork and adapt.
