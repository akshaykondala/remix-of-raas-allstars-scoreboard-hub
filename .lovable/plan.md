
## Fix Competition Drawer: Header Spacing to Match Teams Tab

### What's Different

Comparing the two drawer headers side by side:

| Component | Header padding | Effect |
|---|---|---|
| `TeamDetail.tsx` | `pt-[28px] px-[22px] pb-4` | Logo sits comfortably below the drag handle |
| `CompetitionDetail.tsx` | `py-[20px] px-[22px]` | `py` sets top AND bottom equally to 20px, less breathing room at the top, logo is tight against the drag handle |

The Team drawer uses `pt-[28px]` (28px top, standard bottom), while the Competition drawer uses `py-[20px]` (20px symmetrically). The fix is simply aligning the Competition drawer's header padding to match the Team drawer exactly.

### Change

**`src/components/CompetitionDetail.tsx` — line 220**

```tsx
// BEFORE:
<DrawerHeader className="... p-6 pb-4 py-[20px] px-[22px]">

// AFTER:
<DrawerHeader className="... p-6 pb-4 pt-[28px] px-[22px]">
```

Changing `py-[20px]` → `pt-[28px]` gives the competition logo the same top clearance from the drag handle as the team logo has.

### File to Modify
- `src/components/CompetitionDetail.tsx` — update `DrawerHeader` padding class from `py-[20px]` to `pt-[28px]`
