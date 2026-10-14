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
import SubheaderNav from '@/components/global/SubheaderNav'
import PlaygroundPage from '@/components/sims/forecasts/playground/PlaygroundPage'

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

const DEFAULT_VIEW = 'sales_forecaster'
const VIEWS = {
  sales_forecaster: { label: 'Sales Forecaster', Component: ForecastsSimContent },
  // Vista nueva/aislada (RF1-11: Historical Demand -> Autocorrelation ->
  // Forecast Models -> Backtesting -> Forecast chart), separada del Sales
  // Forecaster de siempre - ese sigue exactamente igual, sin tocar.
  playground: { label: 'Demand / Playground', Component: PlaygroundPage },
}

const NAV_ITEMS = Object.entries(VIEWS).map(([key, { label }]) => ({ key, label }))

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
  const [view, setView] = useState(DEFAULT_VIEW)

  const { Component: ActiveView } = VIEWS[view] ?? VIEWS[DEFAULT_VIEW]

  return (
    <Provider store={store}>
      <GenericHeader pageName={'Simulator'} />
      <GenericSubheader
        subheader={VIEWS[view]?.label ?? 'Sales Forecaster'}
        navigation={({ close }) => (
          <SubheaderNav items={NAV_ITEMS} value={view} onChange={setView} onItemClick={close} />
        )}
      />
      <ActiveView />
    </Provider>
  )
}

export default ForecastsSim
