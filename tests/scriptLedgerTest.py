import json
import sys
from decimal import Decimal as D

start = '2025-12-14'
end = '2025-12-16'

ledger = json.load(open('../data/ledger.json'))
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