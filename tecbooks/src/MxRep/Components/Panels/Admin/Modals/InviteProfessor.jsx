import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function InviteProfessor({ open, onClose }) { // Changed handleClose to onClose for clarity
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Invite Professor
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Enter the professor's email address to send an invitation.
        </Typography>
        {/* Add your form fields here */}
      </Box>
    </Modal>
  )
}

export default InviteProfessor