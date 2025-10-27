import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import InviteProfessorForm from '@/MxRep/Forms/Panels/Admin/InviteProfessor'
import { ArrowLeft, Send, X } from 'lucide-react'

function InviteProfessor() {
    const navigate = useNavigate()
    const { user, isLoading, isInitialized } = useAuth()

    useEffect(() => {
        if (!isInitialized || isLoading || !user) {
            return
        }
    }, [isInitialized, isLoading, user])

    const handleBack = () => {
        const slug = user?.institution?.slug
        navigate(`/mxrep/${slug}/admin-panel/manage-professors`)
    }

    const handleSendInvite = () => {
        console.log("Sending invite to professor")
        // TODO: Implement invite logic
    }

    // Show loader while auth is initializing
    if (!isInitialized || isLoading) {
        return <Loader message="Loading session..." />
    }

    // After initialization, if no user, show error
    if (!user) {
        return <div>Not authenticated</div>
    }

    return (
        <div className='w-full  px-6 py-8'>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-2">
                  <div className='flex gap-4'>
                    <Button 
                        variant="ghost" 
                        onClick={handleBack}
                        className="mb-4 -ml-2 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className='text-left'>
                        <h1 className="text-3xl font-bold text-slate-900">Invite Professor</h1>
                        <p className="text-slate-600 mt-1">
                            Send an invitation to join {user.institution?.name}
                        </p>
                    </div>
                  </div>
                    
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline"
                            onClick={handleBack}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSendInvite}
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            Send Invite
                        </Button>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
            </div>

            <div className='max-w-4xl mx-auto'>
              {/* Form Section */}
              <InviteProfessorForm 
                  institutionName={user.institution?.name || 'Your Institution'}
                  onClear={() => console.log('Form cleared')}
                  onCancel={handleBack}
              />
            </div>
            
        </div>
    )
}

export default InviteProfessor