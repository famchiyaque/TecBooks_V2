import React, { useEffect, useState } from 'react'
import { useSimData } from '@/MxRep/utils/contexts/SimDataContext'
import Card from "@mui/material/Card"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getIncomeStatement } from '../Calcs/income'

function Cashflows({ period, year }) {
    const { simData } = useSimData()
    const [incomeDataArray, setIncomeDataArray] = useState([])
    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"
    ]

    useEffect(() => {
        const incomeInfo = getIncomeStatement(simData, period, year)
        setIncomeDataArray(incomeInfo)
    }, [simData, period, year])

    const generateIncomePDF = () => {
        const content = document.getElementById("income-contents"); // Target your component

        if (!content) {
            console.error("Element not found: Check the ID of your income-contents div.");
            return;
        }

        const pdf = new jsPDF("p", "mm", "a4"); // A4 size: portrait mode

        // Add the HTML content to the PDF
        pdf.html(content, {
            callback: (doc) => {
                doc.save("Income_Statement.pdf"); // Save the PDF with the desired filename
            },
            x: 10, // Left margin
            y: 10, // Top margin
            autoPaging: false, // Disable automatic page breaks
            html2canvas: {
                scale: 1, // Ensure scaling matches the on-screen appearance
            },
            width: pdf.internal.pageSize.getWidth() - 20, // Fit content to page width
        });
    };

  return (
    <div className="statement">
            <Card className="max-w-4xl mx-auto bg-white p-8 shadow-lg" style={{ textAlign: 'left' }} elevation={0}>
                {/* Header */}
                <div className="text-center mb-8 page-header">
                  <p className="text-gray-600">Cookie World</p>
                    <h1 className="text-2xl font-bold mb-2">Statement of Cash Flows</h1>
                    {/* <p className="text-gray-600">{simData.teamName}</p> */}
                    {/* <p className="text-gray-600">Cookie World</p> */}
                </div>

                <div style={{ display: 'flex', justifyContent: 'left' }}>

                  <div id="cashflow-contents" className='income-contents' style={{ margin: 0, padding: 0 }}>

                    <div className='cashflow-titles'>
                      <br></br>
                      <p><strong>Cash Flow from Operating Activities</strong></p>
                      <p>Net Income</p>
                      <p>+ Depreciation</p>
                      <p>+ Decrease in Accounts Receivable</p>
                      <p>+ Increase in Accounts Payable</p>
                      <p>- Increase in Inventory</p>
                      <p className='left-indent'>Net Cash from Operating Activities</p>

                      <br></br>
                      <p><strong>Cash Flow from Investing Activities</strong></p>
                      <p>- Purchase of Property, Plant & Equipment</p>
                      <p>+ Proceeds from Sale of Equipment</p>
                      <p className='left-indent'>Net Cash from Investing Activities</p>

                      <br></br>
                      <p><strong>Cash Flow from Financing Activities</strong></p>
                      <p>+ Proceeds from Issuing Debt</p>
                      <p>- Repayment of Loans</p>
                      <p>+ Issuance of Equity</p>
                      <p>- Dividends Paid</p>
                      <p className='left-indent'>Net Cash from Financing Activities</p>

                      <br></br>
                      <p className='left-indent'><strong>Net Change in Cash</strong></p>
                      <p>+ Beginning Cash Balance</p>
                      <p className='left-indent'><strong>Ending Cash Balance</strong></p>
                      <br></br>
                    </div>

                  
                  <div className='cashflow-titles'>
                    <br></br>
                    <p><strong>40000</strong></p>  {/* Net Income */}
                    <p>3000</p>                    {/* Depreciation */}
                    <p>2000</p>                    {/* Decrease in Accounts Receivable */}
                    <p>1000</p>                    {/* Increase in Accounts Payable */}
                    <p>-4000</p>                   {/* Increase in Inventory */}
                    <p className='left-indent'>46000</p> {/* Net Cash from Operating Activities */}

                    <br></br>
                    <p><strong>-10000</strong></p>       {/* Purchase of PP&E */}
                    <p>2500</p>                          {/* Proceeds from Sale of Equipment */}
                    <p className='left-indent'>-7500</p> {/* Net Cash from Investing Activities */}

                    <br></br>
                    <p>8000</p>                    {/* Proceeds from Issuing Debt */}
                    <p>-2000</p>                   {/* Repayment of Loans */}
                    <p>5000</p>                    {/* Issuance of Equity */}
                    <p>-1500</p>                   {/* Dividends Paid */}
                    <p className='left-indent'>9500</p>  {/* Net Cash from Financing Activities */}

                    <br></br>
                    <p className='left-indent'><strong>48000</strong></p> {/* Net Change in Cash */}
                    <p>4000</p>                    {/* Beginning Cash Balance */}
                    <p className='left-indent'><strong>52000</strong></p> {/* Ending Cash Balance */}
                    <br></br>
                  </div>

                  </div>
                </div>

            </Card>

            <button className="pdf-button" onClick={generateIncomePDF}>
              Generate PDF Report
            </button>
    </div>
  )
}

export default Cashflows