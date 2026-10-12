/**
 * Where the download buttons get their URLs.
 *
 * NEVER a hardcoded release URL, not even temporarily. A page announcing 0.1.0
 * six months after 0.4.0 disqualifies itself, and a link pinned to a version
 * that has been superseded hands people an old binary that will then try to
 * auto-update to the very version the page should have offered.
 *
 * The whole module is built for the world where the channel works, and degrades
 * honestly for the world we are in today — `maestro-releases` exists but has no
 * release yet, because publishing needs a `RELEASES_TOKEN` that only a human
 * can mint. So `latestRelease()` returning `null` is not an error path bolted
 * on afterwards: it is the CURRENT state, and it will stay a real edge case
 * afterwards (a rate limit, GitHub down, a draft-only release).
 */

const OWNER = 'CorentinQueuche'
const REPO = 'maestro-releases'

/** Which asset belongs to which platform, matched on electron-builder's own naming. */
export type Platform = 'windows' | 'macos' | 'linux'

export interface Download {
  platform: Platform
  /** « Windows », « macOS », « Linux » — what the button says. */
  label: string
  url: string
  /** Bytes, for « 103 Mo » next to the button. */
  size: number
  /** A second build for the same OS — the Intel .dmg beside the Apple Silicon one. */
  alternate?: { label: string; url: string; size: number; untested?: boolean }
}

export interface Release {
  /** `0.1.0`, without the leading v. */
  version: string
  publishedAt: string
  downloads: Download[]
  /** The Releases page, always valid even when no asset matched. */
  htmlUrl: string
}

interface GitHubAsset {
  name: string
  browser_download_url: string
  size: number
}

interface GitHubRelease {
  tag_name: string
  published_at: string
  html_url: string
  draft: boolean
  prerelease: boolean
  assets: GitHubAsset[]
}

/**
 * Matched on the extension and the arch, in the order electron-builder writes
 * them (`artifactName: ${productName}-${version}-${os}-${arch}.${ext}`).
 * Deliberately loose on the version so a naming change does not silently drop
 * a platform: an extension is what actually identifies the installer.
 */
const MATCHERS: {
  platform: Platform
  label: string
  test: (name: string) => boolean
  /** Same OS, other architecture: offered as a small link, never as a fourth button. */
  alternate?: { label: string; test: (name: string) => boolean; untested?: boolean }
}[] = [
  { platform: 'windows', label: 'Windows', test: (n) => n.endsWith('.exe') },
  // Apple Silicon is the button: every Mac sold since 2020. Intel is the link.
  // A release with a single .dmg, whatever its arch, still fills the button.
  {
    platform: 'macos',
    label: 'macOS',
    test: (n) => n.endsWith('.dmg') && !n.endsWith('-x64.dmg'),
    // Built and signed, but never started on a real Intel Mac (12/10, Cicco).
    alternate: { label: 'Mac Intel', test: (n) => n.endsWith('-x64.dmg'), untested: true }
  },
  { platform: 'linux', label: 'Linux', test: (n) => n.endsWith('.AppImage') }
]

export const RELEASES_URL = `https://github.com/${OWNER}/${REPO}/releases`

/**
 * The latest published release, or null when there is not one to show.
 *
 * Revalidated hourly rather than fetched per request: the answer changes a few
 * times a year, and an unauthenticated GitHub call is rate-limited to 60 an
 * hour per IP — enough for a cache to refill, nowhere near enough for traffic.
 */
export async function latestRelease(): Promise<Release | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 }
    })
    // 404 is the normal answer for a repository with no release yet — today's
    // case. Treated like any other miss rather than thrown: nothing here is
    // worth failing a page render over.
    if (!response.ok) return null

    const data = (await response.json()) as GitHubRelease
    if (data.draft) return null

    const downloads: Download[] = []
    for (const { platform, label, test, alternate } of MATCHERS) {
      const other = alternate && data.assets?.find((a) => alternate.test(a.name))
      const asset = data.assets?.find((a) => test(a.name)) ?? other
      if (!asset) continue
      downloads.push({
        platform,
        label,
        url: asset.browser_download_url,
        size: asset.size,
        ...(alternate && other && other !== asset
          ? { alternate: { label: alternate.label, url: other.browser_download_url, size: other.size,
              ...(alternate.untested ? { untested: true } : {}) } }
          : {})
      })
    }

    return {
      version: data.tag_name.replace(/^v/, ''),
      publishedAt: data.published_at,
      downloads,
      htmlUrl: data.html_url
    }
  } catch {
    // Offline build, DNS, a proxy — the page still has to render.
    return null
  }
}

/** `103 Mo`. Decimal, because that is what an OS download panel shows. */
export function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1_000_000)} Mo`
}
