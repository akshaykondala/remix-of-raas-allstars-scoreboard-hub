

## App Store Compliance Checklist and Fixes

### Issues to Address

**1. Install `@capacitor/ios`**
Add the iOS platform package so you can build for iPhone/iPad.

**2. Remove debug script from `index.html`**
The `gptengineer.js` script loaded from `cdn.gpteng.co` must be removed for production builds. Apple reviews will flag external debug scripts. This line needs to go:
```
<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
```

**3. Move `@capacitor/cli` to devDependencies**
It's a build tool, not a runtime dependency. Moving it keeps the production bundle cleaner.

**4. Add App Transport Security exception for Directus API**
Your app calls an external Directus API over HTTPS. This should work fine with ATS, but if your Directus instance ever uses a non-standard cert, you'd need an exception in `Info.plist`. For now, just confirm your Directus URL is HTTPS.

**5. App icons and splash screens (manual step)**
After exporting to GitHub and running `npx cap add ios`, you'll need to:
- Add a 1024x1024 app icon to the Xcode asset catalog
- Configure launch/splash screen in Xcode
- Apple requires these for submission

**6. Privacy policy**
Apple requires a privacy policy URL when submitting. You'll need to:
- Host a privacy policy page (could be a simple route in the app or an external URL)
- Provide it during App Store Connect submission

**7. Remove `console.error` in NotFound page**
Minor cleanup -- the only remaining console statement. Production apps should not log to console.

### Files Modified
- `index.html` -- remove the gptengineer.js script tag
- `package.json` -- move `@capacitor/cli` to devDependencies, add `@capacitor/ios`
- `src/pages/NotFound.tsx` -- remove console.error call
- `capacitor.config.ts` -- no changes needed (already configured correctly)

### Manual Steps (outside Lovable)
- Export project to GitHub, clone locally
- Run `npm install`, then `npx cap add ios`
- Add app icons in Xcode (Assets.xcassets)
- Configure splash screen in Xcode
- Create and host a privacy policy
- Submit via App Store Connect with your Apple Developer account ($99/year)

For a detailed walkthrough of the Capacitor deployment process, check out the Lovable blog post on native mobile app deployment.

