import { marked } from 'marked'

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])
const SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/
const BLOCKED_EMBED_TAGS_PATTERN =
  /<(script|style|iframe|object|embed|svg|math)\b[\s\S]*?<\/\1>/gi
const BLOCKED_SINGLE_TAG_PATTERN = /<(script|style|iframe|object|embed|svg|math)\b[^>]*\/?>/gi
const HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->/g
const REFERENCE_LINK_DEFINITION_PATTERN = /^\s*\[[^\]]+\]:\s*\S+\s*$/gim
const INLINE_LINK_PATTERN = /\[([^\]]+)\]\(((?:[^()\s]+|\([^()]*\))+)\)/g
const INLINE_IMAGE_PATTERN = /!\[([^\]]*)\]\(((?:[^()\s]+|\([^()]*\))+)\)/g

export function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripControlCharacters(value) {
  return Array.from(String(value || ''))
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')
}

export function sanitizePlainTextInline(value, maxLength = null) {
  let text = stripControlCharacters(value)
    .replace(BLOCKED_EMBED_TAGS_PATTERN, ' ')
    .replace(BLOCKED_SINGLE_TAG_PATTERN, ' ')
    .replace(HTML_COMMENT_PATTERN, ' ')
    .replace(/<((?:https?:\/\/|mailto:|tel:)[^>]+)>/gi, '$1')
    .replace(INLINE_IMAGE_PATTERN, '$1')
    .replace(/!\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(INLINE_LINK_PATTERN, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(REFERENCE_LINK_DEFINITION_PATTERN, ' ')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/[\\*_~[\]<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) return ''
  if (!Number.isFinite(maxLength) || maxLength <= 0 || text.length <= maxLength) {
    return text
  }

  if (maxLength <= 3) {
    return text.slice(0, maxLength)
  }

  return `${text.slice(0, maxLength - 3).trim()}...`
}

export function sanitizePlainTextParagraph(value) {
  let paragraph = sanitizePlainTextInline(value)
    .replace(/[—–]/g, '-')
    .replace(/\s*--+\s*/g, ' ')
    .replace(/#+\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!paragraph) return ''

  if (!/[.!?]$/.test(paragraph)) {
    paragraph = `${paragraph}.`
  }

  return paragraph
}

export function normalizeSafeUrl(value) {
  const rawValue = String(value || '').trim()
  if (!rawValue) return null

  const protocolProbe = stripControlCharacters(rawValue).replace(/\s+/g, '')
  if (!protocolProbe || protocolProbe.startsWith('//')) {
    return null
  }

  if (SCHEME_PATTERN.test(protocolProbe)) {
    try {
      const parsed = new URL(protocolProbe)
      if (!SAFE_URL_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
        return null
      }
    } catch {
      return null
    }
  }

  try {
    return encodeURI(rawValue).replace(/%25/g, '%')
  } catch {
    return null
  }
}

export function toSafeMarkdownImageUrl(value) {
  const safeUrl = normalizeSafeUrl(value)
  if (!safeUrl) return null

  return safeUrl.replace(/\(/g, '%28').replace(/\)/g, '%29')
}

function createSafeRenderer() {
  const renderer = new marked.Renderer()

  renderer.html = (html) => escapeHtml(sanitizePlainTextInline(html))

  renderer.link = (href, title, text) => {
    const safeHref = normalizeSafeUrl(href)
    if (!safeHref) {
      return text
    }

    const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
    const relAttr = /^https?:/i.test(safeHref) ? ' rel="noreferrer noopener"' : ''

    return `<a href="${escapeHtml(safeHref)}"${titleAttr}${relAttr}>${text}</a>`
  }

  renderer.image = (href, title, text) => {
    const safeHref = normalizeSafeUrl(href)
    if (!safeHref) {
      return escapeHtml(text)
    }

    const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''

    return `<img src="${escapeHtml(safeHref)}" alt="${escapeHtml(text)}"${titleAttr}>`
  }

  return renderer
}

export function renderBlogMarkdown(markdown) {
  const rendered = marked.parse(String(markdown || ''), {
    renderer: createSafeRenderer(),
  })

  return typeof rendered === 'string' ? rendered : ''
}
