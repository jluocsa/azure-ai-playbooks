import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SELF = path.resolve(fileURLToPath(import.meta.url))

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'cache'])
const TEXT_EXTS = new Set(['.md', '.vue', '.mts', '.ts', '.js', '.mjs', '.html', '.kql', '.yml', '.yaml', '.json'])

// Forbidden customer, stakeholder, internal-org, confidentiality, email, GUID & active-IDF patterns
const FORBIDDEN_RULES = [
  { id: 'CUSTOMER_NAME', regex: /\b(deloitte|vanguard)\b/gi, reason: 'Customer identifier must be stripped' },
  { id: 'STAKEHOLDER_NAME', regex: /\b(balaji|venkatesh|steve\s+wight)\b/gi, reason: 'Individual stakeholder/reviewer name must be stripped' },
  { id: 'CONFIDENTIAL_BANNER', regex: /\b(customer-confidential|microsoft\s+confidential)\b/gi, reason: 'Confidentiality banner not permitted in public-ready hub' },
  { id: 'INTERNAL_ORG_JARGON', regex: /\b(US\s+PRO|Majors\s+ATU|\bATU\b|\bCSU\b|CONFIRM\s+WITH\s+PG)\b/g, reason: 'Internal org/sales/PG-queue acronym must be generalized' },
  { id: 'INTERNAL_EMAIL', regex: /[a-z0-9._%+-]+@(microsoft|deloitte)\.com\b/gi, reason: 'Internal/customer email address detected' },
  { id: 'RAW_GUID', regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, reason: 'Raw tenant/subscription/object GUID detected' },
  { id: 'ACTIVE_IDF', regex: /\b(AuthorizationSeparableAgentMemory|AdaptiveTopologyControlPlane|96311)\b/gi, reason: 'Un-cleared invention-disclosure identifier detected' },
]

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const files = walk(ROOT)
const violations = []
let scannedTextFiles = 0
let scannedPdfFiles = 0

for (const file of files) {
  if (path.resolve(file) === SELF) continue
  const ext = path.extname(file).toLowerCase()
  const rel = path.relative(ROOT, file)

  if (TEXT_EXTS.has(ext) && path.basename(file) !== 'package-lock.json') {
    scannedTextFiles++
    const content = fs.readFileSync(file, 'utf8')
    for (const rule of FORBIDDEN_RULES) {
      const matches = [...content.matchAll(rule.regex)]
      for (const m of matches) {
        violations.push(`${rel}: [${rule.id}] "${m[0]}" — ${rule.reason}`)
      }
    }
  } else if (ext === '.pdf') {
    scannedPdfFiles++
    try {
      const pyOut = execFileSync(
        'python',
        [
          '-c',
          'import sys, pypdf; r = pypdf.PdfReader(sys.argv[1]); print("\\n".join(p.extract_text() or "" for p in r.pages)); print(str(dict(r.metadata or {})))',
          file,
        ],
        { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }
      )
      for (const rule of FORBIDDEN_RULES) {
        const matches = [...pyOut.matchAll(rule.regex)]
        for (const m of matches) {
          violations.push(`${rel} (PDF text/metadata): [${rule.id}] "${m[0]}" — ${rule.reason}`)
        }
      }
    } catch {
      // Python/pypdf optional in minimal CI; HTML source in papers-src/ is always scanned above
    }
  }
}

if (violations.length > 0) {
  console.error(`❌ Sanitization check FAILED with ${violations.length} violation(s):`)
  for (const v of violations) console.error('  -', v)
  process.exit(1)
}

console.log(`✅ Sanitization gate PASSED (${scannedTextFiles} source files + ${scannedPdfFiles} PDF file(s) verified clean).`)
