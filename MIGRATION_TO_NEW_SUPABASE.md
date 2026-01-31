# Migration Guide: Moving to Your Custom Supabase Server

## Step 1: Add MCP Server to Cursor

Add this to your Cursor MCP settings (Cursor Settings → Features → MCP):

```json
{
  "mcpServers": {
    "supabase-custom": {
      "url": "https://db.phinehasadams.com/mcp"
    }
  }
}
```

## Step 2: Get Your New Supabase Credentials

From your new Supabase instance at `https://db.phinehasadams.com`:
- **API URL**: `https://db.phinehasadams.com` (or your API endpoint)
- **Anon Key**: Get from Settings → API
- **Service Role Key**: Get from Settings → API (keep secret!)

## Step 3: Apply Database Schema

Run the complete schema migration on your new Supabase instance:

**Option A: Via Supabase Dashboard**
1. Go to your new Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `apply-migrations-to-new-supabase.sql`
4. Run it

**Option B: Via Supabase CLI**
```bash
# Connect to new database
supabase db push --db-url "postgresql://user:pass@db.phinehasadams.com:5432/postgres"
```

## Step 4: Migrate All Data

Run the Node.js migration script:

```bash
# Set environment variables
export OLD_SUPABASE_URL="https://cszvzklhxavqvnkgqvoe.supabase.co"
export OLD_SUPABASE_SERVICE_ROLE_KEY="<old-service-role-key>"
export NEW_SUPABASE_URL="https://db.phinehasadams.com"
export NEW_SUPABASE_SERVICE_ROLE_KEY="<new-service-role-key>"

# Run migration
node migrate-to-new-supabase.js
```

This will migrate:
- ✅ Admin users (including your super admin)
- ✅ All 16 jobs with their images
- ✅ All leads
- ✅ All blog posts

## Step 5: Update Environment Variables

### Local `.env` file:
```bash
VITE_SUPABASE_URL=https://db.phinehasadams.com
VITE_SUPABASE_ANON_KEY=<your-new-anon-key>
SUPABASE_URL=https://db.phinehasadams.com
SUPABASE_SERVICE_ROLE_KEY=<your-new-service-role-key>
```

### Vercel Environment Variables:
Update in Vercel Dashboard → Your Project → Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Step 6: Test Everything

1. ✅ Test admin login at `/admin`
2. ✅ Verify jobs load at `/jobs`
3. ✅ Test creating/editing jobs
4. ✅ Test image uploads
5. ✅ Verify leads are being saved

## Step 7: Copy Image Files (if needed)

If images are stored in `public/jobs/`, you may need to:
1. Copy files to your new server's public folder, OR
2. Re-upload images through the admin dashboard (they'll go to Supabase Storage)

## Troubleshooting

- **MCP not connecting**: Make sure your MCP server URL is accessible and returns valid MCP responses
- **Migration fails**: Check that all tables exist in new database first
- **Images not loading**: Verify Supabase Storage bucket `jobs` exists and is public
- **Auth not working**: Ensure Auth is enabled and email provider is configured
