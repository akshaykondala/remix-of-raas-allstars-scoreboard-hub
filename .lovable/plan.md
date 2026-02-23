

## Add "Watch Show" Video Link for Past Competitions

### What Changes

**1. `src/lib/competitionMapping.ts`** -- Pass through the `videolink` field from Directus:
- Add `videoLink: competition.videolink || ''` to the returned object (line 49, alongside the existing `livestreamLink`, `showTicketsLink`, etc.)

**2. `src/lib/types.ts`** -- Add `videoLink` to the `Competition` interface:
- Add `videoLink?: string;` to the interface

**3. `src/components/CompetitionDetail.tsx`** -- Add a "Watch Show" button for past competitions:
- Import the `Play` (or `Video`) icon from `lucide-react`
- After the ticket links grid (around line 382), add a conditional block: only render when `!isFutureCompetition && !isLive` (i.e., past/completed competitions)
- The button follows the same visual pattern as the ticket links -- a styled `<a>` tag with gradient background, icon, label "Watch Show", and external link arrow
- When `videoLink` is empty, the button appears grayed out and disabled (same pattern as the ticket buttons when their links are missing)
- Color scheme: green gradient (`from-green-500/20`) to differentiate from the blue (tickets) and pink (afterparty) buttons

### Visual Layout

The video link will appear as a full-width button below the ticket links row, only visible on past competitions:

```text
[ Show Tickets ]  [ AP Tickets ]     <-- existing, 2-col grid
[ Watch Show                    ]     <-- new, full-width, only for past comps
```

### No other files change. The Comps tab and Standings tab competition modals will both pick this up automatically since they both go through `mapCompetitionTeamsFull` and render `CompetitionDetail`.
