import {createClient} from 'next-sanity'
import {projectId, dataset, apiVersion} from '@/sanity/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic endpoint — remove after debugging.
export async function GET() {
  const c = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'raw'})
  const out: Record<string, unknown> = {projectId, dataset, apiVersion}

  async function run(key: string, query: string) {
    try {
      out[key] = await c.fetch(query, {}, {cache: 'no-store'})
    } catch (e) {
      out[key + '_ERR'] = (e as Error)?.message || String(e)
    }
  }

  await run('total', 'count(*)')
  await run('allDocs', '*[]{_id, _type}')
  await run('byId', '*[_id in ["procedure.breast-lift","review.rv-1","siteSettings"]]{_id, _type}')

  return Response.json(out)
}
