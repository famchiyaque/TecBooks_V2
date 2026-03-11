import React, { useState, useMemo } from 'react'
import { useDashboard } from '@/core/store'
import { 
  Typography, Card, CardContent, Tabs, Tab, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Grid, Chip
} from '@mui/material'
import { getIncomeStatementForPeriods, getCashFlowStatementForPeriods } from '@/core/engine/evaluations'
import '@/styles/general.css'

/**
 * Financial Statements View
 * 
 * Shows Income Statement, Balance Sheet, and Cash Flow Statement
 * with period filtering capabilities
 */
function FinancialStatements_View() {
  const { statements, businessModel, loading, error } = useDashboard()
  const [activeTab, setActiveTab] = useState(0)
  const [filterType, setFilterType] = useState('all') // 'all', 'year', 'quarter', 'months'
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedQuarter, setSelectedQuarter] = useState('')
  const [monthRange, setMonthRange] = useState({ start: 0, end: 11 })

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

  if (!statements || !businessModel) {
    return (
      <div className='view-child'>
        <Typography>No statement data available</Typography>
      </div>
    )
  }

  const months = businessModel?.timeline?.months || []

  // Extract available years from timeline
  const availableYears = useMemo(() => {
    const years = new Set()
    months.forEach(month => {
      const year = month.split(' ')[1]
      if (year) years.add(year)
    })
    return Array.from(years).sort()
  }, [months])

  // Get filtered periods based on selection
  const getFilteredPeriods = () => {
    if (filterType === 'all') {
      return { type: 'all' }
    }
    
    if (filterType === 'year' && selectedYear) {
      return { type: 'year', year: selectedYear }
    }
    
    if (filterType === 'quarter' && selectedYear && selectedQuarter) {
      // Calculate month indices for quarter
      const quarterMonths = {
        'Q1': [0, 1, 2],
        'Q2': [3, 4, 5],
        'Q3': [6, 7, 8],
        'Q4': [9, 10, 11],
      }
      const monthsInQuarter = quarterMonths[selectedQuarter] || []
      const filteredIndices = months
        .map((month, idx) => ({ month, idx }))
        .filter(({ month }) => {
          const [monthName, year] = month.split(' ')
          if (year !== selectedYear) return false
          const monthNum = new Date(`${monthName} 1, ${year}`).getMonth()
          return monthsInQuarter.includes(monthNum)
        })
        .map(({ idx }) => idx)
      
      return { type: 'months', months: filteredIndices }
    }
    
    if (filterType === 'months') {
      const indices = []
      for (let i = monthRange.start; i <= Math.min(monthRange.end, months.length - 1); i++) {
        indices.push(i)
      }
      return { type: 'months', months: indices }
    }
    
    return { type: 'all' }
  }

  // Get filtered income statement
  const filteredIncomeStatement = useMemo(() => {
    const periodSelection = getFilteredPeriods()
    return getIncomeStatementForPeriods(businessModel, periodSelection)
  }, [businessModel, filterType, selectedYear, selectedQuarter, monthRange])

  // Get filtered cash flow statement
  const filteredCashFlowStatement = useMemo(() => {
    const periodSelection = getFilteredPeriods()
    return getCashFlowStatementForPeriods(businessModel, periodSelection)
  }, [businessModel, filterType, selectedYear, selectedQuarter, monthRange])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const renderPeriodFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Period Filters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Type</InputLabel>
              <Select
                value={filterType}
                label="Filter Type"
                onChange={(e) => {
                  setFilterType(e.target.value)
                  if (e.target.value === 'all') {
                    setSelectedYear('')
                    setSelectedQuarter('')
                  }
                }}
              >
                <MenuItem value="all">All Periods</MenuItem>
                <MenuItem value="year">By Year</MenuItem>
                <MenuItem value="quarter">By Quarter</MenuItem>
                <MenuItem value="months">By Month Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {(filterType === 'year' || filterType === 'quarter') && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {availableYears.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {filterType === 'quarter' && selectedYear && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Quarter</InputLabel>
                <Select
                  value={selectedQuarter}
                  label="Quarter"
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                >
                  <MenuItem value="Q1">Q1 (Jan-Mar)</MenuItem>
                  <MenuItem value="Q2">Q2 (Apr-Jun)</MenuItem>
                  <MenuItem value="Q3">Q3 (Jul-Sep)</MenuItem>
                  <MenuItem value="Q4">Q4 (Oct-Dec)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {filterType === 'months' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>From Month</InputLabel>
                  <Select
                    value={monthRange.start}
                    label="From Month"
                    onChange={(e) => setMonthRange(prev => ({ ...prev, start: e.target.value }))}
                  >
                    {months.map((month, idx) => (
                      <MenuItem key={idx} value={idx}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>To Month</InputLabel>
                  <Select
                    value={monthRange.end}
                    label="To Month"
                    onChange={(e) => setMonthRange(prev => ({ ...prev, end: e.target.value }))}
                  >
                    {months.map((month, idx) => (
                      <MenuItem key={idx} value={idx} disabled={idx < monthRange.start}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Showing ${Object.keys(filteredIncomeStatement).length} periods`} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
              {filterType === 'year' && selectedYear && (
                <Chip label={`Year: ${selectedYear}`} size="small" />
              )}
              {filterType === 'quarter' && selectedQuarter && (
                <Chip label={`${selectedQuarter} ${selectedYear}`} size="small" />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const renderIncomeStatement = () => {
    const periodsToDisplay = Object.keys(filteredIncomeStatement)
    
    if (periodsToDisplay.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No data available for the selected period
            </Typography>
          </CardContent>
        </Card>
      )
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Period</strong></TableCell>
              <TableCell align="right"><strong>Revenue</strong></TableCell>
              <TableCell align="right"><strong>Costs</strong></TableCell>
              <TableCell align="right"><strong>Gross Profit</strong></TableCell>
              <TableCell align="right"><strong>Expenses</strong></TableCell>
              <TableCell align="right"><strong>Depreciation</strong></TableCell>
              <TableCell align="right"><strong>Net Income</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodsToDisplay.map((month) => {
              const data = filteredIncomeStatement[month]
              return (
                <TableRow key={month} hover>
                  <TableCell>{month}</TableCell>
                  <TableCell align="right">${parseFloat(data?.revenue || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.costs || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.grossProfit || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.expenses || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.depreciation || 0).toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: parseFloat(data?.netIncome || 0) >= 0 ? 'success.main' : 'error.main' }}>
                    ${parseFloat(data?.netIncome || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const renderBalanceSheet = () => (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Balance Sheet view coming soon. Will show Assets, Liabilities, and Equity over time.
        </Typography>
      </CardContent>
    </Card>
  )

  const renderCashFlowStatement = () => {
    const periodsToDisplay = Object.keys(filteredCashFlowStatement)
    
    if (periodsToDisplay.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No data available for the selected period
            </Typography>
          </CardContent>
        </Card>
      )
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Period</strong></TableCell>
              <TableCell align="right"><strong>Net Income</strong></TableCell>
              <TableCell align="right"><strong>Depreciation</strong></TableCell>
              <TableCell align="right"><strong>Operating Cash</strong></TableCell>
              <TableCell align="right"><strong>Investing Cash</strong></TableCell>
              <TableCell align="right"><strong>Financing Cash</strong></TableCell>
              <TableCell align="right"><strong>Net Change</strong></TableCell>
              <TableCell align="right"><strong>Ending Cash</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodsToDisplay.map((month) => {
              const data = filteredCashFlowStatement[month]
              return (
                <TableRow key={month} hover>
                  <TableCell>{month}</TableCell>
                  <TableCell align="right">${parseFloat(data?.netIncome || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.depreciation || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.cashFromOperations || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.cashFromInvesting || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(data?.cashFromFinancing || 0).toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: parseFloat(data?.netCashChange || 0) >= 0 ? 'success.main' : 'error.main' }}>
                    ${parseFloat(data?.netCashChange || 0).toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${parseFloat(data?.endingCash || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <div className='view-child'>
      <div className='view-title'>
        <Typography variant='h4' sx={{ fontWeight: '600' }}>
          Financial Statements
        </Typography>
        <Typography variant='subtitle1' color="text.secondary">
          Comprehensive financial reporting with period filtering
        </Typography>
      </div>

      {renderPeriodFilters()}

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
