

## Fix "Qualified for RAS" Not Applying from Backend

### Root Cause

The `rasqual` to `qualified` mapping happens twice, but the second one (in `Index.tsx` line 602) breaks it.

Here is what happens:
1. `fetchTeams()` in `api.ts` correctly maps `team.rasqual` to `qualified` -- this works fine
2. Then `Index.tsx` re-maps the already-transformed teams, but checks `team.rasqual` again -- which no longer exists on the mapped object (it was already converted to `team.qualified`), so it always evaluates to `false`

### Fix

**`src/pages/Index.tsx` (line 602)** -- Change from checking the raw Directus field to preserving the already-mapped value:

```ts
// Before (broken - rasqual doesn't exist on mapped team objects)
qualified: team.rasqual === true || team.rasqual === 'true',

// After (use the already-mapped qualified field)
qualified: team.qualified ?? false,
```

### Files to modify
- `src/pages/Index.tsx` -- one line change at line 602

