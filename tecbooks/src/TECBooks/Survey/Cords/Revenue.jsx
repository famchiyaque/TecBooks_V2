import React, { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EastIcon from '@mui/icons-material/East'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import HelpIcon from '@mui/icons-material/Help'

import { useSelector, useDispatch } from 'react-redux';
import { setCurrQuestion, setRevenue, selectRevenueComplete } from '../store'

function Revenue() {
  const dispatch = useDispatch()

  const currQuestion = useSelector((state) => state.survey.currQuestion)
  const revenue = useSelector((state) => state.survey.revenue)
  const isComplete = useSelector(selectRevenueComplete)

  const handleSetPage2 = () => {
    dispatch(setCurrQuestion(currQuestion === 2 ? null : 2))
  }

  const handleAddRevenue = () => {
    dispatch(setRevenue([...revenue, { status: "", name: "" }]))
  }

  const handleRemoveRevenue = (index) => {
    dispatch(setRevenue(revenue.filter((_, i) => i !== index)))
  };

  const handleChange = (index, field, value) => {
    const updatedRevenue = revenue.map((rev, i) =>
      i === index ? { ...rev, [field]: value } : rev
    );
    dispatch(setRevenue(updatedRevenue));
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Accordion expanded={currQuestion === 2}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          onClick={() => handleSetPage2()}
        >
          <Typography component="span">2. Revenue Streams</Typography>
          <Typography sx={{ color: 'gray', marginLeft: 'auto', paddingRight: '0.5rem' }}><i>{isComplete ? 'Complete' : 'Incomplete'}</i></Typography>

        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: 'left', paddingLeft: '10%' }}>
          <div style={{ padding: '0 0 2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                <div style={{ flexBasis: '90%' }}>
                  <Typography component="span">Add all the different products/services your business generates income from</Typography>
                </div>
                <div style={{ flexBasis: '10%', paddingTop: '0.5rem' }}>
                  <HelpIcon className='help-icon' onClick={() => setOpen(true)} />
                </div>
              </div>
                <div>
                    <FormControl fullWidth>
                        {revenue.map((rev, index) => (
                            <div 
                              key={index} 
                              style={{ display: 'flex', width: '100%', gap: '1rem', alignItems: 'center', padding: '0.8rem 0' }}
                            >
                                <FormControl variant="standard" sx={{ flexBasis: '30%' }}>
                                    <InputLabel>Product or Service</InputLabel>
                                    <Select
                                        value={rev.status || ""}
                                        onChange={(e) => handleChange(index, 'status', e.target.value)}
                                    >
                                        <MenuItem value={"Product"}>Product</MenuItem>
                                        <MenuItem value={"Service"}>Service</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl variant='standard' sx={{ flexBasis: '30%' }}>
                                  {/* <InputLabel>revense</InputLabel> */}
                                  <TextField
                                      label="Name"
                                      type="text"
                                      variant='standard'
                                      value={rev.name}
                                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                                      // sx={{ flexBasis: '20%' }}
                                  />
                                </FormControl>

                                <DeleteForeverIcon 
                                    onClick={() => handleRemoveRevenue(index)} 
                                    style={{ cursor: 'pointer', color: 'red' }} 
                                />
                              </div>
                            ))}
                    </FormControl>
                </div>

                <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddRevenue}>
                    + Add Revenue
                </Button>    
            </div>  

          <div style={{ borderTop: 'solid gray 1px', marginTop: '1rem' }}>
            <button className='learn-more continue-btn' onClick={() => dispatch(setCurrQuestion(3))}>
              Continue
              <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '130%', fontWeight: '600' }} /> 
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='modal-pop-up'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              What's the difference between a Product-Based, Service-Based, and Rental type business?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <b>Product based</b> means you offer a physical product that a customer
              can buy and keep forever. You had to either buy that same product
              or manufacture it yourself with raw materials. <br/><br/>
              <b>Service based</b> means there's no physical exchange of goods, but you're 
              rather giving someone something intangible that you didn't have to 
              physically create, like access to an online platform, or tax advice, 
              a unique experience like a massage, or fixing something for someone. <br/><br/>
              <b>Rental based</b> means you do work with physical items, but you only lend these
              to your customer, so you never really lose your iventory.
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  )
}

export default Revenue
