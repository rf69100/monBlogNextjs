// Clé utilisée pour stocker le token dans le localStorage.
// Exportée afin que BilletService puisse écrire/supprimer le token
// avec la même clé sans la dupliquer.
export const TOKEN_KEY = "auth_token";

/**
 * Indique si l'utilisateur est actuellement connecté.
 * Retourne true si un token existe dans le localStorage, false sinon.
 */
export function isLoggedIn(): boolean {
  if (typeof localStorage === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Retourne le token d'authentification stocké dans le localStorage.
 * Retourne null si aucun token n'existe (utilisateur non connecté).
 */
export function getAuthToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
