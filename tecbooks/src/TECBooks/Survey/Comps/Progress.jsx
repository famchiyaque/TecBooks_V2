import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector, useDispatch  } from 'react-redux';
import { selectProgress } from '../store';

function LinearDeterminate() {
  const progress = useSelector(selectProgress)

  return (
    <Box sx={{ width: '100%', height: '10px' }}>
      <LinearProgress variant="determinate" value={progress} sx={{ height: '10px' }} />
    </Box>
  );
}

export default LinearDeterminate