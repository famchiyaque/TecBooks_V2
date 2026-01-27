import React, { useEffect } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetInstitutionProfessors } from '@/MxRep/utils/hooks/admin.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CardProfessor from '@/MxRep/Components/Panels/Admin/CardProfessor'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Filter, Settings, AlertCircle } from 'lucide-react'

function ManageProfessors() {
    const navigate = useNavigate()
    const { user, isLoading, isInitialized } = useAuth()
    const { professors, professorsIsLoading, error, getInstitutionProfessors } = useGetInstitutionProfessors()

    useEffect(() => {
        if (!isInitialized || isLoading || !user) {
            return
        }

        console.log("[MANAGE PROFESSORS] getting institution professors, user: ", user)
        if (user.institution) {
            console.log("[MANAGE PROFESSORS] getting institution professors for institution: ", user.institution)
            getInstitutionProfessors(user.institution.institutionId)
        }
    }, [isInitialized, isLoading, user])

    const handleProfessorClick = (professor) => {
        const slug = user.institution?.slug
        navigate(`/mxrep/${slug}/admin-panel/manage-professors/${professor.id}`)
    }

    const navigateToInviteProfessor = () => {
        const slug = user.institution?.slug
        navigate(`/mxrep/${slug}/admin-panel/invite-professor`)
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
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className='text-left'>
                        <h1 className="text-3xl font-bold text-slate-900">Professors</h1>
                        <p className="text-slate-600 mt-1">
                            Manage your institution's professors and their permissions
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="h-10 w-10"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                        <Button 
                            onClick={navigateToInviteProfessor}
                            className="gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Invite Professor
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="h-10 w-10"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                {/* Loading State */}
                {professorsIsLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader message="Loading professors..." />
                    </div>
                )}

                {/* Error State */}
                {error && !professorsIsLoading && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Error loading professors: {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Empty State */}
                {!professorsIsLoading && !error && professors?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <UserPlus className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No professors yet</h3>
                        <p className="text-slate-600 text-center mb-6 max-w-sm">
                            Get started by inviting professors to join your institution
                        </p>
                        <Button onClick={navigateToInviteProfessor} className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Invite Your First Professor
                        </Button>
                    </div>
                )}

                {/* Professors Grid */}
                {!professorsIsLoading && professors && professors.length > 0 && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-slate-600">
                                Showing {professors.length} professor{professors.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-6">
                            {professors.map((professor) => (
                                <div key={professor.id} className="flex-1 min-w-[300px] max-w-[400px]">
                                    <CardProfessor 
                                        professor={professor}
                                        onClick={() => handleProfessorClick(professor)}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ManageProfessors