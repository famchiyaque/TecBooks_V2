import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import InviteProfessorForm from '@/MxRep/Forms/Panels/Admin/InviteProfessor'
import { ArrowLeft, X } from 'lucide-react'

function InviteProfessor() {
    const navigate = useNavigate()
    const { user, isLoading, isInitialized } = useAuth()
    const [formData, setFormData] = useState(null)

    useEffect(() => {
        if (!isInitialized || isLoading || !user) {
            return
        }
    }, [isInitialized, isLoading, user])

    const handleBack = () => {
        const slug = user?.institution?.slug
        navigate(`/mxrep/${slug}/admin-panel/manage-professors`)
    }

    const handleSendInvite = (data) => {
        console.log("Sending invite to professor with data:", data)
        setFormData(data)
        // TODO: Implement invite logic
        // After successful invite, navigate back
        // handleBack()
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
        <div className='w-full px-6 py-8'>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-2">
                    <div className='flex items-start gap-4'>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleBack}
                            className="mt-1 h-8 w-8 text-slate-600 hover:text-slate-900"
                        >
                            <ArrowLeft className="h-5 w-5" />
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
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
            </div>

            <div className='max-w-5xl mx-auto'>
                {/* Form Section */}
                <InviteProfessorForm 
                    institutionName={user.institution?.name || 'Your Institution'}
                    onSendInvite={handleSendInvite}
                />
            </div>
        </div>
    )
}

export default InviteProfessor