import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDashboard, MdCandlestickChart } from 'react-icons/md'
import { FaFileInvoiceDollar, FaChartPie, FaRegChartBar  } from 'react-icons/fa'
import { RiBankFill } from "react-icons/ri";
// import { BsBank } from "react-icons/bs";
import { BiTrendingUp } from 'react-icons/bi'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import '../../styles/general.css'

function Sidebar({ activeSidebar, setActiveSidebar }) {
    // const [activeSidebar, setActiveSidebar] = useState(1)
    const [sidebarFixed, setSidebarFixed] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            const elevenVH = window.innerHeight * 0.11

            if (window.scrollY > elevenVH) setSidebarFixed(true)
            else setSidebarFixed(false)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [])

    return (
        <nav className={`sidebar ${sidebarFixed ? 'sidebar-fixed': ''}`}>
            <div className="sidebar-title" >
                <div className="title-icon">
                    <RiBankFill />
                </div>
                <div className="title-content">
                    <div className="title-main">Novus</div>
                    <div className="title-sub">Financial Dashboard</div>
                </div>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 1 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(1)
                    navigate('overview')
                }}>
                    <MdDashboard className="sidebar-icon" />
                    <span>Overview</span>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 2 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(2)
                    navigate('statements')
                }}>
                    <FaFileInvoiceDollar className="sidebar-icon" />
                    <span>Financial Statement</span>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 3 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(3)
                    navigate('financial-health')
                }}>
                    <FaRegChartBar className="sidebar-icon" />
                    <span>Financial Health</span>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 4 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(4)
                    navigate('forecasts')
                }}>
                    <BiTrendingUp className="sidebar-icon" />
                    <span>Forecasts</span>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 5 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(5)
                    navigate('production-line')
                }}>
                    <PrecisionManufacturingIcon className="sidebar-icon" />
                    <span>Production Line</span>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 6 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(6)
                    navigate('investments')
                }}>
                    <FaChartPie className="sidebar-icon" />
                    <span>Investments</span>
            </div>
        </nav>
    )
}

export default Sidebar