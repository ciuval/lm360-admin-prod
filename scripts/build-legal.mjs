import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LegalDocument from "../src/components/legal/LegalDocument.js";
import { LEGAL_DATE_LABEL, LEGAL_VERSION, legalDocuments } from "../src/content/legalDocuments.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIRECTORY = join(ROOT, "public", "legal");
const SITE_ORIGIN = "https://www.lovematch360.com";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
  })[character]);
}

export function validateLegalDocuments(policies = legalDocuments) {
  const keys = new Set();
  const slugs = new Set();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(LEGAL_VERSION) || !LEGAL_DATE_LABEL.trim()) {
    throw new Error("Versione o data dei documenti legali non valida.");
  }
  for (const policy of policies) {
    if (keys.has(policy.key) || slugs.has(policy.slug) || !/^[a-z][a-z0-9-]*$/.test(policy.slug)) {
      throw new Error(`Chiave o percorso duplicato/non valido: ${policy.key}`);
    }
    keys.add(policy.key);
    slugs.add(policy.slug);
    if (!policy.title?.trim() || !policy.description?.trim() || !policy.sections?.length) {
      throw new Error(`Documento incompleto: ${policy.key}`);
    }
    const sectionIds = new Set();
    for (const section of policy.sections) {
      if (!/^[a-z][a-z0-9-]*$/.test(section.id) || sectionIds.has(section.id) || !section.title?.trim()) {
        throw new Error(`Sezione non valida: ${policy.key}/${section.id}`);
      }
      sectionIds.add(section.id);
      for (const field of ["paragraphs", "items"]) {
        if (section[field] !== undefined && (!Array.isArray(section[field]) ||
          section[field].some((text) => typeof text !== "string" || !text.trim()))) {
          throw new Error(`Testo non valido: ${policy.key}/${section.id}/${field}`);
        }
      }
      if (section.links !== undefined && !Array.isArray(section.links)) {
        throw new Error(`Collegamenti non validi: ${policy.key}/${section.id}`);
      }
      for (const link of section.links || []) {
        if (typeof link.label !== "string" || !link.label.trim() || typeof link.href !== "string" ||
          /[\u0000-\u001f]/.test(link.href) || link.href.startsWith("//") ||
          !/^(https:\/\/|mailto:|\/(?!\/)|#\/)/.test(link.href)) {
          throw new Error(`Collegamento non valido: ${policy.key}/${section.id}`);
        }
      }
    }
  }
  if (keys.size !== 3 || !["terms", "aup", "authorities"].every((key) => keys.has(key))) {
    throw new Error("Sono richiesti i tre documenti terms, aup e authorities.");
  }
}

export function renderLegalHtml(policy, css) {
  const body = renderToStaticMarkup(createElement(LegalDocument, {
    policy,
    policies: legalDocuments,
    version: LEGAL_VERSION,
    dateLabel: LEGAL_DATE_LABEL,
    mode: "static",
  }));
  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <meta name="description" content="${escapeHtml(policy.description)}">
  <title>${escapeHtml(policy.title)} | LoveMatch360</title>
  <link rel="canonical" href="${SITE_ORIGIN}/legal/${escapeHtml(policy.slug)}">
  <style>
${css.trim()}
  </style>
</head>
<body class="legal-standalone">
  <main>${body}</main>
</body>
</html>
`;
}

export async function buildLegal({ check = false } = {}) {
  validateLegalDocuments();
  const css = await readFile(join(ROOT, "src", "styles", "legal.css"), "utf8");
  if (!check) await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const stale = [];
  for (const policy of legalDocuments) {
    const file = join(OUTPUT_DIRECTORY, `${policy.slug}.html`);
    const expected = renderLegalHtml(policy, css);
    if (check) {
      const existing = await readFile(file, "utf8").catch((error) => {
        if (error.code === "ENOENT") return null;
        throw error;
      });
      if (existing !== expected) stale.push(`public/legal/${policy.slug}.html`);
    } else {
      await writeFile(file, expected, "utf8");
    }
  }
  if (stale.length) {
    throw new Error(`Copie HTML mancanti o non aggiornate: ${stale.join(", ")}. Esegui npm run build:legal.`);
  }
  return legalDocuments.length;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.slice(2).some((argument) => argument !== "--check")) {
      throw new Error("Uso: node scripts/build-legal.mjs [--check]");
    }
    const check = process.argv.includes("--check");
    const count = await buildLegal({ check });
    console.log(`${count} documenti legali ${check ? "verificati" : "generati"}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
