import React, { createContext, useContext, useEffect, useState } from 'react'
import { processExcelData, getStatements } from '../Calcs/processExcel'

const ExcelContext = createContext()

export const useExcel = () => useContext(ExcelContext)

export function ExcelProvider({ children, initialData }) {
  // const [excelData, setExcelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bizInfo, setBizInfo] = useState(null)
  const [overviewData, setOverviewData] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [costsData, setCostsData] = useState(null)
  const [expensesData, setExpensesData] = useState(null)
  const [statementsData, setStatementsData] = useState(null)

  useEffect(() => {
    if (!initialData) {
      setLoading(false)
      return
    }

    // Simulate async processing
    const processData = () => {
      setLoading(true)
      try {
        const processed = processExcelData(initialData)
        setBizInfo(processed[0])
        setOverviewData(processed[1])
        setRevenueData(processed[2])
        setCostsData(processed[3])
        setExpensesData(processed[4])
      } catch (err) {
        console.error("Error processing Excel data:", err)
      } finally {
        setLoading(false)
      }
    }

    processData()
  }, [initialData])

  useEffect(() => {
    if (bizInfo && overviewData && revenueData && costsData && expensesData) {
      const statements = getStatements(bizInfo, overviewData, revenueData, costsData, expensesData)
      setStatementsData(statements)
    }
  }, [bizInfo, overviewData, revenueData, costsData, expensesData])

  return (
    <ExcelContext.Provider value={{ loading, bizInfo, overviewData, revenueData, costsData, expensesData, statementsData }}>
      {children}
    </ExcelContext.Provider>
  )
}
