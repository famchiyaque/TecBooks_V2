import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetInstitutionProfessors } from '@/MxRep/utils/hooks/admin.hooks'
import { Button } from '@/components/ui/button'
import { CiFilter } from "react-icons/ci"
import { IoSettingsSharp } from "react-icons/io5"
import Card from '@/MxRep/Components/General/Card'
import Loader from '@/Global Components/Loader'
import InviteProfessor from '@/MxRep/Components/Panels/Admin/Modals/InviteProfessor'
import ProfessorMore from '@/MxRep/Components/Panels/Admin/Modals/ProfessorDetails'

function ManageProfessors() {
    const { user } = useAuth()
    const { professors, professorsIsLoading, error, getInstitutionProfessors } = useGetInstitutionProfessors()

    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [selectedProfessor, setSelectedProfessor] = useState(null)
    const [professorModalOpen, setProfessorModalOpen] = useState(false)

    useEffect(() => {
        if (user.institution?.institutionId) {
            getInstitutionProfessors(user.institution?.institutionId)
        }
    }, [getInstitutionProfessors, user])

    const handleOpenInviteModal = () => setInviteModalOpen(true)
    const handleCloseInviteModal = () => setInviteModalOpen(false)

    const handleOpenProfessorModal = (professor) => {
        setSelectedProfessor(professor)
        setProfessorModalOpen(true)
    } 
    const handleCloseProfessorModal = () => {
        setSelectedProfessor(null)
        setProfessorModalOpen(false)
    }

  return (
    <div className='w-full mx-6'>
        {/* Title */}
        <div className='w-full flex justify-between items-center'>
            <Typography variant='h4'>
                Professors
            </Typography>
            <div className='flex items-center gap-3'>
                <CiFilter />
                <Button onClick={handleOpenInviteModal}>
                    New Invite
                </Button>
                <IoSettingsSharp />
            </div>
        </div>

        <Divider variant='middle' />

        <div className='w-full flex-grid'>
            {professorsIsLoading && (
                <Loader message={"Loading professors"} />
            )}

            {error && (
                <div>Error: {error}</div>
            )}

            {professors && professors.length > 0 ? (
                professors.map((professor, idx) => (
                    <Card 
                        key={professor.id || idx} 
                        professor={professor}
                        onClick={() => handleOpenProfessorModal(professor)}
                    />
                ))
            ) : (
                !professorsIsLoading && (
                    <div>No professors found</div>
                )
            )}
        </div>

        <InviteProfessor 
            open={inviteModalOpen}
            onClose={handleCloseInviteModal}
        />

        <ProfessorMore 
            open={professorModalOpen}
            onClose={handleCloseProfessorModal}
            professor={selectedProfessor}
        />
    </div>
  )
}

export default ManageProfessors