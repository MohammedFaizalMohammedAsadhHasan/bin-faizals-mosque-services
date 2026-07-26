# 🛠 Volume 6 – Admin Panel
**Mosque Administration Console, Security RBAC & Content Management System for BIN FAIZAL'S Mosque Services**

---

## 1. Administration Console Overview

The **Admin Panel** provides mosque administrators, board trustees, and Imams with a secure, web-based control center to manage timetables, publish announcements, manage media galleries, and control connected TV displays.

---

## 2. Authentication & Role-Based Access Control (RBAC)

Authentication is secured using OAuth2 / JWT HTTP-Only cookies with 2FA TOTP support.

### Role Hierarchy & Permissions Matrix

| Permission Feature | Super Admin | Imam / Scholar | Mutawalli / Staff | TV Kiosk (Device) |
| :--- | :---: | :---: | :---: | :---: |
| **Manage Users & Roles** | ✅ | ❌ | ❌ | ❌ |
| **Upload Timetables (CSV)** | ✅ | ✅ | ❌ | ❌ |
| **Override Azan / Iqamah** | ✅ | ✅ | ✅ | ❌ |
| **Publish Announcements** | ✅ | ✅ | ✅ | ❌ |
| **Manage Media Gallery** | ✅ | ❌ | ✅ | ❌ |
| **Emergency TV Override** | ✅ | ✅ | ✅ | ❌ |
| **View Audit Logs & Backups**| ✅ | ❌ | ❌ | ❌ |
| **Fetch Display Schedule** | ✅ | ✅ | ✅ | Read-Only |

---

## 3. Dashboard Modules & Workflows

### 3.1 Main Dashboard
- **Live Status Widgets**: Connected TV Display Telemetry (Online/Offline status, active IP, app version).
- **Today's Active Timetable**: Current Fajr to Isha times with quick-edit delay controls.
- **Emergency Broadcast Button**: Single-click activation to push urgent alerts to all smart screens.

### 3.2 Timetable Management
- Bulk CSV/JSON upload with validation preview table.
- Interactive calendar grid allowing manual adjustments to individual dates.
- Automatic Hijri offset slider (+2 / -2 days).

### 3.3 Announcement & Slide Builder
- Rich Text Editor with bilingual support (Arabic & English).
- Target Screen Selector: Option to publish to TV Displays, Web/PWA, or both.
- Expiration Schedule: Start date/time and end date/time for automated removal.

### 3.4 Media Gallery Manager
- Supports image formats (`.webp`, `.png`, `.jpeg`) and video clips (`.mp4`, `.webm`).
- Drag-and-drop file uploader with automated compression for TV rendering.
- Khutbah PDF file repository for weekly Friday sermons.

### 3.5 System Audit Logs & Backups
- Complete event audit log capturing user ID, timestamp, IP address, and changed payload.
- One-click database export (JSON / SQL dump) and automated daily cloud snapshots.

### 3.6 Settings & Configuration
- Mosque Profile: Name, Address, Contact Details, Bank Account / QR Donation image.
- Calculation Parameters: Latitude, Longitude, Calculation Method, Asr School (Shafi'i/Hanafi).
