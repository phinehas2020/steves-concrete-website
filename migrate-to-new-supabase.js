// Script to migrate all data from old Supabase to new Supabase instance
// Run this after updating environment variables
//
// Usage:
//   OLD_SUPABASE_URL=https://old.supabase.co \
//   OLD_SUPABASE_SERVICE_ROLE_KEY=old-key \
//   NEW_SUPABASE_URL=https://db.phinehasadams.com \
//   NEW_SUPABASE_SERVICE_ROLE_KEY=new-key \
//   node migrate-to-new-supabase.js

import { createClient } from '@supabase/supabase-js'

// Old Supabase (current - Supabase hosted)
const oldSupabaseUrl = process.env.OLD_SUPABASE_URL || 'https://cszvzklhxavqvnkgqvoe.supabase.co'
const oldSupabaseKey = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

// New Supabase (your custom server)
// Using anon key - temporary RLS policies should be applied first
const newSupabaseUrl = process.env.NEW_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.phinehasadams.com'
const newSupabaseKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!oldSupabaseUrl || !oldSupabaseKey) {
  console.error('Missing old Supabase credentials')
  process.exit(1)
}

if (!newSupabaseUrl || !newSupabaseKey) {
  console.error('Missing new Supabase credentials')
  process.exit(1)
}

const oldSupabase = createClient(oldSupabaseUrl, oldSupabaseKey)
const newSupabase = createClient(newSupabaseUrl, newSupabaseKey)

async function migrateData() {
  console.log('Starting migration...')

  // 1. Migrate admin_users
  console.log('Migrating admin_users...')
  const { data: adminUsers, error: adminError } = await oldSupabase
    .from('admin_users')
    .select('*')

  if (adminError) {
    console.error('Error fetching admin_users:', adminError)
  } else if (adminUsers && adminUsers.length > 0) {
    const { error: insertError } = await newSupabase
      .from('admin_users')
      .upsert(adminUsers, { onConflict: 'email' })
    if (insertError) {
      console.error('Error migrating admin_users:', insertError)
    } else {
      console.log(`  Migrated ${adminUsers.length} admin users`)
    }
  }

  // 2. Migrate jobs
  console.log('Migrating jobs...')
  const { data: jobs, error: jobsError } = await oldSupabase
    .from('jobs')
    .select('*')
    .order('display_order', { ascending: true })

  if (jobsError) {
    console.error('Error fetching jobs:', jobsError)
  } else if (jobs && jobs.length > 0) {
    for (const job of jobs) {
      const { data: existingJob } = await newSupabase
        .from('jobs')
        .select('id')
        .eq('slug', job.slug)
        .single()

      if (!existingJob) {
        const { data: newJob, error: insertError } = await newSupabase
          .from('jobs')
          .insert({
            title: job.title,
            slug: job.slug,
            category: job.category,
            location: job.location,
            date: job.date,
            date_formatted: job.date_formatted,
            description: job.description,
            featured: job.featured,
            display_order: job.display_order,
          })
          .select()
          .single()

        if (insertError) {
          console.error(`  Error migrating job ${job.title}:`, insertError)
        } else {
          console.log(`  Migrated job: ${job.title}`)

          // 3. Migrate job_images for this job
          const { data: images, error: imagesError } = await oldSupabase
            .from('job_images')
            .select('*')
            .eq('job_id', job.id)
            .order('image_order', { ascending: true })

          if (!imagesError && images && images.length > 0) {
            const imageInserts = images.map((img) => ({
              job_id: newJob.id,
              image_url: img.image_url,
              image_order: img.image_order,
              alt_text: img.alt_text,
            }))

            const { error: imgInsertError } = await newSupabase
              .from('job_images')
              .insert(imageInserts)

            if (imgInsertError) {
              console.error(`    Error migrating images for ${job.title}:`, imgInsertError)
            } else {
              console.log(`    Migrated ${imageInserts.length} images`)
            }
          }
        }
      } else {
        console.log(`  Job ${job.title} already exists, skipping...`)
      }
    }
  }

  // 4. Migrate leads
  console.log('Migrating leads...')
  const { data: leads, error: leadsError } = await oldSupabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000) // Limit to recent leads

  if (leadsError) {
    console.error('Error fetching leads:', leadsError)
  } else if (leads && leads.length > 0) {
    const { error: insertError } = await newSupabase
      .from('leads')
      .upsert(leads, { onConflict: 'id' })
    if (insertError) {
      console.error('Error migrating leads:', insertError)
    } else {
      console.log(`  Migrated ${leads.length} leads`)
    }
  }

  // 5. Migrate blog_posts
  console.log('Migrating blog_posts...')
  const { data: posts, error: postsError } = await oldSupabase
    .from('blog_posts')
    .select('*')

  if (postsError) {
    console.error('Error fetching blog_posts:', postsError)
  } else if (posts && posts.length > 0) {
    const { error: insertError } = await newSupabase
      .from('blog_posts')
      .upsert(posts, { onConflict: 'slug' })
    if (insertError) {
      console.error('Error migrating blog_posts:', insertError)
    } else {
      console.log(`  Migrated ${posts.length} blog posts`)
    }
  }

  console.log('Migration complete!')
}

migrateData().catch(console.error)
