---
title: Deployment
updated: 2026-04-23
status: current
domain: ops
---

# Deployment

## Environments

| Environment | Trigger | What ships |
| ----------- | ------- | ---------- |
| GitHub Pages | push to `main` via `cd.yml` | `dist/` with `GITHUB_PAGES=true` |
| GitHub Release | release-please tag | web bundle + Android debug APK |
| Android Debug APK | every PR via `ci.yml` | `android/app/build/outputs/apk/debug/*.apk` |

Pages base path: `/primordial-ascent/`. Android APK is portrait-
locked via `capacitor.config.ts`.

## Secrets

`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` (release-only).

## Local APK build

```bash
pnpm build
pnpm exec cap sync android
cd android
./gradlew assembleDebug
```

## Local Pages preview

```bash
GITHUB_PAGES=true pnpm build
pnpm preview
```
