# 🎨 Volume 2 – UI / UX Design System
**Design System, Brand Guidelines & Component Architecture for BIN FAIZAL'S Mosque Services**

---

## 1. Brand Identity & Vision

**BIN FAIZAL'S Mosque Services** visual identity reflects spiritual serenity, modern elegance, and high-visibility clarity. It blends traditional Islamic aesthetics (geometric harmony, rich emerald tones, warm gold accents) with contemporary digital design principles (glassmorphism, subtle micro-animations, high-contrast typography).

---

## 2. Color Palette

The color system uses CSS custom properties (variables) for consistent application across TV displays, Web PWA, and Admin consoles.

```css
:root {
  /* Brand Primary Colors */
  --color-primary-900: #042f2e; /* Deep Islamic Emerald */
  --color-primary-800: #064e3b; /* Rich Forest Green */
  --color-primary-600: #0d9488; /* Vibrant Teal Accent */
  --color-primary-100: #ccfbf1; /* Soft Mint Background Tint */

  /* Gold & Warm Accents */
  --color-gold-600: #d97706;    /* Dome Gold */
  --color-gold-500: #f59e0b;    /* Highlight Amber */
  --color-gold-100: #fef3c7;    /* Warm Glow Accent */

  /* Backgrounds & Neutrals */
  --color-bg-dark: #070a0f;     /* Deep OLED Black for TV Kiosk */
  --color-bg-card-dark: rgba(15, 23, 42, 0.75); /* Dark Glass Backdrop */
  --color-bg-light: #fdfbf7;    /* Warm Cream Base */
  --color-bg-card-light: #ffffff;

  /* Typography Colors */
  --color-text-bright: #ffffff;
  --color-text-muted: #94a3b8;
  --color-text-dark: #0f172a;

  /* Status Colors */
  --color-success: #10b981;    /* Solat In Progress / Active */
  --color-warning: #f59e0b;    /* Azan Approaching */
  --color-danger: #ef4444;     /* Emergency Alert */
}
```

---

## 3. Typography System

The typography is optimized for bilingual clarity (Arabic & English). Google Fonts **Outfit** or **Inter** are used for Latin script, paired with **Readex Pro** or **Amiri** for Arabic script.

```css
/* Typography Scale */
--font-sans: 'Outfit', 'Inter', -apple-system, sans-serif;
--font-arabic: 'Readex Pro', 'Amiri', serif;

/* TV Display Specific Font Scale */
--font-tv-clock: 6rem;        /* 96px for high visibility */
--font-tv-title: 3.5rem;      /* 56px */
--font-tv-prayer: 2.25rem;    /* 36px */
--font-tv-body: 1.5rem;       /* 24px */

/* Mobile / PWA Font Scale */
--font-mobile-h1: 2rem;       /* 32px */
--font-mobile-h2: 1.5rem;     /* 24px */
--font-mobile-body: 1rem;     /* 16px */
```

---

## 4. Logo Usage Guidelines

- **Primary Logo**: Combined Crescent & Minaret emblem with "BIN FAIZAL'S MOSQUE SERVICES" typography in Dome Gold on Deep Emerald background.
- **TV Display Header Logo**: Compact illuminated badge placed at the top-left or top-center of the screen.
- **Icon / Favicon / PWA Icon**: Monogram "BF" inside a gold-accented geometric star (Rub el Hizb).

---

## 5. Splash Screen & Loading Animation

- **TV Kiosk Splash**: Deep dark emerald screen (`--color-bg-dark`) with a slowly glowing gold crescent and subtle particle shimmer animation while reading local database cache.
- **PWA Splash Screen**: Clean cream/white background with centered logo icon and progress bar.

---

## 6. Iconography System

Custom SVG icons with 2px stroke weight, gold/emerald accents:
- 🌙 Crescent (Fajr / Isha)
- ☀️ Sun High (Dhuhr)
- ⛅ Afternoon Sun (Asr)
- 🌅 Sunset (Maghrib)
- 📖 Qur'an (Daily Verse)
- 🤲 Dua (Daily Supplication)
- 🧭 Compass (Qibla Direction)
- 📢 Loudspeaker (Azan / Announcement)

---

## 7. Glassmorphism Design Language

To create a state-of-the-art, modern display aesthetic, UI components utilize layered glassmorphism:

```css
.glass-card-dark {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 1.25rem;
}

.glass-card-gold-active {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(245, 158, 11, 0.05));
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(245, 158, 11, 0.6);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.3);
}
```

---

## 8. Animation Rules & Micro-Interactions

1. **Clock Tick**: Smooth, non-distracting pulse on colon separator (`:`) every second.
2. **Prayer Active Pulse**: Soft glowing amber border pulse on the currently active prayer card.
3. **Ticker Slide**: Smooth horizontal or vertical marquee transition (CSS `transform: translate3d`) at 30px/sec for news and verses.
4. **Adhan Alert Overlay**: Soft radial zoom-in modal accompanied by gentle Azan audio fade-in.

---

## 9. Layout Specifications

### 9.1 Android TV Layout (1920x1080 / 3840x2160 Landscape)
- **Top Header Bar (15% height)**: Mosque Name, Live Digital Clock, Gregorian & Hijri Date, Weather & Temperature.
- **Main Left / Center Panel (60% width)**: Horizontal or Grid layout of 6 Prayer Cards (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) + Jummah timing card.
- **Main Right Panel (40% width)**: Active Prayer Countdown, Next Prayer highlight card, Media / Slide Carousel.
- **Bottom Ticker Bar (10% height)**: Scrolling Announcements, Hadith of the Day, and Donation QR Code.

### 9.2 Mobile / PWA Layout (Vertical Portrait)
- **Header**: Compact Mosque title, Qibla compass button, Hijri date badge.
- **Hero Card**: Live Next Prayer countdown with progress bar circle.
- **Prayer List**: Vertical expandable list showing Azan and Iqamah times.
- **Bottom Navigation**: Home, Prayer Schedule, Daily Duas, Mosque News, Settings.

### 9.3 Desktop / Admin Layout
- **Left Sidebar Navigation**: Dashboard, Timetables, Announcements, Gallery, TV Devices, System Settings.
- **Top Header**: Search, Notification Bell, Admin Profile & Role indicator.
- **Content Area**: Responsive data tables, CSV uploader, slide builder preview.

---

## 10. Accessibility (A11y) Standards

- **Contrast Ratios**: Minimum 7:1 contrast ratio for all text elements on TV displays for long-distance viewing.
- **Focus Indicators**: High-contrast gold outline (3px) for DPAD-focused items on Android TV.
- **Screen Reader Support**: Full ARIA roles (`role="timer"`, `aria-live="polite"`) for live prayer clocks and announcements.
