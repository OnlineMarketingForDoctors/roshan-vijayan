/**
 * Serverless image generation for the Sanity Studio "Generate image" button.
 * Talks to the Higgsfield Soul text-to-image API server-side so the API
 * credentials never reach the browser.
 *
 *   POST /api/generate-image      { prompt, size, quality }  -> { jobSetId }
 *   GET  /api/generate-image?jobSetId=...                    -> { status } |
 *                                                              { status:'completed', image:<base64>, contentType }
 *
 * Env vars (set in Vercel → Project → Settings → Environment Variables):
 *   HF_API_KEY   Higgsfield API key    (from cloud.higgsfield.ai/api-keys)
 *   HF_SECRET    Higgsfield API secret
 *
 * The submit/poll split keeps every invocation short, so it works on any
 * Vercel plan without extending the function timeout.
 */

var HF_BASE = 'https://platform.higgsfield.ai';

// The 7 Soul resolutions we allow the client to request.
var ALLOWED_SIZES = {
  '2048x1152': 1, '2048x1536': 1, '1152x2048': 1,
  '1536x2048': 1, '1536x1536': 1, '1536x1152': 1, '1152x1536': 1,
};

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'POST') return await submit(req, res);
    if (req.method === 'GET') return await poll(req, res);
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: (e && e.message) || 'Server error' });
  }
};

function creds(res) {
  var key = process.env.HF_API_KEY;
  var secret = process.env.HF_SECRET;
  if (!key || !secret) {
    res.status(500).json({ error: 'Image generation is not configured yet — set HF_API_KEY and HF_SECRET in Vercel.' });
    return null;
  }
  return { key: key, secret: secret };
}

function hfError(status, data) {
  var detail = data && (data.detail || data.message || data.error);
  if (status === 401) return 'Higgsfield rejected the credentials (check HF_API_KEY / HF_SECRET).';
  if (status === 403) return 'Not enough Higgsfield credits to generate this image.';
  if (status === 422 || status === 400) return 'Higgsfield rejected the request' + (detail ? ': ' + detail : '.');
  return 'Higgsfield error ' + status + (detail ? ': ' + detail : '');
}

function readJson(req) {
  return new Promise(function (resolve) {
    if (req.body != null) {
      if (typeof req.body === 'string') {
        try { return resolve(JSON.parse(req.body)); } catch (_) { return resolve({}); }
      }
      return resolve(req.body);
    }
    var d = '';
    req.on('data', function (c) { d += c; });
    req.on('end', function () { try { resolve(JSON.parse(d || '{}')); } catch (_) { resolve({}); } });
    req.on('error', function () { resolve({}); });
  });
}

async function submit(req, res) {
  var c = creds(res); if (!c) return;
  var body = await readJson(req);
  var prompt = (body.prompt || '').toString().trim().slice(0, 3800);
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  var width_and_height = ALLOWED_SIZES[body.size] ? body.size : '1536x2048';
  var quality = body.quality === '720p' ? '720p' : '1080p';

  var r = await fetch(HF_BASE + '/v1/text2image/soul', {
    method: 'POST',
    headers: { 'hf-api-key': c.key, 'hf-secret': c.secret, 'Content-Type': 'application/json' },
    body: JSON.stringify({ params: { prompt: prompt, width_and_height: width_and_height, quality: quality, batch_size: 1 } }),
  });
  var data = await r.json().catch(function () { return null; });
  if (!r.ok) return res.status(r.status).json({ error: hfError(r.status, data) });
  if (!data || !data.id) return res.status(502).json({ error: 'Unexpected response from Higgsfield.' });
  return res.status(200).json({ jobSetId: data.id });
}

async function poll(req, res) {
  var c = creds(res); if (!c) return;
  var jobSetId = (req.query && req.query.jobSetId) ||
    new URL(req.url, 'http://x').searchParams.get('jobSetId');
  if (!jobSetId) return res.status(400).json({ error: 'Missing jobSetId' });

  var r = await fetch(HF_BASE + '/v1/job-sets/' + encodeURIComponent(jobSetId), {
    headers: { 'hf-api-key': c.key, 'hf-secret': c.secret },
  });
  var data = await r.json().catch(function () { return null; });
  if (!r.ok) return res.status(r.status).json({ error: hfError(r.status, data) });

  var jobs = (data && data.jobs) || [];
  var some = function (s) { return jobs.some(function (j) { return j.status === s; }); };
  var status = 'in_progress';
  if (some('failed')) status = 'failed';
  else if (some('nsfw')) status = 'nsfw';
  else if (some('canceled')) status = 'canceled';
  else if (jobs.length && jobs.every(function (j) { return j.status === 'completed'; })) status = 'completed';
  else if (some('queued')) status = 'queued';

  if (status !== 'completed') return res.status(200).json({ status: status });

  var job = jobs.find(function (j) { return j.results && j.results.raw && j.results.raw.url; });
  var url = job && job.results.raw.url;
  if (!url) return res.status(200).json({ status: 'failed', error: 'Higgsfield returned no image URL.' });

  var img = await fetch(url);
  if (!img.ok) return res.status(502).json({ error: 'Could not download the generated image.' });
  var buf = Buffer.from(await img.arrayBuffer());
  var contentType = img.headers.get('content-type') || 'image/jpeg';
  return res.status(200).json({ status: 'completed', image: buf.toString('base64'), contentType: contentType });
}
