
## What's Actually Happening (Root Cause)

The console logs reveal the real issue: **"Directus URL not configured, using fallback data"**. The app is running in the preview without a Directus connection, so it uses the hardcoded `fallbackCompetitions` array in `CompetitionsTab.tsx`. The Directus ISO-stripping fixes in `Index.tsx` never run because the fallback data is used directly.

The fallback data has:
- All past dates (2024) — so `isCurrentlyLive` always returns `false`
- No competition set to today's date (2026-02-19)
- `formatTime` outputs 24-hour format (e.g. `14:00`) instead of 12-hour AM/PM

### Three Changes Required

**1. Add a "today" competition to the fallback data** (`CompetitionsTab.tsx`)

Add one entry with `date: '2026-02-19'` (today) and `time: '14:00'` (or whatever makes sense within the 4-hour window), so the LIVE indicator can actually trigger in the preview. This also verifies the full LIVE UI flow works end-to-end before real Directus data is connected.

**2. Convert `formatTime` to 12-hour AM/PM** (`CompetitionDetail.tsx`)

The current `formatTime` strips seconds but leaves 24-hour format. Update it to convert to 12-hour AM/PM:

```ts
const formatTime = (time?: string): string => {
  if (!time) return 'TBA';
  const t = time.includes('T') ? time.split('T')[1] : time;
  const match = t.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return t;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};
```

This handles both `"14:00:00"` (from Directus) and `"6:00 PM"` (already formatted — the regex won't match the PM part but still captures `6:00`, then re-formats it cleanly).

Wait — `"6:00 PM"` would match `/^(\d{1,2}):(\d{2})/` giving hours=6, minutes="00", then `6 % 12 = 6`, ampm = AM (wrong! 6 < 12). We need to detect already-formatted strings first.

Better approach:
```ts
const formatTime = (time?: string): string => {
  if (!time) return 'TBA';
  // Strip date prefix if full ISO string
  const t = time.includes('T') ? time.split('T')[1] : time;
  // Already in 12-hour format (contains AM/PM)
  if (/AM|PM/i.test(t)) {
    const match = t.match(/^(\d{1,2}:\d{2})\s*(AM|PM)/i);
    return match ? `${match[1]} ${match[2].toUpperCase()}` : t;
  }
  // 24-hour format: convert to 12-hour AM/PM
  const match24 = t.match(/^(\d{1,2}):(\d{2})/);
  if (!match24) return t;
  let hours = parseInt(match24[1], 10);
  const minutes = match24[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};
```

**3. Also update `parseTimeString` in `utils.ts`** — currently already handles both `"6:00 PM"` and `"18:00:00"`. No change needed there.

### Files to Modify

| File | Change |
|---|---|
| `src/components/CompetitionsTab.tsx` | Add one fallback competition with today's date (`2026-02-19`) and a time that is currently within the live window (e.g., a time a few hours before now) so the LIVE badge can be seen |
| `src/components/CompetitionDetail.tsx` | Update `formatTime` to output 12-hour AM/PM format, handling both `"6:00 PM"` and `"14:00:00"` input shapes |

### Why Only These Two Files

- `Index.tsx` — the Directus mapping fixes are already correct; they just never run in the preview because Directus isn't configured
- `utils.ts` — `parseTimeString` already handles both 12-hour and 24-hour formats correctly; `isCurrentlyLive` logic is fine
- `CompetitionTimeline.tsx` — local date parsing is already correct

### Technical Detail: The Fallback Competition

The new fallback entry will use:
- `date: '2026-02-19'` (today)
- `time: '14:00'` — which is 2:00 PM. Since current time is ~4:18 PM and the window is `startTime` to `startTime + 4 hours`, we can use `'13:00'` (1:00 PM) so that 4:18 PM falls within the 1:00 PM–5:00 PM window.
- `livestreamLink` set so the full LIVE NOW → Watch Live row appears

This lets the LIVE indicator, glowing red header, pulsing badge, and LIVE NOW time row all be verified visually in the preview.
