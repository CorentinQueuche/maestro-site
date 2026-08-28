'use client'

import { useEffect, useState } from 'react'
import { formatSize, RELEASES_URL, type Download, type Platform } from '@/lib/releases'

/**
 * Guessing the OS is worth it; getting it wrong is not worth guarding against.
 *
 * The browser already knows, so making someone pick from a list is asking a
 * question that has an answer. And the cost of a wrong guess is bounded on
 * purpose: the other two platforms stay visible right underneath, never behind
 * a menu. That is what makes the guess safe to make at all.
 *
 * `null` until mount — the server has no navigator, and rendering a guess
 * during hydration would flash the wrong OS at everyone whose guess differs.
 */
function useDetectedPlatform(): Platform | null {
  const [platform, setPlatform] = useState<Platform | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/Win/i.test(ua)) setPlatform('windows')
    else if (/Mac/i.test(ua)) setPlatform('macos')
    else if (/Linux|X11/i.test(ua)) setPlatform('linux')
    else setPlatform('windows')
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
    title: 'macOS demandera une confirmation',
    body: (
      <>
        Clic droit sur l’app, puis <strong className="text-ink-1">Ouvrir</strong>. Une seule fois, la
        première.
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

export function DownloadButtons({
  downloads,
  version
}: {
  downloads: Download[]
  version: string | null
}): React.JSX.Element {
  const detected = useDetectedPlatform()
  const [clicked, setClicked] = useState<Platform | null>(null)

  /* No release published yet — today's state, and a real edge case later (a
     draft, a rate limit, GitHub down). It says what is true instead of offering
     a button that leads nowhere: a dead download is worse than an honest wait,
     because it spends the trust the rest of the page just earned. */
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
          La première version publique n’est pas encore publiée. Laisse ton email plus bas et tu
          recevras une ligne quand elle sort.
        </p>
      </div>
    )
  }

  const principal = downloads.find((d) => d.platform === detected) ?? downloads[0]
  const autres = downloads.filter((d) => d !== principal)

  return (
    <div className="reveal">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={principal.url}
          onClick={() => setClicked(principal.platform)}
          className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-bg-0 transition-opacity hover:opacity-90"
        >
          Télécharger pour {principal.label}
        </a>
        <div className="flex items-center gap-4 text-[14px] text-ink-2">
          {autres.map((d) => (
            <a
              key={d.platform}
              href={d.url}
              onClick={() => setClicked(d.platform)}
              className="transition-colors hover:text-ink-1"
            >
              {d.label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-3 font-mono text-[12px] text-ink-3">
        {version ? `v${version}` : null}
        {version ? ' · ' : null}
        {formatSize(principal.size)} · Gratuit
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
