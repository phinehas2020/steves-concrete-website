import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const DEFAULT_SITEMAP = 'public/sitemap.xml'
const DEFAULT_OUTPUT = 'reports/mobile-render-sweep.json'
const VIEWPORT = { width: 375, height: 812 }
const DEBUG_PORT = 9223

function getArg(name, fallback = '') {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : fallback
}

async function readSitemapUrls(sitemapPath) {
  const xml = await fs.readFile(sitemapPath, 'utf8')
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function findChrome() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ]
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }
  throw new Error('Could not find Google Chrome or Chromium in /Applications.')
}

async function waitForJsonVersion() {
  const endpoint = `http://127.0.0.1:${DEBUG_PORT}/json/version`
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(endpoint)
      if (response.ok) return response.json()
    } catch {
      // Chrome is still booting.
    }
    await delay(250)
  }
  throw new Error('Chrome DevTools endpoint did not become ready.')
}

async function createTarget(url = 'about:blank') {
  const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent(url)}`, {
    method: 'PUT',
  })
  if (!response.ok) {
    throw new Error(`Failed to create Chrome target: ${response.status}`)
  }
  return response.json()
}

function createCdpClient(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl)
  let nextId = 1
  const pending = new Map()
  const listeners = new Map()

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
      return
    }
    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) listener(message.params || {})
    }
  })

  return {
    async ready() {
      if (ws.readyState === WebSocket.OPEN) return
      await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve, { once: true })
        ws.addEventListener('error', reject, { once: true })
      })
    },
    send(method, params = {}) {
      const id = nextId
      nextId += 1
      ws.send(JSON.stringify({ id, method, params }))
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
      })
    },
    on(method, listener) {
      if (!listeners.has(method)) listeners.set(method, new Set())
      listeners.get(method).add(listener)
    },
    close() {
      ws.close()
    },
  }
}

async function inspectUrl(url) {
  const target = await createTarget()
  const client = createCdpClient(target.webSocketDebuggerUrl)
  const consoleErrors = []
  const pageErrors = []
  let documentStatus = 0
  let loadFired = false

  try {
    await client.ready()
    client.on('Runtime.consoleAPICalled', (event) => {
      if (event.type === 'error') {
        consoleErrors.push(event.args?.map((arg) => arg.value || arg.description || '').join(' '))
      }
    })
    client.on('Runtime.exceptionThrown', (event) => {
      pageErrors.push(event.exceptionDetails?.text || event.exceptionDetails?.exception?.description || 'Runtime exception')
    })
    client.on('Network.responseReceived', (event) => {
      if (event.type === 'Document') documentStatus = event.response?.status || documentStatus
    })
    client.on('Page.loadEventFired', () => {
      loadFired = true
    })

    await client.send('Page.enable')
    await client.send('Runtime.enable')
    await client.send('Network.enable')
    await client.send('Log.enable')
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: 2,
      mobile: true,
    })
    await client.send('Emulation.setTouchEmulationEnabled', { enabled: true })
    await client.send('Network.setUserAgentOverride', {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    })

    await client.send('Page.navigate', { url })
    for (let attempt = 0; attempt < 160 && !loadFired; attempt += 1) {
      await delay(250)
    }
    await delay(1000)

    const evaluation = await client.send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(() => {
        return (async () => {
          const doc = document.documentElement;
          const body = document.body;
          const clientWidth = doc.clientWidth;
          const scrollWidth = Math.max(doc.scrollWidth, body ? body.scrollWidth : 0);
          const overflowX = Math.max(0, scrollWidth - clientWidth);
          const maxScrollY = Math.max(0, doc.scrollHeight - window.innerHeight);
          const scrollPositions = Array.from(new Set([
            0,
            Math.round(maxScrollY / 2),
            maxScrollY,
          ]));

          function shortClassName(element) {
            return typeof element.className === 'string'
              ? element.className.split(/\\s+/).filter(Boolean).slice(0, 4).join(' ')
              : '';
          }

          function isUserVisible(element, rect) {
            if (element.closest('[aria-hidden="true"]')) return false;
            if (rect.bottom <= 0 || rect.top >= window.innerHeight) return false;
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            if (Number(style.opacity) === 0) return false;
            if (style.pointerEvents === 'none') return false;
            return true;
          }

          const samples = [];
          for (const scrollY of scrollPositions) {
            window.scrollTo(0, scrollY);
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const viewportWidth = window.innerWidth;
            const offViewportElements = Array.from(document.body.querySelectorAll('*'))
              .map((element) => {
                const rect = element.getBoundingClientRect();
                if (!rect.width || !rect.height || !isUserVisible(element, rect)) return null;
                const leftOverflow = rect.left < -1;
                const rightOverflow = rect.right > viewportWidth + 1;
                if (!leftOverflow && !rightOverflow) return null;
                return {
                  tag: element.tagName.toLowerCase(),
                  id: element.id || '',
                  className: shortClassName(element),
                  top: Math.round(rect.top),
                  bottom: Math.round(rect.bottom),
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                };
              })
              .filter(Boolean)
              .slice(0, 10);
            samples.push({ scrollY, offViewportElements });
          }

          window.scrollTo(0, 0);
          return {
            title: document.title,
            h1: document.querySelector('h1')?.textContent?.trim() || '',
            clientWidth,
            scrollWidth,
            overflowX,
            samples,
            offViewportElements: samples.flatMap((sample) =>
              sample.offViewportElements.map((element) => ({ ...element, scrollY: sample.scrollY })),
            ).slice(0, 10),
          };
        })();
      })()`,
    })

    const inspection = evaluation.result?.value || {}
    const pass =
      documentStatus >= 200 &&
      documentStatus < 400 &&
      inspection.overflowX === 0 &&
      inspection.offViewportElements?.length === 0 &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0

    return {
      url,
      status: documentStatus,
      pass,
      consoleErrors,
      pageErrors,
      ...inspection,
    }
  } catch (error) {
    return {
      url,
      status: documentStatus,
      pass: false,
      consoleErrors,
      pageErrors,
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    client.close()
  }
}

async function run() {
  const sitemapPath = getArg('sitemap', DEFAULT_SITEMAP)
  const outputPath = getArg('output', DEFAULT_OUTPUT)
  const urls = await readSitemapUrls(sitemapPath)
  const chromePath = await findChrome()
  const userDataDir = path.join(process.cwd(), '.tmp-mobile-render-chrome')

  await fs.rm(userDataDir, { recursive: true, force: true })
  await fs.mkdir(userDataDir, { recursive: true })

  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], {
    stdio: 'ignore',
  })

  try {
    await waitForJsonVersion()
    const results = []
    for (const url of urls) {
      const result = await inspectUrl(url)
      results.push(result)
      const pathName = new URL(url).pathname
      const status = result.pass ? 'PASS' : 'FAIL'
      const details = [
        `status=${result.status}`,
        `overflowX=${result.overflowX ?? 'n/a'}`,
        `offViewport=${result.offViewportElements?.length ?? 'n/a'}`,
        `consoleErrors=${result.consoleErrors?.length ?? 0}`,
        `pageErrors=${result.pageErrors?.length ?? 0}`,
      ].join(' ')
      console.log(`${status} ${pathName} ${details}`)
    }

    const report = {
      generatedAt: new Date().toISOString(),
      viewport: VIEWPORT,
      sitemapPath,
      urlCount: urls.length,
      passCount: results.filter((result) => result.pass).length,
      failCount: results.filter((result) => !result.pass).length,
      results,
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`)
    process.exitCode = report.failCount > 0 ? 1 : 0
  } finally {
    chrome.kill()
    await fs.rm(userDataDir, { recursive: true, force: true })
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
