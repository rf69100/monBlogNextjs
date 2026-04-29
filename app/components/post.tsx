"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BilletService } from "../services/BilletService";
import { formatDate } from "../lib/utils";
import { isLoggedIn } from "../lib/auth";
import type { BilletDetail, Commentaire } from "../types";

function CommentaireItem({ commentaire, index }: { commentaire: Commentaire; index: number }) {
  const date = commentaire.Date ? formatDate(commentaire.Date) : null;
  const initials = (commentaire.Auteur ?? "?").slice(0, 2).toUpperCase();

  return (
    <li className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-semibold text-slate-800">
            {commentaire.Auteur ?? "Anonyme"}
          </span>
          {date && (
            <time className="text-xs text-slate-400">{date}</time>
          )}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {commentaire.Contenu ?? `Commentaire ${index + 1}`}
        </p>
      </div>
    </li>
  );
}

export default function Post() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [billet, setBillet]      = useState<BilletDetail | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);
  const [loading, setLoading]    = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    BilletService.fetchBilletDetail(id)
      .then(setBillet)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 text-sm gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Chargement…
      </div>
    );
  }

  const date = billet?.Date ? formatDate(billet.Date) : null;
  const commentaires: Commentaire[] = billet?.commentaires ?? [];

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition-colors mb-8"
      >
        ← Retour aux billets
      </Link>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-semibold">Impossible de charger le billet</p>
          <p className="mt-1 text-sm opacity-80">{errorMessage}</p>
        </div>
      ) : billet && (
        <article className="space-y-10">
          {/* En-tête de l'article */}
          <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {date && (
              <time className="mb-3 block text-xs font-semibold uppercase tracking-widest text-violet-500">
                {date}
              </time>
            )}
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {billet.Titre ?? "Billet sans titre"}
            </h1>
            {billet.Contenu && (
              <p className="mt-6 text-slate-600 leading-relaxed text-base border-t border-slate-100 pt-6">
                {billet.Contenu}
              </p>
            )}
          </header>

          {/* Section commentaires */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Commentaires</h2>
              {commentaires.length > 0 && (
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                  {commentaires.length}
                </span>
              )}
            </div>

            {commentaires.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
                <p className="text-sm">Aucun commentaire pour ce billet.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {commentaires.map((c, i) => (
                  <CommentaireItem key={String(c.id ?? i)} commentaire={c} index={i} />
                ))}
              </ul>
            )}
          </section>
        </article>
      )}
    </div>
  );
}
