# How to Get Your Service Role Key

## Step 1: Find API Keys Section

On the Supabase API Settings page you're viewing:

1. **Scroll down** on the same page, OR
2. Look for a section called **"Project API keys"** or **"API Keys"**
3. You should see two keys:
   - **anon** or **public** key (this is what you used before - WRONG for migration)
   - **service_role** key (this is what you need - CORRECT for migration)

## Step 2: Copy the Service Role Key

The service_role key will look something like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzY5ODgyMjE1LCJleHAiOjE5Mjc1NjIyMTV9...
```

**Important:** 
- It will say `"role":"service_role"` in the JWT payload
- It's usually longer than the anon key
- It's marked as **secret** - keep it safe!

## Step 3: Run Migration Again

Once you have the service_role key:

```bash
cd "/Users/phinehasadams/Steves website"
./run-migration.sh
```

When prompted for "New Service Role Key", paste the **service_role** key (not the anon key).

## Alternative: Direct Command

If you prefer to run it directly:

```bash
cd "/Users/phinehasadams/Steves website"

OLD_SUPABASE_URL="https://dpxbwtmicllheaxvecnu.supabase.co" \
OLD_SUPABASE_SERVICE_ROLE_KEY="<old-service-role-key>" \
NEW_SUPABASE_URL="https://db.phinehasadams.com" \
NEW_SUPABASE_SERVICE_ROLE_KEY="<paste-service-role-key-here>" \
node migrate-to-new-supabase.js
```

The script will now validate that you're using the correct key type and warn you if you use the anon key by mistake!
