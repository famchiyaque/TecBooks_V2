import React from "react"
// import '../../styles/production.css'
import '../styles/production.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from "react-router-dom"

function GenericHeader({ pageName }) {
  const navigate = useNavigate()


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#03045e", height: "6vh" }}>
        <Toolbar style={{ justifyContent: "space-between", minHeight: "6vh" }}>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <b>TECBooks</b>
            </Typography>
          {/* </div> */}
          <Typography variant="subtitle1">{pageName}</Typography>
          
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default GenericHeader