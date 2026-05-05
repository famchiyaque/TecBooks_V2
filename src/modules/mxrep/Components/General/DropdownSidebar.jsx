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
        <MenuItem onClick={() => handleMenuClick("/mxrep/auth")}>Sign In</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/mxrep/registry")}>Register</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/mxrep/my-panel")}>My Panel</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/mxrep/logout")}>Logout</MenuItem>
      </Menu>
    )
}

export default AuthSidebar