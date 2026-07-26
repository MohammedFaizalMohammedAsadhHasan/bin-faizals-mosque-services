# 📄 Testing & Quality Assurance Guide
**Test Suite Architecture & Verification Protocols for BIN FAIZAL'S Mosque Services**

---

## 1. Test Suite Categories

1. **Unit Testing (Jest / Vitest)**: Validates prayer mathematical calculation formulas, Hijri date converters, and CSV parsers.
2. **Integration Testing (Playwright / Cypress)**: Verifies Admin Panel login, CSV uploads, and TV screen rendering.
3. **Hardware Kiosk Testing**: Automated DPAD keypress simulation and reboot recovery checks on physical Android TV devices.

---

## 2. Automated Test Commands

```bash
# Run unit tests
npm run test

# Run prayer calculation algorithm tests
npm run test:prayer

# Run end-to-end integration tests
npm run test:e2e
```
