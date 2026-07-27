import React from 'react'
import Typography from '@mui/material/Typography'
// import Carousel from '../Comps/Carousel'
// import MoreCard from '../Comps/MoreCard'

function UsersPage() {

  return (
    <div id="users-page" className='page-container page-1'>
      <div className='more-text' style={{ textAlign: 'center' }}>
        <a className='more-a'>who we serve</a>
        <Typography variant="h3" sx={{ fontWeight: '700', mb: 2 }}>
          Built for Everyone
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: '400', color: '#555' }}>
          From students to enterprises, TECBooks adapts to your needs
        </Typography>
        <Typography variant="subtitle1" sx={{ width: '80%', lineHeight: '1.8', mt: 2 }}>
          TECBooks empowers you to take control of your finances with intelligent automation.
          We handle the complex calculations and data processing behind the scenes, delivering
          clear visualizations, comprehensive dashboards, and professional financial statements.
        </Typography>
      </div>
      
      <div className='users-container'>
        <div className='user-card'>
          <img src={'/imgs/student_landing.png'} alt="Students" />
          <Typography variant="h6" sx={{ fontWeight: '700', mt: 2, mb: 1 }}>
            Students & Individuals
          </Typography>
          <p>Learn financial management by evaluating personal projects or treating your finances as a business venture.</p>
          <a className='credits-a' href="https://www.freepik.com/icon/student_3153030#fromView=search&page=1&position=8&uuid=54b4cab9-fadb-42ff-9f10-5de92b2c28ed" target='_blank' rel="noreferrer">Icon by Freepik</a>
        </div>
        <div className='user-card'>
          <img src={'/imgs/business_landing.png'} alt="Businesses" />
          <Typography variant="h6" sx={{ fontWeight: '700', mt: 2, mb: 1 }}>
            Businesses
          </Typography>
          <p>Generate professional financial documents, identify improvement opportunities, and make data-driven decisions.</p>
          <a className='credits-a' href="https://www.freepik.com/icon/business_3412953#fromView=search&page=1&position=2&uuid=7e69016d-1715-4ed5-a3de-cdd42133b167" target='_blank' rel="noreferrer">Icon by catkuro</a>
        </div>
        <div className='user-card'>
          <img src={'/imgs/assembly-line_landing.png'} alt="MxRep Teams" />
          <Typography variant="h6" sx={{ fontWeight: '700', mt: 2, mb: 1 }}>
            MxRep Teams
          </Typography>
          <p>Seamlessly integrate production line simulation data with financial analysis for comprehensive business insights.</p>
          <a className='credits-a' href="https://www.freepik.com/icon/assembly-line_12093228#fromView=search&page=1&position=20&uuid=2fdeee01-8d30-436d-b6d4-6df96d97311a" target='_blank' rel="noreferrer">Icon by Graphiverse</a>
        </div>
      </div>
    </div>
  )
}

export default UsersPage