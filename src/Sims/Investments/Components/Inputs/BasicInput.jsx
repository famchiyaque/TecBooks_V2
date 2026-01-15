import React from 'react'
import StyledWrapper from './StyledWrapper'

function BasicInput({ func, value, name }) {

    const callbackSecurity = (e) => {
        const newValue = e.target.value
        switch(name) {
            case 'Project':
                func(newValue.trim());
                break
            case 'Lifetime':
                if (newValue === '') {
                    func(''); // keep input empty temporarily
                    break;
                }
            
                const parsedInt = parseInt(newValue, 10);
            
                if (isNaN(parsedInt)) {
                    func(0);
                } else if (parsedInt >= 20) {
                    func(20);
                } else {
                    func(parsedInt);
                }
                break;
            case 'Initial Investment':
                {
                    const parsedInt = parseInt(newValue, 10);
                    func(isNaN(parsedInt) ? 0 : parsedInt);
                }
                break
            case 'Discount Rate':
                {
                    const parsedFloat = parseFloat(newValue);
                    func(isNaN(parsedFloat) ? 0 : parsedFloat);
                }
                break
            default:
                console.warn(`Unhandled input name: ${name}`)
                break
        }
    }

  return (
    <StyledWrapper style={{ flexBasis: '25%' }}>
        <p className="input-container" style={{ width: '100%', textAlign: 'left', height: '80%' }} >
            <input type="text" value={value} name={name} className="input-field" 
                onChange={callbackSecurity} style={{ width: '99%', padding: '0.15rem 0 0.15rem 4px' }} />
        </p>
    </StyledWrapper>
  )
}

export default BasicInput