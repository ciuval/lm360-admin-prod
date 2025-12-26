export function setSEO(title, description) {
  try {
    if (title) document.title = title;
    if (description !== undefined) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement("meta"); m.setAttribute("name","description"); document.head.appendChild(m); }
      m.setAttribute("content", description || "");
    }
  } catch {}
}

export function injectJSONLD(obj) {
  try {
    let s = document.getElementById("jsonld-dynamic");
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "jsonld-dynamic"; document.head.appendChild(s); }
    s.textContent = JSON.stringify(obj);
  } catch {}
}
