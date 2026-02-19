

## Connect `rasqual` Backend Field for RAS Qualification

### Current behavior
The `qualified` field is auto-calculated as `bidPoints >= 5` in two places:
- `src/lib/api.ts` (line ~75): `qualified: (team.bidpoints || 0) >= 5`
- `src/pages/Index.tsx` (line ~602): `qualified: (team.bidPoints || ...) >= 5`

### What changes

**1. `src/lib/api.ts`** -- In the `fetchTeams` mapping, replace the auto-calculated `qualified` with the Directus `rasqual` boolean field:
```ts
qualified: team.rasqual === true || team.rasqual === 'true',
```

**2. `src/pages/Index.tsx`** -- In the inline team mapping (around line 602), same change:
```ts
qualified: team.rasqual === true || team.rasqual === 'true',
```

Also update the simulation recalculation (around line 762) to preserve the backend `rasqual` value instead of overriding it with a points threshold:
```ts
qualified: team.qualified  // keep existing value from backend
```

**3. Fallback data** -- The hardcoded fallback teams in `Index.tsx` already have `qualified` set manually, so no change needed there. They will continue to work when Directus is not connected.

### Files to modify
- `src/lib/api.ts` -- use `team.rasqual` instead of bid points threshold
- `src/pages/Index.tsx` -- use `team.rasqual` in API mapping and preserve it in simulation recalculation

