"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  extractCategories,
  filterBilletsByCategorie,
} from "../lib/utils";
import CategoryFilter from "./categoryFilter";
import CategoryChips from "./categoryChips";
import type { Billet } from "../types";

/** Carte d'un billet dans la liste (titre, date, extrait + catégories). */
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
          {/* Catégories du billet (ne rend rien si le billet n'en a aucune) */}
          <CategoryChips categories={billet.Categories} className="mt-3" />
        </div>
        <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
          →
        </span>
      </div>
      <Link href={`/billets/${id}`} className="absolute inset-0 rounded-2xl" aria-label={`Lire : ${title}`} />
    </article>
  );
}

/**
 * Liste interactive des billets avec filtre par catégorie.
 * Reçoit les billets déjà chargés côté serveur (par <AllPosts />) et gère
 * le filtrage CÔTÉ CLIENT : tout est déjà en mémoire, il n'y a pas d'endpoint
 * /categories et pas besoin de re-fetch à chaque sélection.
 */
export default function BilletsList({ billets }: { billets: Billet[] }) {
  // null = "Toutes" (aucun filtre actif).
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Catégories déduites des billets (dédupliquées par Id). Mémoïsée : ne se
  // recalcule que si la liste de billets change.
  const categories = useMemo(() => extractCategories(billets), [billets]);

  // Billets affichés après application du filtre courant.
  const billetsFiltres = useMemo(
    () => filterBilletsByCategorie(billets, selectedId),
    [billets, selectedId]
  );

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {billetsFiltres.length === 0 ? (
        // Aucun billet pour la catégorie sélectionnée (la liste globale, elle,
        // n'est pas vide — ce cas est géré en amont par <AllPosts />).
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          <p className="text-lg font-medium">Aucun billet dans cette catégorie</p>
          <p className="mt-1 text-sm">Choisissez « Toutes » pour tout réafficher.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {billetsFiltres.map((billet, index) => (
            <li key={String(billet.id ?? index)}>
              <BilletCard billet={billet} index={index} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
