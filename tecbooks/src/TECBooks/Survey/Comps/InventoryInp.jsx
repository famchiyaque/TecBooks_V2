import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useSelector, useDispatch } from 'react-redux';
import { setHasRW, setHasWIPG, setHasFG } from '../store';

function InventoryInp() {
    const dispatch = useDispatch();

    const hasRawMaterials = useSelector((state) => state.survey.hasRawMaterials);
    const hasWorkInProgressGoods = useSelector((state) => state.survey.hasWorkInProgressGoods);
    const hasFinishedGoods = useSelector((state) => state.survey.hasFinishedGoods);

    const handleChange = (type) => (event) => {
        const value = event.target.checked;
        switch (type) {
            case 'raw':
                dispatch(setHasRW(value));
                break;
            case 'wip':
                dispatch(setHasWIPG(value));
                break;
            case 'fg':
                dispatch(setHasFG(value));
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <div style={{ padding: '1rem 0 2rem 1rem' }}>
                {/* <Typography sx={{ width: '70%', borderBottom: 'solid black 1px' }}>
                    Inventory
                </Typography> <br/> */}
                <Typography variant='body1' sx={{ fontSize: 'small', color: 'gray' }}>
                    Select each of the types of inventory your business stores.
                </Typography>
                <FormControl component="fieldset">
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hasRawMaterials}
                                    onChange={handleChange('raw')}
                                    color="primary"
                                />
                            }
                            label="Raw Materials"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hasWorkInProgressGoods}
                                    onChange={handleChange('wip')}
                                    color="primary"
                                />
                            }
                            label="Work in Progress"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hasFinishedGoods}
                                    onChange={handleChange('fg')}
                                    color="primary"
                                />
                            }
                            label="Finished Goods"
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>
            </div>
        </div>
    );
}

export default InventoryInp;
