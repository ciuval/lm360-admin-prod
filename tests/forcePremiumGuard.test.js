import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Valuta soltanto FORCE: non importa i componenti e non accede ai servizi.
const cases = [
  ['production + flag true', false, 'true', 'localhost', false],
  ['production sito', false, 'true', 'www.lovematch360.com', false],
  ['development sito', true, 'true', 'www.lovematch360.com', false],
  ['hostname simile', true, 'true', 'localhost.example.org', false],
  ['localhost', true, 'true', 'localhost', true],
  ['loopback IPv4', true, 'true', '127.0.0.1', true],
  ['loopback IPv6', true, 'true', '[::1]', true],
  ['flag false', true, 'false', 'localhost', false],
  ['flag assente', true, undefined, 'localhost', false],
  ['senza browser', true, 'true', null, false],
  ['DEV non booleano', 'true', 'true', 'localhost', false],
];

for (const file of ['FacebookLike.jsx', 'VideoPage.jsx']) {
  const source = readFileSync(
    new URL(`../src/pages/${file}`, import.meta.url), 'utf8'
  );

  const found = [...source.matchAll(/\bconst\s+FORCE\s*=\s*([^;]+);/g)];
  assert.equal(found.length, 1, `${file}: FORCE non univoco`);

  const expression = found[0][1].replaceAll('import.meta.env', 'env');

  for (const [label, dev, flag, host, expected] of cases) {
    test(`${file}: ${label}`, () => {
      const context = {
        env: { DEV: dev, VITE_FORCE_PREMIUM: flag },
        window: host === null
          ? undefined
          : { location: { hostname: host } },
      };

      assert.equal(
        runInNewContext(`(${expression})`, context, { timeout: 1000 }),
        expected
      );
    });
  }
}
