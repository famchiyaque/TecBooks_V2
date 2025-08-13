import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { INTERVAL_OPTIONS } from '../configs/options-configs';
import { useSelector, useDispatch } from 'react-redux'; 
import { setEffectiveInterval, getAvailableIntervals } from '../store';

function GraphOptions() {
    const dispatch = useDispatch();
    const availableIntervals = useSelector(getAvailableIntervals);
    const effectiveInterval = useSelector((state) => state.forecaster.effectiveInterval);
        
    const handleIntervalChange = (event) => {
        dispatch(setEffectiveInterval(event.target.value));
    };

    // Create a Set for faster lookup of available intervals
    const availableIntervalValues = new Set(
        availableIntervals?.map(interval => interval.value) || []
    );

    return (
        <div className='flex flex-col items-start'>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="interval-select-label">Interval</InputLabel>
                <Select
                    labelId="interval-select-label"
                    id="interval-select"
                    value={effectiveInterval || ''}
                    label="Interval"
                    onChange={handleIntervalChange}
                >
                    {INTERVAL_OPTIONS.map(({ value, label }) => (
                        <MenuItem 
                            key={value}
                            value={value}
                            disabled={!availableIntervalValues.has(value)}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default GraphOptions;