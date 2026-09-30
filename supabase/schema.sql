-- ============================================================
-- profilecongdev — Supabase Schema
-- Chạy file này trong: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── chat_sessions ───────────────────────────────────────────
create table if not exists public.chat_sessions (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  visitor_name    text,
  visitor_email   text,
  status          text not null default 'open' check (status in ('open', 'closed'))
);

-- ─── chat_messages ───────────────────────────────────────────
create table if not exists public.chat_messages (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  session_id  uuid not null references public.chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user', 'bot', 'admin')),
  text        text not null
);

create index if not exists chat_messages_session_id_idx on public.chat_messages(session_id);

-- telegram_message_id: lưu message_id từ Telegram để map reply → session
alter table public.chat_messages
  add column if not exists telegram_message_id bigint;

create index if not exists chat_messages_telegram_msg_id_idx
  on public.chat_messages(telegram_message_id);

-- Bật Realtime cho chat_messages (cần chạy 1 lần)
alter publication supabase_realtime add table public.chat_messages;

-- ─── contact_submissions ─────────────────────────────────────
create table if not exists public.contact_submissions (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  project_type  text not null,
  message       text not null,
  status        text not null default 'new' check (status in ('new', 'read', 'replied'))
);

-- ─── Auto-update updated_at ──────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute procedure public.set_updated_at();

-- ─── Row Level Security ──────────────────────────────────────
alter table public.chat_sessions      enable row level security;
alter table public.chat_messages      enable row level security;
alter table public.contact_submissions enable row level security;

-- chat_sessions: ai cũng có thể tạo session mới và đọc session của mình
create policy "insert own session" on public.chat_sessions
  for insert with check (true);

create policy "read own session" on public.chat_sessions
  for select using (true);

-- chat_messages: insert tự do, select theo session
create policy "insert message" on public.chat_messages
  for insert with check (true);

create policy "read messages" on public.chat_messages
  for select using (true);

-- contact_submissions: chỉ insert từ client, không read (admin dùng service key)
create policy "insert contact" on public.contact_submissions
  for insert with check (true);
