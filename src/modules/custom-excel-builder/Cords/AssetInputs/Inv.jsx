import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Inventory({ assets, setAssets, hasAssets }) {
    const [inventoryVisible, setInventoryVisible] = useState(false);
    const [inventory, setInventory] = useState([{ type: "Raw Materials", frequency: "Weekly", track: "total", fluctuate: true }]);

    const handleHasInventory = (val) => {
        setInventoryVisible(val === "true");
    };

    const handleChange = (index, field, value) => {
        const updatedInventory = [...inventory];
        updatedInventory[index][field] = value;
        setInventory(updatedInventory);
        finished()
    };

    const handleAddInventory = () => {
        setInventory([
            ...inventory,
            { type: "", name: "" }
        ]);
    };

    const handleRemoveInventory = (index) => {
        setInventory(inventory.filter((_, i) => i !== index));
    };

    const finished = () => {
        setAssets(prevAssets =>
            prevAssets.map(asset =>
                asset.name === "inventory" ? { ...asset, data: inventory } : asset
            )
        );
    };

    // const inventoryCategories = [
    //     "Raw Materials", "Work-in-progress goods", "Finished Goods",
    //     "Retail Stock", "Spare Parts & Supplies", "Other inventory type"
    // ];

    const inventoryCategories = [
        "Raw Materials", "Finished Goods",
        "Retail Stock"
    ];

    return (
        <div>
            {hasAssets && (
                <FormControl sx={{ padding: '1rem 0 0 1rem' }}>
                    <Typography component="span">
                        5. Does your business store and sell physical products? 
                        (Raw Materials, Work-in-progress goods, Finished Goods, Retail Stock, Spare Parts & Supplies, other)
                    </Typography>
                    <RadioGroup 
                        row 
                        name="inventory-radio-group" 
                        onChange={(event) => handleHasInventory(event.target.value)} 
                        sx={{ paddingLeft: '1rem' }}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            )}

            {inventoryVisible && (
                <div style={{ padding: '1rem 0 2rem 2rem' }}>
                    <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Add as many as you need
                    </Typography>
                    <div>
                        <FormControl fullWidth>
                            {inventory.map((item, index) => (
                                <div 
                                    key={index} 
                                    style={{ display: 'flex', width: '100%', gap: '1rem', alignItems: 'center', padding: '1rem 0' }}
                                >
                                                                        
                                    {/* Type Select */}
                                    <FormControl variant="standard" sx={{ flexBasis: '40%' }}>
                                        <InputLabel>Inventory Type</InputLabel>
                                        <Select
                                            value={item.type}
                                            onChange={(e) => handleChange(index, 'type', e.target.value)}
                                        >
                                            {inventoryCategories.map((option, id) => (
                                                <MenuItem key={id} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl variant='standard' sx={{ flexBasis: '40%' }}>
                                        {/* <InputLabel>revense</InputLabel> */}
                                        <TextField
                                            label="Name"
                                            type="text"
                                            variant='standard'
                                            value={item.name}
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            // sx={{ flexBasis: '20%' }}
                                        />
                                    </FormControl>

                                    <DeleteForeverIcon 
                                        onClick={() => handleRemoveInventory(index)} 
                                        style={{ cursor: 'pointer', color: 'red' }} 
                                    />
                                </div>
                            ))}
                        </FormControl>
                    </div>

                    <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddInventory}>
                        + Add Inventory Item
                    </Button>  
                </div>    
            )}
        </div>
    );
}

export default Inventory;
