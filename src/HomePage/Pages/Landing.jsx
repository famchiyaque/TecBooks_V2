import React from 'react'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import EastIcon from '@mui/icons-material/East'
import Header from '../Comps/Header'
// import gif from '../../public/graph-gif.gif'

function Landing() {
    const navigate = useNavigate()

    const goToDashboard = () => {
        navigate('/mxrep-dashboard')
    }

    const scrollTecbooks = () => {
        navigate('/home');
        // Use setTimeout to ensure navigation completes before scrolling
        setTimeout(() => {
        const element = document.getElementById('tecbooks-page');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        }, 100);
    }

    const scrollMxRep = () => {
        navigate('/home')

        setTimeout(() => {
            const element = document.getElementById('mxrep-page')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }, 100)
    }

    return (
        <div className='landing'>
            <Header />
            <div className='landing-main'>
                {/* <img src={`${process.env.PUBLIC_URL}/graph-gif.gif`}></img> */}
                <div className='landing-titles'>
                    <Typography sx={{ fontWeight: '700', fontSize: '15vh', lineHeight: '1' }}>TECBooks</Typography>
                    <Typography variant='h4' sx={{ fontWeight: '600', mt: 1 }}>Financial Education Platform</Typography>
                </div>
                <Typography variant='h6' className='landing-desc' sx={{ lineHeight: '1.6' }}>
                    Learn business accounting and project evaluation. Generate comprehensive 
                    dashboards, explore educational simulators, and master financial decision-making.
                </Typography>
                <div className='landing-btn-group' style={{ flexBasis: '20%' }}>
                    <button className='landing-btn' onClick={scrollTecbooks}>
                        Get Your Dashboard
                    </button>
                    <button className='learn-more' onClick={scrollMxRep}>
                        Explore Simulators
                        <EastIcon className='landing-learn-btn' sx={{ height: '100%' }} />  
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Landing