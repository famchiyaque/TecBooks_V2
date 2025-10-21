import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function History({ history, projCallback }) {

  return (
    <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
      <Table aria-label="simple table" className='history-table'>
        <TableHead>
          <TableRow>
            <TableCell align="left" style={{  padding: '0.2rem 0 0.2rem 1rem'}}>Name</TableCell>
            <TableCell align="center" style={{  padding: '0'}}>BE</TableCell>
            <TableCell align="center" style={{  padding: '0'}}>ROI</TableCell>
            <TableCell align="center" style={{  padding: '0'}}>NPV</TableCell>
            <TableCell align="center" style={{  padding: '0'}}>IRR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((proj, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              onClick={() => projCallback(index + 1)}
              className='history-row'
            >
              <TableCell component="th" scope="row" align="left">
                {proj.projectType}
              </TableCell>
              <TableCell align="right">{proj.breakEven} years</TableCell>
              <TableCell align="right">{proj.roi}%</TableCell>
              <TableCell align="right">${proj.npv}</TableCell>
              <TableCell align="right">{proj.irr}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default History