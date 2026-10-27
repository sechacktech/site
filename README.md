# SecHack

Static, Hungarian-language website for the **SecHack** IT-security lifehack podcast (host: Pedro). Plain HTML, CSS and vanilla JavaScript — no build step, no backend, no tracking. Fonts (Space Grotesk, Inter, JetBrains Mono) are self-hosted in `assets/fonts/`, so the site makes no third-party requests.

```
/
├── index.html · episodes.html · topics.html · about.html · blog.html
├── adatvedelem.html · impresszum.html     (legal templates – fill in before launch)
├── 404.html · robots.txt · sitemap.xml
└── assets/
    ├── css/styles.css                      all styles, design tokens at the top (:root)
    ├── js/data.js                          ★ episodes, topics, contact + platform config
    ├── js/main.js                          behaviour (nav, search/filter, forms) – rarely edited
    ├── fonts/                              self-hosted woff2 fonts
    └── images/                             logo, portrait, avatar, favicon, OG image
```

## 1. Create a GitHub repository
1. Sign in at <https://github.com> and click **New repository**.
2. Name it, e.g. `sechack`. Choose **Public** (GitHub Pages on free accounts needs a public repo). Don't add a README (this project has one).

## 2. Upload the files
- **Browser:** open the empty repo → **uploading an existing file** → drag in *the contents of this folder* (so `index.html` sits at the repo root, not inside a subfolder) → **Commit changes**.
- **Git:**
  ```bash
  git init && git add . && git commit -m "SecHack website"
  git branch -M main
  git remote add origin https://github.com/<user>/sechack.git
  git push -u origin main
  ```

## 3. Turn on GitHub Pages
Repo → **Settings → Pages** → *Build and deploy*: **Source = Deploy from a branch**, **Branch = `main`**, folder **`/ (root)`** → **Save**. No GitHub Actions needed: the site is plain static files.

## 4. Find the published URL
After a minute, **Settings → Pages** shows *“Your site is live at …”*. For a project repo it is `https://<user>.github.io/<repo>/`.

## 5. Update the site
Edit a file on GitHub (pencil icon) or push new commits. Pages redeploys automatically within a minute or two. Hard-refresh (Ctrl/Cmd+Shift+R) if you still see the old version.

## 6. Replace the logo and portrait
Keep the filenames, or update the references in the HTML.
- `assets/images/pedro-portrait.webp` — hero image, 960×616 px.
- `assets/images/pedro-avatar.webp` — square face crop (320×320) used on episode cards and About.
- `assets/images/sechack-logo.png` / `.webp` — full logo without the signature line (not used in the nav; the nav logo is HTML/CSS text: “Sec” white + “Hack” cyan).
- `assets/images/og-image.png` — social share image, 1200×630.
- `assets/images/favicon.svg` and `apple-touch-icon.png` (180×180).

Tip: WebP keeps files small; any format works if you change the `src`.

## 7. Add new episodes
There are no example episodes: until you add one, the home and Episodes pages show “Az első epizódok hamarosan érkeznek”. Open `assets/js/data.js`; a ready-to-copy template is in the comment above `SECHACK_EPISODES`. Paste it between the `[ ]`, set `id`, `number`, `topic` (a slug from `SECHACK_TOPICS`), `category`, `title`, `description`, `duration` (e.g. `"12 perc"`), `date` (`"2026-11-05"` or `null`) and the links (next section).

The home page (latest three), Episodes page (search + filters) and Topics page update automatically.

## 8. Connect podcast platform URLs
**Per episode** — in `links`, add any of `spotify`, `apple`, `youtube`, `audio` (direct audio URL), `page` (a link to the episode page). The first filled one (in that order) powers the **Hallgasd meg** button. Episodes without a link show a non-clickable **Hamarosan** label — there is no fake audio player.

**Footer** — in `SECHACK_CONFIG.platforms` fill in `spotify`, `apple`, `youtube`, `rss`, `linkedin`. Only filled entries are rendered; until then the footer says the links are coming soon.

## 9. Contact e-mail
There is no newsletter. The home page has a “Kapcsolat / Írj nekem!” section; its button appears once you set `SECHACK_CONFIG.contact.email` in `assets/js/data.js`. Currently set to `pedro@sechack.hu`; if left empty, the page says the address is coming soon.

## 10. Replace the example domain and metadata
The pages are already set to `https://sechack.hu/` (the old placeholder was `https://FELHASZNALONEV.github.io/sechack/`) in canonical links, Open Graph tags, `sitemap.xml` and `robots.txt`. Replace it everywhere with your real URL (project repo: `https://<user>.github.io/<repo>/`; custom domain: `https://example.hu/`). Search the project for `FELHASZNALONEV` and replace all occurrences — keep the trailing `/`.

Also review:
- `<title>` / `<meta name="description">` in each page's `<head>`,
- `adatvedelem.html` and `impresszum.html` (yellow placeholders must be filled in before launch),
- `404.html`: it sets `<base>` with a small script so assets load from any URL depth. If your site is at the root of a domain (user site `<user>.github.io` or custom domain), set `SITE_ROOT = "/"` in that script; otherwise it auto-detects `/<repo>/`.

### Custom domain (optional)
Settings → Pages → *Custom domain*; add the DNS records GitHub lists. All paths in the project are relative, so nothing else needs to change except the URLs above.

## Local preview
```bash
python3 -m http.server 8000      # then open http://localhost:8000
```
(Opening `index.html` directly mostly works, but the local server mirrors GitHub Pages more closely.)

## Notes
- The blog posts are **tervezet** (draft) titles only, clearly labelled. No audio URLs, dates, statistics or reviews are invented.
- Accessibility: skip link, semantic landmarks, keyboard-operable menu, visible focus, `prefers-reduced-motion` respected.
- No analytics, cookies or trackers are included. If you add any, update the privacy page.
- Fonts are licensed under the SIL Open Font License (via Fontsource).
