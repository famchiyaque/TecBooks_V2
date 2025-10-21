import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/MxRep/Components/Header'
import Sidebar from '@/MxRep/Components/Sidebar'
import React, { useState, useEffect } from 'react'
import SubHeader from '@/MxRep/Components/SubHeader'
import { sidebarConfig } from '@/MxRep/utils/configs/professor.sidebar'
import { useNavigate } from 'react-router-dom'

function Layout() {
    const navigate = useNavigate()

    const [activeSidebar, setActiveSidebar] = useState("")
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const location = useLocation()

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