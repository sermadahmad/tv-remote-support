import {
  readFileSync,
  mkdirSync,
  writeFileSync,
  cpSync,
  rmSync,
} from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from './site.config.mjs';

const root = dirname(fileURLToPath(import.meta.url));
export function build({
  siteUrl = SITE_URL,
  output = join(root, 'dist'),
} = {}) {
  const base = new URL(siteUrl);
  if (
    base.protocol !== 'https:' ||
    base.search ||
    base.hash ||
    base.username ||
    base.password
  )
    throw new Error(
      'SITE_URL must be an HTTPS base URL without credentials, query or fragment.',
    );
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const url = (path = '') => new URL(path.replace(/^\//, ''), base).href;
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  cpSync(join(root, 'public'), output, { recursive: true });
  const config = JSON.parse(
    readFileSync(join(root, 'content/testing.json'), 'utf8'),
  );
  const esc = (s) =>
    s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  const inline = (s) =>
    esc(s)
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
        '<a href="$2">$1</a>',
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const md = (s) =>
    s
      .trim()
      .split(/\n\s*\n/)
      .map((p) => {
        const h = p.match(/^(#{1,3}) (.*)$/);
        return h
          ? `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`
          : `<p>${inline(p.replaceAll('\n', ' '))}</p>`;
      })
      .join('\n');
  const css = `:root{color-scheme:dark;--navy:#101827;--teal:#19b8a6;--mint:#63d7c1;--paper:#f5f7fa;--muted:#bbc7d8}*{box-sizing:border-box}body{margin:0;background:var(--navy);color:var(--paper);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75;font-size:18px}a{color:var(--mint);text-underline-offset:5px}a:hover{color:white}a:focus-visible{outline:3px solid var(--mint);outline-offset:5px;border-radius:3px}.skip{position:absolute;left:-9999px}.skip:focus{left:20px;top:12px;background:var(--navy);padding:12px;z-index:2}header,main,footer{width:min(100% - 40px,1080px);margin:auto}header{display:flex;gap:24px;justify-content:space-between;align-items:center;flex-wrap:wrap;padding:30px 0;border-bottom:1px solid #334155}.brand{display:flex;align-items:center;gap:14px;text-decoration:none;min-height:48px}.brand img{width:44px;height:44px}.brand span{font-weight:650;font-size:18px;color:var(--paper)}nav{display:flex;gap:24px;flex-wrap:wrap}nav a{display:inline-flex;align-items:center;min-height:48px;text-decoration:none;font-size:16px}main{padding:64px 0 84px;max-width:800px}h1{font-size:clamp(32px,6vw,56px);line-height:1.15;letter-spacing:-.035em;margin:14px 0 30px}h2{font-size:26px;line-height:1.35;margin:44px 0 16px;letter-spacing:-.02em}p,li{color:var(--muted)}strong{color:var(--paper)}li{margin:14px 0}.eyebrow{color:var(--mint);font-size:13px;letter-spacing:.16em;font-weight:700;text-transform:uppercase}.lead{font-size:22px;line-height:1.55}.note{border-left:3px solid var(--teal);padding:14px 22px;background:#172436;border-radius:0 12px 12px 0}.button{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:12px 22px;background:var(--teal);color:var(--navy);font-weight:700;text-decoration:none;border-radius:14px;margin:8px 8px 8px 0}.button:hover{background:var(--mint);color:var(--navy)}.links{margin-top:32px;display:grid;gap:16px}.links a{padding:22px;border:1px solid #334155;border-radius:16px;text-decoration:none;font-weight:600}.links span{display:block;color:var(--muted);font-weight:400;font-size:16px;margin-top:6px}footer{padding:28px 0 40px;border-top:1px solid #334155;font-size:14px;color:var(--muted)}footer a{margin-right:20px}@media(max-width:500px){main{padding-top:38px}header{gap:6px;padding:16px 0}nav{gap:20px}body{font-size:17px}.lead{font-size:20px}}`;
  function page(path, title, body, description) {
    const dir = join(output, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      `${dir}/index.html`,
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#101827"><title>${esc(title)} — Universal TV Remote</title><link rel="canonical" href="${url(path)}"><link rel="icon" href="${url('/assets/symbol.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${url('/assets/styles.css')}"></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="${url('/')}"><img src="${url('/assets/symbol.svg')}" alt="" width="44" height="44"><span>Universal TV Remote</span></a><nav aria-label="Main navigation"><a href="${url('/privacy/')}">Privacy</a><a href="${url('/support/')}">Support</a><a href="${url('/testing/')}">Closed test</a></nav></header><main id="main">${body}</main><footer><p>Universal TV Remote · SERMAD AHMAD</p><a href="mailto:fixemj@gmail.com">fixemj@gmail.com</a><a href="${url('/privacy/')}">Privacy policy</a><p>Independent app. Not affiliated with Google or TV manufacturers.</p></footer></body></html>`,
    );
  }
  writeFileSync(join(output, 'assets/styles.css'), css);
  page(
    '/',
    'Privacy & support',
    `<div class="eyebrow">Your TV. Within reach.</div><h1>A familiar remote.<br>A little help, when needed.</h1><p class="lead">Universal TV Remote connects your Android phone to a compatible Android TV or Google TV on your home Wi-Fi.</p><p>No advertising. No app account required. Control availability depends on your TV and its software.</p><div class="links"><a href="${url('/support/')}">Get connected<span>Setup steps, compatibility, and help finding your TV.</span></a><a href="${url('/privacy/')}">Read our privacy policy<span>Local TV data, Google Play updates, and your choices.</span></a><a href="${url('/testing/')}">Join the closed test<span>Eligibility, enrollment, and useful testing feedback.</span></a></div>`,
    'Privacy, setup help, contact details and closed-test instructions for Universal TV Remote.',
  );
  page(
    '/privacy/',
    'Privacy policy',
    md(readFileSync(join(root, 'content/privacy.md'), 'utf8')),
    'Local TV information, Google Play updates, website requests and support correspondence.',
  );
  page(
    '/support/',
    'Support',
    `<div class="eyebrow">A few simple checks</div><h1>Let’s connect your TV.</h1><p class="lead">You need a compatible Android TV or Google TV with Android TV Remote Service, and a phone on the same home Wi-Fi network.</p><h2>Start here</h2><ol><li><strong>Turn on the TV and let it finish starting.</strong> If its remote is missing, look for a physical power button under the front edge, on the side, or on the back. Check the manufacturer’s instructions if unsure.</li><li><strong>Use the same home Wi-Fi.</strong> Guest networks, client isolation and VPNs can prevent devices from seeing each other. Do not change router settings you do not understand.</li><li><strong>Open Devices and let the search finish.</strong> Tap your TV. If asked to pair, enter the six characters shown on the TV using 0–9 and A–F.</li><li><strong>Try Home, Back and the direction buttons.</strong> Volume, media, power and standby behavior depend on the TV and active app.</li></ol><h2>No TV found?</h2><p>Check TV power, the shared network and any local-network permission requested by your phone. Search again. In Advanced connection options, enter the TV’s private IPv4 address from its network settings or the router’s device list. This is one TV address, not a network scan.</p><h2>No physical remote?</h2><p>The app cannot complete a TV’s initial Wi-Fi setup before the TV is reachable on your network. Use physical TV navigation buttons, a compatible replacement remote, or supported input devices if required by the manufacturer.</p><h2>Connection interrupted?</h2><p>Wake the TV with its physical controls if needed, check Wi-Fi, return to the app and retry. If its identity changed or pairing was reset, forget the saved TV and pair again. Forgetting removes local pairing data; it does not revoke authorization stored on the TV.</p><h2>Compatibility and limits</h2><p>Other smart-TV systems and infrared-only TVs are not supported. TV text input is currently unavailable. Waking a TV from standby is not guaranteed. Update checks and these web pages need internet; local TV control does not.</p><h2>Still need help?</h2><p>Email your app version, phone/Android version, TV model and a short description of the issue. Do not send pairing codes, passwords, private keys or unnecessary personal information.</p><a class="button" href="mailto:fixemj@gmail.com?subject=Universal%20TV%20Remote%20support">Email support</a>`,
    'Setup steps, compatibility limits, connection troubleshooting and support contact.',
  );
  const group = config.groupUrl
    ? `<a class="button" href="${esc(config.groupUrl)}">1. Join the Google Group</a>`
    : '<p>The group join link is being verified.</p>';
  const play = config.playOptInUrl
    ? `<a class="button" href="${esc(config.playOptInUrl)}">2. Open the Google Play testing page</a>`
    : '<p>The Play opt-in link will appear once the reviewed closed release is available.</p>';
  page(
    '/testing/',
    'Closed testing',
    `<div class="eyebrow">Help test the real remote</div><h1>Join the closed test.</h1><p class="lead">Use your own compatible Android TV or Google TV and an Android phone on the same home Wi-Fi. The test app uses real TV control.</p><div class="note"><p>${esc(config.releaseStatus)}</p></div><h2>Enroll with the same Google Account</h2><p>First join the Google Group. Then open the Google Play opt-in link, choose to become a tester and install through Play. Joining the group alone does not enroll you in Play testing.</p>${group}${play}<p>If you joined the internal test, leave it before opting into this closed test. No account is created in the remote app.</p><h2>What to try</h2><ul><li>Discovery, pairing, reconnecting after an app restart, Home/Back/direction buttons.</li><li>Volume/mute, touchpad, saving and renaming your TV.</li><li>Backgrounding, returning, Wi-Fi interruptions and larger text.</li><li>Optional Play update notices when a newer eligible version is available.</li></ul><h2>Stay enrolled and send genuine feedback</h2><p>Google requires at least 12 testers opted in continuously for 14 days before this account can apply for production access. Remain opted in throughout the test and actually use the app. Joining a group or opening a link does not count as completed testing.</p><p>Send the app version, phone/Android version, TV model/software, what you tried and the result. Never send pairing codes or credentials.</p><a class="button" href="mailto:fixemj@gmail.com?subject=Universal%20TV%20Remote%20closed-test%20feedback">Send test feedback</a><p>No public release date is promised. Google reviews production eligibility and the submitted app.</p>`,
    'Join the closed test using the Google Group and Google Play enrollment links.',
  );
  return { output, siteUrl: base.href };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = build();
  console.log(`Generated four static pages for ${result.siteUrl}`);
}
