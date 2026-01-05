// check-imports-advanced.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const baseDir = './src';
const fileExtensions = ['.js', '.jsx'];
const npmPackages = new Set();

const findImports = (code) => {
  const regex = /import\s+.*?['"](.*?)['"]/g;
  const imports = [];
  let match;
  while ((match = regex.exec(code))) {
    imports.push(match[1]);
  }
  return imports;
};

const checkFile = (importPath, currentDir) => {
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    npmPackages.add(importPath.split('/')[0]);
    return 'npm';
  }

  const fullPath = path.resolve(currentDir, importPath);
  for (const ext of fileExtensions) {
    const file = fullPath + ext;
    if (fs.existsSync(file)) return true;
  }
  return false;
};

const scanDir = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fileExtensions.includes(path.extname(file))) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      const imports = findImports(code);
      for (const imp of imports) {
        const result = checkFile(imp, path.dirname(fullPath));
        if (result === false) {
          console.log(`❌ Import MANCANTE in ${fullPath} → "${imp}"`);
        }
      }
    }
  }
};

const checkNpmPackages = () => {
  const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const declaredDeps = new Set([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {})
  ]);

  console.log('\n📦 Controllo pacchetti NPM...');
  npmPackages.forEach((pkg) => {
    if (!declaredDeps.has(pkg)) {
      console.log(`⚠️  Pacchetto mancante: "${pkg}" → puoi installare con: npm install ${pkg}`);
    }
  });
};

console.log("🧪 Avvio scansione import...");
scanDir(baseDir);
checkNpmPackages();
console.log("\n✅ Diagnostica completata.");