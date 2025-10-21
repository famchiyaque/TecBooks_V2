import React from 'react'
import WaterfallChart from '@keyvaluesystems/react-waterfall-chart'
import { useSimData } from '../../SimDataContext'

function Waterfall({ period, year }) {
  const { simData } = useSimData()
  const revenue = simData.salesThisMonth
  const costs = simData.costsThisMonth * -1
  const expenses = simData.expensesThisMonth * -1
  const ebitda = revenue + costs + expenses

  const transactions = [
    { label: 'Revenue', value: revenue },
    { label: 'Costs', value: costs },
    { label: 'Expenses', value: expenses },
    { label: 'EBITDA', value: ebitda }
  ]

  return (
    <div style={{ width: '100%', minHeight: '240px', display: 'flex', justifyContent: 'flex-end' }}>
      <WaterfallChart transactions={transactions} style={{ marginTop: 'auto', border: 'solid red 1px', marginTop: '3rem' }} />
    </div>
  )
}

export default Waterfall