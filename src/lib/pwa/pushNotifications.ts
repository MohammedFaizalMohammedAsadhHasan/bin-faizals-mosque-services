/**
 * Web Push Notification Handler & Azan Alert Scheduler
 * BIN FAIZAL'S Mosque Services
 */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  return await Notification.requestPermission();
}

export function triggerLocalAzanNotification(prayerName: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(`🕌 Time for ${prayerName.toUpperCase()} Solat`, {
          body: `The Azan for ${prayerName.toUpperCase()} has begun at BIN FAIZAL'S Mosque.`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: `azan-${prayerName}`,
          data: { url: '/tv' },
        });
      });
    } else {
      new Notification(`🕌 Time for ${prayerName.toUpperCase()} Solat`, {
        body: `The Azan for ${prayerName.toUpperCase()} has begun at BIN FAIZAL'S Mosque.`,
        icon: '/icons/icon-192x192.png',
      });
    }
  }
}
