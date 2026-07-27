import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from '@/components/dashboard/SubHeader'
import Loader from '@/components/dashboard/Loader'
import { useDashboard } from '@/contexts'

function Layout() {
    const [activeSidebar, setActiveSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const { loading } = useDashboard()

    const location = useLocation()

    const pathToIndex = {
        'project-evaluation': 0,
        'overview': 1,
        'accounting': 2,
        'finances': 3,
        'forecasts': 4,
    }

    useEffect(() => {
        const pathParts = location.pathname.split('/')
        const lastPart = pathParts[pathParts.length - 1]
        const matchedSidebar = pathToIndex[lastPart]
        if (matchedSidebar !== undefined) {
            setActiveSidebar(matchedSidebar)
        }
    }, [location])

    if (activeSidebar === null) return <Loader />

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
                    {loading ? <Loader /> : <Outlet />}
                </div>
            </div>    
        </>
    );
}

export default Layout
