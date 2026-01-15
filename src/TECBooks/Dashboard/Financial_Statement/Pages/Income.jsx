import React, { use, useEffect, useState } from 'react'
import { useExcel } from '../../Comps/ExcelContext'
import Card from "@mui/material/Card"
import jsPDF from "jspdf"
import "jspdf-autotable"
// import { getIncomeStatement } from '../Calcs/calcs'

function Income({ period }) {
    const { bizInfo, statementsData } = useExcel()
    const [periodData, setPeriodData] = useState(null);

    // console.log(period)
    // console.log(bizInfo)
    // console.log(statementsData)

    useEffect(() => {
        if (statementsData && period) {
            setPeriodData(statementsData[period]);
        }
    }, [period, statementsData]);

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
                    <p className="text-gray-600">{bizInfo.name ? bizInfo.name : 'No name given'} for month of {period}</p>
                </div>

                <div id="income-contents" className='income-contents'>
                    <div className='income-titles'>
                        <br></br>
                            <p>Net Sales</p>
                            <p>Cost of Goods Sold (COGS)</p>
                            <p className='left-indent'>Gross Profit</p>
                        <br></br>
                            <p>Administrative Expenses</p>
                            <p>Depreciation</p>
                            {/* <p>Selling and Operating Expenses</p> */}
                            <p>Total Operating Expenses</p>
                            <p className='left-indent'>Operating Profit (EBITDA)</p>
                        <br></br>
                            {/* <p>Depreciation</p> */}
                            {/* <p>Other Income/Expenses</p> */}
                            {/* <p>Gain/Loss on Sale of Fixed Assets</p> */}
                            {/* <p className='left-indent'>Income Before Taxes</p> */}
                        <br></br>
                            {/* <p>Tax Expense</p> */}
                            {/* <br></br> */}
                            <p className='left-indent'>Net Income</p>
                        <br></br>
                    </div>

                    <div className='income-data'>
                        {/* {incomeDataArray.map((obj) => { */}
                            {/* return <div className='data-column'> */}
                            <div>
                                <br/>
                                <p>${periodData?.revenue ?? "N/A"}</p>
                                <p>$({periodData?.costs ?? "N/A"})</p>
                                <p className='font-bold'>${periodData?.gross ?? "N/A"}</p>
                                <br/>
                                <p>$({periodData?.expenses ?? "N/A"})</p>
                                <p>$({periodData?.dep ?? "N/A"})</p>
                                <p>$({periodData?.totalOp ?? "N/A"})</p>
                                <p className='font-bold'>${periodData?.operating ?? "N/A"}</p>
                                <br/><br/>
                                <p className='font-bold'>${periodData?.net ?? "N/A"}</p>
                            </div>
                            {/* // })} */}
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