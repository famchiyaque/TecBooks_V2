import React from "react"
import '@/styles/production.css'
import { useDashboard } from '@/contexts'
import { useAuth } from '@/contexts/AuthContext'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from "react-router-dom"

function Header() {
  const { businessModel, loading } = useDashboard()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const metadata = businessModel?.metadata
  const timeline = businessModel?.timeline

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#03045e", height: "6vh" }}>
        <Toolbar style={{ justifyContent: "space-between", minHeight: "6vh" }}>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <b>TECBooks</b>
            </Typography>
          {loading || !metadata ? (
            <Typography variant="subtitle1" gutterBottom> ... | ... </Typography>
          ) : (
            <Typography variant="subtitle1" gutterBottom>
                {metadata.name} | Since: {timeline.startMonth}
            </Typography>
          )}
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

export default Header
