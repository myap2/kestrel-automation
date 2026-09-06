# Shared journeys

Every suite covers the same storefront so the frameworks can be compared on equal terms.

## Accounts

| Role | Email | Password | Expected |
|---|---|---|---|
| Standard | `standard@kestrel.test` | `Trailhead!23` | Lands on account |
| Locked | `locked@kestrel.test` | `Trailhead!23` | Flash: account locked |
| Unknown | `nobody@kestrel.test` | `wrong` | Flash: incorrect credentials |

## UI journeys

1. **Login** — valid, invalid, locked.
2. **Catalog** — search `tent` returns Ridgeline; category Apparel narrows the grid.
3. **Cart and checkout** — add a product, open cart, sign in, place an order, see an order id.
4. **Contact** — submit the desk form and see a reference number.

## Network mocks (Playwright + Cypress)

| Stub | Assertion |
|---|---|
| `GET /api/products` → empty list | `[data-testid=empty-catalog]` |
| `GET /api/products` → 500 | `[data-testid=catalog-error]` |
| `GET /api/products` → fixture `Ghost Quilt` | Card title is the mocked name, not a live catalog item |

Selenium talks to the live local API. C# still uses Page Objects and explicit waits; it does not stub the browser.
