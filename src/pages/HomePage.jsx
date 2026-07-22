import React from 'react'
import '@/styles/homepage.css'
import Landing from '@/components/home/sections/Landing'
import UsersPage from '@/components/home/sections/Users'
import Page1 from '@/components/home/sections/Page1'
import Page2 from '@/components/home/sections/Page2'
import Sims from '@/components/home/sections/Sims'
import Features from '@/components/home/Features'
import Footer from '@/components/home/Footer'

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
