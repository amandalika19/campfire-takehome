import json
import argparse
from decimal import Decimal as D

parser = argparse.ArgumentParser(description='Calculate income statement totals from a ledger.')

parser.add_argument('--data-file', default='ledger.json', help='Ledger JSON filename')
parser.add_argument('--start', default='2026-01-01', help='Start date (YYYY-MM-DD)')
parser.add_argument('--end', default='2026-03-31', help='End date (YYYY-MM-DD)')

args = parser.parse_args()

start = args.start
end = args.end

with open(f'data/{args.data_file}') as file:
    ledger = json.load(file)

accounts = {a['number']: a for a in ledger['accounts']}

totals = {}  # subtype -> total

for entry in ledger['journal_entries']:
    if entry['status'] != 'posted' or not (start <= entry['date'] <= end):
        continue

    for line in entry['lines']:
        account = accounts[line['account']]

        if account['subtype'] == 'balance_sheet':
            continue

        debit, credit = D(line['debit']), D(line['credit'])
        amount = credit - debit if account['type'] == 'revenue' else debit - credit

        totals[account['subtype']] = totals.get(account['subtype'], D(0)) + amount


def get(subtype):
    return totals.get(subtype, D(0))


revenue = get('operating_revenue') + get('contra_revenue')
grossProfit = revenue - get('cogs')
operatingIncome = grossProfit - get('operating_expense')
netIncome = operatingIncome + get('other_income')

print(f'{start} to {end}')
print('revenue         ', revenue)
print('cogs            ', get('cogs'))
print('gross profit    ', grossProfit)
print('operating exp   ', get('operating_expense'))
print('operating income', operatingIncome)
print('other income    ', get('other_income'))
print('net income      ', netIncome)