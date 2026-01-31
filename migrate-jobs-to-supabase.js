// Script to migrate existing jobs to Supabase
// Run this once to populate the database with existing jobs

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Jobs data from the original structure
const jobsData = [
  {
    title: 'Commercial Concrete Barrier',
    slug: '2025-01-27-commercial-concrete-barrier',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2025-01-27',
    date_formatted: 'January 2025',
    description: 'Professional commercial concrete barrier project completed in January 2025. Built to commercial standards with durability and longevity in mind.',
    featured: true,
    display_order: 1,
    images: [
      '/jobs/2025-01-27-commercial-concrete-barrier-1.jpeg',
      '/jobs/2025-01-27-commercial-concrete-barrier-2.jpeg',
    ],
  },
  {
    title: 'Concrete Slab Finishing',
    slug: '2024-04-06-concrete-slab-finishing',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2024-04-06',
    date_formatted: 'April 2024',
    description: 'Professional concrete slab finishing project completed in April 2024. Built to commercial standards with durability and longevity in mind.',
    featured: true,
    display_order: 2,
    images: [
      '/jobs/2024-04-06-concrete-slab-finishing-1.jpeg',
      '/jobs/2024-04-06-concrete-slab-finishing-2.jpeg',
      '/jobs/2024-04-06-concrete-slab-finishing-3.jpeg',
    ],
  },
  {
    title: 'Concrete Formwork',
    slug: '2024-03-27-concrete-formwork',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2024-03-27',
    date_formatted: 'March 2024',
    description: 'Professional concrete formwork project completed in March 2024. Built to commercial standards with durability and longevity in mind.',
    featured: true,
    display_order: 3,
    images: [
      '/jobs/2024-03-27-concrete-formwork-1.jpeg',
      '/jobs/2024-03-27-concrete-formwork-2.jpeg',
      '/jobs/2024-03-27-concrete-formwork-3.jpeg',
      '/jobs/2024-03-27-concrete-formwork-4.jpeg',
      '/jobs/2024-03-27-concrete-formwork-5.jpeg',
      '/jobs/2024-03-27-concrete-formwork-6.jpeg',
    ],
  },
  {
    title: 'Foundation Excavation',
    slug: '2024-02-13-foundation-excavation',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2024-02-13',
    date_formatted: 'February 2024',
    description: 'Professional foundation excavation project completed in February 2024. Built to commercial standards with durability and longevity in mind.',
    featured: true,
    display_order: 4,
    images: Array.from({ length: 16 }, (_, i) => `/jobs/2024-02-13-foundation-excavation-${i + 1}.jpeg`),
  },
  {
    title: 'Exposed Aggregate Patio',
    slug: '2017-07-07-exposed-aggregate-patio',
    category: 'Stamped',
    location: 'Waco, TX',
    date: '2017-07-07',
    date_formatted: 'July 2017',
    description: 'Professional exposed aggregate patio project completed in July 2017. Features custom stamped concrete patterns and decorative finishes.',
    featured: false,
    display_order: 5,
    images: Array.from({ length: 10 }, (_, i) => `/jobs/2017-07-07-exposed-aggregate-patio-${i + 1}.jpeg`),
  },
  {
    title: 'Foundation Excavation',
    slug: '2017-06-10-foundation-excavation',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-06-10',
    date_formatted: 'June 2017',
    description: 'Professional foundation excavation project completed in June 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 6,
    images: Array.from({ length: 3 }, (_, i) => `/jobs/2017-06-10-foundation-excavation-${i + 1}.jpeg`),
  },
  {
    title: 'Concrete Slab',
    slug: '2017-05-08-concrete-slab',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-05-08',
    date_formatted: 'May 2017',
    description: 'Professional concrete slab project completed in May 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 7,
    images: Array.from({ length: 4 }, (_, i) => `/jobs/2017-05-08-concrete-slab-${i + 1}.jpeg`),
  },
  {
    title: 'Stained Walkway',
    slug: '2017-05-01-stained-walkway',
    category: 'Stamped',
    location: 'Waco, TX',
    date: '2017-05-01',
    date_formatted: 'May 2017',
    description: 'Professional stained walkway project completed in May 2017. Features custom stamped concrete patterns and decorative finishes.',
    featured: false,
    display_order: 8,
    images: ['/jobs/2017-05-01-stained-walkway-1.jpeg'],
  },
  {
    title: 'Site Excavation',
    slug: '2017-04-20-site-excavation',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-04-20',
    date_formatted: 'April 2017',
    description: 'Professional site excavation project completed in April 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 9,
    images: Array.from({ length: 10 }, (_, i) => `/jobs/2017-04-20-site-excavation-${i + 1}.jpeg`),
  },
  {
    title: 'Rebar Prep',
    slug: '2017-04-10-rebar-prep',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-04-10',
    date_formatted: 'April 2017',
    description: 'Professional rebar prep project completed in April 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 10,
    images: Array.from({ length: 8 }, (_, i) => `/jobs/2017-04-10-rebar-prep-${i + 1}.jpeg`),
  },
  {
    title: 'Concrete Slab',
    slug: '2017-03-28-concrete-slab',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-03-28',
    date_formatted: 'March 2017',
    description: 'Professional concrete slab project completed in March 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 11,
    images: Array.from({ length: 3 }, (_, i) => `/jobs/2017-03-28-concrete-slab-${i + 1}.jpeg`),
  },
  {
    title: 'Personal',
    slug: '2017-03-18-personal',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-03-18',
    date_formatted: 'March 2017',
    description: 'Personal project completed in March 2017. Expertly crafted with attention to detail and quality.',
    featured: false,
    display_order: 12,
    images: ['/jobs/2017-03-18-personal-1.jpeg'],
  },
  {
    title: 'Concrete Finishing',
    slug: '2017-03-08-concrete-finishing',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-03-08',
    date_formatted: 'March 2017',
    description: 'Professional concrete finishing project completed in March 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 13,
    images: Array.from({ length: 11 }, (_, i) => `/jobs/2017-03-08-concrete-finishing-${i + 1}.jpeg`),
  },
  {
    title: 'Construction Site',
    slug: '2017-02-18-construction-site',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-02-18',
    date_formatted: 'February 2017',
    description: 'Professional construction site project completed in February 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 14,
    images: Array.from({ length: 2 }, (_, i) => `/jobs/2017-02-18-construction-site-${i + 1}.jpeg`),
  },
  {
    title: 'Concrete Slab Pour',
    slug: '2017-02-02-concrete-slab-pour',
    category: 'Commercial',
    location: 'Waco, TX',
    date: '2017-02-02',
    date_formatted: 'February 2017',
    description: 'Professional concrete slab pour project completed in February 2017. Built to commercial standards with durability and longevity in mind.',
    featured: false,
    display_order: 15,
    images: Array.from({ length: 2 }, (_, i) => `/jobs/2017-02-02-concrete-slab-pour-${i + 1}.jpeg`),
  },
  {
    title: 'Concrete Staining',
    slug: '2017-01-28-concrete-staining',
    category: 'Stamped',
    location: 'Waco, TX',
    date: '2017-01-28',
    date_formatted: 'January 2017',
    description: 'Professional concrete staining project completed in January 2017. Features custom stamped concrete patterns and decorative finishes.',
    featured: false,
    display_order: 16,
    images: Array.from({ length: 4 }, (_, i) => `/jobs/2017-01-28-concrete-staining-${i + 1}.jpeg`),
  },
]

async function migrateJobs() {
  console.log('Starting job migration...')

  for (const jobData of jobsData) {
    try {
      // Insert job
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          slug: jobData.slug,
          category: jobData.category,
          location: jobData.location,
          date: jobData.date,
          date_formatted: jobData.date_formatted,
          description: jobData.description,
          featured: jobData.featured,
          display_order: jobData.display_order,
        })
        .select()
        .single()

      if (jobError) {
        if (jobError.code === '23505') {
          // Unique constraint violation - job already exists
          console.log(`Job ${jobData.slug} already exists, skipping...`)
          continue
        }
        throw jobError
      }

      console.log(`Created job: ${jobData.title}`)

      // Insert images
      if (jobData.images && jobData.images.length > 0) {
        const imageInserts = jobData.images.map((imageUrl, index) => ({
          job_id: job.id,
          image_url: imageUrl,
          image_order: index,
          alt_text: `${jobData.title} - Image ${index + 1}`,
        }))

        const { error: imagesError } = await supabase.from('job_images').insert(imageInserts)

        if (imagesError) {
          console.error(`Error inserting images for ${jobData.title}:`, imagesError)
        } else {
          console.log(`  Added ${imageInserts.length} images`)
        }
      }
    } catch (error) {
      console.error(`Error migrating job ${jobData.title}:`, error)
    }
  }

  console.log('Migration complete!')
}

migrateJobs().catch(console.error)
