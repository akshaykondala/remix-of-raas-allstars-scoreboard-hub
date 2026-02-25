

## No 3rd Place for Competitions with 6 or Fewer Teams

### Rule
Competitions with 6 or fewer teams in their lineup should only award 1st and 2nd place. 3rd place (and its 1 bid point) should not be recognized.

### Changes

Both `src/pages/Index.tsx` and `src/lib/api.ts` have nearly identical placement logic that needs the same fix. In both files, the 3rd place check will be wrapped in a condition that verifies the competition has more than 6 teams in its lineup.

**File: `src/pages/Index.tsx` (lines ~144-147)**

Before the 3rd place check, calculate the lineup size. Skip 3rd place if lineup size is 6 or fewer:

```typescript
// existing 1st/2nd checks...
} else if (String(competition.thirdplace) === teamId || competition.thirdplace === teamName) {
  const lineupSize = Array.isArray(competition.lineup) ? competition.lineup.length : 0;
  if (lineupSize > 6) {
    placement = '3rd';
    pointsEarned = 1;
  }
}
```

**File: `src/lib/api.ts` (lines ~105-108)**

Same change:

```typescript
} else if (String(competition.thirdplace) === teamIdStr || competition.thirdplace === teamName) {
  const lineupSize = Array.isArray(competition.lineup) ? competition.lineup.length : 0;
  if (lineupSize > 6) {
    placement = '3rd';
    pointsEarned = 1;
  }
}
```

### Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Skip 3rd place award when competition lineup has 6 or fewer teams |
| `src/lib/api.ts` | Same change for consistency |

