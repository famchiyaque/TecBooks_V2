import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetInstitutionProfessors } from '@/MxRep/utils/hooks/admin.hooks'
import { Button } from '@/components/ui/button'
import { CiFilter } from "react-icons/ci"
import { IoSettingsSharp } from "react-icons/io5"
import CardProfessor from '@/MxRep/Components/Panels/Admin/CardProfessor'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'

function ManageProfessors() {
    const navigate = useNavigate()

    const { user, isLoading, isInitialized } = useAuth()
    const { professors, professorsIsLoading, error, getInstitutionProfessors } = useGetInstitutionProfessors()

    // const [selectedProfessor, setSelectedProfessor] = useState(null)

    useEffect(() => {
        // Only fetch professors once auth is initialized and user is available
        if (!isInitialized || isLoading || !user) {
            console.log("Waiting for auth initialization...")
            return
        }

        console.log("User in manage professors page: ", user)
        if (user.institution?.institutionId) {
            console.log("Calling getInstitutionProfs from useEffect")
            getInstitutionProfessors(user.institution?.institutionId)
        }
    }, [isInitialized, isLoading, user, getInstitutionProfessors])

    const navigateToInviteProfessor = () => {
        const slug = user.institution?.slug
        navigate(`/mxrep/${slug}/admin-panel/invite-professor`)
    }

    // Show loader while auth is initializing
    if (!isInitialized || isLoading) {
        return <Loader message={"Loading session..."} />
    }

    // After initialization, if no user, show error
    if (!user) {
        return <div>Not authenticated</div>
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
                <Button onClick={navigateToInviteProfessor}>
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
                    <CardProfessor 
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
    </div>
  )
}

export default ManageProfessors