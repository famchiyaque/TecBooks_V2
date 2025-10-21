import { Outlet } from 'react-router-dom'
import GenericHeader from '@/Global Components/GenericHeader'
import GenericSubheader from "@/Global Components/GenericSubheader"
import React from 'react'
import Sidebar from '@/MxRep/Components/Sidebar'
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
            <div>
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

                <div className='w-full h-screen text-center'>
                    <Outlet />
                </div> 
            </div>   
        </>
    );
}
// }

export default Layout