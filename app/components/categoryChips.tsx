import type { Categorie } from "../types";

/**
 * Affiche les catégories d'un billet sous forme de badges ("chips").
 * Composant purement présentationnel (aucun état) → réutilisable aussi bien
 * sur la carte de la liste que sur l'écran de détail.
 * Si le billet n'a aucune catégorie, le composant ne rend rien.
 */
export default function CategoryChips({
  categories,
  className = "",
}: {
  categories?: Categorie[];
  className?: string;
}) {
  // Cas "aucune catégorie" : on n'affiche rien (pas de conteneur vide).
  if (!categories || categories.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {categories.map((cat) => (
        <span
          key={cat.Id}
          className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-100"
        >
          {cat.Libelle}
        </span>
      ))}
    </div>
  );
}
