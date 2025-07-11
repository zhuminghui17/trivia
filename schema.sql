-- Users (handled by Clerk Auth)
create table public.profiles (
  id text primary key default auth.jwt()->>'sub',
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table "profiles" enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile"
on "public"."profiles"
for select
to authenticated
using (
  ((select auth.jwt()->>'sub') = id)
);

create policy "Users can update their own profile"
on "public"."profiles"
for update
to authenticated
using (
  ((select auth.jwt()->>'sub') = id)
);

create policy "Users can insert their own profile"
on "public"."profiles"
for insert
to authenticated
with check (
  ((select auth.jwt()->>'sub') = id)
);

-- Questions
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  date date NOT NULL
);

-- User Answers/Attempts
create table public.attempts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text not null default auth.jwt()->>'sub',
  question_id uuid references public.questions(id) not null,
  user_answer text not null,
  is_correct boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on attempts
alter table "attempts" enable row level security;

-- Create policies for attempts
create policy "Users can view their own attempts"
on "public"."attempts"
for select
to authenticated
using (
  ((select auth.jwt()->>'sub') = user_id)
);

create policy "Users can insert their own attempts"
on "public"."attempts"
for insert
to authenticated
with check (
  ((select auth.jwt()->>'sub') = user_id)
);

-- Categories (for better organization)
create table public.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text unique not null,
  description text
);