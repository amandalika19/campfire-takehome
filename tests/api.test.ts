import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app/api/src/index';
import { loadLedger } from '../app/api/src/ledger';
import {DATA_FILE} from '../app/shared/src/constants';

const ledger = loadLedger(
  fileURLToPath(new URL(DATA_FILE, import.meta.url))
);

const app = createApp(ledger);

describe('GET /income-statement', () => {
  it('returns a successful Q1 income statement with the correct structure', async () => {
    const res = await request(app).get(
      '/income-statement?start=2026-01-01&end=2026-03-31'
    );

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('period');
    expect(res.body).toHaveProperty('sections');

    expect(res.body.period).toEqual({
      start: '2026-01-01',
      end: '2026-03-31',
    });

    expect(res.body.sections.netIncome).toBe('-44480.14');
    expect(res.body.sections.revenue.subtotal).toBe('37850.50');
    expect(res.body.sections.grossProfit).toBe('23577.75');
  });

  it('defaults to Q1 2026 when no dates are provided', async () => {
    const res = await request(app).get('/income-statement');

    expect(res.status).toBe(200);
    expect(res.body.period).toEqual({
      start: '2026-01-01',
      end: '2026-03-31',
    });

    expect(res.body.sections.netIncome).toBe('-44480.14');
  });

  it('uses custom dates when a reporting period is provided', async () => {
    const res = await request(app).get(
      '/income-statement?start=2026-01-01&end=2026-01-31'
    );

    expect(res.status).toBe(200);
    expect(res.body.period).toEqual({
      start: '2026-01-01',
      end: '2026-01-31',
    });

    expect(res.body.sections.netIncome).toBe('-21529.65');
  });

  it('rejects dates that do not follow YYYY-MM-DD format', async () => {
    const res = await request(app).get(
      '/income-statement?start=01-01-2026&end=2026-03-31'
    );

    expect(res.status).toBe(400);
  });

  it('rejects dates that do not exist on the calendar', async () => {
    const res = await request(app).get(
      '/income-statement?start=2026-02-30&end=2026-03-31'
    );

    expect(res.status).toBe(400);
  });

  it('rejects a start date that occurs after the end date', async () => {
    const res = await request(app).get(
      '/income-statement?start=2026-03-31&end=2026-01-01'
    );

    expect(res.status).toBe(400);
  });

  it('rejects requests with only one date parameter', async () => {
    const res = await request(app).get(
      '/income-statement?start=2026-01-01'
    );

    expect(res.status).toBe(400);
  });
});
