import { useEffect, useState } from 'react'

export const FALLBACK_GOOGLE_REVIEW_URL =
  'https://www.google.com/maps/place/SLA+Concrete+Works/@31.6637838,-97.1149261,17z/data=!3m1!4b1!4m6!3m5!1s0x864f83d5fc2728cf:0x92d8085e5a37fa64!8m2!3d31.6637793!4d-97.1123512!16s%2Fg%2F11gf0qs4j0?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D'

const INITIAL_STATE = {
  status: 'loading',
  source: 'fallback',
  reviews: [],
  placeId: '',
  placeName: '',
  rating: null,
  userRatingCount: null,
  placeUri: '',
  reviewUri: '',
  writeReviewUri: '',
  fetchedAt: '',
}

function readText(value) {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value.text === 'string') return value.text.trim()
  return ''
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function formatPublishedDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function normalizeReview(review, index) {
  const authorAttribution = review?.authorAttribution || {}
  const authorName =
    readText(authorAttribution.displayName) ||
    readText(authorAttribution.name) ||
    `Google reviewer ${index + 1}`
  const publishTime =
    typeof review?.publishTime === 'string'
      ? review.publishTime
      : typeof review?.publishedAt === 'string'
        ? review.publishedAt
        : ''
  const relativePublishTimeDescription =
    readText(review?.relativePublishTimeDescription) || formatPublishedDate(publishTime)

  return {
    id: `google-review-${index}-${authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    authorName,
    authorUri: authorAttribution.uri || '',
    authorPhotoUri: authorAttribution.photoUri || authorAttribution.photoURI || '',
    text: readText(review?.text) || readText(review?.originalText),
    rating: toNumber(review?.rating) || 5,
    publishTime,
    relativePublishTimeDescription,
    googleMapsUri: review?.googleMapsUri || '',
  }
}

function shapeResponse(payload, limit) {
  const reviews = Array.isArray(payload?.reviews)
    ? payload.reviews.map(normalizeReview).filter((review) => review.text).slice(0, limit)
    : []

  return {
    status: 'ready',
    source: 'google',
    reviews,
    placeId: payload?.placeId || '',
    placeName: payload?.placeName || '',
    rating: toNumber(payload?.rating),
    userRatingCount: toNumber(payload?.userRatingCount),
    placeUri: payload?.placeUri || payload?.googleMapsUri || '',
    reviewUri: payload?.reviewUri || payload?.placeUri || payload?.googleMapsUri || '',
    writeReviewUri:
      payload?.writeReviewUri ||
      payload?.reviewUri ||
      payload?.placeUri ||
      payload?.googleMapsUri ||
      '',
    fetchedAt: payload?.fetchedAt || '',
  }
}

export function useGoogleReviews(limit = 5) {
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(Math.round(limit), 1), 10)
    : 5
  const [state, setState] = useState(INITIAL_STATE)

  useEffect(() => {
    let cancelled = false

    setState((current) => ({
      ...current,
      status: 'loading',
    }))

    async function loadReviews() {
      try {
        const response = await fetch(`/api/google-reviews?limit=${safeLimit}`)
        const payload = await response.json().catch(() => null)

        if (!cancelled && response.ok && payload?.ok) {
          const nextState = shapeResponse(payload, safeLimit)
          if (nextState.reviews.length > 0) {
            setState(nextState)
            return
          }
        }
      } catch {
        // The UI keeps local fallback reviews when the live request is unavailable.
      }

      if (!cancelled) {
        setState((current) => ({
          ...current,
          status: 'unavailable',
        }))
      }
    }

    loadReviews()

    return () => {
      cancelled = true
    }
  }, [safeLimit])

  return state
}
