
## Fix: Future Competition Crash (White/Dark Screen)

### Root Cause

Two unguarded `.split()` calls on `competition.date` crash the app when a competition has a missing or null date:

1. **`CompetitionDetail.tsx` line 138** — `isFutureCompetition` is computed as an IIFE at component render time with no null guard:
   ```tsx
   const [year, month, day] = competition.date.split('-').map(Number);
   // Crashes with TypeError if competition.date is null/undefined
   ```

2. **`CompetitionTimeline.tsx` line 57** — `groupByWeekend` also crashes before the detail even opens:
   ```tsx
   const dateKey = comp.date.split('T')[0];
   // Crashes if any comp in the list has no date
   ```

Future competitions are more likely to have missing dates in the database (date not yet set in Directus). Past competitions typically always have dates, which is why past ones work and future ones crash.

### Fixes

**`src/components/CompetitionDetail.tsx`** — Add null guard to `isFutureCompetition`:

```tsx
// BEFORE (crashes):
const isFutureCompetition = (() => {
  const [year, month, day] = competition.date.split('-').map(Number);
  const compDate = new Date(year, month - 1, day);
  return compDate > CURRENT_DATE;
})();

// AFTER (safe):
const isFutureCompetition = (() => {
  if (!competition.date) return true; // No date = assume future/upcoming
  const [year, month, day] = competition.date.split('-').map(Number);
  const compDate = new Date(year, month - 1, day);
  return compDate > CURRENT_DATE;
})();
```

**`src/components/CompetitionTimeline.tsx`** — Add null guard in `groupByWeekend`:

```tsx
// BEFORE (crashes):
comps.forEach(comp => {
  const dateKey = comp.date.split('T')[0];
  ...
});

// AFTER (safe):
comps.forEach(comp => {
  if (!comp.date) return; // Skip competitions without a date
  const dateKey = comp.date.split('T')[0];
  ...
});
```

**`src/components/CompetitionsTab.tsx`** — The filter for future/past competitions also calls `new Date(comp.date)` which returns `Invalid Date` when `comp.date` is null, causing incorrect sorting and potential issues. Add a guard:

```tsx
// BEFORE:
const pastCompetitions = competitions.filter(comp => new Date(comp.date) < currentDate);
const futureCompetitions = competitions.filter(comp => new Date(comp.date) >= currentDate);

// AFTER:
const pastCompetitions = competitions.filter(comp => comp.date && new Date(comp.date) < currentDate);
const futureCompetitions = competitions.filter(comp => !comp.date || new Date(comp.date) >= currentDate);
// No date = treat as upcoming (show in future section)
```

### Files to Modify
- `src/components/CompetitionDetail.tsx` — Guard `isFutureCompetition` against missing date
- `src/components/CompetitionTimeline.tsx` — Guard `groupByWeekend` forEach against missing date
- `src/components/CompetitionsTab.tsx` — Guard past/future filter against missing date
