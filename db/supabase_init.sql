-- ============================================================================
--  Java Bootcamp — Supabase Schema (Personal Use)
--  Run this once in: Supabase Dashboard → SQL Editor → New Query → Run
--  RLS is OFF (single-user). For multi-tenant prod, enable RLS + add policies.
-- ============================================================================

-- 1) user_progress — checklist state (lesson/problem/step completion)
create table if not exists user_progress (
  id          bigserial primary key,
  user_id     text not null,
  item_key    text not null,                  -- "lessonId::itemId" or "lessonId::__lesson__"
  completed_at timestamptz default now(),
  unique (user_id, item_key)
);
create index if not exists idx_user_progress_user on user_progress(user_id);

-- 2) feynman_notes — user must explain a concept in their own words to "pass"
create table if not exists feynman_notes (
  id           bigserial primary key,
  user_id      text not null,
  lesson_id    text not null,
  explanation  text not null,
  self_rating  int check (self_rating between 1 and 5),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (user_id, lesson_id)
);
create index if not exists idx_feynman_user on feynman_notes(user_id);

-- 3) syntax_vault — saved code templates, with typing-practice stats
create table if not exists syntax_vault (
  id             bigserial primary key,
  user_id        text not null,
  title          text not null,
  language       text default 'java',
  pattern_tag    text,
  code           text not null,
  notes          text,
  practice_count int  default 0,
  best_wpm       int  default 0,
  best_accuracy  int  default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index if not exists idx_vault_user on syntax_vault(user_id);

-- 4) activity_logs — feeds the GitHub-style consistency heatmap
create table if not exists activity_logs (
  id            bigserial primary key,
  user_id       text not null,
  activity_date date not null,
  activity_type text default 'general',       -- 'lesson_complete', 'problem_solve', 'feynman', 'typing', 'bug_log'
  created_at    timestamptz default now()
);
create index if not exists idx_activity_user_date on activity_logs(user_id, activity_date);

-- 5) bug_journal — personal StackOverflow (bug → root cause → fix → prevention)
create table if not exists bug_journal (
  id            bigserial primary key,
  user_id       text not null,
  title         text not null,
  error_message text,
  context       text,
  root_cause    text,
  solution      text,
  prevention    text,
  tags          text[],
  resolved      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists idx_bug_user           on bug_journal(user_id);
create index if not exists idx_bug_user_resolved  on bug_journal(user_id, resolved);

-- 6) user_settings — per-user preferences (email reminders, timezone, etc.)
create table if not exists user_settings (
  user_id          text primary key,
  email            text,
  reminder_enabled boolean default false,
  reminder_time    time    default '08:00',
  timezone         text    default 'Asia/Ho_Chi_Minh',
  updated_at       timestamptz default now()
);

-- ============================================================================
-- Optional: enable RLS later (multi-user mode). Personal use → leave OFF.
-- alter table user_progress enable row level security;
-- create policy own_rows on user_progress for all using (auth.uid()::text = user_id);
-- (repeat for each table)
-- ============================================================================
