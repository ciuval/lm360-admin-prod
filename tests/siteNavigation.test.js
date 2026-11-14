import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const publicDestinations = [
  "/",
  "/welcome",
  "/come-funziona",
  "/scopri",
  "/libro",
  "/soluzioni",
  "/faq",
  "/sicurezza",
  "/contatti",
  "/premium",
];

test("la Home propone otto destinazioni reali, disponibili senza account", async () => {
  const [home, app] = await Promise.all([read("src/pages/Home.jsx"), read("src/App.jsx")]);
  const routes = new Set([...app.matchAll(/\bpath="(\/[^"]*)"/g)].map((x) => x[1]));
  for (const path of publicDestinations) {
    assert.ok(routes.has(path), `Route pubblica non dichiarata: ${path}`);
  }
  assert.match(home, /explorePaths\.map/);
  assert.match(home, /account\.isAuthed && item\.authTo/);
  const items = [...home.matchAll(/\{ title: "[^"]+", text: "[^"]+", to: "\/[^"]+"(?:, authTo: "[^"]+")? \}/g)];
  assert.equal(items.length, 8);
  for (const match of home.matchAll(/to: "(\/[^"]+)"/g)) {
    assert.ok(routes.has(match[1]), `Percorso Home inesistente: ${match[1]}`);
  }
});

test("il menu offre percorsi principali e il guest può registrarsi o accedere", async () => {
  const shell = await read("src/AppShell.jsx");
  for (const label of ["Come funziona", "Scopri persone", "Idee e articoli", "Libro", "Servizi web", "FAQ", "Sicurezza"]) {
    assert.ok(shell.includes(`>${label}</ShellLink>`), `Voce mancante: ${label}`);
  }
  assert.match(shell, /navigate\("\/register"\)/);
  assert.match(shell, /navigate\("\/login"\)/);
  assert.match(shell, /showAdminLink \? <ShellLink to="\/admin">Regia/);
  assert.doesNotMatch(shell, />Messaggi<\/ShellLink>/);
  assert.doesNotMatch(shell, /console\.(?:log|warn|error)/);
});

test("il footer non offre aree admin ai visitatori", async () => {
  const footer = await read("src/components/SiteFooter.jsx");
  const shell = await read("src/AppShell.jsx");
  assert.match(footer, /group\.title !== "Dietro le quinte" \|\| isAdmin/);
  assert.match(footer, /label: "Registrati", href: "#\/register"/);
  assert.match(footer, /label: "Accedi", href: "#\/login"/);
  assert.match(shell, /<SiteFooter isAuthed=\{isAuthed\} isAdmin=\{showAdminLink\} \/>/);
});

test("le schermate di autenticazione e pagina inesistente permettono di tornare", async () => {
  const login = await read("src/pages/LoginPage.jsx");
  const register = await read("src/pages/RegisterPage.jsx");
  const notFound = await read("src/pages/NotFound.jsx");
  for (const source of [login, register, notFound]) {
    assert.match(source, /<Link to="\/"/);
  }
  assert.match(login, /<Link to="\/sicurezza"/);
  assert.match(register, /<Link to="\/faq"/);
  assert.match(notFound, /Torna alla Home/);
});

test("navigazione touch e tastiera accessibile", async () => {
  const shell = await read("src/AppShell.jsx");
  assert.match(shell, /aria-label="Navigazione principale"/);
  assert.match(shell, /contenuto-principale/);
  assert.match(shell, /Vai al contenuto/);
  assert.match(shell, /\.lm360-shell-nav\s*\{/);
  assert.match(shell, /overflow-x: auto/);
  assert.match(shell, /focus-visible/);
  assert.match(shell, /minHeight: 44/);
});

test("link di menu, footer e Home puntano a route o file pubblici previsti", async () => {
  const [app, shell, footer, home, vercel] = await Promise.all([
    read("src/App.jsx"), read("src/AppShell.jsx"),
    read("src/components/SiteFooter.jsx"), read("src/pages/Home.jsx"),
    read("vercel.json"),
  ]);
  const routes = new Set([...app.matchAll(/\bpath="(\/[^"]*)"/g)].map(x => x[1]));
  const rewrites = new Set(JSON.parse(vercel).rewrites.map(x => x.source));
  const links = [shell, footer, home].flatMap(s =>
    [...s.matchAll(/(?:to|href)\s*[:=]\s*["'](#?\/[^"']+)["']/g)]
      .map(x => x[1].replace(/^#/, "").split("?")[0])
  );
  const ignored = new Set(["/recupero-password"]);
  for (const path of links) {
    if (path.startsWith("/legal/") || path === "/manifesto-sicurezza") {
      assert.ok(rewrites.has(path), `Manca rewrite HTML per ${path}`);
    } else if (!ignored.has(path)) {
      assert.ok(routes.has(path), `Collegamento senza route: ${path}`);
    }
  }
  assert.ok(links.length >= 35, "Audit link troppo piccolo");
});
