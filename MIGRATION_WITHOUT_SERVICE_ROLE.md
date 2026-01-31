# Migration Without Service Role Key

If you can't find the service_role key, we can temporarily modify RLS policies to allow migration.

## Step 1: Add Temporary Policies

1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `temporary-migration-policy.sql`
3. Run it

This allows the migration script to insert data even with the anon key.

## Step 2: Run Migration

Now run the migration script with your **anon key**:

```bash
cd "/Users/phinehasadams/Steves website"

OLD_SUPABASE_URL="https://dpxbwtmicllheaxvecnu.supabase.co" \
OLD_SUPABASE_SERVICE_ROLE_KEY="<old-service-role-key>" \
NEW_SUPABASE_URL="https://db.phinehasadams.com" \
NEW_SUPABASE_SERVICE_ROLE_KEY="<your-anon-key>" \
node migrate-to-new-supabase.js
```

**Note:** The script will warn about using anon key, but it should work with the temporary policies.

## Step 3: Remove Temporary Policies

After migration completes successfully:

1. Go to SQL Editor
2. Copy and paste the contents of `remove-temporary-policies.sql`
3. Run it

This removes the temporary policies and restores security.

## Alternative: Find Service Role Key

The service_role key should be somewhere in:
- Settings → API → Project API keys
- Or check your Supabase installation documentation
- Or check environment variables if you set up Supabase yourself

If you're self-hosting, the key might be in your `.env` file or docker-compose configuration.
