import React from "react"
import '@/styles/production.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Period from './Dashboard/Period'
import Year from './Dashboard/Year'
import { iconMap } from '@/MxRep/Components/IconsMap'

function SubHeader({ sidebarVisible, setSidebarVisible, activeSidebar, period, year, setPeriod, setYear }) {
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#0077b6", height: "5vh", boxShadow: "none", color: 'white' }}>
        <Toolbar style={{ justifyContent: "space-between", minHeight: "5vh" }}>
            <div className="header-icon-flex">
                <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleSidebar}
                        >
                        <MenuIcon />
                    </IconButton>

                <div>{iconMap[activeSidebar]}</div>
            </div>
            
            
            {(period && year && (activeSidebar == 1 || activeSidebar == 2 || activeSidebar == 3 || activeSidebar == 5)) ? (
                <div className="header-icon-flex">
                  <Period period={period} setPeriod={setPeriod} />
                  <Year year={year} setYear={setYear} />
                </div>
            ) : ''}

        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default SubHeader