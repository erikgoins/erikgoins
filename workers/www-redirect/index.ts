/**
 * Redirects www.erikgoins.com to the apex, keeping the path and query string.
 *
 * The site itself is an assets-only Worker with no code (see decision 004).
 * This Worker exists only so the www hostname answers with a redirect instead
 * of an error, without putting code in front of every request to the site.
 */
const APEX = "erikgoins.com";

function redirectToApex(request: Request): Response {
  const url = new URL(request.url);
  url.protocol = "https:";
  url.hostname = APEX;
  url.port = "";
  return Response.redirect(url.toString(), 301);
}

const worker = { fetch: redirectToApex };

export default worker;
