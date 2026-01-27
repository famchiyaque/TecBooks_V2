import React from 'react'

function Part({ part, bom }) {
    console.log("part: ", part)
    const name = part.name
    const count = part.count
    const partsNeeded = bom[name]
    // console.log(count)
    // console.log(partsNeeded)
    const cars = Math.floor(count / partsNeeded)
    // console.log(cars)

  return (
      <div className='inventory-row-flex part'>
        <div className='part-title'>{name}</div>
        <div className='count-title'>{count}</div>
        <div className='cars-title'>{cars}</div>
      </div>
  )
}

export default Part