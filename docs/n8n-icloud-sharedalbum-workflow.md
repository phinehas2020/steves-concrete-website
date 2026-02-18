# n8n iCloud Shared Album Workflow (Hardcoded)

This workflow runs every 10 minutes, groups photos into batches using caption boundaries, generates a small update from the comment, deduplicates low/high image variants, and publishes to `/api/blog-post`.

## Import JSON

```json
{
  "name": "iCloud Shared Album -> Blog (Hardcoded, No Fetch)",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "minutesInterval": 10
            }
          ]
        }
      },
      "id": "trg-10m-1",
      "name": "Every 10 Minutes",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [
        200,
        300
      ]
    },
    {
      "parameters": {
        "jsCode": "const albumUrl = 'https://www.icloud.com/sharedalbum/#B1m5oqs3qHsDmRm';\n\nconst token = (() => {\n  const raw = String(albumUrl || '').trim();\n  if (!raw) throw new Error('Missing album URL');\n  if (raw.includes('#')) return raw.split('#').pop().trim();\n  return raw;\n})();\n\nif (!token) {\n  throw new Error('Could not parse iCloud shared album token');\n}\n\n// Pinned host from iCloud 330 redirect response\nconst baseUrl = `https://p110-sharedstreams.icloud.com/${token}/sharedstreams/`;\n\nreturn [{ json: { token, baseUrl } }];\n"
      },
      "id": "code-prepare-base-1",
      "name": "Prepare iCloud Base",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        420,
        300
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{$json.baseUrl + \"webstream\"}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "User-Agent",
              "value": "n8n-icloud-blog-sync"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\"streamCtag\": null}",
        "options": {}
      },
      "id": "http-webstream-1",
      "name": "Fetch Webstream",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        640,
        300
      ]
    },
    {
      "parameters": {
        "jsCode": "const parseDate = (value) => {\n  const t = Date.parse(String(value || ''));\n  return Number.isNaN(t) ? 0 : t;\n};\n\nconst shortText = (value, max = 160) => {\n  const clean = String(value || '').replace(/\\s+/g, ' ').trim();\n  if (clean.length <= max) return clean;\n  return `${clean.slice(0, max - 3).trim()}...`;\n};\n\nconst photos = Array.isArray($json.photos) ? $json.photos : [];\nif (!photos.length) {\n  return [];\n}\n\nphotos.sort((a, b) => {\n  const aTs = parseDate(a.batchDateCreated || a.dateCreated);\n  const bTs = parseDate(b.batchDateCreated || b.dateCreated);\n  return aTs - bTs;\n});\n\nconst batches = [];\nlet currentBatch = null;\n\nfor (const photo of photos) {\n  const caption = String(photo.caption || '').trim();\n\n  if (caption) {\n    if (currentBatch && currentBatch.photos.length) {\n      batches.push(currentBatch);\n    }\n\n    currentBatch = {\n      caption,\n      photos: [photo],\n    };\n  } else if (currentBatch) {\n    currentBatch.photos.push(photo);\n  }\n}\n\nif (currentBatch && currentBatch.photos.length) {\n  batches.push(currentBatch);\n}\n\nif (!batches.length) {\n  return [];\n}\n\nconst newestBatch = batches[batches.length - 1];\nconst photoGuids = newestBatch.photos.map((p) => p.photoGuid).filter(Boolean);\nif (!photoGuids.length) {\n  return [];\n}\n\nconst batchKey = `${photoGuids[0]}:${photoGuids[photoGuids.length - 1]}:${photoGuids.length}`;\nconst state = $getWorkflowStaticData('global');\nstate.processedBatchKeys = state.processedBatchKeys || {};\nif (state.processedBatchKeys[batchKey]) {\n  return [];\n}\n\nconst lines = String(newestBatch.caption || '')\n  .split('\\n')\n  .map((line) => line.trim())\n  .filter(Boolean);\n\nconst createdAt = newestBatch.photos[0]?.batchDateCreated || newestBatch.photos[0]?.dateCreated || new Date().toISOString();\nconst createdDate = createdAt.slice(0, 10);\n\nreturn [\n  {\n    json: {\n      baseUrl: $('Prepare iCloud Base').first().json.baseUrl,\n      photoGuids,\n      batchKey,\n      comment: newestBatch.caption || '',\n      title: shortText(lines[0] || `Project Update ${createdDate}`, 95),\n      excerpt: shortText(lines.join(' '), 170),\n      detailText: lines.slice(1).join('\\n\\n') || 'New photo batch from the field.',\n      createdDate,\n    },\n  },\n];\n"
      },
      "id": "code-build-batch-1",
      "name": "Build Newest Batch",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        860,
        300
      ]
    },
    {
      "parameters": {
        "jsCode": "const meta = $json;\nconst raw = String(meta.comment || meta.detailText || '').trim().replace(/\\s+/g, ' ');\nconst smallUpdate = raw\n  ? `Quick field update: ${raw.slice(0, 280)}${raw.length > 280 ? '...' : ''}`\n  : 'Quick field update: New project photo batch uploaded from the job site.';\n\nreturn [{ json: { ...meta, smallUpdate } }];\n"
      },
      "id": "code-generate-update-1",
      "name": "Generate Small Update",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1080,
        300
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{$json.baseUrl + \"webasseturls\"}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "User-Agent",
              "value": "n8n-icloud-blog-sync"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { \"photoGuids\": $json.photoGuids } }}",
        "options": {}
      },
      "id": "http-assets-1",
      "name": "Fetch Asset URLs",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1300,
        300
      ]
    },
    {
      "parameters": {
        "jsCode": "const slugify = (value) =>\n  String(value || '')\n    .toLowerCase()\n    .trim()\n    .replace(/[^a-z0-9]+/g, '-')\n    .replace(/(^-|-$)+/g, '') || 'project-update';\n\nconst normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');\n\nconst meta = $('Generate Small Update').first().json;\nconst response = $json.body ?? $json;\nconst rawItems = response.items || {};\n\nconst entries = Object.entries(rawItems).map(([k, v]) => ({\n  key: k,\n  nkey: normalize(k),\n  item: v\n}));\n\nconst buildUrl = (item) => {\n  const loc = String(item?.url_location || '').trim();\n  const path = String(item?.url_path || '').trim();\n  if (!loc || !path) return null;\n  const host = /^https?:\\/\\//i.test(loc) ? loc : `https://${loc}`;\n  return `${host}${path}`;\n};\n\nconst scorePath = (url) => {\n  let s = url.length;\n  if (/thumb|small|preview|poster/i.test(url)) s -= 1000;\n  if (/full|orig|original|master|large|high/i.test(url)) s += 400;\n  return s;\n};\n\nconst findItemForGuid = (guid) => {\n  const ng = normalize(guid);\n  let hit = entries.find((e) => e.nkey === ng);\n  if (!hit) hit = entries.find((e) => e.nkey.includes(ng) || ng.includes(e.nkey));\n  return hit?.item || null;\n};\n\nlet candidates = (meta.photoGuids || [])\n  .map((guid, idx) => {\n    const item = findItemForGuid(guid);\n    const url = buildUrl(item);\n    if (!url) return null;\n    return { idx, url, score: scorePath(url) };\n  })\n  .filter(Boolean);\n\nif (!candidates.length) {\n  candidates = entries\n    .map((e, idx) => {\n      const url = buildUrl(e.item);\n      if (!url) return null;\n      return { idx, url, score: scorePath(url) };\n    })\n    .filter(Boolean);\n}\n\nif (!candidates.length) {\n  throw new Error('No image URLs could be built from asset response');\n}\n\nconst bestByUrl = new Map();\nfor (const c of candidates) {\n  const prev = bestByUrl.get(c.url);\n  if (!prev || c.score > prev.score) bestByUrl.set(c.url, c);\n}\n\nconst images = Array.from(bestByUrl.values())\n  .sort((a, b) => a.idx - b.idx)\n  .map((c, i) => ({\n    url: c.url,\n    alt: `Project photo ${i + 1}`,\n    isHeader: i === 0\n  }));\n\nif (!images.length) throw new Error('No image URLs remained after dedupe');\n\nconst bodyImageMarkdown = images\n  .slice(1)\n  .map((img) => `![${img.alt}](${img.url})`)\n  .join('\\n\\n');\n\nconst content = [\n  meta.smallUpdate || meta.detailText,\n  `Photos in this batch: ${images.length}`,\n  bodyImageMarkdown\n].filter(Boolean).join('\\n\\n');\n\nconst payload = {\n  title: meta.title,\n  slug: `icloud-batch-${slugify(meta.batchKey)}`,\n  excerpt: meta.excerpt,\n  content,\n  status: 'published',\n  images,\n  headerImageIndex: 0,\n  insertImagesInContent: false,\n  upsert: true,\n  authorEmail: 'n8n@automation'\n};\n\nreturn [{ json: { payload, batchKey: meta.batchKey } }];\n"
      },
      "id": "code-build-payload-1",
      "name": "Build Blog Payload",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1520,
        300
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://www.concretewaco.com/api/blog-post",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 95a1166eacf030345f82b8f806d2b5b9b97f661e85c9785a36d4fb023c2441e0"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{$json.payload}}",
        "options": {}
      },
      "id": "http-publish-1",
      "name": "Publish Blog Post",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1740,
        300
      ]
    },
    {
      "parameters": {
        "jsCode": "const state = $getWorkflowStaticData('global');\nstate.processedBatchKeys = state.processedBatchKeys || {};\n\nconst batchKey = $('Build Blog Payload').first().json.batchKey;\nstate.processedBatchKeys[batchKey] = new Date().toISOString();\n\nreturn [{ json: { ok: true, batchKey, publishResult: $json } }];\n"
      },
      "id": "code-mark-done-1",
      "name": "Mark Batch Processed",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1960,
        300
      ]
    }
  ],
  "connections": {
    "Every 10 Minutes": {
      "main": [
        [
          {
            "node": "Prepare iCloud Base",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare iCloud Base": {
      "main": [
        [
          {
            "node": "Fetch Webstream",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch Webstream": {
      "main": [
        [
          {
            "node": "Build Newest Batch",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Build Newest Batch": {
      "main": [
        [
          {
            "node": "Generate Small Update",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Small Update": {
      "main": [
        [
          {
            "node": "Fetch Asset URLs",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch Asset URLs": {
      "main": [
        [
          {
            "node": "Build Blog Payload",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Build Blog Payload": {
      "main": [
        [
          {
            "node": "Publish Blog Post",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Publish Blog Post": {
      "main": [
        [
          {
            "node": "Mark Batch Processed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true
  }
}
```
