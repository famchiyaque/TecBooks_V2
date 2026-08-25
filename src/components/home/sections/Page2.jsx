import { Typography } from '@mui/material'
import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { useNavigate } from 'react-router-dom'

function Page2() {
  const navigate = useNavigate()

  const goToMxRep = () => {
    navigate('/mxrep')
  }

  return (
    <div className='page-container page-1' id="mxrep-page">
      <div className='more-a'>MxRep Integration</div>
      <div className='mxrep-container'>
          <div className='mxrep-top'>
            <div className='mxrep-top-left'>
              <Typography variant='h4' sx={{ fontWeight: '700', color: '#073a5a' }}>Generate</Typography>
              <Typography sx={{ fontWeight: '500', fontSize: '1rem', lineHeight: '1.6', mt: 1 }}>
                Connect your production line simulation directly to TECBooks. Generate comprehensive
                financial dashboards from your MxRep data automatically.
              </Typography>
              <button className='learn-more' style={{ marginTop: '1rem', color: '#073a5a', borderColor: '#073a5a' }}>
                <a className='a-btn' href='http://10.97.85.98' target='_blank' rel="noreferrer"
                style={{ paddingTop: '0.5rem' }}
                >
                  Go to MxRep Simulator
                </a>
                <EastIcon className='landing-learn-btn' sx={{ fill: '#073a5a' }} />
              </button>
            </div>
            <div className='mxrep-arrow'>
              <svg width="140%" height="100%" viewBox="0 0 280 115">
                <path d="M10,100 A90,90 0 0,1 190,100"
                      stroke="#073a5a"
                      strokeWidth="4"
                      strokeDasharray="10,10"
                      fill="transparent" />
                
                <polygon points="200,100 180,100 190,115"
                        fill="#073a5a" />
              </svg>
            </div>
            <div className='mxrep-top-right'>
              <Typography variant='h4' sx={{ fontWeight: '700', color: '#073a5a' }}>Optimize</Typography>
              <Typography sx={{ fontWeight: '500', fontSize: '1rem', lineHeight: '1.6', mt: 1 }}>
                Leverage efficiency metrics, bottleneck analysis, statistical forecasts, 
                and advanced analytics to optimize your production operations.
              </Typography>
              <button className='learn-more' style={{ marginTop: '1rem', color: '#073a5a', borderColor: '#073a5a' }}>
                <a className='a-btn' onClick={goToMxRep} target='_blank' rel="noreferrer"
                style={{ paddingTop: '0.5rem' }}
                >
                  Explore MxRep Dashboard
                </a>
                <EastIcon className='landing-learn-btn' sx={{ fill: '#073a5a' }} />
              </button>
            </div>
          </div>
          <div className='mxrep-bottom'>
            <img src={'/imgs/mxrep_img.png'} alt="MxRep Dashboard" />
            <img src={'/imgs/prod_line_img.png'} alt="Production Line" />
          </div>
            
      </div>
    </div>
  )
}

export default Page2