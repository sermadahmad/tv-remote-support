# Universal TV Remote support website

Public privacy, setup help and closed-test instructions for Universal TV Remote.
This repository contains website source and branding only. The mobile application,
pairing credentials, publishing keys and native projects belong elsewhere.

Published address: https://sermadahmad.github.io/tv-remote-support/

## Build and check

Use Node 24.19 or newer. No dependency installation or network access is needed:

```sh
npm test
npm run build
npm run check
```

Generated `dist/` is ignored. A clean checkout copies editable assets from
`public/assets/` and generates all four routes: `/`, `/privacy/`, `/support/`,
and `/testing/`. Edit policy text in `content/privacy.md` and verified testing
details in `content/testing.json`.

`SITE_URL` in `site.config.mjs` is the single deployment URL setting. It can be
overridden with the `SITE_URL` environment variable. Navigation, asset paths and
canonical links derive from it, including GitHub Pages' repository prefix.

## Deployment

The website-only Pages workflow tests, builds and checks local links before
publishing on pushes to `main` or a manual run. Enable Pages with the GitHub
Actions source in repository settings once; no personal access token belongs in
the workflow. Deployment uses GitHub's temporary OIDC credential and the
`github-pages` environment. Third-party Actions are pinned to reviewed commits.

The app repository's commits and Expo workflows are independent of this site.
The legacy Sites pages remain online for version 11 and link here.

### First publication by the repository owner

1. Create an empty **public** `sermadahmad/tv-remote-support` repository on
   GitHub, without a generated README, license or `.gitignore`. If that repository
   already contains unrelated work, stop rather than overwrite it.
2. This local repository uses the existing `github-sermad` SSH alias, matching
   the mobile repository. Unlock that SSH key when Git prompts, then run
   `git push -u origin main` from this repository. Do not force push.
3. In GitHub **Settings → Pages**, choose **GitHub Actions** as the source. If
   the initial workflow ran before Pages was enabled, rerun **Publish support
   website** from the Actions tab. No paid domain is required.
4. Confirm the workflow succeeds and open all four routes without signing in.
   Only then switch app and Play Console links. Pushes from this repository do
   not push the mobile repository.

Commits use repository-local identity `sermadahmad <sermadahmad024@gmail.com>`.
No GitHub CLI login or other GitHub account is required for the manual SSH push.

## Privacy and artwork

There is no browser JavaScript, analytics, sign-in or submission form. GitHub Pages
records visitor IP addresses for security. The published privacy page documents
hosting, voluntary email support and Google testing/update services.

Colors: navy `#101827`, teal `#19B8A6`, mint `#63D7C1`, paper `#F5F7FA`.
The SVG symbol is original application artwork. The outlined Inter wordmark is
distributed with its applicable [SIL Open Font License](LICENSES/Inter-OFL.txt).
Body text uses native system fonts. Preserve license notices when redistributing
the font-derived artwork. No TV-manufacturer logos are included.
