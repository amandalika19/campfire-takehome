import express from 'express';
import { fileURLToPath } from 'node:url';
import { loadLedger } from './ledger';
import { buildIncomeStatement } from './statement';
import type { Ledger } from '../../shared/src/types';

const DEFAULT_START = '2026-01-01';
const DEFAULT_END = '2026-03-31';

// Returns true only for real dates written as YYYY-MM-DD.
function isValidDate(value: string): boolean {
  const date = new Date(`${value}`);

  return (
    value.length === 10 &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export function createApp(ledger: Ledger) {
  const app = express();

  app.get('/income-statement', (req, res) => {
    const { start, end } = req.query;

    // Use the default period only when neither date is provided.
    if (start === undefined && end === undefined) {
      return res.json(
        buildIncomeStatement(ledger, DEFAULT_START, DEFAULT_END)
      );
    }

    // Require both dates when a custom period is requested.
    if (typeof start !== 'string' || typeof end !== 'string') {
      return res.status(400).json({
        error: 'Both start and end dates are required.',
      });
    }

    if (!isValidDate(start) || !isValidDate(end)) {
      return res.status(400).json({
        error: 'Dates must be real dates in YYYY-MM-DD format.',
      });
    }

    if (start > end) {
      return res.status(400).json({
        error: 'Start date must be before or equal to the end date.',
      });
    }

    return res.json(buildIncomeStatement(ledger, start, end));
  });

  return app;
}

if (!process.env.VITEST) {
  const path = fileURLToPath(
    new URL('../../../data/ledger.json', import.meta.url)
  );
  const port = Number(process.env.PORT ?? 3001);

  createApp(loadLedger(path)).listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}
