import type { IncomeStatement } from '../../../shared/src/types';
import StatementSection, { Row } from './StatementSection';

export default function IncomeStatementView({ statement }: { statement: IncomeStatement }) {
  const s = statement.sections;

  return (
    <section>
      <h1>{statement.company}</h1>
      <p>
        Income statement, {statement.period.start} to {statement.period.end}
        <br />
        <small>Amounts in {statement.currency}. Negative amounts are in parentheses.</small>
      </p>
      <table>
        <tbody>
          <StatementSection section={s.revenue} />
          <StatementSection section={s.costOfGoodsSold} />
          <Row label="Gross profit" amount={s.grossProfit} className="total" />
          <StatementSection section={s.operatingExpenses} />
          <Row label="Operating income" amount={s.operatingIncome} className="total" />
          <StatementSection section={s.otherIncome} />
          <Row label="Net income" amount={s.netIncome} className="net-income" />
        </tbody>
      </table>
    </section>
  );
}
