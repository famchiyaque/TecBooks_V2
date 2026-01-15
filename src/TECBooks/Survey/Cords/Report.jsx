import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EastIcon from '@mui/icons-material/East';
import * as XLSX from "xlsx";
import { getExcelData } from '../Excel/getExcel';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSurveyInfo, selectSurveyComplete, setCurrQuestion } from '../store';

function Expenses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currQuestion = useSelector((state) => state.survey.currQuestion);
  const surveyInfo = useSelector(selectAllSurveyInfo);
  const isComplete = useSelector(selectSurveyComplete);

  const bizInfo = surveyInfo.bizInfo;
  const revenueInfo = surveyInfo.revenueInfo;
  const employeesInfo = surveyInfo.employeesInfo;
  const assetsInfo = surveyInfo.assetsInfo;
  const expensesInfo = surveyInfo.expensesInfo;
  const accountsInfo = surveyInfo.accountsInfo;

  // const [infoValid, setInfoValid] = useState(false)
  const [showGetExcel, setShowGetExcel] = useState(false);
  const [showFinalModal, setShowFinalModel] = useState(false);

  const handleSetPage7 = () => {
    dispatch(setCurrQuestion(currQuestion === 7 ? null : 7));
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setShowGetExcel(isComplete);
  }, [isComplete]);

  const getExcel = () => {
    const data = getExcelData(surveyInfo);
    console.log(data)
  
    const workbook = XLSX.utils.book_new();

    // Define sheet names
    const sheetNames = ["Instructions", "Overview", "Revenue", "Costs", "Expenses", "OwnedAssets", "Accounts"];

    data.forEach((sheetData, index) => {
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[index]);
    });

    XLSX.writeFile(workbook, `TECBooks_${bizInfo.name}.xlsx`);
    handleOpen();
  };

  // Get revenue streams that are type product
  const products = revenueInfo.revenue.filter((rev) => { return rev.status === 'Product' })
  // Get revenue streams that are type product
  const services = revenueInfo.revenue.filter((rev) => { return rev.status === 'Services' })

  // Get rented/leased assets
  const rentedOrLeased = assetsInfo.assets.filter((asset) => { return asset.status === 'Rented' })
  // Get owned assets
  const ownedAssets = assetsInfo.assets.filter((asset) => { return asset.status === 'Owned' })

  const handleClick = () => {
    navigate('/home');
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById('tecbooks-page');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div onClick={() => setCurrQuestion(7)}>
      <Accordion expanded={currQuestion === 7}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />} 
          aria-controls="panel1-content" 
          id="panel1-header"
          onClick={() => handleSetPage7()}
        >
          <Typography component="span">7. Final Report</Typography>
          <Typography sx={{ color: 'gray', marginLeft: 'auto', paddingRight: '0.5rem' }}><i>{showGetExcel ? "Ready for Excel" : "Info not Ready"}</i></Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", paddingLeft: "10%" }}>
          <Typography variant="subtitle1" sx={{ color: '#5585b5' }}>
            Make sure the following information is correct:
          </Typography>

          <Typography variant='h6'>Name: <span style={{ fontWeight: '400' }}>{bizInfo.name}</span></Typography>

          {/* <Typography variant='h6'>Business Type: <span style={{ fontWeight: '400' }}>{typeBiz}</span></Typography> */}

          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Revenue Streams </Typography>
          <div style={{ paddingLeft: '1rem' }}>
            {(products.length === 0 && services.length === 0) ? (
              <p>No Revenue Streams</p>
            ) : (
              <div>
                <ul className='report-ul'>
                  {products.map((rev, index) => (
                    <li key={index}>{rev.status}: {rev.name}</li>
                  ))}
                  {services.map((rev, index) => (
                    <li key={index}>{rev.status}: {rev.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>


          {!employeesInfo.hasEmployees ? (
            <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>No Employees</Typography>
          ) : (
            <div>
                <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>{employeesInfo.numEmployees} Employees</Typography>
                <Typography variant='body1' sx={{ paddingLeft: '1rem' }}>Administrative Employees: {employeesInfo.empAdmin}</Typography>
                <Typography variant='body1' sx={{ paddingLeft: '1rem' }}>Production Employees: {employeesInfo.empProduction}</Typography>
            </div>
          )}

          {/* Fixed Costs */}
          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Fixed Costs <span className='report-span'>(Rented/Leased)</span></Typography>
          <div style={{ paddingLeft: '1rem' }}>
            {rentedOrLeased.length === 0 ? (
                <p>No rented or leased assets</p>
              ) : (
                <div>
                  <ul className='report-ul'>
                    {rentedOrLeased.map((item, index) => (
                      <li key={index}>{item.status} ({item.name} {item.dateAcq})</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Depreciation Costs */}
          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Depreciation Costs <span className='report-span'>(Owned)</span></Typography>
          <div style={{ paddingLeft: '1rem' }}>
            {ownedAssets.length === 0 ? (
                <p>No owned assets</p>
              ) : (
                <div>
                  <ul className='report-ul'>
                    {ownedAssets.map((item, index) => (
                      <li key={index}>{item.status} ({item.name} {item.dateAcq})</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Variable Costs */}
          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Variable Costs <span className='report-span'>(Raw Materials, Supplies)</span></Typography>
          <div style={{ paddingLeft: '1rem' }}>
            <ul className='report-ul'>
              {assetsInfo.hasRW && <li>Raw Materials</li>}
              {assetsInfo.hasWIPG && <li>Work in progress goods</li>}
              {assetsInfo.hasFG && <li>Finished Goods</li>}
            </ul>
          </div>

          {/* Expenses */}
          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Expenses</Typography>
          <div style={{ paddingLeft: '1rem' }}>
            {expensesInfo.expenses.length === 0 ? (
                <p>No expenses</p>
              ) : (
                <div>
                  <ul className='report-ul'>
                    {expensesInfo.expenses.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Liabilities */}
          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Liabilities</Typography>
          <div style={{ paddingLeft: '1rem' }}>
            {accountsInfo.accsPayable.length === 0 ? (
                <p>Never had a liability</p>
              ) : (
                <div>
                  <ul className='report-ul'>
                    {accountsInfo.accsPayable.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Receivables */}
          <Typography variant='h6' sx={{ paddingTop: '0.5rem' }}>Receivables</Typography>
          <div style={{ padding: '0rem 0 1rem 1rem' }}>
              {accountsInfo.accsReceivable.length === 0 ? (
                <p>Never lent money</p>
              ) : (
                <div>
                  <ul className='report-ul'>
                    {accountsInfo.accsReceivable.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {showGetExcel ? (
            <div style={{ borderTop: 'solid gray 1px' }}>
              <button className='learn-more continue-btn' onClick={() => getExcel()}>
                Get Excel
                <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '130%', fontWeight: '600' }} />
              </button>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', marginTop: '1rem', borderTop: 'solid black 1px', borderBottom: 'solid black 1px' }}>
              <Typography variant='body1'>
                <b>Please fill out all the necessary information in order to get your excel template</b>
              </Typography>
            </div>
          )}
          
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
              You've finished the questionnaire!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Once you finish filling out your custom template, you
              can go back to the home screen and upload your excel!
              <button className='learn-more continue-btn' onClick={handleClick}>
                Back to Home
                <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '130%', fontWeight: '600' }} />
              </button>
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Expenses;
