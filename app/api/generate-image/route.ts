/**
 * Image generation for the Studio "Generate image" button.
 * Calls the Higgsfield Soul text-to-image API server-side so credentials
 * never reach the browser.
 *
 *   POST /api/generate-image   { prompt, size, quality }  -> { jobSetId }
 *   GET  /api/generate-image?jobSetId=...                 -> { status } |
 *                                        { status:'completed', image, contentType }
 *
 * Env: HF_API_KEY, HF_SECRET (Higgsfield API key + secret).
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HF_BASE = 'https://platform.higgsfield.ai'
const ALLOWED_SIZES = new Set([
  '2048x1152', '2048x1536', '1152x2048', '1536x2048', '1536x1536', '1536x1152', '1152x1536',
])

function creds() {
  const key = process.env.HF_API_KEY
  const secret = process.env.HF_SECRET
  if (!key || !secret) return null
  return {key, secret}
}

function hfError(status: number, data: any) {
  const detail = data && (data.detail || data.message || data.error)
  if (status === 401) return 'Higgsfield rejected the credentials (check HF_API_KEY / HF_SECRET).'
  if (status === 403) return 'Not enough Higgsfield credits to generate this image.'
  if (status === 422 || status === 400) return 'Higgsfield rejected the request' + (detail ? ': ' + detail : '.')
  return 'Higgsfield error ' + status + (detail ? ': ' + detail : '')
}

export async function POST(req: Request) {
  const c = creds()
  if (!c) return Response.json({error: 'Image generation is not configured yet — set HF_API_KEY and HF_SECRET in Vercel.'}, {status: 500})

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const prompt = (body.prompt || '').toString().trim().slice(0, 3800)
  if (!prompt) return Response.json({error: 'Missing prompt'}, {status: 400})
  const width_and_height = ALLOWED_SIZES.has(body.size) ? body.size : '1536x2048'
  const quality = body.quality === '720p' ? '720p' : '1080p'

  const r = await fetch(HF_BASE + '/v1/text2image/soul', {
    method: 'POST',
    headers: {'hf-api-key': c.key, 'hf-secret': c.secret, 'Content-Type': 'application/json'},
    body: JSON.stringify({params: {prompt, width_and_height, quality, batch_size: 1}}),
  })
  const data = await r.json().catch(() => null)
  if (!r.ok) return Response.json({error: hfError(r.status, data)}, {status: r.status})
  if (!data || !data.id) return Response.json({error: 'Unexpected response from Higgsfield.'}, {status: 502})
  return Response.json({jobSetId: data.id})
}

export async function GET(req: Request) {
  const c = creds()
  if (!c) return Response.json({error: 'Image generation is not configured yet — set HF_API_KEY and HF_SECRET in Vercel.'}, {status: 500})

  const jobSetId = new URL(req.url).searchParams.get('jobSetId')
  if (!jobSetId) return Response.json({error: 'Missing jobSetId'}, {status: 400})

  const r = await fetch(HF_BASE + '/v1/job-sets/' + encodeURIComponent(jobSetId), {
    headers: {'hf-api-key': c.key, 'hf-secret': c.secret},
  })
  const data = await r.json().catch(() => null)
  if (!r.ok) return Response.json({error: hfError(r.status, data)}, {status: r.status})

  const jobs: any[] = (data && data.jobs) || []
  const some = (s: string) => jobs.some((j) => j.status === s)
  let status = 'in_progress'
  if (some('failed')) status = 'failed'
  else if (some('nsfw')) status = 'nsfw'
  else if (some('canceled')) status = 'canceled'
  else if (jobs.length && jobs.every((j) => j.status === 'completed')) status = 'completed'
  else if (some('queued')) status = 'queued'

  if (status !== 'completed') return Response.json({status})

  const job = jobs.find((j) => j.results && j.results.raw && j.results.raw.url)
  const url = job && job.results.raw.url
  if (!url) return Response.json({status: 'failed', error: 'Higgsfield returned no image URL.'})

  const img = await fetch(url)
  if (!img.ok) return Response.json({error: 'Could not download the generated image.'}, {status: 502})
  const buf = Buffer.from(await img.arrayBuffer())
  const contentType = img.headers.get('content-type') || 'image/jpeg'
  return Response.json({status: 'completed', image: buf.toString('base64'), contentType})
}
