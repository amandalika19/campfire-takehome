import { useEffect, useState } from 'react';
import { fetchIncomeStatement } from './api';
import DateRange from './components/DateRange';
import IncomeStatementView from './components/IncomeStatement';
import type { IncomeStatement } from '../../shared/src/types';

export default function App() {
  const [start, setStart] = useState('2026-01-01');
  const [end, setEnd] = useState('2026-03-31');
  const [statement, setStatement] = useState<IncomeStatement | null>(null);
  const [error, setError] = useState('');

  // Asks the API for the statement using whatever dates are in the boxes right now.
  function loadStatement() {
    fetchIncomeStatement(start, end)
      .then((data) => {
        setStatement(data);
        setError('');
      })
      .catch((e: Error) => setError(e.message));
  }

  useEffect(loadStatement, []);

  return (
    <main>
      <DateRange start={start} end={end} setStart={setStart} setEnd={setEnd} onShow={loadStatement} />
      {error && <p className="error">{error}</p>}
      {statement && !error && <IncomeStatementView statement={statement} />}
    </main>
  );
}