import '../styles/homepage.css'
import '../styles/general.css'
import React, { useState } from 'react'
import MainLayout from './Novus Components/MainLayout'
// import Loader from './Novus Components/Loader'
import Overview_View from './OverView/Overview_View'
import Productivity_View from './Productivity/Productivity_View'
import FinanceKPIs_View from './Finance_KPIs/Finance_KPI_View'
import Financial_Statement_View from './Financial_Statement/Finance_Statement_View'
import Forecasts_View from './Forecasts/Forecasts_View'
import Investments_View from './Investments/Investments_View'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { SimDataProvider, useSimData } from './SimDataContext'

function Main() {
    console.log("rendering Main")
    // const { sim } = useSimData()

    // const { simData, isLoading, error } = useSimData()

    // const [activeView, setActiveView] = useState(1)
    // const [activeSidebar, setActiveSidebar] = useState(1)

    // const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkpvaG4gRG9lIiwic2ltdWxhdGlvbk5hbWUiOiJNeSBTaW11bGF0aW9uIiwicHJvZHVjdCI6IldpZGdldCIsImlhdCI6MTcyNzg2MjkwOSwiZXhwIjoxNzI3ODY2NTA5fQ.hLIlINXDt4Ltncu4npydGLkEba-tzLc3sZLKoKr8QbI"

    // console.log("sim after useEffect: ", simData)

    // if (isLoading == true) return <Loader />
    // if (simData == null || error == true) return <Navigate to="/error" />

    // const simUserInfo = {"name": simData.userName, "teamName": simData.teamName, "ranking": simData.placement}

    return (
        <SimDataProvider>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="overview" />} />
                    <Route path="overview" element={<Overview_View />} />
                    <Route path="production-line" element={<Productivity_View />} />
                    <Route path="financial-health" element={<FinanceKPIs_View />} />
                    <Route path="statements" element={<Financial_Statement_View />} />
                    <Route path="forecasts" element={<Forecasts_View />} />
                    <Route path="investments" element={<Investments_View />} />
                </Route>
            </Routes>
        </SimDataProvider>
    )
}

export default Main