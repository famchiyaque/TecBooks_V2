import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import RegistryLayout from './Layout'
import StartRegistry from './StartRegistry'
import StudentRegistry from '@/MxRep/Forms/Registry/RegisterStudent'
import FinalizeStudentForm from '@/MxRep/Forms/Registry/FinalizeStudent'
import ProfessorRegistry from '@/MxRep/Forms/Registry/RegisterProfessor'
import FinalizeProfessorForm from '@/MxRep/Forms/Registry/FinalizeProfessor'
import InstitutionRegistry from '@/MxRep/Forms/Registry/RegisterInstitution'

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