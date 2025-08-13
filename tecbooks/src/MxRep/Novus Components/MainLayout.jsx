import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from './SubHeader'
import Loader from './Loader'

function MainLayout() {
    const [activeSidebar, setActiveSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const today = new Date()
    const [period, setPeriod] = useState(today.getMonth())
    const [year, setYear] = useState(today.getFullYear())

    const location = useLocation()

    const routeToSidebarMap = {
        'overview': 1,
        'statements': 2,
        'financial-health': 3,
        'forecasts': 4,
        'production-line': 5,
        'investments': 6
    };

    useEffect(() => {
        const pathParts = location.pathname.split('/')
        const lastPart = pathParts[pathParts.length - 1]
        const matchedSidebar = routeToSidebarMap[lastPart] || 1
        setActiveSidebar(matchedSidebar);
    }, [location]);

    console.log("active sidebar: ", activeSidebar)
    if (activeSidebar == 0) return <Loader />
    else {

    return (
        <>
            <Header />
            <SubHeader sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} activeSidebar={activeSidebar}
                period={period} year={year} setPeriod={setPeriod} setYear={setYear} />

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
}

export default MainLayout