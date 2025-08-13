import React from 'react'
import { useSimData } from '../../SimDataContext'
import Typography from '@mui/material/Typography'
import Part from './Part' 

function Inventory() {
    const { simData } = useSimData()
    const inventory = simData.inventory
    const bom = simData.bom
    // const 

  return (
    <div className='whitecard'>
        <div className='whitecard-appbar'>
            <div className='whitecard-label'><i>Inventory</i></div>
            {/* <Typography variant='h6' gutterBottom>Inventory</Typography> */}
        </div>
        {/* <Typography variant='h6' gutterBottom>Inventory</Typography> */}
        <div className='inventory-row-flex inventory-labels'>
            <div className='part-title'><Typography variant="subtitle1">Part</Typography></div>
            <div className='count-title'><Typography variant="subtitle1">#</Typography></div>
            <div className='cars-title'><Typography variant="subtitle1">Cars</Typography></div>
        </div>
        <div className='parts-scroll'>
            {inventory.map((part, index) => {
                return <Part key={index} part={part} bom={bom} />
            })}
        </div>
        {/* <table className='inventory-table'>
            <thead>
                <tr>
                    <th>Part</th>
                    <th>#</th>
                    <th>Cars</th>
                </tr>
            </thead>
            <tbody>
                {inventory.map((part, index) => {
                    return <Part key={index} part={part} bom={bom} />;
                })}
            </tbody>
        </table> */}
        {/* <div className='inventory-table'>

        </div> */}
    </div>
  )
}

export default Inventory