import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/MxRep/Components/General/Header'
import Sidebar from '@/MxRep/Components/Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from '@/MxRep/Components/SubHeader'
import { sidebarConfig } from '@/MxRep/utils/configs/admin.sidebar'
import { useNavigate } from 'react-router-dom'

function Layout() {
    const navigate = useNavigate()
    const location = useLocation()

    const [activeSidebar, setActiveSidebar] = useState("")
    const [sidebarVisible, setSidebarVisible] = useState(true)

    useEffect(() => {
        const splitPath = location.pathname.split('/')
        const pathSuffix = splitPath[splitPath.length - 1]

        if (sidebarConfig.pages.map((idx, val) => val.route === pathSuffix )) {
            setActiveSidebar(pathSuffix)
            // navigate(pathSuffix)
        } else {
            setActiveSidebar(sidebarConfig.defaultRoute)
            navigate(sidebarConfig.defaultRoute)
        }
    }, [location]);

    return (
        <>
            <Header />
            <SubHeader 
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
                activeSidebar={activeSidebar}
            />

            <div>  
                <div className={`sidebar-state ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
                    <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />
                </div>

                <div className={`${sidebarVisible ? 'view' : 'view-no-sidebar'}`}>
                    <Outlet context={{ period, year }} />
                </div>
            </div>    
        </>
    );
}

export default Layout