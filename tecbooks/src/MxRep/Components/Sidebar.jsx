import { useNavigate } from "react-router-dom"
import { Menu, MenuItem } from '@mui/material'

function AuthSidebar({ open, anchorEl, onClose }) {
    const navigate = useNavigate()
  
    const handleMenuClick = (path) => {
      navigate(path)
      onClose()
    }
  
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={() => handleMenuClick("/mxrep/auth/sign-in")}>Sign In</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/mxrep/register")}>Register</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/mxrep/my-panel")}>My Panel</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/logout")}>Logout</MenuItem>
      </Menu>
    )
}

export default AuthSidebar