import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

// Server-side read token. Non-NEXT_PUBLIC env vars are undefined in the browser,
// so this token is never exposed client-side. It lets the site read all
// published content reliably, independent of anonymous dataset access rules.
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token,
})
