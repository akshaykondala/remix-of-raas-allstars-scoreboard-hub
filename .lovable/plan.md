
I’ll make the drawer reliably sit lower than the notch by changing the positioning logic (not just tweaking the handle padding).

What’s actually wrong:
- The drawer body is forced to `h-[98vh]` in detail screens.
- In that setup, `marginTop` on the drawer container is not a reliable cap on iOS, so the top/handle can still end up under the notch.

Implementation plan:

1) Update `src/components/ui/drawer.tsx` (core fix)
- Replace the current `marginTop` style with a hard max-height cap based on safe area:
  - from: `marginTop: calc(env(safe-area-inset-top) + 6rem)`
  - to: `maxHeight: calc(100dvh - env(safe-area-inset-top, 0px) - 7rem)`
- Keep bottom anchoring so the sheet still opens from the bottom.
- Preserve existing handle visuals (`pt-5 pb-4`, slim pill), since the issue is vertical placement, not handle styling.

2) Keep current drawer consumers unchanged unless needed
- `CompetitionDetail.tsx` and `TeamDetail.tsx` currently use `h-[98vh] max-h-[98vh]`.
- With the new inline `maxHeight` cap in `drawer.tsx`, the notch-safe limit will override and force the drawer lower.
- If needed after this pass, I’ll do a second tiny cleanup to remove `max-h-[98vh]` in those two components so only the shared drawer controls height rules.

3) Verify behavior target
- Fully expanded drawer top should always render below Dynamic Island/notch.
- Handle remains easy to drag and visually clean.
- No regression on non-notched devices (safe-area resolves to 0).

Pixel intent:
- New top clearance = `safe-area-inset-top + 7rem` (about 112px + notch inset), which is intentionally lower than before and consistent across iPhones.
