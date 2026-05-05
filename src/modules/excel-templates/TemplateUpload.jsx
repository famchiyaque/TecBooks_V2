import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box, Alert } from '@mui/material'
import { CloudUpload, CheckCircle } from '@mui/icons-material'
import * as XLSX from 'xlsx'
import { adaptExcelToBusinessModel, adaptMexicoManufacturingToBusinessModel } from '@/core/adapters'
import GenericHeader from '@/components/global/GenericHeader'
import GenericSubheader from '@/components/global/GenericSubheader'
import '@/styles/general.css'
import '@/styles/survey.css'

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

      // Detect template type and use appropriate adapter
      let businessModel;
      
      // Check if this is the Mexico Manufacturing template (has Welcome sheet)
      if (excelData.Welcome || excelData['Welcome']) {
        console.log('[TemplateUpload] Detected Mexico Manufacturing template');
        businessModel = adaptMexicoManufacturingToBusinessModel(excelData);
      } else {
        // Fallback to generic Excel adapter for other templates
        console.log('[TemplateUpload] Using generic Excel adapter');
        businessModel = adaptExcelToBusinessModel(excelData);
      }

      console.log('[TemplateUpload] Business model created:', businessModel)
      console.log('[TemplateUpload] Business model metadata:', businessModel?.metadata)
      console.log('[TemplateUpload] Business model keys:', Object.keys(businessModel || {}))

      // Store business model in sessionStorage for reliable transfer
      try {
        const modelString = JSON.stringify(businessModel)
        sessionStorage.setItem('currentBusinessModel', modelString)
        console.log('[TemplateUpload] Business model stored in sessionStorage, size:', modelString.length, 'chars')
        
        // Verify storage
        const stored = sessionStorage.getItem('currentBusinessModel')
        if (stored) {
          console.log('[TemplateUpload] Verified: Model successfully stored')
        } else {
          console.error('[TemplateUpload] ERROR: Model was not stored!')
          setError('Failed to store business model')
          setUploading(false)
          return
        }
      } catch (err) {
        console.error('[TemplateUpload] Error storing model:', err)
        setError(`Error storing business model: ${err.message}`)
        setUploading(false)
        return
      }

      // Navigate to dashboard
      navigate('/dashboard/project-evaluation')
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
    <div className="survey-page">
      <GenericHeader pageName={"Excel Templates"} />
      <GenericSubheader subheader={"Upload Template"} />
      
      <div className="survey-card" style={{ width: '60%', minWidth: '600px', maxWidth: '800px' }}>
        <div className='icon-title'>
          <img src={'/imgs/site-icon-hd.png'} className='survey-icon' alt="TECBooks" />
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Upload Your Template</Typography>
        </div>
        
        <div className='card-desc'>
          <Typography variant='h6'>Upload your filled Excel template to generate your financial dashboard</Typography>
        </div>

        <Card sx={{ 
          mt: 3,
          backgroundColor: '#fff',
          borderRadius: '15px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          border: 'solid #073a5a 1px',
        }}>
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
                    <Button 
                      variant="contained" 
                      component="span"
                      sx={{
                        backgroundColor: '#eec60a',
                        color: '#073a5a',
                        fontWeight: '600',
                        padding: '0.6rem 1.5rem',
                        '&:hover': {
                          backgroundColor: '#d4b008',
                        },
                      }}
                    >
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
                    sx={{
                      borderColor: '#073a5a',
                      color: '#073a5a',
                      '&:hover': {
                        borderColor: '#073a5a',
                        backgroundColor: 'rgba(7, 58, 90, 0.1)',
                      },
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={uploading}
                    startIcon={uploading ? null : <CloudUpload />}
                    sx={{
                      backgroundColor: '#eec60a',
                      color: '#073a5a',
                      fontWeight: '600',
                      padding: '0.6rem 1.5rem',
                      '&:hover': {
                        backgroundColor: '#d4b008',
                      },
                    }}
                  >
                    {uploading ? 'Processing...' : 'Generate Dashboard'}
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: '#fff3cd', 
          borderRadius: '10px',
          border: 'solid #ffc107 1px',
        }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
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
    </div>
  )
}

export default TemplateUpload
