import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { INTERVAL_OPTIONS } from '../configs/options-configs';
import { useSelector, useDispatch } from 'react-redux'; 
import { setEffectiveInterval, setCompound, setAlpha, setBeta, setGamma,
    getAvailableIntervals, getCompoundEnabled, getAlphaEnabled, getBetaEnabled,
    getGammaEnabled, getCompoundRange
 } from '../store';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { TbAlpha } from "react-icons/tb";
import { TbBeta } from "react-icons/tb";

import { Typography } from '@mui/material';

function GraphOptions() {
    const dispatch = useDispatch();
    const availableIntervals = useSelector(getAvailableIntervals);
    const effectiveInterval = useSelector((state) => state.forecaster.effectiveInterval);
    const compoundEnabled = useSelector(getCompoundEnabled);
    const effectiveCompound = useSelector((state) => state.forecaster.effectiveCompound);
    const alphaEnabled = useSelector(getAlphaEnabled);
    const effectiveAlpha = useSelector((state) => state.forecaster.effectiveAlpha);
    const betaEnabled = useSelector(getBetaEnabled);
    const effectiveBeta = useSelector((state) => state.forecaster.effectiveBeta);
    const gammaEnabled = useSelector(getGammaEnabled);
    const effectiveGamma = useSelector((state) => state.forecaster.effectiveGamma);
    console.log("alpha enabled was: ", alphaEnabled);

    const { min, max } = useSelector(getCompoundRange);
        
    const handleIntervalChange = (event) => {
        dispatch(setEffectiveInterval(event.target.value));
    };

    // Create a Set for faster lookup of available intervals
    const availableIntervalValues = new Set(
        availableIntervals?.map(interval => interval.value) || []
    );
    
    const handleCompoundChange = (event) => {
        dispatch(setCompound(event.target.value));
    }

    const handleAlphaChange = (event) => {
        dispatch(setAlpha(event.target.value));
    }
    const handleBetaChange = (event) => {
        dispatch(setBeta(event.target.value));
    }
    const handleGammaChange = (event) => {
        dispatch(setGamma(event.target.value));
    }

    useEffect(() => {
        if (compoundEnabled && !effectiveCompound) dispatch(setCompound(3));
    }, [effectiveCompound, compoundEnabled, min, max]);

    useEffect(() => {
        if (alphaEnabled && !effectiveAlpha) dispatch(setAlpha(0.5));
        if (betaEnabled && !effectiveBeta) dispatch(setBeta(0.5));
        if (gammaEnabled && !effectiveGamma) dispatch(setGamma(0.5));
    }, [alphaEnabled, effectiveAlpha, betaEnabled, effectiveBeta, gammaEnabled, effectiveGamma]);

    return (
        <div className='flex flex-col justify-start gap-2 pt-10 px-6 border-l w-[15rem]'>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant='standard'>
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

            {compoundEnabled && min && max && (
                <Box sx={{ width: '100%', textAlign: 'left', color: '#000' }}>
                    <Typography>Compound</Typography>
                    <div className='flex gap-2'>
                        <Slider
                            value={effectiveCompound}
                            step={1}
                            min={min}
                            max={50}
                            valueLabelDisplay="auto"
                            onChange={handleCompoundChange}
                            sx={{
                                color: 'gray',
                                '& .MuiSlider-thumb': {
                                height: 20,        // size
                                width: 20,
                                borderRadius: '4px', // shape (circle = 50%, square = 0, rounded = custom px)
                                bgcolor: 'yellow', // fill color
                                border: '2px solid white', // outline
                                },
                                '& .MuiSlider-thumb:hover': {
                                boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover effect
                                },
                            }}
                        />
                        <Typography>{effectiveCompound}</Typography>
                    </div>
                </Box>
            )}

            {alphaEnabled && (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000' }}>
                    <TbAlpha style={{ fontSize: '2rem' }} />
                    <Slider
                        value={effectiveAlpha}
                        step={0.1}
                        min={0}
                        max={50}
                        valueLabelDisplay="auto"
                        onChange={handleAlphaChange}
                        sx={{
                            color: 'gray',
                            '& .MuiSlider-thumb': {
                              height: 20,        // size
                              width: 20,
                              borderRadius: '4px', // shape (circle = 50%, square = 0, rounded = custom px)
                              bgcolor: 'primary.main', // fill color
                              border: '2px solid white', // outline
                            },
                            '& .MuiSlider-thumb:hover': {
                              boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover effect
                            },
                          }}
                    />
                    <Typography>{effectiveAlpha}</Typography>
                </Box>
            )}

            {betaEnabled && (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000' }}>
                    <TbBeta style={{ fontSize: '2rem' }} />
                    <Slider
                        value={effectiveBeta}
                        step={0.1}
                        min={0}
                        max={50}
                        valueLabelDisplay="auto"
                        onChange={handleBetaChange}
                        sx={{
                            color: 'gray',
                            '& .MuiSlider-thumb': {
                              height: 20,        // size
                              width: 20,
                              borderRadius: '4px', // shape (circle = 50%, square = 0, rounded = custom px)
                              bgcolor: 'secondary.main', // fill color
                              border: '2px solid white', // outline
                            },
                            '& .MuiSlider-thumb:hover': {
                              boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover effect
                            },
                          }}
                    />
                    <Typography>{effectiveBeta}</Typography>
                </Box>
            )}

            {gammaEnabled && (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000' }}>
                    <Typography>G</Typography>
                    <Slider
                        value={effectiveGamma}
                        step={0.1}
                        min={0}
                        max={50}
                        valueLabelDisplay="auto"
                        onChange={handleGammaChange}
                        sx={{
                            color: 'gray',
                            '& .MuiSlider-thumb': {
                              height: 20,        // size
                              width: 20,
                              borderRadius: '4px', // shape (circle = 50%, square = 0, rounded = custom px)
                              bgcolor: 'green', // fill color
                              border: '2px solid white', // outline
                            },
                            '& .MuiSlider-thumb:hover': {
                              boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover effect
                            },
                          }}
                    />
                    <Typography>{effectiveGamma}</Typography>
                </Box>
            )}

        </div>
    );
}

export default GraphOptions;