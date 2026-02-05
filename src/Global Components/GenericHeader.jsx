import React from "react"
import '@/styles/production.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from "react-router-dom"
import { useNavigation } from '@/components/GlobalNavigation/NavigationContext'

function GenericHeader({ pageName }) {
  const navigate = useNavigate()
  const { toggleNavigation } = useNavigation()

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
          
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default GenericHeader