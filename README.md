# 🕌 BIN FAIZAL'S Mosque Services

> **Enterprise Digital Mosque Management & Smart Display Ecosystem**
> Complete solution for Android TV Smart Displays, Public Community PWA, Automated Prayer Timetables, and Mosque Administration.

---

## 📌 Project Overview

**BIN FAIZAL'S Mosque Services** is a modern, enterprise-level digital platform tailored for mosques and Islamic centers worldwide. It unifies high-reliability kiosk TV displays, responsive web/PWA interfaces for worshippers, high-precision prayer calculation engines, and an intuitive admin management suite.

### Key Platforms & Applications

1. **📺 Android TV Kiosk System (Digital Signboard)**
   - Auto-booting, continuous kiosk mode display optimized for 1080p / 4K TV screens.
   - Live counting clock, Azan audio visual alerts, Iqamah countdowns, Solat (Jama'at) mode screen dimmer.
   - Sliding Hadith/Quran verses, Islamic announcements, Jummah schedules, and weather updates.
   - 100% offline-first architecture with local cache resilience.

2. **🌐 Public Web Portal & Progressive Web App (PWA)**
   - Responsive community app installable on iOS, Android, and Desktop.
   - Real-time prayer timetables with local geolocation or custom mosque schedules.
   - Daily Dua, Hadith of the Day, Qur'an Verse of the Day, Qibla directional compass.
   - Offline service worker caching and push notifications for urgent mosque announcements.

3. **🛠 Mosque Administration Console**
   - Secure Role-Based Access Control (Super Admin, Imam, Mutawalli/Staff).
   - Monthly prayer timetable CSV/JSON bulk importer and manual editor.
   - Announcement builder with scheduled publishing and emergency broadcast triggers.
   - Gallery & Media Uploader (Images, Videos, PDFs for Jummah Khutbah).
   - System audit logs, automated database backups, and TV device telemetry monitoring.

4. **🕌 High-Precision Prayer Engine**
   - Built-in mathematical calculation algorithms: Muslim World League (MWL), ISNA, Umm Al-Qura (Makkah), Egyptian General Authority of Survey, University of Islamic Sciences (Karachi), Shia Ithna-Ashari, Moonsighting Committee.
   - Custom Hijri calendar date offset adjustment.
   - Ramadan Mode (Suhoor/Iftar countdowns, Taraweeh timing) and Eid festival modes.

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

### Supplementary Technical Documentation

- **Software Design Document (SDD)**: [`docs/bonus/SDD.md`](./docs/bonus/SDD.md)
- **API Documentation**: [`docs/bonus/API_DOCUMENTATION.md`](./docs/bonus/API_DOCUMENTATION.md)
- **Database Schema & Architecture**: [`docs/bonus/DATABASE_DESIGN.md`](./docs/bonus/DATABASE_DESIGN.md)
- **User Manual**: [`docs/bonus/USER_MANUAL.md`](./docs/bonus/USER_MANUAL.md)
- **Administrator Manual**: [`docs/bonus/ADMIN_MANUAL.md`](./docs/bonus/ADMIN_MANUAL.md)
- **Testing & QA Suite**: [`docs/bonus/TESTING_GUIDE.md`](./docs/bonus/TESTING_GUIDE.md)

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
