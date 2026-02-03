// API endpoint to fetch link preview metadata
// This avoids CORS issues when fetching from client-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { url } = req.body

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required' })
    return
  }

  // Validate URL format
  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    res.status(400).json({ error: 'Invalid URL format' })
    return
  }

  // Only allow http/https URLs
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    res.status(400).json({ error: 'Only HTTP/HTTPS URLs are allowed' })
    return
  }

  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      res.status(response.status).json({ 
        error: `Failed to fetch URL: ${response.statusText}` 
      })
      return
    }

    const html = await response.text()

    // Extract metadata using regex (simple approach)
    // In production, you might want to use a proper HTML parser
    const extractMeta = (property) => {
      // Try Open Graph first
      const ogRegex = new RegExp(
        `<meta\\s+property=["']og:${property}["']\\s+content=["']([^"']+)["']`,
        'i'
      )
      const ogMatch = html.match(ogRegex)
      if (ogMatch) return ogMatch[1]

      // Fallback to standard meta tags
      const metaRegex = new RegExp(
        `<meta\\s+(?:name|property)=["']${property}["']\\s+content=["']([^"']+)["']`,
        'i'
      )
      const metaMatch = html.match(metaRegex)
      if (metaMatch) return metaMatch[1]

      return null
    }

    // Extract title
    let title = extractMeta('title')
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      title = titleMatch ? titleMatch[1].trim() : null
    }

    // Extract description
    let description = extractMeta('description')

    // Extract image
    let image = extractMeta('image')
    // Make image URL absolute if it's relative
    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, url).href
      } catch {
        image = null
      }
    }

    // Extract site name
    const siteName = extractMeta('site_name') || parsedUrl.hostname

    res.status(200).json({
      url,
      title: title || parsedUrl.hostname,
      description: description || null,
      image: image || null,
      siteName,
    })
  } catch (error) {
    console.error('Error fetching link preview:', error)
    res.status(500).json({ 
      error: 'Failed to fetch link preview',
      message: error.message 
    })
  }
}
