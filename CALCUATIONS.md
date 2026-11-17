# Calculations

This document explains how I calculated the Q1 2026 income statement using `data/ledger.json` for Northwind Coffee Roasters.

All amounts are in USD.

## 1. How I selected the journal entries

I treated the ledger as one source of truth and used the journal entries in the JSON file.

For the Q1 2026 income statement, I included entries:

- Where status is `posted`.
- Where the accounting date is between January 1, 2026, and March 31, 2026

The start and end dates are both included in the date range.

I filter using the date string, not the order of entries in the JSON file.

I still validate every journal entry, regardless of status.Only `posted` entries within the date range affect the income statement.

I matched each journal entry line to its account using the account number. I only included revenue and expense accounts in the income statement. 
- Assets, liabilities, and equity belong on the balance sheet, so they are not included.

The account type determines how the debit and credit amounts are calculated:

- Revenue accounts= credits - debits.
- Expense accounts= debits - credits.

The account subtype determines which income statement section the account belongs in:

| Account subtype | Income statement section |
|---|---|
| `operating_revenue` | Revenue |
| `contra_revenue` | Revenue |
| `cogs` | Cost of goods sold |
| `operating_expense` | Operating expenses |
| `otherIncome` | Other income |
| `balance_sheet` | Not included |

I use the account subtype to organize the accounts after calculating their balances.

`is_active: false` means the account is inactive for new postings. Historical transactions are still included.

## 2. January 2026

### JE-001 — December product sales

JE-001 is dated December 15, 2025, so it is outside the Q1 reporting period and is not included.

### JE-002 — January product sales

JE-002 records $12,450.75 in January product sales.

This is included in Product Revenue because it is a posted revenue transaction within the reporting period.

### JE-003 — January Cost of Goods Sold

JE-003 records $4,980.30 in Cost of Goods Sold.

This is included as an expense because it represents the direct cost associated with the products sold.

### JE-004 — Annual subscription billing

JE-004 records a $12,000.00 annual subscription billing and credits Deferred Revenue.

Deferred Revenue is a liability because the subscription service has not yet been fully earned. I did not count the full $12,000.00 as revenue when it was billed.

### JE-005 — January subscription revenue

JE-005 records $1,000.00 in subscription revenue.

This is included in Revenue because it represents the portion of the subscription that was recognized in January.

### JE-006 — January payroll

JE-006 records $18,500.00 in Salaries expense.

This is included in Operating Expenses.

### JE-007 — Rent

JE-007 records $9,000.00 of rent on January 1 for the January-to-March period.

I included the full $9,000.00 in January because that is how the transaction was recorded in the ledger. I did not split the amount across the three months or create additional adjusting entries

### JE-008 — Marketing expense

JE-008 records $2,500.10 in the Marketing account (6300).

This is included in Operating Expenses because it is a posted expense within Q1.

### January totals

| Account | January amount |
|---|---:|
| Product Revenue | $12,450.75 |
| Subscription Revenue | $1,000.00 |
| Cost of Goods Sold | $4,980.30 |
| Salaries | $18,500.00 |
| Rent | $9,000.00 |
| Marketing | $2,500.10 |

January Net Income:

`$12,450.75 + $1,000.00 - $4,980.30 - $18,500.00 - $9,000.00 - $2,500.10 = -$21,529.65`

**January Net Income: ($21,529.65)**

## 3. February 2026

### JE-009 — Duplicate February sale

JE-009 is a duplicate February sale, but its status is `void`. I excluded it because void entries do not affect the income statement.

### JE-010 — February product sales

JE-010 records $8,200.00 in February product sales.

This is included in Product Revenue because it is the posted February sale.

### JE-011 — February Cost of Goods Sold

JE-011 records $3,280.00 in Cost of Goods Sold.

This is included as an expense.

### JE-012 — Returned order

JE-012 records a $650.25 returned order from Blue Door Cafe.

The amount is debited to Sales Returns & Discounts (4900), which is a contra revenue account. I show it as a negative amount under Revenue because it reduces sales.

### JE-013 — Payment received for January sales

JE-013 records a $12,450.75 customer payment for the product sale originally recorded in JE-002.

JE-002 recorded the sale by debiting Accounts Receivable and crediting Product Revenue. JE-013 then records the payment by debiting Cash and crediting Accounts Receivable.

This clears the existing receivable and records the cash received. It does not count as new revenue because the sale was already recorded in JE-002.

### JE-014 — February subscription revenue

JE-014 records $1,000.00 in subscription revenue.

This is included in Revenue.

### JE-015 — February payroll

JE-015 records $18,500.00 in Salaries expense.

This is included in Operating Expenses.

### February totals

| Account | February amount |
|---|---:|
| Product Revenue | $8,200.00 |
| Subscription Revenue | $1,000.00 |
| Sales Returns & Discounts | ($650.25) |
| Cost of Goods Sold | $3,280.00 |
| Salaries | $18,500.00 |

February Net Income:

`$8,200.00 + $1,000.00 - $650.25 - $3,280.00 - $18,500.00 = -$13,230.25`

**February Net Income: ($13,230.25)**

## 4. March 2026

### JE-016 — March product sales and volume discount

JE-016 records $15,000.00 in Product Revenue and a $150.00 debit to Sales Returns & Discounts.

The $150.00 volume discount reduces revenue:

`$15,000.00 - $150.00 = $14,850.00`

I include the $15,000.00 in Product Revenue and show the $150.00 discount as a negative amount under Revenue.

### JE-017 — March Cost of Goods Sold

JE-017 records $6,012.45 in Cost of Goods Sold.

This is included as an expense.

### JE-018 — Software expense

JE-018 records $1,199.97 in Software expense.

This is included in Operating Expenses.

### JE-019 — Bonus accrual

JE-019 records a $5,000.00 bonus accrual, but its status is `draft` so this was excluded

### JE-020 — Software vendor credit

JE-020 records a $100.00 vendor credit for a software overcharge.

This is a credit to the Software expense account, so it reduces the expense:

`$1,199.97 - $100.00 = $1,099.97`

**Software expense: $1,099.97**

### JE-021 — March subscription revenue

JE-021 records $1,000.00 in subscription revenue.

This is included in Revenue.

### JE-022 — March payroll

JE-022 records $18,500.00 in Salaries expense.

This is included in Operating Expenses.

### JE-023 — Interest income

JE-023 records $42.18 in Interest Income.

The account subtype is `otherIncome`, so I include it under Other Income rather than operating Revenue.

### JE-024 — April product sales

JE-024 is dated April 1, 2026, so it is outside the Q1 reporting period and is not included.

### JE-025 — Cancelled customer payment

JE-025 records a customer payment of $3,200.00, but its status is `void` and therefore excluded

### March totals

| Account | March amount |
|---|---:|
| Product Revenue | $15,000.00 |
| Subscription Revenue | $1,000.00 |
| Sales Returns & Discounts | ($150.00) |
| Cost of Goods Sold | $6,012.45 |
| Salaries | $18,500.00 |
| Software | $1,099.97 |
| Other Income | $42.18 |

March Net Income:

`$15,000.00 + $1,000.00 - $150.00 - $6,012.45 - $18,500.00 - $1,099.97 + $42.18 = -$9,720.24`

**March Net Income: ($9,720.24)**

## 5. Q1 2026 totals

### Revenue

| Account | Account number | Q1 amount |
|---|---:|---:|
| Product Revenue | 4000 | $35,650.75 |
| Subscription Revenue | 4100 | $3,000.00 |
| Sales Returns & Discounts | 4900 | ($800.25) |
| **Total Revenue** | | **$37,850.50** |

Product Revenue:

`$12,450.75 + $8,200.00 + $15,000.00 = $35,650.75`

Subscription Revenue:

`$1,000.00 + $1,000.00 + $1,000.00 = $3,000.00`

Sales Returns & Discounts:

`$650.25 + $150.00 = $800.25`

I calculated Total Revenue by adding Product Revenue, Subscription Revenue, and Sales Returns & Discounts. Sales Returns & Discounts is a contra revenue account, so its balance is negative and reduces Total Revenue.

`$35,650.75 + $3,000.00 + (-$800.25) = $37,850.50`

### Cost of Goods Sold

| Journal entry | Description | Amount |
|---|---|---:|
| JE-003 | January Cost of Goods Sold | $4,980.30 |
| JE-011 | February Cost of Goods Sold | $3,280.00 |
| JE-017 | March Cost of Goods Sold | $6,012.45 |
| **Total Cost of Goods Sold** | | **$14,272.75** |

`$4,980.30 + $3,280.00 + $6,012.45 = $14,272.75`

Gross Profit:

`$37,850.50 - $14,272.75 = $23,577.75`

**Gross Profit: $23,577.75**

### Operating Expenses

| Account | Account number | Q1 amount |
|---|---:|---:|
| Salaries | 6000 | $55,500.00 |
| Rent | 6100 | $9,000.00 |
| Software | 6200 | $1,099.97 |
| Marketing (legacy) | 6300 | $2,500.10 |
| **Total Operating Expenses** | | **$68,100.07** |

Salaries:

`$18,500.00 × 3 = $55,500.00`

Rent:

`$9,000.00`

Software:

`$1,199.97 - $100.00 = $1,099.97`

Marketing:

`$2,500.10`

Total Operating Expenses:

`$55,500.00 + $9,000.00 + $1,099.97 + $2,500.10 = $68,100.07`

### Operating Income

Operating Income is Gross Profit minus Operating Expenses.

`$23,577.75 - $68,100.07 = -$44,522.32`

**Operating Income: ($44,522.32)**

The negative amount means the company's operating expenses were greater than its gross profit during Q1.

### Other Income and Net Income

Other Income:

`$42.18`

Net Income is Operating Income plus Other Income:

`-$44,522.32 + $42.18 = -$44,480.14`

**Net Income: ($44,480.14)**

## 6. Monthly results

I ran the same calculations separately for each month using a month-specific date range.

| Month | Net Income |
|---|---:|
| January 2026 | ($21,529.65) |
| February 2026 | ($13,230.25) |
| March 2026 | ($9,720.24) |
| **Q1 2026** | **($44,480.14)** |

I checked that the monthly results add up to the Q1 result:

`-$21,529.65 - $13,230.25 - $9,720.24 = -$44,480.14`

## 7. Final Q1 Income Statement

| Section | Q1 amount |
|---|---:|
| Revenue | $37,850.50 |
| Cost of goods sold | ($14,272.75) |
| **Gross profit** | **$23,577.75** |
| Operating expenses | ($68,100.07) |
| **Operating income** | **($44,522.32)** |
| Other income | $42.18 |
| **Net income** | **($44,480.14)** |

Parentheses indicate a negative amount.

I also tested the income statement with different date ranges, including individual days and shorter periods within Q1, to make sure only entries within the selected range are included.
