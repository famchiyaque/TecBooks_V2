import React, { useState, useEffect } from 'react'
// import Inflows from './Inputs/Inflows'
// import Outflows from './Inputs/Outflows'
import BasicInput from './Inputs/BasicInput'
import TableInput from './Inputs/TableInput'
// import axios from 'axios'
import { getProjectInfo, setDiscountRate, setInflows, setInitialInvestment, setLifetime, setOutflows, setProject } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function InputSection() {
  const dispatch = useDispatch()

  const { 
    project, lifetime, initialInvestment,
    discountRate, inflows, outflows
   } = useSelector(getProjectInfo)

  const setProjectCallback = (val) => dispatch(setProject(val))
  const setLifetimeCallback = (val) => dispatch(setLifetime(val))
  const setInitialInvCallback = (val) => dispatch(setInitialInvestment(val))
  const setDiscountRateCallback = (val) => dispatch(setDiscountRate(val))
  const setInflowsCallback = (val) => dispatch(setInflows(val))
  const setOutflowsCallback = (val) => dispatch(setOutflows(val))

  const basicInputs = [
    {
      name: 'Project',
      size: 25,
      func: setProjectCallback,
      value: project
    },
    {
      name: 'Lifetime',
      size: 10,
      func: setLifetimeCallback,
      value: lifetime
    },
    {
      name: 'Initial Investment',
      size: 18,
      func: setInitialInvCallback,
      value: initialInvestment
    },
    {
      name: 'Discount Rate',
      size: 13,
      func: setDiscountRateCallback,
      value: discountRate
    },
  ]

  const tableInputs = [
    {
      name: 'Inflows',
      func: setInflowsCallback,
      value: inflows
    },
    {
      name: 'Outflows',
      func: setOutflowsCallback,
      value: outflows
    },
  ]

  const copyFlows = async () => {
    try {
      const data = JSON.stringify({ inflows, outflows });
      await navigator.clipboard.writeText(data);
      console.log("Flows copied to clipboard:", data);
    } catch (err) {
      console.error("Failed to copy flows:", err);
    }
  };

  const pasteFlows = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (parsed.inflows && parsed.outflows) {
        dispatch(setInflows(parsed.inflows));
        dispatch(setOutflows(parsed.outflows));
      }
    } catch (err) {
      console.error("Failed to paste flows:", err);
    }
  };

  const addFlowColumn = () => {
    const newLifetime = lifetime + 1 <= 20 ? lifetime + 1 : 20;
    const newInflows = [...inflows, 0];
    const newOutflows = [...outflows, 0];

    dispatch(setLifetime(newLifetime));
    dispatch(setInflows(newInflows));
    dispatch(setOutflows(newOutflows));
  };

  const removeFlowColumn = () => {
    const newLifetime = lifetime - 1 >= 0 ? lifetime - 1 : 0
    const newInflows = inflows.slice(0, -1);
    const newOutflows = outflows.slice(0, -1);

    dispatch(setLifetime(newLifetime));
    dispatch(setInflows(newInflows));
    dispatch(setOutflows(newOutflows));
  }

    // const api_key = 'b86afe5666msh410c2ed2d3d8a1fp150b79jsnfcad51eb0f9d'
    const [monthInflation, setMonthInflation] = useState(0.06)
    const [yearInflation, setYearInflation] = useState(4.54)
    const [cetes, setCetes] = useState(11)

    // useEffect(() => {
    //     const fetchInflationData = async () => {
    //       const country = 'mexico'
    //       const api_url = `https://api.api-ninjas.com/v1/inflation?country=${country}`
    
    //       try {
    //         const response = await axios.get(api_url, {
    //           headers: {
    //             'X-RapidAPI-Key': api_key,
    //             'X-RapidAPI-Host': 'city-by-api-ninjas.p.rapidapi.com'
    //           }
    //         })
    //         console.log(response.data)
    //         const data = response.data
    //         setMonthInflation(data.monthly_rate_pct)
    //         setYearInflation(data.yearly_rate_pct)
    //       } catch (error) {
    //         console.error('Error fetching inflation data:', error)
    //       }
    //     }
    
    //     // fetchInflationData()
    //   }, [])

  return (
    <div className='w-[100%] flex flex-col justify-start items-start all-inputs-container'>

        <div className='w-[98%] pl-[2%] flex justify-start items-start gap-[0.6rem] text-sm'>
            {basicInputs.map((input, idx) => (
              <div className='flex flex-col items-start' style={{ flexBasis: `${input.size}%` }}>
                <p>{input.name}</p>
                <BasicInput func={input.func} value={input.value} name={input.name} />
              </div>
            ))}

            <div className='flex flex-col items-start justify-between h-[100%]' style={{ flexBasis: '10%' }}>
              <p>Inflation</p>
              <div style={{ width: '100%' }}>
                <p style={{ width: '100%', borderBottom: 'solid rgb(50, 50, 80) 1px' }}>
                    {yearInflation}
                    <span className='inflation-change' style={{ color: `${monthInflation >= 0 ? 'green' : 'red'}` }}>
                    {monthInflation >= 0 ? '+' : '-'}
                    {monthInflation}</span>    
                </p>
              </div>
            </div>

            <div className='flex flex-col items-start justify-between h-[100%]' style={{ flexBasis: '10%' }}>
              <p>Cetes</p>
              <div style={{ width: '100%', borderBottom: 'solid rgb(50, 50, 80) 1px' }}>
                {cetes}%
              </div>
            </div>
                
        </div>

        <div className='w-[98%] flex justify-start px-2'>

          <div className='basis-[21%] flex flex-col items-start pl-2 gap-3'>
            <div className='flex justify-start'>
              <IconButton title='Copy All' sx={{ paddingBottom: '0' }} onClick={copyFlows}>
                <CopyAllIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton title='Paste' sx={{ paddingBottom: '0' }} onClick={pasteFlows}>
                <ContentPasteIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton title='Add Year' sx={{ paddingBottom: '0' }} onClick={addFlowColumn}>
                <AddCircleOutlineIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton title='Remove Year' sx={{ paddingBottom: '0' }} onClick={removeFlowColumn}>
                <RemoveCircleOutlineIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </div>
            <p>Project Inflows: </p>
            <p>Project Outflows: </p>
          </div>

          <div className="basis-[79%] min-w-0 flex flex-col mt-2 overflow-x-auto">
            <div className='min-w-max max-w-[100%]'>
              <div className='flex'>
                {Array.from({ length: lifetime }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <div key={i} className="italic text-gray-500 text-sm w-[5.6rem] flex-shrink-0">
                      {year}
                    </div>
                  );
                })}
                </div>
                <div className='w-[100%] flex flex-col'>
                  {tableInputs.map((input, idx) => (
                    <TableInput func={input.func} flows={input.value} name={input.name} />
                  ))}
                </div>
            </div>  
          </div>

        </div>
            
    </div>
  )
}

export default InputSection