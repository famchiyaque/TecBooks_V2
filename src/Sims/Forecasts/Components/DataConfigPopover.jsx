import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { BEHAVIOR_OPTIONS } from '../configs/options-configs';
import { Button, FormControlLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { setStartDate, setBehavior, setBehaviorCase, setSalesDataBatch, setSalesData, setSeriesData } from '../store';

function DataConfigPopover({ anchorEl, open, onClose }) {
    const dispatch = useDispatch();

    const startDate = useSelector((state) => state.forecaster.startDate);
    const behavior = useSelector((state) => state.forecaster.behavior);
    const behaviorCase = useSelector((state) => state.forecaster.behaviorCase);

    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempBehavior, setTempBehavior] = useState(null);
    const [tempBehaviorCase, setTempBehaviorCase] = useState(null);

    const [startDateError, setStartDateError] = useState(false);
    const [configsAccepted, setConfigsAccepted] = useState(false);
    const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

    const handleStartDate = (event) => {
        // console.log("rendering data config popover");
        const rawValue = event.target.value;
    
        // If user cleared the input or gave no date, stop
        if (!rawValue) {
            setStartDateError(true);
            return;
        }
    
        const passedDate = new Date(rawValue);
    
        // If the date is invalid
        if (isNaN(passedDate)) {
            setStartDateError(true);
            return;
        }
    
        // Calculate date limits
        const now = new Date();
        const maxStartDate = new Date();
        maxStartDate.setFullYear(now.getFullYear() - 20);
    
        const minStartDate = new Date();
        minStartDate.setFullYear(now.getFullYear() - 1);
    
        // Check range
        if (passedDate < maxStartDate || passedDate > minStartDate) {
            setStartDateError(true);
            return;
        }
    
        // Store only a serializable string in Redux
        setTempStartDate(passedDate.toISOString());
        setStartDateError(false);
    };

    const handleBehaviorChange = (event) => { setTempBehavior(event.target.value) }
    const handleCaseChange = (event) => { setTempBehaviorCase(event.target.value) }

    const handleGo = () => {
        // tempStartDate or startDate could be a string or Date
        const effStartDate = new Date(tempStartDate ?? startDate);
        console.log("eff start date: ", effStartDate);
        const finalStartDate = effStartDate.setDate(effStartDate.getDate() + 0);
        console.log("final start date: ", finalStartDate);
    
        const effBehavior = tempBehavior ?? behavior;
        const effBehaviorCase = tempBehaviorCase ?? behaviorCase;
    
        if (effStartDate && effBehavior && effBehaviorCase) {
            const isoDate = effStartDate.toISOString(); // <-- same as Random handler
            console.log("what being passed to redux and batch: ", isoDate);
    
            dispatch(setStartDate(isoDate));
            dispatch(setBehavior(effBehavior));
            dispatch(setBehaviorCase(effBehaviorCase));
    
            console.log("handle go startDate: ", isoDate);
            console.log("handle go behavior: ", effBehavior);
            console.log("handle go behavior case: ", effBehaviorCase);
    
            dispatch(setSalesDataBatch([isoDate, effBehavior, effBehaviorCase]));
        } else {
            console.log("go was called but one of the needed values was not present");
        }
    };
    

    useEffect(() => {
        setTempStartDate(null);
        setTempBehavior(null);
        setTempBehaviorCase(null);
    }, [startDate, behavior, behaviorCase])

    useEffect(() => {
        const accepted = Boolean((tempStartDate || startDate) && (tempBehavior || behavior) && (tempBehaviorCase || behaviorCase));
        setConfigsAccepted(accepted);
    }, [tempStartDate, startDate, tempBehavior, behavior, tempBehaviorCase, behaviorCase]);

    useEffect(() => {
        const effBehavior = tempBehavior ?? behavior;
        if (!effBehavior) return;
    
        const effTempBehaviorCase = tempBehaviorCase ?? behaviorCase;
        if (!effTempBehaviorCase) return;
    
        const behaviorCaseAlignsWithBehavior = BEHAVIOR_OPTIONS.some(option =>
            option.name === effBehavior && option.options.includes(effTempBehaviorCase)
        );
    
        if (!behaviorCaseAlignsWithBehavior) {
            setTempBehaviorCase(null);
        }
    }, [behavior, tempBehavior, behaviorCase, tempBehaviorCase]);

    const muiInputStyle = {
        '& .MuiInputBase-root': {
            height: 35,            // controls input height
            fontSize: '0.875rem',  // smaller font
            padding: '0 8px',
            maxWidth: '160px'
        },
    }

  return (
    <div>
        <Popover
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ minWidth: 500, padding: '1rem', borderRadius: '10px' }}
            // PaperProps={{ sx: { p: 2, width: 300 } }}
        >
            <Typography sx={{ padding: '1rem' }}>Generate unique sales data.</Typography>
            <div className='flex flex-col px-4 py-1'>
                <FormControl size='small'>
                    <p className='text-sm text-gray-600'>Start Date</p>
                    <TextField
                        // label="Start Date" // change to full date not month/year
                        type="date"
                        value={tempStartDate ? tempStartDate.split('T')[0] : startDate ? startDate.split('T')[0] : ''}
                        onChange={handleStartDate}
                        size="small"
                        sx={muiInputStyle}
                    />
                    {startDateError && (
                        <div style={{ fontSize: '10px', color: 'red' }}>
                            <p>Start date rejected, too long ago or less than one month old</p>
                        </div>
                    )}
                </FormControl>

                <FormControl>
                    <p className='text-sm text-gray-600'>Behavior</p>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={tempBehavior || behavior || ""}
                        label="Behavior"
                        onChange={handleBehaviorChange}
                        disabled={!BEHAVIOR_OPTIONS}
                        size="small"
                        sx={muiInputStyle}
                    >
                        <MenuItem value="" />
                        {BEHAVIOR_OPTIONS.map(({ name }) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <p className='text-sm text-gray-600'>Case</p>
                    <Select
                        value={tempBehaviorCase || behaviorCase || ""}
                        label="Case"
                        onChange={handleCaseChange}
                        disabled={!tempBehavior && !behavior}
                        size="small"
                        sx={muiInputStyle}
                    >
                        <MenuItem value="" />
                        {(tempBehavior || behavior) && 
                        BEHAVIOR_OPTIONS.find((b) => b.name === (tempBehavior || behavior))?.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                            {option}
                            </MenuItem>
                        ))
                        }
                    </Select>
                    </FormControl>

                <div className='flex justify-around items-center py-2'>
                    <a onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}>
                            <p className='text-sm text-gray-600 cursor-pointer'>
                                {advancedOptionsOpen ? '▲' : '▼'} advanced options
                            </p>
                    </a>
                    <Button onClick={handleGo} 
                        variant='outlines' 
                        size="small" 
                        disabled={!configsAccepted}
                        sx={{ color: 'blue' }}
                    >
                        Go
                    </Button>
                </div>

                {advancedOptionsOpen && (
                    <div>
                        ADVANCED OPTIONS HERE
                    </div>
                )}
            </div>
        </Popover>
    </div>
  )
}

export default DataConfigPopover