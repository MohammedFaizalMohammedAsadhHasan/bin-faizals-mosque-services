# 📄 Software Design Document (SDD)
**BIN FAIZAL'S Mosque Services - Comprehensive Architecture Design**

---

## 1. Introduction & System Context

The **Software Design Document (SDD)** details the low-level architectural components, class diagrams, module interfaces, and data flow pipelines supporting **BIN FAIZAL'S Mosque Services**.

```
+-------------------------------------------------------------------------+
|                         BIN FAIZAL'S ECOSYSTEM                          |
+-------------------------------------------------------------------------+
|  +---------------------+  +--------------------+  +------------------+  |
|  |  Android TV Screen  |  |  Community Web/PWA |  |   Admin Panel    |  |
|  +---------------------+  +--------------------+  +------------------+  |
|             \                       |                      /            |
|              +----------------------+---------------------+             |
|                                     |                                   |
|                                     v                                   |
|                  +-----------------------------------+                  |
|                  |      Central API Gateway          |                  |
|                  +-----------------------------------+                  |
|                                     |                                   |
|               +---------------------+---------------------+             |
|               |                                           |             |
|               v                                           v             |
|  +-------------------------+                 +-----------------------+  |
|  | Prayer Engine Micro-Lib |                 |   PostgreSQL DB / ORM |  |
|  +-------------------------+                 +-----------------------+  |
+-------------------------------------------------------------------------+
```

---

## 2. Design Patterns Applied

1. **Observer Pattern**: State listeners notify TV components when prayer countdown reaches zero to trigger Adhan visual overlays.
2. **Strategy Pattern**: Interchangeable mathematical prayer calculation algorithms (MWL, Umm Al-Qura, ISNA) selectable at runtime.
3. **Repository Pattern**: Decouples Prisma ORM database transactions from Next.js API controllers.
4. **Adapter Pattern**: Normalizes uploaded monthly timetable CSV structures into standardized JSON models.
