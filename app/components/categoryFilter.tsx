"use client";

import type { Categorie } from "../types";

type Props = {
  /** Catégories disponibles (déjà dédupliquées et triées). */
  categories: Categorie[];
  /** Id de la catégorie active, ou null pour "Toutes". */
  selectedId: number | null;
  /** Callback de sélection — null signifie "Toutes". */
  onSelect: (id: number | null) => void;
};

/**
 * Barre horizontale scrollable de chips pour filtrer les billets par catégorie.
 * Inclut une option "Toutes" (réinitialise le filtre).
 * Si aucune catégorie n'est disponible, la barre n'est pas affichée.
 */
export default function CategoryFilter({ categories, selectedId, onSelect }: Props) {
  // Pas de catégories à filtrer → on n'affiche pas la barre du tout.
  if (categories.length === 0) return null;

  // Style commun à toutes les chips, avec variante active/inactive.
  const chipClass = (active: boolean) =>
    `flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-violet-600 text-white"
        : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
    }`;

  return (
    <div
      className="mb-8 flex gap-2 overflow-x-auto pb-2"
      role="group"
      aria-label="Filtrer les billets par catégorie"
    >
      {/* Chip "Toutes" — réaffiche l'ensemble des billets */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selectedId === null}
        className={chipClass(selectedId === null)}
      >
        Toutes
      </button>

      {/* Une chip par catégorie déduite des billets */}
      {categories.map((cat) => (
        <button
          key={cat.Id}
          type="button"
          onClick={() => onSelect(cat.Id)}
          aria-pressed={selectedId === cat.Id}
          className={chipClass(selectedId === cat.Id)}
        >
          {cat.Libelle}
        </button>
      ))}
    </div>
  );
}
