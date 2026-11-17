// Formats money text - -44480.14" becomes "($44,480.14)
const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencySign: 'accounting', // negatives in parentheses
  });
  
  export function formatMoney(amount: string): string {
    return money.format(amount as `${number}`);
  }