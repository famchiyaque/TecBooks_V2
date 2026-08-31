import React, { useState, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import {
  Card, CardContent, Typography, Button, Box, Alert,
} from '@mui/material'
import { CloudUpload, CheckCircle } from '@mui/icons-material'
import { createCostTableStore, setFileName, setEmployees, setProduction, setPremises, resetCostTable } from '@/store/costTable.store'
import { adaptCostTableExcel } from '@/adapters/excel/cost-table.adapter'
import useCostTable from '@/hooks/dashboard/useCostTable'
import { useAuth } from '@/contexts/AuthContext'
import GenericHeader from '@/components/global/GenericHeader'
import GenericSubheader from '@/components/global/GenericSubheader'
import CostOfSalesTable from '@/components/dashboard/CostOfSalesTable'

function CostTableContent() {
  const dispatch = useDispatch()
  const [stagedFile, setStagedFile] = useState(null)
  const [parseError, setParseError] = useState(null)
  const { isValid, status, error, costOfSalesByYear, unclassifiedEmployees } = useCostTable()

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setStagedFile(selectedFile)
      setParseError(null)
    }
  }

  const handleRemove = () => {
    setStagedFile(null)
    setParseError(null)
    dispatch(resetCostTable())
  }

  const handleConfirm = async () => {
    if (!stagedFile) return

    try {
      const buffer = await stagedFile.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const excelData = {}
      workbook.SheetNames.forEach((sheetName) => {
        excelData[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
      })

      const { employees, production, premises } = adaptCostTableExcel(excelData)

      dispatch(setFileName(stagedFile.name))
      dispatch(setEmployees(employees))
      dispatch(setProduction(production))
      dispatch(setPremises(premises))
    } catch (err) {
      setParseError(`Error processing file: ${err.message}`)
    }
  }

  return (
    <div className="survey-page">
      <GenericHeader pageName="Cost Table" />
      <GenericSubheader subheader="Create Cost Table" />

      <div style={{ width: '70%', minWidth: '600px', maxWidth: '1000px', margin: '2rem auto' }}>

        {status === 'idle' && (
          <Card sx={{ borderRadius: '15px', border: 'solid #073a5a 1px' }}>
            <CardContent>
              <Box sx={{ border: '2px dashed #0077b6', borderRadius: 2, p: 4, textAlign: 'center', bgcolor: stagedFile ? '#e3f2fd' : '#f5f5f5' }}>
                {stagedFile ? (
                  <Box>
                    <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                    <Typography variant="h6">{stagedFile.name}</Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 60, color: '#0077b6', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Drop your Excel file here</Typography>
                    <input type="file" accept=".xlsx" onChange={handleFileSelect} style={{ display: 'none' }} id="cost-table-file-input" />
                    <label htmlFor="cost-table-file-input">
                      <Button variant="contained" component="span" sx={{ backgroundColor: '#eec60a', color: '#073a5a', fontWeight: 600 }}>
                        Select File
                      </Button>
                    </label>
                  </Box>
                )}
              </Box>

              {parseError && <Alert severity="error" sx={{ mt: 2 }}>{parseError}</Alert>}

              {stagedFile && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="outlined" onClick={handleRemove} sx={{ borderColor: '#073a5a', color: '#073a5a' }}>
                    Remove
                  </Button>
                  <Button variant="contained" onClick={handleConfirm} sx={{ backgroundColor: '#eec60a', color: '#073a5a', fontWeight: 600 }}>
                    Confirm
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            <Button variant="outlined" onClick={handleRemove} sx={{ borderColor: '#073a5a', color: '#073a5a' }}>
              Try another file
            </Button>
          </>
        )}

        {status === 'rejected' && (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            <Button variant="outlined" onClick={handleRemove} sx={{ borderColor: '#073a5a', color: '#073a5a' }}>
              Try another file
            </Button>
          </>
        )}

        {status === 'staging' && (
          <Card sx={{ borderRadius: '15px', border: 'solid #073a5a 1px' }}>
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No year zero record was found in <strong>{stagedFile?.name}</strong>.
                Add a Year Zero row to the Production sheet and confirm again.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={handleRemove} sx={{ borderColor: '#073a5a', color: '#073a5a' }}>
                  Remove
                </Button>
                <Button variant="contained" onClick={handleConfirm} sx={{ backgroundColor: '#eec60a', color: '#073a5a', fontWeight: 600 }}>
                  Confirm
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {status === 'no-employees' && (
          <Alert severity="warning">
            No registered employees were found. Complete the Empleados_2 sheet for this program before continuing.
          </Alert>
        )}

        {isValid && status === 'ready' && unclassifiedEmployees.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {unclassifiedEmployees.length} empleado{unclassifiedEmployees.length === 1 ? '' : 's'} sin categoría
            reconocida, no se contaron en la tabla: {unclassifiedEmployees.join(', ')}
          </Alert>
        )}

        {isValid && status === 'ready' && <CostOfSalesTable costOfSalesByYear={costOfSalesByYear} />}
      </div>
    </div>
  )
}

/**
 * Owns its Redux store so App.jsx stays provider-free (same pattern as the sims pages).
 * Requires an authenticated session, same gate used by SimCard's requireAuth sims.
 */
function CostTable() {
  const [store] = useState(() => createCostTableStore())
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/modules/cost-table' } })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <Provider store={store}>
      <CostTableContent />
    </Provider>
  )
}

export default CostTable
