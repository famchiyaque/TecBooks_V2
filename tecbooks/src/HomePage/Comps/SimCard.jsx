import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import EastIcon from '@mui/icons-material/East'

export default function MediaCard({ title, img_path, desc, sim_route }) {
    const navigate = useNavigate()

    const handleGoToSim = () => {
      navigate(sim_route)
    }

    const style = {
      maxWidth: 345,
      cursor: 'pointer',
      // boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      // boxShadow: '#eec60a 0px 3px 8px',
      boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, navy 0px 0px 0px 1px',
      borderRadius: '15px'
    }

  return (
    <Card sx={style}>
      <CardMedia
        sx={{ height: 140 }}
        image={`/imgs/${img_path}`}
        title="card title"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: '600' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {desc}
        </Typography>
      </CardContent>
      <CardActions>
        <div style={{ width: '100%', marginLeft: 'auto', paddingRight: '1rem' }}>
            <button className='learn-more continue-btn' onClick={handleGoToSim} style={{ color: '#eec60a' }}>
                Go To Sim
                <EastIcon className='landing-learn-btn' sx={{ height: '100%', fontSize: '120%', fontWeight: '600' }} /> 
            </button>
        </div>
        {/* <Button size="small">Share</Button> */}
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}