import React from 'react'
import './../../styles/investments.css'
import './../../styles/homepage.css'
import background from './../Novus Components/invest-landing-good.jpg'
import { useSimData } from '../SimDataContext'
import Loader from '../Novus Components/Loader'
import { useNavigate } from 'react-router-dom'
 
function Landing() {
    const navigate = useNavigate()

    const { simData, isLoading, error } = useSimData()

    if (isLoading) return <Loader />

  return (
    <div className='landing-main' style={{ backgroundImage: `url(${background})` }}>
        <div className='landing-info'>
            <h2>Investments</h2>
            <p>Explore new opportunities for your business with our invesment calculator.
            </p>
            <p>Generate important metrics like <b>Net Present Value</b> and 
            <b> Internal Rate of Return</b> for your potential projects</p>
            <button className='info-btn' onClick={() => navigate('/novus-dashboard/investments/simulator')}>
                Start Calculator
            </button>
        </div>
        {/* <h1>Investments</h1>
        <p>Explore new opportunities for your business with our investment calculator. 
            Tell us about the kind of project you want to assess and we'll do the rest.
        </p> */}
        {/* <div className='landing-flex'>
            <div>

            </div>
            <div>
                <img src={`${process.env.PUBLIC_URL}/invest-calc.jpg`} alt="img"  />
            </div>
        </div> */}
    </div>
  )
}

export default Landing