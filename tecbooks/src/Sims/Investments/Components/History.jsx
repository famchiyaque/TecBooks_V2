import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { useSelector, useDispatch } from 'react-redux'
import { referenceProjectHistory } from '../store'

function History() {
  const dispatch = useDispatch()
  
  // keep local state so UI updates when history changes
  const [history, setHistory] = useState([])

  useEffect(() => {
    const loadHistory = () => {
      const storedHistory = sessionStorage.getItem("projEvalHistory")
      setHistory(storedHistory ? JSON.parse(storedHistory) : [])
    }
  
    loadHistory() // initial load
  
    window.addEventListener("historyUpdated", loadHistory)
    return () => window.removeEventListener("historyUpdated", loadHistory)
  }, [])

  const setPastProject = (index) => {
    dispatch(referenceProjectHistory(index))
  }

  const currProjectIndex = useSelector((state) => state.currProjectIndex)

  const clearCurrentHistory = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index)
    setHistory(updatedHistory)
    sessionStorage.setItem("projEvalHistory", JSON.stringify(updatedHistory))
  }

  const clearAllHistory = () => {
    setHistory([])
    sessionStorage.removeItem("projEvalHistory")
  }

  return (
    <TableContainer  style={{ boxShadow: 'none' }}>
      <div className='w-[95%] flex justify-between items-center mx-auto'>
        <p><span className='text-gray-500 italic'>Saved Projects</span></p>
        <IconButton onClick={clearAllHistory} title="Clear All">
          <ClearAllIcon />
        </IconButton>
      </div>
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
          {history && history.map((proj, index) => (
            <TableRow
              key={index}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 }, 
                cursor: 'pointer', 
                // backgroundColor: index === currProjectIndex ? '#444' : '#888'
              }}
              onClick={() => setPastProject(index + 1)}
              className='history-row'
            >
              <TableCell component="th" scope="row" align="left">
                {proj.projectInfo.project}
              </TableCell>
              <TableCell align="right">{proj.results.breakEven} years</TableCell>
              <TableCell align="right">{proj.results.roi}%</TableCell>
              <TableCell align="right">${proj.results.npv}</TableCell>
              <TableCell align="right">{proj.results.irr}%</TableCell>
              <TableCell align="center" sx={{ padding: '0' }}>
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation() // prevent row click event
                    clearCurrentHistory(index)
                  }} 
                  title="Remove"
                >
                  <ClearIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default History