import { BilletService } from "../services/BilletService";
import BilletsList from "./billetsList";
import type { Billet } from "../types";

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
          MonBlog
        </div>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight">
          Derniers billets
        </h1>
        <p className="mt-3 text-slate-500 text-lg">
          Retrouvez ici des articles publiés
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
        // Rendu interactif (filtre + cartes) délégué à un Client Component :
        // le fetch reste côté serveur, l'état du filtre vit côté client.
        <BilletsList billets={billets} />
      )}
    </div>
  );
}
