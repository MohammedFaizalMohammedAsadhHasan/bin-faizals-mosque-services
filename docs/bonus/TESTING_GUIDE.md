# 📄 Testing & Quality Assurance Guide
**Comprehensive Production Testing Protocols for BIN FAIZAL'S Mosque Services**

---

## 1. Test Architecture Overview

The testing suite validates all layers of the platform:
- **Unit Testing**: Mathematical solar prayer calculation algorithms (`astronomicalEngine.ts`), Gregorian-to-Hijri calendar converters (`hijriEngine.ts`), and CSV timetable parsers.
- **Integration Testing**: Next.js App Router navigation (`/`, `/tv`, `/admin`), Service Worker registration, and IndexedDB storage persistence.
- **PWA & Offline Testing**: Service Worker shell caching, Web Push notifications, background sync, and offline banner triggers.
- **Android TV Kiosk Hardware QA**: Sticky immersive full-screen mode, Screen Wake Lock (`FLAG_KEEP_SCREEN_ON`), DPAD key navigation, and `BootReceiver` auto-start.

---

## 2. Automated Test Suite Commands

```bash
# Run unit & calculation tests
npm run test

# Run Next.js linting and type-checks
npm run lint

# Run Next.js production build verification
npm run build
```

---

## 3. Manual QA Verification Checklist

### 📺 Smart TV Kiosk (`/tv`)
- [x] Verify splash screen animation with BIN FAIZAL'S branding loads smoothly on startup.
- [x] Verify ambient floating particle ("Bubbles Snow") HTML5 canvas animation renders without lagging.
- [x] Confirm 12-hour clock updates every second with correct AM/PM indicator.
- [x] Confirm dynamic Hijri date displays accurately in Arabic typography.
- [x] Verify current prayer highlight (`glass-card-active pulse-gold`) shifts accurately at prayer time transitions.
- [x] Confirm Adhan modal pops up automatically when Azan time arrives.

### 📱 Community PWA (`/`)
- [x] Verify PWA Web App Manifest (`manifest.json`) passes Chrome DevTools Audit.
- [x] Confirm custom PWA installation prompt banner appears for uninstalled devices.
- [x] Verify offline mode indicator banner displays when Wi-Fi is toggled off.
- [x] Confirm Qibla compass widget calculates correct compass heading.

### 🛠 Admin Portal & Offline Storage (`/admin`)
- [x] Verify annual timetable CSV uploader parses 365-day rows cleanly.
- [x] Confirm uploaded timetable rows persist directly into IndexedDB (`saveTimetable`).
- [x] Verify fallback astronomical calculation engine generates accurate times when no CSV data exists.

---

## 4. Hardware Kiosk Reliability Tests

- **Power Cycle Test**: Power off the Android TV box while running. Upon powering back on, `BootReceiver` must launch `MainActivity` automatically within 10 seconds.
- **Network Outage Test**: Disconnect Ethernet/Wi-Fi router. The TV display must seamlessly fall back to IndexedDB cached schedule without crashing or showing browser error pages.
