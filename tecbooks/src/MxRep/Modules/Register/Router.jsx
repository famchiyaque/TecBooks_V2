import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import RegistryLayout from './Layout'
import StartRegistry from './StartRegistry'
import StudentRegistry from './Forms/RegisterStudent'
import ProfessorRegistry from './Forms/RegisterProfessor'
import InstitutionRegistry from './Forms/RegisterInstitution'

function RegistryRouter() {

  return (
    <Routes>

        <Route path="/" element={ <RegistryLayout /> } >
            <Route index element={ <StartRegistry /> } />

            <Route path="/student" element={ <StudentRegistry /> } />
                
            <Route path="/professor" element={ <ProfessorRegistry /> } />
                    
            <Route path="/institution" element={ <InstitutionRegistry /> } />
        </Route>
      
    </Routes>
  )
}

export default RegistryRouter