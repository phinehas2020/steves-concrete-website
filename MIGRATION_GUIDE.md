# Migration Guide: Moving to Custom Supabase Server

## Step 1: Add MCP Server Configuration

Add this to your Cursor MCP settings (usually in Cursor Settings > MCP):

```json
{
  "mcpServers": {
    "supabase-custom": {
      "url": "https://db.phinehasadams.com/mcp"
    }
  }
}
```

## Step 2: Get New Supabase Credentials

You'll need:
- New Supabase URL: `https://db.phinehasadams.com` (or your API URL)
- New Supabase Anon Key
- New Supabase Service Role Key (for admin operations)

## Step 3: Update Environment Variables

Update your `.env` file and Vercel environment variables:

```bash
# Old (keep for migration)
OLD_SUPABASE_URL=https://cszvzklhxavqvnkgqvoe.supabase.co
OLD_SUPABASE_SERVICE_ROLE_KEY=<old-key>

# New
VITE_SUPABASE_URL=https://db.phinehasadams.com
VITE_SUPABASE_ANON_KEY=<new-anon-key>
SUPABASE_URL=https://db.phinehasadams.com
SUPABASE_SERVICE_ROLE_KEY=<new-service-role-key>
```

## Step 4: Run Database Migrations

Apply all migrations to the new database:

```bash
# Connect to new Supabase and run migrations
supabase db push --db-url "postgresql://user:pass@db.phinehasadams.com:5432/postgres"
```

Or manually apply migrations via SQL Editor in your new Supabase dashboard.

## Step 5: Run Data Migration

Run the migration script to copy all data:

```bash
node migrate-to-new-supabase.js
```

This will migrate:
- Admin users
- All jobs and job images
- Leads
- Blog posts

## Step 6: Update Vercel Environment Variables

Update all environment variables in Vercel dashboard:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## Step 7: Test

1. Test admin login
2. Verify jobs load correctly
3. Test image uploads
4. Verify leads are being saved
