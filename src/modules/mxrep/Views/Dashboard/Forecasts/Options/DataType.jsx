import React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Box from '@mui/material/Box'

function DataType({ dataType, changeDataType }) {
  return (
    <Box sx={{ display: 'flex', '& > *': { m: 1 } }} >
        <ButtonGroup>
            <Button variant={dataType == "sales" ? "contained" : "outlined"}
            onClick={() => changeDataType("sales")}>Sales</Button>
            <Button variant={dataType == "orders" ? "contained" : "outlined"}
            onClick={() => changeDataType("orders")}>Orders</Button>
            <Button variant={dataType == "demand" ? "contained" : "outlined"}
            onClick={() => changeDataType("demand")}>Demand</Button>
        </ButtonGroup>
    </Box>
  )
}

export default DataType