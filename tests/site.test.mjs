import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from '../generate.mjs';
import { checkSite } from '../scripts/check-site.mjs';

for (const siteUrl of [
  'https://sermadahmad.github.io/tv-remote-support/',
  'https://example.org/deep/project',
  'https://example.org/',
]) {
  test(`clean generation and complete links: ${siteUrl}`, () => {
    const output = mkdtempSync(join(tmpdir(), 'tvremote-site-'));
    try {
      const result = build({ siteUrl, output });
      assert.equal(checkSite(output, result.siteUrl).pages, 4);
      const privacy = readFileSync(join(output, 'privacy/index.html'), 'utf8');
      assert.match(
        privacy,
        /GitHub records visitors’ IP addresses for security/,
      );
      const testing = readFileSync(join(output, 'testing/index.html'), 'utf8');
      assert.match(
        testing,
        /approved and available to selected closed testers/,
      );
      assert.match(
        testing,
        /https:\/\/groups.google.com\/g\/universal-tv-remote-testers-sermadahmad\/about/,
      );
      assert.match(
        testing,
        /https:\/\/play.google.com\/apps\/testing\/com.sermadahmad.tvremote/,
      );
    } finally {
      rmSync(output, { recursive: true, force: true });
    }
  });
}

test('rejects unsafe deployment URLs before writing output', () => {
  for (const siteUrl of [
    'http://example.org/',
    'https://user:secret@example.org/',
    'https://example.org/?token=x',
  ]) {
    assert.throws(() => build({ siteUrl }), /SITE_URL must be/);
  }
});
