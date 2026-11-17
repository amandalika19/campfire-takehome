
import { describe, expect, it } from 'vitest';
import { formatMoney } from '../app/ui/src/format';

describe('formatMoney', () => {
  it('adds a dollar sign and always displays two decimal places', () => {
    expect(formatMoney('42.18')).toBe('$42.18');
    expect(formatMoney('1000.00')).toBe('$1,000.00');
    expect(formatMoney('5')).toBe('$5.00');
  });

  it('formats negative amounts using parentheses instead of a minus sign', () => {
    expect(formatMoney('-800.25')).toBe('($800.25)');
    expect(formatMoney('-1000.00')).toBe('($1,000.00)');
  });

  it('adds commas for thousands and larger amounts', () => {
    expect(formatMoney('999.99')).toBe('$999.99');
    expect(formatMoney('37850.50')).toBe('$37,850.50');
    expect(formatMoney('1234567.89')).toBe('$1,234,567.89');
  });

  it('correctly formats zero and small amounts', () => {
    expect(formatMoney('0.00')).toBe('$0.00');
    expect(formatMoney('0.05')).toBe('$0.05');
    expect(formatMoney('-0.01')).toBe('($0.01)');
  });

  it('formats the Q1 net income correctly', () => {
    expect(formatMoney('-44480.14')).toBe('($44,480.14)');
  });
});
