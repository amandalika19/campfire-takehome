export interface Account {
    number: string;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    subtype: string; // operating_revenue, contra_revenue, cogs, operating_expense, otherIncome, balance_sheet
    is_active: boolean;
  }
  
  export interface JournalLine {
    account: string; // account number  - 100 Checking
    debit: string;   // money as text, like '12450.75'
    credit: string;
  }
  
  export interface JournalEntry {
    id: string;
    date: string; // YYYY-MM-DD
    status: 'posted' | 'draft' | 'void';
    memo: string;
    lines: JournalLine[];
  }
  
  export interface Ledger {
    company: string;
    currency: string;
    accounts: Account[];
    journal_entries: JournalEntry[];
  }
  
  export interface StatementLine {
    number: string;
    name: string;
    amount: string;
  }
  
  export interface StatementSection {
    title: string;
    accounts: StatementLine[];
    subtotal: string;
  }
  
  export interface IncomeStatement {
    company: string;
    currency: string;
    period: { start: string; end: string };
    sections: {
      revenue: StatementSection;
      costOfGoodsSold: StatementSection;
      grossProfit: string;
      operatingExpenses: StatementSection;
      operatingIncome: string;
      otherIncome: StatementSection;
      netIncome: string;
    };
  }
  