# 🕌 Volume 5 – Prayer Management System
**Prayer Time Calculation Algorithms, Timetable Management & Islamic Calendar Engine for BIN FAIZAL'S Mosque Services**

---

## 1. System Overview

The **Prayer Management System** serves as the mathematical and temporal core of BIN FAIZAL'S Mosque Services. It delivers accurate daily prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha), Iqamah countdown delays, Hijri calendar synchronizations, and seasonal Islamic event overlays (Ramadan, Suhoor, Iftar, Eid).

---

## 2. Timetable Sources & Hybrid Resolution Strategy

The system operates on a 3-tier hybrid resolution order:

```
+-------------------------------------------------------------------+
|               1. Primary: Mosque Custom Timetable CSV             |
|   (Admin-uploaded monthly CSV overrides with exact Iqamah delays)  |
+-------------------------------------------------------------------+
                                  |
                                  v (If date missing in CSV)
+-------------------------------------------------------------------+
|            2. Secondary: Astronomical API / DB Schedule           |
|            (Pre-calculated database entry for region)             |
+-------------------------------------------------------------------+
                                  |
                                  v (If network / database offline)
+-------------------------------------------------------------------+
|          3. Tertiary: Local Mathematical Calculation Engine       |
|    (Embedded Adhan algorithm based on Lat, Long & Convention)     |
+-------------------------------------------------------------------+
```

---

## 3. Mathematical Prayer Calculation Formulas

Calculations rely on Solar Position Algorithms (declination $\delta$, equation of time $EoT$, solar zenith angle $Z$).

### 3.1 Solar Zenith Angle Equations

1. **Fajr**: $Z_{Fajr} = 90^\circ + \alpha_1$ (where $\alpha_1$ is Fajr twilight angle, e.g., $18^\circ$ for MWL).
2. **Sunrise**: $Z_{Sunrise} = 90^\circ + 50'$ (refraction correction).
3. **Dhuhr**: Solar Transit (Midday time when sun crosses meridian):
   $$\text{Dhuhr} = 12 + \text{TimeZone} - \frac{\text{Longitude}}{15} - \frac{EoT}{60}$$
4. **Asr**:
   - **Shafi'i / Hanbali / Maliki**: Shadow length = Object length + Min shadow at noon.
     $$Z_{Asr} = \text{arccot}(1 + \tan|\text{Latitude} - \delta|)$$
   - **Hanafi**: Shadow length = 2 * Object length + Min shadow at noon.
     $$Z_{Asr} = \text{arccot}(2 + \tan|\text{Latitude} - \delta|)$$
5. **Maghrib**: Sunset time ($Z_{Maghrib} = 90^\circ + 50'$).
6. **Isha**: $Z_{Isha} = 90^\circ + \alpha_2$ (where $\alpha_2$ is Isha angle, e.g., $17^\circ$ or $18^\circ$, or fixed 90-minute delay after Maghrib for Umm Al-Qura).

---

## 4. Supported Calculation Conventions

1. **Muslim World League (MWL)**: Fajr $18^\circ$, Isha $17^\circ$.
2. **Islamic Society of North America (ISNA)**: Fajr $15^\circ$, Isha $15^\circ$.
3. **Egyptian General Authority of Survey**: Fajr $19.5^\circ$, Isha $17.5^\circ$.
4. **Umm Al-Qura University, Makkah**: Fajr $18.5^\circ$, Isha 90 min after Maghrib (120 min during Ramadan).
5. **University of Islamic Sciences, Karachi**: Fajr $18^\circ$, Isha $18^\circ$.
6. **Moonsighting Committee Worldwide**: Dynamic astronomical calculations.

---

## 5. Monthly Timetable CSV Import Specification

Admins can upload monthly timetables formatted as follows:

```csv
Date,Fajr_Azan,Fajr_Iqamah,Sunrise,Dhuhr_Azan,Dhuhr_Iqamah,Asr_Azan,Asr_Iqamah,Maghrib_Azan,Maghrib_Iqamah,Isha_Azan,Isha_Iqamah,Jummah_Khutbah
2026-07-01,04:15,04:30,05:45,12:30,12:45,15:45,16:00,18:50,18:55,20:10,20:25,12:45
2026-07-02,04:16,04:30,05:46,12:30,12:45,15:45,16:00,18:50,18:55,20:10,20:25,12:45
```

---

## 6. Hijri Calendar & Lunar Adjustments

- Calculates Tabular Islamic Calendar dates based on Umm Al-Qura astronomical algorithms.
- **Manual Offset Adjustment**: Admin panel provides a $+2 / -2$ day slider to align with local physical moon sighting announcements by religious authorities.

---

## 7. Current / Next Prayer State Machine

```typescript
export interface PrayerState {
  currentPrayer: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  nextPrayer: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  timeRemainingSeconds: number;
  isAzanActive: boolean;
  isIqamahActive: boolean;
  isJamaatMode: boolean; // Solat in progress screen dimmer
}
```

---

## 8. Special Ramadan & Eid Modes

1. **Ramadan Mode**:
   - Displays **Suhoor / Imsak** end time card (10 mins before Fajr).
   - Displays **Iftar** countdown with special audio supplication prompt.
   - Highlights **Taraweeh** Solat schedule and Night of Power (Laylat al-Qadr) reminders.
2. **Eid Mode**:
   - Displays Eid al-Fitr / Eid al-Adha Takbeer audio visual loop.
   - Prompts worshippers with Eid Solat venue and exact morning prayer time.

---

## 9. Educational Content Feed System

The system rotates curated content:
- **Daily Qur'an Verse**: Arabic text + English/Malay translation + Surah reference.
- **Daily Hadith**: Sahih Al-Bukhari / Sahih Muslim narration with authenticity reference.
- **Daily Supplication (Dua)**: Morning, Evening, and Post-Solat prayers.
