import '../styles/general.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ExcelProvider } from './Comps/ExcelContext'
import MainLayout from './MainLayout'
import Overview_View from './OverView/Overview_View'
// import FinanceKPIs_View from './Finance_KPIs/Finance_KPI_View'
import Financial_Statement_View from './Financial_Statement/Finance_Statement_View'
import Forecasts_View from './Forecasts/Forecasts_View'
import { Navigate } from 'react-router-dom'
// import { SimDataProvider, useSimData } from './SimDataContext'

function TECBooks() {
    const location = useLocation()
    const navigate = useNavigate()
    const [initialExcelData] = useState(location.state?.excelData || null);

    // const { excelData } = useExcel()
    // console.log("In TECBooks dashboard, going to log the read excel data: ")
    // console.log(initialExcelData)

    useEffect(() => {
        if (!initialExcelData) {
          navigate('/home');
        }
      }, [initialExcelData, navigate]);

    // if (!initialExcelData) navigate('/home')

    return (
        <ExcelProvider initialData={initialExcelData}>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="overview" />} />
                    <Route path="overview" element={<Overview_View />} />
                    <Route path="statements" element={<Financial_Statement_View />} />
                    {/* <Route path="financial-health" element={<FinanceKPIs_View />} /> */}
                    <Route path="forecasts" element={<Forecasts_View />} />
                </Route>
            </Routes>
        </ExcelProvider>
    )
}

export default TECBooks