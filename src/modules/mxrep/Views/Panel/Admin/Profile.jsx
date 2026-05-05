import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetAdminProfile } from '@/MxRep/utils/hooks/admin.hooks'
import Loader from '@/components/global/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ProfileForm from '@/MxRep/Forms/Panels/Admin/Profile'
import { AlertCircle, X } from 'lucide-react'

function Profile() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getAdminProfile, updateAdminProfile, profileIsLoading, error, profile } = useGetAdminProfile()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[PROFILE VIEW] getting admin profile for userId: ", user.userId)
    getAdminProfile(user.userId)
  }, [isInitialized, isLoading, user, getAdminProfile])

  const handleCancel = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/admin-panel/manage-professors`)
  }

  const handleSave = async (data) => {
    console.log("Saving profile with data:", data)
    setIsSaving(true)
    
    const result = await updateAdminProfile(user.userId, data)
    setIsSaving(false)

    if (result.success) {
      alert('Profile updated successfully!')
      // Optionally refresh the profile data
      getAdminProfile(user.userId)
    } else {
      alert(`Failed to update profile: ${result.error}`)
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

  if (profileIsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading profile..." />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Failed to load profile'}</AlertDescription>
        </Alert>
        <Button onClick={handleCancel} className="mt-4 gap-2">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className='w-full px-6 py-4 h-[calc(100vh-4rem)] overflow-y-auto'>
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Manage your account and institution information
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
              size="sm"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-4" />
      </div>

      {/* Form Section */}
      <div className='max-w-5xl mx-auto pb-8'>
        <ProfileForm 
          profileData={profile}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}

export default Profile