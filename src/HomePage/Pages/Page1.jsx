import React from 'react'
import { Typography } from '@mui/material'
import EastIcon from '@mui/icons-material/East'
import { useNavigate } from 'react-router-dom'

function Page1() {
    const navigate = useNavigate()

    const goToTemplates = () => {
        navigate("/templates")
    }

    const goToSurvey = () => {
        navigate("/tecbooks/survey")
    }

    const goToTemplateUpload = () => {
        navigate("/templates/upload")
    }

    return (
      <div className="page-container blue-page" id="tecbooks-page">
        <div className='page-topper'>for independent users and/or businesses</div>
        <Typography className='page-main-title'
            sx={{ fontWeight: '600', paddingLeft: '10vw', fontSize: '2.5rem' }}>
                Project Evaluation & Financial Dashboard
        </Typography>
        
        <div className='template-flex'>
            <div className='template-1'>
                <div>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.8rem' }}>Choose Template</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
                        Download an Excel template tailored to your business type and country
                    </Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={'/imgs/excel_icon.png'} style={{ boxShadow: 'none', width: '60%' }} />
                </div>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <button className='landing-btn smaller' style={{ marginLeft: '10%' }} onClick={goToTemplates}>
                        Browse Templates
                    </button>
                </div>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
                    Manufacturing, Services, Retail & more
                </Typography>
            </div>
            
            <div className='temp-arrow'>
                <EastIcon sx={{ fontSize: '2rem' }} /> 
            </div>
            
            <div className='template-2'>
                <div>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.8rem' }}>Fill Out</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
                        your template with your business's financial data and projections
                    </Typography>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <img src={'/imgs/surveyor_landing.png'} style={{ boxShadow: 'none', width: '35%' }} />
                </div>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary' }}>
                    Or use our in-app questionnaire
                </Typography>
                <div style={{ width: '100%', textAlign: 'center', mt: 1 }}>
                    <button className='landing-btn smaller' style={{ fontSize: '0.8rem' }} onClick={goToSurvey}>
                        Start Questionnaire
                    </button>
                </div>
                <a className='credits-a' href="https://www.freepik.com/icon/survey_2222295">Icon by Freepik</a>    
            </div>
            
            <div className='temp-arrow'>
                <EastIcon sx={{ fontSize: '2rem' }} />
            </div> 
            
            <div className='template-3'>
                <img src={'/imgs/submit_landing.png'} style={{ boxShadow: 'none', width: '35%', margin: '0 auto' }} />
                <div>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.8rem' }}>Generate Dashboard</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
                        Upload your template to generate IRR, NPV, ROI, cashflow projections, and financial statements
                    </Typography>
                </div>
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <button className='landing-btn smaller' 
                        style={{ marginRight: '10%' }}
                        onClick={goToTemplateUpload}>
                        Upload Template
                    </button>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 'x-small' }}>Already filled your template? Upload it here!</Typography>
                </div>
                <a className='credits-a' href="https://www.freepik.com/icon/submit_2601814">Icon by Freepik</a>
            </div>
        </div>

        <div style={{ padding: '2rem 10vw', marginTop: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                What You'll Get
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600 }}>📊 Project Evaluation</Typography>
                    <Typography variant="body2">IRR, NPV, ROI, Break-even Analysis</Typography>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600 }}>💰 Cashflow Projections</Typography>
                    <Typography variant="body2">Monthly cashflow tracking & forecasts</Typography>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600 }}>📈 Financial Statements</Typography>
                    <Typography variant="body2">Income, Balance Sheet, Cash Flow</Typography>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600 }}>🔮 Forecasting</Typography>
                    <Typography variant="body2">Statistical projections & trends</Typography>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Page1
