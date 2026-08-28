'use client'

import { useEffect, useState } from 'react'
import { formatSize, RELEASES_URL, type Download, type Platform } from '@/lib/releases'
import { OsIcon } from './os-icons'

/**
 * Three buttons, always all three, and the one for your OS is the lit one.
 *
 * The first version showed a single detected button with the other two demoted
 * to small links. Corentin asked for three explicit downloads, and he is right
 * about the thing that matters here: someone arriving to download wants to SEE
 * their file, not trust that a guess went their way. Detection still earns its
 * place — it just highlights instead of hiding.
 *
 * ORDER IS FIXED, never reordered by platform. Putting the detected OS first
 * would move the other two AFTER hydration, so the row visibly jumps under the
 * cursor of someone already reaching for a button. Colour says the same thing
 * and moves nothing.
 */
function useDetectedPlatform(): Platform | null {
  const [platform, setPlatform] = useState<Platform | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/Win/i.test(ua)) setPlatform('windows')
    else if (/Mac/i.test(ua)) setPlatform('macos')
    else if (/Linux|X11/i.test(ua)) setPlatform('linux')
    else setPlatform(null)
  }, [])

  return platform
}

/** What each OS asks of someone the first time, shown AFTER the click. */
const AFTER_CLICK: Record<Platform, { title: string; body: React.ReactNode }> = {
  windows: {
    title: 'Windows va afficher « Windows a protégé votre ordinateur »',
    body: (
      <>
        C’est normal : signer une application coûte plusieurs centaines d’euros par an, et Maestro
        est gratuit. Clique sur <strong className="text-ink-1">Informations complémentaires</strong>,
        puis <strong className="text-ink-1">Exécuter quand même</strong>.
      </>
    )
  },
  macos: {
    title: 'macOS refuse d’ouvrir l’app',
    body: (
      <>
        Elle n’est pas encore signée — un correctif est en cours. Windows et Linux fonctionnent.
      </>
    )
  },
  linux: {
    title: 'Rendre le fichier exécutable',
    body: (
      <>
        <code className="font-mono text-[0.9em] text-ink-1">chmod +x</code> sur le fichier
        téléchargé, puis lance-le.
      </>
    )
  }
}

/** The order the buttons are printed in, whatever the visitor runs. */
const ORDRE: Platform[] = ['windows', 'macos', 'linux']

export function DownloadButtons({
  downloads,
  version
}: {
  downloads: Download[]
  version: string | null
}): React.JSX.Element {
  const detected = useDetectedPlatform()
  const [clicked, setClicked] = useState<Platform | null>(null)

  /* No release published yet. It stopped being today's state when v0.2.0 went
     out, but it stays a real one: a draft-only release, GitHub's unauthenticated
     rate limit on a shared Vercel IP, or GitHub simply down. It says what is
     true rather than offering a button that leads nowhere — a dead download
     spends the trust the rest of the page just earned. */
  if (downloads.length === 0) {
    return (
      <div className="reveal">
        <a
          href={RELEASES_URL}
          className="inline-flex items-center rounded-full border border-line bg-bg-2 px-6 py-3 text-[15px] font-medium text-ink-1 transition-colors hover:border-accent"
        >
          Voir les versions sur GitHub
        </a>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ink-3">
          Les fichiers ne sont pas joignables à l’instant. Ils sont toujours sur la page des
          versions.
        </p>
      </div>
    )
  }

  const ordonnes = ORDRE.map((p) => downloads.find((d) => d.platform === p)).filter(
    (d): d is Download => d !== undefined
  )

  return (
    <div className="reveal">
      <div className="flex flex-wrap gap-3">
        {ordonnes.map((d) => {
          const mis = d.platform === detected
          return (
            <a
              key={d.platform}
              href={d.url}
              onClick={() => setClicked(d.platform)}
              className={`group inline-flex items-baseline gap-2.5 rounded-full px-5 py-3 text-[15px] transition-colors ${
                mis
                  ? 'bg-accent font-semibold text-bg-0 hover:opacity-90'
                  : 'border border-line bg-bg-2 font-medium text-ink-1 hover:border-accent'
              }`}
            >
              <OsIcon platform={d.platform} />
              {d.label}
              {/* The weight is worth its pixels: 116 Mo is a decision on a phone
                  tethered to a laptop, and finding it out mid-download is worse
                  than reading it first. */}
              <span
                className={`font-mono text-[12px] ${mis ? 'text-bg-0/70' : 'text-ink-3'}`}
              >
                {formatSize(d.size)}
              </span>
            </a>
          )
        })}
      </div>

      <p className="mt-3 font-mono text-[12px] text-ink-3">
        {version ? `v${version} · ` : null}Gratuit · Il te faut Claude Code sur ta machine
      </p>

      {/* Never before the click. Before, it is a deterrent for a problem you do
          not have yet; after, it is help arriving exactly when it is needed. */}
      {clicked && (
        <div className="mt-5 max-w-lg rounded-xl border border-line bg-bg-1 p-4">
          <p className="text-[13px] font-medium text-ink-1">{AFTER_CLICK[clicked].title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{AFTER_CLICK[clicked].body}</p>
        </div>
      )}
    </div>
  )
}
