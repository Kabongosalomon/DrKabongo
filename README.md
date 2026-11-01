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

- **Blog posts:** one folder per language — `content/blog/<language>/<slug>.mdx`, with
  `<language>` one of `en`, `fr`, `sw`, `ln`, `lua`. Adding a file and deploying is all it
  takes; the RSS feed and newsletter pick it up.
  - A post appears **only in the languages it is written in.** English-only → not on the
    French side, and vice versa.
  - The same slug in two folders is the same post in two languages (one shared comment
    thread, and the language switcher moves between them).
  - Fallbacks, so Swahili, Lingala and Tshiluba readers aren't left empty: **Swahili** shows
    English posts it has no version of, **Lingala and Tshiluba** show French ones. These are
    labelled with the language they're in and kept out of search engines (the original is the
    canonical page). English and French never borrow from each other.
  - Front matter: `title`, `date` (YYYY-MM-DD), `excerpt`, `category` (the topic filter on the
    blog page) and `tags` (keywords — searchable, and clickable on each card). The list is
    sorted newest first, with search, topic filter, keyword filter and an oldest-first toggle.
  - A file placed directly in `content/blog/`, or in a folder that isn't a language code,
    fails the build with a message saying where it belongs.
- **Courses:** catalogs are generated (edtrace-studio); add each course's publish date and
  keywords in `content/courses.meta.ts` so the index lists the newest first.
- **Translations:** `messages/{en,fr,sw,ln,lua}.json`
- **Images:** `public/images/`

## Deployment (Vercel)

1. Connect this repo to Vercel at [vercel.com/new](https://vercel.com/new)
2. Set the **Production Domain** to `drkabongo.com`
3. Add DNS records (CNAME/A) from Vercel in your domain registrar

## Redirect from skabongo.github.io

The `gh-pages` branch contains a single `index.html` that redirects all traffic to `drkabongo.com`.

In GitHub → **Settings → Pages**, set the source to the `gh-pages` branch to activate the redirect.

## Blog comments & newsletter

Both are optional and switched on by environment variables — see `.env.example`.
**Both run entirely on free plans, with no card on file anywhere**, so nothing
can ever be billed:

| Piece | Free plan | Limit that matters |
|---|---|---|
| Comments | Firebase **Spark** (never add billing) | 50,000 reads/day; showing a thread costs 1 read, however long |
| Newsletter list | Kit **Free** | 10,000 subscribers, unlimited emails |
| New-post emails | GitHub Actions (public repo) | unlimited |
| Site, feed, sign-up API | Vercel Hobby | unchanged |

If the daily Firebase quota is ever used up, the comment section shows "Comments
couldn't be loaded right now" until midnight Pacific time; the rest of the site is
unaffected and nothing is charged.

### Comments (Google sign-in, Firebase)

Readers sign in with Google and comment under each post; new comments appear
live for everyone on the page. Comments are packed 100 to a Firestore document
("page"), and nothing loads until the reader scrolls near the comments, so a
thread of any length costs one read to show — readers who never scroll down
cost nothing. There is no server of ours involved: the browser
talks to Firebase directly and **`firestore.rules`** enforces everything —
Google sign-in only, author name/photo taken from the Google account (no
impersonation), 2,000 characters max, one comment per 20 s per person, no
edits, authors may delete their own, moderators may delete any.

One-time setup:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
   Stay on the **Spark** plan — don't upgrade, don't add a billing account.
2. **Authentication → Sign-in method →** enable **Google**.
3. **Authentication → Settings → Authorized domains →** add `drkabongo.com` and `www.drkabongo.com`.
4. **Firestore Database →** create a database (production mode).
5. Deploy the rules and index settings: `npx firebase-tools deploy --only firestore --project <project-id>`.
6. **Project settings → Your apps →** add a Web app; copy `apiKey`, `authDomain`, `projectId`
   into the `NEXT_PUBLIC_FIREBASE_*` variables in Vercel, then redeploy.
7. To moderate: sign in on the site once, find your uid under **Authentication → Users**,
   then in Firestore create a document `admins/<your uid>` (no fields needed). A **Delete**
   link then appears on every comment for you. Set the same uid as `NEXT_PUBLIC_BLOG_AUTHOR_UID`
   to get an "Author" badge on your replies.

Rule tests run against the Firestore emulator (needs Java): `npm run test:rules`.

Local development against emulators: run
`npx firebase-tools emulators:start --only auth,firestore --project demo-drkabongo`
and start the site with `NEXT_PUBLIC_FIREBASE_EMULATORS=1` and
`NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-drkabongo` (any non-empty API key / auth domain).

### Newsletter (Kit) & RSS

- The subscribe box (blog index + end of each post) sends sign-ups to Kit through
  `app/api/subscribe`, which keeps the API key server-side. New subscribers get a
  confirmation email first (double opt-in).
- **Publishing emails subscribers automatically, for free.** When a push to `main` *adds*
  a post, `.github/workflows/notify-subscribers.yml` waits for it to be live on the site,
  then schedules a Kit broadcast (title, summary, link) to go out 15 minutes later — cancel
  it in Kit under **Broadcasts** if needed. Editing a post never re-sends. To publish a post
  silently, add `notify: false` to its front matter; to announce one by hand, run the
  workflow from the Actions tab with its language and slug. One email goes out per post, in
  the language it was first published in (translations added later don't re-send; all
  subscribers get it — there is no per-language list yet). `node scripts/notify-subscribers.mjs
  --dry-run content/blog/<language>/<slug>.mdx` previews the email.
- `/feed.xml` is the RSS feed for people who use feed readers.

One-time setup:

1. Create a free account at [kit.com](https://kit.com). Under **Settings → Email**, verify the
   sending domain `drkabongo.com` (add Kit's CNAME/TXT records in Vercel DNS) and add and confirm
   `newsletter@drkabongo.com` — new-post emails are sent from it (`SENDER_EMAIL` in
   `scripts/notify-subscribers.mjs`). The domain has no mailbox, so receive mail there with free
   forwarding: [ImprovMX](https://improvmx.com) (1 domain, free) with MX records `mx1.improvmx.com`
   (10) and `mx2.improvmx.com` (20) plus an alias `newsletter` → your inbox. Kit's confirmation
   email and subscribers' replies arrive through it.
2. **Grow → Landing pages & forms →** create an inline form (its design doesn't matter; the
   site has its own). In its **Settings → Incentive**, keep **"Send incentive email"** on —
   that's the confirmation email. Note the form id from its URL.
3. **Settings → Developer →** add a V4 API key.
4. Vercel: set `KIT_API_KEY` and `KIT_FORM_ID`, then redeploy.
5. GitHub: repo **Settings → Secrets and variables → Actions →** add `KIT_API_KEY`.
