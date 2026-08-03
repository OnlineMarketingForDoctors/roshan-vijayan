import '@sanity/types'

// The custom "Generate image" button reads config from image options.generate.
declare module '@sanity/types' {
  interface ImageOptions {
    generate?: {
      size?: string
      label?: string
      needLabel?: string
      contentFields?: string[]
      scene?: string
    }
  }
}
