# Chemistry Guru – Project Notes (context for a new session)

## What this is
A bilingual (English / Tamil) website for **Dr. Ashokan P – Chemistry Guru** (Postgraduate Assistant in Chemistry, Government (ADW) Higher Secondary School, Athipallam, Krishnagiri District). It lists chapter-wise one-mark Chemistry quizzes (Google Forms) for **Class 11 and Class 12** (Tamil Nadu State Board), plus YouTube/Telegram links and a WhatsApp enquiry form.

It was converted from a single static HTML file into **Angular 22** (1:1 port), then extended.

- **Live site:** https://chemistryguru.in/
- **GitHub repo:** https://github.com/ashokanmsc-cpu/chemistry-guru (account: `ashokanmsc-cpu`)
- **Local folder:** `C:\Users\Ashokan\chemistry-guru`
- **OS / shell:** Windows 11, PowerShell 5.1

## Run locally
```
cd C:\Users\Ashokan\chemistry-guru
npm start            # http://localhost:4200
npm run build:gh       # custom-domain production build -> dist/chemistry-guru/browser
```
In PowerShell tool sessions, prepend PATH first:
```
$env:Path = "C:\Program Files\nodejs;C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:Path
```
Installed via winget: Node 24 LTS, Git, GitHub CLI (`gh`, authenticated via browser device flow – never ask for passwords).

## Deploy
Push to `main` → GitHub Actions workflow `.github/workflows/deploy.yml` builds with `--base-href /` and deploys `dist/chemistry-guru/browser` to GitHub Pages (~35 s). The custom domain is `chemistryguru.in` and is preserved by `public/CNAME`.
```
git add -A; git commit -m "message"; git push
gh run list --limit 1
```

## Tech details
- Angular 22, standalone components, signals, new control flow (`@for`, `@if`), files named without `.component` (e.g. `header.ts`, class `Header`).
- `@angular/ssr` with `outputMode: "static"` (pre-rendered for SEO) + `provideClientHydration()`. Browser-only code runs in `afterNextRender`.
- Global styles in `src/styles.scss` (ported from original). Components use host `display:contents` so global CSS still applies.
- Language system: `LanguageService` (signal, default `'en'`, saved to localStorage `cg-lang` after hydration), impure pipe `t`, `pick()` for bilingual objects.

## File map
| Purpose | File |
|---|---|
| Colours / theme / responsive rules | `src/styles.scss` (`:root` vars at top; "Navy + gold theme" + "Responsive hardening" blocks at bottom) |
| Chapters (Class 11 & 12), symbols, Tamil titles, Google Form links | `src/app/data/chapters.ts` |
| All EN/TA UI text, dropdown options | `src/app/i18n/translations.ts` |
| WhatsApp number (919841213187), YouTube, Telegram, logo/photo paths | `src/app/config.ts` |
| Title, meta description, Open Graph, JSON-LD (WebSite, Person, WebPage), canonical | `src/index.html` |
| Components | `src/app/components/` – header, hero, profile-card, marquee, chapter-card, chapter-list (Class 12/11 switch, volume tabs, search), social-links, contact (WhatsApp form + footer), overlays (to-top, toast) |
| Scroll reveal directive | `src/app/shared/reveal.directive.ts` |
| Images | `public/images/` – `logo.jpg`, `logo-192.jpg`, `logo-512.jpg`, `profile.jpg` (teacher photo, cropped from award photo) |
| SEO | `public/sitemap.xml`, `public/robots.txt` |

## Data notes
- **Class 12:** 15 chapters, Volume 1 = ch 1–7, Volume 2 = ch 8–15, English + Tamil form links.
- **Class 11:** 15 chapters, Volume 1 = ch 1–7, Volume 2 = ch 8–15, **Tamil-medium links only** (cards show a "Tamil medium" tag). To add English links, add `en: 'https://forms.gle/...'` to each Class 11 `formUrl` in `chapters.ts`; the tag disappears automatically.
- `Chapter` type: `{ std: 11|12, no, volume: 1|2, symbol, title: {en, ta}, formUrl: { en?, ta } }`.

## Current design
- Theme: navy + gold (from the user's reference HTML). Key colours: navy `#07142d`, primary `#0b2047`, gold `#f8c94f`, light gold `#ffe9a0`, background `#f5f7fc`, ink `#101b34`, Vol 2 accent `#b07c09`.
- Light/dark switch: **light is the default**; sun/moon button in the header toggles dark. Choice saved in localStorage `cg-theme` (restored by inline script in `src/index.html` before paint). Logic: `src/app/core/theme.service.ts`; dark colours: `html[data-theme="dark"]` block in `src/styles.scss`.
- Chapter card colours: `color` property per chapter in `src/app/data/chapters.ts` (dark theme lightens it via `color-mix`).
- Question bank downloads section (`src/app/components/downloads.ts`, nav link "Question Bank", below the quizzes): PDFs live in `public/downloads/`; card text, page count and size are in `src/app/data/downloads.ts`. To add a PDF: copy it there with a web-safe name (lowercase, dashes, no spaces) and add an entry.
- Header: nav links collapse into the menu button at ≤1280px (all languages); in Tamil the yellow nav CTA is hidden on desktop because the Tamil labels are longer.
- Marquee speed: `.strip-track` animation duration in `src/styles.scss` (70s).
- Latest YouTube videos section (`src/app/components/latest-videos.ts`, below the quizzes): shows the 6 newest normal videos (no Shorts) from `src/app/data/videos.ts`. That file is regenerated by `scripts/fetch-videos.mjs` (YouTube Data API v3, uploads playlist `UU0uOhUYOAEewdUF0nFeuzhA`) in the deploy workflow, which also runs every 6 hours. Needs the GitHub repo secret `YOUTUBE_API_KEY`; without it the committed list is kept.
- Navy header and hero, gold buttons/accents, white cards.
- Responsive checked at 320/360/390/430 (phones), 768/1024 (iPad), 1366, 1920 – no horizontal overflow in EN or TA. Mobile is top priority for the user.

## Pending / ideas
- User may provide **English-medium Class 11** Google Form links.
- **Google Search Console:** user to send HTML-tag verification code → add `<meta name="google-site-verification" ...>` in `src/index.html`, then submit `sitemap.xml`.
- GitHub profile README repo (`ashokanmsc-cpu`) and root site repo (`ashokanmsc-cpu.github.io`) were drafted but **not created** – needs explicit user approval before creating public repos.
- User to set GitHub profile name/bio/website manually at github.com/settings/profile.
- **Future (deferred):** JSON question bank with in-app quiz, 25 questions per chapter, sourced from Google Forms / Word / PDF.

## Working preferences
- User writes short messages, sometimes with typos; prefers action over questions.
- Explain results simply; verify on mobile sizes after any UI change.
- Never ask for or store account passwords.
