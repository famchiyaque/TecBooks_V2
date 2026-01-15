import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useSelector, useDispatch } from 'react-redux';
import { setEffectivePastDate, setEffectiveFutureDate } from '../store';
import Divider, { dividerClasses } from '@mui/material/Divider';
import { Typography } from '@mui/material';

export default function TimelineSliders() {
  const dispatch = useDispatch();

  const [pastMarks, setPastMarks] = useState([]);
  const [futureMarks, setFutureMarks] = useState([]);
  const [pastValue, setPastValue] = useState(null);
  const [futureValue, setFutureValue] = useState(null);

  const effectivePastDate = useSelector((state) => state.forecaster.effectivePastDate);
  const effectiveFutureDate = useSelector((state) => state.forecaster.effectiveFutureDate);
  const pastTimelineDates = useSelector((state) => state.forecaster.pastTimelineDates);
  const futureTimelineDates = useSelector((state) => state.forecaster.futureTimelineDates);

  // --- Generate slider marks ---
  useEffect(() => {
    if (!pastTimelineDates) return;

    const newPastMarks = pastTimelineDates
      .filter(item => item.date) // remove null/invalid
      .map(item => ({
        value: new Date(item.date).getTime(),
        label: item.name
      }));

    setPastMarks(newPastMarks);
  }, [pastTimelineDates]);

  useEffect(() => {
    if (!futureTimelineDates) return;

    const newFutureMarks = futureTimelineDates
      .filter(item => item.date) // remove null/invalid
      .map(item => ({
        value: new Date(item.date).getTime(),
        label: item.name
      }));

    setFutureMarks(newFutureMarks);
  }, [futureTimelineDates]);

  // --- Sync Redux effective dates to slider values ---
  useEffect(() => {
    if (effectivePastDate && pastMarks.length > 0) {
      setPastValue(new Date(effectivePastDate).getTime());
    }
  }, [effectivePastDate, pastMarks]);

  useEffect(() => {
    if (effectiveFutureDate && futureMarks.length > 0) {
      setFutureValue(new Date(effectiveFutureDate).getTime());
    }
  }, [effectiveFutureDate, futureMarks]);

  // --- Handlers ---
  const handlePastDateChange = (event, newValue) => {
    const match = pastTimelineDates.find(item => new Date(item.date).getTime() === newValue);
    if (match) dispatch(setEffectivePastDate(match.date));
  };

  const handleFutureDateChange = (event, newValue) => {
    const match = futureTimelineDates.find(item => new Date(item.date).getTime() === newValue);
    if (match) dispatch(setEffectiveFutureDate(match.date));
  };

  // --- Calculate min/max for slider ---
  const minPast = pastMarks.length > 0 ? Math.min(...pastMarks.map(m => m.value)) : 0;
  const maxPast = pastMarks.length > 0 ? Math.max(...pastMarks.map(m => m.value)) : 100;
  const minFuture = futureMarks.length > 0 ? Math.min(...futureMarks.map(m => m.value)) : 0;
  const maxFuture = futureMarks.length > 0 ? Math.max(...futureMarks.map(m => m.value)) : 100;

  if (!pastTimelineDates || !futureTimelineDates) return <div>Loading...</div>;

  const pastLabel = pastMarks.find(m => m.value === pastValue)?.label;
  const futureLabel = futureMarks.find(m => m.value === futureValue)?.label;

  return (
    <div className='flex items-start'>
      <div>
        <h5 className='font-semibold text-xs'>Historical</h5>
        <Typography variant="body2" color="text.secondary">&larr;{pastLabel}</Typography>
      </div>
        <Box sx={{ width: '80%', height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Past Slider */}
          <Slider
            value={pastValue}
            onChange={handlePastDateChange}
            step={null}
            marks={pastMarks}
            min={minPast}
            max={maxPast}
            track="inverted" 
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              const mark = pastMarks.find(m => m.value === value);
              return mark ? mark.label : '';
            }}
            sx={{
              color: 'orange',
              width: '45%',
              '& .MuiSlider-mark': {
                width: 3,           // make it a thin vertical line
                height: 12,          // height of the dash
                backgroundColor: 'currentColor', // same color as slider
                borderRadius: 1,
              },
              '& .MuiSlider-markLabel': {
                display: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 0,        // remove default thumb width
                height: 0,       // remove default thumb height
                bgcolor: 'transparent', // no background
                border: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: '15px solid orange', // arrow color
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'none', // remove hover shadow
                }
              }
            }}
          />

          {/* Future Slider */}
          <Slider
            value={futureValue}
            onChange={handleFutureDateChange}
            step={null}
            marks={futureMarks}
            min={minFuture}
            max={maxFuture}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              const mark = futureMarks.find(m => m.value === value);
              return mark ? mark.label : '';
            }}
            sx={{
              color: 'blue',
              width: '45%',
              '& .MuiSlider-mark': {
                width: 3,
                height: 12,
                backgroundColor: 'currentColor',
                borderRadius: 1,
              },
              '& .MuiSlider-markLabel': {
                display: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 0,        // remove default thumb width
                height: 0,       // remove default thumb height
                bgcolor: 'transparent', // no background
                border: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: '15px solid blue', // arrow color
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'none', // remove hover shadow
                }
              }
            }}
          />
        </Box>
        <div>
          <h5 className='font-semibold text-xs'>Forecast</h5>
          <Typography variant="body2" color="text.secondary">{futureLabel}&rarr;</Typography>
        </div>
    </div>
  );
}
