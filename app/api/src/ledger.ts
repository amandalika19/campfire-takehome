import { readFileSync } from 'node:fs';
import type { Ledger } from '../../shared/src/types';

// True if the text is one or more digits, like "12450". Empty text is not allowed.
function isDigits(text: string): boolean {
  for (const char of text) {
    if (char < '0' || char > '9') return false;
  }
  return text.length > 0;
}

// Turns "12450.75" into 1245075 cents. 
export function toCents(text: string): number {
  const isNegative = text.startsWith('-');
  const parts = (isNegative ? text.slice(1) : text).split('.');
  const dollars = parts[0];
  const cents = parts[1] ?? '00';

  if (parts.length > 2 || !isDigits(dollars) || !isDigits(cents) || cents.length > 2) {
    throw new Error(`Bad money amount: "${text}"`);
  }

  const total = Number(dollars) * 100 + Number(cents.padEnd(2, '0'));
  return isNegative ? -total : total;
}

// Turns 1245075 cents back into "12450.75". Works for negatives too.
export function fromCents(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, '0');
  return `${sign}${dollars}.${rest}`;
}

// Returns true only for real dates written as YYYY-MM-DD (so 2026-02-30 is false).
// A real date turns back into the same text; anything else does not.
export function isValidDate(text: string): boolean {
  const date = new Date(`${text}`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text;
}

// Checks the data is sane: every entry has a real date, every account exists,
// no amount is negative, and every entry balances. Throws an error if something is wrong.
export function checkLedger(ledger: Ledger): void {
  const accountNumbers = ledger.accounts.map((a) => a.number);

  for (const entry of ledger.journal_entries) {
    if (!isValidDate(entry.date)) {
      throw new Error(`${entry.id}: invalid date "${entry.date}"`);
    }

    let totalDebit = 0;
    let totalCredit = 0;

    for (const line of entry.lines) {
      if (!accountNumbers.includes(line.account)) {
        throw new Error(`${entry.id}: unknown account ${line.account}`);
      }
      const debit = toCents(line.debit);
      const credit = toCents(line.credit);
      if (debit < 0 || credit < 0) {
        throw new Error(`${entry.id}: debit and credit cannot be negative`);
      }
      totalDebit += debit;
      totalCredit += credit;
    }

    if (totalDebit !== totalCredit) {
      throw new Error(`${entry.id}: debits and credits do not match`);
    }
  }
}

// Reads the JSON file, checks it, and returns it.
export function loadLedger(path: string): Ledger {
  const ledger = JSON.parse(readFileSync(path, 'utf8')) as Ledger;
  checkLedger(ledger);
  return ledger;
}