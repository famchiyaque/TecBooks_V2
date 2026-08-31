import React from 'react'
import { useParams } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import BackButton from '@/components/global/BackButton'
import CostOfSalesTable from '@/components/dashboard/CostOfSalesTable'
import { costTableEditsSlice } from '@/store/costTable.store'
import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
} from '@/utils/dashboard/costCalculations'
import { useProgram } from '../hooks/useProgram'
import { cbmToCostTableInputs } from '../costTable/cbmToCostTableInputs'

function buildCostOfSales(cbm) {
  const { employees, production, premises } = cbmToCostTableInputs(cbm)

  if (employees.length === 0) {
    return { error: 'This project has no registered employees.' }
  }
  if (!areCostsNumeric(employees, production)) {
    return { error: 'This project has non-numeric data in employees or production.' }
  }

  const years = Object.keys(production.purchaseOrders).map(Number)
  if (years.length === 0) {
    return { error: 'This project has no year-zero record.' }
  }

  const { MOD, MOIndirecta, Ingenieria, Administracion } = sumSalariesByCategory(employees)
  const MP = computeRawMaterialCost(production)
  const netSales = computeNetSales(production)
  const indirectMaterials = computeIndirectMaterialCosts(premises, netSales)
  const costOfSalesByYear = buildCostOfSalesTable(years, {
    MP, MOD, MOIndirecta, Ingenieria, Administracion, indirectMaterials,
  })
  const unclassifiedEmployees = findUnclassifiedEmployees(employees)

  return { costOfSalesByYear, unclassifiedEmployees }
}

function ProjectCostTable() {
  const { programId, projectId } = useParams()
  const { program, status } = useProgram(programId)

  const project = program?.projects.find((candidate) => String(candidate.id) === String(projectId))
  const result = React.useMemo(() => (project ? buildCostOfSales(project.cbm) : null), [project])

  // Fresh store per project so edits/custom rows never leak between projects.
  const editsStore = React.useMemo(() => costTableEditsSlice.createStore(), [projectId])

  return (
    <Box sx={{ p: 4 }}>
      <BackButton label={program?.name ?? 'Program'} sx={{ mb: 1, ml: -1 }} />

      <Box sx={{ maxWidth: 1000, mx: 'auto', textAlign: 'left' }}>
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'error' && (
        <Alert severity="error">Couldn't load the program. Please try again.</Alert>
      )}

      {status === 'not-found' && (
        <Alert severity="warning">Program not found.</Alert>
      )}

      {status === 'ready' && !project && (
        <Alert severity="warning">Project not found.</Alert>
      )}

      {status === 'ready' && project && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
            {project.name}
          </Typography>

          {result?.error && <Alert severity="warning">{result.error}</Alert>}
          {result?.unclassifiedEmployees?.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {result.unclassifiedEmployees.length} employee{result.unclassifiedEmployees.length === 1 ? '' : 's'} with
              an unrecognized category weren't counted in this table: {result.unclassifiedEmployees.join(', ')}
            </Alert>
          )}
          {result?.costOfSalesByYear && (
            <Provider store={editsStore}>
              <CostOfSalesTable costOfSalesByYear={result.costOfSalesByYear} />
            </Provider>
          )}
        </>
      )}
      </Box>
    </Box>
  )
}

export default ProjectCostTable
