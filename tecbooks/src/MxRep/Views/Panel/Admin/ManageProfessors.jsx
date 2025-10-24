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

function ManageProfessors() {
    const { user, exampleAuthContext } = useAuth()
    const { professors, professorsIsLoading, error, getInstitutionProfessors } = useGetInstitutionProfessors()

    const [inviteModalOpen, setInviteModalOpen] = useState(false)

    useEffect(() => {
        if (exampleAuthContext?.institutionId) {
            getInstitutionProfessors(exampleAuthContext.institutionId)
        }
    }, [getInstitutionProfessors, exampleAuthContext])

    const handleOpenInviteModal = () => setInviteModalOpen(true)
    const handleCloseInviteModal = () => setInviteModalOpen(false)

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
                    <Card key={professor.id || idx} professor={professor} />
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
    </div>
  )
}

export default ManageProfessors