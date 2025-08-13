import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Progress from './Comps/Progress'
import TypeBiz from './Cords/TypeBiz'
import Revenue from './Cords/Revenue'
import Employees from './Cords/Employees'
import Assets from './Cords/Assets'
import Expenses from './Cords/Expenses'
import Accounts from './Cords/Accounts'
import Report from './Cords/Report'
import '../styles/survey.css'
import GenericHeader from '../Global Components/GenericHeader'
import GenericSubheader from '../Global Components/GenericSubheader'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// import Accordian from './Pages/Accordian'

import { useSelector, useDispatch } from 'react-redux';
import { setProgressBarFixed } from './store'

function Survey() {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  const progressBarFixed = useSelector((state) => state.survey.progressBarFixed)

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.1; // Replace 0.1 with your desired vh value
      dispatch(setProgressBarFixed(window.scrollY > threshold));
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className='survey-page'>
      {/* {pages[currPage]} */}
      <GenericHeader pageName={"Business Accounting"} />
      <GenericSubheader simName={"Questionnaire"} />
      <div style={progressBarFixed ? { position: 'fixed', top: 0, width: '100%', zIndex: 1000 } : {}}>
        <Progress />
      </div>
      <div className='survey-card'>
          <div className='icon-title'>
            <img src={'/imgs/site-icon-hd.png'} className='survey-icon' />
            <Typography variant="h4" sx={{ fontWeight: '600' }}>KYC Questionnaire</Typography>
          </div>
          <div className='card-desc'>
            <Typography variant='h6'>Answer the questions below</Typography>
          </div>
          <div className='accordions'>
            <TypeBiz />

            <Revenue />

            <Employees />

            <Assets />

            <Expenses />

            <Accounts />

            <Report />
          </div>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='modal-pop-up' sx={{ width: '70%', minWidth: '500px' }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
              You are about to start the KYC (Know Your Client) Questionnaire.
            </Typography><br/>
            <div id="modal-modal-description" sx={{ mt: 2 }}>
              <ol style={{ padding: '0 2rem' }}>
                <li>
                  This survey is designed to gather all the information about your business
                  involved in its finances and accounting.
                </li><br/>
                <li>
                  There will be <b>no numbers</b> involved throughout this survey.
                </li><br/>
                <li>
                  Upon completion, you will be able to download an excel file tailored to 
                  your business where you will then need to input the numbers.
                </li><br/>
              </ol>
              {/* 1. This survey is designed to gather all the information about your business
              involved in its finances and accounting. <br/><br/>
              2. There will be <b>no numbers</b> involved throughout this survey. <br/><br/>
              3. Upon completion, you will be able to download an excel file tailored to 
              your business where you will then need to input the numbers. <br/><br/> */}
            </div>
            <Typography sx={{ color: 'gray', textAlign: 'center' }}>
              <br/>*click anywhere outside this box to begin*
            </Typography> 
          </Box>
        </Modal>
      </div>
    </div>
  )
}

export default Survey