

## Fix Safari Blur Rendering Artifacts on Podium and Header

### Problem
Safari (including WKWebView used by Capacitor) has a known rendering bug where elements using `blur`, `backdrop-blur`, and semi-transparent gradients show visible rectangular bounding boxes or "tinted boxes." This affects the podium cards and the header/logo area. Since Capacitor uses the same Safari engine, this will also appear in the native mobile app.

### Cause
The podium section has multiple layered blur elements:
- Background glow divs with `blur-xl`, `blur-2xl`, `blur-3xl` behind each podium card
- Profile picture glow divs with `blur-lg` behind each avatar
- Points badge glow divs with `blur-md`
- Background decorative blobs with `blur-3xl`
- `backdrop-blur-md` on the card containers

Safari struggles to composite these correctly, causing visible rectangular artifacts.

### Fix
Apply `-webkit-transform: translateZ(0)` (via Tailwind's `transform-gpu`) to force GPU-accelerated compositing on the blurred elements, which eliminates the bounding-box artifact. Also replace `backdrop-blur-md` on the podium cards with simple opacity-based backgrounds (no backdrop filter), since `backdrop-blur` is the primary culprit on Safari.

### Changes

**`src/pages/Index.tsx`** -- Podium section (lines ~1086-1190):

1. Add `transform-gpu` to all blur glow divs (the `absolute inset-0 ... blur-xl/2xl/3xl` elements) to force GPU compositing
2. Remove `backdrop-blur-md` from the three podium card containers and replace with slightly higher-opacity solid backgrounds
3. Add `transform-gpu` to the background decorative blobs (lines 997-999)

Specific elements to update:
- Line 997-999: Background blobs -- add `transform-gpu`
- Line 1086: 2nd place glow -- add `transform-gpu`
- Line 1088: 2nd place card -- remove `backdrop-blur-md`
- Line 1092: 2nd place avatar glow -- add `transform-gpu`
- Line 1106: 2nd place points glow -- add `transform-gpu`
- Line 1124: 1st place glow -- add `transform-gpu`
- Line 1126: 1st place card -- remove `backdrop-blur-md`
- Line 1130: 1st place avatar glow -- add `transform-gpu`
- Line 1144: 1st place points glow -- add `transform-gpu`
- Line 1162: 3rd place glow -- add `transform-gpu`
- Line 1164: 3rd place card -- remove `backdrop-blur-md`
- Line 1168: 3rd place avatar glow -- add `transform-gpu`
- Line 1182: 3rd place points glow -- add `transform-gpu`

### Files to modify
- `src/pages/Index.tsx` -- add `transform-gpu` to blur elements, remove `backdrop-blur-md` from podium cards

