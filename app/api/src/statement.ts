import { fromCents, toCents } from './ledger';
import type { IncomeStatement, Ledger, StatementSection } from '../../shared/src/types';

// Adds up every posted entry between start and end (inclusive).
// Returns a map of account number -> total in cents.
// Revenue accounts: credit - debit (so a return/discount comes out negative).
// Expense accounts: debit - credit (so a vendor credit lowers the expense).
function totalByAccount(ledger: Ledger, start: string, end: string): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const entry of ledger.journal_entries) {
    // Drafts and voids are not in the books.
    if (entry.status !== 'posted') continue;
    if (entry.date < start || entry.date > end) continue;

    for (const line of entry.lines) {
      const account = ledger.accounts.find((a) => a.number === line.account);
      if (!account) throw new Error(`${entry.id}: unknown account ${line.account}`);

      if (account.subtype === 'balance_sheet') continue;

      const debit = toCents(line.debit);
      const credit = toCents(line.credit);
      const amount = account.type === 'revenue' ? credit - debit : debit - credit;

      totals[account.number] = (totals[account.number] ?? 0) + amount;
    }
  }

  return totals;
}

function buildSection(
  title: string,
  subtypes: string[],
  ledger: Ledger,
  totals: Record<string, number>,
): { section: StatementSection; cents: number } {
  const accounts = ledger.accounts.filter((a) => subtypes.includes(a.subtype));

  let subtotal = 0;
  const lines = accounts.map((a) => {
    const cents = totals[a.number] ?? 0;
    subtotal += cents;
    return { number: a.number, name: a.name, amount: fromCents(cents) };
  });

  return { section: { title, accounts: lines, subtotal: fromCents(subtotal) }, cents: subtotal };
}

export function buildIncomeStatement(ledger: Ledger, start: string, end: string): IncomeStatement {
  const totals = totalByAccount(ledger, start, end);

  const revenue = buildSection('Revenue', ['operating_revenue', 'contra_revenue'], ledger, totals);
  const cogs = buildSection('Cost of goods sold', ['cogs'], ledger, totals);
  const opex = buildSection('Operating expenses', ['operating_expense'], ledger, totals);
  const other = buildSection('Other income', ['other_income'], ledger, totals);

  const grossProfit = revenue.cents - cogs.cents;
  const operatingIncome = grossProfit - opex.cents;
  const netIncome = operatingIncome + other.cents;

  return {
    company: ledger.company,
    currency: ledger.currency,
    period: { start, end },
    sections: {
      revenue: revenue.section,
      costOfGoodsSold: cogs.section,
      grossProfit: fromCents(grossProfit),
      operatingExpenses: opex.section,
      operatingIncome: fromCents(operatingIncome),
      otherIncome: other.section,
      netIncome: fromCents(netIncome),
    },
  };
}
