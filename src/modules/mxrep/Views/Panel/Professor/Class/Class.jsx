import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetClass } from '@/MxRep/utils/hooks/professor.hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/components/global/Loader'
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  BookOpen,
  Users,
  Plus
} from 'lucide-react'

function Class() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const { classData, classIsLoading, error, getClass, updateClass } = useGetClass()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!isInitialized || authLoading || !user) return
    
    if (classId) {
      getClass(classId)
    }
  }, [isInitialized, authLoading, user, classId, getClass])

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name || '',
        code: classData.code || '',
        description: classData.description || ''
      })
    }
  }, [classData])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-classes`)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSaveError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaveError(null)
    if (classData) {
      setFormData({
        name: classData.name || '',
        code: classData.code || '',
        description: classData.description || ''
      })
    }
  }

  const handleSave = async () => {
    setSaveError(null)
    const result = await updateClass(classId, formData)
    
    if (result.success) {
      setIsEditing(false)
    } else {
      setSaveError(result.error)
    }
  }

  const handleAddGroup = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/create-group?classId=${classId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (!isInitialized || authLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (classIsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader message="Loading class..." />
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Class not found'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
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
              <h1 className="text-3xl font-bold text-slate-900">
                {isEditing ? 'Edit Class' : classData.name}
              </h1>
              <p className="text-slate-600 mt-1">
                {classData.code}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button 
                  onClick={handleAddGroup}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Group
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {formatDate(classData.createdAt)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {classData.numGroups || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Class Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {saveError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {saveError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Class Name */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Class Name
              </label>
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter class name"
                />
              ) : (
                <p className="text-slate-900 py-2">{classData.name}</p>
              )}
            </div>

            {/* Class Code */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Class Code
              </label>
              {isEditing ? (
                <Input
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter class code"
                />
              ) : (
                <p className="text-slate-900 py-2 font-mono">{classData.code}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Description
              </label>
              {isEditing ? (
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter class description"
                  className="resize-none h-24"
                />
              ) : (
                <p className="text-slate-600 py-2">
                  {classData.description || 'No description provided'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Class
