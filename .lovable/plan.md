
## What You Need to Do After This (Outside of Code)

All code-side cleanup is complete. After pulling these changes, here is your checklist to actually submit to the App Store. These steps cannot be done in the editor — they require your own machine.

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
