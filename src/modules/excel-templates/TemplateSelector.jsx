import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Typography, 
  Button, 
  Box, 
  Chip, 
  CircularProgress, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { Download, Business, Factory, Store, Search, ArrowBack, HelpOutline, ExpandMore } from '@mui/icons-material'
import { generateTemplate, downloadBlob } from './api/templateGenerator'
import GenericHeader from '@/Global Components/GenericHeader'
import GenericSubheader from '@/Global Components/GenericSubheader'
import '@/styles/general.css'
import '@/styles/survey.css'

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
    language: 'Spanish',
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
    language: 'Spanish',
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
    language: 'Spanish',
    features: [
      'Point of sale tracking',
      'Inventory management',
      'Mexican tax structure',
    ],
    available: false, // Coming soon
  },
]

function TemplateBar({ template, onDownload, downloading, expanded, onChange }) {
  const Icon = template.icon
  const isDownloading = downloading === template.id

  return (
    <Accordion 
      expanded={expanded}
      onChange={onChange}
      sx={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        border: 'solid #073a5a 1px',
        mb: 2,
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          padding: '1rem 1.5rem',
          minHeight: '72px',
          '&.Mui-expanded': {
            minHeight: '72px',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
          <Icon sx={{ fontSize: 32, color: '#0077b6' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: '600', mb: 0.5 }}>
              {template.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={template.country} size="small" color="primary" />
              <Chip label={template.type} size="small" variant="outlined" />
              <Chip label={template.language} size="small" variant="outlined" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {template.available ? (
              <Button
                variant="contained"
                startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(template)
                }}
                disabled={isDownloading}
                sx={{
                  backgroundColor: '#eec60a',
                  color: '#073a5a',
                  fontWeight: '600',
                  padding: '0.5rem 1.5rem',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: '#d4b008',
                  },
                }}
              >
                {isDownloading ? 'Generating...' : 'Download'}
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                disabled
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                Coming Soon
              </Button>
            )}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
          {template.description}
        </Typography>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: '600', mb: 1 }}>
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
      </AccordionDetails>
    </Accordion>
  )
}

function TemplateSelector() {
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expanded, setExpanded] = useState(null)

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
    navigate('/templates/upload')
  }

  const handleGoHome = () => {
    navigate('/home')
  }

  const handleExpand = (templateId) => (event, isExpanded) => {
    setExpanded(isExpanded ? templateId : null)
  }

  // Filter templates based on selections
  const filteredTemplates = templates.filter(template => {
    const matchesCountry = selectedCountry === 'All' || template.country === selectedCountry
    const matchesType = selectedType === 'All' || template.type === selectedType
    const matchesLanguage = selectedLanguage === 'All' || template.language === selectedLanguage
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCountry && matchesType && matchesLanguage && matchesSearch
  })

  // Get unique values for dropdowns
  const countries = ['All', ...new Set(templates.map(t => t.country))]
  const types = ['All', ...new Set(templates.map(t => t.type))]
  const languages = ['All', ...new Set(templates.map(t => t.language))]

  return (
    <div className="survey-page">
      <GenericHeader pageName={"Excel Templates"} />
      <GenericSubheader subheader={"Browse Templates"} onOpenSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div style={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 11vh)', position: 'relative' }}>
        {/* Sidebar - Narrower */}
        <nav 
          className={`sidebar ${sidebarOpen ? '' : 'sidebar-hidden'}`} 
          style={{ 
            position: sidebarOpen ? 'sticky' : 'absolute', 
            top: '11vh', 
            left: 0, 
            zIndex: 100,
            width: sidebarOpen ? '12rem' : '0',
            minWidth: sidebarOpen ? '12rem' : '0',
          }}
        >
          <div className="sidebar-title" style={{ padding: '0.75rem 1rem' }}>
            <div className="title-icon" style={{ minWidth: '20px', height: '24px', fontSize: '0.9rem' }}>
              <Factory />
            </div>
            <div className="title-content">
              <div className="title-main" style={{ fontSize: '1rem' }}>Templates</div>
              <div className="title-sub" style={{ fontSize: '0.65rem' }}>Browse</div>
            </div>
          </div>
          
          <div 
            className="sidebar-entry" 
            onClick={handleGoHome} 
            style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', margin: '0 0.25rem' }}
          >
            <ArrowBack className="sidebar-icon" style={{ fontSize: '1rem' }} />
            <span style={{ fontSize: '0.85rem' }}>Back</span>
          </div>
          
          <div 
            className="sidebar-entry" 
            style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', margin: '0 0.25rem' }}
          >
            <HelpOutline className="sidebar-icon" style={{ fontSize: '1rem' }} />
            <span style={{ fontSize: '0.85rem' }}>Help</span>
          </div>
        </nav>

        {/* Main Content */}
        <div 
          style={{ 
            marginLeft: sidebarOpen ? '12rem' : '0', 
            width: sidebarOpen ? 'calc(100vw - 12rem)' : '100vw',
            height: 'calc(100vh - 11vh)',
            overflowY: 'auto',
            display: 'inline-block',
            fontFamily: "'Roboto', sans-serif",
            transition: 'margin-left 0.3s ease, width 0.3s ease',
          }}
        >
          <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Filters and Search */}
            <Box sx={{ 
              mb: 4, 
              backgroundColor: '#fff',
              borderRadius: '15px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              border: 'solid #073a5a 1px',
              padding: '1.5rem 2rem',
            }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: '#073a5a' }} />,
                  }}
                  sx={{ flexGrow: 1, minWidth: '200px' }}
                />
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    label="Country"
                  >
                    {countries.map(country => (
                      <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    label="Business Type"
                  >
                    {types.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    label="Language"
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Templates List - Horizontal Bars */}
            <Box>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TemplateBar
                    key={template.id}
                    template={template}
                    onDownload={handleDownload}
                    downloading={downloading}
                    expanded={expanded === template.id}
                    onChange={handleExpand(template.id)}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No templates found matching your criteria
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Upload Section */}
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              backgroundColor: '#fff',
              borderRadius: '15px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              border: 'solid #073a5a 1px',
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: '600' }}>
                Already have a filled template?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                If you've already filled out your template, you can upload it directly to generate your dashboard.
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleGoToUpload}
                sx={{
                  backgroundColor: '#eec60a',
                  color: '#073a5a',
                  fontWeight: '600',
                  '&:hover': {
                    backgroundColor: '#d4b008',
                  },
                }}
              >
                Go to Upload
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateSelector
