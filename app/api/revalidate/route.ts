import {revalidateTag} from 'next/cache'
import {NextResponse, type NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

// Sanity -> Vercel on-demand revalidation. When a published document changes in
// Studio, Sanity POSTs here; we verify the signature with SANITY_REVALIDATE_SECRET
// and purge every page tagged 'sanity' so edits appear immediately rather than
// waiting for the 60s ISR fallback.
export async function POST(req: NextRequest) {
  try {
    const {isValidSignature, body} = await parseBody<{_type?: string}>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', {status: 401})
    }

    // Next 16 signature: (tag, cacheLife profile). 'max' marks all entries
    // tagged 'sanity' stale so the next request refetches from Sanity.
    revalidateTag('sanity', 'max')
    return NextResponse.json({revalidated: true, type: body?._type ?? null})
  } catch (err) {
    console.error('Revalidate webhook error:', (err as Error)?.message)
    return new NextResponse('Error revalidating', {status: 500})
  }
}
