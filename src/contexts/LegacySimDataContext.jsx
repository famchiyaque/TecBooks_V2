import React, { createContext, useContext, useState, useEffect } from "react"
import { simToken } from "./legacySimData"

const LegacySimDataContext = createContext()

export const useLegacySimData = () => useContext(LegacySimDataContext)

/**
 * Legacy SimData Provider
 * 
 * Isolated context for legacy dashboard sections (Finance KPIs, Financial Statement, Productivity)
 * Uses static data and won't clash with the main DashboardContext
 */
export const LegacySimDataProvider = ({ children }) => {
  const [simData, setSimData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Simulate loading delay then set static data
    setTimeout(() => {
      setError(false)
      setIsLoading(false)
      setSimData(simToken)
    }, 500) // Reduced delay for better UX
  }, [])

  return (
    <LegacySimDataContext.Provider value={{ simData, isLoading, error }}>
      {children}
    </LegacySimDataContext.Provider>
  )
}
