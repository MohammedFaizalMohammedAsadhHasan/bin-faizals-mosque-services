# 📺 Android TV Native Kiosk App - Build & Deployment Guide

This directory contains the native Android TV WebView Kiosk wrapper for **BIN FAIZAL'S Mosque Services**. It enables 24/7 automated kiosk operation, hardware acceleration, sticky immersive full-screen display, and automatic startup upon device boot.

---

## 🛠️ Prerequisites

- **Android Studio Jellyfish / Hedgehog (or higher)** or **Android SDK Command-Line Tools**
- **JDK 17 or JDK 21**
- Android TV Box, Fire TV Stick, Chromecast with Google TV, or Android TV Emulator (API Level 21+)

---

## 📦 Building the APK

### 1. Debug APK Build

To compile a debug APK for testing on local Android TV devices:

```bash
cd android
./gradlew assembleDebug
```

The compiled APK will be located at:  
`android/app/build/outputs/apk/debug/app-debug.apk`

---

### 2. Signed Production Release APK Build

To compile a signed production-ready APK:

1. Generate a keystore (if not already created):

```bash
keytool -genkey -v -keystore release.keystore -alias binfaizal-tv -keyalg RSA -keysize 2048 -validity 10000
```

2. Place `release.keystore` inside `android/app/` and configure signing in `android/app/build.gradle`:

```groovy
android {
    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "YOUR_KEYSTORE_PASSWORD"
            keyAlias "binfaizal-tv"
            keyPassword "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. Run the release build command:

```bash
./gradlew assembleRelease
```

The signed release APK will be located at:  
`android/app/build/outputs/apk/release/app-release.apk`

---

## 📲 Installing on Android TV via ADB

Connect your Android TV device over local Wi-Fi or USB debugging:

```bash
# Connect to Android TV IP
adb connect 192.168.1.100:5555

# Install the compiled APK
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔒 Enabling Kiosk Mode & Auto-Boot

1. **Auto-Boot Permission**: Upon first launch, grant `RECEIVE_BOOT_COMPLETED` permission if prompted by TV OS settings.
2. **App Pinning / Lock Task Mode**: In Android TV Settings -> Security & Restrictions -> Enable App Pinning to lock the device into BIN FAIZAL'S Mosque Kiosk App.
