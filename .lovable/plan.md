

## Add "On the Bubble" Indicator

The backend has a new `bubble` toggle field on teams. When enabled, the team should show an "On the Bubble" badge in the same style as the "Qualified for RAS" indicator but in a distinct color (amber/orange).

### Changes

#### 1. `src/lib/types.ts`
- Add `bubble?: boolean` to the `Team` interface

#### 2. `src/lib/api.ts`
- Map `team.bubble` from the Directus response into the Team object (line ~163, alongside `qualified`)

#### 3. `src/pages/Index.tsx` — Teams tab (lines 804-807)
- After the university text, add a conditional badge: if `team.qualified` show green "Qualified for RAS" pill, else if `team.bubble` show amber/orange "On the Bubble" pill
- Style: same rounded-full pill format, using `bg-amber-500/20 border border-amber-400/30 text-amber-400` to contrast with the green qualified badge

#### 4. `src/components/TeamDetail.tsx` — Drawer header (lines 100-105)
- After the existing `qualified` check, add an `else if` for `team.bubble` showing `text-amber-400/90` "On the Bubble" text in the same inline style as "Qualified for RAS"

#### 5. `src/pages/TeamDetailPage.tsx` — Status badge (lines 152-157)
- After the qualified badge, add conditional rendering for bubble: same pill style as the QUALIFIED badge but with amber colors (`from-amber-500/20 to-orange-500/20 border-amber-400/30 text-amber-400`) and text "ON THE BUBBLE"

### Color Distinction
- **Qualified**: Green (`emerald-400/green-400`)
- **On the Bubble**: Amber/Orange (`amber-400/orange-400`)

