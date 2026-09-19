import React from 'react'
import { Box, Typography } from '@mui/material'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

function formatCurrency(value) {
  const num = Number(value) || 0
  return `$${num.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`
}

/**
 * RF-62: "Punto de Equilibrio" chart (Estado R rows 64+, without exposing the
 * underlying units-sold table itself - RF-61, deliberately left out). Same
 * two lines the template plots: Cost = fixedCosts + variableCostPerUnit *
 * units, Sales = salePrice * units, from 0 out to 2x break-even so the
 * crossover sits near the middle of the chart, same as the reference.
 */
function BreakEvenChart({ fixedCosts, variableCostPerUnit, salePrice, breakEvenUnits }) {
  const maxUnits = Math.max(breakEvenUnits * 2, 1)
  const steps = 30
  const stepSize = maxUnits / steps

  const data = Array.from({ length: steps + 1 }, (_, i) => {
    const units = Math.round(i * stepSize)
    return {
      units,
      Cost: fixedCosts + variableCostPerUnit * units,
      Sales: salePrice * units,
    }
  })

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#073a5a', mb: 1 }}>
        Punto de Equilibrio
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="units" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} width={90} />
          <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(units) => `${units} units`} />
          <Legend />
          <Line type="monotone" dataKey="Cost" stroke="#073a5a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Sales" stroke="#0891b2" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default BreakEvenChart
