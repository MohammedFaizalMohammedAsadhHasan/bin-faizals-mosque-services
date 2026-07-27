# 🕌 BIN FAIZAL'S Mosque Services

[![Production Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://bin-faizals-mosque-services.vercel.app)
[![Release Version](https://img.shields.io/badge/Release-v1.0.0-064e3b?style=for-the-badge&logo=github)](https://github.com/MohammedFaizalMohammedAsadhHasan/bin-faizals-mosque-services)
[![Build Status](https://img.shields.io/badge/CI%2FCD-Passed-emerald?style=for-the-badge&logo=githubactions)](https://github.com/MohammedFaizalMohammedAsadhHasan/bin-faizals-mosque-services/actions)

> **Enterprise Digital Mosque Management & Smart Display Ecosystem**  
> Unified solution for Android TV Kiosk Signboards, Community PWA, 3-Tier Prayer Calculation Engines, Offline IndexedDB Storage, and Mosque Administration.

---

## 📌 Project Overview

**BIN FAIZAL'S Mosque Services** is a modern, enterprise-level digital platform tailored for mosques and Islamic centers worldwide. It unifies high-reliability kiosk TV displays, responsive web/PWA interfaces for worshippers, high-precision prayer calculation engines, and an intuitive admin management suite.

### Key Platforms & Features (Phases 1 - 6 Delivered)

1. **📺 Android TV Kiosk System (Digital Signboard)**
   - Auto-booting `BootReceiver` launching app on TV box startup after power outages.
   - Hardware acceleration, Screen Wake Lock (`FLAG_KEEP_SCREEN_ON`), sticky immersive full-screen display.
   - Live counting 12-hour clock, Azan audio-visual modals, Iqamah countdowns, and news ticker.
   - Native Android TV App source code located in [`android/`](./android/README.md).

2. **🎨 Luxury UI/UX Design System**
   - Branded **BIN FAIZAL'S** splash screen with animated progress ring loader.
   - Ambient glowing "Bubbles Snow" HTML5 particle canvas animation (`AmbientBubbles.tsx`).
   - Dark luxury gold & emerald palette (`#020617`, `#064e3b`, `#d97706`) with high-density backdrop blur glassmorphism cards.

3. **📱 Progressive Web App (PWA) & Offline Engine**
   - Custom 1-click PWA installation prompt banner (`PWAInstallPrompt.tsx`).
   - Service Worker (`public/sw.js`) with Web Push notifications for Azan alerts, background sync (`sync`), and cache-first strategies.
   - 100% offline-first architecture with IndexedDB data layer (`src/lib/offline/db.ts`).

4. **🕌 3-Tier Prayer Calculation Engine**
   - **Tier 1**: Uploaded official annual CSV timetable stored in IndexedDB.
   - **Tier 2**: Embedded 12-month mosque annual schedule dataset.
   - **Tier 3**: Astronomical solar math calculation engine (Muslim World League 18° / Umm Al-Qura standards).
   - Dynamic Gregorian-to-Hijri calendar converter with Arabic typography (`hijriEngine.ts`) and manual offset adjustments.

---

## 📚 Complete Documentation Suite

This repository contains full enterprise documentation organized into 8 Volumes and supplementary technical manuals in the `docs/` folder:

| Document Volume | Focus Area | Location |
| :--- | :--- | :--- |
| **📘 Volume 1** | Project Foundation & Software Requirements (SRS) | [`docs/Volume_1_SRS.md`](./docs/Volume_1_SRS.md) |
| **🎨 Volume 2** | UI / UX Design System & Aesthetics | [`docs/Volume_2_UI_UX_Design_System.md`](./docs/Volume_2_UI_UX_Design_System.md) |
| **📺 Volume 3** | Android TV System & Kiosk Architecture | [`docs/Volume_3_Android_TV_System.md`](./docs/Volume_3_Android_TV_System.md) |
| **🌐 Volume 4** | Website & Progressive Web App (PWA) | [`docs/Volume_4_Website_PWA.md`](./docs/Volume_4_Website_PWA.md) |
| **🕌 Volume 5** | Prayer Management & Calculation System | [`docs/Volume_5_Prayer_Management_System.md`](./docs/Volume_5_Prayer_Management_System.md) |
| **🛠 Volume 6** | Mosque Admin Management Console | [`docs/Volume_6_Admin_Panel.md`](./docs/Volume_6_Admin_Panel.md) |
| **💾 Volume 7** | Backend Engine & Database Specifications | [`docs/Volume_7_Backend_Database.md`](./docs/Volume_7_Backend_Database.md) |
| **🚀 Volume 8** | Production, Deployment & APK Build Guide | [`docs/Volume_8_Production_Deployment.md`](./docs/Volume_8_Production_Deployment.md) |
| **📱 Android TV APK Guide** | Native APK Compilation & ADB Deployment | [`android/README.md`](./android/README.md) |
| **📄 Testing Protocol** | Production Quality Assurance Guide | [`docs/bonus/TESTING_GUIDE.md`](./docs/bonus/TESTING_GUIDE.md) |


---

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 14+ / React 18+ / TypeScript
- **Styling & UI**: Vanilla CSS Design Tokens / Glassmorphism / Tailwind CSS
- **State Management & Caching**: Zustand / React Query / IndexedDB (Dexie.js)
- **Service Worker / PWA**: `@ducanh2912/next-pwa` / Workbox
- **Backend / Database**: Node.js / Supabase / PostgreSQL / Prisma ORM
- **Smart TV Kiosk Wrapper**: WebAndroid Kiosk Shell / Capacitor / WebView Bridge

---

## 🚀 Quick Start & Installation

```bash
# 1. Clone the repository
git clone https://github.com/binfaizal/mosque-services.git
cd mosque-services

# 2. Install dependencies
npm install

# 3. Environment Configuration
cp .env.example .env.local

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ⚖️ License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## 🤝 Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) to get started.
