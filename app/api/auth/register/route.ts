/**
 * Proxy serveur pour POST /register.
 * Même logique que le proxy /login : gestion CSRF côté serveur Next.js
 * pour contourner les restrictions cross-origin du navigateur.
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
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.register}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept":        "application/json",
      ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken, Cookie: setCookie }),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
