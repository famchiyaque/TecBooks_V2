import React from 'react'
import StyledWrapper from './StyledWrapper'

function ProjectType({ projectType, setProjectType}) {
  const changeProjTypeCallback = (e) => {
    if (e.target.value == "") {
      setProjectType("")
    } else {
      setProjectType(e.target.value)
    }
  }

  return (
      <StyledWrapper style={{ flexBasis: '25%' }}>
        <p className="input-container" style={{ width: '100%', textAlign: 'left' }} >
          <input type="text" value={projectType} name="text" id="text" className="input-field" 
          onChange={changeProjTypeCallback} style={{ width: '99%', paddingLeft: '4px' }} />
        </p>
      </StyledWrapper>
  )
}

export default ProjectType