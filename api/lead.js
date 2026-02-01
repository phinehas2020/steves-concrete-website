import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const leadsTo = process.env.LEADS_EMAIL_TO
const leadsFrom = process.env.LEADS_EMAIL_FROM
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
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
  const { error } = await supabase.from('leads').insert(lead)

  if (error) {
    res.status(500).json({ error: 'Failed to save lead' })
    return
  }

  // Send email notification via Resend
  if (process.env.RESEND_API_KEY && leadsTo) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    try {
      // Use LEADS_EMAIL_FROM if set, otherwise use Resend's default
      const fromEmail = leadsFrom || 'onboarding@resend.dev'
      
      await resend.emails.send({
        from: fromEmail,
        to: leadsTo.split(',').map((email) => email.trim()),
        subject: `New Estimate Request — ${lead.name}`,
        text: toText(lead),
        html: toHtml(lead),
      })
      console.log('Email sent successfully to:', leadsTo)
    } catch (error) {
      // Log error but don't block lead capture
      console.error('Failed to send email notification:', error)
    }
  } else {
    console.warn('Email notification skipped - missing RESEND_API_KEY or LEADS_EMAIL_TO')
  }

  res.status(200).json({ ok: true })
}
