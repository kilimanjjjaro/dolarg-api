# DolARG API

An API with the most common dollar exchange rates of Argentina, scraped from
[LA NACIÓN](https://www.lanacion.com.ar/dolar-oficial-historico/). The data is
updated from Monday to Friday at 12:00 and 16:00 (GMT-3).

URL: https://dolarg-api.hola6290.workers.dev

## Response

`GET /` returns the latest quotes and up to 20 previous ones, from newest to
oldest:

```json
{
  "latest": {
    "date": "23-11-2026 12:00:00",
    "results": {
      "dolarOficial": { "compra": "$1548", "venta": "$1642" },
      "dolarBlue": { "compra": "$1624,75", "venta": "$1675" },
      "dolarTarjeta": { "venta": "$2134,60" },
      "dolarMEP": { "venta": "$1701,05" },
      "dolarCCL": { "venta": "$1736,94" },
      "dolarMayorista": { "venta": "$1580" }
    }
  },
  "historical": []
}
```

Dates use the `DD-MM-YYYY HH:mm:ss` format in GMT-3. The API accepts requests
from any origin.

`dolarTurista` was removed because LA NACIÓN no longer publishes it. Every
stored quote was corrected, since `dolarCCL` and `dolarMayorista` used to be
read from the wrong rows.

## How it works

- Scraping with scrape-it: a GitHub Actions workflow reads every rate from the
  LA NACIÓN row with its title, checks the result with the unit tests and
  pushes it to `db/exchangeRates.json`. The new rates become the latest quote
  and the previous ones move to the historical. The workflow fails, and pushes
  nothing, when a rate is missing.
- Continuous deployment with GitHub Actions: a push that changes
  `db/exchangeRates.json` on `main` runs the unit tests and deploys the API to
  Cloudflare Workers.
- Backend with Hono: the API is a Cloudflare Worker that serves the stored
  quotes from the edge.

## Getting Started

Requirements: Node.js 26 (pinned with Volta) and pnpm 11. pnpm runs the
project scripts with the Node.js version declared in `devEngines`.

```bash
pnpm install
pnpm start   # API on http://localhost:8787
pnpm scrape  # Scrape LA NACIÓN and update db/exchangeRates.json
```

## Project structure

- `api`: the Hono app deployed to Cloudflare Workers
- `scraping`: the scrape script run by the scrape workflow
- `utils`: the scraper, the database helpers and the logger
- `constants`, `interfaces`: shared values and types
- `db/exchangeRates.json`: the stored quotes, updated by the scrape workflow
- `tests/unit`: Vitest unit tests, with their constants, helpers and the saved
  LA NACIÓN page in `tests/constants`, `tests/utils` and `tests/fixtures`
- `tests/worker`: Vitest tests that run the bundled Worker on workerd, the
  Cloudflare Workers runtime, through the Wrangler test harness

## Checks

```bash
pnpm format:check  # Prettier (pnpm format fixes the files)
pnpm typecheck     # TypeScript
pnpm lint          # ESLint
pnpm test          # Unit and Worker tests (Vitest)
pnpm build         # Wrangler dry run build
pnpm test:all      # All of the above, in order
```

The same checks and a security audit of the production dependencies run in CI
on every pull request (`.github/workflows/ci.yml`).
