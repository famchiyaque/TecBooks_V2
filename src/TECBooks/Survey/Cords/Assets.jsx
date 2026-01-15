import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import EastIcon from '@mui/icons-material/East'
import HelpIcon from '@mui/icons-material/Help'
import AssetModal from '../Comps/AssetModal'
import { useSelector, useDispatch } from 'react-redux';
import { setCurrQuestion, setHasAssets, setHasInventory, selectAssetsComplete } from '../store'
import AssetsInp from '../Comps/AssetsInp'
import InventoryInps from '../Comps/InventoryInp'

function Assets() {
  const dispatch = useDispatch()

  const currQuestion = useSelector((state) => state.survey.currQuestion)
  const hasAssets = useSelector((state) => state.survey.hasAssets)
  const hasInventory = useSelector((state) => state.survey.hasInventory)
  const isComplete = useSelector(selectAssetsComplete)

  const handleSetPage4 = () => {
    dispatch(setCurrQuestion(currQuestion === 4 ? null : 4));
  };

  const handleHasAssets = (val) => {
    const boolVal = val === "true"
    dispatch(setHasAssets(boolVal))
  }

  const handleHasInventory = (val) => {
    const boolVal = val === "true"
    dispatch(setHasInventory(boolVal))
  } 

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Accordion expanded={currQuestion === 4}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          onClick={() => handleSetPage4()}
        >
          <Typography component="span">4. Assets and Inventory</Typography>
          <Typography sx={{ color: 'gray', marginLeft: 'auto', paddingRight: '0.5rem' }}><i>{isComplete ? 'Complete' : 'Incomplete'}</i></Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", paddingLeft: "5%" }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <FormControl sx={{ flexBasis: '90%' }}>
                <Typography component="span">Does your business own, rent, or lease any assets (physical, digital, intellectual, etc.)?</Typography>
                <RadioGroup row name="row-radio-buttons-group" onChange={(event) => handleHasAssets(event.target.value)}>
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>
            <div style={{ flexBasis: '10%', paddingTop: '0.5rem' }}>
              <HelpIcon className='help-icon' onClick={handleOpen} />
            </div>
          </div>

          {hasAssets && (
            <AssetsInp />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <FormControl sx={{ flexBasis: '90%' }}>
                <Typography component="span">Does your business tend to have/store inventory?</Typography>
                <RadioGroup row name="row-radio-buttons-group" onChange={(event) => handleHasInventory(event.target.value)}>
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>
            <div style={{ flexBasis: '10%', paddingTop: '0.5rem' }}>
              <HelpIcon className='help-icon' onClick={handleOpen} />
            </div>
          </div>

          {hasInventory && (
            <InventoryInps />
          )}

          <div style={{ borderTop: 'solid gray 1px', marginTop: '1rem' }}>
            <button className="learn-more continue-btn" onClick={() => dispatch(setCurrQuestion(5))}>
              Continue
              <EastIcon className="landing-learn-btn" sx={{ height: "100%", fontSize: "130%", fontWeight: "600" }} />
            </button>
          </div>
          
        </AccordionDetails>
      </Accordion>

      <AssetModal open={open} handleClose={handleClose}  />

    </div>
  )
}

export default Assets