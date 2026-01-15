import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'

function Results({ breakEven, roi, irr, npv, discountRate, addHistory }) {

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

        {(irr > (discountRate)) ? (
            <ThumbUpAltIcon style={{ height: '50px', width: '50px', color: 'green' }} />
          ) : (
            <ThumbDownAltIcon style={{ height: '50px', width: '50px', color: 'red' }} />
          )}
      </div>

      <Button variant='outlined' size='medium' style={{ marginBottom: "2rem"}} onClick={addHistory}>
        Record Project&nbsp;
        <EditNoteIcon />
      </Button>
    </>
    )
}

export default Results