import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const leadsTo = process.env.LEADS_EMAIL_TO
const leadsFrom = process.env.LEADS_EMAIL_FROM
const leadsSmsTo = process.env.LEADS_SMS_TO
const twilioFrom = process.env.LEADS_SMS_FROM
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const siteName = process.env.LEADS_SITE_NAME || 'Concrete Works LLC'

function getIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || null
}

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

function toText(lead) {
  const lines = [
    `New website lead (${siteName})`,
    '',
    `Name: ${lead.name || '-'}`,
    `Phone: ${lead.phone || '-'}`,
    `Email: ${lead.email || '-'}`,
    `Service: ${lead.service || '-'}`,
    `Message: ${lead.message || '-'}`,
    `Page: ${lead.page_url || '-'}`,
    `IP: ${lead.ip || '-'}`,
    `User Agent: ${lead.user_agent || '-'}`,
  ]
  return lines.join('\n')
}

function toHtml(lead) {
  return `
    <div style="font-family:Arial, sans-serif; line-height:1.6;">
      <h2>New website lead (${siteName})</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 8px;"><strong>Name</strong></td><td style="padding:4px 8px;">${lead.name || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Phone</strong></td><td style="padding:4px 8px;">${lead.phone || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Email</strong></td><td style="padding:4px 8px;">${lead.email || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Service</strong></td><td style="padding:4px 8px;">${lead.service || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Message</strong></td><td style="padding:4px 8px;">${lead.message || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Page</strong></td><td style="padding:4px 8px;">${lead.page_url || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>IP</strong></td><td style="padding:4px 8px;">${lead.ip || '-'}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>User Agent</strong></td><td style="padding:4px 8px;">${lead.user_agent || '-'}</td></tr>
      </table>
    </div>
  `
}

function normalizePhoneList(rawPhones) {
  if (!rawPhones || typeof rawPhones !== 'string') return []
  return rawPhones
    .split(',')
    .map((phone) => phone.trim())
    .filter((phone) => phone.length > 0)
}

function buildSmsBody(lead) {
  return [
    `New website lead (${siteName})`,
    `Name: ${lead.name || '-'}`,
    `Phone: ${lead.phone || '-'}`,
    `Email: ${lead.email || '-'}`,
    `Service: ${lead.service || '-'}`,
    `Message: ${lead.message || '-'}`,
  ].join('\n')
}

async function sendSmsNotifications(lead, recipients) {
  if (!twilioAccountSid || !twilioAuthToken || !twilioFrom || recipients.length === 0) {
    if (!twilioAccountSid || !twilioAuthToken) {
      console.warn('SMS notification skipped - missing Twilio credentials')
    } else if (!twilioFrom) {
      console.warn('SMS notification skipped - missing LEADS_SMS_FROM')
    } else if (recipients.length === 0) {
      console.warn('SMS notification skipped - no LEADS_SMS_TO configured')
    }
    return
  }

  const basicAuth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')
  const body = buildSmsBody(lead)
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
  const sendTasks = recipients.map(async (to) => {
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
    return to
  })

  const results = await Promise.allSettled(sendTasks)
  const failures = results.filter((result) => result.status === 'rejected')
  const successCount = results.length - failures.length

  if (successCount > 0) {
    console.log(`SMS notification sent successfully to ${successCount} recipient(s)`)
  }
  if (failures.length > 0) {
    failures.forEach((failure, index) => {
      console.error(`Failed to send SMS notification #${index + 1}:`, failure.reason)
    })
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase config:', {
      hasUrl: !!supabaseUrl,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
      url: supabaseUrl
    })
    res.status(500).json({ error: 'Supabase server config missing' })
    return
  }

  const body = normalizeBody(req.body)
  const lead = {
    name: (body.name || '').trim(),
    phone: (body.phone || '').trim(),
    email: (body.email || '').trim() || null,
    service: (body.service || '').trim() || null,
    message: (body.message || '').trim(),
    source: body.source || 'website',
    page_url: body.pageUrl || body.page_url || null,
    user_agent: req.headers['user-agent'] || null,
    ip: getIp(req),
    status: 'new',
  }

  if (!lead.name || !lead.phone || !lead.message) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
  const { data, error } = await supabase.from('leads').insert(lead).select()

  if (error) {
    console.error('Failed to save lead to Supabase:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    res.status(500).json({ error: 'Failed to save lead', details: error.message })
    return
  }
  
  console.log('Lead saved successfully:', data?.[0]?.id)

  // Get email recipients from database, with fallback to env var
  let emailRecipients = []
  
  // Try to fetch from database first
  try {
    const { data: dbRecipients, error: dbError } = await supabase
      .from('email_recipients')
      .select('email')
      .eq('active', true)
    
    if (!dbError && dbRecipients && dbRecipients.length > 0) {
      emailRecipients = dbRecipients.map((r) => r.email)
      console.log('Found email recipients in database:', emailRecipients.length)
    }
  } catch (dbError) {
    console.warn('Could not fetch email recipients from database:', dbError)
  }
  
  // Fallback to env var if no database recipients found
  if (emailRecipients.length === 0 && leadsTo) {
    emailRecipients = leadsTo.split(',').map((email) => email.trim()).filter(Boolean)
    console.log('Using email recipients from env var:', emailRecipients.length)
  }

  // Send email notification via Resend
  if (process.env.RESEND_API_KEY && emailRecipients.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    try {
      // Use LEADS_EMAIL_FROM if set, otherwise use Resend's default
      const fromEmail = leadsFrom || 'onboarding@resend.dev'
      
      await resend.emails.send({
        from: fromEmail,
        to: emailRecipients,
        subject: `New Estimate Request — ${lead.name}`,
        text: toText(lead),
        html: toHtml(lead),
      })
      console.log('Email sent successfully to:', emailRecipients.join(', '))
    } catch (error) {
      // Log error but don't block lead capture
      console.error('Failed to send email notification:', error)
    }
  } else {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Email notification skipped - missing RESEND_API_KEY')
    } else if (emailRecipients.length === 0) {
      console.warn('Email notification skipped - no email recipients configured')
    }
  }

  // Send SMS notification via Twilio
  const smsRecipients = normalizePhoneList(leadsSmsTo)
  await sendSmsNotifications(lead, smsRecipients)

  res.status(200).json({ ok: true })
}
