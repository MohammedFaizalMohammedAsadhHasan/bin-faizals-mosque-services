# 📘 Volume 1 – Project Foundation (SRS)
**Software Requirements Specification (SRS) for BIN FAIZAL'S Mosque Services**

---

## 1. Project Vision

**BIN FAIZAL'S Mosque Services** aims to be the premier, enterprise-grade digital management and smart display platform tailored specifically for mosques, Islamic centers, and religious institutions globally. The project bridges modern digital display automation with community web accessibility and administrative convenience.

By delivering a zero-downtime Android TV Kiosk system, an installable Progressive Web App (PWA), and a centralized administrative dashboard, the platform guarantees that prayer times, Azan/Iqamah countdowns, Islamic announcements, Khutbah materials, and daily educational content are seamlessly synchronized across physical displays and mobile devices.

---

## 2. Business Goals

1. **Automation & Zero-Downtime Operation**: Eliminate manual updates on physical mosque signboards by automating prayer time calculations, seasonal adjustments (Daylight Saving, Ramadan, Eid), and daily content presentation.
2. **Enhanced Worshipper Engagement**: Provide worshippers with instant mobile and desktop access to accurate local prayer times, Qibla direction, daily Hadith/Dua/Verse, and mosque events via PWA.
3. **Streamlined Administration**: Empower mosque management (Imams, Board Members, Mutawallis) with a secure, role-based admin panel to upload monthly timetables, schedule announcements, and broadcast emergency alerts.
4. **Offline Resilience**: Ensure smart TV displays and PWA clients operate flawlessly without internet connectivity, drawing from local database caches and mathematical fallback algorithms.
5. **Brand Consistency & Professionalism**: Elevate the mosque's visual identity through high-contrast glassmorphic design systems suitable for 4K TV screens and mobile viewports.

---

## 3. Functional Requirements

### 3.1 Android TV Kiosk System
- **FR-TV-001**: System MUST auto-start upon TV power-on via Android Boot Receiver / Kiosk mode.
- **FR-TV-002**: System MUST render live, high-precision digital clock (hh:mm:ss) with current Gregorian and Hijri date.
- **FR-TV-003**: System MUST highlight the current prayer and display an active countdown timer to the next prayer.
- **FR-TV-004**: System MUST trigger visual and audio Azan alerts at exact prayer entry times.
- **FR-TV-005**: System MUST present an Iqamah countdown timer configurable per prayer (e.g., 10 or 15 mins after Azan).
- **FR-TV-006**: System MUST dim or switch the display screen to "Jama'at Mode" during Solat in progress to prevent distraction.
- **FR-TV-007**: System MUST support remote control DPAD navigation for settings and screen selection.
- **FR-TV-008**: System MUST display rotating slides for Hadith of the Day, Qur'anic Verses, announcements, and donation QR codes.

### 3.2 Public Web & PWA Client
- **FR-PWA-001**: Portal MUST be fully responsive across Mobile, Tablet, and Desktop viewports.
- **FR-PWA-002**: Users MUST be able to install the app on Android, iOS, and Desktop as a Progressive Web App.
- **FR-PWA-003**: App MUST function offline, providing cached timetable data and offline Dua/Hadith content via Service Workers.
- **FR-PWA-004**: App MUST include an interactive Qibla Compass using browser geolocation and device orientation.
- **FR-PWA-005**: App MUST receive push notifications for major announcements (e.g., Moon Sighting, Janazah alerts).

### 3.3 Mosque Administration Console
- **FR-ADM-001**: Admin MUST log in using secure multi-factor authentication (MFA) and Role-Based Access Control (RBAC).
- **FR-ADM-002**: Admin MUST be able to upload monthly prayer timetables via CSV, Excel, or JSON format.
- **FR-ADM-003**: Admin MUST be able to manually override individual prayer times or Iqamah delays.
- **FR-ADM-004**: Admin MUST be able to post, edit, schedule, and delete announcements with target publish/expire dates.
- **FR-ADM-005**: Admin MUST be able to upload media files (Images, Videos, Khutbah PDFs) to the gallery.
- **FR-ADM-006**: Admin MUST be able to toggle "Emergency Broadcast Mode" across all connected TV displays instantly.

### 3.4 Prayer Calculation & Time Engine
- **FR-PRY-001**: System MUST calculate prayer times automatically using standard calculation methods (MWL, ISNA, Umm Al-Qura, Karachi, Egypt, Moonsighting).
- **FR-PRY-002**: System MUST allow manual Hijri date adjustments (+/- 2 days) for moon sighting alignment.
- **FR-PRY-003**: System MUST support special modes for Ramadan (Suhoor/Iftar countdowns, Taraweeh times) and Eid prayers.

---

## 4. Non-Functional Requirements

### 4.1 Performance & Speed
- **NFR-PERF-001**: First Contentful Paint (FCP) on web/PWA MUST be under 1.2 seconds on 4G networks.
- **NFR-PERF-002**: TV Kiosk display MUST maintain 60 FPS UI animation rendering without frame drops.
- **NFR-PERF-003**: API response time for timetable queries MUST be under 100ms.

### 4.2 Availability & Reliability
- **NFR-REL-001**: TV display MUST achieve 99.99% uptime with automatic recovery from webview or app crashes.
- **NFR-REL-002**: Application MUST operate offline for up to 365 days using cached timetables or mathematical calculation fallback engines.

### 4.3 Security & Compliance
- **NFR-SEC-001**: All client-server communications MUST enforce TLS 1.3 HTTPS encryption.
- **NFR-SEC-002**: Admin session tokens MUST be stored in HTTP-Only, Secure, SameSite cookies.
- **NFR-SEC-003**: Database passwords and sensitive API keys MUST be stored hashed (Bcrypt / Argon2) and encrypted.

### 4.4 Usability & Accessibility
- **NFR-USE-001**: TV layout MUST be readable from a distance of 15 meters (high contrast, minimum 24pt base typography).
- **NFR-USE-002**: Web interface MUST comply with WCAG 2.1 Level AA standards.

---

## 5. Technology Stack

- **Frontend / Client App**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS / Vanilla CSS Variables.
- **PWA Capabilities**: Service Workers (Workbox / Next-PWA), IndexedDB (Dexie.js).
- **Backend Infrastructure**: Node.js API Routes / Supabase / PostgreSQL, Prisma ORM.
- **Android TV Integration**: WebAndroid Kiosk Shell / Capacitor TV WebView, Android Manifest Auto-Boot Receiver.
- **Deployment & Hosting**: GitHub, Vercel (Web / Admin), Cloudflare CDN, Docker (Self-hosted options).

---

## 6. GitHub Setup & Repository Strategy

1. **Main Branch (`main`)**: Production-ready, stable releases.
2. **Development Branch (`develop`)**: Integration branch for upcoming features.
3. **Feature Branches (`feature/*`)**: Individual feature development.
4. **Release Branches (`release/*`)**: Staging and release candidate verification.
5. **Bugfix Branches (`fix/*`)**: Specific bug resolutions.

### GitHub Actions CI/CD Pipeline
- **Lint & Type-Check**: Runs on every pull request.
- **Unit & Integration Tests**: Validates prayer calculation logic and API schemas.
- **Vercel Preview Deployment**: Automated deployment previews for pull requests.

---

## 7. Vercel Setup

- **Project Name**: `bin-faizal-mosque-services`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NEXT_PUBLIC_MOSQUE_NAME`

---

## 8. Directory & Folder Structure

```
├── docs/                     # System Documentation (Volumes 1-8 & Bonus Docs)
├── public/                   # Static Assets (Logos, Icons, Audio Alerts)
│   ├── audio/                # Azan notification sounds
│   ├── icons/                # PWA Manifest icons
│   └── images/               # Branding assets & backgrounds
├── src/                      # Source Code
│   ├── app/                  # Next.js App Router (Pages & API routes)
│   │   ├── (admin)/          # Admin panel layout & routes
│   │   ├── (public)/         # Public Web & PWA routes
│   │   ├── (tv)/             # Smart TV Kiosk full-screen display
│   │   └── api/              # REST & GraphQL API endpoints
│   ├── components/           # UI Components
│   │   ├── admin/            # Admin forms, tables, media manager
│   │   ├── prayer/           # Prayer cards, clocks, timetables
│   │   ├── tv/               # Kiosk tickers, TV layout grids, Adhan modal
│   │   └── ui/               # Design system primitives (Button, Modal, Card)
│   ├── lib/                  # Core Business Logic & Utilities
│   │   ├── db/               # Prisma database client & schemas
│   │   ├── prayer/           # Calculation algorithms & CSV parsers
│   │   └── utils/            # Date formatters, auth helpers, storage
│   └── types/                # TypeScript Interface Definitions
├── .env.example              # Environment template
├── README.md                 # Root documentation
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

---

## 9. Naming & Coding Standards

- **React Components**: `PascalCase.tsx` (e.g., `PrayerCard.tsx`)
- **Helper Files / Utilities**: `camelCase.ts` (e.g., `prayerTimeCalculator.ts`)
- **API Endpoints**: `kebab-case` (e.g., `/api/v1/prayer-timetable`)
- **Database Tables**: `snake_case` (e.g., `prayer_schedules`, `announcements`)
- **CSS Classes & Tokens**: `kebab-case` (e.g., `.prayer-card-glass`)

---

## 10. Security & Compliance Standards

1. **Authentication**: JWT / OAuth2 with HTTP-Only cookies.
2. **Authorization**: RBAC with strict middleware enforcement (`SuperAdmin`, `Admin`, `Staff`).
3. **Data Protection**: Input sanitization (Zod schemas) against SQL injection, XSS, and CSRF.
4. **Rate Limiting**: API throttling (100 requests per minute per IP).

---

## 11. Project Rules & Development Workflow

1. **Strict Typing**: TypeScript `strict: true`. No usage of explicit `any`.
2. **Clean Code**: SOLID principles and atomic component architecture.
3. **Commit Convention**: Conventional commits format (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`).
4. **Pull Requests**: Minimum 1 reviewer approval before merging to `main`.
