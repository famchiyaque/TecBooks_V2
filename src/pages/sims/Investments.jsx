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
    <div className="flex flex-col h-screen overflow-hidden">
      <GenericHeader pageName={'Simulators'} />
      <GenericSubheader subheader={'Project Evaluation'} />

      <div className="flex-1 min-h-0 px-6 py-3 flex justify-around items-stretch gap-3">
        <div className="basis-[58%] flex flex-col gap-4 min-h-0">
          <InputSection />
          <div className="graph-div flex-1 min-h-0 overflow-hidden">
            <Order />
            <Graph />
          </div>
        </div>

        <div className="basis-[38%] flex flex-col min-h-0">
          <div className="w-[92%] mr-auto custom-paper flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="shrink-0">
              <Results />
              <Divider variant="middle" sx={{ margin: '1rem auto', width: '90%' }} />
            </div>
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
