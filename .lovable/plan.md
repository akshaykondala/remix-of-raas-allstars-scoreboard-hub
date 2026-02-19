
## What Still Needs to be Fixed (Code Changes)

There are 4 remaining code issues found across 4 files. None of these change any visual behavior — they are all cleanup and correctness fixes.

---

### 1. Remove all remaining `console.log` / `console.error` debug statements

These were missed in the previous cleanup pass:

- **`src/components/TeamCard.tsx` line 17** — logs every team's bid points on every render (fires dozens of times per page load)
- **`src/lib/competitionMapping.ts` lines 3–7, 10, 14, 20, 23, 30, 46** — logs every lineup entry being processed (fires on every competition card render)
- **`src/components/CompetitionsTab.tsx` line 667** — logs the selected competition object on every selection
- **`src/pages/TeamDetailPage.tsx` lines 242–243, 246, 250, 264, 268, 271, 319, 340–341** — logs team lookups and fetch results on every render

The `NotFound.tsx` `console.error` on line 8 is left in — that one is intentional and appropriate (logging a genuine 404 error is correct behavior).

---

### 2. Remove fallback data from `TeamDetailPage.tsx`

Lines 11–231 define a large `fallbackTeams` array (NYU Bhangra, UIUC Roshni, etc.) and lines 271–272 use it when the API returns nothing. This mirrors the same problem that was fixed in `Index.tsx`. The fix:

- Delete the `fallbackTeams` constant (lines 11–231)
- In the `catch` block, set `setTeams([])` instead of `setTeams(fallbackTeams)`
- In the `else` branch (lines 270–273), set `setTeams([])` instead of `setTeams(fallbackTeams)`
- Remove the fallback competitions block (lines 301–316) and set `setCompetitions([])` instead

If the API is unreachable on the team detail page, the user will see the "Loading team details..." screen and then navigate back — which is safe since this page is only reachable by tapping a real team card on the main screen.

---

### 3. Add a fetch timeout to `src/lib/api.ts`

Currently there is no timeout on any `fetch()` call. If the Directus API hangs (no response at all), the loading screen spins forever. The fix is to wrap each `fetch` with an `AbortController` and a 10-second timeout:

```ts
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);
const res = await fetch(url, { signal: controller.signal, headers: { ... } });
clearTimeout(timeoutId);
```

This ensures the fetch will fail (throw) after 10 seconds, the `finally` block fires, `dbReady` becomes `true`, and the loading screen dismisses with an empty state instead of spinning forever.

---

### 4. Move `@capacitor/cli` to `devDependencies` in `package.json`

Currently `@capacitor/cli` is in `dependencies` (line 16). It is a build-time CLI tool and should be in `devDependencies`. This has no effect on app behavior but is required for a clean production build and is flagged by App Store tooling.

---

## Files to Modify

| File | Change |
|---|---|
| `src/components/TeamCard.tsx` | Remove 1 `console.log` on line 17 |
| `src/lib/competitionMapping.ts` | Remove 8 `console.log` statements |
| `src/components/CompetitionsTab.tsx` | Remove 1 `console.log` on line 667 |
| `src/pages/TeamDetailPage.tsx` | Remove 9 `console.log`/`console.error` statements + remove `fallbackTeams` constant + set empty arrays on failure |
| `src/lib/api.ts` | Add 10-second `AbortController` timeout to `fetchFromDirectus` |
| `package.json` | Move `@capacitor/cli` from `dependencies` to `devDependencies` |

---

## What You Need to Do After This (Outside of Code)

After pulling these changes, here is your checklist to actually submit to the App Store. These steps cannot be done in the editor — they require your own machine.

**Step 1 — Export to GitHub**
Use the "Export to GitHub" button in Lovable to push the code to your own repository, then `git pull` it to your machine.

**Step 2 — Install and initialize native projects**
Run these commands in the project folder on your machine:
```bash
npm install
npx cap add ios
npx cap add android
npm run build
npx cap sync
```

**Step 3 — Create app icons**
You need a single 1024×1024 PNG file (`icon.png`) with your app logo. You can then use the `@capacitor/assets` tool to auto-generate all required iOS and Android icon sizes:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

**Step 4 — Open in Xcode / Android Studio**
```bash
npx cap open ios      # Opens Xcode for iOS submission
npx cap open android  # Opens Android Studio for Google Play
```

**Step 5 — Write and host a Privacy Policy**
Both Apple and Google require a publicly accessible privacy policy URL. This can be a simple page on any website (even a Google Doc published to the web). It must be linked in your App Store Connect and Google Play Console listings.

**Step 6 — App Store Connect / Google Play Console**
- Create an account at [appstoreconnect.apple.com](https://appstoreconnect.apple.com) (Apple Developer Program costs $99/year)
- Create an account at [play.google.com/console](https://play.google.com/console) (Google Play one-time fee is $25)
- Fill in your app name, description, screenshots, and privacy policy URL in each console before submitting
