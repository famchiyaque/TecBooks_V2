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
import '@/styles/custom-excel-builder.css'
import GenericHeader from '@/components/global/GenericHeader'
import GenericSubheader from '@/components/global/GenericSubheader'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSelector, useDispatch } from 'react-redux';
import { setProgressBarFixed } from './store'

function CustomExcelBuilder() {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  const progressBarFixed = useSelector((state) => state.customExcel.progressBarFixed)

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.1;
      dispatch(setProgressBarFixed(window.scrollY > threshold));
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className='custom-excel-builder-page'>
      <GenericHeader pageName={"Custom Excel Builder"} />
      <GenericSubheader subheader={"Define Your Business Structure"} />
      <div style={progressBarFixed ? { position: 'fixed', top: 0, width: '100%', zIndex: 1000 } : {}}>
        <Progress />
      </div>
      <div className='custom-excel-builder-card'>
          <div className='icon-title'>
            <img src={'/imgs/site-icon-hd.png'} className='custom-excel-builder-icon' />
            <Typography variant="h4" sx={{ fontWeight: '600' }}>Business Structure Questionnaire</Typography>
          </div>
          <div className='card-desc'>
            <Typography variant='h6'>Define your business accounts and structure</Typography>
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
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', fontWeight: '700' }}>
              Custom Excel Builder
            </Typography><br/>
            <div id="modal-modal-description" sx={{ mt: 2 }}>
              <ol style={{ padding: '0 2rem' }}>
                <li>
                  This questionnaire will help you define your business's financial structure
                  by identifying your revenue streams, assets, expenses, and accounts.
                </li><br/>
                <li>
                  You will <b>not need to enter any numbers</b> during this process - just define
                  what accounts and categories your business uses.
                </li><br/>
                <li>
                  Upon completion, you'll download a custom Excel file tailored specifically to 
                  your business structure. You'll then fill in the numbers and upload it to generate your dashboard.
                </li><br/>
              </ol>
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

export default CustomExcelBuilder
