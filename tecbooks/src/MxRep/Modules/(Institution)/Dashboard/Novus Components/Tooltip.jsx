import React, { useState } from 'react'
import '../../styles/tooltip.css'

function Tooltip({ title, content, children }) {
  const [visible, setVisible] = useState(false)

  const showTooltip = () => setVisible(true)
  const hideTooltip = () => setVisible(false)

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div className="tooltip-container">
          <div className="tooltip-title">{title}</div>
          <div className="tooltip-content">{content}</div>
        </div>
      )}
    </div>
  )
}

export default Tooltip;
