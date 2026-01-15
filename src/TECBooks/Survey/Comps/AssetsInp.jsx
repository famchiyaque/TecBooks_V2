import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from "@mui/material/FormControl";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import { useSelector, useDispatch } from 'react-redux'
import { setAssets } from '../store'

function AssetsInp() {
    const dispatch = useDispatch()

    const assets = useSelector((state) => state.survey.assets)
    const startMonth = useSelector((state) => state.survey.startMonth)

    const handleAssetChange = (index, field, value) => {
        let isMonthError = false;
    
        if (field === "dateAcq") {
            // Parse dates safely in local time
            const [year, month] = value.split("-").map(Number);
            const selectedDate = new Date(year, month - 1, 1);
    
            const [startYear, startMonthNum] = startMonth.split("-").map(Number);
            const startDate = new Date(startYear, startMonthNum - 1, 1);
    
            const currentDate = new Date();

            if (selectedDate <= currentDate && selectedDate >= startDate) isMonthError = false
            else isMonthError = true
        }
    
        const updatedAssets = [...assets];
        const updatedAsset = { ...updatedAssets[index] };
    
        if (field === "dateAcq") {
            updatedAsset["monthError"] = isMonthError;
            if (!isMonthError) updatedAsset["dateAcq"] = value;
        } else {
            updatedAsset[field] = value;
        }
    
        updatedAssets[index] = updatedAsset;
        dispatch(setAssets(updatedAssets));
    };
    

    const handleAddAsset = () => {
        dispatch(setAssets([...assets, { status: '', name: '', type: '', dateAcq: '', monthError: false }]))
    }

    const handleRemoveAsset = (index) => {
        const updatedAssets = assets.filter((_, i) => i !== index)
        dispatch(setAssets(updatedAssets))
    }

    return (
        <div>
                <div style={{ padding: '0rem 0 2rem 1rem' }}>
                    {/* <Typography component='span'>
                        Assets
                    </Typography> */}
                    {/* <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Add as many as you need
                    </Typography> */}
                    <div>
                        <FormControl fullWidth>
                            {assets.map((asset, index) => (
                                <div 
                                    key={index} 
                                    style={{ width: '100%', padding: '0.8rem 0' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 0.8rem 1rem' }}>
                                        <FormControl variant="standard" sx={{ flexBasis: '26%' }}>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={asset.status}
                                                onChange={(e) => handleAssetChange(index, 'status', e.target.value)}
                                            >
                                                <MenuItem value={"Owned"}>Owned</MenuItem>
                                                <MenuItem value={"Rented"}>Rented/Leased</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl variant='standard' sx={{ flexBasis: '26%' }}>
                                            <TextField
                                                label="Name"
                                                variant='standard'
                                                type="text"
                                                value={asset.name}
                                                onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                                                // sx={{ flexBasis: '20%' }}
                                            />
                                        </FormControl>

                                        <FormControl sx={{ flexBasis: '30%', position: 'relative' }}>
                                            <TextField
                                                label={"Acquisition Month"}
                                                variant='standard'
                                                type="month"
                                                value={asset.dateAcq}
                                                onChange={(e) => handleAssetChange(index, 'dateAcq', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                            {asset.monthError && (
                                                <div style={{ position: 'absolute', bottom: '-30px', fontSize: '10px', color: 'red' }}>
                                                    <p>Date rejected, cannot be before the business's start date or in the future.</p>
                                                </div>
                                            )}
                                        </FormControl>

                                        <DeleteForeverIcon 
                                            onClick={() => handleRemoveAsset(index)} 
                                            style={{ cursor: 'pointer', color: 'red' }} 
                                        />
                                    </div>

                                    {asset.status === "Owned" && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 0.8rem 1rem' }}>
                                            <Typography sx={{ flexBasis: '26%', margin: 'auto 0' }}>For Owned Assets:</Typography>
                                            <div style={{ flexBasis: '26%' }}>
                                                {/* <Typography>How do you track this asset's depreciation?</Typography> */}
                                                <FormControl variant="standard" sx={{ width: '100%', maxWidth: '200px' }}>
                                                    <InputLabel>Type</InputLabel>
                                                    <Select
                                                        value={asset.type}
                                                        onChange={(e) => handleAssetChange(index, 'type', e.target.value)}
                                                    >
                                                        <MenuItem value={"Tangible"}>Tangible/Physical</MenuItem>
                                                        <MenuItem value={"Intangible"}>Intangible</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {/* {asset.type === "Tangible" ? (
                                                <div style={{ flexBasis: '30%' }}>
                                                    <FormControl variant="standard" sx={{ width: '100%', maxWidth: '200px' }}>
                                                        <InputLabel>Depreciation</InputLabel>
                                                        <Select
                                                            value={asset.method}
                                                            onChange={(e) => handleAssetChange(index, 'method', e.target.value)}
                                                        >
                                                            <MenuItem value={"Constant Rate"}>Constant Rate (%)</MenuItem>
                                                            <MenuItem value={"Useful Lifetime"}>Useful Lifetime (yrs)</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            ) : (
                                                <div style={{ flexBasis: '35%' }}>
                                                </div>
                                            )} */}
                                            <div style={{ width: '28px' }}>
                                            </div>
                                        </div>
                                    )}
                                    <Divider variant="middle" sx={{ color: 'blue' }} />
                                </div>
                            ))}
                        </FormControl>
                    </div>

                    <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddAsset}>
                        + Add Asset
                    </Button>  
 
                </div>    

        </div>
    );
}

export default AssetsInp;
