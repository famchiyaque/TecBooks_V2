import '../../styles/homepage.css'
import React, { useEffect, useState } from 'react'
import Order from './Components/Inputs/Order'
import Graph from './Components/Graph'
import InputSection from './Components/InputSection'
import Results from './Components/Results'
import History from './Components/History'
import '../../styles/investments.css'
import GenericHeader from '../../Global Components/GenericHeader'
import GenericSubheader from '../../Global Components/GenericSubheader'
import Divider from '@mui/material/Divider';


function Layout() {
    // useEffect(() => {
    //   const adjustArraySize = (arr, size, defaultValue) => {
    //     if (arr.length > size) {
    //       return arr.slice(0, size)
    //     }
    //     return [...arr, ...Array(size - arr.length).fill(defaultValue)]
    //   }
  
    //   setInflows((prev) => adjustArraySize(prev, lifetime, 0))
    //   setOutflows((prev) => adjustArraySize(prev, lifetime, 0))
    // }, [lifetime])

    // useEffect(() => {
    //   const setResults = () => {
    //     console.log("was in get results callback")
    //     const results = getResults(lifetime, initialInvestment, inflows, outflows, discountRate)
    //     setBreakEven(results[0])
    //     setRoi(results[1])
    //     setNpv(results[2])
    //     setIrr(results[3])
    //   }

    //   setResults()
    // }, [lifetime, initialInvestment, inflows, outflows, discountRate])

    // const projCallback = (index) => {
    //   // console.log("index returned: ", index)
    //   // console.log("current history: ", history)
    //   const proj = getProj(index, history)
    //   // console.log("proj return: ", proj)
    //   setProjectType(proj.projectType)
    //   setLifetime(proj.lifetime)
    //   setInitialInvestment(proj.initialInvestment)
    //   setDiscountRate(proj.discountRate)
    //   setInflows(proj.inflows)
    //   setOutflows(proj.outflows)
    // }

    useEffect(() => {
        window.scrollTo(0, 0); // Scrolls to the top of the page
      }, []);

    return (
      <div>
        <GenericHeader pageName={"Simulators"} />
        <GenericSubheader subheader={"Project Evaluation"} />

        <div className='w-[100%] min-h-[105vh] mx-6 my-3 flex justify-around items-start gap-3'>
          <div className='basis-[58%] flex flex-col gap-4 h-full'>
            <InputSection />
            <div className='graph-div'>
              <Order />
              <Graph />
            </div>
          </div>

          <div className='basis-[38%] flex flex-col justify-start items-center'>
              <div className='w-[92%] mr-auto custom-paper'>
                <Results />
                {/* <p>jfdslfk</p> */}
                <Divider variant="middle" sx={{ margin: '1rem auto', width: '90%' }}  />
                <History />
              </div>            
          </div>
        </div>
      </div>
    )
}

export default Layout