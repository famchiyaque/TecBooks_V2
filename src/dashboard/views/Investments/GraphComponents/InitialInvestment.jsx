import React from 'react'
import StyledWrapper from './StyledWrapper'

function InitialInvestment({ initialInvestment, setInitialInvestment }) {
  const changeInitialInvCallback = (e) => {
    const value = e.target.value.replace(/\$/g, '')
    if (value == "") {
      setInitialInvestment(0)
    } else {
      const newInvestment = parseInt(value)
      if (!isNaN(value)) {
        setInitialInvestment(newInvestment)
      } 
    }
  }

  return (
    <StyledWrapper style={{ flexBasis: '18%' }}>
      <p className="input-container" style={{ width: '100%', textAlign: 'left'}}>
        <input type="text" value={`$${initialInvestment}`} name="text" id="text" className="input-field" 
        onChange={changeInitialInvCallback} style={{ width: '90%', paddingLeft: '4px'}} />
      </p>
    </StyledWrapper>
  )
}

export default InitialInvestment