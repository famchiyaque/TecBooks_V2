import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EastIcon from '@mui/icons-material/East'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrQuestion, setNameBiz, setStartMonth, selectTypeBizComplete } from '../store'

function TypeBiz() {
  const dispatch = useDispatch()

  const currQuestion = useSelector((state) => state.survey.currQuestion)
  const nameBiz = useSelector((state) => state.survey.nameBiz)
  const startMonth = useSelector((state) => state.survey.startMonth)
  const isComplete = useSelector(selectTypeBizComplete);

  const handleSetPage1 = () => {
    dispatch(setCurrQuestion(currQuestion === 1 ? null : 1))
  }

  const [monthError, setMonthError] = useState(false)

  const handleStartMonth = (event) => {
    const value = event.target.value; // Format: "YYYY-MM"

    const [year, month] = value.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, 1);
    const currentDate = new Date();

    const minDate = new Date();
    minDate.setMonth(currentDate.getMonth() - 1);

    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() - 10);

    if (selectedDate >= maxDate && selectedDate <= minDate) {
        setMonthError(false);
        dispatch(setStartMonth(value));
    } else {
        dispatch(setMonthError(value));
    }
  };


  return (
    <div>
      <Accordion expanded={currQuestion === 1}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          onClick={() => handleSetPage1()}
        >
          <Typography component="span">1. Your Business</Typography>
          <Typography sx={{ color: 'gray', marginLeft: 'auto', paddingRight: '0.5rem' }}><i>{isComplete ? 'Complete' : 'Incomplete'}</i></Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", paddingLeft: "10%" }}>

          <FormControl>
            <Typography component="span">What's your business called?</Typography>
            <TextField
              label="Name"
              type="text"
              variant='standard'
              value={nameBiz}
              onChange={(e) => dispatch(setNameBiz(e.target.value))}
              sx={{ marginBottom: '1.5rem' }}
            />
          </FormControl>
          <br/>

          <FormControl sx={{ padding: '2rem 0' }}>
              {/* <Typography variant='body1'>Last Question:</Typography> */}
              <Typography component="span" sx={{ marginBottom: '0.5rem' }}>
                When did your business start its operations? (month/year)
              </Typography>
              <TextField
                label="Month/Year"
                type="month"
                value={startMonth}
                onChange={handleStartMonth}
                InputLabelProps={{ shrink: true }}
              />
              {monthError && (
                <div style={{ fontSize: '10px', color: 'red' }}>
                  <p>Start month rejected, too long ago or less than one month old</p>
                </div>
              )}
          </FormControl>

          <div style={{ borderTop: 'solid gray 1px', marginTop: '1rem' }}>
            <button className='learn-more continue-btn' onClick={() => dispatch(setCurrQuestion(2))}>
              Continue
              <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '130%', fontWeight: '600' }} /> 
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default TypeBiz