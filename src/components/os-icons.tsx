import type { Platform } from '@/lib/releases'

/**
 * The three platform marks, inline and monochrome.
 *
 * Inline rather than files or a package: three glyphs of a few lines each, and
 * three network requests for three icons is a bad trade. `currentColor`
 * throughout, never a fixed fill — the buttons have two states (the detected OS
 * is lit, the other two are neutral) and an icon frozen white would break the
 * accented button while one frozen grey would break the other two.
 *
 * The same rule forbids fake holes. A first version painted Tux's eyes with the
 * page background colour, which looks right on exactly one background and wrong
 * on both of the ones these buttons actually use. Every hole below is a real
 * hole — a subpath wound the other way — so the glyph is a true silhouette and
 * takes whatever colour it is given.
 *
 * Using these marks to say « this build runs on that system » is what they are
 * for. So they are drawn plainly, at the weight of a label, with no styling of
 * our own: a stylised logo would be us decorating someone else's mark.
 */

/** Four panes. Straight lines and exact corners, so this is drawn, not traced. */
function Windows(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M0 3.449 9.75 2.1v9.451H0zM10.949 1.949 24 0v11.4H10.949zM0 12.6h9.75v9.451L0 20.699zM10.949 12.6H24V24l-13.051-1.801z" />
    </svg>
  )
}

function Apple(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M17.05 12.72c-.03-2.62 2.14-3.88 2.24-3.94-1.22-1.79-3.12-2.03-3.8-2.06-1.61-.16-3.15.95-3.97.95-.82 0-2.08-.93-3.42-.9-1.76.03-3.38 1.02-4.29 2.6-1.83 3.17-.47 7.87 1.31 10.45.87 1.26 1.91 2.68 3.28 2.63 1.32-.05 1.81-.85 3.4-.85 1.59 0 2.03.85 3.42.82 1.41-.02 2.31-1.29 3.17-2.55.99-1.46 1.4-2.88 1.43-2.95-.03-.01-2.74-1.05-2.77-4.17zM14.5 4.68c.72-.88 1.21-2.09 1.08-3.3-1.04.04-2.3.69-3.05 1.56-.67.78-1.26 2.02-1.1 3.2 1.16.09 2.35-.59 3.07-1.46z" />
    </svg>
  )
}

/**
 * Tux, built from arcs rather than traced.
 *
 * The official penguin is one long path, and restoring a path from memory is a
 * good way to ship a shape that renders as a blob without ever erroring — a
 * silent failure, which is the kind worth designing against. Every subpath here
 * is a circle or an ellipse whose numbers say exactly what they draw, so it is
 * plainer than the official mark and provably not a corrupted copy of it.
 *
 * Body, head and feet are wound clockwise (sweep 1) so they union; the eyes are
 * wound the other way (sweep 0) so the default non-zero rule punches them out.
 */
function Linux(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path
        d="
          M11 20.5 A 2.4 1.3 0 1 1 6.2 20.5 A 2.4 1.3 0 1 1 11 20.5 Z
          M17.8 20.5 A 2.4 1.3 0 1 1 13 20.5 A 2.4 1.3 0 1 1 17.8 20.5 Z
          M16.5 12.9 A 4.5 5.9 0 1 1 7.5 12.9 A 4.5 5.9 0 1 1 16.5 12.9 Z
          M15.6 5.6 A 3.6 3.6 0 1 1 8.4 5.6 A 3.6 3.6 0 1 1 15.6 5.6 Z
          M11.5 5.2 A 0.8 0.8 0 1 0 9.9 5.2 A 0.8 0.8 0 1 0 11.5 5.2 Z
          M14.1 5.2 A 0.8 0.8 0 1 0 12.5 5.2 A 0.8 0.8 0 1 0 14.1 5.2 Z
        "
      />
    </svg>
  )
}

const GLYPHES: Record<Platform, () => React.JSX.Element> = {
  windows: Windows,
  macos: Apple,
  linux: Linux
}

/**
 * Sized in `em` so the icon follows its label rather than a pixel value, and
 * nudged down a hair: a flex baseline puts a replaced element's BOTTOM on the
 * text baseline, which sits it slightly high beside letters with no descender.
 *
 * The container stays `items-baseline`. Switching it to `items-center` is the
 * reflex for making an icon fit, and it would drop the label off the line the
 * file size already sits on.
 */
export function OsIcon({ platform }: { platform: Platform }): React.JSX.Element {
  const Glyphe = GLYPHES[platform]
  return (
    <span className="inline-block size-[1.05em] shrink-0 translate-y-[0.14em]">
      <Glyphe />
    </span>
  )
}
