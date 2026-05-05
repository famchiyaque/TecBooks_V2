import React, { useState } from 'react'
import { useDashboard } from '@/core/store'
import { Typography, Card, CardContent, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import '@/styles/general.css'

/**
 * Financial Statements View
 * 
 * Shows Income Statement, Balance Sheet, and Cash Flow Statement
 * Generated from the canonical business model using the financial engine
 */
function FinancialStatements_View() {
  const { statements, businessModel, loading, error } = useDashboard()
  const [activeTab, setActiveTab] = useState(0)

  if (loading) {
    return (
      <div className='view-child'>
        <div className='loader'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='view-child'>
        <Typography color="error">Error: {error}</Typography>
      </div>
    )
  }

  if (!statements) {
    return (
      <div className='view-child'>
        <Typography>No statement data available</Typography>
      </div>
    )
  }

  const { incomeStatement, balanceSheet, cashFlowStatement } = statements
  const months = businessModel?.timeline?.months || []

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const renderIncomeStatement = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Period</strong></TableCell>
            <TableCell align="right"><strong>Revenue</strong></TableCell>
            <TableCell align="right"><strong>Costs</strong></TableCell>
            <TableCell align="right"><strong>Gross Profit</strong></TableCell>
            <TableCell align="right"><strong>Expenses</strong></TableCell>
            <TableCell align="right"><strong>Net Income</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((month) => {
            const data = incomeStatement[month]
            return (
              <TableRow key={month}>
                <TableCell>{month}</TableCell>
                <TableCell align="right">${parseFloat(data?.revenue || 0).toLocaleString()}</TableCell>
                <TableCell align="right">${parseFloat(data?.costs || 0).toLocaleString()}</TableCell>
                <TableCell align="right">${parseFloat(data?.grossProfit || 0).toLocaleString()}</TableCell>
                <TableCell align="right">${parseFloat(data?.expenses || 0).toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ${parseFloat(data?.netIncome || 0).toLocaleString()}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )

  const renderBalanceSheet = () => (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Balance Sheet view coming soon. Will show Assets, Liabilities, and Equity over time.
        </Typography>
      </CardContent>
    </Card>
  )

  const renderCashFlowStatement = () => (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Cash Flow Statement view coming soon. Will show Operating, Investing, and Financing activities.
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <div className='view-child'>
      <div className='view-title'>
        <Typography variant='h4' sx={{ fontWeight: '600' }}>
          Financial Statements
        </Typography>
        <Typography variant='subtitle1' color="text.secondary">
          Comprehensive financial reporting
        </Typography>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Income Statement" />
          <Tab label="Balance Sheet" />
          <Tab label="Cash Flow Statement" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 0 && renderIncomeStatement()}
        {activeTab === 1 && renderBalanceSheet()}
        {activeTab === 2 && renderCashFlowStatement()}
      </Box>
    </div>
  )
}

export default FinancialStatements_View
