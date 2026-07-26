# 🌐 Volume 4 – Website + PWA
**Progressive Web Application Specification, Web Architecture & Service Worker Setup for BIN FAIZAL'S Mosque Services**

---

## 1. PWA & Web Architecture Overview

The **Public Website & Progressive Web App (PWA)** provides worshippers with instantaneous access to mosque prayer timetables, Qibla compass, announcements, and daily Islamic content from any smartphone, tablet, or desktop browser.

```
+-------------------------------------------------------------------+
|                        Web Browser / Mobile PWA                   |
+-------------------------------------------------------------------+
|                                                                   |
|  +-------------------------------------------------------------+  |
|  |                 Next.js App Router Page Layer               |  |
|  |  +-------------------+ +------------------+ +-------------+ |  |
|  |  | Home / Countdown  | | Prayer Timetable | | Qibla Compass| |  |
|  |  +-------------------+ +------------------+ +-------------+ |  |
|  +-------------------------------------------------------------+  |
|                                |                                  |
|                                v                                  |
|  +-------------------------------------------------------------+  |
|  |                 Service Worker & Workbox Layer              |  |
|  |  +------------------+ +-------------------+ +-------------+ |  |
|  |  | Offline Cache    | | Push Notification | | Sync Engine | |  |
|  |  +------------------+ +-------------------+ +-------------+ |  |
|  +-------------------------------------------------------------+  |
|                                |                                  |
|                                v                                  |
|  +-------------------------------------------------------------+  |
|  |             Browser Storage (IndexedDB & Cache API)         |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 2. Web App Manifest (`manifest.json`)

```json
{
  "name": "BIN FAIZAL'S Mosque Services",
  "short_name": "BF Mosque",
  "description": "Live Mosque Prayer Timetable, Qibla Compass, Daily Duas & Community Services",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#070a0f",
  "theme_color": "#064e3b",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## 3. Service Worker & Offline Caching Strategy

The PWA relies on Workbox via `@ducanh2912/next-pwa` for robust caching strategies:

1. **Timetable & API Cache**: `StaleWhileRevalidate` strategy for `/api/v1/timetable`. Returns cached timetable immediately while fetching updates in the background.
2. **Static Assets (CSS, JS, WebFonts)**: `CacheFirst` strategy with 1-year expiration.
3. **Daily Dua & Hadith Content**: `CacheFirst` fallback for seamless offline reading.

```javascript
// service-worker.js snippet
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Cache Timetable API
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1/timetable'),
  new StaleWhileRevalidate({
    cacheName: 'timetable-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
```

---

## 4. Install Prompt Customization

To maximize mobile adoption, a custom glassmorphism installation banner is rendered for non-installed visitors:

- **Android / Chrome**: Captures `beforeinstallprompt` event and triggers direct app installation on button click.
- **iOS / Safari**: Displays step-by-step visual instruction ("Tap Share icon and select 'Add to Home Screen'").

---

## 5. Web Push Notifications

Worshippers can subscribe to web push notifications for critical updates:
- **Janazah (Funeral) Solat Announcements**
- **Moon Sighting Confirmation (Ramadan / Shawwal / Eid)**
- **Emergency Weather or Mosque Maintenance Alerts**

Powered by Web Push Protocol + VAPID Keys.

---

## 6. Interactive Qibla Compass Engine

Uses modern browser Device Orientation APIs (`DeviceOrientationEvent` / `DeviceMotionEvent`) combined with vector spherical trigonometry (Haversine & Forward Azimuth formula) calculating exact bearing from user GPS position toward the Kaaba in Makkah (21.4225° N, 39.8262° E).

---

## 7. SEO & OpenGraph Best Practices

Every public page contains comprehensive meta tags for search visibility and social sharing:
- `<title>`: Dynamic per page (e.g., `Today's Prayer Times - BIN FAIZAL'S Mosque`).
- `<meta name="description">`: Rich localized summary.
- **OpenGraph & Twitter Cards**: High-resolution image card showing today's Fajr, Dhuhr, Asr, Maghrib, Isha times when shared on WhatsApp or social media.
- **Structured Data (JSON-LD)**: Schema.org `Mosque` / `PlaceOfWorship` schema for Google Search indexing.
