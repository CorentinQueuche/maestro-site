import type { Metadata } from 'next'
import './globals.css'

const TITRE = 'Maestro — l’atelier de tes agents'
const DESCRIPTION =
  'Dix sessions Claude Code qui travaillent pendant que tu fais autre chose. Chacune dans son terminal, isolée des autres — tu relis, et tu fusionnes ce que tu gardes.'

/**
 * Absolute URLs for the share card, without a domain to hardcode.
 *
 * No domain is bought yet, so the site opens on a `.vercel.app` whose host
 * Vercel injects at build time. Writing one in by hand would be wrong twice:
 * wrong now on previews, and wrong again the day a real domain lands.
 * `localhost` is the last resort so a local build still renders.
 */
const HOTE =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  'localhost:3000'
const BASE = new URL(HOTE.startsWith('localhost') ? `http://${HOTE}` : `https://${HOTE}`)

export const metadata: Metadata = {
  metadataBase: BASE,
  title: TITRE,
  description: DESCRIPTION,
  openGraph: {
    title: TITRE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: '/og.png', width: 1200, height: 630 }]
  },
  twitter: { card: 'summary_large_image', title: TITRE, description: DESCRIPTION },
  icons: { icon: '/favicon.svg' }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="fr">
      {/* The font is loaded from the app's own family, with a real fallback
          stack rather than a swap on a webfont this page does not ship: a
          landing that shifts its type on load looks broken in the one second
          someone decides whether to keep reading. */}
      <body>{children}</body>
    </html>
  )
}
