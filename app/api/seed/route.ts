import {createClient} from 'next-sanity'
import {projectId, dataset, apiVersion} from '@/sanity/env'
import {buildSeedDocs} from '@/sanity/lib/seedData'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY server-side seeder — remove after use.
// Requires SANITY_WRITE_TOKEN (Editor) env var. Trigger: GET /api/seed?go=SEED-NOW
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('go') !== 'SEED-NOW') {
    return Response.json({error: 'append ?go=SEED-NOW to run'}, {status: 400})
  }
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    return Response.json({error: 'SANITY_WRITE_TOKEN env var not set on this deployment.'}, {status: 500})
  }

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const docs = buildSeedDocs()

  try {
    let tx = client.transaction()
    docs.forEach((d) => {
      tx = tx.createOrReplace(d as never)
    })
    const res = await tx.commit({visibility: 'sync'})
    const totalAfter = await client.fetch('count(*)', {}, {cache: 'no-store'})
    const allDocs = await client.fetch('*[]{_id, _type}', {}, {cache: 'no-store'})
    return Response.json({
      ok: true,
      transactionId: (res as {transactionId?: string}).transactionId,
      wrote: docs.length,
      totalAfter,
      allDocs,
    })
  } catch (e) {
    const err = e as {message?: string; statusCode?: number; responseBody?: unknown}
    return Response.json(
      {ok: false, error: err?.message || String(e), statusCode: err?.statusCode, responseBody: err?.responseBody ?? null},
      {status: 500},
    )
  }
}
