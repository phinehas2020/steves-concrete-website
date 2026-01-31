# ✅ Schema Applied! Next Steps

Your database schema is now set up on your custom Supabase server! 🎉

## Step 2: Migrate All Data

You have two options:

### Option A: Interactive Script (Easiest)
```bash
cd "/Users/phinehasadams/Steves website"
./run-migration.sh
```

This will prompt you for:
- Old Supabase Service Role Key (from Vercel or your `.env`)
- New Supabase Service Role Key (from your new Supabase dashboard → Settings → API)

### Option B: Manual Command
```bash
cd "/Users/phinehasadams/Steves website"

# Replace with your actual keys:
OLD_SUPABASE_URL="https://cszvzklhxavqvnkgqvoe.supabase.co" \
OLD_SUPABASE_SERVICE_ROLE_KEY="<your-old-service-role-key>" \
NEW_SUPABASE_URL="https://db.phinehasadams.com" \
NEW_SUPABASE_SERVICE_ROLE_KEY="<your-new-service-role-key>" \
node migrate-to-new-supabase.js
```

This will migrate:
- ✅ All admin users (including your super admin)
- ✅ All 16 jobs with their images
- ✅ All leads
- ✅ All blog posts

## Step 3: Get Your New Supabase Credentials

From your new Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://db.phinehasadams.com`)
   - **anon/public key** (for `VITE_SUPABASE_ANON_KEY`)
   - **service_role key** (for `SUPABASE_SERVICE_ROLE_KEY`)

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
2. Update all 4 variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy (or wait for next commit)

## Step 5: Test Everything

1. ✅ Visit `/admin` - test login
2. ✅ Visit `/jobs` - verify jobs load
3. ✅ Test creating/editing a job
4. ✅ Test image upload
5. ✅ Submit a contact form (verify leads save)

## 🎉 Done!

Your site is now running on your custom Supabase server!
