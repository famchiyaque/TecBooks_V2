import React, { useState } from "react"
import '@/styles/production.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Period from './Period'
import { MdDashboard } from 'react-icons/md'
import { FaFileInvoiceDollar, FaCalculator } from 'react-icons/fa'
import { BiTrendingUp } from 'react-icons/bi'

function SubHeader({ sidebarVisible, setSidebarVisible, activeSidebar, period, setPeriod }) {
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const icons = {
    0: <FaCalculator className="sidebar-icon" />,
    1: <MdDashboard className="sidebar-icon" />,
    2: <FaFileInvoiceDollar className="sidebar-icon" />,
    3: <BiTrendingUp className="sidebar-icon" />
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

                <div>{icons[activeSidebar]}</div>
            </div>
                
              {(activeSidebar === 1 || activeSidebar === 2 || activeSidebar === 3) ? (
                <div className="header-icon-flex">
                  <Period period={period} setPeriod={setPeriod} />
                </div>
              ) : ''}

        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default SubHeader
