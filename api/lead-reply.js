import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function envString(name, fallback = '') {
  const value = process.env[name]
  if (typeof value !== 'string') return fallback
  const trimmed = value
    .replace(/\\[nrt]/g, '')
    .replace(/[\0\r\n]/g, '')
    .trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const supabaseUrl = envString('SUPABASE_URL')
const supabaseServiceRoleKey = envString('SUPABASE_SERVICE_ROLE_KEY')
const resendApiKey = envString('RESEND_API_KEY')
const leadsFrom = envString('LEADS_EMAIL_FROM')
const siteName = envString('LEADS_SITE_NAME', 'Concrete Works LLC')

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toHtmlMessage(message) {
  const safeMessage = escapeHtml(message)
  return `
    <div style="font-family:Arial, sans-serif; line-height:1.6; white-space:pre-line;">
      ${safeMessage}
      <div style="margin-top:24px; font-size:12px; color:#6b7280;">Sent via ${siteName}</div>
    </div>
  `
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

  if (!resendApiKey) {
    res.status(500).json({ error: 'Resend API key missing' })
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
  const leadId = body.leadId
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!leadId || !subject || !message) {
    res.status(400).json({ error: 'Missing leadId, subject, or message' })
    return
  }

  if (subject.length > 200) {
    res.status(400).json({ error: 'Subject is too long' })
    return
  }

  if (message.length > 5000) {
    res.status(400).json({ error: 'Message is too long' })
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

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, name, email, status')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
    res.status(404).json({ error: 'Lead not found' })
    return
  }

  if (!lead.email) {
    res.status(400).json({ error: 'Lead does not have an email address' })
    return
  }

  const resend = new Resend(resendApiKey)
  const fromEmail = leadsFrom || 'onboarding@resend.dev'

  try {
    await resend.emails.send({
      from: fromEmail,
      to: lead.email,
      replyTo: userEmail,
      subject,
      text: message,
      html: toHtmlMessage(message),
    })
  } catch (error) {
    console.error('Failed to send lead reply:', error)
    res.status(500).json({ error: 'Failed to send reply' })
    return
  }

  if (lead.status === 'new') {
    const { error: statusError } = await supabase
      .from('leads')
      .update({ status: 'contacted' })
      .eq('id', leadId)

    if (statusError) {
      console.warn('Failed to update lead status after reply:', statusError)
    }
  }

  res.status(200).json({ ok: true })
}
