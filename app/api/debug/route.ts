import {createClient} from 'next-sanity'
import {projectId, dataset, apiVersion} from '@/sanity/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic — remove after debugging.
export async function GET() {
  const out: Record<string, unknown> = {projectId, dataset, apiVersion}

  const published = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'published'})
  const raw = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'raw'})
  const cdn = createClient({projectId, dataset, apiVersion, useCdn: true, perspective: 'published'})

  async function run(key: string, client: ReturnType<typeof createClient>, query: string) {
    try {
      out[key] = await client.fetch(query, {}, {cache: 'no-store'})
    } catch (e) {
      out[key + '_ERR'] = (e as Error)?.message || String(e)
    }
  }

  await run('published_procedures', published, '*[_type=="procedure"]{_id, "slug": slug.current}')
  await run('published_reviews_count', published, 'count(*[_type=="review"])')
  await run('raw_procedures', raw, '*[_type=="procedure"]{_id}')
  await run('cdn_procedures', cdn, '*[_type=="procedure"]{_id}')
  await run('published_total', published, 'count(*)')

  return Response.json(out)
}
