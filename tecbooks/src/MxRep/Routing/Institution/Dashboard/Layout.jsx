import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom'
import SharedHeader from '@/MxRep/Components/General/SharedHeader'
import SharedSubheader from '@/MxRep/Components/General/SharedSubheader'
import Sidebar from '@/MxRep/Components/Dashboard/Sidebar'
import React, { useState, useEffect } from 'react'
import Loader from '@/Global Components/Loader'
import { useSimData } from '@/MxRep/utils/contexts/SimDataContext'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { MdDashboard } from 'react-icons/md'
import { FaFileInvoiceDollar, FaChartPie, FaRegChartBar  } from 'react-icons/fa'
import { BiTrendingUp } from 'react-icons/bi'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'

function MainLayout() {
    const { gameId, runId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const { simData } = useSimData()
    const [activeSidebar, setActiveSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const [isLoadingRun, setIsLoadingRun] = useState(true)

    const location = useLocation()

    // Log the params for debugging
    useEffect(() => {
        console.log("[DASHBOARD LAYOUT] gameId:", gameId)
        console.log("[DASHBOARD LAYOUT] runId:", runId)
    }, [gameId, runId])

    // TODO: Fetch run data based on gameId and runId
    // For now, just set loading to false after a brief delay
    useEffect(() => {
        if (gameId && runId) {
            // Simulate data loading
            setTimeout(() => {
                setIsLoadingRun(false)
            }, 500)
        }
    }, [gameId, runId])

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
    
    // Show loader while initializing
    if (activeSidebar == 0 || isLoadingRun) {
        return <Loader message="Loading dashboard..." />
    }

    // Validate that we have the required params
    if (!gameId || !runId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Dashboard Route</h2>
                    <p className="text-gray-600 mb-4">Missing game or run information</p>
                    <button 
                        onClick={() => navigate(`/mxrep/${user?.institution?.slug}/student-panel/my-games`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Games
                    </button>
                </div>
            </div>
        )
    }

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
                    <Outlet context={{ period: "January", year: "2024", gameId, runId }} />
                </div>
            </div>    
        </>
    );
}

export default MainLayout