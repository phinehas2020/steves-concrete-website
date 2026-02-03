import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

// Extract URLs from text
function extractUrls(text) {
  if (!text) return []
  
  // URL regex pattern - matches http/https URLs
  // Excludes common trailing punctuation that shouldn't be part of the URL
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g
  const matches = text.match(urlRegex)
  if (!matches) return []
  
  // Clean up trailing punctuation from URLs
  return matches.map(url => {
    // Remove trailing punctuation that's likely not part of the URL
    return url.replace(/[.,;:!?]+$/, '')
  })
}

// Fetch link preview metadata
async function fetchLinkPreview(url) {
  try {
    const response = await fetch('/api/link-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch preview: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching link preview:', error)
    return null
  }
}

function LinkPreviewCard({ preview, url }) {
  if (!preview) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <ExternalLink className="size-4" />
          <span className="truncate">{url}</span>
        </div>
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-300 transition-colors bg-white"
    >
      {preview.image && (
        <div className="w-full h-48 bg-stone-100 overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title || ''}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <ExternalLink className="size-4 text-stone-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-500 mb-1 truncate">
              {preview.siteName}
            </p>
            <h4 className="font-semibold text-stone-900 text-sm mb-1 line-clamp-2">
              {preview.title}
            </h4>
            {preview.description && (
              <p className="text-sm text-stone-600 line-clamp-2">
                {preview.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}

export function LinkPreview({ text }) {
  const [previews, setPreviews] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const urls = extractUrls(text)
    
    if (urls.length === 0) {
      setLoading(false)
      return
    }

    // Fetch previews for all URLs
    Promise.all(
      urls.map(async (url) => {
        const preview = await fetchLinkPreview(url)
        return { url, preview }
      })
    ).then((results) => {
      const previewMap = {}
      results.forEach(({ url, preview }) => {
        previewMap[url] = preview
      })
      setPreviews(previewMap)
      setLoading(false)
    })
  }, [text])

  const urls = extractUrls(text)

  if (urls.length === 0) {
    // No URLs found, return plain text
    return <span className="whitespace-pre-wrap">{text}</span>
  }

  // Split text by URLs and render with preview cards
  const parts = []
  let lastIndex = 0

  // Find original URLs in text (before cleaning)
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g
  let match
  const urlMatches = []
  
  // Reset regex lastIndex
  urlRegex.lastIndex = 0
  while ((match = urlRegex.exec(text)) !== null) {
    urlMatches.push({
      original: match[0],
      cleaned: match[0].replace(/[.,;:!?]+$/, ''),
      index: match.index,
    })
  }

  urlMatches.forEach((urlMatch) => {
    // Add text before URL
    if (urlMatch.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, urlMatch.index),
      })
    }

    // Add URL preview (use cleaned URL for fetching, but display original)
    parts.push({
      type: 'link',
      url: urlMatch.cleaned, // Use cleaned URL for the preview
      originalUrl: urlMatch.original, // Keep original for display if needed
    })

    lastIndex = urlMatch.index + urlMatch.original.length
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
    })
  }

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          // Preserve whitespace and line breaks
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part.content}
            </span>
          )
        }
        
        return (
          <div key={index}>
            {loading && !previews[part.url] ? (
              <div className="p-4 border border-stone-200 rounded-lg bg-stone-50 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
              </div>
            ) : (
              <LinkPreviewCard 
                preview={previews[part.url]} 
                url={part.url} 
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
