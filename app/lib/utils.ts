/**
 * Utilitaires partagés entre les composants.
 * Centralise les fonctions de formatage et de filtrage pour éviter la duplication.
 */

import type { Billet, Categorie } from "../types";

/** Formate une date ISO en date lisible en français (ex : "12 avril 2025"). */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Déduit la liste des catégories disponibles à partir des billets chargés.
 * L'API n'expose PAS d'endpoint /categories : on agrège donc les Categories
 * de tous les billets puis on déduplique par Id. Le résultat est trié par
 * libellé (ordre alphabétique français, accents gérés via localeCompare).
 */
export function extractCategories(billets: Billet[]): Categorie[] {
  const parId = new Map<number, Categorie>();
  for (const billet of billets) {
    for (const cat of billet.Categories ?? []) {
      // On ignore les entrées invalides et on ne garde que la première
      // occurrence de chaque Id (déduplication).
      if (cat && typeof cat.Id === "number" && !parId.has(cat.Id)) {
        parId.set(cat.Id, cat);
      }
    }
  }
  return [...parId.values()].sort((a, b) =>
    a.Libelle.localeCompare(b.Libelle, "fr")
  );
}

/**
 * Filtre une liste de billets sur une catégorie donnée (par Id).
 * Un billet est retenu s'il possède la catégorie dans son tableau Categories.
 * categorieId === null → renvoie tous les billets (cas "Toutes").
 */
export function filterBilletsByCategorie(
  billets: Billet[],
  categorieId: number | null
): Billet[] {
  if (categorieId === null) return billets;
  return billets.filter((billet) =>
    (billet.Categories ?? []).some((cat) => cat.Id === categorieId)
  );
}
