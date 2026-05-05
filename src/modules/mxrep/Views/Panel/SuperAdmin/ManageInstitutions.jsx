import React, { useEffect } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetAllInstitutions } from '@/MxRep/utils/hooks/superadmin.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CardInstitution from '@/MxRep/Components/Panels/SuperAdmin/CardInstitution'
import Loader from '@/components/global/Loader'
import { useNavigate } from 'react-router-dom'
import { Filter, Settings, AlertCircle, Building2 } from 'lucide-react'

function ManageInstitutions() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { institutions, institutionsIsLoading, error, getAllInstitutions } = useGetAllInstitutions()

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    console.log("[MANAGE INSTITUTIONS] getting all institutions, user: ", user)
    getAllInstitutions()
  }, [isInitialized, isLoading, user, getAllInstitutions])

  const handleInstitutionClick = (institution) => {
    navigate(`${institution.id}`)
  }

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-3xl font-bold text-slate-900">Manage Institutions</h1>
            <p className="text-slate-600 mt-1">
              View and manage all registered institutions
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
        {institutionsIsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading institutions..." />
          </div>
        )}

        {/* Error State */}
        {error && !institutionsIsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading institutions: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!institutionsIsLoading && !error && institutions?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No institutions yet</h3>
            <p className="text-slate-600 text-center mb-6 max-w-sm">
              No institutions have been registered yet.
            </p>
          </div>
        )}

        {/* Institutions Grid */}
        {!institutionsIsLoading && institutions && institutions.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                Showing {institutions.length} institution{institutions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              {institutions.map((institution) => (
                <div key={institution.id} className="w-[calc(33.333%-16px)] min-w-[300px]">
                  <CardInstitution 
                    institution={institution}
                    onClick={() => handleInstitutionClick(institution)}
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

export default ManageInstitutions

