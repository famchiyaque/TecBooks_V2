import React from "react"
import '@/styles/production.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from "react-router-dom"
import { useNavigation } from '@/contexts/NavigationContext'
import { useAuth } from '@/contexts/AuthContext'

function GenericHeader({ pageName }) {
  const navigate = useNavigate()
  const { toggleNavigation } = useNavigation()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box>
      <AppBar position="static" style={{ backgroundColor: "#03045e", height: "6vh" }}>
        <Toolbar style={{ justifyContent: "space-between", minHeight: "6vh" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleNavigation}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <b>TECBooks</b>
            </Typography>
          </Box>
          <Typography variant="subtitle1">{pageName}</Typography>
          {isAuthenticated && (
            <IconButton
              aria-label="log out"
              onClick={handleLogout}
              sx={{
                bgcolor: '#d32f2f',
                color: '#fff',
                '&:hover': { bgcolor: '#b71c1c' },
              }}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default GenericHeader
