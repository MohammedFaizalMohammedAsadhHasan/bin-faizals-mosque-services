/**
 * Annual Prayer Timetable Dataset for BIN FAIZAL'S Mosque
 * Expanded from mosque official schedule table (365 days)
 */

export interface DailySchedule {
  month: number; // 1-12
  day: number;   // 1-31
  fajr: string;    // HH:mm 24h
  sunrise: string; // HH:mm 24h
  dhuhr: string;   // HH:mm 24h
  asr: string;     // HH:mm 24h
  maghrib: string; // HH:mm 24h
  isha: string;    // HH:mm 24h
}

export const ANNUAL_RAW_RANGES = [
  // January
  { month: 1, startDay: 1, endDay: 3, fajr: '05:03', sunrise: '06:20', dhuhr: '12:15', asr: '15:35', maghrib: '18:05', isha: '19:20' },
  { month: 1, startDay: 4, endDay: 6, fajr: '05:05', sunrise: '06:22', dhuhr: '12:17', asr: '15:37', maghrib: '18:07', isha: '19:22' },
  { month: 1, startDay: 7, endDay: 8, fajr: '05:06', sunrise: '06:23', dhuhr: '12:18', asr: '15:38', maghrib: '18:08', isha: '19:23' },
  { month: 1, startDay: 9, endDay: 10, fajr: '05:07', sunrise: '06:24', dhuhr: '12:19', asr: '15:39', maghrib: '18:09', isha: '19:24' },
  { month: 1, startDay: 11, endDay: 12, fajr: '05:08', sunrise: '06:25', dhuhr: '12:20', asr: '15:40', maghrib: '18:10', isha: '19:25' },
  { month: 1, startDay: 13, endDay: 15, fajr: '05:09', sunrise: '06:26', dhuhr: '12:20', asr: '15:41', maghrib: '18:11', isha: '19:26' },
  { month: 1, startDay: 16, endDay: 17, fajr: '05:10', sunrise: '06:27', dhuhr: '12:22', asr: '15:43', maghrib: '18:13', isha: '19:27' },
  { month: 1, startDay: 18, endDay: 20, fajr: '05:11', sunrise: '06:28', dhuhr: '12:22', asr: '15:43', maghrib: '18:14', isha: '19:28' },
  { month: 1, startDay: 21, endDay: 25, fajr: '05:12', sunrise: '06:29', dhuhr: '12:23', asr: '15:44', maghrib: '18:15', isha: '19:29' },
  { month: 1, startDay: 26, endDay: 29, fajr: '05:12', sunrise: '06:29', dhuhr: '12:24', asr: '15:46', maghrib: '18:17', isha: '19:30' },
  { month: 1, startDay: 30, endDay: 31, fajr: '05:14', sunrise: '06:30', dhuhr: '12:25', asr: '15:46', maghrib: '18:18', isha: '19:31' },

  // February
  { month: 2, startDay: 1, endDay: 6, fajr: '05:12', sunrise: '06:28', dhuhr: '12:26', asr: '15:47', maghrib: '18:19', isha: '19:31' },
  { month: 2, startDay: 7, endDay: 12, fajr: '05:12', sunrise: '06:28', dhuhr: '12:26', asr: '15:47', maghrib: '18:20', isha: '19:32' },
  { month: 2, startDay: 13, endDay: 17, fajr: '05:12', sunrise: '06:28', dhuhr: '12:26', asr: '15:46', maghrib: '18:21', isha: '19:32' },
  { month: 2, startDay: 18, endDay: 24, fajr: '05:12', sunrise: '06:28', dhuhr: '12:26', asr: '15:46', maghrib: '18:21', isha: '19:32' },
  { month: 2, startDay: 25, endDay: 29, fajr: '05:10', sunrise: '06:25', dhuhr: '12:25', asr: '15:44', maghrib: '18:22', isha: '19:32' },

  // March
  { month: 3, startDay: 1, endDay: 4, fajr: '05:09', sunrise: '06:24', dhuhr: '12:24', asr: '15:42', maghrib: '18:22', isha: '19:32' },
  { month: 3, startDay: 5, endDay: 9, fajr: '05:07', sunrise: '06:22', dhuhr: '12:23', asr: '15:41', maghrib: '18:22', isha: '19:32' },
  { month: 3, startDay: 10, endDay: 13, fajr: '05:05', sunrise: '06:20', dhuhr: '12:22', asr: '15:38', maghrib: '18:22', isha: '19:32' },
  { month: 3, startDay: 14, endDay: 18, fajr: '05:04', sunrise: '06:19', dhuhr: '12:21', asr: '15:35', maghrib: '18:22', isha: '19:31' },
  { month: 3, startDay: 19, endDay: 20, fajr: '05:02', sunrise: '06:17', dhuhr: '12:20', asr: '15:33', maghrib: '18:22', isha: '19:31' },
  { month: 3, startDay: 21, endDay: 24, fajr: '05:00', sunrise: '06:15', dhuhr: '12:19', asr: '15:31', maghrib: '18:21', isha: '19:31' },
  { month: 3, startDay: 25, endDay: 27, fajr: '04:58', sunrise: '06:13', dhuhr: '12:18', asr: '15:28', maghrib: '18:21', isha: '19:31' },
  { month: 3, startDay: 28, endDay: 30, fajr: '04:57', sunrise: '06:12', dhuhr: '12:17', asr: '15:25', maghrib: '18:21', isha: '19:30' },
  { month: 3, startDay: 31, endDay: 31, fajr: '04:55', sunrise: '06:10', dhuhr: '12:16', asr: '15:22', maghrib: '18:20', isha: '19:30' },

  // April
  { month: 4, startDay: 1, endDay: 2, fajr: '04:53', sunrise: '06:08', dhuhr: '12:16', asr: '15:22', maghrib: '18:21', isha: '19:31' },
  { month: 4, startDay: 3, endDay: 5, fajr: '04:52', sunrise: '06:07', dhuhr: '12:15', asr: '15:20', maghrib: '18:21', isha: '19:31' },
  { month: 4, startDay: 6, endDay: 11, fajr: '04:50', sunrise: '06:05', dhuhr: '12:14', asr: '15:17', maghrib: '18:20', isha: '19:31' },
  { month: 4, startDay: 12, endDay: 14, fajr: '04:48', sunrise: '06:03', dhuhr: '12:13', asr: '15:18', maghrib: '18:20', isha: '19:31' },
  { month: 4, startDay: 15, endDay: 18, fajr: '04:46', sunrise: '06:01', dhuhr: '12:12', asr: '15:20', maghrib: '18:20', isha: '19:31' },
  { month: 4, startDay: 19, endDay: 24, fajr: '04:44', sunrise: '05:59', dhuhr: '12:11', asr: '15:22', maghrib: '18:20', isha: '19:31' },
  { month: 4, startDay: 25, endDay: 29, fajr: '04:41', sunrise: '05:56', dhuhr: '12:10', asr: '15:24', maghrib: '18:20', isha: '19:31' },
  { month: 4, startDay: 30, endDay: 30, fajr: '04:39', sunrise: '05:54', dhuhr: '12:09', asr: '15:26', maghrib: '18:20', isha: '19:32' },

  // May
  { month: 5, startDay: 1, endDay: 3, fajr: '04:37', sunrise: '05:52', dhuhr: '12:09', asr: '15:27', maghrib: '18:20', isha: '19:32' },
  { month: 5, startDay: 4, endDay: 8, fajr: '04:36', sunrise: '05:51', dhuhr: '12:09', asr: '15:28', maghrib: '18:20', isha: '19:33' },
  { month: 5, startDay: 9, endDay: 14, fajr: '04:34', sunrise: '05:49', dhuhr: '12:08', asr: '15:29', maghrib: '18:21', isha: '19:34' },
  { month: 5, startDay: 15, endDay: 19, fajr: '04:33', sunrise: '05:48', dhuhr: '12:08', asr: '15:31', maghrib: '18:21', isha: '19:35' },
  { month: 5, startDay: 20, endDay: 25, fajr: '04:32', sunrise: '05:47', dhuhr: '12:08', asr: '15:33', maghrib: '18:22', isha: '19:37' },
  { month: 5, startDay: 26, endDay: 28, fajr: '04:31', sunrise: '05:46', dhuhr: '12:09', asr: '15:35', maghrib: '18:23', isha: '19:39' },
  { month: 5, startDay: 29, endDay: 31, fajr: '04:31', sunrise: '05:46', dhuhr: '12:09', asr: '15:37', maghrib: '18:25', isha: '19:41' },

  // June
  { month: 6, startDay: 1, endDay: 6, fajr: '04:30', sunrise: '05:45', dhuhr: '12:10', asr: '15:39', maghrib: '18:27', isha: '19:43' },
  { month: 6, startDay: 7, endDay: 10, fajr: '04:29', sunrise: '05:44', dhuhr: '12:11', asr: '15:41', maghrib: '18:28', isha: '19:45' },
  { month: 6, startDay: 11, endDay: 14, fajr: '04:29', sunrise: '05:44', dhuhr: '12:11', asr: '15:42', maghrib: '18:29', isha: '19:46' },
  { month: 6, startDay: 15, endDay: 17, fajr: '04:30', sunrise: '05:45', dhuhr: '12:12', asr: '15:42', maghrib: '18:30', isha: '19:47' },
  { month: 6, startDay: 18, endDay: 20, fajr: '04:30', sunrise: '05:45', dhuhr: '12:13', asr: '15:43', maghrib: '18:31', isha: '19:47' },
  { month: 6, startDay: 21, endDay: 25, fajr: '04:31', sunrise: '05:46', dhuhr: '12:14', asr: '15:44', maghrib: '18:32', isha: '19:48' },
  { month: 6, startDay: 26, endDay: 30, fajr: '04:32', sunrise: '05:47', dhuhr: '12:15', asr: '15:45', maghrib: '18:33', isha: '19:50' },

  // July
  { month: 7, startDay: 1, endDay: 6, fajr: '04:33', sunrise: '05:48', dhuhr: '12:16', asr: '15:45', maghrib: '18:33', isha: '19:49' },
  { month: 7, startDay: 7, endDay: 10, fajr: '04:35', sunrise: '05:50', dhuhr: '12:17', asr: '15:46', maghrib: '18:34', isha: '19:50' },
  { month: 7, startDay: 11, endDay: 18, fajr: '04:37', sunrise: '05:52', dhuhr: '12:17', asr: '15:46', maghrib: '18:34', isha: '19:50' },
  { month: 7, startDay: 19, endDay: 23, fajr: '04:39', sunrise: '05:54', dhuhr: '12:18', asr: '15:45', maghrib: '18:34', isha: '19:49' },
  { month: 7, startDay: 24, endDay: 29, fajr: '04:40', sunrise: '05:55', dhuhr: '12:18', asr: '15:44', maghrib: '18:33', isha: '19:48' },
  { month: 7, startDay: 30, endDay: 31, fajr: '04:41', sunrise: '05:56', dhuhr: '12:18', asr: '15:42', maghrib: '18:33', isha: '19:46' },

  // August
  { month: 8, startDay: 1, endDay: 4, fajr: '04:43', sunrise: '05:58', dhuhr: '12:18', asr: '15:40', maghrib: '18:32', isha: '19:45' },
  { month: 8, startDay: 5, endDay: 9, fajr: '04:42', sunrise: '05:57', dhuhr: '12:18', asr: '15:39', maghrib: '18:30', isha: '19:44' },
  { month: 8, startDay: 10, endDay: 14, fajr: '04:44', sunrise: '05:59', dhuhr: '12:17', asr: '15:36', maghrib: '18:28', isha: '19:41' },
  { month: 8, startDay: 15, endDay: 19, fajr: '04:45', sunrise: '06:00', dhuhr: '12:16', asr: '15:32', maghrib: '18:27', isha: '19:39' },
  { month: 8, startDay: 20, endDay: 23, fajr: '04:45', sunrise: '06:00', dhuhr: '12:15', asr: '15:29', maghrib: '18:25', isha: '19:37' },
  { month: 8, startDay: 24, endDay: 26, fajr: '04:45', sunrise: '06:00', dhuhr: '12:14', asr: '15:26', maghrib: '18:23', isha: '19:35' },
  { month: 8, startDay: 27, endDay: 29, fajr: '04:46', sunrise: '06:01', dhuhr: '12:13', asr: '15:23', maghrib: '18:22', isha: '19:33' },
  { month: 8, startDay: 30, endDay: 31, fajr: '04:46', sunrise: '06:01', dhuhr: '12:13', asr: '15:20', maghrib: '18:20', isha: '19:31' },

  // September
  { month: 9, startDay: 1, endDay: 1, fajr: '04:49', sunrise: '06:04', dhuhr: '12:12', asr: '15:17', maghrib: '18:19', isha: '19:30' },
  { month: 9, startDay: 2, endDay: 4, fajr: '04:49', sunrise: '06:04', dhuhr: '12:12', asr: '15:17', maghrib: '18:19', isha: '19:29' },
  { month: 9, startDay: 5, endDay: 8, fajr: '04:49', sunrise: '06:04', dhuhr: '12:11', asr: '15:14', maghrib: '18:17', isha: '19:28' },
  { month: 9, startDay: 9, endDay: 11, fajr: '04:48', sunrise: '06:03', dhuhr: '12:09', asr: '15:14', maghrib: '18:15', isha: '19:26' },
  { month: 9, startDay: 12, endDay: 14, fajr: '04:48', sunrise: '06:03', dhuhr: '12:08', asr: '15:15', maghrib: '18:14', isha: '19:24' },
  { month: 9, startDay: 15, endDay: 17, fajr: '04:47', sunrise: '06:02', dhuhr: '12:07', asr: '15:15', maghrib: '18:12', isha: '19:22' },
  { month: 9, startDay: 18, endDay: 22, fajr: '04:47', sunrise: '06:02', dhuhr: '12:06', asr: '15:16', maghrib: '18:10', isha: '19:20' },
  { month: 9, startDay: 23, endDay: 26, fajr: '04:46', sunrise: '06:01', dhuhr: '12:04', asr: '15:17', maghrib: '18:08', isha: '19:18' },
  { month: 9, startDay: 27, endDay: 30, fajr: '04:46', sunrise: '06:01', dhuhr: '12:03', asr: '15:17', maghrib: '18:06', isha: '19:15' },

  // October
  { month: 10, startDay: 1, endDay: 2, fajr: '04:44', sunrise: '05:59', dhuhr: '12:02', asr: '15:16', maghrib: '18:03', isha: '19:12' },
  { month: 10, startDay: 3, endDay: 6, fajr: '04:43', sunrise: '05:58', dhuhr: '12:01', asr: '15:16', maghrib: '18:01', isha: '19:11' },
  { month: 10, startDay: 7, endDay: 8, fajr: '04:42', sunrise: '05:57', dhuhr: '12:00', asr: '15:16', maghrib: '17:59', isha: '19:09' },
  { month: 10, startDay: 9, endDay: 13, fajr: '04:42', sunrise: '05:57', dhuhr: '11:59', asr: '15:16', maghrib: '17:58', isha: '19:08' },
  { month: 10, startDay: 14, endDay: 16, fajr: '04:41', sunrise: '05:56', dhuhr: '11:58', asr: '15:16', maghrib: '17:56', isha: '19:06' },
  { month: 10, startDay: 17, endDay: 22, fajr: '04:41', sunrise: '05:56', dhuhr: '11:57', asr: '15:16', maghrib: '17:55', isha: '19:05' },
  { month: 10, startDay: 23, endDay: 31, fajr: '04:41', sunrise: '05:56', dhuhr: '11:56', asr: '15:17', maghrib: '17:53', isha: '19:04' },

  // November
  { month: 11, startDay: 1, endDay: 7, fajr: '04:43', sunrise: '05:58', dhuhr: '11:56', asr: '15:16', maghrib: '17:50', isha: '19:02' },
  { month: 11, startDay: 8, endDay: 15, fajr: '04:43', sunrise: '05:58', dhuhr: '11:56', asr: '15:17', maghrib: '17:49', isha: '19:01' },
  { month: 11, startDay: 16, endDay: 21, fajr: '04:44', sunrise: '05:59', dhuhr: '11:57', asr: '15:18', maghrib: '17:49', isha: '19:02' },
  { month: 11, startDay: 22, endDay: 24, fajr: '04:45', sunrise: '06:00', dhuhr: '11:58', asr: '15:19', maghrib: '17:50', isha: '19:03' },
  { month: 11, startDay: 25, endDay: 27, fajr: '04:47', sunrise: '06:02', dhuhr: '11:59', asr: '15:20', maghrib: '17:50', isha: '19:04' },
  { month: 11, startDay: 28, endDay: 30, fajr: '04:47', sunrise: '06:02', dhuhr: '12:00', asr: '15:21', maghrib: '17:51', isha: '19:05' },

  // December
  { month: 12, startDay: 1, endDay: 3, fajr: '04:49', sunrise: '06:04', dhuhr: '12:01', asr: '15:22', maghrib: '17:52', isha: '19:06' },
  { month: 12, startDay: 4, endDay: 6, fajr: '04:50', sunrise: '06:05', dhuhr: '12:02', asr: '15:23', maghrib: '17:53', isha: '19:07' },
  { month: 12, startDay: 7, endDay: 9, fajr: '04:51', sunrise: '06:06', dhuhr: '12:04', asr: '15:24', maghrib: '17:54', isha: '19:08' },
  { month: 12, startDay: 10, endDay: 11, fajr: '04:52', sunrise: '06:07', dhuhr: '12:05', asr: '15:25', maghrib: '17:55', isha: '19:10' },
  { month: 12, startDay: 12, endDay: 14, fajr: '04:53', sunrise: '06:08', dhuhr: '12:06', asr: '15:27', maghrib: '17:56', isha: '19:11' },
  { month: 12, startDay: 15, endDay: 16, fajr: '04:55', sunrise: '06:10', dhuhr: '12:07', asr: '15:28', maghrib: '17:57', isha: '19:13' },
  { month: 12, startDay: 17, endDay: 18, fajr: '04:56', sunrise: '06:11', dhuhr: '12:08', asr: '15:29', maghrib: '17:58', isha: '19:13' },
  { month: 12, startDay: 19, endDay: 20, fajr: '04:56', sunrise: '06:11', dhuhr: '12:09', asr: '15:29', maghrib: '17:59', isha: '19:14' },
  { month: 12, startDay: 21, endDay: 21, fajr: '04:58', sunrise: '06:13', dhuhr: '12:10', asr: '15:31', maghrib: '18:00', isha: '19:15' },
  { month: 12, startDay: 22, endDay: 25, fajr: '04:58', sunrise: '06:13', dhuhr: '12:11', asr: '15:31', maghrib: '18:01', isha: '19:16' },
  { month: 12, startDay: 26, endDay: 27, fajr: '04:59', sunrise: '06:14', dhuhr: '12:13', asr: '15:32', maghrib: '18:02', isha: '19:17' },
  { month: 12, startDay: 28, endDay: 29, fajr: '05:01', sunrise: '06:16', dhuhr: '12:14', asr: '15:34', maghrib: '18:03', isha: '19:18' },
  { month: 12, startDay: 30, endDay: 31, fajr: '05:02', sunrise: '06:17', dhuhr: '12:15', asr: '15:35', maghrib: '18:04', isha: '19:19' },
];

/**
 * Gets exact prayer times for any specific Date object
 */
export function getScheduleForDate(date: Date = new Date()): { fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string } {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();      // 1-31

  const match = ANNUAL_RAW_RANGES.find(
    (item) => item.month === m && d >= item.startDay && d <= item.endDay
  );

  if (match) {
    return {
      fajr: match.fajr,
      sunrise: match.sunrise,
      dhuhr: match.dhuhr,
      asr: match.asr,
      maghrib: match.maghrib,
      isha: match.isha,
    };
  }

  // Fallback defaults
  return {
    fajr: '04:30',
    sunrise: '05:48',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:50',
    isha: '20:10',
  };
}
