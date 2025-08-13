import React, { useState } from "react"
import "./../../styles/statement.css"
import { useSimData } from "../SimDataContext"
// import { PDFDocument, StandardFonts, rgb } from "@react-pdf/renderer"; // already commented since Leo
// import Card from "@mui/material/Card"
import Loader from "../Novus Components/Loader"
import Income from "./Pages/Income"
import BalanceSheet from "./Pages/BalanceSheet"
import { useNavigate } from "react-router-dom"
import { useOutletContext } from "react-router-dom"
import Cashflows from './Pages/Cashflows'
import Left from "./Buttons/Left"
import Right from './Buttons/Right'

function FinancialStatement() {
  // const [showIncomeStatement, setShowIncomeStatement] = useState(true);
  const [activePaper, setActivePaper] = useState(2)
  const navigate = useNavigate()
  const { isLoading, error } = useSimData()
  const { period, year } = useOutletContext()

  if (error) navigate('/novus-dashboard')
  if (isLoading) return <Loader />

  const handlePageChange = (value) => {
    setActivePaper(value)
  }

  return (
    <div className="financial-statement">
      <div className="statement-container">
          <Left activePaper={activePaper} handlePageChange={handlePageChange} />
          <Right activePaper={activePaper} handlePageChange={handlePageChange} />
          {activePaper === 1 ? <Cashflows period={period} year={year} /> : ''}
          {activePaper === 2 ? <Income period={period} year={year} /> : ''}
          {activePaper === 3 ? <BalanceSheet period={period} year={year} /> : ''}
      </div>
    </div>
  )
}

export default FinancialStatement