# 📄 Database Design Document
**Relational Data Models, Indexes & Performance Optimizations for BIN FAIZAL'S Mosque Services**

---

## 1. Primary Indexes & Constraints

1. **`prayer_timetables(date)`**: `UNIQUE INDEX idx_prayer_date` for O(1) daily schedule lookups.
2. **`announcements(publish_at, expire_at, is_emergency)`**: Composite index `idx_announcements_active` for real-time TV query filtering.
3. **`audit_logs(user_id, created_at)`**: Index for security audit tracking.

---

## 2. Retention & Archiving Strategy

- **Audit Logs**: Partitioned monthly; logs older than 365 days are archived to S3 storage.
- **Prayer Timetables**: Retained indefinitely for multi-year historical comparison.
