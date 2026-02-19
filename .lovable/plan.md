
## Fix: Merge Past and Future Competitions into One Unified Timeline

### Root Cause

In `src/components/CompetitionsTab.tsx` (lines 698–735), there are **two completely separate `<CompetitionTimeline>` components** rendered one after the other — one for past competitions and one for future ones:

```tsx
{/* Past Competitions */}
<CompetitionTimeline competitions={pastCompetitions.sort(...)} ... isPast={true} />

{/* Divider */}
<div className="w-16 h-px bg-border my-4" />

{/* Future Competitions */}
<CompetitionTimeline competitions={futureCompetitions.sort(...)} ... isPast={false} />
```

When both past AND future competitions exist, both timelines render and stack vertically — creating the "duplicate" appearance.

### Fix

Merge all competitions into a single `<CompetitionTimeline>` with everything sorted chronologically by date. Competitions without dates go at the end (they're future/upcoming).

**`src/components/CompetitionsTab.tsx`** — Replace the two-timeline block with one unified one:

```tsx
// BEFORE: Two separate timelines
{pastCompetitions.length > 0 && <CompetitionTimeline competitions={pastCompetitions.sort(...)} isPast={true} ... />}
{/* divider */}
{futureCompetitions.length > 0 && <CompetitionTimeline competitions={futureCompetitions.sort(...)} isPast={false} ... />}

// AFTER: Single unified timeline
<CompetitionTimeline
  competitions={[...competitions].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;  // no date goes to end
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  })}
  onCompetitionClick={...}
  onSimulationStart={handleSimulationStart}
/>
```

The `isPast` prop on the individual `CompetitionTimeline` component can still be used per-card — but since `CompetitionTimeline` already internally uses `isPast` as a visual opacity modifier, we can instead pass it down to each card individually using the date. Or more simply: remove the `isPast` prop from the `CompetitionTimeline` level entirely, and let the `TimelineCompetitionCard` inside check the date itself to decide opacity.

The cleanest approach that requires the fewest changes:

1. **Remove the two separate `<CompetitionTimeline>` blocks** in `CompetitionsTab.tsx` and replace with a single one passing all competitions sorted by date
2. **Remove the divider** between them (no longer needed)
3. **Remove the `pastCompetitions`/`futureCompetitions` split** (no longer needed for the timeline — the filter logic can stay for future use)
4. **Inside `CompetitionTimeline`**, pass `isPast` per card based on each individual competition's date rather than a global prop — so past dots still appear dimmed while future ones are bright

### Files to Modify
- `src/components/CompetitionsTab.tsx` — Merge two `CompetitionTimeline` renders into one, passing all competitions sorted by date
- `src/components/CompetitionTimeline.tsx` — Derive `isPast` per card from `comp.date` vs today (instead of a global `isPast` prop), so the visual distinction between past and future dots is preserved

### Result
One single horizontal timeline bar showing all competition dates in order — past ones slightly dimmed (as they are now), upcoming ones bright, all navigable via the same dots and swipe gesture.
