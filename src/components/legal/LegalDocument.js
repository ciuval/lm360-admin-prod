import { createElement as h } from "react";

const SITE_ORIGIN = "https://www.lovematch360.com";

export function legalDocumentHref(policy, mode = "app") {
  return mode === "static" ? `/legal/${policy.slug}` : `/#/${policy.slug}`;
}

export function resolveLegalLink(href, policies, mode = "app") {
  const localHref = href.startsWith(`${SITE_ORIGIN}/`)
    ? href.slice(SITE_ORIGIN.length)
    : href;
  const policy = policies.find((item) => {
    const paths = [`/legal/${item.slug}`, `/#/${item.slug}`, `#/${item.slug}`];
    if (item.key === "terms") paths.push("/#/terms", "#/terms");
    return paths.includes(localHref);
  });
  return policy ? legalDocumentHref(policy, mode) : href;
}

function focusSection(event, sectionId) {
  const ownerDocument = event.currentTarget.ownerDocument;
  const section = ownerDocument.getElementById(sectionId);
  if (!section) return;
  section.focus({ preventScroll: true });
  const view = ownerDocument.defaultView;
  const shellHeader = event.currentTarget.closest(".lm360-shell")?.querySelector(":scope > header");
  const headerPosition = shellHeader && view?.getComputedStyle(shellHeader).position;
  const headerHeight = ["sticky", "fixed"].includes(headerPosition)
    ? shellHeader.getBoundingClientRect().height
    : 0;
  if (view) {
    view.scrollTo({
      top: Math.max(0, section.getBoundingClientRect().top + view.scrollY - headerHeight - 24),
      behavior: "auto",
    });
  }
}

/** Shared by the app and the script that produces readable, script-free HTML. */
export default function LegalDocument({ policy, policies, version, dateLabel, mode = "app" }) {
  const titleId = `legal-${policy.key}-title`;
  const sectionId = (section) => `legal-${policy.key}-${section.id}`;

  return h("article", { className: "legal-document", "aria-labelledby": titleId },
    h("header", { className: "legal-document__header" },
      h("p", { className: "legal-document__eyebrow" }, "LoveMatch360 · Regole e trasparenza"),
      h("h1", { id: titleId }, policy.title),
      h("p", { className: "legal-document__description" }, policy.description),
      h("p", { className: "legal-document__version" },
        "Versione del ", h("time", { dateTime: version }, dateLabel)),
      mode === "app" ? h("p", { className: "legal-document__edition" },
        h("a", { href: legalDocumentHref(policy, "static"), target: "_blank", rel: "noopener noreferrer" },
          "Versione per stampa e condivisione (nuova scheda)")) : null,
    ),
    h("nav", { className: "legal-document__navigation", "aria-label": "Documenti e contatti" },
      ...policies.map((item) => h("a", {
        key: item.key,
        href: legalDocumentHref(item, mode),
        "aria-current": item.key === policy.key ? "page" : undefined,
      }, item.title)),
      h("a", { href: "/#/privacy" }, "Privacy"),
      h("a", { href: "/#/contatti" }, "Contatti"),
    ),
    h("nav", { className: "legal-document__toc", "aria-labelledby": `legal-${policy.key}-index` },
      h("h2", { id: `legal-${policy.key}-index` }, "In questa pagina"),
      h("ul", null, ...policy.sections.map((section) =>
        h("li", { key: section.id }, mode === "static"
          ? h("a", { href: `#${sectionId(section)}` }, section.title)
          : h("button", {
            type: "button",
            onClick: (event) => focusSection(event, sectionId(section)),
          }, section.title)),
      )),
    ),
    ...policy.sections.map((section) => h("section", {
      key: section.id,
      className: "legal-document__section",
      "aria-labelledby": sectionId(section),
    },
    h("h2", { id: sectionId(section), tabIndex: -1 }, section.title),
    ...(section.paragraphs || []).map((paragraph, index) => h("p", { key: `p-${index}` }, paragraph)),
    section.items?.length ? h("ul", null,
      ...section.items.map((item, index) => h("li", { key: `item-${index}` }, item))) : null,
    section.links?.length ? h("ul", { className: "legal-document__links" },
      ...section.links.map((link, index) => h("li", { key: `link-${index}` },
        h("a", { href: resolveLegalLink(link.href, policies, mode) }, link.label)))) : null,
    )),
    h("footer", { className: "legal-document__footer" },
      h("p", null, "LoveMatch360 · ", policy.title, " · ", dateLabel),
      h("a", { href: "/" }, "Torna al sito"),
    ),
  );
}
