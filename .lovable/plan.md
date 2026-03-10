

## Live Competition Display — Audit & Fix

### Current State

The live detection logic (`isCurrentlyLive`) is **correct** — it checks if the current time falls within a 4-hour window of the competition's start time on the same day. The `livestreamLink` field is properly mapped from `comp.livelink` in `Index.tsx`.

**What works:**
- **CompetitionTimeline card** — correctly applies red border/glow styling when live
- **CompetitionDetail drawer** — shows "LIVE NOW" banner with a clickable livestream link (or static banner if no link)

**What's missing:**
- **`CompetitionCard.tsx`** (the list-view card used elsewhere) has **zero live status detection**. It doesn't import `isCurrentlyLive`, doesn't check for live state, and shows no visual indicator.

### Plan

**`src/components/CompetitionCard.tsx`** — Add live status indicator:

1. Import `isCurrentlyLive` from `@/lib/utils`
2. Compute `isLive = isCurrentlyLive(competition.date, competition.time)`
3. When `isLive` is true:
   - Apply a red border/glow similar to the timeline card (`border-red-500/60`, `shadow-red-500/20`)
   - Add a pulsing red "LIVE" badge next to the competition name (similar style to the existing "Bid" badge)
4. Keep existing bid badge — show both if both apply

This is a small, contained change to one file.

