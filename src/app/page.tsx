import Image from 'next/image'
import { DownloadButtons } from '@/components/download'
import { latestRelease, RELEASES_URL } from '@/lib/releases'

/**
 * Nine blocks, and none of them exists to sell anything.
 *
 * Download appears TWICE — hero and closing — deliberately: someone convinced
 * in three seconds must not scroll to act, and someone who reads the whole page
 * must not scroll back up.
 */
export default async function Page(): Promise<React.JSX.Element> {
  const release = await latestRelease()
  const downloads = release?.downloads ?? []
  const version = release?.version ?? null

  return (
    <main className="mx-auto max-w-[1100px] px-6">
      {/* ── 1. Hero ────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 sm:pt-28">
        <p className="reveal font-mono text-[12px] tracking-[0.18em] text-accent-ink uppercase">
          Maestro
        </p>
        <h1 className="reveal mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] font-bold tracking-[-0.035em]">
          L’atelier de tes agents.
        </h1>
        <p className="reveal mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
          Dix sessions Claude Code qui travaillent pendant que tu fais autre chose. Chacune dans son
          terminal, isolée des autres — tu relis, et tu fusionnes ce que tu gardes.
        </p>
        <div className="mt-8">
          <DownloadButtons downloads={downloads} version={version} />
        </div>

        <div className="shot reveal mt-14">
          <Image
            src="/shots/hero-home.webp"
            alt="L’accueil de Maestro : le portrait gravé des dix agents, le nombre de sessions en cours, et les fils à reprendre."
            width={2200}
            height={1376}
            priority
            className="w-full"
          />
        </div>
      </section>

      {/* ── 2. Le problème ─────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <p className="reveal mx-auto max-w-2xl text-center text-[clamp(1.3rem,3vw,1.9rem)] leading-[1.35] font-medium tracking-[-0.03em] text-balance">
          Un agent qui code, tu suis. Cinq, tu perds le fil. Dix, tu ne sais plus lequel t’attend —
          ni lequel vient d’écraser le travail d’un autre.
        </p>
        <div className="shot reveal mt-14">
          <Image
            src="/shots/flotte.webp"
            alt="Six sessions Claude Code côte à côte, chacune avec son propre terminal et son travail en cours."
            width={2000}
            height={1474}
            className="w-full"
          />
        </div>
      </section>

      {/* ── 3. Les quatre capacités ────────────────────────────────────── */}
      <Capacite
        titre="Tu sais qui t’attend"
        image="/shots/inbox.webp"
        alt="La boîte de réception : quatre agents en attente, chacun avec sa demande et depuis combien de temps."
        largeur={720}
        hauteur={922}
        etroite
      >
        Maestro branche les hooks de Claude Code. Le statut de chaque agent est celui qu’il déclare
        lui-même — pas une devinette sur le bruit du terminal. Une notification quand la fenêtre n’a
        pas le focus.
      </Capacite>

      <Capacite
        titre="Deux agents, un dépôt, zéro collision"
        image="/shots/review.webp"
        alt="La vue Review : l’onglet d’un worktree, sa branche, les fichiers modifiés et le diff."
        largeur={2000}
        hauteur={976}
      >
        Chaque agent travaille dans son propre worktree git, sur sa branche. Tu relis les diffs un
        par un et tu fusionnes ce que tu gardes. Un <code className="font-mono text-[0.9em]">.git</code>{' '}
        local suffit, aucun remote n’est demandé.
      </Capacite>

      <Capacite
        titre="Tu décris, il propose"
        image="/shots/cicco.webp"
        alt="Cicco propose un plan de lancement de trois agents, chacun dans son worktree."
        largeur={1800}
        hauteur={948}
      >
        Cicco lit l’état réel de ta flotte et te rend un plan de lancement : quels agents, dans quels
        dossiers, avec quels prompts. Tu valides d’un clic. Il orchestre, il n’écrit jamais de code.
      </Capacite>

      <Capacite
        titre="Une mémoire que tous partagent"
        image="/shots/agents.webp"
        alt="Les dix agents de Maestro, gravés."
        largeur={1800}
        hauteur={1018}
      >
        Des notes markdown reliées entre elles, servies aux agents par un serveur MCP local. Ce qu’un
        agent apprend, les autres le lisent — sans que tu aies à le recoller à la main.
      </Capacite>

      {/* ── 4. Et aussi ────────────────────────────────────────────────── */}
      <section className="border-t border-line py-20">
        <p className="reveal max-w-4xl text-[15px] leading-[2] text-ink-2">
          {[
            'Kanban par projet',
            'Review git et diff par worktree',
            'Éditeur intégré',
            'Inbox des agents qui attendent',
            'Presets de lancement',
            'Palette Ctrl+K',
            'Restauration de la disposition au démarrage',
            'maestro . en ligne de commande',
            'Titres de session générés',
            'Résumé IA quand un agent termine'
          ].join(' · ')}
        </p>
      </section>

      {/* ── 5. Il ne remplace pas ton agent ────────────────────────────── */}
      <section className="halftone rounded-2xl border border-line px-8 py-14 sm:px-14">
        <h2 className="reveal max-w-xl text-[clamp(1.6rem,3.4vw,2.2rem)] leading-tight font-bold tracking-[-0.03em]">
          Il ne remplace pas ton agent.
        </h2>
        <p className="reveal mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
          Maestro lance le <code className="font-mono text-[0.9em] text-ink-1">claude</code> déjà
          installé sur ta machine, sur ton abonnement. Ni modèle, ni clé API, ni facture — juste un
          endroit où tes agents travaillent ensemble. Il te faut donc Claude Code et Node.js.
        </p>
      </section>

      {/* ── 6. Pas d’abonnement ────────────────────────────────────────── */}
      <section className="py-20">
        <p className="reveal max-w-2xl text-[17px] leading-relaxed">
          <strong className="font-semibold">Pas d’abonnement.</strong>{' '}
          <span className="text-ink-2">
            Maestro tourne sur ton compte Claude Code — il n’ajoute aucune facture.
          </span>
        </p>
      </section>

      {/* ── 7 + 8. Téléchargement et clôture ───────────────────────────── */}
      <section className="wash rounded-2xl border border-line px-8 py-16 sm:px-14">
        <h2 className="reveal max-w-xl text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-bold tracking-[-0.035em]">
          Tes agents, dans une seule fenêtre.
        </h2>
        <p className="reveal mt-4 text-[16px] text-ink-2">
          Windows, macOS, Linux. Et le <code className="font-mono text-[0.9em]">claude</code> déjà
          installé sur ta machine.
        </p>
        <div className="mt-8">
          <DownloadButtons downloads={downloads} version={version} />
        </div>
      </section>

      {/* ── 9. Pied ────────────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-line py-10">
        <form
          className="reveal flex max-w-md flex-wrap items-center gap-3"
          action={RELEASES_URL}
          method="get"
        >
          <label htmlFor="email" className="w-full text-[14px] text-ink-2">
            Une ligne quand une version sort. Rien d’autre.
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ton@email.fr"
            className="min-w-0 flex-1 rounded-full border border-line bg-bg-1 px-4 py-2.5 text-[14px] text-ink-1 outline-none placeholder:text-ink-3 focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-full border border-line bg-bg-2 px-4 py-2.5 text-[14px] font-medium text-ink-1 transition-colors hover:border-accent"
          >
            M’avertir
          </button>
        </form>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-ink-3">
          <span>Maestro {version ? `v${version}` : '— version à venir'}</span>
          <a href={RELEASES_URL} className="transition-colors hover:text-ink-1">
            Toutes les versions
          </a>
          <span className="ml-auto">KLYRA</span>
        </div>
      </footer>
    </main>
  )
}

/**
 * One capability: a title, one sentence, one tightly-framed image.
 *
 * `etroite` exists for the inbox, which is a 720px-wide panel and not a view:
 * stretching it across the column would show a small panel very large, which is
 * the exact failure the tight framing was meant to avoid.
 */
function Capacite({
  titre,
  children,
  image,
  alt,
  largeur,
  hauteur,
  etroite = false
}: {
  titre: string
  children: React.ReactNode
  image: string
  alt: string
  largeur: number
  hauteur: number
  etroite?: boolean
}): React.JSX.Element {
  return (
    <section className="border-t border-line py-20">
      <h2 className="reveal max-w-lg text-[clamp(1.4rem,3vw,1.9rem)] leading-tight font-bold tracking-[-0.03em]">
        {titre}
      </h2>
      <p className="reveal mt-3 max-w-xl text-[16px] leading-relaxed text-ink-2">{children}</p>
      <div className={`shot reveal mt-10 ${etroite ? 'max-w-sm' : ''}`}>
        <Image src={image} alt={alt} width={largeur} height={hauteur} className="w-full" />
      </div>
    </section>
  )
}
