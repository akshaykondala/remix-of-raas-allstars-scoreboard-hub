
## Remove Background Bubble from Competition Cards

The dark circular element in the top-right of the Nationals card (and all competition cards) is a decorative background accent div at line 303-308 in `CompetitionTimeline.tsx`. It's a 24x24 rounded circle positioned at `-top-6 -right-6`.

### Change
**`src/components/CompetitionTimeline.tsx`** — Delete lines 303-308 (the entire background accent block for both RAS and non-RAS cards).
