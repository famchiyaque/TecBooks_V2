import React, { useState } from 'react'
import { Provider } from 'react-redux'
import GenericSubheader from '@/components/global/GenericSubheader'
import GenericHeader from '@/components/global/GenericHeader'
import Graph from '@/components/sims/forecasts/Graph'
import MethodsSidebar from '@/components/sims/forecasts/MethodsSidebar'
import DataOptionsHeader from '@/components/sims/forecasts/DataOptionsHeader'
import GraphOptions from '@/components/sims/forecasts/GraphOptions'
import TimelineSliders from '@/components/sims/forecasts/TimelineSliders'
import useBaseSalesData from '@/hooks/sims/forecasts/useBaseSalesData'
import useSeriesData from '@/hooks/sims/forecasts/useSeriesData'
import { createForecastStore } from '@/store/forecast.store'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, background: '#fee', color: '#900', fontFamily: 'monospace' }}>
          <strong>Crash capturado:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
            {this.state.error.toString()}
            {'\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

function ForecastsSimContent() {
  const fontStyle = {
    fontFamily: 'Raleway, sans-serif',
    backgroundColor: 'white',
  }

  useBaseSalesData()
  useSeriesData()

  return (
    <ErrorBoundary>
      <div style={fontStyle}>
        <GenericHeader pageName={'Simulator'} />
        <GenericSubheader subheader={'Sales Forecaster'} />
        <div className="w-screen flex">
          <MethodsSidebar />
          <div className="flex-1 h-screen min-h-[800]">
            <DataOptionsHeader />
            <div className="flex justify-around">
              <div className="flex-6 flex-col gap-4">
                <TimelineSliders className="my-4" />
                <Graph />
              </div>
              <GraphOptions className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

/**
 * Owns its Redux store so App.jsx stays provider-free.
 * Store is created once per mount via lazy useState initializer.
 */
function ForecastsSim() {
  const [store] = useState(() => createForecastStore())

  return (
    <Provider store={store}>
      <ForecastsSimContent />
    </Provider>
  )
}

export default ForecastsSim
