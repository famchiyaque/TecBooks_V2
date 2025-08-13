import React, { useState } from "react"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Typography } from "@mui/material"

function GenericSubheader({ simName }) {

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
                    >
                    <MenuIcon />
                </IconButton>

            </div>

              <Typography variant="body2">{simName}</Typography>

        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default GenericSubheader