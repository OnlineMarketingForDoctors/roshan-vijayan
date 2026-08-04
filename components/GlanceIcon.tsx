import type {ReactNode} from 'react'

const ICONS: Record<string, ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8" />
      <path d="M3 13h18" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  droplet: <path d="M12 3.5c3 3.2 5.5 6.1 5.5 9.3A5.5 5.5 0 0 1 6.5 12.8C6.5 9.6 9 6.7 12 3.5z" />,
  walk: (
    <>
      <circle cx="13" cy="4.6" r="1.5" />
      <path d="M11.5 8.5l-1.5 4 2.2 1.8V20" />
      <path d="M10 12.5l-3 1.8" />
      <path d="M12.2 14.3l2.8 2.2" />
    </>
  ),
  activity: <path d="M3 12h4l2.5 7 4-14 2.5 7H21" />,
  heart: <path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 6a4.4 4.4 0 0 1 8.5 2.9C20.5 15 12 20.5 12 20.5Z" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.4l2.4 2.4 4.6-5.2" />
    </>
  ),
  navigation: <path d="M12 3l7.5 17-7.5-3.7L4.5 20 12 3Z" />,
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />,
  chat: <path d="M20 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4v4l4-4h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />,
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4.5V4A1.5 1.5 0 0 1 10.5 2.5h3A1.5 1.5 0 0 1 15 4v.5" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
}

export default function GlanceIcon({icon, className = 'gi'}: {icon?: string; className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[icon || ''] || ICONS.check}
    </svg>
  )
}
