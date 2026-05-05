import React from 'react'

function Right({ activePaper, handlePageChange }) {
    let text
    let changeValue
    if (activePaper === 2) {
        text = "Balance Sheet"
        changeValue = 3
    }
    else if (activePaper === 1) {
        text = "Income Statement"
        changeValue = 2
    }
    else if (activePaper === 3) {
        text = "Cashflows"
        changeValue = 1
    }

  return (
    <div className="right-container">
        <button className="side-button" onClick={() => handlePageChange(changeValue)}>
            <div className="text">
                {text}
            </div>
            <svg className='right-btn' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
        </button>
    </div>
  )
}

export default Right