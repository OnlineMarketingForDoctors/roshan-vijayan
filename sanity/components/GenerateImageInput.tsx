import {useCallback, useState} from 'react'
import {set, setIfMissing, useClient, useFormValue} from 'sanity'
import {Box, Button, Card, Flex, Spinner, Stack, Text, useToast} from '@sanity/ui'

/**
 * Custom image input that adds a "✨ Generate image" button.
 *
 * It reads the section's own text (configured per field via
 * options.generate.contentFields), refuses to run if that text is empty
 * (so the image can be made relevant to the content), builds a prompt that
 * combines the content with a fixed brand-style preamble + the correct size
 * for the slot, calls /api/generate-image, then uploads the result into the
 * field. The consistent preamble keeps palette / mood aligned across images.
 */

const BRAND_STYLE =
  'Editorial fine-art photograph for a luxury, high-end plastic surgery brand. ' +
  'Consistent colour palette of warm ivory, soft cream and champagne tones with ' +
  'subtle muted gold accents and gentle charcoal. Soft, diffused natural window ' +
  'light; calm, reassuring, elegant and aspirational mood; minimal refined styling; ' +
  'a film-like quality with a hint of grain; shallow depth of field. ' +
  'Absolutely no text, words, letters, logos or watermarks. Tasteful and ' +
  'non-clinical — never graphic, surgical, medical or gory.'

function plainText(value: any): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === 'string') return v
        // portable text block
        if (v && v._type === 'block' && Array.isArray(v.children)) {
          return v.children.map((c: any) => (c && c.text) || '').join('')
        }
        return ''
      })
      .filter(Boolean)
      .join(' ')
  }
  return ''
}

function base64ToBlob(b64: string, contentType: string): Blob {
  const bytes = atob(b64)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], {type: contentType})
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function GenerateImageInput(props: any) {
  const {schemaType, onChange, renderDefault} = props
  const gen = (schemaType?.options && schemaType.options.generate) || null
  const doc = useFormValue([]) as any
  const client = useClient({apiVersion: '2024-01-01'})
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [statusText, setStatusText] = useState('')

  const onGenerate = useCallback(async () => {
    if (!gen) return
    const fields: string[] = gen.contentFields || []
    const content = fields.map((f) => plainText(doc && doc[f])).filter(Boolean).join('. ').trim()

    if (!content) {
      toast.push({
        status: 'warning',
        title: 'Add the section text first',
        description: `Please fill in ${gen.needLabel || 'this section’s text'} so the image can be generated to match its content.`,
      })
      return
    }

    setBusy(true)
    setStatusText('Starting…')
    try {
      const prompt =
        (gen.scene ? gen.scene + '. ' : '') +
        'Visual mood inspired by the theme: "' + content.slice(0, 240) + '". ' +
        BRAND_STYLE

      const startRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt, size: gen.size || '1536x2048', quality: '1080p'}),
      })
      const startData = await startRes.json().catch(() => ({}))
      if (!startRes.ok) throw new Error(startData.error || 'Could not start generation.')
      const jobSetId = startData.jobSetId
      if (!jobSetId) throw new Error('No job id returned.')

      setStatusText('Generating…')
      let image: string | null = null
      let contentType = 'image/jpeg'
      for (let i = 0; i < 90; i++) {
        await sleep(2500)
        const pRes = await fetch('/api/generate-image?jobSetId=' + encodeURIComponent(jobSetId))
        const pData = await pRes.json().catch(() => ({}))
        if (!pRes.ok) throw new Error(pData.error || 'Generation failed.')
        if (pData.status === 'completed') {
          image = pData.image
          contentType = pData.contentType || 'image/jpeg'
          break
        }
        if (pData.status === 'failed') throw new Error('Generation failed.')
        if (pData.status === 'nsfw') throw new Error('The result was blocked as unsafe — try adjusting the section text.')
        if (pData.status === 'canceled') throw new Error('Generation was canceled.')
      }
      if (!image) throw new Error('Timed out waiting for the image.')

      setStatusText('Saving…')
      const blob = base64ToBlob(image, contentType)
      const ext = contentType.indexOf('png') !== -1 ? 'png' : 'jpg'
      const asset = await client.assets.upload('image', blob, {filename: (gen.label || 'generated') + '.' + ext})

      onChange([
        setIfMissing({_type: 'image'}),
        set({_type: 'reference', _ref: asset._id}, ['asset']),
      ])
      toast.push({status: 'success', title: 'Image generated', description: 'Review it, then Publish to make it live.'})
    } catch (e: any) {
      toast.push({status: 'error', title: 'Could not generate image', description: String((e && e.message) || e)})
    } finally {
      setBusy(false)
      setStatusText('')
    }
  }, [gen, doc, client, onChange, toast])

  return (
    <Stack space={3}>
      {renderDefault(props)}
      {gen ? (
        <Card padding={3} radius={2} tone="primary" border>
          <Flex align="center" gap={3}>
            <Button
              text={busy ? statusText || 'Generating…' : '✨ Generate image'}
              tone="primary"
              mode="ghost"
              disabled={busy}
              onClick={onGenerate}
            />
            {busy ? <Spinner muted /> : null}
            <Box flex={1}>
              <Text size={1} muted>
                Uses this section’s text to create an on-brand image. Fill in the text first.
              </Text>
            </Box>
          </Flex>
        </Card>
      ) : null}
    </Stack>
  )
}
