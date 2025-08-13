import '../../styles/homepage.css'
// import { useContext } from 'react'
import React from 'react'
// import Landing from './Landing'
import Simulator from './Simulator'
// import { Routes, Route } from 'react-router-dom'
// import 'materialize-css/dist/css/materialize.min.css'
// import { SimContext } from './SimContext'


function Investments_View() {

    return (
        <>
            <Simulator />
            {/* <Outlet /> */}
            {/* <Routes>
                <Route index element={<Landing />} />
                <Route path='simulator' element={<Simulator />} />
            </Routes> */}
        </>
    )
}

export default Investments_View