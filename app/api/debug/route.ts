import {createClient} from 'next-sanity'
import {projectId, dataset, apiVersion} from '@/sanity/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic endpoint — remove after debugging procedures.
export async function GET() {
  const published = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'published'})
  const raw = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'raw'})
  const out: Record<string, unknown> = {projectId, dataset, apiVersion}

  async function run(key: string, client: ReturnType<typeof createClient>, query: string) {
    try {
      out[key] = await client.fetch(query)
    } catch (e) {
      out[key + '_ERR'] = (e as Error)?.message || String(e)
    }
  }

  await run('rawCount', raw, 'count(*[_type=="procedure"])')
  await run('rawDocs', raw, '*[_type=="procedure"]{_id, _type, "slug": slug.current, title}')
  await run('publishedList', published, '*[_type=="procedure" && defined(slug.current)]{_id, "slug": slug.current, title}')
  await run('typesSeen', raw, "array::unique(*[]._type)")

  return Response.json(out)
}
