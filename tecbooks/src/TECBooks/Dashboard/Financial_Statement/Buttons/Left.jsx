import React from 'react'

function Left({ activePaper, handlePageChange }) {
    let text
    let changeValue
    if (activePaper === 2) {
        text = "Cashflows"
        changeValue = 1
    }
    else if (activePaper === 1) {
        text = "Balance Sheet"
        changeValue = 3
    }
    else if (activePaper === 3) {
        text = "Income Statement"
        changeValue = 2
    }

  return (
    <div className="left-container">
        {/* From Uiverse.io by reshades */}
        <button className="side-button" onClick={() => handlePageChange(changeValue)}>
            <svg className='left-btn' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12H4.5m0 0l6.75 6.75M4.5 12l6.75-6.75"></path>
            </svg>
            <div className="text">
              {text}
            </div>
        </button>
    </div>
  )
}

export default Left