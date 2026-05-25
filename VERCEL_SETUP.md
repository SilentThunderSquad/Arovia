# Arovia — Vercel Deployment Guide

## Environment Variables

Add the following to your Vercel project (Settings → Environment Variables):

### Frontend (Vite) Variables

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://zbxdadgydkgcqlhmdhss.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

> Note: `VITE_API_URL` is NOT needed in production — the frontend uses the same origin.

### Backend (Express) Variables

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://zbxdadgydkgcqlhmdhss.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Your Supabase **service_role** secret key |
| `CLIENT_URL` | `https://arovia.silentthundersquad.in` |
| `NODE_ENV` | `production` |

> ⚠️ Never expose `SUPABASE_SERVICE_KEY` to the frontend. It must stay server-side only.

---

## Supabase Setup Checklist

### 1. Run SQL Migrations
Go to your Supabase project → SQL Editor → run these files in order:
1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls.sql`
3. `supabase/migrations/003_functions.sql`

### 2. Enable Google OAuth (optional)
1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Enable Google and add your Client ID + Secret
3. Add your Google Cloud Console redirect URI:
   ```
   https://zbxdadgydkgcqlhmdhss.supabase.co/auth/v1/callback
   ```
4. Add your site URL to Supabase → Authentication → URL Configuration:
   - Site URL: `https://arovia.silentthundersquad.in`
   - Redirect URLs: `https://arovia.silentthundersquad.in/auth/callback`

### 3. Get Your Service Role Key
- Supabase Dashboard → Settings → API → `service_role` secret key
- Add to Vercel as `SUPABASE_SERVICE_KEY`

---

## Local Development

```bash
# Frontend
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Backend
cp backend/.env.example backend/.env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_KEY

# Run frontend
npm run dev

# Run backend (in separate terminal)
cd backend && npm run dev
```

---

## Variables Removed (no longer needed)

- ~~`MONGO_URI`~~ → replaced by Supabase
- ~~`JWT_SECRET`~~ → Supabase manages JWTs
- ~~`SESSION_SECRET`~~ → express-session removed
- ~~`GOOGLE_CLIENT_ID`~~ → Supabase handles Google OAuth
- ~~`GOOGLE_CLIENT_SECRET`~~ → Supabase handles Google OAuth
