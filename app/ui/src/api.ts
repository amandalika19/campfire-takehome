import type { IncomeStatement } from '../../shared/src/types';

export async function fetchIncomeStatement(
  start: string,
  end: string
): Promise<IncomeStatement> {
  let response: Response;

  try {
    response = await fetch(
      `/income-statement?start=${start}&end=${end}`
    );
  } catch {
    throw new Error('Unable to connect to the API. Please try again.');
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.error ?? `Request failed with status ${response.status}`
    );
  }

  if (!body) {
    throw new Error('The API returned an empty response.');
  }

  return body;
}