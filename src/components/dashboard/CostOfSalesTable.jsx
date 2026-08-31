import React from 'react'
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material'

const CATEGORY_ROWS = [
  { key: 'rawMaterial', label: 'Costo de Materias Primas (MP)' },
  { key: 'directLabour', label: 'Mano de Obra Directa (MOD)' },
  { key: 'indirectManufacturing', label: 'Mano de Obra Indirecta' },
  { key: 'engineeringSalaries', label: 'Costos de Ingenieria' },
  { key: 'administrativeExpenses', label: 'Costos de Administracion' },
  { key: 'indirectMaterials', label: 'Costos Materiales Indirectos' },
]

function formatCurrency(value) {
  return `$${Math.round(value || 0).toLocaleString('es-MX')}`
}

function CostOfSalesTable({ costOfSalesByYear }) {
  return (
    <TableContainer component={Card} sx={{ mt: 3, borderRadius: '15px', border: 'solid #073a5a 1px' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#073a5a' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Concepto</TableCell>
            {costOfSalesByYear.map((row) => (
              <TableCell key={row.year} align="right" sx={{ color: '#fff', fontWeight: 600 }}>
                {row.year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {CATEGORY_ROWS.map(({ key, label }) => (
            <TableRow key={key}>
              <TableCell>{label}</TableCell>
              {costOfSalesByYear.map((row) => (
                <TableCell key={row.year} align="right">{formatCurrency(row[key])}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: '#e4f1fe' }}>
            <TableCell sx={{ fontWeight: 700, color: '#073a5a' }}>Total de Costos</TableCell>
            {costOfSalesByYear.map((row) => (
              <TableCell key={row.year} align="right" sx={{ fontWeight: 700, color: '#073a5a' }}>
                {formatCurrency(row.totalCostOfSales)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CostOfSalesTable
