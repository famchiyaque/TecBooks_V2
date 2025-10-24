import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetInbox } from '@/MxRep/utils/hooks/admin.hooks'
import { Button } from '@/components/ui/button'
import { CiFilter } from "react-icons/ci"
import { IoSettingsSharp } from "react-icons/io5"
import Card from '@/MxRep/Components/General/Card'
import Loader from '@/Global Components/Loader'
import InviteProfessor from '@/MxRep/Components/Panels/Admin/Modals/InviteProfessor'
import ProfessorMore from '@/MxRep/Components/Panels/Admin/Modals/ProfessorDetails'

function Inbox() {
    const { user, exampleAuthContext } = useAuth()
    const { inbox, inboxIsLoading, error, getInbox } = useGetInbox()

    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [eventModalOpen, setEventModalOpen] = useState(false)

    useEffect(() => {
        if (exampleAuthContext?.institutionId) {
            getInbox(exampleAuthContext.institutionId)
        }
    }, [getInbox, exampleAuthContext])

    const handleOpenInviteModal = () => setInviteModalOpen(true)
    const handleCloseInviteModal = () => setInviteModalOpen(false)

    const handleOpenEventModal = (professor) => {
        setSelectedEvent(professor)
        setEventModalOpen(true)
    } 
    const handleCloseEventModal = () => {
        setSelectedEvent(null)
        setEventModalOpen(false)
    }

  return (
    <div className='w-full mx-6'>
        {/* Title */}
        <div className='w-full flex justify-between items-center'>
            <Typography variant='h4'>
                My Inbox
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

            {inbox && inbox.length > 0 ? (
                inbox.map((event, idx) => (
                    <Card 
                        key={professor.id || idx} 
                        professor={professor}
                        onClick={() => handleOpenEventModal(event)}
                    />
                ))
            ) : (
                !inboxIsLoading && (
                    <div>No events found</div>
                )
            )}
        </div>

        <InviteProfessor 
            open={inviteModalOpen}
            onClose={handleCloseInviteModal}
        />

        <ProfessorMore 
            open={eventModalOpen}
            onClose={handleCloseEventModal}
            professor={selectedEvent}
        />
    </div>
  )
}

export default Inbox