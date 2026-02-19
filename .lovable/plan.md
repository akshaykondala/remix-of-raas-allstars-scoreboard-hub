
## Fix: Live Indicator, Time Display, and Auto-Select Current Week

### The Real Root Causes (All Three)

#### Bug 1: UTC Date Parsing (why live never triggers)

This is the core issue. When `"YYYY-MM-DD"` date strings are passed to `new Date("2026-02-19")`, JavaScript parses them as **UTC midnight**. In US timezones (EST = UTC-5, CST = UTC-6, PST = UTC-8), this shifts the date backwards by one day.

So `new Date("2026-02-19").getDate()` returns **18**, not **19**, in Eastern time. Then `isCurrentlyLive` compares `now.getDate()` (19) against `day` (18) and returns false — every single time, even on the exact competition day.

**Fix:** In `CompetitionTimeline.tsx`, the `groupByWeekend` function uses `new Date(dateKey)` to build the `date` property. Parse the date string manually instead to stay in local time:

```ts
// BEFORE (UTC-parsed, date shifts in US timezones):
const date = new Date(dateKey);

// AFTER (local time, parses "2026-02-19" as local Feb 19):
const [y, m, d] = dateKey.split('-').map(Number);
const date = new Date(y, m - 1, d);
```

Similarly, `isPast` check on line 201 also uses `new Date(competition.date)` which has the same UTC bug — past competitions will appear as future on the day of the competition. Fix it the same way.

`isCurrentlyLive` in `utils.ts` already correctly parses manually with `date.split('-').map(Number)` — that part is fine.

#### Bug 2: `formatTime` — the regex works but the field name in `Competition` type may not match

Looking at Index.tsx line 548-573, the mapped competition object contains the key `showtickets` and `aptickets` (raw Directus names), but `competition.showTicketsLink` and `competition.afterpartyTicketsLink` are what the detail component reads. The mapping at line 568-569 sets these as `showtickets` and `aptickets` on the object (not `showTicketsLink`/`afterpartyTicketsLink`), so the detail component's `competition.showTicketsLink` is always `undefined`.

Wait — looking more carefully at lines 568-569:
```ts
showtickets: comp.showtickets || '',
aptickets: comp.aptickets || '',
```

These are stored as `showtickets`/`aptickets` keys on the mapped object, but the `Competition` type and `CompetitionDetail.tsx` reads `competition.showTicketsLink` and `competition.afterpartyTicketsLink`. TypeScript would catch this if the mapping was typed, but since it's typed as `any`, it silently stores under wrong keys.

These need to be:
```ts
showTicketsLink: comp.showtickets || '',
afterpartyTicketsLink: comp.aptickets || '',
```

The `formatTime` regex itself is correct (`/^(\d{1,2}:\d{2})/` captures `"18:30"` from `"18:30:00"`). The time display fix from the last edit should work once the data flows correctly.

#### Bug 3: Auto-select current week (or nearest upcoming week)

In `CompetitionTimeline.tsx`, the initial state is hardcoded to `0`:
```ts
const [activeWeekIndex, setActiveWeekIndex] = useState(0);
```

We need to compute the correct initial index after `weekendGroups` is built. The logic: find the first group whose date is today or in the future. If all dates are past, default to the last group.

```ts
// After building weekendGroups, compute the starting index
const today = new Date();
const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const defaultIndex = weekendGroups.findIndex(g => g.date >= todayMidnight);
const initialIndex = defaultIndex === -1 ? weekendGroups.length - 1 : defaultIndex;

const [activeWeekIndex, setActiveWeekIndex] = useState(initialIndex);
```

However, `weekendGroups` is derived inside the component body from `competitions` (a prop), so we need to use `useMemo` for the groups and then compute the initial index only once. The safest approach is to derive the initial index inside a `useState` initializer function so it only runs once on mount:

```ts
const weekendGroups = useMemo(() => groupByWeekend(competitions), [competitions]);

const [activeWeekIndex, setActiveWeekIndex] = useState(() => {
  const groups = groupByWeekend(competitions);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const idx = groups.findIndex(g => g.date >= todayMidnight);
  return idx === -1 ? Math.max(0, groups.length - 1) : idx;
});
```

---

### Files to Modify

**1. `src/pages/Index.tsx`** — lines 568-569

Change the key names so `showTicketsLink` and `afterpartyTicketsLink` are stored under the correct property names that `CompetitionDetail.tsx` reads:

```ts
// BEFORE:
showtickets: comp.showtickets || '',
aptickets: comp.aptickets || '',

// AFTER:
showTicketsLink: comp.showtickets || '',
afterpartyTicketsLink: comp.aptickets || '',
```

**2. `src/components/CompetitionTimeline.tsx`** — three changes:

- Add `useMemo` import
- Fix UTC date parsing in `groupByWeekend` (line 65: `new Date(dateKey)` → manual parse)
- Fix UTC date parsing in `isPast` check (line 201)
- Change `useState(0)` to auto-select the nearest upcoming/current week using a lazy initializer

**3. `src/lib/utils.ts`** — no changes needed (the regex and date parsing there are already correct)

**4. `src/components/CompetitionDetail.tsx`** — no changes needed (formatTime is correct, isLive uses the correctly-fixed utils.ts)

---

### Technical Summary

| # | Bug | File | Fix |
|---|---|---|---|
| 1 | UTC date shift (`new Date("YYYY-MM-DD")` is 1 day off in US timezones) | `CompetitionTimeline.tsx` | Parse date components manually |
| 2 | Wrong property keys (`showtickets`/`aptickets` vs `showTicketsLink`/`afterpartyTicketsLink`) | `Index.tsx` | Rename keys to match the `Competition` type |
| 3 | Timeline always starts on first week | `CompetitionTimeline.tsx` | Lazy `useState` initializer finds nearest upcoming date |
