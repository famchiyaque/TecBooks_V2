import React from 'react'
import { Outlet } from 'react-router-dom'
import GenericHeader from '@/components/global/GenericHeader'

function ProgramsLayout() {
  return (
    <>
      <GenericHeader pageName="Project Feasibility Simulation" />
      <Outlet />
    </>
  )
}

export default ProgramsLayout
