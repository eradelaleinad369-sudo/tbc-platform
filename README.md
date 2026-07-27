# The Builders Circle — Platform

Full member platform: public roles/projects showcase, application form, and a
members-only dashboard (meetings + resources) gated by Supabase Auth + RLS.

## Stack
- React + Tailwind (Vite)
- Supabase (Postgres, Auth, RLS)
- n8n for automations (not scaffolded yet — see "Next steps")
- Deploy target: Vercel

## 1. Set up Supabase
1. Create a project at https://supabase.com.
2. In the SQL Editor, run the two migration files **in order**:
   - `supabase/migrations/0001_init.sql` (schema, RLS policies)
   - `supabase/migrations/0002_seed_roles.sql` (the 10 leadership roles)
3. Grab your Project URL and anon public key from Project Settings → API.

## 2. Make yourself the founder/admin
Auth users are created automatically the first time someone logs in via the
magic-link form. To bootstrap the founder account:
1. Log in once through the site (`/login`) with the founder's email — this
   creates a row in `auth.users`.
2. In the SQL Editor, insert the matching `members` row and flag it admin:
   ```sql
   insert into members (auth_user_id, member_id, full_name, status, is_admin)
   values (
     (select id from auth.users where email = 'founder@example.com'),
     'TBC-2026-0001',
     'Sossa',
     'active',
     true
   );
   ```
3. Every other member gets a row the same way (without `is_admin`), or you
   can build an admin-only "approve application → create member" flow later.

## 3. Run locally
```bash
cp .env.example .env       # fill in your Supabase URL + anon key
npm install
npm run dev
```

## 4. Deploy
Push to GitHub, then import the repo in Vercel. Add the two `VITE_SUPABASE_*`
env vars in Vercel's project settings. Every push to `main` redeploys.

## Project structure
```
src/
  pages/
    Roles.tsx       — public, reads `roles`
    Members.tsx      — public directory of active members
    Projects.tsx      — public project showcase
    Apply.tsx         — public application form → `applications`
    Login.tsx         — magic-link auth
    Dashboard.tsx      — members-only: meetings + resources
  lib/
    supabaseClient.ts
supabase/migrations/  — run these in your Supabase SQL editor
```

## Next steps
- [ ] Wire up n8n: new row in `applications` → notify Founder + Operations Lead
- [ ] Build an admin view (approve applications → auto-create `members` row)
- [ ] Add file upload for `resources` (type = 'file') via Supabase Storage
- [ ] Apply real visual design — this scaffold is functional, not styled;
      happy to do a proper design pass (palette/type/layout) once the data
      model is confirmed and you've seen it running
- [ ] Add `leads` visibility handling in the dashboard (currently only
      `members`/`admin` tiers are read — leads-only resources need a check
      against the member's `role_id`)
