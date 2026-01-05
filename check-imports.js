// check-imports.js
import fs from 'fs';
import path from 'path';

const baseDir = './src';
const fileExtensions = ['.js', '.jsx'];

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
  // ignora pacchetti npm
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) return 'npm';

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

console.log("🧪 Avvio scansione import...");
scanDir(baseDir);
console.log("✅ Completata.");