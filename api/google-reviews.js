const PLACES_API_BASE = 'https://places.googleapis.com/v1'

function envString(name, fallback = '') {
  const value = process.env[name]
  if (typeof value !== 'string') return fallback

  const trimmed = value
    .replace(/\\[nrt]/g, '')
    .replace(/[\0\r\n]/g, '')
    .trim()

  return trimmed.length > 0 ? trimmed : fallback
}

function readText(value) {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value.text === 'string') return value.text.trim()
  return ''
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return parsed
}

function cacheResponse(res, value) {
  res.setHeader('Cache-Control', value)
}

async function requestGoogle(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15000),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Google Places request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}

async function resolvePlace({ apiKey, placeId, placeQuery, languageCode, regionCode }) {
  if (placeId) {
    return { placeId, placeName: '', formattedAddress: '' }
  }

  if (!placeQuery) {
    throw new Error('Missing GOOGLE_PLACE_ID or GOOGLE_PLACE_QUERY.')
  }

  const searchPayload = {
    textQuery: placeQuery,
    languageCode,
    maxResultCount: 1,
  }

  if (regionCode) {
    searchPayload.regionCode = regionCode
  }

  const result = await requestGoogle(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify(searchPayload),
  })

  const place = Array.isArray(result.places) ? result.places[0] : null
  if (!place?.id) {
    throw new Error('Google Places could not find a business profile for the configured query.')
  }

  return {
    placeId: place.id,
    placeName: readText(place.displayName),
    formattedAddress: place.formattedAddress || '',
  }
}

async function fetchPlaceDetails({ apiKey, placeId, languageCode, regionCode }) {
  const params = new URLSearchParams()
  if (languageCode) params.set('languageCode', languageCode)
  if (regionCode) params.set('regionCode', regionCode)

  const queryString = params.toString()
  const url = `${PLACES_API_BASE}/places/${placeId}${queryString ? `?${queryString}` : ''}`

  return requestGoogle(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,googleMapsUri,googleMapsLinks,rating,userRatingCount,reviews',
    },
  })
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const apiKey = envString('GOOGLE_PLACES_API_KEY')
  const configuredPlaceId = envString('GOOGLE_PLACE_ID')
  const configuredPlaceQuery = envString('GOOGLE_PLACE_QUERY')
  const languageCode = envString('GOOGLE_REVIEWS_LANGUAGE_CODE', 'en')
  const regionCode = envString('GOOGLE_REVIEWS_REGION_CODE', 'US')
  const limit = Math.min(toPositiveInt(req.query?.limit, 5), 10)

  if (!apiKey) {
    cacheResponse(res, 'public, max-age=60, s-maxage=60')
    res.status(200).json({
      ok: false,
      reason: 'missing_api_key',
      message: 'Set GOOGLE_PLACES_API_KEY to enable live Google reviews.',
    })
    return
  }

  if (!configuredPlaceId && !configuredPlaceQuery) {
    cacheResponse(res, 'public, max-age=60, s-maxage=60')
    res.status(200).json({
      ok: false,
      reason: 'missing_place_config',
      message: 'Set GOOGLE_PLACE_ID or GOOGLE_PLACE_QUERY to connect the business profile.',
    })
    return
  }

  try {
    const place = await resolvePlace({
      apiKey,
      placeId: configuredPlaceId,
      placeQuery: configuredPlaceQuery,
      languageCode,
      regionCode,
    })

    const details = await fetchPlaceDetails({
      apiKey,
      placeId: place.placeId,
      languageCode,
      regionCode,
    })

    const googleMapsLinks = details.googleMapsLinks || {}
    const reviews = Array.isArray(details.reviews) ? details.reviews.slice(0, limit) : []

    cacheResponse(res, 'public, max-age=0, s-maxage=21600, stale-while-revalidate=86400')
    res.status(200).json({
      ok: true,
      source: 'google',
      placeId: details.id || place.placeId,
      placeName: readText(details.displayName) || place.placeName,
      formattedAddress: details.formattedAddress || place.formattedAddress,
      rating: typeof details.rating === 'number' ? details.rating : null,
      userRatingCount:
        typeof details.userRatingCount === 'number' ? details.userRatingCount : null,
      googleMapsUri: details.googleMapsUri || '',
      placeUri: googleMapsLinks.placeUri || details.googleMapsUri || '',
      reviewUri: googleMapsLinks.reviewsUri || details.googleMapsUri || '',
      writeReviewUri:
        googleMapsLinks.writeAReviewUri ||
        googleMapsLinks.reviewsUri ||
        details.googleMapsUri ||
        '',
      reviews,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error)
    cacheResponse(res, 'public, max-age=60, s-maxage=60')
    res.status(200).json({
      ok: false,
      reason: 'google_fetch_failed',
      message: error instanceof Error ? error.message : 'Failed to load Google reviews.',
    })
  }
}
