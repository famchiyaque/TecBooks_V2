import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/MxRep/Components/General/Header'
import Sidebar from '@/MxRep/Components/General/Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from '@/MxRep/Components/General/SubHeader'
import { sidebarConfig } from '@/MxRep/utils/configs/superadmin.sidebar'
import { useNavigate } from 'react-router-dom'

function Layout() {
    const navigate = useNavigate()
    const location = useLocation()

    const [activeSidebar, setActiveSidebar] = useState("")
    const [sidebarVisible, setSidebarVisible] = useState(true)

    useEffect(() => {
        const splitPath = location.pathname.split('/')
        const pathSuffix = splitPath[splitPath.length - 1]

        const matchingPage = sidebarConfig.pages.find(page => page.route === pathSuffix)
        if (matchingPage) {
            setActiveSidebar(pathSuffix)
        } else if (pathSuffix === 'super-admin-panel' || pathSuffix === '') {
            setActiveSidebar(sidebarConfig.defaultRoute)
            if (location.pathname.endsWith('/super-admin-panel') || location.pathname.endsWith('/super-admin-panel/')) {
                navigate(sidebarConfig.defaultRoute, { replace: true })
            }
        }
    }, [location, navigate]);

    return (
        <>
            <Header />
            <SubHeader 
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
                activeSidebar={activeSidebar}
                period={null}
                setPeriod={null}
                year={null}
                setYear={null}
            />

            <div>  
                <div className={`sidebar-state ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
                    <Sidebar 
                        sidebarConfig={sidebarConfig}
                        activeSidebar={activeSidebar} 
                        setActiveSidebar={setActiveSidebar}
                    />
                </div>

                <div className={`${sidebarVisible ? 'view' : 'view-no-sidebar'}`}>
                    <Outlet />
                </div>
            </div>    
        </>
    );
}

export default Layout

