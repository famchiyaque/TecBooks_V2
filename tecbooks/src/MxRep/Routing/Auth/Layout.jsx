import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import GenericHeader from '@/Global Components/GenericHeader'
import GenericSubheader from "@/Global Components/GenericSubheader"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/MxRep/Components/General/DropdownSidebar'
// import SubHeader from './SubHeader'
// import Loader from './Loader'

function Layout() {
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [subPage, setSubPage] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpenSidebar = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseSidebar = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const splitPath = location.pathname.split('/')
    const pathSuffix = splitPath[splitPath.length - 1]

    switch (pathSuffix) {
      case "login": setSubPage("Sign In")
      case "forgot-password": setSubPage("Forgot Password")
      case "reset-password": setSubPage("Reset Password")
      default: setSubPage("Auth")
    }
  }, [])

    return (
        <>
            <GenericHeader pageName={"Auth"} />
            <GenericSubheader 
              subheader={subPage} 
              onOpenSidebar={handleOpenSidebar}
            />

            <Sidebar
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseSidebar}
            />

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