-- The Builders Circle Platform — Initial Schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)

-- ========== ROLES ==========
create table roles (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- e.g. "Technology & Digital Systems Lead"
  slug text unique not null,         -- e.g. "tech-digital-systems"
  why_it_exists text,
  responsibilities text[],           -- array of bullet points
  sort_order int default 0
);

-- ========== MEMBERS ==========
-- One row per person. Links 1:1 to a Supabase Auth user.
create table members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  member_id text unique not null,     -- display/reference tag, e.g. 'TBC-2026-0042'
  full_name text not null,
  bio text,
  avatar_url text,
  role_id uuid references roles(id),
  status text not null default 'pending' check (status in ('pending','active','alumni')),
  is_admin boolean not null default false,   -- founder/admin override
  joined_date date default current_date
);

-- ========== MEETINGS ==========
create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  location text,                      -- physical location or a call link
  agenda text,
  notes text,                         -- filled in after the meeting
  created_by uuid references members(id)
);

-- ========== RESOURCES ==========
create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('doc','link','file')),
  url text,
  storage_path text,                  -- if type = 'file', path in Supabase Storage
  category text,
  visibility text not null default 'members' check (visibility in ('members','leads','admin')),
  created_by uuid references members(id),
  created_at timestamptz default now()
);

-- ========== PROJECTS ==========
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  link text,
  is_demo_day boolean default false,
  created_at timestamptz default now()
);

create table project_members (
  project_id uuid references projects(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  primary key (project_id, member_id)
);

-- ========== APPLICATIONS ==========
create table applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  role_applied_for uuid references roles(id),
  message text,
  status text not null default 'submitted' check (status in ('submitted','reviewing','accepted','rejected')),
  submitted_at timestamptz default now()
);

-- ========== HELPER: is current user an admin? ==========
create or replace function is_admin() returns boolean as $$
  select coalesce(
    (select is_admin from members where auth_user_id = auth.uid()),
    false
  );
$$ language sql stable security definer;

create or replace function current_member_id() returns uuid as $$
  select id from members where auth_user_id = auth.uid();
$$ language sql stable security definer;

-- ========== ROW LEVEL SECURITY ==========
alter table roles enable row level security;
alter table members enable row level security;
alter table meetings enable row level security;
alter table resources enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table applications enable row level security;

-- Roles: public read (used on the public roles page), admin write
create policy "roles are publicly readable" on roles for select using (true);
create policy "only admins manage roles" on roles for all using (is_admin()) with check (is_admin());

-- Members: a member sees their own row + all active members (directory); only admin writes
create policy "members can read active members and self" on members
  for select using (status = 'active' or auth_user_id = auth.uid());
create policy "members can update their own profile" on members
  for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy "only admins insert or delete members" on members
  for insert with check (is_admin());
create policy "only admins delete members" on members
  for delete using (is_admin());

-- Meetings: members-only read, admin write
create policy "active members read meetings" on meetings
  for select using (exists (select 1 from members where auth_user_id = auth.uid() and status = 'active'));
create policy "only admins manage meetings" on meetings
  for all using (is_admin()) with check (is_admin());

-- Resources: visibility-tiered read, admin write
create policy "tiered resource read" on resources
  for select using (
    visibility = 'members' and exists (select 1 from members where auth_user_id = auth.uid() and status = 'active')
    or is_admin()
  );
create policy "only admins manage resources" on resources
  for all using (is_admin()) with check (is_admin());

-- Projects: public read (showcase is public-facing), members write their own
create policy "projects are publicly readable" on projects for select using (true);
create policy "members create projects" on projects
  for insert with check (exists (select 1 from members where auth_user_id = auth.uid() and status = 'active'));
create policy "admins manage all projects" on projects
  for update using (is_admin()) with check (is_admin());

create policy "project_members public read" on project_members for select using (true);
create policy "members manage their own project links" on project_members
  for all using (member_id = current_member_id()) with check (member_id = current_member_id());

-- Applications: anyone can submit (public form), only admin can read/manage
create policy "anyone can submit an application" on applications
  for insert with check (true);
create policy "only admins read applications" on applications
  for select using (is_admin());
create policy "only admins update applications" on applications
  for update using (is_admin()) with check (is_admin());
