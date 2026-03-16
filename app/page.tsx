// Import de Link depuis Next.js pour créer des liens de navigation internes
import Link from "next/link";

import { Header, Footer } from "./layout"; // Import du composant Header depuis le layout


// Définition du type TypeScript pour un billet
// Utilise un objet flexible avec des champs optionnels pour s'adapter à la structure de l'API
type Billet = {
  id: string | number; // Identifiant du billet (peut être string ou number)
  title?: string; // Titre optionnel (pour compatibilité avec d'autres APIs)
  body?: string; // Corps optionnel (pour compatibilité avec d'autres APIs)
  date?: string; // Date optionnelle (si l'API en fournit une)
  [key: string]: unknown; // Permet d'autres propriétés dynamiques (comme Titre, Contenu, Date)
};

// URL de l'API pour récupérer les billets
// Note : pas de slash final pour éviter une redirection 301
const API_URL = "https://www.ryanfonseca.fr/b2lp/api/billets";

// Fonction asynchrone pour récupérer les billets depuis l'API
// Utilise fetch avec cache désactivé pour toujours obtenir les données fraîches
async function fetchBillets(): Promise<Billet[]> {
  // Effectue la requête HTTP vers l'API
  const res = await fetch(API_URL, { cache: "no-store" });

  // Vérifie si la réponse est OK (status 200-299)
  if (!res.ok) {
    // Lance une erreur si la requête échoue
    throw new Error(`Failed to fetch billets (status ${res.status})`);
  }

  // Parse le JSON de la réponse
  const data = await res.json();

  // Vérifie que la réponse est bien un tableau (structure attendue)
  if (!Array.isArray(data)) {
    // Lance une erreur si ce n'est pas un tableau
    throw new Error(`Unexpected API response (expected array, got ${typeof data})`);
  }

  // Retourne les données typées comme Billet[]
  return data as Billet[];
}

// Composant principal de la page (export par défaut pour Next.js App Router)
// Fonction asynchrone car elle utilise await pour fetchBillets
export default async function BilletsPage() {
  // Variables pour stocker les données et les erreurs
  let billets: Billet[] = []; // Tableau des billets récupérés
  let errorMessage: string | null = null; // Message d'erreur si la récupération échoue

  // Bloc try-catch pour gérer les erreurs de récupération
  try {
    // Appelle la fonction pour récupérer les billets
    billets = await fetchBillets();
  } catch (error) {
    // En cas d'erreur, stocke le message d'erreur
    errorMessage = (error as Error).message;
  }

  // Retourne le JSX de la page
  return (
    // Élément principal avec classes Tailwind pour le layout
    <main className="min-h-screen px-4 py-10">
      <Header /> {/* Affiche le header de la page */}
      {/* Conteneur centré avec largeur maximale */}
      <div className="mx-auto max-w-4xl">
        {/* En-tête de la page */}
        <header className="mb-8">
          {/* Titre principal */}
          <h1 className="text-3xl font-semibold text-cyan-600">Liste des billets</h1>
          {/* Description avec l'URL de l'API */}
          <p className="mt-2 text-sm text-slate-600">
            Données récupérées depuis <code>{API_URL}</code>.
          </p>
        </header>

        {/* Affichage conditionnel basé sur l'état des données */}
        {errorMessage ? (
          // Si erreur, affiche un message d'erreur stylisé
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <p className="font-medium">Impossible de charger les billets</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        ) : billets.length === 0 ? (
          // Si aucun billet, affiche un message informatif
          <p className="text-slate-700">Aucun billet trouvé (ou en attente de chargement).</p>
        ) : (
          // Sinon, affiche la liste des billets
          <ul className="space-y-4">
            {/* Mappe chaque billet pour créer un élément de liste */}
            {billets.map((billet, index) => {
              // Extraction des champs avec fallbacks
              // Utilise Titre/Contenu (de l'API) ou title/body (compatibilité)
              const title = (billet.Titre as string) ?? billet.title ?? `Billet ${index + 1}`;
              const body = (billet.Contenu as string) ?? billet.body;
              // Identifiant : utilise billet.id ou l'index comme fallback
              const id = String(billet.id ?? index + 1);
              const date = billet.Date ?? billet.date; // Date du billet (si présente)

              // Retourne l'élément de liste pour ce billet
              return (
                <li
                  key={id} // Clé unique pour React (nécessaire pour les listes)
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {/* Titre du billet */}
                  <h2 className="text-xl font-semibold text-cyan-600">{title}</h2>
                  {/* Date du billet si présente */}
                  {date && (
                    <time className="mt-1 block text-sm text-slate-500">
                      {new Date().toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {/* Corps du billet si présent */}
                  {body ? <p className="mt-2 text-slate-600">{body}</p> : null}
                  {/* Bouton pour voir le détail du billet */}
                  <div className="mt-4">
                    <Link
                      href={`/billets/${id}`} // Lien vers la page de détail (à créer)
                      className="inline-flex items-center rounded bg-purple-100 px-3 py-1.5 text-sm font-medium text-cyan-600"
                    >
                      Voir le billet
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

      </div>
      <Footer /> {/* Affiche le footer de la page */}
    </main>
  );
}
