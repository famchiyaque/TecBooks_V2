import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetProfessor } from '@/MxRep/utils/hooks/admin.hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatusBadge from '@/MxRep/Components/Panels/Common/StatusBadge'
import Loader from '@/Global Components/Loader'
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  ShieldCheck, 
  AlertCircle,
  Mail,
  User,
  BookOpen,
  Users,
  Gamepad2
} from 'lucide-react'

function Professor() {
  const { professorId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const { professor, professorIsLoading, error, getProfessor, updateProfessor, toggleAdminStatus } = useGetProfessor()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstNames: '',
    lastNames: '',
    email: ''
  })
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!isInitialized || authLoading || !user) return
    
    if (professorId) {
      getProfessor(professorId)
    }
  }, [isInitialized, authLoading, user, professorId, getProfessor])

  useEffect(() => {
    if (professor) {
      setFormData({
        firstNames: professor.firstNames || '',
        lastNames: professor.lastNames || '',
        email: professor.email || ''
      })
    }
  }, [professor])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/admin-panel/manage-professors`)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSaveError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaveError(null)
    // Reset form data to original professor data
    if (professor) {
      setFormData({
        firstNames: professor.firstNames || '',
        lastNames: professor.lastNames || '',
        email: professor.email || ''
      })
    }
  }

  const handleSave = async () => {
    setSaveError(null)
    const result = await updateProfessor(professorId, formData)
    
    if (result.success) {
      setIsEditing(false)
    } else {
      setSaveError(result.error)
    }
  }

  const handleToggleAdmin = async () => {
    await toggleAdminStatus(professorId)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isInitialized || authLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (professorIsLoading && !professor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading professor details..." />
      </div>
    )
  }

  if (error && !professor) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading professor: {error}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Professors
        </Button>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <p>Professor not found</p>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Professors
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-4 -ml-2 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Professors
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              {professor.firstNames?.[0]}{professor.lastNames?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {professor.firstNames} {professor.lastNames}
              </h1>
              <p className="text-slate-600 mt-1">{professor.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {professor.needsToConfigurePass ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Needs Finishing
              </span>
            ) : (
              <StatusBadge isActive={true} size="md" />
            )}
            {!professor.isAdmin && (
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10"
                onClick={handleToggleAdmin}
                title="Grant admin privileges"
              >
                <ShieldCheck className="h-4 w-4" />
              </Button>
            )}
            {!isEditing ? (
              <Button onClick={handleEdit} className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2" disabled={professorIsLoading}>
                  <Save className="h-4 w-4" />
                  {professorIsLoading ? 'Saving...' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Save Error Alert */}
      {saveError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error saving changes: {saveError}</AlertDescription>
        </Alert>
      )}

      {/* Content Section */}
      <div className="space-y-6">
        {/* Stats Cards - Placeholder for future stats */}
        {(professor.numClasses !== undefined || professor.numGroups !== undefined || professor.numGames !== undefined) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {professor.numClasses !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">{professor.numClasses || 0}</p>
                </CardContent>
              </Card>
            )}

            {professor.numGroups !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">{professor.numGroups || 0}</p>
                </CardContent>
              </Card>
            )}

            {professor.numGames !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">{professor.numGames || 0}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Professor Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Professor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Names */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  First Name(s)
                </label>
                <Input
                  name="firstNames"
                  value={formData.firstNames}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>

              {/* Last Names */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Last Name(s)
                </label>
                <Input
                  name="lastNames"
                  value={formData.lastNames}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>
            </div>

            {/* Additional Info - Read Only */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Professor ID:</span>
                  <span className="ml-2 text-slate-900 font-medium">{professor.id}</span>
                </div>
                {professor.department && (
                  <div>
                    <span className="text-slate-500">Department:</span>
                    <span className="ml-2 text-slate-900 font-medium">{professor.department}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Status:</span>
                  <span className="ml-2">
                    {professor.needsToConfigurePass ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Needs Finishing
                      </span>
                    ) : (
                      <StatusBadge isActive={true} size="sm" />
                    )}
                  </span>
                </div>
                {professor.isAdmin !== undefined && (
                  <div>
                    <span className="text-slate-500">Admin:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                      professor.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {professor.isAdmin ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Professor