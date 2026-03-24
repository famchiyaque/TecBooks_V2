import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useDashboard } from '@/core/store';

/**
 * Select a range of periods (0-based month indices) for views that filter by timeline.
 * Does not affect project-level views (Overview, Project Evaluation).
 */
function PeriodSelector() {
  const { businessModel, periodRange, setPeriodRange } = useDashboard();
  const timeline = businessModel?.timeline;
  const months = timeline?.months || [];
  const n = months.length;

  useEffect(() => {
    if (n > 0 && periodRange == null) {
      setPeriodRange({ start: 0, end: n - 1 });
    }
  }, [n, periodRange, setPeriodRange]);

  if (!n) return null;

  const start = periodRange?.start ?? 0;
  const end = periodRange?.end ?? n - 1;

  const handleStart = (e) => {
    const v = Number(e.target.value);
    setPeriodRange({ start: v, end: Math.max(v, end) });
  };

  const handleEnd = (e) => {
    const v = Number(e.target.value);
    setPeriodRange({ start: Math.min(start, v), end: v });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <FormControl size="small" variant="standard" sx={{ minWidth: 140 }}>
        <InputLabel id="period-start-label" sx={{ color: 'white' }}>From</InputLabel>
        <Select
          labelId="period-start-label"
          value={start}
          label="From"
          onChange={handleStart}
          sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' } }}
        >
          {months.map((m, i) => (
            <MenuItem key={`s-${i}`} value={i}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" variant="standard" sx={{ minWidth: 140 }}>
        <InputLabel id="period-end-label" sx={{ color: 'white' }}>To</InputLabel>
        <Select
          labelId="period-end-label"
          value={end}
          label="To"
          onChange={handleEnd}
          sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' } }}
        >
          {months.map((m, i) => (
            <MenuItem key={`e-${i}`} value={i}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setPeriodRange({ start: 0, end: n - 1 })}
        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)' }}
      >
        Full timeline
      </Button>
    </Box>
  );
}

export default PeriodSelector;
