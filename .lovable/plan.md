

## Fix: Season Journey Empty for Non-Placing Teams

### Root Cause

The `competitionResults` builder in `src/lib/api.ts` has two checks:
1. Did the team place 1st/2nd/3rd? (checks competition's `firstplace`/`secondplace`/`thirdplace` fields)
2. Is the team in the competition's `lineup` array? (checks `competition.lineup` junction table)

**The problem:** There's a third data source being ignored -- the team's own `competitions_attending` field. In Directus, `competitions_attending` is a separate M2M relationship on the team side. A team can be listed as attending a competition through `competitions_attending` without necessarily appearing in that competition's `lineup`. These two junction tables may not always be in sync.

So for teams that didn't place AND aren't in the `lineup`, the code returns `null` and filters them out -- even though the team's own data says they attended.

### Fix

**File: `src/lib/api.ts` (lines ~110-118)**

Add a third fallback check inside the `if (placement === 'N/A')` block: after checking `competition.lineup`, also check whether the competition's ID appears in `team.competitions_attending` (the raw Directus junction data, before it's mapped to names).

Updated logic:

```
if (placement === 'N/A') {
  // Check 1: Is team in competition's lineup?
  const inLineup = Array.isArray(competition.lineup) && competition.lineup.some(...);
  
  // Check 2: Is competition in team's competitions_attending?
  const inAttending = Array.isArray(team.competitions_attending) && 
    team.competitions_attending.some((compObj) => {
      const compId = compObj?.competitions_id?.id ?? compObj?.competitions_id ?? compObj;
      return String(compId) === String(competition.id);
    });
    
  if (!inLineup && !inAttending) return null;
  placement = 'Competed';
}
```

This ensures that if either the competition knows about the team (lineup) OR the team knows about the competition (competitions_attending), the competition shows up in their Season Journey.

### Files Modified
- `src/lib/api.ts` -- add `competitions_attending` check as fallback in competitionResults builder

