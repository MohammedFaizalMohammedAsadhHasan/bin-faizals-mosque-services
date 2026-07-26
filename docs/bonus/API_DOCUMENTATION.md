# 📄 API Documentation
**Complete Endpoint Reference & OpenAPI Specifications for BIN FAIZAL'S Mosque Services**

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
- **Request Body**:
```json
{
  "email": "admin@binfaizal.org",
  "password": "SecureAdminPassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "usr_99812",
      "email": "admin@binfaizal.org",
      "fullName": "Imam Faizal",
      "role": "SUPER_ADMIN"
    }
  }
}
```
- **Cookies**: Sets `token` HTTP-Only Secure cookie.

---

## 2. Prayer & Timetable Endpoints

### `GET /api/v1/timetable/monthly?year=2026&month=7`
- **Query Parameters**: `year`, `month`.
- **Response**: Array of daily schedules.

### `POST /api/v1/timetable/upload` (Admin Only)
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (CSV / Excel file).

---

## 3. Announcement & Media Endpoints

### `GET /api/v1/announcements?screen=TV_ONLY`
- Returns active non-expired announcement slides for TV kiosk screens.

### `POST /api/v1/announcements` (Admin Only)
- Creates a new announcement.
