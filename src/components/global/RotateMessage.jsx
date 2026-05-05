import React, { useState } from 'react'
import { useOrientation } from './PortraitContext';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';

function RotateMessage() {
    const { status } = useOrientation();
    const [open, setOpen] = useState(true);
  
    if (status === 'ok') return null;
  
    return (
      <div className="rotate-warning">
        {/* 📱 Please rotate your device to landscape mode. */}
        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='modal-pop-up'>
            {status === 'portrait' && (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                📱 Please rotate your device to landscape mode.
              </Typography>
            )}
            {status === 'tooSmall' && (
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Your device must be at least 640px wide to use this app.
              </Typography>
            )}
          </Box>
        </Modal>
      </div>
    );
  }

export default RotateMessage
