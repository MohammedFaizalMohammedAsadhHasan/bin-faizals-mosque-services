/**
 * IndexedDB Offline Cache Manager for BIN FAIZAL'S Mosque Services
 * Handles offline persistence of 12-month annual prayer timetables, announcements, and settings.
 */

const DB_NAME = 'BinFaizalMosqueDB';
const DB_VERSION = 1;

export interface OfflineTimetableEntry {
  date: string; // YYYY-MM-DD
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  iqamahFajr?: string;
  iqamahDhuhr?: string;
  iqamahAsr?: string;
  iqamahMaghrib?: string;
  iqamahIsha?: string;
}

export interface MosqueConfig {
  key: string;
  value: unknown;
  updatedAt: string;
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('timetable')) {
        db.createObjectStore('timetable', { keyPath: 'date' });
      }

      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveTimetable(entries: OfflineTimetableEntry[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('timetable', 'readwrite');
  const store = tx.objectStore('timetable');

  for (const entry of entries) {
    store.put(entry);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getTimetableForDate(date: string): Promise<OfflineTimetableEntry | null> {
  const db = await openDatabase();
  const tx = db.transaction('timetable', 'readonly');
  const store = tx.objectStore('timetable');
  const request = store.get(date);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCachedTimetables(): Promise<OfflineTimetableEntry[]> {
  const db = await openDatabase();
  const tx = db.transaction('timetable', 'readonly');
  const store = tx.objectStore('timetable');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function setMosqueConfig(key: string, value: unknown): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('config', 'readwrite');
  const store = tx.objectStore('config');

  store.put({ key, value, updatedAt: new Date().toISOString() });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMosqueConfig<T>(key: string): Promise<T | null> {
  const db = await openDatabase();
  const tx = db.transaction('config', 'readonly');
  const store = tx.objectStore('config');
  const request = store.get(key);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ? (request.result.value as T) : null);
    request.onerror = () => reject(request.error);
  });
}
