import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AccountCircle from '@mui/icons-material/AccountCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { ListItemIcon, ListItemText, Divider } from '@mui/material'

function SharedHeader({ moduleName = "MxRep", simData = null }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const [profileAnchorEl, setProfileAnchorEl] = useState(null)
  const [helpAnchorEl, setHelpAnchorEl] = useState(null)
  const profileOpen = Boolean(profileAnchorEl)
  const helpOpen = Boolean(helpAnchorEl)

  // Determine current module from route
  const getCurrentModule = () => {
    const path = location.pathname
    if (path.includes('/auth')) return 'Auth'
    if (path.includes('/registry')) return 'Registry'
    if (path.includes('/dashboard')) return 'Dashboard'
    if (path.includes('/panel') || path.includes('-panel')) {
      if (path.includes('super-admin')) return 'Super Admin Panel'
      if (path.includes('admin')) return 'Admin Panel'
      if (path.includes('professor')) return 'Professor Panel'
      if (path.includes('student')) return 'Student Panel'
      return 'Panel'
    }
    return moduleName
  }

  const currentModule = getCurrentModule()
  const isAuthenticated = !!user
  const isDashboard = location.pathname.includes('/dashboard')

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null)
  }

  const handleHelpMenuOpen = (event) => {
    setHelpAnchorEl(event.currentTarget)
  }

  const handleHelpMenuClose = () => {
    setHelpAnchorEl(null)
  }

  const handleNavigation = (path) => {
    navigate(path)
    handleProfileMenuClose()
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    logout()
  }

  const getPanelRoute = () => {
    if (!user) return '/mxrep/auth/login'
    if (user.role === 'super-admin') return '/mxrep/super-admin-panel'
    if (user.institution?.slug) {
      const rolePanel = user.role === 'student' ? 'student-panel' 
                    : user.role === 'professor' ? 'professor-panel'
                    : user.role === 'admin' ? 'admin-panel'
                    : null
      return rolePanel ? `/mxrep/${user.institution.slug}/${rolePanel}` : '/mxrep/auth/login'
    }
    return '/mxrep/auth/login'
  }

  const getUserDisplayName = () => {
    if (!user) return null
    if (user.firstNames) return user.firstNames
    if (user.email) return user.email.split('@')[0]
    return user.role || 'User'
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="static" style={{ backgroundColor: "#03045e", height: "6vh" }}>
        <Toolbar style={{ justifyContent: "space-between", minHeight: "6vh" }}>
          {/* Left: Logo */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => navigate('/home')}
          >
            TECBooks
          </Typography>

          {/* Center: Module Name or Sim Data */}
          {isDashboard && simData ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {simData.userName} | {simData.teamName} | #{simData.placement}
            </Typography>
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {currentModule}
            </Typography>
          )}

          {/* Right: User Info & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Help Icon */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="help"
              onClick={handleHelpMenuOpen}
            >
              <HelpOutlineIcon />
            </IconButton>
            <Menu
              anchorEl={helpAnchorEl}
              open={helpOpen}
              onClose={handleHelpMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleHelpMenuClose}>
                <ListItemText primary="Help & Support" />
              </MenuItem>
              <MenuItem onClick={handleHelpMenuClose}>
                <ListItemText primary="Documentation" />
              </MenuItem>
              <MenuItem onClick={handleHelpMenuClose}>
                <ListItemText primary="Contact Us" />
              </MenuItem>
            </Menu>

            {/* Profile Menu */}
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account menu"
                  onClick={handleProfileMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={profileOpen}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <ListItemText 
                      primary={getUserDisplayName()} 
                      secondary={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                    />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleNavigation(getPanelRoute())}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Panel" />
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/mxrep/registry')}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Register" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account menu"
                  onClick={handleProfileMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={profileOpen}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleNavigation('/mxrep/auth/login')}>
                    <ListItemText primary="Sign In" />
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/mxrep/registry')}>
                    <ListItemText primary="Register" />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default SharedHeader

