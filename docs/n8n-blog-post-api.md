# n8n Blog Post API

Use this endpoint to create or update blog posts from n8n.

## Endpoint

- `POST /api/blog-post`

## Auth

Set one of these headers in n8n:

- `Authorization: Bearer <N8N_BLOG_API_KEY>`
- `x-api-key: <N8N_BLOG_API_KEY>`

## Required env vars (Vercel)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_BLOG_API_KEY`

Optional:

- `BLOG_IMAGES_BUCKET` (defaults to `blog-images`)
- `BLOG_MIRROR_ICLOUD_URLS` (defaults to `true`; mirrors iCloud CDN URLs to Supabase Storage)
- `BLOG_MIRROR_REMOTE_IMAGES` (defaults to `false`; when `true`, mirrors all remote image URLs to Storage)

## Required body fields

- `title` (string)
- `content` or `text` (string, markdown supported)

## Useful optional fields

- `slug` (string, auto-generated from title if omitted)
- `excerpt` (string, auto-generated if omitted)
- `status` (`draft` or `published`, default `published`)
- `publishedAt` (ISO string)
- `headerImageUrl` (absolute URL or `/relative/path`)
  - aliases: `coverImageUrl`, `featuredImageUrl`
- `headerImageIndex` (index from `images[]`)
- `images` (array) or `image` (single item)
  - URL string, or
  - object with `url`, or
  - object with `base64` + `mimeType` (+ optional `fileName`, `alt`, `isHeader`)
  - object with `dataUrl` (`data:image/...;base64,...`)
- `insertImagesInContent` (boolean, append markdown image tags)
- `useFirstImageAsHeader` (boolean, default `true`)
- `upsert` (boolean, default `true` by slug)
- `persistImagesToLibrary` (boolean, default `true`)
- `linkImagesToPost` (boolean, default `true`)
- `batchKey` (string) for grouping imported photos in DB
- `albumName` / `albumSourceUrl` / `albumToken` / `albumBaseUrl` for photo-source tracking

### Image metadata fields (per `images[]` object)

- `sourceGuid` or `photoGuid`
- `sourceAssetKey`
- `sourceBatchKey`
- `sourceCaption`
- `sourceTakenAt`

## n8n JSON example (URL images)

```json
{
  "title": "Stamped Concrete Patio Trends for 2026",
  "content": "## What Is Trending\n\nHere is this month's update...",
  "status": "published",
  "images": [
    {
      "url": "https://cdn.example.com/patio-hero.jpg",
      "alt": "Stamped patio in Waco",
      "isHeader": true
    },
    {
      "url": "https://cdn.example.com/patio-closeup.jpg",
      "alt": "Close-up texture"
    }
  ],
  "insertImagesInContent": true
}
```

## n8n JSON example (base64 upload)

```json
{
  "title": "How to Repair Surface Cracks in Driveways",
  "text": "Step-by-step overview...",
  "status": "draft",
  "images": [
    {
      "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "mimeType": "image/png",
      "fileName": "repair-guide-header.png",
      "alt": "Driveway crack repair"
    }
  ],
  "headerImageIndex": 0
}
```

## Response

```json
{
  "ok": true,
  "post": {
    "id": "uuid",
    "title": "Post title",
    "slug": "post-title",
    "status": "published",
    "cover_image_url": "https://...",
    "published_at": "2026-02-16T20:14:11.000Z",
    "updated_at": "2026-02-16T20:14:11.000Z"
  },
  "uploadedImages": [
    {
      "url": "https://...",
      "alt": "Optional alt text",
      "uploaded": true
    }
  ],
  "library": {
    "albumId": "uuid",
    "savedPhotoCount": 2,
    "linkedToPost": true
  }
}
```

## Additional automation endpoints

### 1) Sync iCloud album into DB (and optionally auto-create post)

- `POST /api/blog-album-sync`
- Auth: `Authorization: Bearer <admin-supabase-access-token>`

Body example:

```json
{
  "albumId": "optional-existing-album-id",
  "albumUrl": "https://www.icloud.com/sharedalbum/#B1m5oqs3qHsDmRm",
  "autoCreatePost": true,
  "postStatus": "published"
}
```

### 2) Create blog post from selected DB photos

- `POST /api/blog-generate-post`
- Auth: `Authorization: Bearer <admin-supabase-access-token>`
- Requires `OPENAI_API_KEY` in Vercel env.
- Uses model `gpt-5-mini-2025-08-07` and sends the first selected photo URL as image input.

Body example:

```json
{
  "photoIds": ["uuid-1", "uuid-2", "uuid-3"],
  "status": "draft"
}
```
