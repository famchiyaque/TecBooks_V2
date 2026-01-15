import { Outlet } from 'react-router-dom'
import SharedHeader from '@/MxRep/Components/General/SharedHeader'
import SharedSubheader from '@/MxRep/Components/General/SharedSubheader'
import React from 'react'

function Layout() {
    return (
        <>
            <SharedHeader />
            <SharedSubheader />

            <div className='w-full h-screen text-center'>
              <div className='w-[50%] min-h-[calc(100vh-100px)] m-auto flex flex-col justify-center items-center'>
                <Outlet />
              </div>
            </div>    
        </>
    );
}
// }

export default Layout