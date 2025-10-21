import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/styles/general.css'
import { iconMap } from './IconsMap'

function Sidebar({ sidebarConfig, activeSidebar, setActiveSidebar }) {
    const navigate = useNavigate()

    // const [activeSidebar, setActiveSidebar] = useState(1)
    const [sidebarFixed, setSidebarFixed] = useState(false)

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
            <div className="sidebar-title">
                <div className="title-icon">
                    {iconMap[sidebarConfig.title.iconCode]}
                </div>
            </div>

            {sidebarConfig.pages.map((idx, page) => (
                <div
                    className={`sidebar-entry ${activeSidebar === page.route ? 'active' : ''}`}
                    onClick={() => {
                        setActiveSidebar(page.route)
                        navigate(page.route)
                    }}
                >
                    {iconMap[page.iconCode]}
                    <span>{page.title}</span>
                </div>
            ))}
        </nav>
    )
}

export default Sidebar