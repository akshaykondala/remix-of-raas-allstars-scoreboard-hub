

## Change "Competitions This Season" to "Competitions Completed"

### What Changes

**File: `src/components/TeamDetail.tsx` (lines 147 and 149)**

1. **Label**: Change `"Competitions This Season"` to `"Competitions Completed"`
2. **Count**: Instead of counting all entries in `competitionResults`, filter to only count past competitions (exclude those with placement `"Upcoming"`).

Updated count logic:
```
{team.competitionResults?.filter(r => r.placement !== 'Upcoming').length || 0}
```

This ensures only completed competitions are counted -- upcoming ones won't inflate the number.
