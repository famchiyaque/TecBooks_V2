import { Outlet } from 'react-router-dom'
import GenericHeader from '@/Global Components/GenericHeader'
import GenericSubheader from "@/Global Components/GenericSubheader"
import React, { useState } from 'react'
import Sidebar from '@/MxRep/Components/General/DropdownSidebar'
// import SubHeader from './SubHeader'
// import Loader from './Loader'

function Layout() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    
    const handleOpenSidebar = (event) => {
      setAnchorEl(event.currentTarget)
    }
    
    const handleCloseSidebar = () => {
      setAnchorEl(null)
    }

    return (
        <>
            <div className='flex flex-col min-h-screen'>
                <GenericHeader pageName={"Registry"} />
                <GenericSubheader 
                    subheader={""}
                    onOpenSidebar={handleOpenSidebar}
                />

                <Sidebar
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleCloseSidebar}
                />

                <div className='flex-1 overflow-y-auto py-8'>
                    <div className='w-full flex justify-center items-start'>
                        <Outlet />
                    </div>
                </div> 
            </div>   
        </>
    );
}
// }

export default Layout