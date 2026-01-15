import React from 'react'
import Typography from '@mui/material/Typography'
// import Carousel from '../Comps/Carousel'
// import MoreCard from '../Comps/MoreCard'

function UsersPage() {

  return (
    <div id="users-page" className='page-container page-1'>
      <div className='more-text' style={{ textAlign: 'center' }}>
        <a className='more-a'>what we do</a>
        <Typography variant="h3" sx={{ fontWeight: '600' }}>An Interactive Experience: </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '600' }}>Empowering Students and Businesses</Typography>
        <Typography variant="subtitle1" sx={{ width: '80%' }}>
          TECBooks is made to help you and <b>your business</b> take control of your finances by
          letting the code do the nitty gritty behind the scenes to present dashboards with valuable
          visualizations and organized accounting.
        </Typography>
      </div>
      
      <div className='users-container'>
        <div className='user-card'>
          <img src={'/imgs/student_landing.png'} />
          <p>Students/Individuals who want to evaluate their personal finances as a business.</p>
          <a className='credits-a' href="https://www.freepik.com/icon/student_3153030#fromView=search&page=1&position=8&uuid=54b4cab9-fadb-42ff-9f10-5de92b2c28ed" target='_blank'>Icon by Freepik</a>
        </div>
        <div className='user-card'>
          <img src={'/imgs/business_landing.png'} />
          <p>Businesses looking for areas of improvement or to generate finacial documents.</p>
          <a className='credits-a' href="https://www.freepik.com/icon/business_3412953#fromView=search&page=1&position=2&uuid=7e69016d-1715-4ed5-a3de-cdd42133b167" target='_blank'>Icon by catkuro</a>
        </div>
        <div className='user-card'>
          <img src={'/imgs/assembly-line_landing.png'} />
          <p>Teams from MxRep Production Line Simulator, who have a special link to this app.</p>
          <a className='credits-a' href="https://www.freepik.com/icon/assembly-line_12093228#fromView=search&page=1&position=20&uuid=2fdeee01-8d30-436d-b6d4-6df96d97311a" target='_blank'>Icon by Graphiverse</a>
        </div>
      </div>
    </div>
  )
}

export default UsersPage