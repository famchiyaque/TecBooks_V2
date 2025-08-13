import React from 'react'
import { Typography } from '@mui/material'
import EastIcon from '@mui/icons-material/East'
import { useNavigate } from 'react-router-dom'

function Page1() {
    const navigate = useNavigate()

    const goToSurvey = () => {
        navigate("/survey")
    }

    const goToTemplateUpload = () => {
        navigate("/template-upload")
    }

    const getTemplate = () => {
        console.log("downloading template")
    }

    // const [isTight, setIsTight] = useState(false);
    
    //   useEffect(() => {
    //     const checkOrientation = () => {
    //       setIsPortrait(window.innerWidth < );
    //     };
    
    //     checkOrientation();
    //     window.addEventListener('resize', checkOrientation);
    //     return () => window.removeEventListener('resize', checkOrientation);
    //   }, []);

  return (
    <div className="page-container blue-page" id="tecbooks-page">
        <div className='page-topper'>for independent users and/or businesses</div>
        <Typography className='page-main-title'
            sx={{ fontWeight: '600', paddingLeft: '10vw', fontSize: '2.5rem' }}>
                Make your own TECBooks!
        </Typography>
        <div className='template-flex'>
            <div className='template-1'>
                <div>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.8rem' }}>Complete</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
                        our business questionnaire with your business's details
                    </Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={'/imgs/surveyor_landing.png'} style={{ boxShadow: 'none', width: '35%' }}  />
                </div>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <button className='landing-btn smaller' style={{ marginLeft: '10%' }} onClick={goToSurvey}>
                        Start Cuestionare
                    </button>
                </div>
                <a className='credits-a' href="https://www.freepik.com/icon/survey_2222295#fromView=search&page=1&position=20&uuid=1a015019-e55b-486d-9c01-558f612755a3">Icon by Freepik</a>    
            </div>
            <div className='temp-arrow'>
                <EastIcon sx={{ fontSize: '2rem' }} /> 
            </div>
            <div className='template-2'>
                <div>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.8rem' }}>Fill Out</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
                        your excel template with your business's financial data
                    </Typography>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <img src={'/imgs/excel_icon.png'} style={{ boxShadow: 'none', width: '80%' }} />
                </div>
                {/* <EastIcon sx={{ fontSize: '2rem' }} /> */}
            </div>
            <div className='temp-arrow'>
                <EastIcon sx={{ fontSize: '2rem' }} />
            </div> 
            <div className='template-3'>
                <img src={'/imgs/submit_landing.png'} style={{ boxShadow: 'none', width: '35%', margin: '0 auto' }} />
                <div>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.8rem' }}>Upload It</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
                        here to generate everything from income statements, 
                        balance sheets, and forecasts.
                    </Typography>
                </div>
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <button className='landing-btn smaller' 
                        style={{ marginRight: '10%' }}
                        onClick={goToTemplateUpload}>
                        Upload Template
                    </button>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography sx={{  fontSize: 'x-small' }}>Already have your template? Skip the quiz and upload it here!</Typography>
                </div>
                <a className='credits-a' href="https://www.freepik.com/icon/submit_2601814#fromView=search&page=1&position=32&uuid=d7849f54-aeb4-4ec8-ab89-0f2641d63a2a">Icon by Freepik</a>
            </div>
        </div>
    </div>
  )
}

export default Page1