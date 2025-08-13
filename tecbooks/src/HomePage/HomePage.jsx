import React from 'react'
import '../styles/homepage.css'
import Landing from './Pages/Landing'
import UsersPage from './Pages/Users'
import Page1 from './Pages/Page1'
import Page2 from './Pages/Page2'
import Sims from './Pages/Sims'
import Features from './Comps/Features'
import Footer from './Comps/Footer'

function HomePage() {
    return (
        <div className='homepage'>
            <Landing />
            <UsersPage />
            <Page1 />
            <Page2 />
            <Sims />
            <Features />
            <Footer />
        </div>
    )
}

export default HomePage