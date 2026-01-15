import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Machinery({ assets, setAssets, hasAssets }) {
    const [machineryVisible, setMachineryVisible] = useState(false)
    const [machines, setMachinery] = useState([
        { type: "Owned", item: "Forklift", count: 1 }
    ]);

    const handleHasMachinery = (val) => {
        const bool = val === "true"
        setMachineryVisible(bool);
        if (!bool) {
            setMachinery([])
            finished()
        }
    };

    const handleChange = (index, field, value) => {
        if (field === "count") {
            value = isNaN(value) || value === "" ? 0 : parseInt(value, 10);
        }
        // console.log(value)
        const updatedMachinery = [...machines];
        updatedMachinery[index][field] = value;
        setMachinery(updatedMachinery);
        finished()
    };

    const handleAddMachinery = () => {
        setMachinery([...machines, { type: "", item: "", name: "", count: 1 }]);
    };

    const handleRemoveMachinery = (index) => {
        setMachinery(machines.filter((_, i) => i !== index));
    };

    const machineryMap = [
        "Production Machinery", "Manufacturing Tools", 
        "Company Vehicles", "Specialized tools",
        "Other Machinery Type"
    ]

    const finished = () => {
        setAssets(prevAssets =>
            prevAssets.map(asset =>
                asset.name === "machinery" ? { ...asset, data: machines } : asset
            )
        );
    };

    return (
        <div>
            {hasAssets && (
                <FormControl sx={{ padding: '1rem 0 0 1rem' }}>
                    <Typography component="span">
                        2. Does your business own, rent, or lease any machinery/equipment such as the following? 
                        (Production Machinery, Manufacturing Tools, Company Vehicles, Specialized Tools, other not mentioned)
                    </Typography>
                    <RadioGroup 
                        row 
                        name="row-radio-buttons-group" 
                        onChange={(event) => handleHasMachinery(event.target.value)} 
                        sx={{ paddingLeft: '1rem' }}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            )}

            {machineryVisible && (
                <div style={{ padding: '1rem 0 2rem 2rem' }}>
                    <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Add as many as you need
                    </Typography>
                    <div>
                        <FormControl fullWidth>
                            {machines.map((prop, index) => (
                                <div 
                                    key={index} 
                                    style={{ display: 'flex', width: '100%', gap: '1rem', alignItems: 'center', padding: '0.8rem 0' }}
                                >
                                    <FormControl variant="standard" sx={{ flexBasis: '25%' }}>
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            value={prop.type}
                                            onChange={(e) => handleChange(index, 'type', e.target.value)}
                                        >
                                            <MenuItem value={"Owned"}>Owned</MenuItem>
                                            <MenuItem value={"Rented"}>Rented</MenuItem>
                                            <MenuItem value={"Leased"}>Leased</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl variant='standard' sx={{ flexBasis: '35%' }}>
                                        <InputLabel>Machine</InputLabel>
                                        <Select
                                            value={prop.item}
                                            onChange={(e) => handleChange(index, 'item', e.target.value)}
                                        >
                                            {machineryMap.map((option, id) => (
                                                <MenuItem key={id} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl variant='standard' sx={{ flexBasis: '35%' }}>
                                        <TextField
                                            label="Machinery Name"
                                            variant='standard'
                                            type="text"
                                            value={prop.name}
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            // sx={{ flexBasis: '20%' }}
                                        />
                                    </FormControl>

                                    <TextField
                                        label="#"
                                    variant='standard'
                                        type="number"
                                        value={prop.count}
                                        onChange={(e) => handleChange(index, 'count', e.target.value)}
                                        sx={{ width: '60px' }}
                                    />
                                    <DeleteForeverIcon 
                                        onClick={() => handleRemoveMachinery(index)} 
                                        style={{ cursor: 'pointer', color: 'red' }} 
                                    />
                                </div>
                            ))}
                        </FormControl>
                    </div>

                    <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddMachinery}>
                        + Add Machinery Asset
                    </Button>  
                    
                </div>    
            )}
        </div>
    );
}

export default Machinery;
