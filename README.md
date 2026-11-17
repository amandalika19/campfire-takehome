# Campfire Takehome Project

## Versions used
 
| Tool | Version |
| --- | --- |
| Node | 26.13.0 (22 or newer is required) |
| TypeScript | 7.0.2 |
| Express | 5.3.0 |
| React / React DOM | 19.3.1 |
| Vite | 8.3.6 |
| Vitest | 5.1.0 |
| tsx | 4.23.15 |
 
## Setup

This project uses Node.js `26.13.0`. The required version is specified in `.nvmrc` and `package.json`.

If you use [NVM](https://github.com/nvm-sh/nvm), run:

```bash
# Install and switch to the project's Node version
nvm install
nvm use

# Verify the Node version
node -v  # should print v26.13.0

# Install dependencies
npm install
```
If you don't have NVM installed, install Node.js 26.13.0 manually before running npm install and update the package.json commmands

## Backend
 
```bash
npm run dev:api  # http://localhost:3001
```
 
## Frontend
 
```bash
npm run dev:ui # http://localhost:5173
```
 
## Run the tests
 
```bash
npm test             # all tests
```
 
Independent check (needs Python 3 - no packages):
 
```bash
npm run test-python -- --start 2026-01-01 --end 2026-01-31

npm run test-python -- --data-file ledgerWithInvalidData.json

npm run test-python -- --data-file ledger.json --start 2026-01-01 --end 2026-01-31
```
 
It recomputes the statement from `data/ledger.json`. 

The net income it prints should match the page.

To test just the API Response
```bash
curl "http://localhost:3001/income-statement?start=2026-01-01&end=2026-03-31"
```
 

## API
 
`GET /income-statement?start=YYYY-MM-DD&end=YYYY-MM-DD`
 
```json
{
  "company": "Northwind Coffee Roasters",
  "currency": "USD",
  "period": { "start": "2026-01-01", "end": "2026-03-31" },
  "sections": {
    "revenue": {
      "title": "Revenue",
      "accounts": [
        { "number": "4000", "name": "Product Revenue", "amount": "35650.75" },
        { "number": "4100", "name": "Subscription Revenue", "amount": "3000.00" },
        { "number": "4900", "name": "Sales Returns & Discounts", "amount": "-800.25" }
      ],
      "subtotal": "37850.50"
    },
    "costOfGoodsSold": { "title": "Cost of goods sold", "accounts": [], "subtotal": "14272.75" },
    "grossProfit": "23577.75",
    "operatingExpenses": { "title": "Operating expenses", "accounts": [], "subtotal": "68100.07" },
    "operatingIncome": "-44522.32",
    "otherIncome": { "title": "Other income", "accounts": [], "subtotal": "42.18" },
    "netIncome": "-44480.14"
  }
}
```
 
## Project layout
 
```
data/ledger.json - source ledger data.
app/api/src/ledger.ts - loads and validates the ledger.
app/api/src/statement.ts - builds the income statement.
app/api/src/index.ts - Express API.
app/ui/src/format.ts - formats money for display.
tests/ - automated tests.
test/scriptLedgerTest.py - independent Python calculation check.
```

## Project layout

- `app/api/src/` contains the Express API and the income statement logic.
  - `index.ts` sets up the API route, validates request dates, and starts the server.
  - `ledger.ts` loads the ledger JSON and validates the journal entries.
  - `statement.ts` calculates the income statement from the ledger.
- `app/shared/src/types.ts` contains the shared TypeScript types used by the API and UI.
- `app/ui/src/` contains the React frontend.
  - `components/DateRange.tsx` handles the date inputs.
  - `components/IncomeStatement.tsx` displays the income statement.
  - `components/StatementSection.tsx` displays each section of the statement.
  - `api.ts` makes requests to the backend.
  - `format.ts` formats monetary amounts for display.
  - `App.tsx` contains the main application component.
  - `main.tsx` is the frontend entry point.
  - `styles.css` contains the application styles.
- `data/ledger.json` contains the source ledger data.
- `data/ledgerWithInvalidData.json` contains intentionally invalid ledger data for validation testing.
- `tests/` contains the automated tests for the API, formatting, and income statement calculations.
- `tests/scriptLedgerTest.py` is a separate Python script I used to calculate and verify the income statement.
- `CALCULATIONS.md` documents how I calculated the expected numbers.
 
## Troubleshooting
 
- The page shows an error or stays blank: the API is not running. Start `npm run dev:api` first.
- `Map.groupBy is not a function` when running tests: your Node is too old. Upgrade to 22 or newer.
- Port in use: `lsof -i :3001`, then stop that process.
 
