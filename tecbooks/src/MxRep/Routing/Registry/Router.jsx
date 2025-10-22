import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../utils/contexts/AuthContext'
import RegistryLayout from './Layout'
import StartRegistry from './StartRegistry'
import StudentRegistry from '../../Forms/Registry/RegisterStudent'
import FinalizeStudentForm from '../../Forms/Registry/FinalizeStudent'
import ProfessorRegistry from '../../Forms/Registry/RegisterProfessor'
import FinalizeProfessorForm from '../../Forms/Registry/FinalizeProfessor'
import InstitutionRegistry from '../../Forms/Registry/RegisterInstitution'

function RegistryRouter() {

  return (
    <Routes>

        <Route path="/" element={ <RegistryLayout /> } >
            <Route index element={ <StartRegistry /> } />

            <Route path="student" element={ <StudentRegistry /> } />
            <Route path="student/finalize" element={ <FinalizeStudentForm /> } />
                
            <Route path="professor" element={ <ProfessorRegistry /> } />
            <Route path="professor/finalize" element={ <FinalizeProfessorForm /> } /> 
                    
            <Route path="institution" element={ <InstitutionRegistry /> } />
        </Route>
      
    </Routes>
  )
}

export default RegistryRouter