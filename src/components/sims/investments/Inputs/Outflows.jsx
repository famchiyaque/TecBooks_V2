import React from 'react'
import StyledWrapper from './StyledWrapper'

function Outflows({ outflows, setOutflows }) {
  const changeInflows = (e, index) => {
    const value = e.target.value.replace(/\$/g, '')
    const newOutflow = parseInt(value)
    const newOutflows = [...outflows]
    if (isNaN(newOutflow)) {
      newOutflows[index] = 0
    } else {
      newOutflows[index] = newOutflow
    }
    setOutflows(newOutflows)
  }


  return (
    <StyledWrapper>
      <table className="input-table">
        <tbody>
          <tr>
            {outflows.map((value, index) => (
              <td key={index} className="input-cell">
                <input
                  type="text"
                  value={`$${value}`}
                  onChange={(e) => changeInflows(e, index)}
                  className="input-field"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </StyledWrapper>
  )
}

export default Outflows