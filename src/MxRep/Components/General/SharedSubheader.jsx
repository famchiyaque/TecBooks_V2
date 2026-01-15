import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'

function SharedSubheader({ 
  subheaderText = "",
  showSidebarToggle = false,
  onSidebarToggle = null,
  onSidebarClick = null, // Alternative: for dropdown menus that need click event
  sidebarVisible = true,
  activeSidebarIcon = null,
  rightContent = null // For period/year selectors or other contextual content
}) {
  const handleToggle = (event) => {
    if (onSidebarClick) {
      // For dropdown menus, pass the event
      onSidebarClick(event)
    } else if (onSidebarToggle) {
      // For regular sidebar toggles
      onSidebarToggle(!sidebarVisible)
    }
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar 
        position="static" 
        style={{ 
          backgroundColor: "#0077b6", 
          height: "5vh", 
          boxShadow: "none", 
          color: 'white' 
        }}
      >
        <Toolbar style={{ justifyContent: "space-between", minHeight: "5vh" }}>
          {/* Left: Sidebar Toggle & Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showSidebarToggle && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {activeSidebarIcon && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {activeSidebarIcon}
              </Box>
            )}
          </Box>

          {/* Center: Subheader Text */}
          {subheaderText ? (
            <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {subheaderText}
            </Typography>
          ) : !rightContent ? (
            <Box sx={{ flexGrow: 1 }} /> // Spacer when no content
          ) : null}

          {/* Right: Custom Content (e.g., Period/Year selectors) */}
          {rightContent && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {rightContent}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default SharedSubheader

