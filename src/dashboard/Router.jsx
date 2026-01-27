import '@/styles/homepage.css'
import '@/styles/general.css'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './MainLayout'
import ProjectEvaluation_View from './views/ProjectEvaluation/ProjectEvaluation_View'
import Overview_View from './views/Overview/Overview_View'
import FinancialStatements_View from './views/FinancialStatements/FinancialStatements_View'
import Forecasts_View from './views/Forecasts/Forecasts_View'

function DashboardRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="project-evaluation" />} />
                <Route path="project-evaluation" element={<ProjectEvaluation_View />} />
                <Route path="overview" element={<Overview_View />} />
                <Route path="statements" element={<FinancialStatements_View />} />
                <Route path="forecasts" element={<Forecasts_View />} />
            </Route>
        </Routes>
    )
}

export default DashboardRouter
