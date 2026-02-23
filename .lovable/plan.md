

## Fix: Duplicate Competition Results Logic in Index.tsx Missing the Fix

### Root Cause

The previous fixes were applied to `src/lib/api.ts`, but `src/pages/Index.tsx` has its **own separate, duplicate** competition results builder (lines 128-162) that was never updated. This is the code path that runs when you view teams from the main page.

Specifically, **line 149 of Index.tsx** still has:
```
if (placement === 'N/A') return null;
```

...with NO lineup or `competitions_attending` check. So any team that didn't place 1st/2nd/3rd gets all their competitions filtered out, resulting in 0 competitions and an empty Season Journey.

### Fix

**File: `src/pages/Index.tsx` (lines ~148-149)**

Replace the simple `return null` with the same dual-check logic that exists in `api.ts`:

```
if (placement === 'N/A') {
  // Check 1: Is team in the competition's lineup?
  const teamId = String(team.id);
  const teamName = team.name;
  const inLineup = Array.isArray(competition.lineup) && competition.lineup.some((entry) => {
    const entryTeamId = entry?.teams_id?.id ?? entry?.teams_id ?? entry?.id ?? entry;
    return String(entryTeamId) === teamId ||
           (entry?.teams_id?.name && entry.teams_id.name === teamName);
  });

  // Check 2: Is competition in team's competitions_attending?
  const inAttending = Array.isArray(team.competitions_attending) &&
    team.competitions_attending.some((compObj) => {
      const compId = compObj?.competitions_id?.id ?? compObj?.competitions_id ?? compObj?.id ?? compObj;
      return String(compId) === String(competition.id);
    });

  if (!inLineup && !inAttending) return null;
  placement = 'Competed';
}
```

Note: In Index.tsx, `team` at this point is the already-fetched team from `fetchTeams()`, so `team.competitions_attending` contains mapped name strings. The `inAttending` check needs to also handle comparing competition names (not just IDs). We'll add a name comparison fallback:
```
return String(compId) === String(competition.id) || compId === competition.name;
```

And `competition.lineup` here uses the raw lineup from Directus (line 99: `lineup: comp.lineup || []`), so the junction-table-style check will work correctly.

### Files Modified
- `src/pages/Index.tsx` -- apply the same lineup + attending check that was already applied to `api.ts`

