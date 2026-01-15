import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, X, User, Mail } from 'lucide-react'

function Profile() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const [error, setError] = useState(null)

  const handleCancel = () => {
    navigate(`/mxrep/super-admin-panel/manage-institutions`)
  }

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div className='w-full px-6 py-4 h-[calc(100vh-4rem)] overflow-y-auto'>
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Manage your super-admin account information
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

      {/* Profile Section */}
      <div className='max-w-5xl mx-auto pb-8'>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Name</p>
                <p className="text-base font-medium text-slate-900">
                  {user.firstNames} {user.lastNames}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-base font-medium text-slate-900">{user.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Role</p>
                <p className="text-base font-medium text-slate-900 capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile

