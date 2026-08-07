const FALLBACK_AUTHOR = 'SLA Concrete Works LLC'

function cleanPublicText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

export function getPublicBlogEditorialMeta(post = {}) {
  const authorName = cleanPublicText(post.author_name ?? post.authorName)

  return {
    authorName: authorName || FALLBACK_AUTHOR,
    authorType: authorName ? 'Person' : 'Organization',
    reviewedBy: cleanPublicText(post.reviewed_by ?? post.reviewedBy),
    reviewedAt: cleanPublicText(post.reviewed_at ?? post.reviewedAt),
    sourceSummary: cleanPublicText(post.source_summary ?? post.sourceSummary),
    projectSeriesId: cleanPublicText(post.project_series_id ?? post.projectSeriesId),
    seriesPhase: cleanPublicText(post.series_phase ?? post.seriesPhase),
  }
}

export { FALLBACK_AUTHOR }
