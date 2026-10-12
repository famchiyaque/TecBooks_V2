import React from 'react'
import { Box, Typography } from '@mui/material'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import formatCurrency from '@/utils/sims/program/formatCurrency.util'
import { buildBreakEvenSeries } from './computeBreakEven.js'

/**
 * RF-62: "Punto de Equilibrio" chart (Estado R rows 64+, without exposing the
 * underlying units-sold table itself - RF-61, deliberately left out).
 */
function BreakEvenChart({ fixedCosts, variableCostPerUnit, salePrice, breakEvenUnits }) {
  const data = buildBreakEvenSeries({ fixedCosts, variableCostPerUnit, salePrice, breakEvenUnits })

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 19, color: '#073a5a', mb: 1 }}>
        Punto de Equilibrio
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="units" tick={{ fontSize: 14 }} />
          <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 14 }} width={112} />
          <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(units) => `${units} units`} contentStyle={{ fontSize: 15 }} />
          <Legend wrapperStyle={{ fontSize: 15 }} />
          <Line type="monotone" dataKey="Cost" stroke="#073a5a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Sales" stroke="#0891b2" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default BreakEvenChart
