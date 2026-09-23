# Mitsab Resources Global — Website Prototype

A multi-page prototype for mitsabresources.com — plain HTML, CSS and
JavaScript, no build step, no framework required.

## What's inside

```
mitsab-prototype/
├── index.html          Home
├── about.html          About Us
├── services.html       All 11 services + how we work
├── projects.html       Projects (slider + grid view)
├── newsroom.html       Newsroom / articles
├── subsidiaries.html   T-SAB Resources, De-Absareal Global, Mitsab Security
├── contact.html        Contact form
├── css/
│   └── style.css       All styles for every page
├── js/
│   ├── config.js        APP_URL / environment detection (load first)
│   ├── hero-scene.js    Three.js wireframe hero (home page only)
│   ├── particles-config.js  particles.js network backgrounds
│   └── main.js          Preloader, nav dropdowns, cursor, WOW.js init,
│                         counters, card tilt, magnetic buttons, marquee,
│                         Swiper sliders, slide/grid view toggle
└── README.md
```

## Content sourced from the live site

Several real details were pulled from screenshots of the current
mitsabresources.com and folded into this rebuild (copy rewritten,
not copied verbatim):

- **Stats**: 120K+ happy customers, 150+ completed projects, 44+
  expert workers, 89+ awards.
- **All 11 services**: General Contracting, Project & Program
  Management, Manpower Supply & Management, Renovation &
  Remodeling, Minor Civil Maintenance, Welding & Fabrication,
  Pre-Construction Services, Borehole Drilling, Earthwork &
  Landscaping, CAT Engine Service & Maintenance, Marine
  Transportation Services.
- **Subsidiaries**: T-SAB Resources (parent), De-Absareal Global
  Limited (scaffold/tank maintenance), Mitsab Security Services
  Limited.
- **Real projects**: safety infrastructure at a Frontier Oil
  facility, precast concrete works at a drilling camp (Qua Iboe
  Field), infrastructure for a military base — all in Ibeno LGA,
  Akwa Ibom State.
- **Testimonials**: paraphrased from ALSCON and RUSAL.
- **Contact details**: info@mitsabresourcesglobal.com,
  mit-sabresources@outlook.com, +234 802 385 1800, +234 706 791 2527.

Anything still in `[ square brackets ]` — a couple of project
entries, article write-ups, and the legal pages linked in the
footer — genuinely wasn't visible in the screenshots and needs the
real copy from the client.

## Running it locally

No build tools needed. Two options:

**A. Just open it**
Double-click `index.html`. Everything works, including the `APP_URL`
detection in `js/config.js` (it falls back to a `file://` path).

**B. Serve it (recommended — some browsers restrict `file://` pages)**
From inside the `mitsab-prototype/` folder:

```bash
# Python 3
python3 -m http.server 5500

# or Node
npx serve .
```

Then visit `http://localhost:5500/`.

## Deploying to your server

This is static HTML/CSS/JS — it runs on literally any web host.

1. Upload the whole `mitsab-prototype/` folder to your server (root of
   the domain, or a subfolder — both work, see below).
2. Point your domain / subdomain at that folder.
3. Done. No server-side runtime, database or build step required.

Works as-is on: shared hosting (cPanel, etc.), Netlify, Vercel, GitHub
Pages, S3 + CloudFront, or a plain Nginx/Apache box.

### `APP_URL` — local vs. production

`js/config.js` is loaded first on every page and exposes a global:

```js
window.APP_CONFIG.ENVIRONMENT   // 'local' | 'production'
window.APP_CONFIG.APP_URL       // absolute URL to the project root,
                                 // with a trailing slash
window.APP_CONFIG.asset('img/foo.png') // APP_URL + 'img/foo.png'
```

It auto-detects the root by walking back from its own `<script>` tag,
so it works whether the site is hosted at:

- `https://mitsabresources.com/` (domain root), or
- `https://somehost.com/mitsab/` (a subfolder), or
- opened directly from disk (`file:///Users/you/.../index.html`)

If you'd rather set it explicitly instead of relying on detection
(e.g. once you know the final production domain), open
`js/config.js` and fill in the `OVERRIDES` object near the bottom:

```js
var OVERRIDES = {
  local: null,                              // e.g. 'http://localhost:5500/'
  production: 'https://mitsabresources.com/' // set this once confirmed
};
```

Internal navigation (the nav bar, footer links, buttons) all use
plain relative paths (`about.html`, `css/style.css`, …), so the site
works correctly even before you touch `APP_URL` — that constant only
matters once a script needs to build an absolute URL itself (for
example, calling an API on the same host, or generating a sitemap
link).

## What's a placeholder

Anything wrapped in `[ square brackets ]`, and the note above the
stats panel on the Company page, is layout filler — real phone
number, email, address, and verified project details still need to
go in before this ships. Nothing in this prototype was copied from
the live site; copy was written fresh around the public facts that
could be confirmed (company name, RC 1667132, parent company T-SAB
Resources, and the listed service lines).

## Effects used

- **Three.js** — deforming wireframe terrain + a live constellation
  of connecting nodes in the home page hero.
- **particles.js** — amber particle network on inner-page banners
  and the home page's "Precision at scale" panel.
- **WOW.js + animate.css** — scroll-triggered entrance animations
  on every section, card and image, staggered per grid.
- **Swiper.js** — the testimonials carousel and the projects page's
  Slide View / Grid View toggle.
- **Vanilla JS** — preloader, scroll progress bar, custom cursor
  (desktop only), animated stat counters, 3D card tilt, magnetic
  buttons, nav dropdown menus, and an auto-looping marquee ticker.

All of the above load from public CDNs inside the HTML files
themselves — nothing to install locally, no build step, no browser
extension or MCP required to view or host this.

All motion respects `prefers-reduced-motion` and degrades gracefully
without JavaScript (content and navigation still work; only the
decorative effects are skipped).
