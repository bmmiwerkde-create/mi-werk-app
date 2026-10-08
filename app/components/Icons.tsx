import type { ReactNode, CSSProperties } from 'react'

const ICONS: Record<string, ReactNode> = {
  beauty: (<><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8 7.5 20 18M8 16.5 20 6" /></>),
  bildung: (<><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6" /></>),
  catering: (<><path d="M6 3v6a2 2 0 0 0 4 0V3M8 3v18" /><path d="M17 21V3c-2.2 1.5-3.5 4.5-3.5 8H17" /></>),
  fitness: (<><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" /></>),
  garten: (<><path d="M12 21V11" /><path d="M12 11c0-4 3-6 7-6 0 4-3 6-7 6z" /><path d="M12 15c0-3-2.5-5-6-5 0 3.5 2.5 5 6 5z" /></>),
  handwerk: (<><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>),
  it: (<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
  buero: (<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>),
  events: (<><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></>),
  auto: (<><path d="M5 17h-.5A1.5 1.5 0 0 1 3 15.5V13l1.8-4.6A2 2 0 0 1 6.7 7h10.6a2 2 0 0 1 1.9 1.4L21 13v2.5a1.5 1.5 0 0 1-1.5 1.5H19" /><path d="M3 13h18" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path d="M9.5 17h5" /></>),
  familie: (<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.2" /><path d="M16 14.2c2.9.3 5 2.6 5 5.8" /></>),
  tiere: (<><circle cx="6" cy="10" r="1.8" /><circle cx="10" cy="6" r="1.8" /><circle cx="14" cy="6" r="1.8" /><circle cx="18" cy="10" r="1.8" /><path d="M12 12c-3 0-6 3-6 5.500 0 1.700 1.400 2.500 3 2.500 1 0 2-.5 3-.5s2 .5 3 .5c1.600 0 3-.8 3-2.500 0-2.500-3-5.500-6-5.500z" /></>),
  transport: (<><rect x="2" y="6" width="11" height="10" rx="1" /><path d="M13 9h4l4 4v3h-8" /><circle cx="6.500" cy="17.500" r="1.800" /><circle cx="17.500" cy="17.500" r="1.800" /></>),
  personal: (<><circle cx="12" cy="7.500" r="3.200" /><path d="M5.500 20.500c.7-3.600 3.300-5.500 6.500-5.500s5.800 1.900 6.500 5.500" /><path d="m12 15-1.200 1.600 1.200 4 1.200-4z" /></>),
  gesundheit: (<><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M12 7.500v9M7.500 12h9" /></>),

  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.300-4.300" /></>),
  list: (<><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.800" cy="6" r=".6" /><circle cx="3.800" cy="12" r=".6" /><circle cx="3.800" cy="18" r=".6" /></>),
  map: (<><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>),
  pin: (<><path d="M12 21s-7-6.200-7-11a7 7 0 0 1 14 0c0 4.800-7 11-7 11z" /><circle cx="12" cy="10" r="2.500" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  euro: (<><path d="M17.500 6.500A7 7 0 1 0 17.500 17.500" /><path d="M4 10h9M4 14h9" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  phone: (<><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.500 2.500 3.500 5.500 3.500 9S14.500 18.500 12 21c-2.500-2.500-3.500-5.500-3.500-9S9.500 5.500 12 3z" /></>),
  check: (<><path d="m5 12.500 4.500 4.500L19 7" /></>),
  lock: (<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  arrow: (<><path d="M5 12h14M13 6l6 6-6 6" /></>),
  star: (<><path d="m12 3 2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z" /></>),
  eye: (<><path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.600-7 8-7s8 3 8 7" /></>),
  trend: (<><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>),
  shield: (<><path d="M12 3 4 6v6c0 4.500 3.200 8 8 9 4.800-1 8-4.500 8-9V6z" /><path d="m9 12 2 2 4-4" /></>),
  sparkle: (<><path d="m12 3 1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z" /></>),
}

const KATEGORIE_ICON: Record<string, string> = {
  'Beauty & Pflege': 'beauty',
  'Bildung & Coaching': 'bildung',
  'Catering & Essen': 'catering',
  'Fitness & Sport': 'fitness',
  'Garten & Außen': 'garten',
  'Haus & Handwerk': 'handwerk',
  'IT & Digital': 'it',
  'Büro & Verwaltung': 'buero',
  'Events & Veranstaltung': 'events',
  'Fahrzeuge & Mobilität': 'auto',
  'Familie & Soziales': 'familie',
  'Tiere': 'tiere',
  'Transport & Logistik': 'transport',
  'Personal': 'personal',
  'Gesundheit': 'gesundheit',
}

export function iconNameFuerKategorie(name?: string | null) {
  return (name && KATEGORIE_ICON[name]) || 'user'
}

export function Icon({ name, size = 20, stroke = 1.6, style }: { name: string; size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
    >
      {ICONS[name] ?? ICONS.user}
    </svg>
  )
}


export function IconBadge({ name, size = 52, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'var(--mw-cta)',
        background: 'var(--mw-cta-soft)',
        ...style,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.52)} stroke={1.7} />
    </span>
  )
}

export const ICON_NAMES = Object.keys(ICONS)
