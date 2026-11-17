import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadLedger } from '../app/api/src/ledger';
import { buildIncomeStatement } from '../app/api/src/statement';

const ledger = loadLedger(
  fileURLToPath(new URL('../data/ledger.json', import.meta.url))
);

// Helper: Find an account's amount within a statement section.
function amountOf(
  section: { accounts: { number: string; amount: string }[] },
  number: string
) {
  return section.accounts.find((a) => a.number === number)?.amount;
}

describe('buildIncomeStatement', () => {
  describe('Q1 2026 financial calculations', () => {
    const { period, sections } = buildIncomeStatement(
      ledger,
      '2026-01-01',
      '2026-03-31'
    );

    it('returns the requested reporting period', () => {
      expect(period).toEqual({
        start: '2026-01-01',
        end: '2026-03-31',
      });
    });

    it('calculates revenue correctly, including returns and discounts', () => {
      expect(amountOf(sections.revenue, '4000')).toBe('35650.75');
      expect(amountOf(sections.revenue, '4100')).toBe('3000.00');
      expect(amountOf(sections.revenue, '4900')).toBe('-800.25');

      expect(sections.revenue.subtotal).toBe('37850.50');
    });

    it('calculates cost of goods sold and gross profit correctly', () => {
      expect(sections.costOfGoodsSold.subtotal).toBe('14272.75');
      expect(sections.grossProfit).toBe('23577.75');
    });

    it('calculates operating expenses correctly', () => {
      // Draft payroll accrual is excluded.
      expect(amountOf(sections.operatingExpenses, '6000')).toBe('55500.00');

      // Vendor credit reduces software expenses.
      expect(amountOf(sections.operatingExpenses, '6200')).toBe('1099.97');

      // Inactive accounts with historical activity are included.
      expect(amountOf(sections.operatingExpenses, '6300')).toBe('2500.10');

      expect(sections.operatingExpenses.subtotal).toBe('68100.07');
    });

    it('calculates operating income and net income correctly', () => {
      expect(sections.operatingIncome).toBe('-44522.32');
      expect(sections.otherIncome.subtotal).toBe('42.18');
      expect(sections.netIncome).toBe('-44480.14');
    });

    it('excludes voided and draft journal entries', () => {
      // JE-009: Voided duplicate February sales.
      // JE-019: Draft bonus accrual.
      // JE-025: Voided payment.
      expect(amountOf(sections.revenue, '4000')).toBe('35650.75');
      expect(amountOf(sections.operatingExpenses, '6000')).toBe('55500.00');
    });
  });

  describe('date filtering', () => {
    it('calculates individual monthly statements correctly', () => {
      const january = buildIncomeStatement(
        ledger,
        '2026-01-01',
        '2026-01-31'
      );

      const february = buildIncomeStatement(
        ledger,
        '2026-02-01',
        '2026-02-28'
      );

      expect(january.sections.revenue.subtotal).toBe('13450.75');
      expect(january.sections.netIncome).toBe('-21529.65');

      expect(february.sections.revenue.subtotal).toBe('8549.75');
      expect(february.sections.netIncome).toBe('-13230.25');
    });

    it('includes entries on both the start and end dates', () => {
      // January 1: Rent expense.
      const start = buildIncomeStatement(
        ledger,
        '2026-01-01',
        '2026-01-01'
      );

      // March 31: Interest income.
      const end = buildIncomeStatement(
        ledger,
        '2026-03-31',
        '2026-03-31'
      );

      expect(start.sections.operatingExpenses.subtotal).toBe('9000.00');
      expect(end.sections.otherIncome.subtotal).toBe('42.18');
    });

    it('excludes transactions outside the selected date range', () => {
      // December 15 sales and April 1 sales should not affect Q1.
      const { sections } = buildIncomeStatement(
        ledger,
        '2026-01-01',
        '2026-03-31'
      );

      expect(sections.revenue.subtotal).toBe('37850.50');
    });

    it('returns zero totals when there is no activity', () => {
      const { sections } = buildIncomeStatement(
        ledger,
        '2030-01-01',
        '2030-12-31'
      );

      expect(sections.revenue.subtotal).toBe('0.00');
      expect(sections.costOfGoodsSold.subtotal).toBe('0.00');
      expect(sections.operatingExpenses.subtotal).toBe('0.00');
      expect(sections.netIncome).toBe('0.00');
    });
  });

  it('does not modify the original ledger when generating a statement', () => {
    const original = structuredClone(ledger);

    buildIncomeStatement(ledger, '2026-01-01', '2026-03-31');

    expect(ledger).toEqual(original);
  });
});
