import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/components/global/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import InviteProfessorForm from '@/MxRep/Forms/Panels/Admin/InviteProfessor'
import { adminService } from '@/MxRep/utils/services/admin.service'
import { ArrowLeft, X, CheckCircle, AlertCircle } from 'lucide-react'

function InviteProfessor() {
    const navigate = useNavigate()
    const { user, isLoading, isInitialized, token } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    useEffect(() => {
        if (!isInitialized || isLoading || !user) {
            return
        }
    }, [isInitialized, isLoading, user])

    const handleBack = () => {
        const slug = user?.institution?.slug
        navigate(`/mxrep/${slug}/admin-panel/manage-professors`)
    }

    const handleSendInvite = async (data) => {
        console.log("Sending invite to professor with data:", data)
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        try {
            const response = await adminService.inviteProfessor(data, token)
            console.log("Invite professor response:", response)
            
            if (response.success) {
                setSubmitSuccess(true)
            } else {
                throw new Error(response.message || "Failed to send invitation")
            }
        } catch (err) {
            console.error("Error inviting professor:", err)
            setSubmitError(err.message || "Failed to send invitation. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
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
                {/* Success Message */}
                {submitSuccess && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    <div className="font-semibold mb-2">Invitation sent successfully!</div>
                                    <p className="text-sm">
                                        An invitation email has been sent to the professor. They will receive instructions on how to complete their registration.
                                    </p>
                                </AlertDescription>
                            </Alert>
                            <div className="mt-6 flex justify-end">
                                <Button onClick={handleBack} className="gap-2">
                                    Back to Professors
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Error Message */}
                {submitError && !submitSuccess && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                {/* Form Section */}
                {!submitSuccess && (
                    <InviteProfessorForm 
                        institutionName={user.institution?.name || 'Your Institution'}
                        onSendInvite={handleSendInvite}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    )
}

export default InviteProfessor