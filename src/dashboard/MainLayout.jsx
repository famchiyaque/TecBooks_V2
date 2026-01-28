import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from './components/SubHeader'
import Loader from './components/Loader'
import { useDashboard } from '@/core/store'

function MainLayout() {
    const [activeSidebar, setActiveSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const { loading } = useDashboard()

    const [period, setPeriod] = useState(null)

    const location = useLocation()

    const routeToSidebarMap = {
        'project-evaluation': 0,
        'overview': 1,
        'statements': 2,
        'forecasts': 3,
        'finance-kpis': 4,
        'financial-statement': 5,
        'productivity': 6,
    }

    useEffect(() => {
        const pathParts = location.pathname.split('/')
        const lastPart = pathParts[pathParts.length - 1]
        const matchedSidebar = routeToSidebarMap[lastPart]
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
                period={period} 
                setPeriod={setPeriod} 
            />

            <div>  
                <div className={`sidebar-state ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
                    <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />
                </div>

                <div className={`${sidebarVisible ? 'view' : 'view-no-sidebar'}`}>
                    {loading ? <Loader /> : <Outlet context={{ period }} />}
                </div>
            </div>    
        </>
    );
}

export default MainLayout
