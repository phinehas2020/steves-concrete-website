# Finding Your API Keys in Supabase

The API keys section is usually in a **different part** of the Settings page. Here's where to look:

## Option 1: Look for "Project API keys" Section

On the same Settings → API page:
1. **Scroll up** - sometimes the keys are at the top
2. Look for a section titled **"Project API keys"** or **"API Keys"**
3. You should see two keys:
   - **anon** / **public** key (for frontend)
   - **service_role** key (for backend/migrations - this is what you need!)

## Option 2: Check the Left Sidebar

In the left sidebar under **Settings**, you might see:
- **API** (you're here)
- **Database**
- **Auth**
- **Storage**
- etc.

Sometimes there's a separate **"API Keys"** or **"Secrets"** section.

## Option 3: Look for a "Reveal" or "Show" Button

The service_role key is often hidden by default for security. Look for:
- A **"Reveal"** button
- An **eye icon** 👁️
- A **"Show service_role key"** link

## What You're Looking For

The service_role key will:
- Be longer than the anon key
- Say **"service_role"** in its label
- Have a warning like "Keep this secret" or "Do not expose in client-side code"
- Start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Quick Test

If you can't find it, you can also:
1. Check if there's a **"Copy"** button next to any key
2. Look for text that says **"service_role"** anywhere on the page
3. Try clicking around the Settings → API page to see if there are tabs or sections

Once you find it, copy the **service_role** key (not the anon key) and use it in the migration script!
