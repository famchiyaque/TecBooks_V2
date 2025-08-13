import React from "react"
import '../../styles/production.css'
import { useSimData } from "../SimDataContext"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from "react-router-dom"
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton'
// import MenuIcon from '@mui/icons-material/Menu'

function Header() {
  const { simData, isLoading, error } = useSimData()
  const navigate = useNavigate()

  // const toggleSidebar = () => {
  //   setSidebarVisible(!sidebarVisible)
  // }

  // previous colors for header/subheader: #1976d2, #1e90ff
  // new blue color pallete: #03045e, #0077b6, #00b4d8

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#03045e", height: "6vh" }}>
        <Toolbar style={{ justifyContent: "space-between", minHeight: "6vh" }}>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <b>Novus Tec</b>
            </Typography>
          {/* </div> */}
          {isLoading || !simData ? (
            <Typography variant="subtitle1" gutterBottom> ... | ... | ... </Typography>
          ) : (
            <Typography variant="subtitle1" gutterBottom>
                {simData.userName} | {simData.teamName} | #{simData.placement}
            </Typography>
          )}
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header