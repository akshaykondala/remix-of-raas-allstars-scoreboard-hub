

## Nationals Competition: Full Layout with Premium Lineup

### Current Behavior
When a RAS competition has no judges, the entire content area is replaced by just a centered "── City ── Date" display (lines 467-484). This means no lineup, no placings, no links are shown.

### What Changes

#### `src/components/CompetitionDetail.tsx`

**1. Remove the RAS-only city/date fallback** (lines 467-484)
Delete the special case that hides all content when RAS has no judges. The RAS competition will now render the same sections as every other competition: lineup, placings, judges, Instagram.

**2. Replace the generic lineup grid with a premium "Nationals Lineup" section for RAS competitions**
When `competition.ras` is true, instead of the plain grey rows in `bg-slate-700/30`, render a premium nationals-themed lineup:

- Section header changes from "Competition Lineup" to "Nationals Lineup" with amber/gold icon styling
- Each team card gets:
  - A slightly larger layout with more breathing room
  - Amber-accented left border or subtle gradient background (from-amber-500/10)
  - Larger team logo (w-8 h-8 instead of w-6 h-6) with an amber ring
  - Team name in white with their leaderboard rank badge
  - A subtle "Qualified" indicator (small amber dot or text)
- The container gets the holographic/amber gradient border treatment consistent with the RAS card styling
- Numbered entries (1-9) with small amber-tinted rank circles

The non-RAS path remains completely unchanged — same generic grey lineup rows as before.

**3. Keep everything else identical**
Placings, judges, tickets, Instagram, video links all render normally for RAS just like any other competition.

### Files Changed
- `src/components/CompetitionDetail.tsx` — Remove RAS city/date fallback; add premium nationals lineup rendering when `competition.ras` is true

