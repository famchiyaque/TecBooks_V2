import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDashboard, MdCandlestickChart } from 'react-icons/md'
import { FaFileInvoiceDollar, FaChartPie, FaRegChartBar, FaCalculator } from 'react-icons/fa'
import { RiBankFill } from "react-icons/ri"
import { BiTrendingUp } from 'react-icons/bi'
import '@/styles/general.css'

function Sidebar({ activeSidebar, setActiveSidebar }) {
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
                    <div className="title-main">TECBooks</div>
                    <div className="title-sub">Financial Dashboard</div>
                </div>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 0 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(0)
                    navigate('project-evaluation')
                }}>
                    <FaCalculator className="sidebar-icon" />
                    <span>Project Evaluation</span>
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
                    <span>Financial Statements</span>
            </div>
            <div 
                className={`sidebar-entry ${activeSidebar === 3 ? 'active' : ''}`}
                onClick={() => {
                    setActiveSidebar(3)
                    navigate('forecasts')
                }}>
                    <BiTrendingUp className="sidebar-icon" />
                    <span>Forecasts</span>
            </div>
        </nav>
    )
}

export default Sidebar
