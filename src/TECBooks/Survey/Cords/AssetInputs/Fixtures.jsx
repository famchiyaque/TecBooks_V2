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

function Fixtures({ assets, setAssets, hasAssets }) {
    const [fixturesVisible, setFixturesVisible] = useState(false)
    const [fixtures, setFixtures] = useState([
        { type: "Rented", item: "Desks", count: 2 },
    ]);

    const handleHasFixtures = (val) => {
        setFixturesVisible(val === "true");
    };

    const handleChange = (index, field, value) => {
        if (field === "count") {
            value = isNaN(value) || value === "" ? 0 : parseInt(value, 10);
        }
        // console.log(value)
        const updatedFixtures = [...fixtures];
        updatedFixtures[index][field] = value;
        setFixtures(updatedFixtures);
    };

    const handleAddFixtures = () => {
        setFixtures([...fixtures, { type: "", item: "", count: 1 }]);
    };

    const handleRemoveFixtures = (index) => {
        setFixtures(fixtures.filter((_, i) => i !== index));
    };

    const fixturesMap = [
        "Office furniture (desks, chairs, cabinets)", "Lighting fixtures",
        "Display shelves", "Racks", "Workbenches", "Storage Units", "Other Fixture Type"
    ]

    const finished = () => {
        setAssets(prevAssets =>
            prevAssets.map(asset =>
                asset.name === "fixtures" ? { ...asset, data: fixtures } : asset
            )
        );
    };

    return (
        <div>
            {hasAssets && (
                <FormControl sx={{ padding: '1rem 0 0 1rem' }}>
                    <Typography component="span">
                        4. Does your business own, rent, or lease any office fixtures such as the following? 
                        (Desks, Chairs, Cabinets, Lighting Fixtures, Display Shelves, Racks, Workbenches, Storage Units, other not mentioned)
                    </Typography>
                    <RadioGroup 
                        row 
                        name="row-radio-buttons-group" 
                        onChange={(event) => handleHasFixtures(event.target.value)} 
                        sx={{ paddingLeft: '1rem' }}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            )}

            {fixturesVisible && (
                <div style={{ padding: '1rem 0 2rem 2rem' }}>
                    <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Add as many as you need
                    </Typography>
                    <div>
                        <FormControl fullWidth>
                            {fixtures.map((prop, index) => (
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
                                        <InputLabel>Fixture</InputLabel>
                                        <Select
                                            value={prop.item}
                                            onChange={(e) => handleChange(index, 'item', e.target.value)}
                                        >
                                            {fixturesMap.map((option, id) => (
                                                <MenuItem key={id} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
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
                                        onClick={() => handleRemoveFixtures(index)} 
                                        style={{ cursor: 'pointer', color: 'red' }} 
                                    />
                                </div>
                            ))}
                        </FormControl>
                    </div>

                    <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddFixtures}>
                        + Add Fixture Asset
                    </Button>  

                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <Button onClick={finished} variant="contained" color="primary" sx={{ marginLeft: 'auto' }}>
                            Set Fixtures
                        </Button>
                    </div>  
                </div>    
            )}
        </div>
    );
}

export default Fixtures;
