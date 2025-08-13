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
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrQuestion, setHasAccsPayable, setHasAccsReceivable, setAccsPayable, setAccsReceivable, selectAccountsComplete } from '../store'
// import FormControl from "@mui/material/FormControl";
// import { writeFileXLSX } from 'xlsx'

function Accounts() {
  const dispatch = useDispatch()

  const currQuestion = useSelector((state) => state.survey.currQuestion)
  const hasAccsPayable = useSelector((state) => state.survey.hasAccsPayable)
  const hasAccsReceivable = useSelector((state) => state.survey.hasAccsReceivable)
  const accsPayable = useSelector((state) => state.survey.accsPayable)
  const accsReceivable = useSelector((state) => state.survey.accsReceivable)
  const isComplete = useSelector(selectAccountsComplete)
  const startMonth = useSelector((state) => state.survey.startMonth)

  const handleSetPage6 = () => {
    dispatch(setCurrQuestion(currQuestion === 6 ? null : 6))
  }

  const handleHasAccsPayable = (val) => {
    const boolVal = val === "true";
    if (boolVal && accsPayable.length === 0) handleAddAccPayable()
    dispatch(setHasAccsPayable(boolVal));
  }

  const handleHasAccsReceivable = (val) => {
    const boolVal = val === "true";
    if (boolVal && accsReceivable.length === 0) handleAddAccReceivable()
    dispatch(setHasAccsReceivable(boolVal));
  }

  const handleAddAccPayable = () => {
    dispatch(setAccsPayable([...accsPayable, { name: "", date: '', monthError: false }]))
  }

  const handleAddAccReceivable = () => {
    dispatch(setAccsReceivable([...accsReceivable, { name: "", date: '', monthError: false }]))
  }

  const handleRemovePayable = (index) => {
    dispatch(setAccsPayable(accsPayable.filter((_, i) => i !== index)));
  };

  const handleRemoveReceivable = (index) => {
    dispatch(setAccsReceivable(accsReceivable.filter((_, i) => i !== index)));
  };

  const handlePayableChange = (index, field, value) => {
          let isMonthError = false;
      
          if (field === "date") {
              // Parse dates safely in local time
              const [year, month] = value.split("-").map(Number);
              const selectedDate = new Date(year, month - 1, 1);
      
              const [startYear, startMonthNum] = startMonth.split("-").map(Number);
              const startDate = new Date(startYear, startMonthNum - 1, 1);
      
              const currentDate = new Date();

              if (selectedDate <= currentDate && selectedDate >= startDate) isMonthError = false
              else isMonthError = true
          }
      
          const updatedPayable = [...accsPayable];
          const updatedAcc = { ...updatedPayable[index] };
      
          if (field === "date") {
              updatedAcc["monthError"] = isMonthError;
              if (!isMonthError) updatedAcc["date"] = value;
          } else {
              updatedAcc[field] = value;
          }
      
          updatedPayable[index] = updatedAcc;
          dispatch(setAccsPayable(updatedPayable));
  };

  const handleReceivableChange = (index, field, value) => {
    let isMonthError = false;

    if (field === "date") {
        // Parse dates safely in local time
        const [year, month] = value.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, 1);

        const [startYear, startMonthNum] = startMonth.split("-").map(Number);
        const startDate = new Date(startYear, startMonthNum - 1, 1);

        const currentDate = new Date();

        if (selectedDate <= currentDate && selectedDate >= startDate) isMonthError = false
        else isMonthError = true
    }

    const updatedReceivable = [...accsReceivable];
    const updatedAcc = { ...updatedReceivable[index] };

    if (field === "date") {
        updatedAcc["monthError"] = isMonthError;
        if (!isMonthError) updatedAcc["date"] = value;
    } else {
        updatedAcc[field] = value;
    }

    updatedReceivable[index] = updatedAcc;
    dispatch(setAccsReceivable(updatedReceivable));
  };

  return (
    <div>
      <Accordion expanded={currQuestion === 6}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6-content"
          id="panel6-header"
          onClick={() => handleSetPage6()}
        >
          <Typography component="span">6. Accounts Payable/Receivable</Typography>
          <Typography sx={{ color: 'gray', marginLeft: 'auto', paddingRight: '0.5rem' }}><i>{isComplete ? 'Complete' : 'Incomplete'}</i></Typography>

        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: 'left', paddingLeft: '10%' }}>

          <div style={{ padding: '0 0 2rem 0' }}>
                <Typography variant="body1">
                    Has your business ever asked for or borrowed money from another entity?
                </Typography>

                <FormControl>
                  <RadioGroup row name="row-radio-buttons-group" 
                    value={hasAccsPayable === null ? "" : hasAccsPayable.toString()}
                    onChange={(event) => handleHasAccsPayable(event.target.value)}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

                {hasAccsPayable && (
                  <div>
                    {/* <div style={{ width: '80%', margin: '0 auto', color: 'gray', textAlign: 'center' }}>
                      <Typography variant='subtitle1' sx={{ fontSize: 'smaller' }}>
                          For each, enter the entity name (or however you'll remember it), and the date the loan was taken.
                      </Typography>
                    </div> */}

                    <FormControl fullWidth>
                      {accsPayable.map((acc, index) => (
                        <div
                          key={index}
                          style={{ display: 'flex', width: '90%', gap: '1rem', alignItems: 'center', justifyContent: 'space-around' }}
                        >
                          <FormControl variant='standard' sx={{ flexBasis: '30%' }}>
                            <TextField
                                label="Name"
                                type="text"
                                variant='standard'
                                value={acc.name}
                                onChange={(e) => handlePayableChange(index, 'name', e.target.value)}
                                // sx={{ flexBasis: '20%' }}
                            />
                          </FormControl>

                          <FormControl sx={{ padding: '1rem 0' }}>
                            {/* <Typography component="span" sx={{ marginBottom: '0.5rem' }}>
                              When did you take this loan? (month/year)
                            </Typography> */}
                            <TextField
                              label="Month/Year"
                              type="month"
                              value={acc.date}
                              variant='standard'
                              onChange={(e) => handlePayableChange(index, 'date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                            {acc.monthError && (
                                <div style={{ position: 'absolute', bottom: '-30px', fontSize: '10px', color: 'red' }}>
                                    <p>Date rejected, cannot be before the business's start date or in the future.</p>
                                </div>
                            )}
                          </FormControl>

                          <DeleteForeverIcon 
                            onClick={() => handleRemovePayable(index)} 
                            style={{ cursor: 'pointer', color: 'red' }} 
                          />
                        </div>
                      ))}

                      <Button sx={{ marginRight: 'auto' }} color="primary" onClick={handleAddAccPayable}>
                          + Add Account Payable
                      </Button>   
                    </FormControl>
                  </div>  
                )} 
          </div>

          <div style={{ padding: '0 0 2rem 0' }}>
                <Typography variant="body1">
                    Have you ever lent money to another entity? In other words, does anyone owe you money?
                </Typography>

                <FormControl>
                  <RadioGroup row name="row-radio-buttons-group" onChange={(event) => handleHasAccsReceivable(event.target.value)}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

                {hasAccsReceivable && (
                  <div>
                    {/* <div style={{ width: '80%', margin: '0 auto', color: 'gray', textAlign: 'center' }}>
                      <Typography variant='subtitle1' sx={{ fontSize: 'smaller' }}>
                          For each, enter the entity name (or however you'll remember it), and the date the loan was taken.
                      </Typography>
                    </div> */}

                    <FormControl fullWidth>
                      {accsReceivable.map((acc, index) => (
                        <div
                          key={index}
                          style={{ display: 'flex', width: '90%', gap: '1rem', alignItems: 'center', justifyContent: 'space-around' }}
                        >
                          <FormControl variant='standard' sx={{ flexBasis: '30%' }}>
                            {/* <Typography component="span" sx={{ marginBottom: '0.5rem' }}>
                              What was the entity? (write the name you'll remember it by)
                            </Typography> */}
                            <TextField
                                label="Name"
                                type="text"
                                variant='standard'
                                value={acc.name}
                                onChange={(e) => handleReceivableChange(index, 'name', e.target.value)}
                                // sx={{ flexBasis: '20%' }}
                            />
                          </FormControl>

                          <FormControl sx={{ padding: '1rem 0' }}>
                            {/* <Typography component="span" sx={{ marginBottom: '0.5rem' }}>
                              When did you take this loan? (month/year)
                            </Typography> */}
                            <TextField
                              label="Month/Year"
                              type="month"
                              value={acc.date}
                              variant='standard'
                              onChange={(e) => handleReceivableChange(index, 'date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                            {acc.monthError && (
                                <div style={{ position: 'absolute', bottom: '-30px', fontSize: '10px', color: 'red' }}>
                                    <p>Date rejected, cannot be before the business's start date or in the future.</p>
                                </div>
                            )}
                          </FormControl>

                          <DeleteForeverIcon 
                            onClick={() => handleRemoveReceivable(index)} 
                            style={{ cursor: 'pointer', color: 'red' }} 
                          />
                        </div>
                      ))}
                      <Button sx={{ marginRight: 'auto' }} color="primary" onClick={handleAddAccPayable}>
                          + Add Account Receivable
                      </Button>   
                    </FormControl>
                  </div>  
                )}  
          </div>  

          <div style={{ borderTop: 'solid gray 1px', marginTop: '1rem' }}>
            <button className='learn-more continue-btn' onClick={() => dispatch(setCurrQuestion(7))}>
              Continue
              <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '130%', fontWeight: '600' }} /> 
            </button>
          </div>

        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Accounts
