# Quick Migration Steps (Without MCP)

Since the MCP connection is having issues, here's the fastest way to migrate:

## Step 1: Apply Schema (5 minutes)

1. Open your new Supabase dashboard: `https://db.phinehasadams.com` (or your dashboard URL)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy **ALL** contents from `apply-migrations-to-new-supabase.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success" message

✅ This creates all tables, RLS policies, functions, and storage bucket.

## Step 2: Get Your Credentials

From your new Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://db.phinehasadams.com`)
   - **anon/public key** (for `VITE_SUPABASE_ANON_KEY`)
   - **service_role key** (for `SUPABASE_SERVICE_ROLE_KEY` - keep secret!)

## Step 3: Migrate Data (2 minutes)

Run the migration script:

```bash
cd "/Users/phinehasadams/Steves website"

# Set environment variables
export OLD_SUPABASE_URL="https://cszvzklhxavqvnkgqvoe.supabase.co"
export OLD_SUPABASE_SERVICE_ROLE_KEY="<your-old-service-role-key>"
export NEW_SUPABASE_URL="https://db.phinehasadams.com"
export NEW_SUPABASE_SERVICE_ROLE_KEY="<your-new-service-role-key>"

# Run migration
node migrate-to-new-supabase.js
```

This will copy:
- ✅ All admin users
- ✅ All 16 jobs with images
- ✅ All leads
- ✅ All blog posts

## Step 4: Update Environment Variables

### Local `.env` file:
```bash
VITE_SUPABASE_URL=https://db.phinehasadams.com
VITE_SUPABASE_ANON_KEY=<your-new-anon-key>
SUPABASE_URL=https://db.phinehasadams.com
SUPABASE_SERVICE_ROLE_KEY=<your-new-service-role-key>
```

### Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy (or wait for next deploy)

## Step 5: Test

1. Visit your site: `/admin` - test login
2. Visit `/jobs` - verify jobs load
3. Test creating/editing a job
4. Test image upload

## Done! 🎉

Your site is now running on your custom Supabase server!
