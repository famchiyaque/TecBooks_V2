import React, { useEffect, useState } from 'react'
import Order from './GraphComponents/Order'
import Graph from './GraphComponents/Graph'
import AllInputs from './Macros/AllInputs'
import Results from './ResultsComps/Results'
import History from './HistoryComps/History'
import '../../styles/investments.css'
import { getResults, getProj } from './GraphComponents/Calculators'
import Typography from '@mui/material/Typography'

function Simulator() {
    const [lifetime, setLifetime] = useState(5)
    const [projectType, setProjectType] = useState("production line")
    const [discountRate, setDiscountRate] = useState(8)
    const [initialInvestment, setInitialInvestment] = useState(4000)
    const [inflows, setInflows] = useState([500, 2000, 5000, 15000, 30000])
    const [outflows, setOutflows] = useState([3000, 4500, 4500, 7200, 12000])
    const [order, setOrder] = useState(1)

    const [breakEven, setBreakEven] = useState(4.7)
    const [roi, setRoi] = useState(12.4)
    const [npv, setNpv] = useState(8500)
    const [irr, setIrr] = useState(27.9)

    const [history, setHistory] = useState([])

    const inputs = {
      lifetime: lifetime,
      projectType: projectType,
      discountRate: discountRate,
      initialInvestment: initialInvestment,
      inflows: inflows,
      outflows: outflows
    }

    const funcs = {
      setLifetime: setLifetime,
      setProjectType: setProjectType,
      setDiscountRate: setDiscountRate,
      setInitialInvestment: setInitialInvestment,
      setInflows: setInflows,
      setOutflows: setOutflows
    }

    useEffect(() => {
      const adjustArraySize = (arr, size, defaultValue) => {
        if (arr.length > size) {
          return arr.slice(0, size)
        }
        return [...arr, ...Array(size - arr.length).fill(defaultValue)]
      }
  
      setInflows((prev) => adjustArraySize(prev, lifetime, 0))
      setOutflows((prev) => adjustArraySize(prev, lifetime, 0))
    }, [lifetime])

    useEffect(() => {
      const setResults = () => {
        console.log("was in get results callback")
        const results = getResults(lifetime, initialInvestment, inflows, outflows, discountRate)
        setBreakEven(results[0])
        setRoi(results[1])
        setNpv(results[2])
        setIrr(results[3])
      }

      setResults()
    }, [lifetime, initialInvestment, inflows, outflows, discountRate])

    const orderChange = (value) => {
      console.log("order changed to: ", value)
      setOrder(value)
    }

    const addHistory = () => {
      console.log("was in addHistory callback with roi: ", roi, " irr: ", irr, " and npv: ", npv)
      const index = history.length + 1
      let currHistory = [...history]
      currHistory.push({
        index,
        projectType, breakEven, roi, irr, npv, 
        lifetime, initialInvestment, discountRate, inflows, outflows
      })
      setHistory(currHistory)
    }

    const projCallback = (index) => {
      // console.log("index returned: ", index)
      // console.log("current history: ", history)
      const proj = getProj(index, history)
      // console.log("proj return: ", proj)
      setProjectType(proj.projectType)
      setLifetime(proj.lifetime)
      setInitialInvestment(proj.initialInvestment)
      setDiscountRate(proj.discountRate)
      setInflows(proj.inflows)
      setOutflows(proj.outflows)
    }

    return (
      <div className='simulator-container'>

        <div className='graph-container'>
          {/* <h2>Project Evaluation Simulator</h2> */}
          <Typography variant="h5" style={{ padding: '0.3rem 0'}}>Project Evaluation Simulator</Typography>
          <AllInputs inputs={inputs} funcs={funcs} />

          <div className='graph-div'>
            <Order order={order} orderChange={orderChange} />
            <Graph lifetime={lifetime} projectType={projectType} order={order}
            initialInvestment={initialInvestment} inflows={inflows} outflows={outflows} />
          </div>
        </div>

        <div className='results-container'>
          <div className='history-div'>
            <Typography variant="h5" style={{ padding: '0.3rem 0'}}>Recorded Projects</Typography>
            <div className='history-table'>
              <History history={history} projCallback={projCallback} />
            </div>
          </div>
          <div className='results-div'>
            <Results breakEven={breakEven} roi={roi} irr={irr} npv={npv} discountRate={discountRate} addHistory={addHistory} />
          </div>
        </div>
      </div>
    )
}

export default Simulator