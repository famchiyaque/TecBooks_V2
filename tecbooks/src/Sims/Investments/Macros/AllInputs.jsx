import React, { useState, useEffect } from 'react'
import Lifetime from '../GraphComponents/Lifetime'
import InitialInvestment from '../GraphComponents/InitialInvestment'
import DiscountRate from '../GraphComponents/DiscountRate'
import Inflows from '../GraphComponents/Inflows'
import Outflows from '../GraphComponents/Outflows'
import ProjectType from '../GraphComponents/ProjectType'
// import Loader from '../../Novus Components/Loader'
import axios from 'axios'

function AllInputs({ inputs, funcs }) {
    const api_key = 'b86afe5666msh410c2ed2d3d8a1fp150b79jsnfcad51eb0f9d'
    const [monthInflation, setMonthInflation] = useState(0.06)
    const [yearInflation, setYearInflation] = useState(4.54)
    const [cetes, setCetes] = useState(11)

    useEffect(() => {
        const fetchInflationData = async () => {
          const country = 'mexico'
          const api_url = `https://api.api-ninjas.com/v1/inflation?country=${country}`
    
          try {
            const response = await axios.get(api_url, {
              headers: {
                'X-RapidAPI-Key': api_key,
                'X-RapidAPI-Host': 'city-by-api-ninjas.p.rapidapi.com'
              }
            })
            console.log(response.data)
            const data = response.data
            setMonthInflation(data.monthly_rate_pct)
            setYearInflation(data.yearly_rate_pct)
          } catch (error) {
            console.error('Error fetching inflation data:', error)
          }
        }
    
        // fetchInflationData()
      }, [])

  return (
    <div className='all-inputs-container'>
            <div className='simple-and-apis'>
              <div className='simple-titles-flex'>
                <p style={{ flexBasis: '25%' }}>Project Type</p>
                <p style={{ flexBasis: '10%' }}>Lifetime</p>
                <p style={{ flexBasis: '18%' }}>Initial Investment</p>
                <p style={{ flexBasis: '13%' }}>Discount Rate</p>
                <p style={{ flexBasis: '13%' }}>Mex Inflation</p>
                <p style={{ flexBasis: '10%' }}>Cetes</p>
              </div>
              <div className='simple-inputs-flex'>
                <ProjectType projectType={inputs.projectType} setProjectType={funcs.setProjectType} />
                <Lifetime lifetime={inputs.lifetime} setLifetime={funcs.setLifetime} />
                <InitialInvestment initialInvestment={inputs.initialInvestment} setInitialInvestment={funcs.setInitialInvestment} />
                <DiscountRate discountRate={inputs.discountRate} setDiscountRate={funcs.setDiscountRate} />
                
                <div className='inflation'>
                    {monthInflation && yearInflation ? (
                        <p style={{ maxHeight: '90%', margin: '0', borderBottom: 'solid rgb(50, 50, 80) 1px' }}>
                            {yearInflation}
                            <span className='inflation-change' style={{ color: `${monthInflation >= 0 ? 'green' : 'red'}` }}>
                            {monthInflation >= 0 ? '+' : '-'}
                            {monthInflation}</span>    
                        </p>
                        // `${yearInflation} +${monthInflation}` 
                    ) : ( 
                        <Loader style={{ width: '100%' }} />
                    )}
                </div>
                <div className='cetes' style={{ borderBottom: 'solid rgb(50, 50, 80) 1px' }}>
                    {cetes}%
                </div>
              </div>
            </div>
            
            <div className='table-inputs-flex '>
              <div className='flows-div'>
                <p className='flows-titles'>Projected Inflows: </p>
                <div className='flow-table'>
                  <Inflows inflows={inputs.inflows} setInflows={funcs.setInflows} />
                </div>
              </div>
              <div className='flows-div'>
                <p className='flows-titles' >Projected Outflows: </p>
                <div className='flow-table'>
                  <Outflows outflows={inputs.outflows} setOutflows={funcs.setOutflows} />
                </div>
              </div>
            </div>
          </div>
  )
}

export default AllInputs