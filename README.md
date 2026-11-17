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
If you don't have NVM installed, install Node.js 26.13.0 manually before running npm install.

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
python3 scripts/check.py 2026-01-01 2026-03-31
```
 
It recomputes the statement from `data/ledger.json` using none of the app's code. The net income it prints should match the page.

To test just the API Response
```bash
curl "http://localhost:3001/income-statement?start=2026-01-01&end=2026-03-31"
```
 