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

function Tech({ assets, setAssets, hasAssets }) {
    const [technologyVisible, setTechnologyVisible] = useState(false)
    const [technologies, setTechnologies] = useState([
        { type: "Owned", item: "Servers", count: 1 }
    ]);

    const handleHasTechnology = (val) => {
        setTechnologyVisible(val === "true");
    };

    const handleChange = (index, field, value) => {
        if (field === "count") {
            value = isNaN(value) || value === "" ? 0 : parseInt(value, 10);
        }
        // console.log(value)
        const updatedTechnologies = [...technologies];
        updatedTechnologies[index][field] = value;
        setTechnologies(updatedTechnologies);
        finished()
    };

    const handleAddTechnologies = () => {
        setTechnologies([...technologies, { type: "", item: "", name: "", count: 1 }]);
    };

    const handleRemoveTechnology = (index) => {
        setTechnologies(technologies.filter((_, i) => i !== index));
    };

    const technologyMap = [
        "Computers", "Laptops", "Servers",
        "Internet Devides", "Printers", "Scanners", "Software license", "Other Tech Type"
      ]

      const finished = () => {
        setAssets(prevAssets =>
            prevAssets.map(asset =>
                asset.name === "tech" ? { ...asset, data: technologies } : asset
            )
        );
    };

    return (
        <div>
            {hasAssets && (
                <FormControl sx={{ padding: '1rem 0 0 1rem' }}>
                    <Typography component="span">
                        3. Does your business own, rent, or lease any technology such as the following? 
                        (Computers, Laptops, Server, IT Devices, Printers, Scanners, Software, other not mentioned)
                    </Typography>
                    <RadioGroup 
                        row 
                        name="row-radio-buttons-group" 
                        onChange={(event) => handleHasTechnology(event.target.value)} 
                        sx={{ paddingLeft: '1rem' }}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            )}

            {technologyVisible && (
                <div style={{ padding: '1rem 0 2rem 2rem' }}>
                    <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Add as many as you need
                    </Typography>
                    <div>
                        <FormControl fullWidth>
                            {technologies.map((prop, index) => (
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

                                    <FormControl variant='standard' sx={{ flexBasis: '40%' }}>
                                        <InputLabel>Tech</InputLabel>
                                        <Select
                                            value={prop.item}
                                            onChange={(e) => handleChange(index, 'item', e.target.value)}
                                        >
                                            {technologyMap.map((option, id) => (
                                                <MenuItem key={id} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl variant='standard' sx={{ flexBasis: '35%' }}>
                                        <TextField
                                            label="Tech Name"
                                            variant='standard'
                                            type="text"
                                            value={prop.name}
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            // sx={{ flexBasis: '20%' }}
                                        />
                                    </FormControl>

                                    <TextField
                                        label="Number"
                                        type="number"
                                        variant='standard'
                                        value={prop.count}
                                        onChange={(e) => handleChange(index, 'count', e.target.value)}
                                        sx={{ flexBasis: '20%' }}
                                    />
                                    <DeleteForeverIcon 
                                        onClick={() => handleRemoveTechnology(index)} 
                                        style={{ cursor: 'pointer', color: 'red' }} 
                                    />
                                </div>
                            ))}
                        </FormControl>
                    </div>

                    <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddTechnologies}>
                        + Add Technology Asset
                    </Button>  

                </div>    
            )}
        </div>
    );
}

export default Tech;
