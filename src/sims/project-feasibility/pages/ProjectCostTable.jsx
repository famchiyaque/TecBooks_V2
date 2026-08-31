import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import BackButton from '@/components/global/BackButton'
import CostOfSalesTable from '@/components/dashboard/CostOfSalesTable'
import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable,
} from '@/utils/dashboard/costCalculations'
import { useProgram } from '../hooks/useProgram'
import { cbmToCostTableInputs } from '../costTable/cbmToCostTableInputs'

function buildCostOfSales(cbm) {
  const { employees, production, premises } = cbmToCostTableInputs(cbm)

  if (employees.length === 0) {
    return { error: 'Este proyecto no tiene empleados registrados.' }
  }
  if (!areCostsNumeric(employees, production)) {
    return { error: 'Este proyecto tiene datos no numéricos en empleados o producción.' }
  }

  const years = Object.keys(production.purchaseOrders).map(Number)
  if (years.length === 0) {
    return { error: 'Este proyecto no tiene año cero registrado.' }
  }

  const { MOD, MOIndirecta, Ingenieria, Administracion } = sumSalariesByCategory(employees)
  const MP = computeRawMaterialCost(production)
  const netSales = computeNetSales(production)
  const indirectMaterials = computeIndirectMaterialCosts(premises, netSales)
  const costOfSalesByYear = buildCostOfSalesTable(years, {
    MP, MOD, MOIndirecta, Ingenieria, Administracion, indirectMaterials,
  })

  return { costOfSalesByYear }
}

function ProjectCostTable() {
  const { programId, projectId } = useParams()
  const { program, status } = useProgram(programId)

  const project = program?.projects.find((candidate) => String(candidate.id) === String(projectId))
  const result = React.useMemo(() => (project ? buildCostOfSales(project.cbm) : null), [project])

  return (
    <Box sx={{ p: 4 }}>
      <BackButton label={program?.name ?? 'Programa'} sx={{ mb: 1, ml: -1 }} />

      <Box sx={{ maxWidth: 1000, mx: 'auto', textAlign: 'left' }}>
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'error' && (
        <Alert severity="error">No se pudo cargar el programa. Intenta de nuevo.</Alert>
      )}

      {status === 'not-found' && (
        <Alert severity="warning">No se encontró ese programa.</Alert>
      )}

      {status === 'ready' && !project && (
        <Alert severity="warning">No se encontró ese proyecto.</Alert>
      )}

      {status === 'ready' && project && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
            {project.name}
          </Typography>

          {result?.error && <Alert severity="warning">{result.error}</Alert>}
          {result?.costOfSalesByYear && (
            <CostOfSalesTable costOfSalesByYear={result.costOfSalesByYear} />
          )}
        </>
      )}
      </Box>
    </Box>
  )
}

export default ProjectCostTable
