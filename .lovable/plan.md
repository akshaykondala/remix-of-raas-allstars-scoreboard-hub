

## Fix: Ticket Links Always Grayed Out

### Root Cause

The ticket links are being **double-mapped**, which wipes out the URLs:

1. When competitions are first fetched in `Index.tsx` (line 114), the raw Directus field `comp.showtickets` is correctly mapped to `showTicketsLink`
2. Later, when you click a competition, `mapCompetitionTeamsFull()` is called on the **already-mapped** object
3. That function reads `competition.showtickets` -- but that raw field name no longer exists (it was already renamed to `showTicketsLink` in step 1)
4. So it evaluates to `undefined`, and `undefined || ''` produces an empty string, overwriting the real URL

The same bug affects afterparty tickets and livestream links.

### Fix

Update `src/lib/competitionMapping.ts` to check for **both** the raw Directus field name AND the already-mapped field name, so it works whether the competition has been pre-mapped or not:

```ts
showTicketsLink: competition.showtickets || competition.showTicketsLink || '',
afterpartyTicketsLink: competition.aptickets || competition.afterpartyTicketsLink || '',
livestreamLink: competition.livelink || competition.livestreamLink || '',
```

This is a one-line-each fix in a single file. No other files need to change.

### Files Modified

| File | Change |
|---|---|
| `src/lib/competitionMapping.ts` | Lines 47-49: add fallback to already-mapped field names |

### Also: Add `videoLink` mapping (from the previously approved plan)

Since this file is being touched, the `videoLink` field mapping will also be added here, along with the "Watch Show" button in `CompetitionDetail.tsx` and the type update in `types.ts` -- completing the previously approved plan that was interrupted.

| File | Change |
|---|---|
| `src/lib/competitionMapping.ts` | Add `videoLink: competition.videolink || competition.videoLink || ''` |
| `src/lib/types.ts` | Add `videoLink?: string` to Competition interface |
| `src/components/CompetitionDetail.tsx` | Add "Watch Show" button for past competitions (green gradient, Play icon, full-width below ticket row) |

