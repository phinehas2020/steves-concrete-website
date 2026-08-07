import { next } from '@vercel/functions'
import {
  blogIndexingResponseHeaders,
  resolveBlogRequestIndexing,
} from './src/data/blogRequestIndexing.js'

export const config = {
  matcher: '/blog/:slug',
  runtime: 'edge',
}

export default async function blogIndexingMiddleware(request) {
  const requestUrl = new URL(request.url)
  const state = await resolveBlogRequestIndexing(requestUrl.pathname, {
    manifestUrl: requestUrl,
  })
  return next({ headers: blogIndexingResponseHeaders(state) })
}
