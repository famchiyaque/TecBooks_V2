import { Outlet, useLocation } from 'react-router-dom'
import SharedHeader from '@/MxRep/Components/General/SharedHeader'
import SharedSubheader from '@/MxRep/Components/General/SharedSubheader'
import Sidebar from '@/MxRep/Components/General/Sidebar'
import React, { useState, useEffect } from 'react'
import { sidebarConfig } from '@/MxRep/utils/configs/superadmin.sidebar'
import { useNavigate } from 'react-router-dom'
import { iconMap } from '@/MxRep/Components/General/IconsMap'

function Layout() {
    const navigate = useNavigate()
    const location = useLocation()

    const [activeSidebar, setActiveSidebar] = useState("")
    const [sidebarVisible, setSidebarVisible] = useState(true)

    useEffect(() => {
        const splitPath = location.pathname.split('/')
        const pathSuffix = splitPath[splitPath.length - 1]
        const secondToLast = splitPath[splitPath.length - 2]
        const thirdToLast = splitPath[splitPath.length - 3]

        // Check if we're on a nested route (e.g., /manage-institutions/:institutionId, /inbox/:requestId)
        // In that case, use the parent route for sidebar matching
        let routeToMatch = pathSuffix
        
        if (secondToLast === 'inbox') {
            routeToMatch = 'inbox'
        } else if (secondToLast === 'manage-institutions' || thirdToLast === 'manage-institutions') {
            routeToMatch = 'manage-institutions'
        }

        const matchingPage = sidebarConfig.pages.find(page => page.route === routeToMatch)
        if (matchingPage) {
            setActiveSidebar(routeToMatch)
        } else if (pathSuffix === 'super-admin-panel' || pathSuffix === '') {
            setActiveSidebar(sidebarConfig.defaultRoute)
            if (location.pathname.endsWith('/super-admin-panel') || location.pathname.endsWith('/super-admin-panel/')) {
                navigate(sidebarConfig.defaultRoute, { replace: true })
            }
        } else {
            // Only redirect if route doesn't match any sidebar page and isn't a nested route
            const isNestedRoute = secondToLast === 'inbox' || 
                                  secondToLast === 'manage-institutions'
            
            if (!isNestedRoute) {
                setActiveSidebar(sidebarConfig.defaultRoute)
                navigate(sidebarConfig.defaultRoute)
            }
        }
    }, [location, navigate]);

    // Find the icon for the active sidebar from sidebarConfig
    const getActiveIcon = () => {
        const activePage = sidebarConfig.pages.find(page => page.route === activeSidebar)
        return activePage?.iconCode ? iconMap[activePage.iconCode] : null
    }

    return (
        <>
            <SharedHeader />
            <SharedSubheader 
                showSidebarToggle={true}
                onSidebarToggle={setSidebarVisible}
                sidebarVisible={sidebarVisible}
                activeSidebarIcon={getActiveIcon()}
    // return (
    //     <>
    //         <Header />
    //         <SubHeader 
    //             sidebarVisible={sidebarVisible}
    //             setSidebarVisible={setSidebarVisible}
    //             activeSidebar={activeSidebar}
    //             period={null}
    //             setPeriod={null}
    //             year={null}
    //             setYear={null}
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

