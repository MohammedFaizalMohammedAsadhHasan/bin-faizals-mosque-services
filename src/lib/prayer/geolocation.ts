/**
 * Geolocation Auto-Detection Utility
 * BIN FAIZAL'S Mosque Services
 */

import { LocationCoords } from './astronomicalEngine';

export const DEFAULT_MOSQUE_COORDS: LocationCoords = {
  latitude: 6.9271,
  longitude: 79.8612,
};

export async function detectAutoLocation(): Promise<{ coords: LocationCoords; isAuto: boolean }> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return { coords: DEFAULT_MOSQUE_COORDS, isAuto: false };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isAuto: true,
        });
      },
      () => {
        // Permission denied or timeout - Fall back gracefully
        resolve({ coords: DEFAULT_MOSQUE_COORDS, isAuto: false });
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  });
}
