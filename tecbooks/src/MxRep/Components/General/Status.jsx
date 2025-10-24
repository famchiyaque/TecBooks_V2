import React from 'react'

function Status({ variant, content }) {
    const variants = {
        "positive": "",
        "neutral": "",
        "negative": ""
    }

  return (
    <a className={`${variant ? variants[variant] : 'neutral'}`}>
        {content}
    </a>
  )
}

export default Status