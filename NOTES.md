# Notes

## How I calculated the numbers

Refer to CALCULATIONS.md

# Decisions and assumptions

- I treated the ledger as one "source of truth" JSON file with all amounts in USD and loaded the file once initially.
- The income statement only reads `posted` entries and ignores `draft` and `void`.
- The start and end dates are both included in the date range, and I filter using the date string.
- The account type determines the normal balance calculation: assets and expenses use debits minus credits, while liabilities, equity, and revenue use credits minus debits.
- The account subtype determines which income statement section the account belongs in.
- Contra revenue appears as a negative amount under Revenue. This means returns and discounts are subtracted from sales when calculating total revenue.
- Revenue is recorded when the sale is made (JE-002), not again when the customer pays (JE-013).
- The inactive accounts still contain historical transactions so they are recorded.
- The income statement includes accounts even when they have no activity during the selected date range. These accounts show a `$0.00` balance so the statement keeps a consistent layout.
- Net income is operating income + other income. The ledger does not have an other-expense subtype, so there are no other expenses to include.
- I check every journal entry, regardless of status, but reject invalid dates, unknown accounts, negative debit or credit amounts, and entries where total debits do not equal total credits.
- The application converts amounts to integer cents before adding them and rejects amounts with more than two decimal places or any other invalid numeric text.
- The API returns amounts as strings. The UI formats those strings for display with commas and parentheses for negative amounts.
- The UI does not calculate accounting balances or totals. It displays the amounts returned by the API and formats them for presentation.
- API dates must be real dates in `YYYY-MM-DD` format. Invalid dates and a start date after the end date return HTTP `400`.
- If `start` or `end` is not provided, the API defaults to January 1, 2026 through March 31, 2026. If a custom date range is requested, both dates are required.

## Testing

Before writing the expected values for my tests, I calculated the numbers by hand using the ledger JSON and also created the `test/scriptLedgerTest.py` to calculate the income statement from the JSON data and compare the results when I was done with the implementation.

I also created automated tests to cover the helper functions, ledger validation, calculations, date ranges and the API with edge cases for the exact start and end dates, journal entries for outside the date range, an empty date range. The UI formatting tests cover positive and negative amounts, commas, zeroes, and very small amounts.

I also made intentional changes to the income statement calculation to check whether the tests would catch mistakes.

- Making the end date exclusive
- Making the start date exclusive
- Including `draft` entries
- Including `void` entries
- Reversing the revenue sign

## Where AI helped and where I checked its work

**Where AI helped:**

- Setting up the project - Express API, React app, and TypeScript/Vite config files
- Explaining accounting rules using the accounting primer
- Simplifying the code after the initial main functionality was working
- Drafting tests and suggesting edge cases to check

**Where it didn't work and I had to check:**

- **Node version:** The first version of the README said Node 20 or newer was enough. The tests failed because the installed Vitest setup needed Node 22, and `Map.groupBy` was not available in the earlier runtime so I ended up upgrading Node.
- **Ledger validation:** The initial validation rejected negative amounts which caused a round-trip test using `-800.25` to fail, but it didn't check whether an entry had a real date - so an entry with `not-a-date` was accepted. I ended up adding tests for both cases and fixed the validation.
- **Expected totals:** I calculated the account balances and statement totals from the journal entries myself. I compared those results with the application and the separate Python script instead of using AI-generated numbers as my test expectations.
- **Date edge cases:** I tested the first and last days of the date range, entries outside the date range, and entries that were out of order in the JSON file.
- **Money formatting:** I checked that negative amounts appear in parentheses and that the UI formats decimal strings from the API without converting them to floating-point numbers.
- **Test coverage:** I reviewed what the tests actually checked.

## What I would add next

- Add validation to make sure an account's subtype is valid for its account type.
- Add a March-only test and a test that checks whether the January, February, and March results add up to the Q1 result.
- Add a Playwright/browser test for the income statement page and its date inputs.
- Let users click an account balance to see the journal entries that make up that balance.
- Add a comparison view that shows two date ranges side by side, with each month displayed separately.