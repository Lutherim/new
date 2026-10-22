# SkillFinder (Vite + React + Tailwind + Supabase)

The original design is unchanged. The fake localStorage backend and every demo login were replaced by Supabase Auth and a secured Postgres database.

## 1. Supabase (once)
1. Create a **fresh** project. SQL Editor > New query > paste `supabase/schema.sql` > Run.
2. Authentication > Sign In / Providers > Email: set minimum password length to 8 or more. Keep **Confirm email ON** for production (set up custom SMTP first; the built-in sender only reaches your own team).
3. Project Settings > API Keys: copy the Project URL and the **publishable** key. NEVER put the secret / service_role key in this project or in Vercel variables.

## 2. Run locally
```
copy .env.example .env.local     (paste your URL and publishable key)
npm install
npm run build                    (must pass before deploying)
npm run dev                      (http://localhost:3000)
```

## 3. Deploy on Vercel
1. Push to GitHub (`.env.local` is git-ignored). Import the repo in Vercel (framework: Vite, auto-detected).
2. Environment Variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Deploy.
3. Supabase > Authentication > URL Configuration: Site URL = your Vercel address.

## 4. Test
1. Register as an artisan and as a customer (the account type is locked for good).
2. Customer: request a quote. Artisan: accept it. Customer: now leave a review (only possible after acceptance).
3. Check in Table Editor that rows appear, and that a second customer cannot see the first one's bookings.

## Security built in
- **One sign-in path:** email + password through Supabase Auth. No demo accounts, no passwords in the code.
- **Row Level Security on every table.** Customers' details are private. Artisans see only requests sent to them.
- **Locked fields:** role, verified, badges, rating and booking identity fields cannot be changed from the browser (column permissions + triggers).
- **No faking:** names, emails and conversation ids are filled in by the database. Reviews need an accepted booking. Messages are only readable by the two people in them.
- **Public key only** in the browser, security headers in `vercel.json`, input length limits in the database.

## Good to know
- No artisans exist until people register. Add portfolio work and credentials rows in Table Editor for now (edit screens are not built yet).
- Not yet added: a strict Content-Security-Policy, CAPTCHA on sign-up, an admin screen to set `verified`.
