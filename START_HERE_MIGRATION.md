# 🚀 Start Here: Migrate to Your Custom Supabase

The MCP connection has issues (403 error), but we can migrate directly - it's actually faster!

## ✅ Step 1: Apply Schema (5 min)

1. Open your new Supabase dashboard
2. Go to **SQL Editor** → **New Query**
3. Open `apply-migrations-to-new-supabase.sql` in this project
4. Copy **ALL** the SQL (entire file)
5. Paste into SQL Editor
6. Click **Run** ✅

This creates all tables, policies, and storage bucket.

## ✅ Step 2: Get Credentials

From Supabase Dashboard → **Settings** → **API**:
- Copy **Project URL** (e.g., `https://db.phinehasadams.com`)
- Copy **anon/public key** 
- Copy **service_role key** (secret!)

## ✅ Step 3: Migrate Data

Run this in terminal:

```bash
cd "/Users/phinehasadams/Steves website"

# Replace with your actual keys:
export OLD_SUPABASE_URL="https://cszvzklhxavqvnkgqvoe.supabase.co"
export OLD_SUPABASE_SERVICE_ROLE_KEY="<old-key-from-vercel-or-env>"
export NEW_SUPABASE_URL="https://db.phinehasadams.com"
export NEW_SUPABASE_SERVICE_ROLE_KEY="<new-service-role-key>"

node migrate-to-new-supabase.js
```

This copies all jobs, images, admin users, leads, and blog posts.

## ✅ Step 4: Update Environment Variables

**Local `.env`:**
```bash
VITE_SUPABASE_URL=https://db.phinehasadams.com
VITE_SUPABASE_ANON_KEY=<new-anon-key>
SUPABASE_URL=https://db.phinehasadams.com
SUPABASE_SERVICE_ROLE_KEY=<new-service-role-key>
```

**Vercel:** Update in Dashboard → Settings → Environment Variables

## ✅ Step 5: Test

- `/admin` - login works?
- `/jobs` - jobs load?
- Create/edit job - works?
- Upload image - works?

## 🎉 Done!

Your site is now on your custom Supabase server!
