import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LEGAL_DATE_LABEL, LEGAL_VERSION, legalDocuments } from "../src/content/legalDocuments.js";
import LegalDocument from "../src/components/legal/LegalDocument.js";
import { buildLegal } from "../scripts/build-legal.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const escape = (text) => text.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
})[character]);

test("published legal copies match the current source and remain readable without JavaScript", async () => {
  assert.equal(await buildLegal({ check: true }), 3);
  for (const policy of legalDocuments) {
    const html = await read(`public/legal/${policy.slug}.html`);
    assert.match(html, /<html lang="it">/);
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
    assert.ok(html.includes(`href="https://www.lovematch360.com/legal/${policy.slug}"`));
    assert.doesNotMatch(html, /<(script|iframe|form|input|object|embed)\b/i);
    assert.doesNotMatch(html, /\s(onclick|onload|onsubmit|src)=/i);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    for (const section of policy.sections) {
      for (const text of [section.title, ...(section.paragraphs || []), ...(section.items || [])]) {
        assert.ok(html.includes(escape(text)), `Missing content in ${policy.key}/${section.id}`);
      }
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `Duplicate anchor in ${policy.key}`);
    for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.includes(fragment), `Broken fragment ${fragment}`);
    }
    for (const other of legalDocuments) {
      assert.ok(html.includes(`href="/legal/${other.slug}"`));
    }
    assert.ok(html.includes('href="/#/privacy"'));
    assert.ok(html.includes('href="/#/contatti"'));
  }
});

test("the app document is an article, escapes text, and keeps in-page actions out of HashRouter", () => {
  const original = legalDocuments[0];
  const policy = {
    ...original,
    description: '<img src=x onerror="alert(1)"> & testo',
  };
  const html = renderToStaticMarkup(createElement(LegalDocument, {
    policy,
    policies: legalDocuments,
    version: LEGAL_VERSION,
    dateLabel: LEGAL_DATE_LABEL,
  }));
  assert.match(html, /^<article\b/);
  assert.doesNotMatch(html, /<main\b|<img\b/);
  assert.ok(html.includes(escape(policy.description)));
  assert.match(html, /<button type="button">/);
  assert.doesNotMatch(html, /href="#legal-/);
  for (const other of legalDocuments) {
    assert.ok(html.includes(`href="/#/${other.slug}"`));
  }
});

test("canonical legal URLs resolve to existing static documents before the SPA fallback, preserving the book route", async () => {
  const config = JSON.parse(await read("vercel.json"));
  const fallbackIndex = config.rewrites.findIndex((entry) => entry.source === "/(.*)");
  assert.ok(fallbackIndex >= 0);
  for (const policy of legalDocuments) {
    const source = `/legal/${policy.slug}`;
    const rewriteIndex = config.rewrites.findIndex((entry) => entry.source === source);
    assert.ok(rewriteIndex >= 0 && rewriteIndex < fallbackIndex, `${source} must precede SPA fallback`);
    const destination = config.rewrites[rewriteIndex].destination;
    assert.equal(destination, `${source}.html`);
    await access(fileURLToPath(new URL(`public${destination}`, root)));
    for (const suffix of [".html", "/"]) {
      const redirect = config.redirects.find((entry) => entry.source === `${source}${suffix}`);
      assert.deepEqual(redirect, { source: `${source}${suffix}`, destination: source, permanent: true });
    }
  }
  assert.deepEqual(config.rewrites.find((entry) => entry.source === "/libro"), {
    source: "/libro", destination: "/libro.html",
  });
  for (const source of ["/libro.html", "/libro/"]) {
    assert.deepEqual(config.redirects.find((entry) => entry.source === source), {
      source, destination: "/libro", permanent: true,
    });
  }
});
