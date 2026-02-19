
## Fix: Future Competition Crash — Null `judges` and `lineup`

### Root Cause (Different from the Date Issue)

The date fix that was already applied is correct, but it's not the only crash. When you add a date to a future competition, the app still crashes because of **two more unguarded array accesses** in `CompetitionDetail.tsx`:

1. **Line 433** — `competition.judges.sort(...)`:
   ```tsx
   {competition.judges.sort((a, b) => a.category.localeCompare(b.category)).map(...)}
   ```
   If Directus hasn't had judges entered yet for a future competition, it returns `null` for the `judges` field. Calling `.sort()` on `null` crashes the app immediately.

2. **Lines 180, 185, 193, 201, 344** — `competition.lineup.map(...)` and `competition.lineup.filter(...)`:
   Similarly, if a future competition has no lineup entered in Directus yet, `lineup` is `null`, and every `.map()` / `.filter()` call on it crashes.

The `mapCompetitionTeamsFull` in `competitionMapping.ts` already guards `lineup` (line 42: `Array.isArray(competition.lineup) ? ... : []`), so lineup coming from Directus is safe — but `judges` has **no such guard anywhere**. It flows from Directus → spread into the mapped object → used directly in the component.

### Why Past Competitions Work

Past competitions in Directus almost certainly have judges and lineup already filled in. Future competitions are more likely to be partially filled, with judges or lineup left blank until closer to the event.

### Fixes

**`src/components/CompetitionDetail.tsx`** — Two changes:

**1. Guard `getAvailableTeams` function** (used in the prediction dropdowns):
```tsx
// BEFORE:
case 'first':
  return competition.lineup.map(team => ({...}));

// AFTER:
case 'first':
  return (competition.lineup || []).map(team => ({...}));
```
Apply the `|| []` fallback to all four `.map()` / `.filter()` calls inside `getAvailableTeams`.

**2. Guard the judges render** (line 433):
```tsx
// BEFORE (crashes if judges is null):
{competition.judges.sort((a, b) => a.category.localeCompare(b.category)).map((judge, index) => ...)}

// AFTER (safe):
{(competition.judges || []).sort((a, b) => a.category.localeCompare(b.category)).map((judge, index) => ...)}
```

**3. Guard the lineup render** (line 344):
```tsx
// BEFORE:
{competition.lineup.map((team, index) => ...)}

// AFTER:
{(competition.lineup || []).map((team, index) => ...)}
```

**`src/lib/competitionMapping.ts`** — Add a `judges` normalization so it never passes `null` downstream:
```ts
return {
  ...competition,
  logo: logoUrl,
  lineup: mappedLineup,
  judges: Array.isArray(competition.judges) ? competition.judges : [], // NEW
  showTicketsLink: competition.showtickets || '',
  afterpartyTicketsLink: competition.aptickets || '',
};
```

### Files to Modify
- `src/components/CompetitionDetail.tsx` — Guard `.judges.sort()`, `lineup.map()` in render, and all `lineup` accesses in `getAvailableTeams`
- `src/lib/competitionMapping.ts` — Normalize `judges` to `[]` when null/undefined

### Why This Will Fix It
After this change, even if a future competition has zero judges and no lineup entered in Directus, the component will render safely — showing empty sections rather than crashing.
