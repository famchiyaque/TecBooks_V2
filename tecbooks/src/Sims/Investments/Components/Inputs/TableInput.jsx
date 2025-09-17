import React from 'react'
import StyledWrapper from './StyledWrapper'

function TableInput({ func, flows, name }) {

    const callbackSecurity = (e, index) => {
        const newValue = e.target.value.replace(/\$/g, '')
        const newParsedValue = parseInt(newValue)
        let newFlows = [...flows]
        if (isNaN(newParsedValue)) {
            newFlows[index] = 0
        } else {
            newFlows[index] = newParsedValue
        }
        func(newFlows)
    }

  return (
    // <div className='flows-div'>
    <div>
        {/* <div className='flow-table'> */}
        <StyledWrapper>
            <table className="input-table">
                <tbody>
                    <tr>
                        {flows.map((value, index) => (
                        <td key={index} className="input-cell">
                            <input
                            type="text"
                            value={`$${value}`}
                            onChange={(e) => callbackSecurity(e, index)}
                            className="input-field"
                            style={{ width: '99%', padding: '0.15rem 0 0.15rem 4px' }}
                            />
                        </td>
                        ))}
                </tr>
                </tbody>
            </table>
        </StyledWrapper>
    </div>
  )
}

export default TableInput