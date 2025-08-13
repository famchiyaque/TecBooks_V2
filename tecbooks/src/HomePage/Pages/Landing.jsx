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

    return (
        <div className='landing'>
            <Header />
            <div className='landing-main'>
                {/* <img src={`${process.env.PUBLIC_URL}/graph-gif.gif`}></img> */}
                <div className='landing-titles'>
                    <Typography sx={{ fontWeight: '600', fontSize: '15vh' }}>TECBooks</Typography>
                    <Typography variant='h4' sx={{ fontWeight: '600'}}>Financial Education and Accounting</Typography>
                </div>
                <Typography variant='h6' className='landing-desc'>
                    Generate your business's financial dashboard and documents, play with 
                    our available educational simulators, and more with TECBooks.
                </Typography>
                <div className='landing-btn-group' style={{ flexBasis: '20%' }}>
                    <button className='landing-btn' onClick={scrollTecbooks}>Get Your TECBooks</button>
                    {/* <button className='learn-more' onClick={goToDashboard}> */}
                    <button className='learn-more' onClick={scrollTecbooks}>
                        Learn More
                        <EastIcon className='landing-learn-btn' sx={{ height: '100%' }} />  
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Landing