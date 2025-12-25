const fs = require("fs");
const path = require("path");

function out(k, v) {
  console.log(`[precheck] ${k}:`, v);
}

out("cwd", process.cwd());
out("VERCEL_GIT_COMMIT_SHA", process.env.VERCEL_GIT_COMMIT_SHA || null);

const premium = path.join("src", "pages", "Premium.jsx");
out("exists src/pages/Premium.jsx", fs.existsSync(premium));

try {
  const entries = fs.readdirSync(path.join("src", "pages"));
  out("src/pages entries", entries);
} catch (e) {
  out("src/pages entries", "ERR: " + e.message);
}

try {
  const app = fs.readFileSync(path.join("src", "App.jsx"), "utf8");
  const m = app.match(/from\s+"(\.\/pages\/Premium[^"]*)"/);
  out("Premium import literal", m ? JSON.stringify(m[1]) : null);
} catch (e) {
  out("read src/App.jsx", "ERR: " + e.message);
}
