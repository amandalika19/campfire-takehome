import type { IncomeStatement } from '../../shared/src/types';

export async function fetchIncomeStatement(start: string, end: string): Promise<IncomeStatement> {
  const response = await fetch(`/income-statement?start=${start}&end=${end}`);
  const body = await response.json();
  if (!response.ok) throw new Error(body.error);
  return body;
}
