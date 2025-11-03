import { Outlet, useLocation } from 'react-router-dom'
import SharedHeader from '@/MxRep/Components/General/SharedHeader'
import SharedSubheader from '@/MxRep/Components/General/SharedSubheader'
import Sidebar from '@/MxRep/Components/Dashboard/Sidebar'
import React, { useState, useEffect } from 'react'
import Loader from '@/Global Components/Loader'
import { useSimData } from '@/MxRep/utils/contexts/SimDataContext'
import { MdDashboard } from 'react-icons/md'
import { FaFileInvoiceDollar, FaChartPie, FaRegChartBar  } from 'react-icons/fa'
import { BiTrendingUp } from 'react-icons/bi'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'

function MainLayout() {
    const { simData } = useSimData()
    const [activeSidebar, setActiveSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const location = useLocation()

    const routeToSidebarMap = {
        'overview': 1,
        'statements': 2,
        'financial-health': 3,
        'forecasts': 4,
        'production-line': 5,
        'investments': 6
    };

    const icons = {
        1: <MdDashboard className="sidebar-icon" />,
        2: <FaFileInvoiceDollar className="sidebar-icon" />,
        3: <FaRegChartBar className="sidebar-icon" />,
        4: <BiTrendingUp className="sidebar-icon" />,
        5: <PrecisionManufacturingIcon className="sidebar-icon" />,
        6: <FaChartPie className="sidebar-icon" />,
    }

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
            <SharedHeader simData={simData} />
            <SharedSubheader 
                showSidebarToggle={true}
                onSidebarToggle={setSidebarVisible}
                sidebarVisible={sidebarVisible}
                activeSidebarIcon={icons[activeSidebar]}
            />

            <div>  
                <div className={`sidebar-state ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
                    <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />
                </div>

                <div className={`${sidebarVisible ? 'view' : 'view-no-sidebar'}`}>
                    <Outlet />
                </div>
            </div>    
        </>
    );
}
}

export default MainLayout