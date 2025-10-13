import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import EastIcon from "@mui/icons-material/East";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Modal from '@mui/material/Modal';
import HelpIcon from '@mui/icons-material/Help'
import { useSelector, useDispatch } from 'react-redux';
import { setCurrQuestion, setHasEmployees, setNumEmployees, setEmpAdmin, setEmpProduction, selectEmployeesComplete } from '../store'

function Employees() {
  const dispatch = useDispatch()

  const currQuestion = useSelector((state) => state.survey.currQuestion)
  const hasEmployees = useSelector((state) => state.survey.hasEmployees)
  const numEmployees = useSelector((state) => state.survey.numEmployees)
  const empAdmin = useSelector((state) => state.survey.empAdmin)
  const empProduction = useSelector((state) => state.survey.empProduction)
  const isComplete = useSelector(selectEmployeesComplete)

  const [numError, setNumError] = useState(false)

  const handleSetPage3 = () => {
    dispatch(setCurrQuestion(currQuestion === 3 ? null : 3));
  };

  const handleHasEmployees = (val) => {
    const boolVal = val === "true";
    dispatch(setHasEmployees(boolVal));
  };

  const handleNumEmployees = (val) => {
    const numericVal = Number(val); 
    // console.log(numericVal)

    if (numericVal > 15) {
      dispatch(setNumEmployees(Number(15)))
      setNumError(true)
    }
    else {
      dispatch(setNumEmployees(Number(numericVal)))
      setNumError(false)
    }
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Accordion expanded={currQuestion === 3}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          onClick={handleSetPage3}
        >
          <Typography component="span">3. Employees</Typography>
          <Typography sx={{ color: "gray", marginLeft: "auto", paddingRight: "0.5rem" }}>
            <i>{isComplete ? 'Complete' : 'Incomplete'}</i>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", paddingLeft: "10%" }}>
          
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
              <Typography component="span" sx={{ flexBasis: '90%' }}>Do you have employees and/or pay yourself a salary?</Typography>
              <div style={{ flexBasis: '10%' }}>
                <HelpIcon className="help-icon" onClick={() => setOpen(true)} />
              </div>
            </div>

          <FormControl>
            <RadioGroup row name="row-radio-buttons-group" onChange={(event) => handleHasEmployees(event.target.value)}>
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {hasEmployees && (
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '2rem' }}>
                <TextField
                  id="input-with-icon-textfield"
                  label="How Many?"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EngineeringIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  // sx={{ position: 'relative' }}
                  variant="standard"
                  type="number"
                  value={Number(numEmployees) || ''}
                  inputProps={{ min: 0 }}
                  onChange={(event) => handleNumEmployees(event.target.value)}
                />
                {numError && (
                  <div style={{ fontSize: '12px', color: 'red', width: '40%' }}>
                      <p>For simplicity purposes, you cannot enter more than 15 employees</p>
                  </div>
                )}
              </div>
            </Box>
          )}

          {numEmployees > 0 && (
            <div>
              {/* Admin Employees Slider */}
              <Typography component="span">How many of your employees are administrative?</Typography>
              <Box sx={{ width: "80%", display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: 30 }}>0</Typography>
                <Slider
                  min={0}
                  max={numEmployees - empProduction}
                  value={empAdmin}
                  onChange={(event, value) => dispatch(setEmpAdmin(value))}
                  aria-label="Admin Employees"
                  valueLabelDisplay="auto"
                />
                <Typography sx={{ minWidth: 30, paddingLeft: '1rem' }}>{numEmployees - empProduction}</Typography>
              </Box>

              {/* Production Employees Slider */}
              <Typography component="span">How many of your employees are in production?</Typography>
              <Box sx={{ width: "80%", display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: 30 }}>0</Typography>
                <Slider
                  min={0}
                  max={numEmployees - empAdmin}
                  value={empProduction}
                  onChange={(event, value) => dispatch(setEmpProduction(value))}
                  aria-label="Production Employees"
                  valueLabelDisplay="auto"
                />
                <Typography sx={{ minWidth: 30, paddingLeft: '1rem' }}>{numEmployees - empAdmin}</Typography>
              </Box>
            </div>
          )}

          <div style={{ borderTop: 'solid gray 1px', marginTop: '1rem' }}>
            <button className="learn-more continue-btn" onClick={() => dispatch(setCurrQuestion(4))}>
              Continue
              <EastIcon className="landing-learn-btn" sx={{ height: "100%", fontSize: "130%", fontWeight: "600" }} />
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
              What's an administrative employee vs a production employee?
            </Typography>
            <Typography variant="subtitle1">
              It's important to differentiate the category under which your employees fall 
              because of how it affects the books. Adminstrative 
              employees' salaries are recorded as expenses, meanwhile the salaries of production 
              employees are considered costs.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Sales reps, human resources, directors, and pretty much all employees of an 
              organization who are bound to the office are considered administrative, 
              and the employees out making, installing, or generally interacting with the 
              actual product and clients are considered production employees.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              As the owner of the business, if you pay yourself a salary, whether as CEO, CFO, 
              or any other title, then you count as an administrative employee.
            </Typography>
          </Box>
        </Modal>
    </div>
  );
}

export default Employees;
