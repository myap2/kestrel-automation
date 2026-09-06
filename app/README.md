# Kestrel Outfitters

Local application under test. Zero npm dependencies — `node server.js`.

- Static pages in `public/`
- JSON catalog in `data/products.json`
- In-memory sessions, cart, orders, and contact notes
- Stable `data-testid` attributes for the suites

`GET /api/health` is the ready check used by Playwright, Cypress, Selenium, and CI.
