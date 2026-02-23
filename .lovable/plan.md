

## Embed Instagram Reel in Competition Detail

Replace the competition content area with an embedded Instagram Reel (instead of YouTube) when a video link is available. Instagram Reels naturally autoplay and loop within their embed, which is exactly what you want.

### What Changes

**File: `src/components/CompetitionDetail.tsx`**

1. **Add an Instagram Reel embed helper** near the top of the file -- a function `getInstagramEmbedUrl(url)` that:
   - Takes a URL like `https://www.instagram.com/reel/ABC123/` or `https://www.instagram.com/p/ABC123/`
   - Extracts the post/reel code
   - Returns `https://www.instagram.com/reel/ABC123/embed/`
   - Returns `null` if the URL isn't an Instagram link

2. **Modify the content conditional** (around line 446): Add a check before the existing RAS/normal fallback:
   - Look at `competition.videoLink` or `competition.livestreamLink`
   - If it's a valid Instagram URL, render an embedded `<iframe>` pointing to the reel embed URL
   - If not, fall through to existing behavior (RAS city/date fallback or normal lineup/judges view)

3. **The iframe** will be styled with:
   - Fixed aspect ratio suited for vertical Reels (roughly 9:16)
   - Max width constrained so it looks good on the page
   - Rounded corners, centered layout
   - Instagram Reels auto-play and loop natively in their embed -- no extra parameters needed

### Layout

```text
  +----------------------------+
  |  Header (logo, name,       |
  |  time, tickets)            |
  +----------------------------+
  |      +----------------+    |
  |      |                |    |
  |      |  Instagram     |    |
  |      |  Reel Embed    |    |
  |      |  (9:16 ratio)  |    |
  |      |                |    |
  |      +----------------+    |
  +----------------------------+
```

### How to Use

Add the Instagram Reel URL to the `videolink` field in Directus for the competition (e.g., `https://www.instagram.com/reel/ABC123/`). The app will detect it's an Instagram link and embed it automatically.

### Files Modified
- `src/components/CompetitionDetail.tsx` -- add Instagram URL parser + conditional reel embed

