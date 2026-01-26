import React, { useEffect, useState } from "react"
import '@/styles/production.css'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useSimData } from "@/MxRep/utils/contexts/SimDataContext"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate, useLocation } from "react-router-dom"
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton'
// import MenuIcon from '@mui/icons-material/Menu'

function Header() {
    const location = useLocation()

    const { user, isLoading } = useAuth()
    const [isDashboard, setIsDashboard] = useState(false)

    // I want this header to be for both the dashboard and the user panels, 
    // so by default it should place basic 

//   const { simData, isLoading, error } = useSimData()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname.includes("dashboard")) setIsDashboard(true)
    else setIsDashboard(false)
  }, [])

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
              <b>TecBooks</b>
            </Typography>
          {/* </div> */}
          {isDashboard ? (
            <Typography variant="subtitle1">Username | TeamName | GameId </Typography>
          ) : (
            <Typography variant="subtitle1">{user?.role} | {user?.firstNames}</Typography>
          )}
          {/* {isLoading || !simData ? (
            <Typography variant="subtitle1" gutterBottom> ... | ... | ... </Typography>
          ) : (
            <Typography variant="subtitle1" gutterBottom>
                {simData.userName} | {simData.teamName} | #{simData.placement}
            </Typography>
          )} */}
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header