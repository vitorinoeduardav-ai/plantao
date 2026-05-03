-- Plantão da Engenharia - Supabase schema
-- Execute este arquivo no SQL Editor do Supabase antes de usar o app em produção.

create extension if not exists "pgcrypto";

-- Perfis públicos mínimos vinculados ao auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamp with time zone default now()
);

-- Pacientes representam temas de estudo e armazenam progresso por usuária.
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  subject text not null,
  description text,
  status text not null default 'not_triaged',
  cure_index integer default 0,
  hearts integer default 3,
  attempts integer default 0,
  consecutive_green integer default 0,
  next_review_at timestamp with time zone,
  last_review_at timestamp with time zone,
  tags text[],
  avatar_url text,
  avatar_alt text,
  avatar_style text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.patients add column if not exists avatar_url text;
alter table public.patients add column if not exists avatar_alt text;
alter table public.patients add column if not exists avatar_style text;

-- Questões objetivas. Imagens ficam no Storage; aqui ficam URLs/metadados.
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  topic text not null,
  difficulty text not null,
  statement text not null,
  alternatives jsonb not null,
  correct_answer text not null,
  explanation text not null,
  hint text,
  related_formula text,
  tags text[],
  image_url text,
  image_alt text,
  image_caption text,
  explanation_image_url text,
  explanation_image_alt text,
  explanation_image_caption text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Medicamentos são teorias resumidas e direcionadas por tema.
create table if not exists public.theory_medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  topic text not null,
  title text not null,
  summary text not null,
  formulas jsonb,
  when_to_use jsonb,
  common_mistakes jsonb,
  solved_example text,
  flashcards jsonb,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tentativas de triagem, com respostas e diagnóstico final.
create table if not exists public.patient_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  cure_index integer not null,
  previous_status text,
  new_status text,
  responses jsonb not null,
  notes text,
  created_at timestamp with time zone default now()
);

-- Configurações individuais da usuária.
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  student_name text,
  app_name text default 'Plantão da Engenharia',
  dark_mode boolean default false,
  exam_mode boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Provas futuras que funcionam como prazos clínicos do plantão.
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text not null,
  date date not null,
  description text,
  priority text default 'medium',
  topics jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Plano diário gerado a partir das provas, pacientes e histórico.
create table if not exists public.daily_study_plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id uuid references public.exams(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  date date not null,
  topic_name text not null,
  subject text not null,
  action_type text not null,
  reason text,
  priority_score numeric,
  completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.questions enable row level security;
alter table public.theory_medications enable row level security;
alter table public.patient_attempts enable row level security;
alter table public.app_settings enable row level security;
alter table public.exams enable row level security;
alter table public.daily_study_plan enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_delete_own" on public.profiles for delete using (id = auth.uid());

create policy "patients_select_own" on public.patients for select using (user_id = auth.uid());
create policy "patients_insert_own" on public.patients for insert with check (user_id = auth.uid());
create policy "patients_update_own" on public.patients for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "patients_delete_own" on public.patients for delete using (user_id = auth.uid());

create policy "questions_select_own" on public.questions for select using (user_id = auth.uid());
create policy "questions_insert_own" on public.questions for insert with check (user_id = auth.uid());
create policy "questions_update_own" on public.questions for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "questions_delete_own" on public.questions for delete using (user_id = auth.uid());

create policy "theory_select_own" on public.theory_medications for select using (user_id = auth.uid());
create policy "theory_insert_own" on public.theory_medications for insert with check (user_id = auth.uid());
create policy "theory_update_own" on public.theory_medications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "theory_delete_own" on public.theory_medications for delete using (user_id = auth.uid());

create policy "attempts_select_own" on public.patient_attempts for select using (user_id = auth.uid());
create policy "attempts_insert_own" on public.patient_attempts for insert with check (user_id = auth.uid());
create policy "attempts_update_own" on public.patient_attempts for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "attempts_delete_own" on public.patient_attempts for delete using (user_id = auth.uid());

create policy "settings_select_own" on public.app_settings for select using (user_id = auth.uid());
create policy "settings_insert_own" on public.app_settings for insert with check (user_id = auth.uid());
create policy "settings_update_own" on public.app_settings for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "settings_delete_own" on public.app_settings for delete using (user_id = auth.uid());

create policy "exams_select_own" on public.exams for select using (user_id = auth.uid());
create policy "exams_insert_own" on public.exams for insert with check (user_id = auth.uid());
create policy "exams_update_own" on public.exams for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "exams_delete_own" on public.exams for delete using (user_id = auth.uid());

create policy "daily_plan_select_own" on public.daily_study_plan for select using (user_id = auth.uid());
create policy "daily_plan_insert_own" on public.daily_study_plan for insert with check (user_id = auth.uid());
create policy "daily_plan_update_own" on public.daily_study_plan for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_plan_delete_own" on public.daily_study_plan for delete using (user_id = auth.uid());

-- Bucket privado para imagens. Cada usuária grava dentro da pasta auth.uid().
insert into storage.buckets (id, name, public)
values ('question-images', 'question-images', false)
on conflict (id) do nothing;

create policy "question_images_select_own"
on storage.objects for select
using (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "question_images_insert_own"
on storage.objects for insert
with check (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "question_images_update_own"
on storage.objects for update
using (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "question_images_delete_own"
on storage.objects for delete
using (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text);
