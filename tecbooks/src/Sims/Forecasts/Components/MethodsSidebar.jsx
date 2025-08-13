import React, { useState, useEffect, useRef } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { MODEL_OPTIONS } from '../configs/options-configs';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMethods } from '../store';

function MethodsSidebar() {
  // console.log("rendering methods sidebar");
  const dispatch = useDispatch();
  const activeMethods = useSelector((state) => state.forecaster.activeMethods);

  // --- calculate min/max based on window size ---
  const windowWidth = window.innerWidth;
  const minWidth = Math.max(windowWidth * 0.15, 150); // 15% of screen or 150px
  const maxWidth = Math.min(windowWidth * 0.3, 450); // 25% of screen or 450px

  const [width, setWidth] = useState((maxWidth + minWidth) / 2); // start at minWidth
  const isResizing = useRef(false);

  const onMouseDown = () => {
    isResizing.current = true;
  };

  const onMouseMove = (e) => {
    if (isResizing.current) {
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setWidth(newWidth);
    }
  };

  const onMouseUp = () => {
    isResizing.current = false;
  };

  const handleCheck = (option) => {
    if (activeMethods.includes(option)) {
      // Remove option
      const newActiveMethods = activeMethods.filter((method) => method !== option);
      dispatch(setActiveMethods(newActiveMethods));
    } else {
      // Add option
      const newActiveMethods = [...activeMethods, option];
      dispatch(setActiveMethods(newActiveMethods));
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        
      {/* Sidebar */}
      <Box
        sx={{
          width,
          // bgcolor: 'primary.main',
          // color: 'white',
          p: 2,
          userSelect: 'none',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* <Typography variant='h3' className='text-center'>Models</Typography> */}
        <h1 className='font-semibold text-3xl mb-3'>Models</h1>
        {MODEL_OPTIONS.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={activeMethods.includes(option)}
                onChange={() => handleCheck(option)}
                sx={{ padding: '5px 0', marginLeft: '15px' }} // 2rem space from label
              />
            }
            label={option}
            labelPlacement="start" // label on the left, checkbox on the right
            sx={{
              justifyContent: 'space-between',
              m: 0,
              width: '100%',
              '.MuiFormControlLabel-label': {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                // paddingRight: '25px', // keep gap from checkbox
              },
            }}
          />
        ))}
      </Box>

        {/* Resize handle */}
        <Box
          sx={{
            width: '5px',
            cursor: 'ew-resize', // better resize cursor
            bgcolor: 'grey.500',
            '&:hover': { bgcolor: 'grey.700' },
          }}
          onMouseDown={onMouseDown}
        />
     </Box>
    </div>
  );
}

export default MethodsSidebar;
