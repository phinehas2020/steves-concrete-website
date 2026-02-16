import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioFrom = process.env.LEADS_SMS_FROM
const leadsSmsTo = process.env.LEADS_SMS_TO
const siteName = process.env.LEADS_SITE_NAME || 'Concrete Works LLC'

function normalizeBody(body) {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body
}

function normalizePhoneList(rawPhones) {
  if (!rawPhones || typeof rawPhones !== 'string') return []
  return rawPhones
    .split(',')
    .map((phone) => phone.trim())
    .filter(Boolean)
}

function buildSmsBody(lead) {
  const createdAt = lead.created_at
    ? new Date(lead.created_at).toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Unknown'

  return [
    `New website lead (${siteName})`,
    `Created: ${createdAt}`,
    `Name: ${lead.name || '-'}`,
    `Phone: ${lead.phone || '-'}`,
    `Email: ${lead.email || '-'}`,
    `Service: ${lead.service || '-'}`,
    `Source: ${lead.source || '-'}`,
    `Message: ${lead.message || '-'}`,
    `Page: ${lead.page_url || '-'}`,
  ].join('\n')
}

async function sendTwilioMessage(to, body) {
  const basicAuth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: twilioFrom,
      To: to,
      Body: body,
    }),
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(`Twilio API error (${response.status}): ${responseText}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    res.status(500).json({ error: 'Supabase server config missing' })
    return
  }

  if (!twilioAccountSid || !twilioAuthToken || !twilioFrom) {
    res.status(500).json({ error: 'Twilio config missing' })
    return
  }

  const authHeader = req.headers.authorization || ''
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!tokenMatch) {
    res.status(401).json({ error: 'Missing auth token' })
    return
  }

  const token = tokenMatch[1]
  const body = normalizeBody(req.body)
  const leadIds = Array.isArray(body.leadIds) ? body.leadIds.filter(Boolean) : []

  if (leadIds.length === 0) {
    res.status(400).json({ error: 'Missing leadIds list' })
    return
  }

  const recipients = normalizePhoneList(leadsSmsTo)
  if (recipients.length === 0) {
    res.status(400).json({ error: 'No recipient phone numbers configured' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user?.email) {
    res.status(401).json({ error: 'Invalid auth token' })
    return
  }

  const userEmail = userData.user.email
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('email', userEmail)
    .single()

  if (adminError || !adminUser) {
    res.status(403).json({ error: 'Not authorized' })
    return
  }

  const { data: leads, error: leadError } = await supabase
    .from('leads')
    .select('id, name, phone, email, service, message, page_url, user_agent, ip, source, created_at')
    .in('id', leadIds)

  if (leadError) {
    res.status(500).json({ error: 'Failed to load leads' })
    return
  }

  if (!leads || leads.length === 0) {
    res.status(404).json({ error: 'No leads found for provided IDs' })
    return
  }

  const payloads = leads.map((lead) => ({
    leadId: lead.id,
    body: buildSmsBody(lead),
  }))

  const sendJobs = payloads.flatMap(({ leadId, body }) =>
    recipients.map((to) => ({ leadId, to, body }))
  )

  const results = await Promise.allSettled(
    sendJobs.map(async ({ to, body, leadId }) => {
      await sendTwilioMessage(to, body)
      return { leadId, to }
    })
  )

  const failed = results.filter((result) => result.status === 'rejected')
  failed.forEach((failure, index) => {
    console.error(`Failed SMS send #${index + 1}:`, failure.reason)
  })

  const successCount = results.length - failed.length
  const failedCount = failed.length
  const processedLeadIds = new Set(leads.map((lead) => lead.id))

  const missingLeadCount = leadIds.filter((id) => !processedLeadIds.has(id)).length

  res.status(200).json({
    ok: true,
    admin: adminUser.email,
    totalLeadsRequested: leadIds.length,
    totalLeadsFound: leads.length,
    missingLeadCount,
    totalRecipients: recipients.length,
    sentCount: successCount,
    failedCount,
  })
}
