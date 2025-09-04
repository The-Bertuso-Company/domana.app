HOW TO FINALIZE UNIVERSAL LINKS (iOS & Android)

1) Replace placeholders in these files:
   - apple-app-site-association -> set YOUR_TEAM_ID and YOUR_IOS_BUNDLE_ID
     * Team ID: Apple Developer portal (Membership)
     * Bundle ID: matches ios.bundleIdentifier in app.config.js / app.json
   - assetlinks.json -> set your.android.package and sha256_cert_fingerprints
     * Fingerprint: Play Console (App Integrity > App signing key certificate)
       OR locally: keytool -list -v -keystore <path/to/keystore> -alias <alias> -storepass <pass>

2) Host these files on your web domain (the same domain used in EXPO_PUBLIC_WEB_BASE_URL):
   - https://<your-domain>/.well-known/apple-app-site-association   (no .json extension, no redirects)
   - https://<your-domain>/.well-known/assetlinks.json

3) In app.config.js:
   - scheme: (already set; default "domana")
   - ios.associatedDomains: include applinks:<your-domain>
   - android.intentFilters: already include https://<your-domain>/listing

4) Set env:
   - EXPO_PUBLIC_WEB_BASE_URL=https://<your-domain>
   - EXPO_PUBLIC_ASSOC_DOMAINS=applinks:<your-domain>

5) Rebuild the app:
   - npx expo prebuild (if bare) or use EAS build for iOS/Android
   - Install and test opening a URL like:
     https://<your-domain>/listing/DEMO-123?ref=share