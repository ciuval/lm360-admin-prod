/**
 * Ponte360: server HTTP in sola lettura, solo loopback, solo demo.
 * Non richiede Supabase, non legge env di progetto, non modifica alcun file.
 * Arresto con Ctrl+C. Nessun analytics, account o contenuto utente.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const HOST = "127.0.0.1";
const PORT = 5188;
const assets = new Map([
  ["/", ["../../lab/ponte360-family/index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["../../lab/ponte360-family/index.html", "text/html; charset=utf-8"]],
  ["/app.mjs", ["../../lab/ponte360-family/app.mjs", "text/javascript; charset=utf-8"]],
  ["/policy.mjs", ["../../lab/ponte360-family/policy.mjs", "text/javascript; charset=utf-8"]],
  ["/andrea-bianca/", ["../../lab/ponte360-couple/index.html", "text/html; charset=utf-8"]],
  ["/andrea-bianca/app.mjs", ["../../lab/ponte360-couple/app.mjs", "text/javascript; charset=utf-8"]],
  ["/andrea-bianca/policy.mjs", ["../../lab/ponte360-couple/policy.mjs", "text/javascript; charset=utf-8"]],
]);

const security = {
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'none'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
};

const server = createServer(async (request, response) => {
  for (const [key, value] of Object.entries(security)) response.setHeader(key, value);
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  let pathname;
  try { pathname = new URL(request.url, "http://127.0.0.1").pathname; }
  catch { response.writeHead(400).end(); return; }
  if (pathname === "/favicon.ico") {
    response.writeHead(204).end(); return;
  }
  const asset = assets.get(pathname);
  if (!asset) { response.writeHead(404).end(); return; }
  try {
    const bytes = await readFile(new URL(asset[0], import.meta.url));
    response.writeHead(200, {
      "Content-Type": asset[1],
      "Content-Length": bytes.length,
    });
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch {
    response.writeHead(500).end();
  }
});
server.on("error", () => {
  process.stderr.write("PONTE360_FAMILY_LOCAL_SERVER=FAIL\n");
  process.exitCode = 1;
});
server.listen(PORT, HOST, () => {
  process.stdout.write("PONTE360_FAMILY_LAB=http://127.0.0.1:5188/\n");
  process.stdout.write("DEMO_ONLY=YES\n");
  process.stdout.write("Arresta con Ctrl+C. Nessun account o dato salvato.\n");
});
