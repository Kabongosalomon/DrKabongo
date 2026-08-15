# Videos — how the site gets them

**Short version: you never have to touch the code when you publish a video.**

The site reads each channel's public YouTube RSS feed and rebuilds itself at most once an hour. Upload a video, wait up to an hour, and it appears on `/videos` and on the homepage automatically.

You only edit files here to **feature**, **hide**, or **tag** a video — all in `content/videos.config.ts`.

---

## How the sync works

- Each channel in `lib/videos.ts` has a YouTube **channel ID**. The site fetches
  `https://www.youtube.com/feeds/videos.xml?channel_id=<ID>` for each one.
- No API key, no quota, no account. It's the same public feed any RSS reader uses.
- Results are cached for **1 hour** (`revalidate = 3600`). A new upload shows up within the hour — you don't need to redeploy.
- The feed only exposes the **15 most recent** videos per channel. Anything older simply won't appear.
- Each channel is fetched independently. If one feed fails, the others still work.

### The fallback snapshot

`content/videos.fallback.json` is a committed copy of what the feeds returned when it was last generated. If YouTube is unreachable **during a build**, the site renders from this file instead of showing an empty page.

It's a safety net, not the source of truth — the live feed always wins when it's reachable.

Regenerate it after adding or changing a channel:

```bash
node --input-type=module -e "
import { writeFileSync } from 'node:fs'
const CHANNELS = {
  en:  'UCZOom0SgNbTgu8NrHPzO8bw',
  fr:  'UCrAB1l9xV6nwSPJVHuKXK_w',
  ln:  'UCg7VcWhZmVzCgzif3RYLK_w',
  lua: 'UCVAFhKgOL5sMdZOvU5JFBGw',
}
const dec = s => s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m,e) =>
  e.startsWith('#x') ? String.fromCodePoint(parseInt(e.slice(2),16))
  : e.startsWith('#') ? String.fromCodePoint(parseInt(e.slice(1),10))
  : ({amp:'&',lt:'<',gt:'>',quot:'\"',apos:\"'\"}[e.toLowerCase()] ?? m))
const tag = (x,t) => { const m = x.match(new RegExp('<'+t+'[^>]*>([\\\\s\\\\S]*?)</'+t+'>')); return m ? dec(m[1]).trim() : '' }
const out = []
for (const [channel, id] of Object.entries(CHANNELS)) {
  const xml = await (await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + id)).text()
  for (const e of xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []) {
    const v = tag(e,'yt:videoId'); if (!v) continue
    out.push({ id: v, title: tag(e,'media:title') || tag(e,'title'), published: tag(e,'published'),
      channel, thumbnail: 'https://img.youtube.com/vi/'+v+'/hqdefault.jpg',
      url: 'https://www.youtube.com/watch?v='+v, description: tag(e,'media:description'),
      topics: [], featured: false })
  }
}
out.sort((a,b) => b.published.localeCompare(a.published))
writeFileSync('content/videos.fallback.json', JSON.stringify(out, null, 2) + '\n')
console.log('wrote', out.length, 'videos')
"
```

> **Important:** if you change which channels exist, regenerate this file. A stale snapshot can resurrect videos from a channel you removed.

---

## Featuring a video

Open `content/videos.config.ts` and add the video's ID to `FEATURED`:

```ts
export const FEATURED: string[] = [
  'rC_DDhMhVc8', // ← this one is the big video on the homepage
  'jOKy_AnyLic',
  'ZlEEXpedJWk',
]
```

- The **order you write them is the order they appear.**
- The **first entry** is the large featured video at the top of the homepage video section.
- Featured videos are pinned above everything else on `/videos`.
- Everything not listed sorts newest-first underneath.
- Empty the array and the site falls back to pure newest-first ordering.

### Where do I find a video ID?

It's the part after `v=` in the URL:

```
https://www.youtube.com/watch?v=rC_DDhMhVc8
                                 ^^^^^^^^^^^
```

---

## Hiding a video

Add its ID to `HIDDEN`. It disappears from the site everywhere — the channel keeps it, the site just stops showing it.

```ts
export const HIDDEN: string[] = [
  '8FxfFZXpMWI', // "Kabongo Live Stream" — untitled test stream
]
```

Useful for test uploads, duplicates, or older videos that no longer fit the brand.

---

## Tagging topics

Topics become the filter chips on `/videos`. Add IDs to `TOPICS`:

```ts
export const TOPICS: Record<string, TopicKey[]> = {
  rC_DDhMhVc8: ['deep_learning', 'research_talks'],
}
```

A video can have several topics, or none — untagged videos still show under "All".

### Adding a new topic

Three steps, all required, or the build will fail on a missing translation:

1. Add the key to the `TopicKey` union in `content/videos.config.ts`.
2. Use it in `TOPICS`.
3. Add `"topic_<key>": "..."` to the `videos` block of **every** file in `messages/` — currently `en`, `fr`, `sw`, `ln`, `lua`.

---

## Adding or changing a channel

1. **Get the channel ID.** YouTube Studio → Settings → Channel → Advanced settings. Or from the terminal:

   ```bash
   curl -sL -A "Mozilla/5.0" "https://www.youtube.com/@YourHandle" \
     | grep -oE '"channelId":"UC[A-Za-z0-9_-]{22}"' | head -1
   ```

   A channel ID always starts with `UC` and is 24 characters long. Handles are *not* IDs — the RSS feed needs the ID.

2. **Add it to `CHANNELS`** in `lib/videos.ts`, and add the key to the `ChannelKey` union.

3. **Add its strings** to every file in `messages/`, in the `videos` block:
   `channel_<key>_label` (the language name) and `channel_<key>_desc` (one sentence).

4. **Regenerate the fallback snapshot** (see above).

> Channel keys are deliberately **not** the same list as the site's languages. The site is available in Swahili but there is no Swahili channel, and that's fine — the two lists are independent.

---

## What visitors see when there are no videos

Three levels, all automatic:

| Situation | What renders |
|---|---|
| A channel has no uploads | Its card shows **"First video coming soon"** in place of a video count, with the subscribe link still active. |
| No channel has any uploads | `/videos` drops the grid and filters entirely and becomes an invitation — heading, a short note that recording is under way, and all four channel cards to subscribe to. |
| A filter matches nothing | "No videos match this filter yet." |

So the site is presentable before the first upload, and turns into a real library the moment videos exist. Nothing to switch on.

---

## Thumbnails

Pulled from `https://img.youtube.com/vi/<ID>/hqdefault.jpg`.

`hqdefault` is used rather than `maxresdefault` because **maxres doesn't exist for every video** — it 404s on some older uploads. `hqdefault` is generated for everything. It's 4:3, so it's rendered in a 16:9 box with `object-cover`, which crops the letterbox bars.

---

## Files

| File | Purpose |
|---|---|
| `content/videos.config.ts` | **The one you edit.** Feature, hide, tag. |
| `content/videos.fallback.json` | Generated safety net. Don't hand-edit. |
| `lib/videos.ts` | Channels, feed fetching, parsing, ordering. |
| `components/VideoCard.tsx` | A single video. |
| `components/VideoLibrary.tsx` | The grid and filters on `/videos`. |
| `components/ChannelCard.tsx` | A channel, including the "coming soon" state. |
