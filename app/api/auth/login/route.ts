/**
 * Proxy serveur pour POST /login.
 * Gère le CSRF côté serveur et normalise la réponse token pour le client.
 *
 * Note : l'API retourne le token en texte brut (ex: "12|xyz..."),
 * pas en JSON. Ce proxy le normalise en { auth_token: "..." }.
 */

import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, APP_BASE_URL, ENDPOINTS } from "../../../lib/api-config";

export async function POST(request: NextRequest) {
  // Étape 1 : obtenir le cookie CSRF
  const csrfResponse = await fetch(`${APP_BASE_URL}/sanctum/csrf-cookie`);
  const setCookie    = csrfResponse.headers.get("set-cookie") ?? "";
  const xsrfMatch   = setCookie.match(/XSRF-TOKEN=([^;,]+)/);
  const xsrfToken   = xsrfMatch ? decodeURIComponent(xsrfMatch[1]) : "";

  // Étape 2 : transmettre la requête avec le token CSRF
  const body     = await request.json();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept":        "application/json",
      ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken, Cookie: setCookie }),
    },
    body: JSON.stringify(body),
  });

  // Étape 3 : lire la réponse en texte brut (l'API retourne le token directement)
  const rawText = await response.text();

  if (!response.ok) {
    return NextResponse.json(
      { message: rawText || `Erreur ${response.status}` },
      { status: response.status }
    );
  }

  // Normaliser en JSON pour que BilletService puisse lire auth_token
  return NextResponse.json({ auth_token: rawText.trim() }, { status: 200 });
}
