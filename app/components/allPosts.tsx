import Link from "next/link";
import { BilletService } from "../services/BilletService";
import { formatDate } from "../lib/utils";
import type { Billet } from "../types";

function BilletCard({ billet, index }: { billet: Billet; index: number }) {
  const title   = billet.Titre ?? `Billet ${index + 1}`;
  const id      = String(billet.id ?? index + 1);
  const date    = billet.Date ? formatDate(billet.Date) : null;
  const excerpt = billet.Contenu ? billet.Contenu.slice(0, 160).trimEnd() + (billet.Contenu.length > 160 ? "…" : "") : null;

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {date && (
            <time className="mb-2 block text-xs font-medium uppercase tracking-wide text-violet-500">
              {date}
            </time>
          )}
          <h2 className="text-xl font-semibold text-slate-900 group-hover:text-violet-700 transition-colors leading-snug">
            {title}
          </h2>
          {excerpt && (
            <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
          →
        </span>
      </div>
      <Link href={`/billets/${id}`} className="absolute inset-0 rounded-2xl" aria-label={`Lire : ${title}`} />
    </article>
  );
}

export default async function AllPosts() {
  let billets: Billet[] = [];
  let errorMessage: string | null = null;

  try {
    billets = await BilletService.fetchBillets();
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
          Blog SIO2 · Lyon Palme
        </div>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight">
          Derniers billets
        </h1>
        <p className="mt-3 text-slate-500 text-lg">
          Retrouvez ici les articles publiés par les élèves de la section SIO2.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-semibold">Impossible de charger les billets</p>
          <p className="mt-1 text-sm opacity-80">{errorMessage}</p>
        </div>
      ) : billets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          <p className="text-lg font-medium">Aucun billet pour l&apos;instant</p>
          <p className="mt-1 text-sm">Revenez bientôt !</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {billets.map((billet, index) => (
            <li key={String(billet.id ?? index)}>
              <BilletCard billet={billet} index={index} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
