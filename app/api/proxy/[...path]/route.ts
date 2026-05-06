import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "../../../lib/api-config";

// Forward browser requests to the external API server-side, bypassing CORS.
// The external API only whitelists the Vercel production domain, not localhost.
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${API_BASE_URL}/${path.join("/")}`;

  const headers: Record<string, string> = { Accept: "application/json" };

  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const contentType = request.headers.get("Content-Type");
  if (contentType) headers["Content-Type"] = contentType;

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const upstream = await fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseBody = await upstream.text();

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export { proxyRequest as GET, proxyRequest as POST };
