export const API_BASE_URL = "https://www.ryanfonseca.fr/b2lp/api";
export const APP_BASE_URL = "https://www.ryanfonseca.fr/b2lp";

export const ENDPOINTS = {
  billets:        "/billets",
  billetDetail:   (id: string) => `/billets/${id}`,
  commentaires:   "/commentaires",
  user:           "/user",
  login:          "/login",
  logout:         "/user/logout",
  register:       "/register",
  csrfCookie:     `${APP_BASE_URL}/sanctum/csrf-cookie`,
} as const;

/**
 * Routes internes Next.js (proxy serveur).
 * Utilisées par BilletService pour les requêtes POST qui nécessitent CSRF.
 * Le serveur Next.js gère le handshake CSRF côté serveur, sans restriction CORS.
 */
export const PROXY_ENDPOINTS = {
  login:    "/api/auth/login",
  register: "/api/auth/register",
} as const;
