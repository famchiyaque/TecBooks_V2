import '@/styles/homepage.css'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Order from '@/components/sims/investments/Inputs/Order'
import Graph from '@/components/sims/investments/Graph'
import InputSection from '@/components/sims/investments/InputSection'
import Results from '@/components/sims/investments/Results'
import History from '@/components/sims/investments/History'
import '@/styles/investments.css'
import GenericHeader from '@/components/global/GenericHeader'
import GenericSubheader from '@/components/global/GenericSubheader'
import Divider from '@mui/material/Divider'
import { createProjEvalStore } from '@/store/project-evaluation.store'

function InvestmentsSimContent() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <GenericHeader pageName={'Simulators'} />
      <GenericSubheader subheader={'Project Evaluation'} />

      <div className="w-[100%] min-h-[105vh] mx-6 my-3 flex justify-around items-start gap-3">
        <div className="basis-[58%] flex flex-col gap-4 h-full">
          <InputSection />
          <div className="graph-div">
            <Order />
            <Graph />
          </div>
        </div>

        <div className="basis-[38%] flex flex-col justify-start items-center">
          <div className="w-[92%] mr-auto custom-paper">
            <Results />
            <Divider variant="middle" sx={{ margin: '1rem auto', width: '90%' }} />
            <History />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Owns its Redux store so App.jsx stays provider-free.
 * Store is created once per mount via lazy useState initializer.
 */
function InvestmentsSim() {
  const [store] = useState(() => createProjEvalStore())

  return (
    <Provider store={store}>
      <InvestmentsSimContent />
    </Provider>
  )
}

export default InvestmentsSim
