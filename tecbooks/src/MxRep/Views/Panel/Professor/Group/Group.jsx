import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetGroup } from '@/MxRep/utils/hooks/professor.hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, MenuItem, InputLabel, FormControl as MUIFormControl } from '@mui/material'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Loader from '@/Global Components/Loader'
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  Users,
  Calendar,
  Hash
} from 'lucide-react'

function Group() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const { group, groupIsLoading, error, getGroup, updateGroup } = useGetGroup()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    groupCode: '',
    classId: '',
    semester: '',
    subperiod: ''
  })
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!isInitialized || authLoading || !user) return
    
    if (groupId) {
      getGroup(groupId)
    }
  }, [isInitialized, authLoading, user, groupId, getGroup])

  useEffect(() => {
    if (group) {
      setFormData({
        groupCode: group.groupCode || '',
        classId: group.classId || '',
        semester: group.semester || '',
        subperiod: group.subperiod || ''
      })
    }
  }, [group])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-groups`)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSaveError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaveError(null)
    if (group) {
      setFormData({
        groupCode: group.groupCode || '',
        classId: group.classId || '',
        semester: group.semester || '',
        subperiod: group.subperiod || ''
      })
    }
  }

  const handleSave = async () => {
    setSaveError(null)
    const result = await updateGroup(groupId, formData)
    
    if (result.success) {
      setIsEditing(false)
    } else {
      setSaveError(result.error)
    }
  }

  const subperiodOptions = ['1', '2', '3', '1-2', '1-3', '2-3']

  const getSemesterOptions = () => {
    const options = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      options.push(`Feb-Jun-${year}`)
      options.push(`Aug-Dec-${year}`)
    }
    
    return options
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

  if (groupIsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader message="Loading group..." />
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Group not found'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
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
                {isEditing ? 'Edit Group' : group.groupCode}
              </h1>
              <p className="text-slate-600 mt-1">
                {group.className}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button 
                variant="outline"
                onClick={handleEdit}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
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
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-slate-900">{group.semester}</p>
            <p className="text-sm text-slate-600">Period {group.subperiod}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {group.numStudents || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(group.createdAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Group Information
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
            {/* Group Code */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Group Code
              </label>
              {isEditing ? (
                <Input
                  name="groupCode"
                  value={formData.groupCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, groupCode: e.target.value }))}
                  placeholder="Enter group code"
                />
              ) : (
                <p className="text-slate-900 py-2 font-mono">{group.groupCode}</p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Semester
              </label>
              {isEditing ? (
                <MUIFormControl fullWidth>
                  <InputLabel id="semester-select-label">Select Semester</InputLabel>
                  <Select
                    labelId="semester-select-label"
                    value={formData.semester}
                    label="Select Semester"
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  >
                    {getSemesterOptions().map((semester) => (
                      <MenuItem key={semester} value={semester}>
                        {semester}
                      </MenuItem>
                    ))}
                  </Select>
                </MUIFormControl>
              ) : (
                <p className="text-slate-900 py-2">{group.semester}</p>
              )}
            </div>

            {/* Subperiod */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Subperiod
              </label>
              {isEditing ? (
                <MUIFormControl fullWidth>
                  <InputLabel id="subperiod-select-label">Select Subperiod</InputLabel>
                  <Select
                    labelId="subperiod-select-label"
                    value={formData.subperiod}
                    label="Select Subperiod"
                    onChange={(e) => setFormData(prev => ({ ...prev, subperiod: e.target.value }))}
                  >
                    {subperiodOptions.map((period) => (
                      <MenuItem key={period} value={period}>
                        {period}
                      </MenuItem>
                    ))}
                  </Select>
                </MUIFormControl>
              ) : (
                <p className="text-slate-900 py-2">Period {group.subperiod}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Group
