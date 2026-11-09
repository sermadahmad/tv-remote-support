# Migration verification — November 9, 2026

## Completed locally

- Generated all four routes from an exported, clean source tree with no
  dependency installation, network access or pre-existing `dist/` directory.
- Four Node tests pass: root hosting, the GitHub repository prefix, a nested
  prefix without a trailing slash, and rejection of unsafe deployment URLs.
- The generated site check passes all four pages and 43 local links/references,
  including canonical URLs, loaded asset references and fragment targets.
- Verified approved version-11 wording and preserved the actual Google Group and
  Google Play opt-in URLs. No tester participation or public launch is claimed.
- Isolated headless Chrome checks pass for every route at viewport widths of
  320, 390 and 1280 CSS pixels: no horizontal overflow, loaded logo artwork,
  applied stylesheet and navigation links at least 48 pixels high.
- Visually reviewed 390-pixel mobile and 1280-pixel desktop homepage captures.
  Screenshots and browser diagnostics are temporary local QA files, not public
  repository content. No signed-in Chrome profile was used for those checks.
- Website source includes no runtime JavaScript, forms, analytics or app secrets.
  Inter's font license accompanies the outlined wordmark.
- Repository-local author is `sermadahmad <sermadahmad024@gmail.com>`. Its origin
  is `git@github-sermad:sermadahmad/tv-remote-support.git`; no push was performed.

## Pending publication and cutover

The owner will create/verify the empty public GitHub repository, push `main`
manually and enable GitHub Actions as the Pages source. Until that happens,
the proposed GitHub Pages address is not recorded as a verified live deployment.

After publication: verify the workflow, HTTPS and anonymous access to every
route/asset; update the legacy pages; then switch mobile/Play links and prepare
the next signed Android test release. Version 11 and its existing public links
remain unchanged during this preparation.
