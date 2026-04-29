import type { Billet, BilletDetail, CurrentUser } from "../types";
import { API_BASE_URL, ENDPOINTS, PROXY_ENDPOINTS } from "../lib/api-config";
import { getAuthToken, TOKEN_KEY } from "../lib/auth";

export class BilletService {

  // -------------------------------------------------------------------------
  // Helpers privés
  // -------------------------------------------------------------------------

  /**
   * Méthode de fetch centralisée.
   * Ajoute automatiquement le Bearer token pour les routes protégées.
   * Pas de credentials/cookies : l'API utilise l'authentification par Bearer Token.
   */
  private static async request(
    path: string,
    options: RequestInit & { auth?: boolean } = {}
  ): Promise<Response> {
    const { auth, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers as Record<string, string>),
    };

    if (auth) {
      const token = getAuthToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Erreur API ${res.status}`);
    }
    return res;
  }

  // -------------------------------------------------------------------------
  // Méthodes publiques
  // -------------------------------------------------------------------------

  /** GET /billets — liste tous les billets. Pas d'authentification requise. */
  static async fetchBillets(): Promise<Billet[]> {
    const res = await this.request(ENDPOINTS.billets, { cache: "no-store" });
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Réponse API invalide");
    return data as Billet[];
  }

  /** GET /billets/{id} — récupère un billet et ses commentaires. Authentification requise. */
  static async fetchBilletDetail(id: string): Promise<BilletDetail> {
    const res = await this.request(ENDPOINTS.billetDetail(id), {
      auth: true,
      cache: "no-store",
    });
    return res.json();
  }

  /** GET /user — récupère l'utilisateur connecté (id, nom, email). */
  static async fetchCurrentUser(): Promise<CurrentUser> {
    const res = await this.request(ENDPOINTS.user, { auth: true, cache: "no-store" });
    return res.json();
  }

  /** POST /commentaires — soumet un nouveau commentaire. */
  static async postCommentaire(payload: {
    contenu: string;
    date: string;
    billet_id: string | number;
    user_id: number;
  }): Promise<void> {
    await this.request(ENDPOINTS.commentaires, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  }

  /**
   * POST /login via le proxy Next.js.
   * Le proxy gère le CSRF côté serveur ; le browser appelle uniquement
   * notre propre domaine (pas de CORS, pas de restriction cookie).
   * Champ attendu par l'API : email (et non mail malgré le README).
   */
  static async login(email: string, password: string): Promise<void> {
    const res = await fetch(PROXY_ENDPOINTS.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Erreur ${res.status}`);
    }
    const data = await res.json();
    if (!data.auth_token) throw new Error("Connexion échouée — token absent de la réponse.");
    localStorage.setItem(TOKEN_KEY, data.auth_token);
  }

  /** Déconnecte l'utilisateur en supprimant le token du localStorage. */
  static logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * POST /register via le proxy Next.js.
   * Même logique que login : le CSRF est géré côté serveur.
   */
  /**
   * POST /register via le proxy Next.js.
   * Champ attendu par l'API : email (et non mail malgré le README).
   */
  static async register(name: string, email: string, password: string): Promise<void> {
    const res = await fetch(PROXY_ENDPOINTS.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Erreur ${res.status}`);
    }
  }
}
