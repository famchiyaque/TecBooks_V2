import React, { useEffect, useState } from 'react'
import GenericSubheader from '@/components/global/GenericSubheader'
import GenericHeader from "@/components/global/GenericHeader"
import Graph from "./Components/Graph"
import MethodsSidebar from './Components/MethodsSidebar'
import DataOptionsHeader from './Components/DataOptionsHeader'
import GraphOptions from './Components/GraphOptions'
import TimelineSliders from './Components/TimelineSliders'
import useBaseSalesData from './hooks/baseSalesData-hook'
import useSeriesData from './hooks/seriesData-hook'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, background: '#fee', color: '#900', fontFamily: 'monospace' }}>
          <strong>Crash capturado:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{this.state.error.toString()}{'\n'}{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Layout() {

  const fontStyle = {
    // fontFamily: 'Roboto, sans-serif',
    // fontFamily: 'Open Sans, sans-serif',
    // fontFamily: 'Lato, sans-serif',
    // fontFamily: 'Montserrat, sans-serif',
    // fontFamily: 'Poppins, sans-serif',
    // fontFamily: 'Inter, sans-serif',
    // fontFamily: 'Nunito, sans-serif',
    fontFamily: 'Raleway, sans-serif',
    backgroundColor: 'white'
  }

  useBaseSalesData();
  useSeriesData();

  return (
    <ErrorBoundary>
    <div style={fontStyle}>
      <GenericHeader pageName={"Simulator"} />
      <GenericSubheader subheader={"Sales Forecaster"} />
      <div className='w-screen flex'>
        <MethodsSidebar />
        <div className='flex-1 h-screen min-h-[800]'>
            <DataOptionsHeader />
            <div className='flex justify-around'>
              <div className='flex-6 flex-col gap-4'>
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

export default Layout