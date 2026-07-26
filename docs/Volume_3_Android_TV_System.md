# 📺 Volume 3 – Android TV System
**Smart TV Display Architecture, Kiosk Automation & Hardware Integration for BIN FAIZAL'S Mosque Services**

---

## 1. Android TV System Architecture

The **Android TV System** functions as an automated digital kiosk signboard designed to run 24/7/365 without manual intervention. It combines a lightweight native Android wrapper with a high-performance HTML5/React full-screen web renderer.

```
+-------------------------------------------------------------------+
|                     Android TV Device OS                          |
+-------------------------------------------------------------------+
|  +-----------------------+   +---------------------------------+  |
|  | BootReceiver (Native) |   | Device Admin / Kiosk Locks      |  |
|  +-----------------------+   +---------------------------------+  |
|              |                                 |                  |
|              v                                 v                  |
|  +-------------------------------------------------------------+  |
|  |             Android WebView Kiosk Host App                  |  |
|  |  (Full-Screen Immersive, Hardware Acceleration Enabled)     |  |
|  +-------------------------------------------------------------+  |
|                                |                                  |
|                                v                                  |
|  +-------------------------------------------------------------+  |
|  |         Next.js HTML5 TV Kiosk Engine (Local React UI)       |  |
|  |  +-------------------+ +------------------+ +-------------+ |  |
|  |  | Digital Clock Sync| | Prayer Countdown | | Adhan Alerts| |  |
|  |  +-------------------+ +------------------+ +-------------+ |  |
|  |  +--------------------------------------------------------+ |  |
|  |  | Offline IndexedDB Cache & Fallback Calculation Engine   | |  |
|  |  +--------------------------------------------------------+ |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 2. Auto-Boot Receiver Specification

To guarantee that the display turns on automatically when the TV box powers on after a power outage or restart, the Android wrapper implements a `BroadcastReceiver` listening for system boot events.

```xml
<!-- AndroidManifest.xml Configuration -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.binfaizal.mosque.tv">

    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:label="BIN FAIZAL'S Mosque TV"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <receiver
            android:name=".BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </receiver>

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

```java
// Java / Kotlin BootReceiver Implementation
package com.binfaizal.mosque.tv;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Intent i = new Intent(context, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(i);
        }
    }
}
```

---

## 3. Dedicated Kiosk Mode & Full Screen

1. **Sticky Immersive Mode**: System navigation bars (Home, Back, Recent Apps) and status notification bars are completely hidden.
2. **Screen Wake Lock**: Prevents TV OS from entering sleep, screen saver, or power-saving mode.
3. **App Pinning / Lock Task Mode**: Restricts users or unauthorized visitors from exiting the application without an admin PIN.

---

## 4. DPAD Navigation & Remote Control Integration

Smart TV users interact via basic infrared or Bluetooth remote controls. The TV UI includes full keyboard and DPAD arrow key navigation support.

- **DPAD Up / Down / Left / Right**: Moves focus between prayer cards, announcement slides, and settings drawer.
- **DPAD Center / Select (Enter)**: Opens detail modal or toggles full-screen video preview.
- **Back Key**: Dismisses open modals or returns to default Kiosk view.
- **Key Event Listener**:

```typescript
// React DPAD Handler for TV View
import { useEffect } from 'react';

export function useTVRemoteNavigation(onAdminTrigger: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          // Focus element above
          break;
        case 'ArrowDown':
          // Focus element below
          break;
        case 'Enter':
        case 'Select':
          // Activate element
          break;
        case '0':
          // Secret key code sequence for Admin menu on TV remote
          onAdminTrigger();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdminTrigger]);
}
```

---

## 5. Crash Recovery & Health Monitoring

1. **Uncaught Exception Handler**: Native Android layer catches WebView render crashes and reloads the main activity automatically within 3 seconds.
2. **Watchdog Service**: A background timer verifies that the JavaScript clock engine updates every second. If frozen for more than 15 seconds, the page forces a `location.reload()`.
3. **Telemetry Ping**: Periodically sends heartbeat pings to the admin panel with memory usage, uptime, and offline status.

---

## 6. Offline Mode & Local Fallback Engine

- **Service Worker & Local Storage**: Stores 12 months of prayer timetable data locally in IndexedDB.
- **Fallback Calculation**: If server connection and cached timetable are unavailable, the embedded JavaScript prayer algorithm (MWL/Umm Al-Qura) automatically computes exact daily prayer times using latitude/longitude parameters.

---

## 7. Performance & Memory Management Rules

- **Zero Memory Leaks**: All intervals, event listeners, and WebGL/Canvas animations are destroyed and recreated cleanly on state changes.
- **DOM Recycling**: Carousel slides and announcement tickers recycle DOM nodes to maintain low memory consumption (< 150MB RAM footprint).
- **GPU Acceleration**: Animations leverage `transform: translate3d()` and `will-change: transform` for smooth 60 FPS rendering on low-cost TV sticks (Fire TV, Chromecast with Google TV, Android TV boxes).
