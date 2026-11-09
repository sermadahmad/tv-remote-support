import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SITE_URL } from '../site.config.mjs';

export function checkSite(output, siteUrl) {
  const base = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
  const routes = ['', 'privacy/', 'support/', 'testing/'];
  let checkedLinks = 0;
  for (const route of routes) {
    const html = readFileSync(join(output, route, 'index.html'), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /id="main"/);
    assert.ok(
      html.includes(
        `<link rel="canonical" href="${new URL(route, base).href}">`,
      ),
    );
    assert.doesNotMatch(html, /<script\b|<form\b|<iframe\b/i);
    for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = new URL(reference, new URL(route, base));
      assert.ok(['https:', 'mailto:'].includes(target.protocol), reference);
      if (target.origin !== base.origin) continue;
      assert.ok(
        target.pathname.startsWith(base.pathname),
        `Escapes repository prefix: ${reference}`,
      );
      const relative = decodeURIComponent(
        target.pathname.slice(base.pathname.length),
      );
      const file = join(
        output,
        relative,
        target.pathname.endsWith('/') ? 'index.html' : '',
      );
      assert.ok(
        existsSync(file) && statSync(file).size > 0,
        `Missing linked file: ${reference}`,
      );
      if (target.hash) {
        assert.ok(
          readFileSync(file, 'utf8').includes(`id="${target.hash.slice(1)}"`),
        );
      }
      checkedLinks++;
    }
  }
  return { pages: routes.length, localLinks: checkedLinks };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  console.log(checkSite(resolve('dist'), SITE_URL));
}
