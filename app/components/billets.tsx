import Link from "next/link";

// URL de l'API qui fournit la liste des billets
const API_URL = "https://www.ryanfonseca.fr/b2lp/api/billets";

// Type représentant un billet retourné par l'API
type Billet = {
  id: string | number;
  Titre?: string;
  Contenu?: string;
  Date?: string;
};

// Récupère les billets depuis l'API sans cache (données toujours fraîches)
async function fetchBillets(): Promise<Billet[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Erreur API (status ${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Réponse API invalide");
  return data as Billet[];
}

// Sous-composant affichant la carte d'un billet individuel
function BilletCard({ billet, index }: { billet: Billet; index: number }) {
  const title = billet.Titre ?? `Billet ${index + 1}`;
  const id = String(billet.id ?? index + 1);

  // Formate la date en français si elle est disponible
  const date = billet.Date
    ? new Date(billet.Date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-cyan-600">{title}</h2>
      {date && <time className="mt-1 block text-sm text-slate-500">{date}</time>}
      {billet.Contenu && <p className="mt-2 text-slate-600">{billet.Contenu}</p>}
      <div className="mt-4">
        <Link
          href={`/billets/${id}`}
          className="inline-flex items-center rounded bg-purple-100 px-3 py-1.5 text-sm font-medium text-cyan-600 hover:bg-purple-200 transition-colors"
        >
          Voir le billet →
        </Link>
      </div>
    </li>
  );
}

// Composant principal : fetche les billets et affiche la liste
// Composant serveur asynchrone (Next.js App Router)
export default async function BilletsList() {
  let billets: Billet[] = [];
  let errorMessage: string | null = null;

  try {
    billets = await fetchBillets();
  } catch (error) {
    // En cas d'échec, on affiche un message d'erreur à l'utilisateur
    errorMessage = (error as Error).message;
  }

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-cyan-600">Liste des billets</h1>
        <p className="mt-2 text-sm text-slate-600">
          Données récupérées depuis <code>{API_URL}</code>.
        </p>
      </header>

      {/* Affichage conditionnel : erreur / liste vide / liste des billets */}
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Impossible de charger les billets</p>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      ) : billets.length === 0 ? (
        <p className="text-slate-700">Aucun billet trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {billets.map((billet, index) => (
            <BilletCard key={String(billet.id ?? index)} billet={billet} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
}