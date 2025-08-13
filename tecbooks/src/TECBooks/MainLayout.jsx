import { Outlet, useLocation } from 'react-router-dom'
import Header from './Comps/Header'
import Sidebar from './Comps/Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from './Comps/SubHeader'
import Loader from './Comps/Loader'
import { useExcel } from './Comps/ExcelContext'

function MainLayout() {
    const [activeSidebar, setActiveSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const { loading } = useExcel()

    // const today = new Date()
    const [period, setPeriod] = useState(null)
    // const [year, setYear] = useState(today.getFullYear())

    const location = useLocation()

    const routeToSidebarMap = {
        'overview': 1,
        'statements': 2,
        'financial-health': 3
        // 'forecasts': 4,
    }

    useEffect(() => {
        const pathParts = location.pathname.split('/')
        const lastPart = pathParts[pathParts.length - 1]
        const matchedSidebar = routeToSidebarMap[lastPart] || 1
        setActiveSidebar(matchedSidebar)
    }, [location])

    // console.log("active sidebar: ", activeSidebar)
    if (activeSidebar == 0) return <Loader />

    return (
        <>
            <Header />
            <SubHeader sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} activeSidebar={activeSidebar}
                period={period} setPeriod={setPeriod} 
                // year={year} setYear={setYear} 
            />

            <div>  
                <div className={`sidebar-state ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
                    <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />
                </div>

                <div className={`${sidebarVisible ? 'view' : 'view-no-sidebar'}`}>
                    {loading ? <Loader /> : <Outlet context={{ period }} />}
                    {/* <Outlet context={{ period, year }} /> */}
                </div>
            </div>    
        </>
    );
}

export default MainLayout