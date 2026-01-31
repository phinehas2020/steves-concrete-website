#!/bin/bash
# Migration script runner
# This will prompt you for credentials and run the migration

echo "🚀 Starting data migration to your custom Supabase server..."
echo ""

# Get old Supabase credentials
echo "📥 Old Supabase (current hosted instance):"
read -p "Old Supabase URL [https://cszvzklhxavqvnkgqvoe.supabase.co]: " OLD_URL
OLD_URL=${OLD_URL:-https://cszvzklhxavqvnkgqvoe.supabase.co}

read -p "Old Service Role Key (from Vercel env or .env): " OLD_KEY
if [ -z "$OLD_KEY" ]; then
  echo "❌ Old Service Role Key is required!"
  exit 1
fi

# Get new Supabase credentials
echo ""
echo "📤 New Supabase (your custom server):"
read -p "New Supabase URL [https://db.phinehasadams.com]: " NEW_URL
NEW_URL=${NEW_URL:-https://db.phinehasadams.com}

read -p "New Service Role Key (from your new Supabase dashboard): " NEW_KEY
if [ -z "$NEW_KEY" ]; then
  echo "❌ New Service Role Key is required!"
  exit 1
fi

echo ""
echo "🔄 Running migration..."
echo ""

OLD_SUPABASE_URL="$OLD_URL" \
OLD_SUPABASE_SERVICE_ROLE_KEY="$OLD_KEY" \
NEW_SUPABASE_URL="$NEW_URL" \
NEW_SUPABASE_SERVICE_ROLE_KEY="$NEW_KEY" \
node migrate-to-new-supabase.js

echo ""
echo "✅ Migration complete!"
