
## Live Link + "Currently Live" Indicator

### What We're Building

Two connected features:

1. **Wire `livelink` from Directus to the "Watch Live" button** — the backend field `livelink` is never currently mapped to `livestreamLink` in the app, so the button never activates.

2. **"Currently Live" visual state** — when the current time is within a 4-hour window starting from the competition's start time (on competition day), the card and drawer header get a red live-pulsing indicator, glowing border, and the "Watch Live" row transforms into a prominent live badge.

---

### Part 1: Wire `livelink` from Directus

**`src/lib/competitionMapping.ts`**

Add `livestreamLink: competition.livelink || ''` to the return object so the field flows through:

```ts
return {
  ...competition,
  logo: logoUrl,
  lineup: mappedLineup,
  judges: Array.isArray(competition.judges) ? competition.judges : [],
  showTicketsLink: competition.showtickets || '',
  afterpartyTicketsLink: competition.aptickets || '',
  livestreamLink: competition.livelink || '',   // NEW
};
```

**`src/lib/types.ts`**

The `livestreamLink` field already exists in the `Competition` interface — no change needed.

---

### Part 2: "Currently Live" Detection Logic

We need a helper function that determines if a competition is currently live. The rule is:

- The competition `date` matches today's date (local time)
- The current time is within the window `[start time, start time + 4 hours]`
- The `time` field from Directus is a string like `"6:00 PM"` or `"18:00"` — parse it to get hours/minutes

```ts
function isCurrentlyLive(date: string, time?: string, timezone?: string): boolean {
  if (!date || !time) return false;
  const now = new Date();
  
  // Check date matches today
  const [year, month, day] = date.split('-').map(Number);
  if (now.getFullYear() !== year || (now.getMonth() + 1) !== month || now.getDate() !== day) {
    return false;
  }
  
  // Parse the time string (handles "6:00 PM", "18:00", etc.)
  const parsed = parseTimeString(time);
  if (!parsed) return false;
  
  const startMs = new Date(year, month - 1, day, parsed.hours, parsed.minutes).getTime();
  const endMs = startMs + 4 * 60 * 60 * 1000; // +4 hours
  const nowMs = now.getTime();
  
  return nowMs >= startMs && nowMs <= endMs;
}
```

---

### Part 3: Visual Changes

#### `src/components/CompetitionDetail.tsx`

**A. Header — glowing red border + "LIVE" badge when live:**

When `isLive` is true, the `DrawerHeader` gradient changes from purple/blue to red, and a pulsing "● LIVE" badge appears next to the competition name.

**B. Time row — transforms into a "LIVE NOW" banner:**

When `isLive && livestreamLink`:
- The row changes from the standard red-tinted link style to a bright, pulsing "● LIVE NOW — Watch Live" styled row with a stronger red glow and `animate-pulse` on the dot

When `isLive && !livestreamLink`:
- Shows "● LIVE NOW" in the time row without a link, just an informational state

When not live but `livestreamLink` exists (future comp with a stream URL set early):
- Keeps the existing "Watch Live" clickable link behavior unchanged

#### `src/components/CompetitionTimeline.tsx` — `TimelineCompetitionCard`

When a competition is currently live, add a "● LIVE" pill badge on the card and change its border from the standard primary color to a glowing red border:

```tsx
{isLive && (
  <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 border border-red-400/40 rounded-full px-2 py-0.5">
    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
    <span className="text-red-400 text-[10px] font-bold uppercase tracking-wide">Live</span>
  </div>
)}
```

And the card border becomes `border-red-500/60 shadow-red-500/20` when live.

---

### Files to Modify

1. **`src/lib/competitionMapping.ts`** — Add `livestreamLink: competition.livelink || ''`
2. **`src/components/CompetitionDetail.tsx`** — Add `isCurrentlyLive` helper + live state visuals in header and time row
3. **`src/components/CompetitionTimeline.tsx`** — Add live badge and red border to `TimelineCompetitionCard` when currently live

---

### Technical Notes

- The `isCurrentlyLive` helper will be defined locally in both components (or extracted to a shared `src/lib/utils.ts` helper — the cleaner approach). We'll add it to `src/lib/utils.ts` and import it in both components.
- Time string parsing supports both 12-hour (`"6:00 PM"`) and 24-hour (`"18:00"`) formats since Directus time fields can return either.
- The 4-hour window means if a show starts at 6:00 PM, it's considered "live" until 10:00 PM — which is realistic for a Raas show.
- No interval/polling is needed — the live state is computed once when the component mounts. The app is a scoreboard opened event-day, not a long-running background tab, so this is fine.
