import React, { use } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import { useSelector } from 'react-redux'
import { getProjectInfo, getResults } from '../store'

function Results() {
  const projectInfo = useSelector(getProjectInfo)
  const results = useSelector(getResults)
  const { breakEven, roi, npv, irr } = results

  const addResultsToHistory = () => {
    const storedHistory = sessionStorage.getItem("projEvalHistory");
    let history = storedHistory ? JSON.parse(storedHistory) : [];
  
    if (history.length >= 15) {
      // TODO add toast for displaying error messages
      console.log("stored length was too much");
      return;
    }
  
    const newEntry = {
      index: history.length + 1,
      projectInfo,
      results
    };
  
    const newHistory = [...history, newEntry];
    sessionStorage.setItem("projEvalHistory", JSON.stringify(newHistory));

    window.dispatchEvent(new Event("historyUpdated"));
  };

  return (
    <>
      <div className='results-papers-div'>
        <div>
          <Typography variant='subtitle2'>Break Even</Typography>
          <Paper elevation={0} className='paper-flex' style={{ backgroundColor: "transparent" }}>
            <Typography variant='h4' gutterBottom>
                {breakEven == null ? "X" : breakEven}
            </Typography>
            <p className='box-p'>years</p>
          </Paper>
        </div>

        <div>
          <Typography variant='subtitle2'>ROI</Typography>
          <Paper elevation={0} className='paper-flex' style={{ backgroundColor: "transparent" }}>
            <Typography variant='h4' gutterBottom>
                {roi == null ? "X" : roi}
            </Typography>
            <p className='box-p'>%</p>
          </Paper>
        </div>

        <div>
          <Typography variant='subtitle2'>IRR</Typography>
          <Paper elevation={0} className='paper-flex' style={{ backgroundColor: "transparent" }}>
            <Typography variant='h4' gutterBottom>
                {irr == 0.0 ? 'X' : irr}
            </Typography>
            <p className='box-p'>%</p>
          </Paper>
        </div>
      </div>

      <div className='irr-compare-flex'>
        <div>
            <Typography variant='subtitle2'>NPV</Typography>
            <Paper elevation={0} className='paper-flex' style={{ backgroundColor: "transparent" }}>
              <p className='box-p' style={{ color: `${npv > 0 ? 'green' : 'red'}`}}>$</p>
              <Typography variant='h4' gutterBottom>
                 {npv}
              </Typography>
            </Paper>
          </div>

        {(irr > (projectInfo.discountRate)) ? (
            <ThumbUpAltIcon style={{ height: '50px', width: '50px', color: 'green' }} />
          ) : (
            <ThumbDownAltIcon style={{ height: '50px', width: '50px', color: 'red' }} />
          )}
      </div>

      <Button variant='outlined' size='medium' onClick={addResultsToHistory}>
        Record Project&nbsp;
        <EditNoteIcon />
      </Button>
    </>
    )
}

export default Results