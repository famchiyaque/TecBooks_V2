import { Outlet } from 'react-router-dom'
import SharedHeader from '@/MxRep/Components/General/SharedHeader'
import SharedSubheader from '@/MxRep/Components/General/SharedSubheader'
import React from 'react'

function Layout() {
    return (
        <div className='flex flex-col min-h-screen'>
            <SharedHeader />
            <SharedSubheader />

            <div className='flex-1 overflow-y-auto py-8'>
                <div className='w-full flex justify-center items-start'>
                    <Outlet />
                </div>
            </div> 
        </div>
    );
}
// }

export default Layout