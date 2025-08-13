import React, { useState, useEffect } from 'react'
import { useSimData } from '../../SimDataContext'
import Card from "@mui/material/Card"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getBalanceSheet } from '../Calcs/balance'

function BalanceSheet({ period, year }) {
  const { simData } = useSimData()
  const [balanceSheetArray, setBalanceSheetArray] = useState([])

    useEffect(() => {
        const balanceInfo = getBalanceSheet(simData, period, year)
        setBalanceSheetArray(balanceInfo)
    }, [simData, period, year])

    const generateBalanceSheetPDF = () => {
        console.log("balance sheet pdf clicked")
    }

  return (
    <div className="statement">
        <Card className="max-w-4xl mx-auto bg-white p-8 shadow-lg" elevation={0}>
              {/* Header */}
              <div className="text-center mb-8 page-header">
                <h1 className="text-2xl font-bold mb-2">Balance Sheet</h1>
                <p className="text-gray-600">{simData.teamName}</p>
              </div>

              <div className='balance-contents'>
                <div className='balance-titles'>
                    <br></br>
                    <p>Assets</p>
                      <p className='single-indent'><i>Current Assets</i></p>
                        <p className='double-indent'>Cash and Banks</p>
                        <p className='double-indent'>Customers</p>
                        <p className='double-indent'>Accounts Receivable</p>
                        <p className='double-indent'>Inventory</p>
                          <p className='triple-indent'>Raw Material</p>
                          <p className='triple-indent'>Good in Process</p>
                          <p className='triple-indent'>Finished Goods</p>
                        <p className='double-indent'>Total Current Assets</p>
                    <br></br>
                      <p className='single-indent'><i>Fixed Assets</i></p>
                        <p className='double-indent'>Buildings</p>
                        <p className='double-indent'>Transportation</p>
                        <p className='double-indent'>Machinery</p>
                        <p className='double-indent'>Equipment</p>
                        <p className='double-indent'>Net Accumulated Depreciation</p>
                        <p className='double-indent'>Others</p>
                      <p className='single-indent'>Total Fixed Assets</p>
                    <br></br>
                        <p className='double-indent'>Total Assets</p>
                    <br></br>
                    <p>Liabilites</p>
                      <p className='single-indent'><i>Current Liabilites</i></p>
                        <p className='double-indent'>Suppliers</p>
                        <p className='double-indent'>Accounts Payable</p>
                      <p className='single-indent'>Total Current Liabilities</p>
                    <br></br>
                      <p className='single-indent'>Long-Term Liabilities</p>
                        <p className='double-indent'>Long-Term Accounts Payable</p>
                      <p className='single-indent'>Total Long-Term Liabilities</p>
                    <br></br>
                      <p className='single-indent'>Total Liabilities</p>
                    <br></br>
                    <p>Equity</p>
                      <p className='single-indent'>Capital</p>
                      <p className='single-indent'>Period Earnings</p>
                      <p className='single-indent'>Retain Earnings</p>
                      <p className='single-indent'>Total Equity</p>
                    <br></br>
                        <p className='double-indent'>Liabilities + Equity</p>
                    <br></br>
                </div>

                <div className='balance-data'>
                      {balanceSheetArray.map((obj) => {
                            return <div className='data-column'>
                                      <p>{obj.month}</p>
                                      <br></br>
                                      <br></br>
                                      <p>${obj.cashAndBanks}</p>
                                      <p>${obj.customers}</p>
                                      <p>${obj.accountsReceivable}</p>
                                      <p>${obj.inventory.rawMaterial}</p>
                                      <p>${obj.inventory.goodsInProcess}</p>
                                      <p>${obj.inventory.finishedGoods}</p>
                                      <p>${obj.accountsReceivable}</p>
                                      <p className='font-bold'>${obj.totalCurrentAssets}</p>
                                      <br></br>
                                      <br></br>
                                      <p>${obj.fixedAssets.buildings}</p>
                                      <p>${obj.fixedAssets.transportation}</p>
                                      <p>${obj.fixedAssets.machinery}</p>
                                      <p>${obj.fixedAssets.equipment}</p>
                                      <p>${obj.fixedAssets.netAccumulatedDepreciation}</p>
                                      <p>${obj.fixedAssets.others}</p>
                                      <p>${obj.totalFixedAssets}</p>
                                      <br></br>
                                      <p className='font-bold'>${obj.totalAssets}</p>
                                      <br></br>
                                      <br></br>
                                      <br></br>
                                          <p>Total Assets</p>
                                      <br></br>
                                      
                                      <br></br>
                                        
                                    </div>
                        })}
                </div>
              </div>
        </Card>

        <button className="pdf-button" onClick={generateBalanceSheetPDF}>
              Generate PDF Report
        </button>
    </div>
  )
}

export default BalanceSheet