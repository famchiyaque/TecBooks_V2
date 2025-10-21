import React from 'react'
import StyledWrapper from './StyledWrapper'

const Lifetime = ({ lifetime, setLifetime }) => {
  // const lifetimeOG = lifetime

  const changeLifetimeCallback = (e) => {
    const value = e.target.value.replace(/\ yrs/g, '');
    if (value == "") {
      setLifetime(0)
    } else {
      const newLifetime = parseInt(value)
      if (!isNaN(newLifetime)) {
        if (newLifetime > 20) setLifetime(20)
        else setLifetime(newLifetime)
      } 
    }
  }


  return (
    <StyledWrapper style={{ flexBasis: '10%' }}>
      <p className="input-container" style={{ width: '100%', textAlign: 'right' }}>
        <input type="text" value={`${lifetime} yrs`} name="text" id="text" className="input-field" 
        onChange={changeLifetimeCallback} style={{ width: '90%', paddingRight: '5px' }} />
      </p>
    </StyledWrapper>
  );
}

export default Lifetime
