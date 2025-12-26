// public/ld-loader.js – mini loader visivo opzionale
const on = () => document.body.setAttribute("data-loading", "1");
const off = () => document.body.removeAttribute("data-loading");
window.addEventListener("ld-start", on);
window.addEventListener("ld-stop", off);
