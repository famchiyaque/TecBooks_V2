import React from 'react'
import StyledWrapper from './StyledWrapper'

function Inflows({ inflows, setInflows }) {
  const changeInflows = (e, index) => {
    const value = e.target.value.replace(/\$/g, '')
    const newInflow = parseInt(value)
    let newInflows = [...inflows]
    if (isNaN(newInflow)) {
      newInflows[index] = 0
    } else {
      newInflows[index] = newInflow
    }
    setInflows(newInflows)
  }


  return (
    <StyledWrapper>
      <table className="input-table">
        <tbody>
          <tr>
            {inflows.map((value, index) => (
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

export default Inflows