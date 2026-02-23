

## Show City + Date on Entire RAS Competition Page (Not Just Judges)

When a RAS-toggled competition has no judges filled out, the entire competition detail page should display a clean, elegant city and date treatment -- not just the judges panel.

### What Changes

**File: `src/components/CompetitionDetail.tsx`**

Wrap the content sections (lineup, placings, judges, Instagram) in a conditional. When `competition.ras` is true AND judges are empty:

- **Keep**: The header (logo, name, time row, ticket links) -- these are always useful
- **Replace**: The lineup, placings, judges, and Instagram sections with a single elegant centered block showing:

```
── Houston, TX ──
April 12, 2026
```

Styled with amber/gold tones, generous vertical padding, centered typography. This replaces lines ~446-582 (everything after the ticket links area) with the fallback when the condition is met.

- **Remove**: The judges-only fallback added previously (lines 544-558) since this new whole-page approach supersedes it

When judges ARE filled out, everything renders normally as it does today.

### Technical Detail

- Condition: `competition.ras && (competition.judges || []).filter(j => j && j.name).length === 0`
- If true: render a single `div` with city + formatted date in amber tones, with decorative dashes and spacious padding
- If false: render all existing sections (lineup, placings, judges, Instagram) unchanged
- The existing judges-only fallback block becomes redundant and gets removed

### Files Modified
- `src/components/CompetitionDetail.tsx` -- conditional wrap around lines 446-582

