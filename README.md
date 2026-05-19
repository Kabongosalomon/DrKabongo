# DrKabongo.com — Personal Website

Personal website of **Dr. Salomon Kabongo** — AI Researcher, Lead Software Engineer, and Educator.

**Live at:** [drkabongo.com](https://drkabongo.com)  
**Previously:** skabongo.github.io (redirects automatically)

---

## Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **i18n:** next-intl — EN (default) · FR · LN (Lingala)
- **Blog:** MDX via `next-mdx-remote/rsc`
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics

## i18n Routes

| Locale | URL prefix | Language |
|--------|-----------|----------|
| English | `/` (default) | English |
| French | `/fr/` | French |
| Lingala | `/ln/` | Lingala |

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

## Content

- **Blog posts:** `content/blog/*.mdx`
- **Translations:** `messages/{en,fr,ln}.json`
- **Images:** `public/images/`

## Deployment (Vercel)

1. Connect this repo to Vercel at [vercel.com/new](https://vercel.com/new)
2. Set the **Production Domain** to `drkabongo.com`
3. Add DNS records (CNAME/A) from Vercel in your domain registrar

## Redirect from skabongo.github.io

The `gh-pages` branch contains a single `index.html` that redirects all traffic to `drkabongo.com`.

In GitHub → **Settings → Pages**, set the source to the `gh-pages` branch to activate the redirect.
