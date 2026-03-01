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
const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY

const RATE_LIMIT_WINDOW_MINUTES = parsePositiveInt(process.env.LEAD_RATE_LIMIT_WINDOW_MINUTES, 10)
const RATE_LIMIT_MAX_PER_IP = parsePositiveInt(process.env.LEAD_RATE_LIMIT_MAX_PER_IP, 5)
const RATE_LIMIT_MAX_PER_CONTACT = parsePositiveInt(process.env.LEAD_RATE_LIMIT_MAX_PER_CONTACT, 3)
const DUPLICATE_WINDOW_HOURS = parsePositiveInt(process.env.LEAD_DUPLICATE_WINDOW_HOURS, 24)
const MIN_FORM_AGE_SECONDS = parsePositiveInt(process.env.LEAD_MIN_FORM_AGE_SECONDS, 3)
const MAX_URLS_PER_MESSAGE = parsePositiveInt(process.env.LEAD_MAX_URLS_PER_MESSAGE, 2)

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function toTrimmedString(value, maxLength = 4000) {
  if (typeof value !== 'string') return ''
  return value.replace(/\u0000/g, '').trim().slice(0, maxLength)
}

function countUrls(value) {
  return (value.match(/\b(?:https?:\/\/|www\.)\S+/gi) || []).length
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseStartedAtMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const numeric = Number.parseInt(value, 10)
    if (Number.isFinite(numeric) && String(numeric).length >= 10) {
      return numeric
    }

    const parsedDate = Date.parse(value)
    if (Number.isFinite(parsedDate)) {
      return parsedDate
    }
  }

  return null
}

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
      <h2>New website lead (${escapeHtml(siteName)})</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 8px;"><strong>Name</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.name || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Phone</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.phone || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Email</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.email || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Service</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.service || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Message</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.message || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Page</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.page_url || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>IP</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.ip || '-')}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>User Agent</strong></td><td style="padding:4px 8px;">${escapeHtml(lead.user_agent || '-')}</td></tr>
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

function buildLead(body, req) {
  return {
    name: toTrimmedString(body.name, 120),
    phone: toTrimmedString(body.phone, 40),
    email: toTrimmedString(body.email, 254).toLowerCase() || null,
    service: toTrimmedString(body.service, 80) || null,
    message: toTrimmedString(body.message, 2000),
    source: toTrimmedString(body.source, 80) || 'website',
    page_url: toTrimmedString(body.pageUrl || body.page_url, 1024) || null,
    user_agent: toTrimmedString(req.headers['user-agent'], 1024) || null,
    ip: getIp(req),
    status: 'new',
  }
}

function validateLeadInput(lead) {
  if (!lead.name || !lead.phone || !lead.message) {
    return 'Missing required fields'
  }

  if (lead.name.length < 2) {
    return 'Please enter your full name'
  }

  const phoneDigits = lead.phone.replace(/\D/g, '')
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return 'Please enter a valid phone number'
  }

  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return 'Please enter a valid email address'
  }

  if (lead.message.length < 10) {
    return 'Please add a few more project details'
  }

  if (countUrls(lead.message) > MAX_URLS_PER_MESSAGE) {
    return 'Message contains too many links'
  }

  return null
}

function shouldSilentlyDropSubmission(body) {
  const honeypot = [body.website, body.company, body.fax, body.url]
    .map((value) => toTrimmedString(value, 256))
    .find(Boolean)

  if (honeypot) {
    return { drop: true, reason: 'honeypot' }
  }

  const startedAtMs = parseStartedAtMs(body.formStartedAt || body.form_started_at)
  if (startedAtMs) {
    const elapsedMs = Date.now() - startedAtMs
    if (elapsedMs >= 0 && elapsedMs < MIN_FORM_AGE_SECONDS * 1000) {
      return { drop: true, reason: 'submitted_too_fast' }
    }
  }

  return { drop: false, reason: '' }
}

async function verifyTurnstileToken({ token, ip }) {
  if (!turnstileSecretKey) {
    return { ok: true, skipped: true }
  }

  if (!token) {
    return { ok: false, reason: 'missing_token' }
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: turnstileSecretKey,
        response: token,
        remoteip: ip || '',
      }),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok || !result.success) {
      console.warn('Turnstile verification failed:', {
        status: response.status,
        errorCodes: Array.isArray(result['error-codes']) ? result['error-codes'] : [],
      })
      return { ok: false, reason: 'verification_failed' }
    }

    return { ok: true, skipped: false }
  } catch (error) {
    console.error('Turnstile verification request failed:', error)
    return { ok: false, reason: 'verification_error' }
  }
}

async function countRecentLeads(supabase, { sinceIso, ip, phone, email }) {
  let query = supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', sinceIso)

  if (ip) {
    query = query.eq('ip', ip)
  }
  if (phone) {
    query = query.eq('phone', phone)
  }
  if (email) {
    query = query.eq('email', email)
  }

  const { count, error } = await query

  if (error) {
    console.warn('Lead count check failed:', error)
    return null
  }

  return count || 0
}

async function runRateLimitChecks(supabase, lead) {
  const windowStartIso = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()

  if (lead.ip) {
    const ipCount = await countRecentLeads(supabase, { sinceIso: windowStartIso, ip: lead.ip })
    if (ipCount !== null && ipCount >= RATE_LIMIT_MAX_PER_IP) {
      return {
        blocked: true,
        statusCode: 429,
        error: 'Too many recent submissions from this network. Please try again shortly.',
      }
    }
  }

  if (lead.phone) {
    const phoneCount = await countRecentLeads(supabase, { sinceIso: windowStartIso, phone: lead.phone })
    if (phoneCount !== null && phoneCount >= RATE_LIMIT_MAX_PER_CONTACT) {
      return {
        blocked: true,
        statusCode: 429,
        error: 'Too many recent submissions for this contact. Please try again later.',
      }
    }
  }

  if (lead.email) {
    const emailCount = await countRecentLeads(supabase, { sinceIso: windowStartIso, email: lead.email })
    if (emailCount !== null && emailCount >= RATE_LIMIT_MAX_PER_CONTACT) {
      return {
        blocked: true,
        statusCode: 429,
        error: 'Too many recent submissions for this contact. Please try again later.',
      }
    }
  }

  return { blocked: false }
}

function canonicalizeMessage(value) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim()
}

async function hasRecentDuplicate(supabase, lead) {
  const windowStartIso = new Date(Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

  let query = supabase
    .from('leads')
    .select('id, message')
    .gte('created_at', windowStartIso)
    .order('created_at', { ascending: false })
    .limit(25)

  if (lead.phone) {
    query = query.eq('phone', lead.phone)
  } else if (lead.email) {
    query = query.eq('email', lead.email)
  } else {
    return false
  }

  const { data, error } = await query
  if (error) {
    console.warn('Duplicate lead check failed:', error)
    return false
  }

  const incomingMessage = canonicalizeMessage(lead.message)
  return (data || []).some((existingLead) => canonicalizeMessage(existingLead.message) === incomingMessage)
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
      url: supabaseUrl,
    })
    res.status(500).json({ error: 'Supabase server config missing' })
    return
  }

  const body = normalizeBody(req.body)

  const silentDrop = shouldSilentlyDropSubmission(body)
  if (silentDrop.drop) {
    console.warn(`Lead silently dropped (${silentDrop.reason})`, {
      ip: getIp(req),
      pageUrl: toTrimmedString(body.pageUrl || body.page_url, 1024) || null,
    })
    res.status(200).json({ ok: true })
    return
  }

  const lead = buildLead(body, req)
  const validationError = validateLeadInput(lead)
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  const turnstileToken = toTrimmedString(body.turnstileToken || body.turnstile_token, 2048)
  const turnstileCheck = await verifyTurnstileToken({ token: turnstileToken, ip: lead.ip })
  if (!turnstileCheck.ok) {
    res.status(400).json({ error: 'Bot verification failed. Please try again.' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  const rateLimit = await runRateLimitChecks(supabase, lead)
  if (rateLimit.blocked) {
    res.status(rateLimit.statusCode).json({ error: rateLimit.error })
    return
  }

  const duplicate = await hasRecentDuplicate(supabase, lead)
  if (duplicate) {
    console.log('Duplicate lead submission ignored', {
      phone: lead.phone,
      email: lead.email,
      ip: lead.ip,
    })
    res.status(200).json({ ok: true, duplicate: true })
    return
  }

  const { data, error } = await supabase.from('leads').insert(lead).select()

  if (error) {
    console.error('Failed to save lead to Supabase:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    res.status(500).json({ error: 'Failed to save lead', details: error.message })
    return
  }

  console.log('Lead saved successfully:', data?.[0]?.id)

  let emailRecipients = []

  try {
    const { data: dbRecipients, error: dbError } = await supabase
      .from('email_recipients')
      .select('email')
      .eq('active', true)

    if (!dbError && dbRecipients && dbRecipients.length > 0) {
      emailRecipients = dbRecipients.map((recipient) => recipient.email)
      console.log('Found email recipients in database:', emailRecipients.length)
    }
  } catch (dbError) {
    console.warn('Could not fetch email recipients from database:', dbError)
  }

  if (emailRecipients.length === 0 && leadsTo) {
    emailRecipients = leadsTo.split(',').map((email) => email.trim()).filter(Boolean)
    console.log('Using email recipients from env var:', emailRecipients.length)
  }

  if (process.env.RESEND_API_KEY && emailRecipients.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    try {
      const fromEmail = leadsFrom || 'onboarding@resend.dev'

      await resend.emails.send({
        from: fromEmail,
        to: emailRecipients,
        subject: `New Estimate Request — ${lead.name}`,
        text: toText(lead),
        html: toHtml(lead),
      })
      console.log('Email sent successfully to:', emailRecipients.join(', '))
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
    }
  } else {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Email notification skipped - missing RESEND_API_KEY')
    } else if (emailRecipients.length === 0) {
      console.warn('Email notification skipped - no email recipients configured')
    }
  }

  const smsRecipients = normalizePhoneList(leadsSmsTo)
  await sendSmsNotifications(lead, smsRecipients)

  res.status(200).json({ ok: true })
}
