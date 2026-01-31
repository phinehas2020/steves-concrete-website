# Fix: RLS Policy Violation During Migration

## Problem

The migration is failing with:
```
new row violates row-level security policy for table "jobs"
```

This happens because you're using the **anon key** instead of the **service_role key**.

## Solution

You need to use the **service_role key** (not anon key) for the migration. The service_role key bypasses RLS policies.

### Get Your Service Role Key

1. Go to your new Supabase dashboard: `https://db.phinehasadams.com`
2. Navigate to **Settings** → **API**
3. Find the **service_role** key (it's different from the anon/public key)
4. Copy it (keep it secret - it has full database access!)

### Run Migration Again

```bash
cd "/Users/phinehasadams/Steves website"

# Use SERVICE_ROLE_KEY (not anon key!)
OLD_SUPABASE_URL="https://dpxbwtmicllheaxvecnu.supabase.co" \
OLD_SUPABASE_SERVICE_ROLE_KEY="<your-old-service-role-key>" \
NEW_SUPABASE_URL="https://db.phinehasadams.com" \
NEW_SUPABASE_SERVICE_ROLE_KEY="<your-NEW-service-role-key>" \
node migrate-to-new-supabase.js
```

Or use the interactive script:
```bash
./run-migration.sh
```

When prompted for "New Service Role Key", paste the **service_role** key (not the anon key).

## Key Differences

- **anon/public key**: Used by frontend, respects RLS policies
- **service_role key**: Used by backend/admin, bypasses RLS policies (required for migrations)

The script will now check and warn you if you use the wrong key type!
