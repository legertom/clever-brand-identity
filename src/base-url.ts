const FALLBACK_BASE_URL = "https://clever-brand-identity.vercel.app";

export function baseUrlFromRequest(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? request.headers.get("host");
  const proto = forwardedProto ?? "https";

  return host ? `${proto}://${host}` : FALLBACK_BASE_URL;
}
