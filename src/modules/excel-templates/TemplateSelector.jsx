import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Grid, Button, Box, Chip, CircularProgress } from '@mui/material'
import { Download, Business, Factory, Store, Restaurant } from '@mui/icons-material'
import { generateTemplate, downloadBlob } from './api/templateGenerator'
import '@/styles/general.css'

/**
 * Template Selector
 * 
 * Allows users to browse and download Excel templates for different business types.
 * Each template can have custom methods for fetching real-time data (inflation, PTU, etc.)
 */

const templates = [
  {
    id: 'manufacturing-mexico',
    name: 'Manufacturing Business - Mexico',
    description: 'Comprehensive template for manufacturing businesses in Mexico. Includes production costs, inventory management, and Mexican tax considerations.',
    icon: Factory,
    country: 'Mexico',
    type: 'Manufacturing',
    features: [
      'Real-time inflation rate',
      'PTU (Profit Sharing) calculations',
      'Production cost tracking',
      'Inventory management',
      'Mexican tax structure',
    ],
    available: true,
    fileName: 'manufacturing-mexico-template.xlsx',
  },
  {
    id: 'services-mexico',
    name: 'Services Business - Mexico',
    description: 'Template for service-based businesses in Mexico.',
    icon: Business,
    country: 'Mexico',
    type: 'Services',
    features: [
      'Service revenue tracking',
      'Professional fees',
      'Mexican tax structure',
    ],
    available: false, // Coming soon
  },
  {
    id: 'retail-mexico',
    name: 'Retail Business - Mexico',
    description: 'Template for retail businesses in Mexico.',
    icon: Store,
    country: 'Mexico',
    type: 'Retail',
    features: [
      'Point of sale tracking',
      'Inventory management',
      'Mexican tax structure',
    ],
    available: false, // Coming soon
  },
]

function TemplateCard({ template, onDownload, downloading }) {
  const Icon = template.icon
  const isDownloading = downloading === template.id

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ fontSize: 40, color: '#0077b6', mr: 2 }} />
          <Box>
            <Typography variant="h6" component="div">
              {template.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip label={template.country} size="small" color="primary" />
              <Chip label={template.type} size="small" variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {template.description}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Features:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {template.features.map((feature, index) => (
            <li key={index}>
              <Typography variant="body2" color="text.secondary">
                {feature}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        {template.available ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
              onClick={() => onDownload(template)}
              disabled={isDownloading}
              fullWidth
            >
              {isDownloading ? 'Generating...' : 'Download Template'}
            </Button>
          </Box>
        ) : (
          <Button variant="outlined" disabled fullWidth>
            Coming Soon
          </Button>
        )}
      </Box>
    </Card>
  )
}

function TemplateSelector() {
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(null)

  const handleDownload = async (template) => {
    console.log('[TemplateSelector] Downloading template:', template.id)
    setDownloading(template.id)
    
    try {
      // Generate template with real-time data
      const blob = await generateTemplate(template.id)
      
      // Trigger download
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${template.id}-${timestamp}.xlsx`
      downloadBlob(blob, filename)
      
      console.log('[TemplateSelector] Template downloaded successfully')
    } catch (error) {
      console.error('[TemplateSelector] Error downloading template:', error)
      
      // Fallback to static file
      console.log('[TemplateSelector] Falling back to static template')
      const link = document.createElement('a')
      link.href = `/templates/${template.fileName}`
      link.download = template.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setDownloading(null)
    }
  }

  const handleGoToUpload = () => {
    navigate('/tecbooks/template-upload')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
          Excel Templates
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Download a template tailored to your business type and country
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Each template includes real-time data integration and is customized for local regulations and requirements.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <TemplateCard 
              template={template} 
              onDownload={handleDownload}
              downloading={downloading}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Already have a filled template?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If you've already filled out your template, you can upload it directly to generate your dashboard.
        </Typography>
        <Button variant="outlined" onClick={handleGoToUpload}>
          Go to Upload
        </Button>
      </Box>
    </div>
  )
}

export default TemplateSelector
