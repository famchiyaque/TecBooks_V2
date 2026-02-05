import React from 'react'
import { Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import QuizIcon from '@mui/icons-material/Quiz'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

function Page1() {
    const navigate = useNavigate()

    const goToTemplates = () => {
        navigate("/modules/templates")
    }

    const goToSurvey = () => {
        navigate("/modules/custom-excel")
    }

    const goToTemplateUpload = () => {
        navigate("/modules/templates/upload")
    }

    return (
      <div className="page-container blue-page" id="tecbooks-page">
        <div className='page-topper'>for independent users and businesses</div>
        
        <Box sx={{ textAlign: 'center', px: '5vw', pt: '5vh' }}>
            <Typography variant="h3" sx={{ fontWeight: '700', mb: 2, color: '#073a5a' }}>
                Universal Financial Dashboard
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: '400', mb: 1, color: '#073a5a', maxWidth: '900px', mx: 'auto' }}>
                One powerful dashboard. Multiple ways to provide your data.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: '400', mb: 4, color: '#555', maxWidth: '900px', mx: 'auto' }}>
                Choose the method that best fits your business structure and workflow.
            </Typography>
        </Box>

        {/* Central Dashboard Visualization */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
            <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 2, 
                backgroundColor: '#073a5a', 
                color: 'white',
                padding: '1.5rem 3rem',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}>
                <DashboardIcon sx={{ fontSize: '3rem' }} />
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h5" sx={{ fontWeight: '700' }}>
                        Your Financial Dashboard
                    </Typography>
                    <Typography variant="body2">
                        IRR • NPV • ROI • Cashflow • Financial Statements
                    </Typography>
                </Box>
            </Box>
            
            <ArrowDownwardIcon sx={{ fontSize: '2.5rem', my: 2, color: '#073a5a' }} />
            
            <Typography variant="h6" sx={{ fontWeight: '600', color: '#073a5a', mb: 1 }}>
                Choose Your Data Input Method
            </Typography>
        </Box>

        {/* Input Methods Grid */}
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            width: '90%',
            maxWidth: '1200px',
            margin: '0 auto',
            pb: 4
        }}>
            {/* Excel Template Method */}
            <Box className='input-method-card'>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ fontSize: '4rem', color: '#217346' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: '700', mb: 1, textAlign: 'center' }}>
                    Pre-Built Templates
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', minHeight: '80px' }}>
                    Download ready-to-go Excel templates designed for specific business types. Fill them out with your numbers and upload.
                </Typography>
                <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.5)', 
                    borderRadius: '10px', 
                    p: 2, 
                    mb: 2,
                    minHeight: '100px'
                }}>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block', mb: 1 }}>
                        ✓ Work offline
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block', mb: 1 }}>
                        ✓ Industry-specific models
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block' }}>
                        ✓ Proven accounting structures
                    </Typography>
                </Box>
                <button className='landing-btn' style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem' }} onClick={goToTemplates}>
                    Browse Templates
                </button>
            </Box>

            {/* Custom Excel Builder Method */}
            <Box className='input-method-card'>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <QuizIcon sx={{ fontSize: '4rem', color: '#0492c2' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: '700', mb: 1, textAlign: 'center' }}>
                    Custom Excel Builder
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', minHeight: '80px' }}>
                    Define your business structure through guided questions. We'll generate a custom Excel file tailored to your specific needs.
                </Typography>
                <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.5)', 
                    borderRadius: '10px', 
                    p: 2, 
                    mb: 2,
                    minHeight: '100px'
                }}>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block', mb: 1 }}>
                        ✓ Fully customizable structure
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block', mb: 1 }}>
                        ✓ Define your own accounts
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block' }}>
                        ✓ Flexible business modeling
                    </Typography>
                </Box>
                <button className='landing-btn' style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem' }} onClick={goToSurvey}>
                    Build Custom Excel
                </button>
            </Box>

            {/* Future ERP Simulator Method */}
            <Box className='input-method-card' sx={{ opacity: 0.7, position: 'relative' }}>
                <Box sx={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px',
                    backgroundColor: '#eec60a',
                    color: '#073a5a',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '5px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                }}>
                    COMING SOON
                </Box>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <TouchAppIcon sx={{ fontSize: '4rem', color: '#666' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: '700', mb: 1, textAlign: 'center' }}>
                    ERP Simulator
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', minHeight: '80px' }}>
                    Full in-app ERP simulator. Register transactions, manage inventory, track accounts - all within the application with no Excel files.
                </Typography>
                <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.5)', 
                    borderRadius: '10px', 
                    p: 2, 
                    mb: 2,
                    minHeight: '100px'
                }}>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block', mb: 1 }}>
                        ✓ Full ERP functionality
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block', mb: 1 }}>
                        ✓ Transaction-level control
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: '600', display: 'block' }}>
                        ✓ Completely Excel-free
                    </Typography>
                </Box>
                <button className='landing-btn' style={{ width: '100%', padding: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }} disabled>
                    Coming Soon
                </button>
            </Box>
        </Box>

        {/* Upload Section */}
        <Box sx={{ 
            textAlign: 'center', 
            my: 5, 
            py: 4, 
            px: '5vw',
            backgroundColor: 'rgba(7, 58, 90, 0.05)',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '1200px',
            margin: '3rem auto'
        }}>
            <Typography variant="h4" sx={{ fontWeight: '700', mb: 2, color: '#073a5a' }}>
                Already Have Your Excel File?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
                If you've already filled out a template or custom Excel file, upload it here to generate your dashboard.
            </Typography>
            <button className='landing-btn' style={{ padding: '1rem 3rem', fontSize: '1.1rem' }} onClick={goToTemplateUpload}>
                Upload Excel File
            </button>
        </Box>

        {/* What You'll Get Section */}
        <Box sx={{ 
            padding: '3rem 5vw', 
            marginTop: '3rem', 
            backgroundColor: 'rgba(7, 58, 90, 0.1)',
            borderTop: '2px solid rgba(7, 58, 90, 0.2)'
        }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#073a5a' }}>
                What's Included in Your Dashboard
            </Typography>
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <Box className='dashboard-feature'>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>📊 Project Evaluation</Typography>
                    <Typography variant="body2">IRR, NPV, ROI, Payback Period, Break-even Analysis</Typography>
                </Box>
                <Box className='dashboard-feature'>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>💰 Cashflow Projections</Typography>
                    <Typography variant="body2">Monthly cashflow tracking, forecasts, and trend analysis</Typography>
                </Box>
                <Box className='dashboard-feature'>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>📈 Financial Statements</Typography>
                    <Typography variant="body2">Income Statement, Balance Sheet, Cash Flow Statement</Typography>
                </Box>
                <Box className='dashboard-feature'>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>🔮 Statistical Forecasting</Typography>
                    <Typography variant="body2">Predictive analytics and financial projections</Typography>
                </Box>
            </Box>
        </Box>
      </div>
    )
}

export default Page1
