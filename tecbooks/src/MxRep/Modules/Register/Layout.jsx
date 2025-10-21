import { Outlet } from 'react-router-dom'
import GenericHeader from '@/Global Components/GenericHeader'
import GenericSubheader from "@/Global Components/GenericSubheader"
import React from 'react'
// import SubHeader from './SubHeader'
// import Loader from './Loader'

function Layout() {

    return (
        <>
            <div>
                <GenericHeader pageName={"Registry"} />
                <GenericSubheader simName={""} />

                <div className='w-full h-screen text-center'>
                    <Outlet />
                </div> 
            </div>   
        </>
    );
}
// }

export default Layout