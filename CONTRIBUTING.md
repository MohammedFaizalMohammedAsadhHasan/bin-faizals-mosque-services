# Contributing to BIN FAIZAL'S Mosque Services

Thank you for considering contributing to **BIN FAIZAL'S Mosque Services**! We welcome bug reports, feature requests, documentation enhancements, and pull requests from community developers.

---

## Code of Conduct

Please maintain respect, kindness, and professionalism across all issues, pull requests, and community discussions.

---

## How Can I Contribute?

### 1. Reporting Bugs
Before creating a bug report, please check existing GitHub issues. When creating an issue, include:
- A clear, descriptive title.
- Steps to reproduce the issue.
- Expected vs. actual behavior.
- Environment details (OS, Browser, Android TV version).

### 2. Suggesting Features
Enhancement suggestions are tracked as GitHub issues. Provide:
- Detailed explanation of the feature.
- Use cases (e.g., Mosque Display, Mobile PWA, Admin Panel).
- Screenshots or mockups if applicable.

### 3. Submitting Pull Requests
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-amazing-feature
   ```
2. Ensure your code follows project naming standards and code formatting rules.
3. Add unit tests for any new prayer logic or API endpoints.
4. Run tests and linting:
   ```bash
   npm run lint
   npm run test
   ```
5. Commit your changes using conventional commit messages:
   - `feat: add Qibla direction finder`
   - `fix: resolve Android TV boot receiver delay`
   - `docs: update Volume 5 prayer timetable documentation`
6. Push to your branch and open a Pull Request.

---

## Coding Standards

- **TypeScript**: Always use strict typing. Avoid `any` types.
- **Naming Conventions**:
  - React Components: `PascalCase.tsx`
  - Utility files & helper modules: `camelCase.ts`
  - CSS Modules / Tokens: `kebab-case.css`
  - Database Tables / Models: `snake_case` / `PascalCase`
- **Accessibility**: Ensure high-contrast TV readability and keyboard/DPAD navigation support.

---

Thank you for contributing to modernizing digital mosque services worldwide! 🌙
