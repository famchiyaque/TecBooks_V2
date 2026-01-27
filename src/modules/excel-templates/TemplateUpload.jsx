import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box, Alert } from '@mui/material'
import { CloudUpload, CheckCircle } from '@mui/icons-material'
import * as XLSX from 'xlsx'
import { adaptExcelToBusinessModel } from '@/core/adapters/ExcelAdapter'
import '@/styles/general.css'

/**
 * Template Upload
 * 
 * Allows users to upload filled Excel templates.
 * Processes the Excel file through the adapter and navigates to the dashboard.
 */
function TemplateUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Read the Excel file
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)

      // Convert sheets to JSON
      const excelData = {}
      workbook.SheetNames.forEach(sheetName => {
        excelData[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
      })

      console.log('[TemplateUpload] Excel data loaded:', Object.keys(excelData))

      // Transform to canonical business model using adapter
      const businessModel = adaptExcelToBusinessModel(excelData)

      console.log('[TemplateUpload] Business model created:', businessModel)

      // Navigate to dashboard with the business model
      navigate('/dashboard', { state: { businessModel } })
    } catch (err) {
      console.error('[TemplateUpload] Error processing file:', err)
      setError(`Error processing file: ${err.message}`)
      setUploading(false)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Please drop an Excel file (.xlsx)')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
          Upload Your Template
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload your filled Excel template to generate your financial dashboard
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed #0077b6',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              bgcolor: file ? '#e3f2fd' : '#f5f5f5',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                bgcolor: '#e3f2fd',
              },
            }}
          >
            {file ? (
              <Box>
                <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 60, color: '#0077b6', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drop your Excel file here
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  or click to browse
                </Typography>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button variant="outlined" component="span">
                    Select File
                  </Button>
                </label>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            {file && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFile(null)
                    setError(null)
                  }}
                  disabled={uploading}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={uploading ? null : <CloudUpload />}
                >
                  {uploading ? 'Processing...' : 'Generate Dashboard'}
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3cd', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          📝 Before uploading:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <Typography variant="body2">
              Make sure you've filled out all required fields in the template
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Save your Excel file before uploading
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Only .xlsx files are supported
            </Typography>
          </li>
        </ul>
      </Box>
    </div>
  )
}

export default TemplateUpload
