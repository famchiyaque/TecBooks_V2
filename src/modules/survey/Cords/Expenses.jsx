import React, { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EastIcon from '@mui/icons-material/East'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import HelpIcon from '@mui/icons-material/Help'
import { useSelector, useDispatch } from 'react-redux';
import { setCurrQuestion, setHasExpenses, setExpenses, selectExpensesComplete } from '../store'

function Expenses() {
    const dispatch = useDispatch()

    const currQuestion = useSelector((state) => state.survey.currQuestion)
    const hasExpenses = useSelector((state) => state.survey.hasExpenses)
    const expenses = useSelector((state) => state.survey.expenses)
    const isComplete = useSelector(selectExpensesComplete)

    const handleSetPage5 = () => {
        dispatch(setCurrQuestion(currQuestion === 5 ? null : 5));
    };

    const handleAddExpense = () => {
        dispatch(setExpenses([...expenses, { name: "" }]))
    }

    const handleRemoveExpense = (index) => {
      const updatedExpenses = expenses.filter((_, i) => i !== index)
        dispatch(setExpenses(updatedExpenses));
    };

    const handleToggleHasExpenses = (event) => {
      const checked = !event.target.checked; // because label is "I have none"
      dispatch(setHasExpenses(checked));
      if (!checked) {
        dispatch(setExpenses([])); // clear if they say they have none
      }
    };

    const handleChange = (index, field, value) => {
      const updatedExpenses = expenses.map((exp, i) =>
          i === index ? { ...exp, [field]: value } : exp
      )
      dispatch(setExpenses(updatedExpenses))
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
  return (
    <div>
      <Accordion expanded={currQuestion === 5}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          onClick={() => handleSetPage5()}
        >
          <Typography component="span">5. Expenses</Typography>
          <Typography sx={{ color: 'gray', marginLeft: 'auto', paddingRight: '0.5rem' }}><i>{isComplete ? 'Complete' : 'Incomplete'}</i></Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", paddingLeft: "10%" }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
              <Typography component="span" sx={{ flexBasis: '90%' }}>
                  Not including salaries, assets, or inventories, what are you business's expenses? (utilities, digital marketing, etc.)
              </Typography>
              <div style={{ flexBasis: '10%' }}>
                <HelpIcon className='help-icon' onClick={() => setOpen(true)} />
              </div>
            </div>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={!hasExpenses}
                    onChange={handleToggleHasExpenses}
                  />
                }
                label="I have none"
              />
            </FormGroup>

            {hasExpenses && (
              <div style={{ padding: '0rem 0 2rem 1rem' }}>
              {/* <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                  Add all you expenses here
              </Typography> */}
              <div>
                  <FormControl fullWidth>
                      {expenses.map((exp, index) => (
                          <div 
                              key={index} 
                              style={{ display: 'flex', width: '100%', gap: '1rem', alignItems: 'center', padding: '0.8rem 0' }}
                          >
                              <FormControl variant='standard' sx={{ flexBasis: '40%' }}>
                                  {/* <InputLabel>Expense</InputLabel> */}
                                  <TextField
                                      label="Expense Name"
                                      type="text"
                                      variant='standard'
                                      value={exp.name}
                                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                                      // sx={{ flexBasis: '20%' }}
                                  />
                              </FormControl>

                              {/* <FormControl variant="standard" sx={{ flexBasis: '40%' }}>
                                  <InputLabel>Frecuency</InputLabel>
                                  <Select
                                      value={exp.frequency}
                                      onChange={(e) => handleChange(index, 'frequency', e.target.value)}
                                  >
                                      <MenuItem value={"Weekly"}>Weekly</MenuItem>
                                      <MenuItem value={"Monthly"}>Monthly</MenuItem>
                                      <MenuItem value={"Quarterly"}>Quarterly</MenuItem>
                                      <MenuItem value={"Annually"}>Annually</MenuItem>
                                  </Select>
                              </FormControl> */}

                              <DeleteForeverIcon 
                                  onClick={() => handleRemoveExpense(index)} 
                                  style={{ cursor: 'pointer', color: 'red' }} 
                              />
                          </div>
                      ))}
                  </FormControl>
              </div>

                    <Button sx={{ paddingLeft: '2rem' }} color="primary" onClick={handleAddExpense}>
                        + Add Expense
                    </Button>    
            </div>  
            )

            }

          <div style={{ borderTop: 'solid gray 1px', marginTop: '1rem' }}>
            <button className='learn-more continue-btn' onClick={() => dispatch(setCurrQuestion(6))}>
              Continue
              <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '130%', fontWeight: '600' }} /> 
            </button>
          </div>
        </AccordionDetails>
      </Accordion>

      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='modal-pop-up'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              What exactly is an expense?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              An <b>expense</b> is a necessary cost for the general operations of the business, 
              that isn't directly related to the production of the product or service. It can 
              take the form of an electrity bill, sales rep salary, or the renting of a 
              machine for the production line. <br/><br/>
              Meanwhile, a <b>cost</b> is directly related to the product, like the inventory 
              needed to make the product or the salary of the person building or creating the 
              product, both of which should have already been taken care of in previous sections.
            </Typography>
          </Box>
        </Modal>
    </div>
  )
}

export default Expenses