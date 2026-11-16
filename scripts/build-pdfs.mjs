import { spawn, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function findBrowser() {
  const candidates = [
    process.env.CHROME_BIN,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean)
  const found = candidates.find(p => fs.existsSync(p))
  if (!found) throw new Error('No Chromium/Chrome/Edge executable found for PDF rendering.')
  return found
}

async function renderHtmlToPdf(browserBin, htmlPath, pdfPath, title) {
  const port = 9440 + Math.floor(Math.random() * 400)
  const ud = fs.mkdtempSync(path.join(os.tmpdir(), 'pb-pdf-'))
  const url = 'file:///' + htmlPath.replace(/\\/g, '/')
  const proc = spawn(
    browserBin,
    ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${port}`, `--user-data-dir=${ud}`, url],
    { stdio: 'ignore' }
  )

  try {
    let tab = null
    const baseName = path.basename(htmlPath)
    for (let i = 0; i < 50; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`)
        const tabs = await res.json()
        tab = tabs.find(t => t.type === 'page' && t.url.includes(baseName))
        if (tab) break
      } catch {}
      await new Promise(r => setTimeout(r, 150))
    }
    if (!tab) throw new Error(`Timed out waiting for headless browser tab for ${baseName}`)

    const ws = new WebSocket(tab.webSocketDebuggerUrl)
    await new Promise(r => ws.addEventListener('open', r, { once: true }))

    let nextId = 1
    const send = (method, params = {}) =>
      new Promise(resolve => {
        const id = nextId++
        const onMsg = ev => {
          const msg = JSON.parse(ev.data)
          if (msg.id === id) {
            ws.removeEventListener('message', onMsg)
            resolve(msg)
          }
        }
        ws.addEventListener('message', onMsg)
        ws.send(JSON.stringify({ id, method, params }))
      })

    for (let i = 0; i < 30; i++) {
      const r = await send('Runtime.evaluate', { expression: 'Boolean(window.documentReady)', returnByValue: true })
      if (r.result?.result?.value === true) break
      await new Promise(r => setTimeout(r, 100))
    }

    const layoutResp = await send('Runtime.evaluate', {
      expression: `JSON.stringify([...document.querySelectorAll('.page')].map((p, i) => {
        const cr = p.querySelector('.page-content').getBoundingClientRect();
        const fr = p.querySelector('.footer').getBoundingClientRect();
        const preOverflow = [...p.querySelectorAll('pre')].some(el => el.scrollWidth > el.clientWidth + 1);
        return { page: i + 1, id: p.id, clearancePx: Math.round(fr.top - cr.bottom), horizOverflow: p.scrollWidth > p.clientWidth + 1 || preOverflow };
      }))`,
      returnByValue: true,
    })

    const rows = JSON.parse(layoutResp.result.result.value)
    let minClearance = Infinity
    for (const row of rows) {
      minClearance = Math.min(minClearance, row.clearancePx)
      if (row.clearancePx < 10 || row.horizOverflow) {
        throw new Error(`Layout violation on page ${row.page} (${row.id}): clearance=${row.clearancePx}px, horizOverflow=${row.horizOverflow}`)
      }
    }

    const pdfResp = await send('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    })
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true })
    fs.writeFileSync(pdfPath, Buffer.from(pdfResp.result.data, 'base64'))
    ws.close()

    try {
      execFileSync('python', [
        '-c',
        `import sys, pypdf
p, title = sys.argv[1], sys.argv[2]
r = pypdf.PdfReader(p)
w = pypdf.PdfWriter()
w.append(r)
m = dict(r.metadata or {})
m.update({
  "/Title": title,
  "/Author": "John Luo (@jluocsa) - Enterprise Azure AI Playbooks",
  "/Subject": "Enterprise Architecture White Paper: Prompt caching, prefix architecture, PTU capacity economics, and 7-layer quality governance on GPT-5.6, GPT-6, and GPT-6.1",
  "/Keywords": "Azure OpenAI, Microsoft Foundry, GPT-5.6, GPT-6, GPT-6.1, prompt caching, PTU sizing, stateless agent runtime"
})
w.add_metadata(m)
with open(p, "wb") as f: w.write(f)`,
        pdfPath,
        title,
      ])
    } catch {}

    console.log(`✅ Built ${path.relative(ROOT, pdfPath)} (${rows.length} pages, minClearance=${minClearance}px)`)
  } finally {
    proc.kill()
  }
}

const browserBin = findBrowser()
await renderHtmlToPdf(
  browserBin,
  path.join(ROOT, 'papers-src', 'foundry-prompt-caching-gpt56-whitepaper-v1.0.html'),
  path.join(ROOT, 'docs', 'public', 'papers', 'foundry-prompt-caching-gpt56-whitepaper-v1.0.pdf'),
  'Enterprise Azure AI Playbooks | Model Migration Readiness: Prompt Caching on GPT-5.6+ | White Paper v1.0'
)
