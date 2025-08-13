import React, { useEffect, useState } from 'react'
import { useSimData } from '../../SimDataContext'
import Card from "@mui/material/Card"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getIncomeStatement } from '../Calcs/income'

function Income({ period, year }) {
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
            <Card className="max-w-4xl mx-auto bg-white p-8 shadow-lg" elevation={0}>
                {/* Header */}
                <div className="text-center mb-8 page-header">
                    <h1 className="text-2xl font-bold mb-2">Income Statement</h1>
                    {/* <p className="text-gray-600">{simData.teamName}</p> */}
                    <p className="text-gray-600">Cookie World</p>
                </div>

                <div id="income-contents" className='income-contents'>
                    <div className='income-titles'>
                        <br></br>
                        <p>Net Sales</p>
                        <p>Cost of Goods Sold (COGS)</p>
                        <p className='left-indent'>Gross Profit</p>
                        <br></br>
                        <p>Administrative Expenes</p>
                        <p>Selling and Operating Expenses</p>
                        <p>Total Operating Expenses</p>
                        <p className='left-indent'>Operating Profit (EBITDA)</p>
                        <br></br>
                        <p>Depreciation</p>
                        <p>Other Income/Expenses</p>
                        <p>Gain/Loss on Sale of Fixed Assets</p>
                        <p className='left-indent'>Income Before Taxes</p>
                        <br></br>
                        <p>Tax Expense</p>
                        <br></br>
                        <p className='left-indent'>Net Income</p>
                        <br></br>
                    </div>

                    <div className='income-data'>
                        {incomeDataArray.map((obj) => {
                            return <div className='data-column'>
                                        <p>{obj.month}</p>
                                        <p>{obj.sales}</p>
                                        <p>{obj.cogs}</p>
                                        <p className='font-bold'>${obj.gross}</p>
                                        <br></br>
                                        <p>${obj.adminExp}</p>
                                        <p>${obj.sellingAndOperating}</p>
                                        <p>${obj.totalOperating}</p>
                                        <p className='font-bold'>${obj.ebitda}</p>
                                        <br></br>
                                        <p>${obj.depreciation}</p>
                                        <p>${obj.otherIncomeOrExpenses}</p>
                                        <p>${obj.gainOrLossOnSaleOfFixedAssets}</p>
                                        <p className='font-bold'>${obj.incomePreTaxes}</p>
                                        <br></br>
                                        <p>${obj.taxExpense}</p>
                                        <br></br>
                                        <p className='font-bold'>${obj.netIncome}</p>
                                    </div>
                        })}
                    </div>
                </div>
            </Card>

            <button className="pdf-button" onClick={generateIncomePDF}>
              Generate PDF Report
            </button>
    </div>
  )
}

export default Income