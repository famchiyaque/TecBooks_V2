import React, { useState } from "react"
import "./../../styles/statement.css"
import { useExcel } from "../Comps/ExcelContext"
// import { PDFDocument, StandardFonts, rgb } from "@react-pdf/renderer"; // already commented since Leo
// import Card from "@mui/material/Card"
import Loader from "../Comps/Loader"
import Income from "./Pages/Income"
import BalanceSheet from "./Pages/BalanceSheet"
// import { useNavigate } from "react-router-dom"
import { useOutletContext } from "react-router-dom"
import Cashflows from './Pages/Cashflows'
import Left from "./Buttons/Left"
import Right from './Buttons/Right'

function FinancialStatement() {
  // const [showIncomeStatement, setShowIncomeStatement] = useState(true);
  const [activePaper, setActivePaper] = useState(2)
  // const navigate = useNavigate()
  const { loading } = useExcel()
  const { period } = useOutletContext()

  if (loading) return <Loader />

  const handlePageChange = (value) => {
    setActivePaper(value)
  }

  return (
    <div className="financial-statement">
      <div className="statement-container">
          <Left activePaper={activePaper} handlePageChange={handlePageChange} />
          <Right activePaper={activePaper} handlePageChange={handlePageChange} />
          {activePaper === 1 ? <Cashflows period={period} /> : ''}
          {activePaper === 2 ? <Income period={period} /> : ''}
          {activePaper === 3 ? <BalanceSheet period={period} /> : ''}
      </div>
    </div>
  )
}

export default FinancialStatement