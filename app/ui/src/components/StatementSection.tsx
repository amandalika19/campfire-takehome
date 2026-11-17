import { formatMoney } from '../format';
import type { StatementSection as Section } from '../../../shared/src/types';

// One table row: a label on the left and a formatted amount on the right.
export function Row(props: { label: string; amount: string; className?: string }) {
  return (
    <tr className={props.className}>
      <td>{props.label}</td>
      <td className="amount">{formatMoney(props.amount)}</td>
    </tr>
  );
}

export default function StatementSection({ section }: { section: Section }) {
  return (
    <>
      <tr>
        <th colSpan={2}>{section.title}</th>
      </tr>
      {section.accounts.map((a) => (
        <Row key={a.number} label={`${a.number} ${a.name}`} amount={a.amount} className="line" />
      ))}
      <Row label={`Total ${section.title.toLowerCase()}`} amount={section.subtotal} className="total" />
    </>
  );
}
