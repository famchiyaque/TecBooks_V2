import React from 'react'
import StyledWrapper from './StyledWrapper'

const DiscountRate = ({ discountRate, setDiscountRate }) => {
  // const lifetimeOG = discountRate

  const changeDiscountRate = (e) => {
    const value = e.target.value.replace(/\%/g, '');

    if (value == "") {
      setDiscountRate(0)
    } else {
      const newRate = parseInt(value)
      if (!isNaN(newRate)) {
        if (newRate < 0) setDiscountRate(0)
        else setDiscountRate(newRate)
      } 
    }
  }

  return (
    <StyledWrapper style={{ flexBasis: '12%' }}>
      <p className="input-container">
        <input type="text" value={`${discountRate}%`} name="text" id="text" className="input-field" 
        onChange={changeDiscountRate} style={{ textAlign: 'right', width: '99%', paddingRight: '3px' }} />
        {/* <label className="input-label" htmlFor="text">Discount Rate</label> */}
      </p>
    </StyledWrapper>
  );
}

export default DiscountRate
