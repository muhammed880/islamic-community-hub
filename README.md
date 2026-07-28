# Islamic Community Hub - Masjid Management Platform

This repository contains the initial scaffold for the Islamic Community Hub mobile/backend project (Android app + Firebase backend).

Overview
- Android app (Kotlin + Jetpack Compose) — scaffold instructions in /android-app
- Firebase backend (Firestore, Storage, Cloud Functions) — Cloud Functions stubs in /functions
- Firestore security rules at firestore.rules

What I pushed in this commit
- README.md (this file)
- firestore.rules (security rules skeleton)
- functions/package.json (Cloud Functions dependencies & scripts)
- functions/index.ts (stubs: masjid/nikah ID generator and PDF job trigger)
- android-app/README.md (instructions to create Android project and connect Firebase)
- .gitignore
- LICENSE (MIT)

Quick next steps (local)
1. Create a Firebase project and enable Firestore, Authentication (Phone), and Storage.
2. Add Android app to Firebase and download `google-services.json`.
   - Place it into `android-app/app/` before building the Android project.
3. From `functions/` run:
   - npm install
   - firebase deploy --only functions
4. Deploy Firestore rules:
   - firebase deploy --only firestore:rules

How I will continue after you confirm everything is ok
- Add Android Kotlin scaffold and UI modules (Auth, Home tiles, Masjid registration, Nikah form, signature capture).
- Implement Cloud Functions logic for ID generation and PDF generation (Puppeteer/HTML -> PDF) and notification triggers.

If you want me to proceed to push full Android code next, reply "Push Android scaffold" and I will add the initial Android project files.

---

