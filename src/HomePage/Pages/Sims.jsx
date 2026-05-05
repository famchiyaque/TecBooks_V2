import React from 'react'
import { Typography } from '@mui/material'
import SimCard from '../Comps/SimCard'

function SimsPage() {

  return (
    <div className="page-container blue-page" id="sims-page">
        <div className='page-topper'>interactive learning tools</div>
        <div className='sims-container'>
          <Typography variant='h3' sx={{ fontWeight: '700', padding: '0 0 0.5rem 0', color: '#073a5a' }}>
            Educational Simulators
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: '400', padding: '0 0 2rem 0', color: '#073a5a', opacity: 0.8 }}>
            Practice financial decision-making in a risk-free environment
          </Typography>
          <div className='sims-grid'>
            <SimCard
              title={"Project Evaluation"}
              img_path={"landing-proj-eval.png"}
              desc={"Create, save, and compare the financial returns of your potential projects and investment opportunities."}
              sim_route={"/sims/project-evaluation"}
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
            />
            <SimCard
              title={"Sales Forecaster"}
              img_path={"forecasts-sim.png"}
              desc={"Make and compare sales forecasts with various different models using your own data or built-in methods."}
              sim_route={"/sims/forecasting"}
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
            />
          </div>
        </div>
    </div>
  )
}

export default SimsPage