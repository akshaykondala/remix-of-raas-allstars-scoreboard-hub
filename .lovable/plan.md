

## Connect Directus Competition Fields to the App

The UI already renders `competition.time`, `competition.timezone`, `competition.showTicketsLink`, and `competition.afterpartyTicketsLink` in `CompetitionDetail.tsx`. The only gap is that two Directus field names differ from what the app expects:

| Directus field | App field | Status |
|---|---|---|
| `time` | `time` | Already matches |
| `timezone` | `timezone` | Already matches |
| `showtickets` | `showTicketsLink` | Needs mapping |
| `aptickets` | `afterpartyTicketsLink` | Needs mapping |

### Change

In `src/lib/competitionMapping.ts`, add two field mappings to the returned object so that the Directus names get translated to the app's expected names:

```
showTicketsLink: competition.showtickets || '',
afterpartyTicketsLink: competition.aptickets || '',
```

This is a 2-line addition in the return statement of `mapCompetitionTeamsFull`. Since the function already spreads `...competition`, `time` and `timezone` will pass through automatically. The explicit mappings for tickets will override any spread values with the correctly-named keys.

### Files to modify

- **`src/lib/competitionMapping.ts`** -- add `showTicketsLink` and `afterpartyTicketsLink` mappings in the return object

No other files need changes. The team `theme` field is already wired up in `api.ts` line 77.
