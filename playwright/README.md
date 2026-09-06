# Playwright

TypeScript + Playwright Test. Page objects in `pages/`, network stubs in `tests/mocked-catalog.spec.ts`.

The config starts `app/server.js` unless something is already bound to port 3000.

```bash
npm ci
npx playwright install chromium
npx playwright test
```
